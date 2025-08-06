#!/usr/bin/env node

/**
 * Comprehensive Analysis Runner
 * Orchestrates both production and local build analysis for comparison
 */

const ProductionAnalyzer = require('./capture-production-data');
const LocalBuildAnalyzer = require('./local-build-analyzer');
const CSSAnalyzer = require('./css-analyzer');
const DifferenceEngine = require('./difference-engine');
const fs = require('fs');
const path = require('path');

class ComprehensiveAnalyzer {
  constructor() {
    this.productionOutputDir = path.join(__dirname, '../../analysis/production-data');
    this.localOutputDir = path.join(__dirname, '../../analysis/local-data');
    this.comparisonOutputDir = path.join(__dirname, '../../analysis/comparison');
    this.productionAnalyzer = new ProductionAnalyzer();
    this.localAnalyzer = new LocalBuildAnalyzer();
    this.cssAnalyzer = new CSSAnalyzer();
    this.differenceEngine = new DifferenceEngine();
    
    this.ensureComparisonDirectory();
  }

  ensureComparisonDirectory() {
    if (!fs.existsSync(this.comparisonOutputDir)) {
      fs.mkdirSync(this.comparisonOutputDir, { recursive: true });
    }
  }

  async runComprehensiveAnalysis() {
    console.log('🚀 Starting comprehensive production vs local analysis...\n');
    
    try {
      // Step 1: Production analysis
      console.log('📋 Phase 1: Production Site Analysis');
      console.log('=' .repeat(60));
      await this.productionAnalyzer.runFullAnalysis();
      
      console.log('\n📋 Phase 2: Local Build Analysis');
      console.log('=' .repeat(60));
      await this.localAnalyzer.runFullAnalysis();
      
      console.log('\n📋 Phase 3: CSS Analysis');
      console.log('=' .repeat(60));
      
      // Analyze production CSS
      console.log('🎨 Analyzing production CSS...');
      const productionCSSAnalyzer = new CSSAnalyzer(path.join(this.productionOutputDir, 'css'));
      const productionCSSAnalysis = productionCSSAnalyzer.runAnalysis();
      
      // Analyze local CSS
      console.log('\n🎨 Analyzing local CSS...');
      const localCSSAnalyzer = new CSSAnalyzer(path.join(this.localOutputDir, 'css'));
      const localCSSAnalysis = localCSSAnalyzer.runAnalysis();
      
      console.log('\n📋 Phase 4: Comprehensive Difference Detection');
      console.log('=' .repeat(60));
      await this.differenceEngine.runComprehensiveComparison();
      
      console.log('\n📋 Phase 5: Legacy Comparison Analysis');
      console.log('=' .repeat(60));
      await this.generateComparisonReport(productionCSSAnalysis, localCSSAnalysis);
      
      console.log('\n🎉 Comprehensive analysis complete!');
      console.log(`📁 Production data: ${this.productionOutputDir}`);
      console.log(`📁 Local data: ${this.localOutputDir}`);
      console.log(`📁 Comparison: ${this.comparisonOutputDir}`);
      
    } catch (error) {
      console.error('\n❌ Comprehensive analysis failed:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }

  async generateComparisonReport(productionCSSAnalysis, localCSSAnalysis) {
    console.log('📊 Generating comprehensive comparison report...');
    
    const comparison = {
      metadata: {
        timestamp: new Date().toISOString(),
        analysisVersion: '1.0.0',
        productionUrl: 'https://econoben.dev',
        localUrl: 'http://localhost:3000'
      },
      htmlComparison: await this.compareHTML(),
      cssComparison: this.compareCSS(productionCSSAnalysis, localCSSAnalysis),
      assetComparison: await this.compareAssets(),
      buildComparison: await this.compareBuildStructure(),
      recommendations: []
    };

    // Generate recommendations based on differences
    comparison.recommendations = this.generateRecommendations(comparison);

    // Save comprehensive comparison
    const comparisonPath = path.join(this.comparisonOutputDir, 'comprehensive-comparison.json');
    fs.writeFileSync(comparisonPath, JSON.stringify(comparison, null, 2));
    
    // Generate human-readable comparison report
    this.generateReadableComparison(comparison);
    
    console.log(`  ✅ Comprehensive comparison saved to: ${comparisonPath}`);
    
    return comparison;
  }

  async compareHTML() {
    console.log('  🔍 Comparing HTML structures...');
    
    const htmlComparison = {
      pageComparisons: {},
      structuralDifferences: [],
      contentDifferences: [],
      metaDifferences: []
    };

    const productionHtmlDir = path.join(this.productionOutputDir, 'html');
    const localHtmlDir = path.join(this.localOutputDir, 'html');

    if (!fs.existsSync(productionHtmlDir) || !fs.existsSync(localHtmlDir)) {
      htmlComparison.error = 'HTML directories not found. Run analysis first.';
      return htmlComparison;
    }

    const productionFiles = fs.readdirSync(productionHtmlDir).filter(f => f.endsWith('.html'));
    const localFiles = fs.readdirSync(localHtmlDir).filter(f => f.endsWith('.html'));

    // Compare each page
    for (const file of productionFiles) {
      if (localFiles.includes(file)) {
        const productionHtml = fs.readFileSync(path.join(productionHtmlDir, file), 'utf8');
        const localHtml = fs.readFileSync(path.join(localHtmlDir, file), 'utf8');
        
        htmlComparison.pageComparisons[file] = this.compareHTMLContent(productionHtml, localHtml);
      } else {
        htmlComparison.pageComparisons[file] = {
          status: 'missing_local',
          message: 'Page exists in production but not in local build'
        };
      }
    }

    // Check for local-only pages
    for (const file of localFiles) {
      if (!productionFiles.includes(file)) {
        htmlComparison.pageComparisons[file] = {
          status: 'local_only',
          message: 'Page exists in local build but not in production'
        };
      }
    }

    return htmlComparison;
  }

  compareHTMLContent(productionHtml, localHtml) {
    const comparison = {
      status: 'compared',
      sizeDifference: localHtml.length - productionHtml.length,
      titleMatch: false,
      metaTagDifferences: [],
      structuralSimilarity: 0
    };

    // Compare titles
    const productionTitle = this.extractTitle(productionHtml);
    const localTitle = this.extractTitle(localHtml);
    comparison.titleMatch = productionTitle === localTitle;
    comparison.titles = { production: productionTitle, local: localTitle };

    // Compare meta tags
    const productionMeta = this.extractMetaTags(productionHtml);
    const localMeta = this.extractMetaTags(localHtml);
    comparison.metaTagDifferences = this.compareMetaTags(productionMeta, localMeta);

    // Basic structural similarity (simplified)
    const productionStructure = this.extractBasicStructure(productionHtml);
    const localStructure = this.extractBasicStructure(localHtml);
    comparison.structuralSimilarity = this.calculateStructuralSimilarity(productionStructure, localStructure);

    return comparison;
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

  compareMetaTags(productionMeta, localMeta) {
    const differences = [];
    
    // Simple comparison - could be enhanced
    if (productionMeta.length !== localMeta.length) {
      differences.push({
        type: 'count_difference',
        production: productionMeta.length,
        local: localMeta.length
      });
    }

    return differences;
  }

  extractBasicStructure(html) {
    return {
      divs: (html.match(/<div[^>]*>/gi) || []).length,
      sections: (html.match(/<section[^>]*>/gi) || []).length,
      articles: (html.match(/<article[^>]*>/gi) || []).length,
      headers: (html.match(/<header[^>]*>/gi) || []).length,
      footers: (html.match(/<footer[^>]*>/gi) || []).length,
      navs: (html.match(/<nav[^>]*>/gi) || []).length
    };
  }

  calculateStructuralSimilarity(prod, local) {
    const keys = Object.keys(prod);
    let totalDiff = 0;
    let totalElements = 0;

    keys.forEach(key => {
      const prodCount = prod[key] || 0;
      const localCount = local[key] || 0;
      totalDiff += Math.abs(prodCount - localCount);
      totalElements += Math.max(prodCount, localCount);
    });

    return totalElements > 0 ? Math.max(0, 1 - (totalDiff / totalElements)) : 1;
  }

  compareCSS(productionAnalysis, localAnalysis) {
    console.log('  🎨 Comparing CSS analyses...');
    
    const cssComparison = {
      frameworkComparison: {},
      sizeComparison: {},
      selectorComparison: {},
      propertyComparison: {},
      differences: []
    };

    if (!productionAnalysis || !localAnalysis) {
      cssComparison.error = 'CSS analysis data missing';
      return cssComparison;
    }

    // Compare frameworks
    const prodFrameworks = new Set(productionAnalysis.summary?.detectedFrameworks || []);
    const localFrameworks = new Set(localAnalysis.summary?.detectedFrameworks || []);
    
    cssComparison.frameworkComparison = {
      production: [...prodFrameworks],
      local: [...localFrameworks],
      common: [...prodFrameworks].filter(f => localFrameworks.has(f)),
      productionOnly: [...prodFrameworks].filter(f => !localFrameworks.has(f)),
      localOnly: [...localFrameworks].filter(f => !prodFrameworks.has(f))
    };

    // Compare sizes
    cssComparison.sizeComparison = {
      production: productionAnalysis.summary?.totalSize || 0,
      local: localAnalysis.summary?.totalSize || 0,
      difference: (localAnalysis.summary?.totalSize || 0) - (productionAnalysis.summary?.totalSize || 0)
    };

    // Compare selectors
    cssComparison.selectorComparison = {
      production: productionAnalysis.summary?.uniqueSelectors || 0,
      local: localAnalysis.summary?.uniqueSelectors || 0,
      difference: (localAnalysis.summary?.uniqueSelectors || 0) - (productionAnalysis.summary?.uniqueSelectors || 0)
    };

    // Compare properties
    cssComparison.propertyComparison = {
      production: productionAnalysis.summary?.uniqueProperties || 0,
      local: localAnalysis.summary?.uniqueProperties || 0,
      difference: (localAnalysis.summary?.uniqueProperties || 0) - (productionAnalysis.summary?.uniqueProperties || 0)
    };

    // Generate difference summary
    if (cssComparison.frameworkComparison.productionOnly.length > 0) {
      cssComparison.differences.push({
        type: 'missing_frameworks',
        description: `Production uses frameworks not found locally: ${cssComparison.frameworkComparison.productionOnly.join(', ')}`,
        severity: 'high'
      });
    }

    if (Math.abs(cssComparison.sizeComparison.difference) > 50000) {
      cssComparison.differences.push({
        type: 'size_difference',
        description: `Significant CSS size difference: ${(cssComparison.sizeComparison.difference / 1024).toFixed(2)} KB`,
        severity: 'medium'
      });
    }

    return cssComparison;
  }

  async compareAssets() {
    console.log('  🖼️  Comparing asset inventories...');
    
    const assetComparison = {
      imageComparison: {},
      fontComparison: {},
      scriptComparison: {},
      differences: []
    };

    // Load asset inventories
    const productionAssetsPath = path.join(this.productionOutputDir, 'metadata', 'asset-inventory.json');
    const localAssetsPath = path.join(this.localOutputDir, 'metadata', 'local-asset-inventory.json');

    let productionAssets = {};
    let localAssets = {};

    try {
      if (fs.existsSync(productionAssetsPath)) {
        productionAssets = JSON.parse(fs.readFileSync(productionAssetsPath, 'utf8'));
      }
      if (fs.existsSync(localAssetsPath)) {
        localAssets = JSON.parse(fs.readFileSync(localAssetsPath, 'utf8'));
      }
    } catch (error) {
      assetComparison.error = `Failed to load asset inventories: ${error.message}`;
      return assetComparison;
    }

    // Compare images
    assetComparison.imageComparison = this.compareAssetLists(
      productionAssets.images || [],
      localAssets.images || [],
      'images'
    );

    // Compare fonts
    assetComparison.fontComparison = this.compareAssetLists(
      productionAssets.fonts || [],
      localAssets.fonts || [],
      'fonts'
    );

    // Compare scripts
    assetComparison.scriptComparison = this.compareAssetLists(
      productionAssets.scripts || [],
      localAssets.scripts || [],
      'scripts'
    );

    return assetComparison;
  }

  compareAssetLists(productionList, localList, assetType) {
    const prodSet = new Set(productionList);
    const localSet = new Set(localList);

    return {
      production: productionList.length,
      local: localList.length,
      common: productionList.filter(asset => localSet.has(asset)).length,
      productionOnly: productionList.filter(asset => !localSet.has(asset)),
      localOnly: localList.filter(asset => !prodSet.has(asset))
    };
  }

  async compareBuildStructure() {
    console.log('  🔨 Comparing build structures...');
    
    const buildComparison = {
      localBuildExists: false,
      buildAnalysis: null,
      differences: []
    };

    const buildAnalysisPath = path.join(this.localOutputDir, 'build-analysis', 'build-structure.json');
    
    if (fs.existsSync(buildAnalysisPath)) {
      try {
        buildComparison.buildAnalysis = JSON.parse(fs.readFileSync(buildAnalysisPath, 'utf8'));
        buildComparison.localBuildExists = true;
      } catch (error) {
        buildComparison.error = `Failed to load build analysis: ${error.message}`;
      }
    }

    return buildComparison;
  }

  generateRecommendations(comparison) {
    const recommendations = [];

    // CSS Framework recommendations
    if (comparison.cssComparison.frameworkComparison?.productionOnly?.length > 0) {
      recommendations.push({
        category: 'CSS Framework',
        priority: 'high',
        title: 'Missing CSS Frameworks',
        description: `Production uses ${comparison.cssComparison.frameworkComparison.productionOnly.join(', ')} which are not detected locally.`,
        action: 'Install and configure the missing CSS frameworks in your local build'
      });
    }

    // Size difference recommendations
    if (Math.abs(comparison.cssComparison.sizeComparison?.difference || 0) > 50000) {
      const diff = comparison.cssComparison.sizeComparison.difference;
      recommendations.push({
        category: 'Performance',
        priority: 'medium',
        title: 'CSS Size Difference',
        description: `Local CSS is ${diff > 0 ? 'larger' : 'smaller'} than production by ${Math.abs(diff / 1024).toFixed(2)} KB.`,
        action: diff > 0 ? 'Review local CSS for unused styles' : 'Ensure all production styles are included locally'
      });
    }

    // Asset recommendations
    if (comparison.assetComparison.imageComparison?.productionOnly?.length > 0) {
      recommendations.push({
        category: 'Assets',
        priority: 'medium',
        title: 'Missing Images',
        description: `${comparison.assetComparison.imageComparison.productionOnly.length} images found in production but not locally.`,
        action: 'Ensure all production images are available in your local public directory'
      });
    }

    return recommendations;
  }

  generateReadableComparison(comparison) {
    console.log('  📝 Generating human-readable comparison report...');
    
    let report = `# Production vs Local Build Comparison Report

Generated: ${new Date().toLocaleString()}
Production URL: ${comparison.metadata.productionUrl}
Local URL: ${comparison.metadata.localUrl}

## Executive Summary

This report compares the production site at econoben.dev with the local Next.js build to identify differences that need to be addressed for production parity.

`;

    // CSS Comparison Section
    if (comparison.cssComparison) {
      const css = comparison.cssComparison;
      report += `## CSS Analysis Comparison

### Framework Detection
- **Production Frameworks**: ${css.frameworkComparison?.production?.join(', ') || 'None detected'}
- **Local Frameworks**: ${css.frameworkComparison?.local?.join(', ') || 'None detected'}
- **Missing Locally**: ${css.frameworkComparison?.productionOnly?.join(', ') || 'None'}
- **Local Only**: ${css.frameworkComparison?.localOnly?.join(', ') || 'None'}

### Size Comparison
- **Production CSS Size**: ${(css.sizeComparison?.production / 1024 || 0).toFixed(2)} KB
- **Local CSS Size**: ${(css.sizeComparison?.local / 1024 || 0).toFixed(2)} KB
- **Difference**: ${(css.sizeComparison?.difference / 1024 || 0).toFixed(2)} KB

### Selector Comparison
- **Production Selectors**: ${css.selectorComparison?.production || 0}
- **Local Selectors**: ${css.selectorComparison?.local || 0}
- **Difference**: ${css.selectorComparison?.difference || 0}

`;
    }

    // Asset Comparison Section
    if (comparison.assetComparison) {
      const assets = comparison.assetComparison;
      report += `## Asset Comparison

### Images
- **Production**: ${assets.imageComparison?.production || 0} images
- **Local**: ${assets.imageComparison?.local || 0} images
- **Missing Locally**: ${assets.imageComparison?.productionOnly?.length || 0} images

### Fonts
- **Production**: ${assets.fontComparison?.production || 0} fonts
- **Local**: ${assets.fontComparison?.local || 0} fonts
- **Missing Locally**: ${assets.fontComparison?.productionOnly?.length || 0} fonts

### Scripts
- **Production**: ${assets.scriptComparison?.production || 0} scripts
- **Local**: ${assets.scriptComparison?.local || 0} scripts
- **Missing Locally**: ${assets.scriptComparison?.productionOnly?.length || 0} scripts

`;
    }

    // Recommendations Section
    if (comparison.recommendations.length > 0) {
      report += `## Recommendations

`;
      comparison.recommendations.forEach((rec, index) => {
        report += `### ${index + 1}. ${rec.title} (${rec.priority.toUpperCase()})

**Category**: ${rec.category}
**Description**: ${rec.description}
**Action**: ${rec.action}

`;
      });
    }

    // Next Steps Section
    report += `## Next Steps

1. **Review Recommendations**: Address the high-priority items first
2. **Fix CSS Framework Issues**: Ensure all production frameworks are configured locally
3. **Resolve Asset Differences**: Make sure all production assets are available locally
4. **Test Changes**: Verify that fixes don't break existing functionality
5. **Re-run Analysis**: Use this tool again to verify parity is achieved

## Files Generated

- \`production-data/\` - Complete production site analysis
- \`local-data/\` - Complete local build analysis  
- \`comparison/\` - This comparison report and detailed differences

`;

    const reportPath = path.join(this.comparisonOutputDir, 'comparison-report.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(`  ✅ Human-readable comparison saved to: ${reportPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new ComprehensiveAnalyzer();
  analyzer.runComprehensiveAnalysis();
}

module.exports = ComprehensiveAnalyzer;