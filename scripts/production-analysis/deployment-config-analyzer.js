#!/usr/bin/env node

/**
 * Deployment Configuration Analyzer
 * 
 * This script analyzes and compares deployment configurations between
 * local development and production environments to identify discrepancies
 * that may cause visual or functional differences.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class DeploymentConfigAnalyzer {
  constructor() {
    this.analysis = {
      nextConfig: {},
      packageJson: {},
      vercelConfig: {},
      environmentVars: {},
      buildProcess: {},
      differences: [],
      recommendations: []
    };
  }

  async analyzeAll() {
    console.log('🔍 Starting deployment configuration analysis...\n');
    
    try {
      await this.analyzeNextConfig();
      await this.analyzePackageJson();
      await this.analyzeVercelConfig();
      await this.analyzeEnvironmentVariables();
      await this.analyzeBuildProcess();
      await this.identifyDifferences();
      await this.generateReport();
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      process.exit(1);
    }
  }

  async analyzeNextConfig() {
    console.log('📋 Analyzing Next.js configuration...');
    
    const nextConfigJs = this.readFileIfExists('next.config.js');
    const nextConfigTs = this.readFileIfExists('next.config.ts');
    
    this.analysis.nextConfig = {
      hasJsConfig: !!nextConfigJs,
      hasTsConfig: !!nextConfigTs,
      conflictingConfigs: !!(nextConfigJs && nextConfigTs),
      jsConfig: nextConfigJs ? this.parseNextConfig(nextConfigJs) : null,
      tsConfig: nextConfigTs ? this.parseNextConfig(nextConfigTs) : null
    };

    if (this.analysis.nextConfig.conflictingConfigs) {
      this.analysis.differences.push({
        type: 'configuration',
        severity: 'high',
        issue: 'Conflicting Next.js configuration files',
        description: 'Both next.config.js and next.config.ts exist, which may cause unpredictable behavior',
        impact: 'Build process may use unexpected configuration',
        recommendation: 'Remove one of the configuration files and consolidate settings'
      });
    }
  }

  parseNextConfig(content) {
    try {
      // Extract key configuration properties
      const config = {
        images: this.extractConfigSection(content, 'images'),
        headers: this.extractConfigSection(content, 'headers'),
        redirects: this.extractConfigSection(content, 'redirects'),
        webpack: content.includes('webpack:'),
        reactStrictMode: content.includes('reactStrictMode'),
        compress: content.includes('compress'),
        distDir: this.extractSimpleValue(content, 'distDir'),
        env: this.extractConfigSection(content, 'env')
      };
      return config;
    } catch (error) {
      console.warn('⚠️  Could not parse Next.js config:', error.message);
      return { parseError: error.message };
    }
  }

  extractConfigSection(content, section) {
    const regex = new RegExp(`${section}\\s*:\\s*([\\s\\S]*?)(?=,\\s*\\w+:|\\}\\s*$)`, 'i');
    const match = content.match(regex);
    return match ? match[1].trim() : null;
  }

  extractSimpleValue(content, key) {
    const regex = new RegExp(`${key}\\s*:\\s*['"]([^'"]+)['"]`, 'i');
    const match = content.match(regex);
    return match ? match[1] : null;
  }

  async analyzePackageJson() {
    console.log('📦 Analyzing package.json configuration...');
    
    const packageJson = this.readJsonFile('package.json');
    
    this.analysis.packageJson = {
      name: packageJson.name,
      version: packageJson.version,
      scripts: packageJson.scripts,
      dependencies: Object.keys(packageJson.dependencies || {}),
      devDependencies: Object.keys(packageJson.devDependencies || {}),
      buildScript: packageJson.scripts?.build,
      startScript: packageJson.scripts?.start,
      devScript: packageJson.scripts?.dev,
      nodeVersion: this.extractNodeVersion(),
      hasPostBuild: !!packageJson.scripts?.['post-build']
    };

    // Check for potential issues
    if (!this.analysis.packageJson.buildScript) {
      this.analysis.differences.push({
        type: 'build',
        severity: 'high',
        issue: 'Missing build script',
        description: 'No build script defined in package.json',
        impact: 'Deployment may fail or use default build process',
        recommendation: 'Add "build": "next build" to scripts section'
      });
    }
  }

  extractNodeVersion() {
    try {
      const nodeVersion = execSync('node --version', { encoding: 'utf8' }).trim();
      return nodeVersion;
    } catch (error) {
      return 'unknown';
    }
  }

  async analyzeVercelConfig() {
    console.log('🚀 Analyzing Vercel configuration...');
    
    const vercelJson = this.readJsonFile('vercel.json');
    const vercelProject = this.readJsonFile('.vercel/project.json');
    
    this.analysis.vercelConfig = {
      hasVercelJson: !!vercelJson,
      hasProjectConfig: !!vercelProject,
      vercelJson: vercelJson,
      projectConfig: vercelProject,
      deploymentInfo: await this.getVercelDeploymentInfo()
    };

    // Compare configurations
    if (vercelJson && vercelProject) {
      this.compareVercelConfigs(vercelJson, vercelProject);
    }
  }

  compareVercelConfigs(vercelJson, projectConfig) {
    const conflicts = [];
    
    // Check framework mismatch
    if (vercelJson.framework && projectConfig.settings?.framework) {
      if (vercelJson.framework !== projectConfig.settings.framework) {
        conflicts.push({
          property: 'framework',
          vercelJson: vercelJson.framework,
          projectConfig: projectConfig.settings.framework
        });
      }
    }

    // Check build command mismatch
    if (vercelJson.buildCommand && projectConfig.settings?.buildCommand) {
      if (vercelJson.buildCommand !== projectConfig.settings.buildCommand) {
        conflicts.push({
          property: 'buildCommand',
          vercelJson: vercelJson.buildCommand,
          projectConfig: projectConfig.settings.buildCommand
        });
      }
    }

    if (conflicts.length > 0) {
      this.analysis.differences.push({
        type: 'configuration',
        severity: 'medium',
        issue: 'Vercel configuration conflicts',
        description: 'Conflicting settings between vercel.json and project configuration',
        conflicts: conflicts,
        impact: 'Deployment may use unexpected settings',
        recommendation: 'Align vercel.json with project configuration or vice versa'
      });
    }
  }

  async getVercelDeploymentInfo() {
    try {
      const deployments = execSync('vercel ls --json', { encoding: 'utf8' });
      const deploymentData = JSON.parse(deployments);
      
      const productionDeployments = deploymentData.deployments?.filter(d => d.target === 'production') || [];
      const latestProduction = productionDeployments[0];
      
      return {
        hasDeployments: deploymentData.deployments?.length > 0,
        productionCount: productionDeployments.length,
        latestProduction: latestProduction ? {
          url: latestProduction.url,
          status: latestProduction.state,
          created: latestProduction.createdAt
        } : null
      };
    } catch (error) {
      console.warn('⚠️  Could not fetch Vercel deployment info:', error.message);
      return { error: error.message };
    }
  }

  async analyzeEnvironmentVariables() {
    console.log('🔐 Analyzing environment variables...');
    
    const envFiles = {
      '.env': this.readFileIfExists('.env'),
      '.env.local': this.readFileIfExists('.env.local'),
      '.vercel/.env.production.local': this.readFileIfExists('.vercel/.env.production.local')
    };

    this.analysis.environmentVars = {
      files: envFiles,
      localVars: this.parseEnvFile(envFiles['.env.local']),
      globalVars: this.parseEnvFile(envFiles['.env']),
      vercelVars: this.parseEnvFile(envFiles['.vercel/.env.production.local']),
      vercelEnvList: await this.getVercelEnvVars()
    };

    // Check for missing production environment variables
    this.checkEnvironmentVariables();
  }

  parseEnvFile(content) {
    if (!content) return {};
    
    const vars = {};
    const lines = content.split('\n');
    
    for (const line of lines) {
      const trimmed = line.trim();
      if (trimmed && !trimmed.startsWith('#')) {
        const [key, ...valueParts] = trimmed.split('=');
        if (key) {
          vars[key.trim()] = valueParts.join('=').trim();
        }
      }
    }
    
    return vars;
  }

  async getVercelEnvVars() {
    try {
      const envList = execSync('vercel env ls', { encoding: 'utf8' });
      return { output: envList };
    } catch (error) {
      return { error: error.message };
    }
  }

  checkEnvironmentVariables() {
    const requiredVars = [
      'NEXT_PUBLIC_SITE_URL',
      'OPENAI_API_KEY',
      'AWS_REGION',
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'S3_BUCKET_NAME'
    ];

    const missingVars = [];
    const localVars = { ...this.analysis.environmentVars.localVars, ...this.analysis.environmentVars.globalVars };

    for (const varName of requiredVars) {
      if (!localVars[varName] && !process.env[varName]) {
        missingVars.push(varName);
      }
    }

    if (missingVars.length > 0) {
      this.analysis.differences.push({
        type: 'environment',
        severity: 'high',
        issue: 'Missing environment variables',
        description: `Required environment variables are not set locally: ${missingVars.join(', ')}`,
        impact: 'Features requiring these variables may not work in local development',
        recommendation: 'Add missing environment variables to .env.local file'
      });
    }
  }

  async analyzeBuildProcess() {
    console.log('🔨 Analyzing build process...');
    
    this.analysis.buildProcess = {
      nextVersion: this.getPackageVersion('next'),
      reactVersion: this.getPackageVersion('react'),
      tailwindVersion: this.getPackageVersion('tailwindcss'),
      typescriptVersion: this.getPackageVersion('typescript'),
      nodeVersion: this.analysis.packageJson.nodeVersion,
      hasTypeScript: this.fileExists('tsconfig.json'),
      hasTailwind: this.fileExists('tailwind.config.js'),
      hasPostCSS: this.fileExists('postcss.config.js'),
      buildCommand: this.analysis.packageJson.buildScript
    };

    // Check for version mismatches or issues
    this.checkBuildDependencies();
  }

  getPackageVersion(packageName) {
    try {
      const packageJson = this.readJsonFile('package.json');
      return packageJson.dependencies?.[packageName] || packageJson.devDependencies?.[packageName] || 'not installed';
    } catch (error) {
      return 'unknown';
    }
  }

  checkBuildDependencies() {
    const criticalPackages = ['next', 'react', 'react-dom'];
    const missingPackages = [];

    for (const pkg of criticalPackages) {
      const version = this.getPackageVersion(pkg);
      if (version === 'not installed') {
        missingPackages.push(pkg);
      }
    }

    if (missingPackages.length > 0) {
      this.analysis.differences.push({
        type: 'dependencies',
        severity: 'critical',
        issue: 'Missing critical dependencies',
        description: `Critical packages are missing: ${missingPackages.join(', ')}`,
        impact: 'Application will not build or run',
        recommendation: 'Install missing dependencies with npm install'
      });
    }
  }

  async identifyDifferences() {
    console.log('🔍 Identifying configuration differences...');
    
    // Additional difference detection logic
    this.checkTailwindConfiguration();
    this.checkImageConfiguration();
    this.checkSecurityHeaders();
  }

  checkTailwindConfiguration() {
    const tailwindConfig = this.readFileIfExists('tailwind.config.js');
    
    if (tailwindConfig) {
      // Check if Tailwind config is properly configured
      if (tailwindConfig.includes('content: []')) {
        this.analysis.differences.push({
          type: 'styling',
          severity: 'high',
          issue: 'Empty Tailwind content configuration',
          description: 'Tailwind config has empty content array, which will not process any styles',
          impact: 'Tailwind styles will not be generated, causing visual differences',
          recommendation: 'Configure content paths in tailwind.config.js to include your source files'
        });
      }
    }
  }

  checkImageConfiguration() {
    const nextConfigJs = this.analysis.nextConfig.jsConfig;
    const nextConfigTs = this.analysis.nextConfig.tsConfig;
    
    const imageConfig = nextConfigJs?.images || nextConfigTs?.images;
    
    if (imageConfig) {
      // Check for different image domains between configs
      if (nextConfigJs?.images && nextConfigTs?.images) {
        this.analysis.differences.push({
          type: 'configuration',
          severity: 'medium',
          issue: 'Duplicate image configuration',
          description: 'Image configuration exists in both next.config.js and next.config.ts',
          impact: 'May cause confusion about which configuration is active',
          recommendation: 'Consolidate image configuration into single config file'
        });
      }
    }
  }

  checkSecurityHeaders() {
    const vercelJson = this.analysis.vercelConfig.vercelJson;
    const nextConfigJs = this.analysis.nextConfig.jsConfig;
    const nextConfigTs = this.analysis.nextConfig.tsConfig;
    
    const hasVercelHeaders = vercelJson?.headers?.length > 0;
    const hasNextHeaders = (nextConfigJs?.headers || nextConfigTs?.headers);
    
    if (hasVercelHeaders && hasNextHeaders) {
      this.analysis.differences.push({
        type: 'configuration',
        severity: 'medium',
        issue: 'Duplicate header configuration',
        description: 'Headers are configured in both vercel.json and Next.js config',
        impact: 'May cause conflicting or duplicate headers',
        recommendation: 'Consolidate header configuration to avoid conflicts'
      });
    }
  }

  async generateReport() {
    console.log('📊 Generating configuration analysis report...\n');
    
    const report = {
      timestamp: new Date().toISOString(),
      summary: {
        totalIssues: this.analysis.differences.length,
        criticalIssues: this.analysis.differences.filter(d => d.severity === 'critical').length,
        highIssues: this.analysis.differences.filter(d => d.severity === 'high').length,
        mediumIssues: this.analysis.differences.filter(d => d.severity === 'medium').length,
        lowIssues: this.analysis.differences.filter(d => d.severity === 'low').length
      },
      analysis: this.analysis
    };

    // Save detailed report
    const reportPath = 'analysis/deployment-configuration-analysis.json';
    this.ensureDirectoryExists(path.dirname(reportPath));
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));

    // Generate markdown summary
    await this.generateMarkdownReport(report);

    console.log(`✅ Analysis complete! Found ${report.summary.totalIssues} configuration issues.`);
    console.log(`📄 Detailed report saved to: ${reportPath}`);
    console.log(`📋 Summary report saved to: analysis/deployment-configuration-summary.md`);
  }

  async generateMarkdownReport(report) {
    const markdown = `# Deployment Configuration Analysis Report

Generated: ${new Date(report.timestamp).toLocaleString()}

## Summary

- **Total Issues Found:** ${report.summary.totalIssues}
- **Critical Issues:** ${report.summary.criticalIssues}
- **High Priority Issues:** ${report.summary.highIssues}
- **Medium Priority Issues:** ${report.summary.mediumIssues}
- **Low Priority Issues:** ${report.summary.lowIssues}

## Configuration Overview

### Next.js Configuration
- **Has JS Config:** ${report.analysis.nextConfig.hasJsConfig}
- **Has TS Config:** ${report.analysis.nextConfig.hasTsConfig}
- **Conflicting Configs:** ${report.analysis.nextConfig.conflictingConfigs}

### Package.json
- **Name:** ${report.analysis.packageJson.name}
- **Version:** ${report.analysis.packageJson.version}
- **Node Version:** ${report.analysis.packageJson.nodeVersion}
- **Build Script:** ${report.analysis.packageJson.buildScript || 'Not defined'}

### Vercel Configuration
- **Has vercel.json:** ${report.analysis.vercelConfig.hasVercelJson}
- **Has Project Config:** ${report.analysis.vercelConfig.hasProjectConfig}
- **Framework:** ${report.analysis.vercelConfig.vercelJson?.framework || 'Not specified'}

### Build Process
- **Next.js Version:** ${report.analysis.buildProcess.nextVersion}
- **React Version:** ${report.analysis.buildProcess.reactVersion}
- **TypeScript:** ${report.analysis.buildProcess.hasTypeScript}
- **Tailwind CSS:** ${report.analysis.buildProcess.hasTailwind}

## Issues Found

${report.analysis.differences.map((diff, index) => `
### ${index + 1}. ${diff.issue} (${diff.severity.toUpperCase()})

**Type:** ${diff.type}
**Description:** ${diff.description}
**Impact:** ${diff.impact}
**Recommendation:** ${diff.recommendation}
${diff.conflicts ? `
**Conflicts:**
${diff.conflicts.map(c => `- ${c.property}: vercel.json="${c.vercelJson}" vs project="${c.projectConfig}"`).join('\n')}
` : ''}
`).join('\n')}

## Recommendations

### Immediate Actions Required
${report.analysis.differences
  .filter(d => d.severity === 'critical' || d.severity === 'high')
  .map(d => `- ${d.recommendation}`)
  .join('\n')}

### Configuration Improvements
${report.analysis.differences
  .filter(d => d.severity === 'medium')
  .map(d => `- ${d.recommendation}`)
  .join('\n')}

## Next Steps

1. Address critical and high-priority issues first
2. Test local build after each configuration change
3. Compare local build output with production
4. Update deployment configuration as needed
5. Document any configuration changes made

---

*This report was generated automatically by the Deployment Configuration Analyzer.*
`;

    fs.writeFileSync('analysis/deployment-configuration-summary.md', markdown);
  }

  // Utility methods
  readFileIfExists(filePath) {
    try {
      return fs.readFileSync(filePath, 'utf8');
    } catch (error) {
      return null;
    }
  }

  readJsonFile(filePath) {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      return JSON.parse(content);
    } catch (error) {
      return null;
    }
  }

  fileExists(filePath) {
    return fs.existsSync(filePath);
  }

  ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }
}

// Run the analyzer if called directly
if (require.main === module) {
  const analyzer = new DeploymentConfigAnalyzer();
  analyzer.analyzeAll().catch(console.error);
}

module.exports = DeploymentConfigAnalyzer;