#!/usr/bin/env node

/**
 * Production Analysis Runner
 * Orchestrates the complete production site analysis process
 */

const ProductionAnalyzer = require('./capture-production-data');
const CSSAnalyzer = require('./css-analyzer');
const fs = require('fs');
const path = require('path');

class AnalysisRunner {
  constructor() {
    this.outputDir = path.join(__dirname, '../../analysis/production-data');
    this.productionAnalyzer = new ProductionAnalyzer();
    this.cssAnalyzer = new CSSAnalyzer();
  }

  async runCompleteAnalysis() {
    console.log('🚀 Starting complete production site analysis...\n');
    
    try {
      // Step 1: Capture production data
      console.log('📋 Phase 1: Capturing production site data');
      console.log('=' .repeat(50));
      await this.productionAnalyzer.runFullAnalysis();
      
      console.log('\n📋 Phase 2: Analyzing CSS in detail');
      console.log('=' .repeat(50));
      
      // Step 2: Detailed CSS analysis
      const cssAnalysis = this.cssAnalyzer.runAnalysis();
      
      // Step 3: Generate comprehensive report
      console.log('\n📋 Phase 3: Generating comprehensive report');
      console.log('=' .repeat(50));
      await this.generateComprehensiveReport(cssAnalysis);
      
      console.log('\n🎉 Complete analysis finished successfully!');
      console.log(`📁 All results saved to: ${this.outputDir}`);
      
    } catch (error) {
      console.error('\n❌ Analysis failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }

  async generateComprehensiveReport(cssAnalysis) {
    console.log('📊 Generating comprehensive analysis report...');
    
    const report = {
      metadata: {
        timestamp: new Date().toISOString(),
        analysisVersion: '1.0.0',
        productionUrl: 'https://econoben.dev'
      },
      summary: {},
      htmlAnalysis: {},
      cssAnalysis: cssAnalysis || {},
      assetAnalysis: {},
      recommendations: []
    };

    // Load existing analysis files
    try {
      // Load HTML summary
      const summaryPath = path.join(this.outputDir, 'analysis-summary.json');
      if (fs.existsSync(summaryPath)) {
        const summary = JSON.parse(fs.readFileSync(summaryPath, 'utf8'));
        report.summary = summary;
      }

      // Load asset inventory
      const assetPath = path.join(this.outputDir, 'metadata', 'asset-inventory.json');
      if (fs.existsSync(assetPath)) {
        const assets = JSON.parse(fs.readFileSync(assetPath, 'utf8'));
        report.assetAnalysis = assets;
      }

      // Load CSS references
      const cssRefsPath = path.join(this.outputDir, 'metadata', 'css-references.json');
      if (fs.existsSync(cssRefsPath)) {
        const cssRefs = JSON.parse(fs.readFileSync(cssRefsPath, 'utf8'));
        report.cssAnalysis.references = cssRefs;
      }

    } catch (error) {
      console.warn(`⚠️  Warning: Could not load some analysis files: ${error.message}`);
    }

    // Generate HTML analysis
    report.htmlAnalysis = this.analyzeHTMLStructure();
    
    // Generate recommendations
    report.recommendations = this.generateRecommendations(report);

    // Save comprehensive report
    const reportPath = path.join(this.outputDir, 'comprehensive-report.json');
    fs.writeFileSync(reportPath, JSON.stringify(report, null, 2));
    
    // Generate human-readable report
    this.generateReadableReport(report);
    
    console.log(`  ✅ Comprehensive report saved to: ${reportPath}`);
    
    return report;
  }

  analyzeHTMLStructure() {
    console.log('  🔍 Analyzing HTML structure...');
    
    const htmlDir = path.join(this.outputDir, 'html');
    const analysis = {
      pages: {},
      commonElements: new Set(),
      uniqueElements: new Set(),
      structurePatterns: []
    };

    if (!fs.existsSync(htmlDir)) {
      return analysis;
    }

    const htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html'));
    
    htmlFiles.forEach(file => {
      const filePath = path.join(htmlDir, file);
      const html = fs.readFileSync(filePath, 'utf8');
      const pageName = file.replace('.html', '');
      
      analysis.pages[pageName] = {
        size: html.length,
        title: this.extractTitle(html),
        metaTags: this.extractMetaTags(html),
        headElements: this.extractHeadElements(html),
        bodyStructure: this.analyzeBodyStructure(html)
      };
    });

    // Convert Sets to Arrays
    analysis.commonElements = [...analysis.commonElements];
    analysis.uniqueElements = [...analysis.uniqueElements];
    
    return analysis;
  }

  extractTitle(html) {
    const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
    return titleMatch ? titleMatch[1].trim() : '';
  }

  extractMetaTags(html) {
    const metaTags = [];
    const metaRegex = /<meta[^>]*>/gi;
    let match;
    
    while ((match = metaRegex.exec(html)) !== null) {
      metaTags.push(match[0]);
    }
    
    return metaTags;
  }

  extractHeadElements(html) {
    const headMatch = html.match(/<head[^>]*>([\s\S]*?)<\/head>/i);
    if (!headMatch) return {};
    
    const head = headMatch[1];
    
    return {
      linkTags: (head.match(/<link[^>]*>/gi) || []).length,
      scriptTags: (head.match(/<script[^>]*>/gi) || []).length,
      styleTags: (head.match(/<style[^>]*>/gi) || []).length,
      metaTags: (head.match(/<meta[^>]*>/gi) || []).length
    };
  }

  analyzeBodyStructure(html) {
    const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
    if (!bodyMatch) return {};
    
    const body = bodyMatch[1];
    
    // Count major structural elements
    return {
      divs: (body.match(/<div[^>]*>/gi) || []).length,
      sections: (body.match(/<section[^>]*>/gi) || []).length,
      articles: (body.match(/<article[^>]*>/gi) || []).length,
      headers: (body.match(/<header[^>]*>/gi) || []).length,
      footers: (body.match(/<footer[^>]*>/gi) || []).length,
      navs: (body.match(/<nav[^>]*>/gi) || []).length,
      mains: (body.match(/<main[^>]*>/gi) || []).length
    };
  }

  generateRecommendations(report) {
    const recommendations = [];
    
    // CSS Framework recommendations
    if (report.cssAnalysis.summary && report.cssAnalysis.summary.detectedFrameworks) {
      const frameworks = report.cssAnalysis.summary.detectedFrameworks;
      if (frameworks.includes('Tailwind CSS')) {
        recommendations.push({
          category: 'CSS Framework',
          priority: 'high',
          title: 'Tailwind CSS Detected',
          description: 'Production site uses Tailwind CSS. Ensure local build has matching Tailwind configuration.',
          action: 'Compare tailwind.config.js and ensure all Tailwind classes are available locally'
        });
      }
    }

    // Asset loading recommendations
    if (report.assetAnalysis.summary) {
      const assets = report.assetAnalysis.summary;
      if (assets.totalImages > 0) {
        recommendations.push({
          category: 'Assets',
          priority: 'medium',
          title: 'Image Asset Verification',
          description: `Found ${assets.totalImages} images. Verify all images load correctly in local environment.`,
          action: 'Check image paths and ensure all images are available in public directory'
        });
      }
    }

    // CSS size recommendations
    if (report.cssAnalysis.summary && report.cssAnalysis.summary.totalSize > 100000) {
      recommendations.push({
        category: 'Performance',
        priority: 'medium',
        title: 'Large CSS Bundle',
        description: `CSS bundle is ${(report.cssAnalysis.summary.totalSize / 1024).toFixed(2)} KB. Consider optimization.`,
        action: 'Review CSS for unused styles and consider purging unused Tailwind classes'
      });
    }

    return recommendations;
  }

  generateReadableReport(report) {
    console.log('  📝 Generating human-readable report...');
    
    let readableReport = `# Production Site Analysis Report

Generated: ${new Date().toLocaleString()}
Production URL: ${report.metadata.productionUrl}

## Summary

`;

    if (report.summary.pagesAnalyzed) {
      readableReport += `- **Pages Analyzed**: ${report.summary.pagesAnalyzed}
- **HTML Files Captured**: ${report.summary.htmlFiles || 0}
- **CSS Files Downloaded**: ${report.summary.cssFiles || 0}

`;
    }

    // CSS Analysis Section
    if (report.cssAnalysis.summary) {
      const css = report.cssAnalysis.summary;
      readableReport += `## CSS Analysis

- **Total CSS Files**: ${css.totalFiles}
- **Total CSS Size**: ${(css.totalSize / 1024).toFixed(2)} KB
- **Total Selectors**: ${css.totalSelectors}
- **Unique Selectors**: ${css.uniqueSelectors}
- **CSS Properties Used**: ${css.uniqueProperties}
- **Media Queries**: ${css.totalMediaQueries}
- **CSS Custom Properties**: ${css.totalCustomProperties}
- **Detected Frameworks**: ${css.detectedFrameworks.join(', ') || 'None'}

`;
    }

    // Asset Analysis Section
    if (report.assetAnalysis.summary) {
      const assets = report.assetAnalysis.summary;
      readableReport += `## Asset Analysis

- **Images**: ${assets.totalImages}
- **Fonts**: ${assets.totalFonts}
- **Scripts**: ${assets.totalScripts}
- **Other Assets**: ${assets.totalOther}

`;
    }

    // Recommendations Section
    if (report.recommendations.length > 0) {
      readableReport += `## Recommendations

`;
      report.recommendations.forEach((rec, index) => {
        readableReport += `### ${index + 1}. ${rec.title} (${rec.priority.toUpperCase()})

**Category**: ${rec.category}
**Description**: ${rec.description}
**Action**: ${rec.action}

`;
      });
    }

    // File Structure Section
    readableReport += `## Generated Files

The following files have been generated in the analysis directory:

- \`html/\` - Captured HTML files from production pages
- \`css/\` - Downloaded CSS files and extracted inline styles
- \`metadata/\` - Analysis metadata and inventories
- \`analysis-summary.json\` - Basic analysis summary
- \`comprehensive-report.json\` - Complete analysis data
- \`analysis-report.md\` - This human-readable report

## Next Steps

1. Review the comprehensive report and recommendations
2. Compare local build output with captured production data
3. Implement fixes based on identified differences
4. Use the CSS analysis to ensure framework and styling parity

`;

    const reportPath = path.join(this.outputDir, 'analysis-report.md');
    fs.writeFileSync(reportPath, readableReport);
    
    console.log(`  ✅ Human-readable report saved to: ${reportPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const runner = new AnalysisRunner();
  runner.runCompleteAnalysis();
}

module.exports = AnalysisRunner;