#!/usr/bin/env node

/**
 * CSS Framework and Styling Analysis Tool
 * Compares Tailwind CSS configuration between local and production
 * Analyzes custom CSS files and their loading order
 * Identifies missing or conflicting style rules
 * Creates migration plan for styling discrepancies
 */

const fs = require('fs');
const path = require('path');
const CSSAnalyzer = require('./css-analyzer');

class CSSFrameworkAnalyzer {
  constructor() {
    this.productionDataPath = path.join(__dirname, '../../analysis/production-data');
    this.localDataPath = path.join(__dirname, '../../analysis/local-data');
    this.comparisonPath = path.join(__dirname, '../../analysis/comparison');
    this.rootPath = path.join(__dirname, '../..');
    
    this.analysis = {
      tailwindComparison: {},
      customCSSComparison: {},
      frameworkDetection: {},
      styleConflicts: [],
      missingStyles: [],
      loadingOrderIssues: [],
      migrationPlan: []
    };
  }

  async analyzeTailwindConfiguration() {
    console.log('🎨 Analyzing Tailwind CSS configuration...\n');
    
    const tailwindComparison = {
      local: this.analyzeTailwindConfig(),
      production: this.inferProductionTailwindConfig(),
      differences: []
    };

    // Compare configurations
    this.compareTailwindConfigs(tailwindComparison);
    
    this.analysis.tailwindComparison = tailwindComparison;
    return tailwindComparison;
  }

  analyzeTailwindConfig() {
    const configPath = path.join(this.rootPath, 'tailwind.config.js');
    
    if (!fs.existsSync(configPath)) {
      return { exists: false, error: 'No tailwind.config.js found' };
    }

    try {
      const configContent = fs.readFileSync(configPath, 'utf8');
      
      // Parse basic configuration structure
      const config = {
        exists: true,
        content: configContent,
        hasContent: /content:\s*\[/.test(configContent),
        hasTheme: /theme:\s*\{/.test(configContent),
        hasPlugins: /plugins:\s*\[/.test(configContent),
        contentPaths: this.extractContentPaths(configContent),
        themeExtensions: this.extractThemeExtensions(configContent),
        plugins: this.extractPlugins(configContent)
      };

      return config;
    } catch (error) {
      return { exists: true, error: error.message };
    }
  }

  extractContentPaths(configContent) {
    const contentMatch = configContent.match(/content:\s*\[([\s\S]*?)\]/);
    if (!contentMatch) return [];
    
    const contentString = contentMatch[1];
    const paths = contentString.match(/'([^']+)'|"([^"]+)"/g) || [];
    return paths.map(path => path.replace(/['"]/g, ''));
  }

  extractThemeExtensions(configContent) {
    const themeMatch = configContent.match(/theme:\s*\{([\s\S]*?)\}/);
    if (!themeMatch) return {};
    
    const themeContent = themeMatch[1];
    const extendMatch = themeContent.match(/extend:\s*\{([\s\S]*?)\}/);
    
    if (!extendMatch) return {};
    
    // Basic parsing - could be enhanced for more complex configurations
    return {
      hasExtensions: extendMatch[1].trim().length > 0,
      content: extendMatch[1]
    };
  }

  extractPlugins(configContent) {
    const pluginsMatch = configContent.match(/plugins:\s*\[([\s\S]*?)\]/);
    if (!pluginsMatch) return [];
    
    const pluginsString = pluginsMatch[1];
    // Extract plugin names/requires
    const plugins = pluginsString.match(/require\(['"]([^'"]+)['"]\)/g) || [];
    return plugins.map(plugin => plugin.match(/require\(['"]([^'"]+)['"]\)/)[1]);
  }

  inferProductionTailwindConfig() {
    // Analyze production CSS to infer Tailwind usage
    const productionCSSPath = path.join(this.productionDataPath, 'metadata/css-analysis.json');
    
    if (!fs.existsSync(productionCSSPath)) {
      return { exists: false, error: 'No production CSS analysis found' };
    }

    try {
      const cssAnalysis = JSON.parse(fs.readFileSync(productionCSSPath, 'utf8'));
      
      const tailwindInference = {
        exists: cssAnalysis.frameworks.includes('Tailwind CSS'),
        detectedFromCSS: true,
        utilityClasses: this.extractTailwindUtilities(cssAnalysis),
        customProperties: cssAnalysis.customProperties || [],
        mediaQueries: cssAnalysis.mediaQueries || []
      };

      return tailwindInference;
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  extractTailwindUtilities(cssAnalysis) {
    const utilities = new Set();
    
    // Look for common Tailwind utility patterns in selectors
    const tailwindPatterns = [
      /^\.text-/, /^\.bg-/, /^\.border-/, /^\.p-/, /^\.m-/, /^\.w-/, /^\.h-/,
      /^\.flex/, /^\.grid/, /^\.hidden/, /^\.block/, /^\.inline/,
      /^\.rounded/, /^\.shadow/, /^\.opacity-/, /^\.transform/
    ];

    if (cssAnalysis.selectorsCount) {
      Object.keys(cssAnalysis.selectorsCount).forEach(selector => {
        tailwindPatterns.forEach(pattern => {
          if (pattern.test(selector)) {
            utilities.add(selector);
          }
        });
      });
    }

    return Array.from(utilities);
  }

  compareTailwindConfigs(comparison) {
    const { local, production } = comparison;
    const differences = [];

    // Check if Tailwind is used in production but not configured locally
    if (production.exists && !local.exists) {
      differences.push({
        type: 'missing_config',
        severity: 'critical',
        description: 'Production uses Tailwind CSS but no local configuration found',
        recommendation: 'Create tailwind.config.js with proper configuration'
      });
    }

    // Check content paths configuration
    if (local.exists && local.contentPaths.length === 0) {
      differences.push({
        type: 'empty_content',
        severity: 'critical',
        description: 'Tailwind content array is empty - no files will be processed',
        recommendation: 'Add content paths to include all template files'
      });
    }

    // Check for utility classes in production that might need configuration
    if (production.utilityClasses && production.utilityClasses.length > 0) {
      differences.push({
        type: 'utility_usage',
        severity: 'medium',
        description: `Production uses ${production.utilityClasses.length} Tailwind utility classes`,
        recommendation: 'Ensure local Tailwind configuration supports all used utilities',
        details: production.utilityClasses.slice(0, 20) // Show first 20 as examples
      });
    }

    comparison.differences = differences;
  }

  async analyzeCustomCSS() {
    console.log('📝 Analyzing custom CSS files...\n');
    
    const customCSSComparison = {
      local: await this.analyzeLocalCustomCSS(),
      production: await this.analyzeProductionCustomCSS(),
      differences: []
    };

    // Compare custom CSS
    this.compareCustomCSS(customCSSComparison);
    
    this.analysis.customCSSComparison = customCSSComparison;
    return customCSSComparison;
  }

  async analyzeLocalCustomCSS() {
    const localCSSPath = path.join(this.localDataPath, 'metadata/local-css-analysis.json');
    
    if (!fs.existsSync(localCSSPath)) {
      return { exists: false, error: 'No local CSS analysis found' };
    }

    try {
      const cssData = JSON.parse(fs.readFileSync(localCSSPath, 'utf8'));
      
      return {
        exists: true,
        buildCSS: cssData.buildCSS || [],
        customCSS: cssData.customCSS || [],
        totalFiles: (cssData.buildCSS || []).length + (cssData.customCSS || []).length,
        totalSize: this.calculateTotalSize(cssData.buildCSS, cssData.customCSS),
        loadingOrder: this.inferLoadingOrder(cssData)
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  async analyzeProductionCustomCSS() {
    const productionCSSPath = path.join(this.productionDataPath, 'metadata/css-analysis.json');
    
    if (!fs.existsSync(productionCSSPath)) {
      return { exists: false, error: 'No production CSS analysis found' };
    }

    try {
      const cssData = JSON.parse(fs.readFileSync(productionCSSPath, 'utf8'));
      
      return {
        exists: true,
        files: cssData.files || [],
        totalFiles: cssData.summary?.totalFiles || 0,
        totalSize: cssData.summary?.totalSize || 0,
        frameworks: cssData.frameworks || [],
        selectors: cssData.selectorsCount || {},
        properties: cssData.propertiesCount || {}
      };
    } catch (error) {
      return { exists: false, error: error.message };
    }
  }

  calculateTotalSize(buildCSS = [], customCSS = []) {
    const buildSize = buildCSS.reduce((sum, file) => sum + (file.size || 0), 0);
    const customSize = customCSS.reduce((sum, file) => sum + (file.size || 0), 0);
    return buildSize + customSize;
  }

  inferLoadingOrder(cssData) {
    const order = [];
    
    // Custom CSS typically loads first
    if (cssData.customCSS) {
      cssData.customCSS.forEach(file => {
        order.push({ type: 'custom', name: file.name, path: file.path });
      });
    }
    
    // Build CSS loads after
    if (cssData.buildCSS) {
      cssData.buildCSS.forEach(file => {
        order.push({ type: 'build', name: file.name, path: file.path });
      });
    }
    
    return order;
  }

  compareCustomCSS(comparison) {
    const { local, production } = comparison;
    const differences = [];

    // Compare file counts
    if (local.exists && production.exists) {
      if (local.totalFiles !== production.totalFiles) {
        differences.push({
          type: 'file_count_mismatch',
          severity: 'medium',
          description: `Different number of CSS files: local (${local.totalFiles}) vs production (${production.totalFiles})`,
          recommendation: 'Verify all CSS files are being built and loaded correctly'
        });
      }

      // Compare total sizes
      const sizeDifference = Math.abs(local.totalSize - production.totalSize);
      const sizeThreshold = 10000; // 10KB threshold
      
      if (sizeDifference > sizeThreshold) {
        differences.push({
          type: 'size_mismatch',
          severity: 'medium',
          description: `Significant size difference: ${(sizeDifference / 1024).toFixed(2)}KB`,
          recommendation: 'Check for missing or extra CSS rules',
          details: {
            local: `${(local.totalSize / 1024).toFixed(2)}KB`,
            production: `${(production.totalSize / 1024).toFixed(2)}KB`
          }
        });
      }
    }

    comparison.differences = differences;
  }

  async identifyStyleConflicts() {
    console.log('⚠️  Identifying style conflicts...\n');
    
    const conflicts = [];
    
    // Load both CSS analyses
    const localAnalysis = await this.loadLocalCSSAnalysis();
    const productionAnalysis = await this.loadProductionCSSAnalysis();
    
    if (localAnalysis && productionAnalysis) {
      // Check for conflicting selectors
      conflicts.push(...this.findSelectorConflicts(localAnalysis, productionAnalysis));
      
      // Check for property conflicts
      conflicts.push(...this.findPropertyConflicts(localAnalysis, productionAnalysis));
    }
    
    this.analysis.styleConflicts = conflicts;
    return conflicts;
  }

  async loadLocalCSSAnalysis() {
    try {
      // Analyze local CSS files directly
      const analyzer = new CSSAnalyzer(path.join(this.localDataPath, 'css'));
      return analyzer.analyzeAllCSS();
    } catch (error) {
      console.warn('Could not analyze local CSS:', error.message);
      return null;
    }
  }

  async loadProductionCSSAnalysis() {
    try {
      const analysisPath = path.join(this.productionDataPath, 'metadata/css-analysis.json');
      return JSON.parse(fs.readFileSync(analysisPath, 'utf8'));
    } catch (error) {
      console.warn('Could not load production CSS analysis:', error.message);
      return null;
    }
  }

  findSelectorConflicts(localAnalysis, productionAnalysis) {
    const conflicts = [];
    const productionSelectors = new Set(Object.keys(productionAnalysis.selectorsCount || {}));
    
    if (localAnalysis.selectorsCount) {
      Object.keys(localAnalysis.selectorsCount).forEach(selector => {
        if (!productionSelectors.has(selector)) {
          conflicts.push({
            type: 'missing_selector',
            severity: 'low',
            selector: selector,
            description: `Selector "${selector}" exists locally but not in production`,
            recommendation: 'Verify if this selector is needed or remove if unused'
          });
        }
      });
    }
    
    return conflicts;
  }

  findPropertyConflicts(localAnalysis, productionAnalysis) {
    const conflicts = [];
    const productionProperties = new Set(Object.keys(productionAnalysis.propertiesCount || {}));
    
    if (localAnalysis.propertiesCount) {
      Object.keys(localAnalysis.propertiesCount).forEach(property => {
        if (!productionProperties.has(property)) {
          conflicts.push({
            type: 'missing_property',
            severity: 'low',
            property: property,
            description: `CSS property "${property}" used locally but not in production`,
            recommendation: 'Check if this property is necessary for local functionality'
          });
        }
      });
    }
    
    return conflicts;
  }

  async identifyMissingStyles() {
    console.log('🔍 Identifying missing styles...\n');
    
    const missingStyles = [];
    
    // Load production CSS analysis
    const productionAnalysis = await this.loadProductionCSSAnalysis();
    const localAnalysis = await this.loadLocalCSSAnalysis();
    
    if (productionAnalysis && localAnalysis) {
      // Find selectors in production but not local
      const productionSelectors = Object.keys(productionAnalysis.selectorsCount || {});
      const localSelectors = Object.keys(localAnalysis.selectorsCount || {});
      const localSelectorSet = new Set(localSelectors);
      
      productionSelectors.forEach(selector => {
        if (!localSelectorSet.has(selector)) {
          missingStyles.push({
            type: 'missing_selector',
            selector: selector,
            usage: productionAnalysis.selectorsCount[selector],
            severity: this.calculateMissingSeverity(selector, productionAnalysis.selectorsCount[selector]),
            description: `Production selector "${selector}" not found in local build`,
            recommendation: 'Add this selector to local CSS or verify it\'s generated correctly'
          });
        }
      });
      
      // Find critical missing framework classes
      if (productionAnalysis.frameworks.includes('Tailwind CSS')) {
        const missingTailwindClasses = this.findMissingTailwindClasses(productionAnalysis, localAnalysis);
        missingStyles.push(...missingTailwindClasses);
      }
    }
    
    this.analysis.missingStyles = missingStyles;
    return missingStyles;
  }

  calculateMissingSeverity(selector, usage) {
    // High usage selectors are more critical
    if (usage > 10) return 'high';
    if (usage > 5) return 'medium';
    return 'low';
  }

  findMissingTailwindClasses(productionAnalysis, localAnalysis) {
    const missingClasses = [];
    const tailwindPatterns = [
      /^\.text-/, /^\.bg-/, /^\.border-/, /^\.p-/, /^\.m-/, /^\.w-/, /^\.h-/,
      /^\.flex/, /^\.grid/, /^\.hidden/, /^\.block/, /^\.inline/
    ];
    
    Object.keys(productionAnalysis.selectorsCount || {}).forEach(selector => {
      const isTailwindClass = tailwindPatterns.some(pattern => pattern.test(selector));
      
      if (isTailwindClass && !localAnalysis.selectorsCount[selector]) {
        missingClasses.push({
          type: 'missing_tailwind_class',
          selector: selector,
          usage: productionAnalysis.selectorsCount[selector],
          severity: 'medium',
          description: `Tailwind class "${selector}" used in production but not generated locally`,
          recommendation: 'Check Tailwind configuration and content paths'
        });
      }
    });
    
    return missingClasses;
  }

  createMigrationPlan() {
    console.log('📋 Creating migration plan...\n');
    
    const migrationPlan = [];
    
    // Tailwind configuration fixes
    if (this.analysis.tailwindComparison.differences) {
      this.analysis.tailwindComparison.differences.forEach(diff => {
        migrationPlan.push({
          priority: this.getPriority(diff.severity),
          category: 'tailwind_config',
          task: diff.description,
          action: diff.recommendation,
          files: ['tailwind.config.js'],
          details: diff.details
        });
      });
    }
    
    // Custom CSS fixes
    if (this.analysis.customCSSComparison.differences) {
      this.analysis.customCSSComparison.differences.forEach(diff => {
        migrationPlan.push({
          priority: this.getPriority(diff.severity),
          category: 'custom_css',
          task: diff.description,
          action: diff.recommendation,
          files: ['app/globals.css', 'app/styles/*.css'],
          details: diff.details
        });
      });
    }
    
    // Missing styles fixes
    const criticalMissingStyles = this.analysis.missingStyles.filter(style => 
      style.severity === 'high' || style.severity === 'critical'
    );
    
    if (criticalMissingStyles.length > 0) {
      migrationPlan.push({
        priority: 1,
        category: 'missing_styles',
        task: `Fix ${criticalMissingStyles.length} critical missing styles`,
        action: 'Add missing selectors and verify CSS generation',
        files: ['app/globals.css', 'tailwind.config.js'],
        details: criticalMissingStyles.slice(0, 10) // Show first 10
      });
    }
    
    // Sort by priority
    migrationPlan.sort((a, b) => a.priority - b.priority);
    
    this.analysis.migrationPlan = migrationPlan;
    return migrationPlan;
  }

  getPriority(severity) {
    switch (severity) {
      case 'critical': return 1;
      case 'high': return 2;
      case 'medium': return 3;
      case 'low': return 4;
      default: return 5;
    }
  }

  async runCompleteAnalysis() {
    console.log('🎨 Starting CSS Framework and Styling Analysis...\n');
    
    try {
      // Run all analyses
      await this.analyzeTailwindConfiguration();
      await this.analyzeCustomCSS();
      await this.identifyStyleConflicts();
      await this.identifyMissingStyles();
      this.createMigrationPlan();
      
      // Save results
      this.saveAnalysis();
      this.printSummary();
      
      console.log('\n✅ CSS framework analysis complete!');
      return this.analysis;
      
    } catch (error) {
      console.error('❌ Analysis failed:', error.message);
      throw error;
    }
  }

  saveAnalysis() {
    // Ensure comparison directory exists
    if (!fs.existsSync(this.comparisonPath)) {
      fs.mkdirSync(this.comparisonPath, { recursive: true });
    }
    
    const outputPath = path.join(this.comparisonPath, 'css-framework-analysis.json');
    fs.writeFileSync(outputPath, JSON.stringify(this.analysis, null, 2));
    
    console.log(`\n💾 CSS framework analysis saved to: ${outputPath}`);
  }

  printSummary() {
    console.log('\n📊 CSS Framework Analysis Summary:');
    console.log('=' .repeat(50));
    
    // Tailwind Configuration
    console.log('\n🎨 Tailwind Configuration:');
    const tailwind = this.analysis.tailwindComparison;
    console.log(`  Local config exists: ${tailwind.local?.exists || false}`);
    console.log(`  Production uses Tailwind: ${tailwind.production?.exists || false}`);
    console.log(`  Configuration issues: ${tailwind.differences?.length || 0}`);
    
    // Custom CSS
    console.log('\n📝 Custom CSS:');
    const customCSS = this.analysis.customCSSComparison;
    if (customCSS.local?.exists && customCSS.production?.exists) {
      console.log(`  Local files: ${customCSS.local.totalFiles}`);
      console.log(`  Local size: ${(customCSS.local.totalSize / 1024).toFixed(2)}KB`);
      console.log(`  Production files: ${customCSS.production.totalFiles}`);
      console.log(`  Production size: ${(customCSS.production.totalSize / 1024).toFixed(2)}KB`);
    }
    console.log(`  CSS differences: ${customCSS.differences?.length || 0}`);
    
    // Style Issues
    console.log('\n⚠️  Style Issues:');
    console.log(`  Style conflicts: ${this.analysis.styleConflicts.length}`);
    console.log(`  Missing styles: ${this.analysis.missingStyles.length}`);
    
    const criticalMissing = this.analysis.missingStyles.filter(s => s.severity === 'high' || s.severity === 'critical');
    if (criticalMissing.length > 0) {
      console.log(`  Critical missing styles: ${criticalMissing.length}`);
    }
    
    // Migration Plan
    console.log('\n📋 Migration Plan:');
    console.log(`  Total tasks: ${this.analysis.migrationPlan.length}`);
    
    const priorityTasks = this.analysis.migrationPlan.filter(task => task.priority <= 2);
    if (priorityTasks.length > 0) {
      console.log(`  High priority tasks: ${priorityTasks.length}`);
      console.log('\n  Next steps:');
      priorityTasks.slice(0, 3).forEach((task, index) => {
        console.log(`    ${index + 1}. ${task.task}`);
      });
    }
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new CSSFrameworkAnalyzer();
  analyzer.runCompleteAnalysis().catch(console.error);
}

module.exports = CSSFrameworkAnalyzer;