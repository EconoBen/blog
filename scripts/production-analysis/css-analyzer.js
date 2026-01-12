#!/usr/bin/env node

/**
 * CSS Analysis Tool
 * Provides detailed analysis of CSS files including selectors, properties, and framework detection
 */

const fs = require('fs');
const path = require('path');

class CSSAnalyzer {
  constructor(cssDirectory) {
    this.cssDirectory = cssDirectory || path.join(__dirname, '../../analysis/production-data/css');
    this.analysis = {
      files: [],
      frameworks: new Set(),
      selectors: new Map(),
      properties: new Map(),
      mediaQueries: [],
      customProperties: new Set(),
      summary: {}
    };
  }

  analyzeCSSFile(filePath) {
    console.log(`🔍 Analyzing: ${path.basename(filePath)}`);
    
    const css = fs.readFileSync(filePath, 'utf8');
    const fileName = path.basename(filePath);
    
    const fileAnalysis = {
      fileName,
      size: css.length,
      selectors: [],
      properties: new Set(),
      mediaQueries: [],
      customProperties: new Set(),
      frameworks: new Set()
    };

    // Detect CSS frameworks
    this.detectFrameworks(css, fileAnalysis);
    
    // Extract selectors
    this.extractSelectors(css, fileAnalysis);
    
    // Extract media queries
    this.extractMediaQueries(css, fileAnalysis);
    
    // Extract custom properties (CSS variables)
    this.extractCustomProperties(css, fileAnalysis);
    
    // Convert Sets to Arrays for JSON serialization
    fileAnalysis.properties = [...fileAnalysis.properties];
    fileAnalysis.customProperties = [...fileAnalysis.customProperties];
    fileAnalysis.frameworks = [...fileAnalysis.frameworks];
    
    return fileAnalysis;
  }

  detectFrameworks(css, fileAnalysis) {
    const frameworks = [
      { name: 'Tailwind CSS', patterns: [/tailwind/i, /tw-/i, /@tailwind/i] },
      { name: 'Bootstrap', patterns: [/bootstrap/i, /\.btn/i, /\.container/i] },
      { name: 'Foundation', patterns: [/foundation/i, /\.grid-/i] },
      { name: 'Bulma', patterns: [/bulma/i, /\.is-/i, /\.has-/i] },
      { name: 'Material-UI', patterns: [/material/i, /\.MuiButton/i] },
      { name: 'Ant Design', patterns: [/antd/i, /\.ant-/i] }
    ];

    frameworks.forEach(framework => {
      const detected = framework.patterns.some(pattern => pattern.test(css));
      if (detected) {
        fileAnalysis.frameworks.add(framework.name);
        this.analysis.frameworks.add(framework.name);
      }
    });
  }

  extractSelectors(css, fileAnalysis) {
    // Remove comments and strings to avoid false matches
    const cleanCSS = css
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/"[^"]*"/g, '""')
      .replace(/'[^']*'/g, "''");

    // Extract selectors (simplified regex - may not catch all edge cases)
    const selectorRegex = /([^{}]+)\s*\{([^{}]*)\}/g;
    let match;

    while ((match = selectorRegex.exec(cleanCSS)) !== null) {
      const selector = match[1].trim();
      const declarations = match[2].trim();
      
      if (selector && declarations) {
        // Clean up selector
        const cleanSelector = selector
          .split(',')
          .map(s => s.trim())
          .filter(s => s.length > 0);

        cleanSelector.forEach(sel => {
          fileAnalysis.selectors.push(sel);
          
          // Count selector usage globally
          const count = this.analysis.selectors.get(sel) || 0;
          this.analysis.selectors.set(sel, count + 1);
        });

        // Extract properties from declarations
        this.extractProperties(declarations, fileAnalysis);
      }
    }
  }

  extractProperties(declarations, fileAnalysis) {
    const propertyRegex = /([a-zA-Z-]+)\s*:\s*([^;]+);?/g;
    let match;

    while ((match = propertyRegex.exec(declarations)) !== null) {
      const property = match[1].trim();
      const value = match[2].trim();
      
      if (property && value) {
        fileAnalysis.properties.add(property);
        
        // Count property usage globally
        const count = this.analysis.properties.get(property) || 0;
        this.analysis.properties.set(property, count + 1);
      }
    }
  }

  extractMediaQueries(css, fileAnalysis) {
    const mediaQueryRegex = /@media\s+([^{]+)\s*\{([\s\S]*?)\}/g;
    let match;

    while ((match = mediaQueryRegex.exec(css)) !== null) {
      const condition = match[1].trim();
      const content = match[2].trim();
      
      const mediaQuery = {
        condition,
        contentLength: content.length
      };
      
      fileAnalysis.mediaQueries.push(mediaQuery);
      this.analysis.mediaQueries.push({
        ...mediaQuery,
        file: fileAnalysis.fileName
      });
    }
  }

  extractCustomProperties(css, fileAnalysis) {
    const customPropertyRegex = /--([\w-]+)\s*:\s*([^;]+);/g;
    let match;

    while ((match = customPropertyRegex.exec(css)) !== null) {
      const propertyName = `--${match[1]}`;
      fileAnalysis.customProperties.add(propertyName);
      this.analysis.customProperties.add(propertyName);
    }
  }

  analyzeAllCSS() {
    console.log('🎨 Starting CSS analysis...\n');
    
    if (!fs.existsSync(this.cssDirectory)) {
      console.error(`❌ CSS directory not found: ${this.cssDirectory}`);
      console.log('Run the production data capture script first.');
      return null;
    }

    const cssFiles = fs.readdirSync(this.cssDirectory)
      .filter(file => file.endsWith('.css'))
      .map(file => path.join(this.cssDirectory, file));

    if (cssFiles.length === 0) {
      console.error('❌ No CSS files found in directory');
      return null;
    }

    // Analyze each CSS file
    cssFiles.forEach(filePath => {
      const fileAnalysis = this.analyzeCSSFile(filePath);
      this.analysis.files.push(fileAnalysis);
    });

    // Generate summary
    this.generateSummary();
    
    return this.analysis;
  }

  generateSummary() {
    const totalSelectors = this.analysis.files.reduce((sum, file) => sum + file.selectors.length, 0);
    const totalSize = this.analysis.files.reduce((sum, file) => sum + file.size, 0);
    
    this.analysis.summary = {
      totalFiles: this.analysis.files.length,
      totalSize: totalSize,
      totalSelectors: totalSelectors,
      uniqueSelectors: this.analysis.selectors.size,
      uniqueProperties: this.analysis.properties.size,
      totalMediaQueries: this.analysis.mediaQueries.length,
      totalCustomProperties: this.analysis.customProperties.size,
      detectedFrameworks: [...this.analysis.frameworks]
    };

    // Convert Maps to Objects for JSON serialization
    this.analysis.selectorsCount = Object.fromEntries(this.analysis.selectors);
    this.analysis.propertiesCount = Object.fromEntries(this.analysis.properties);
    this.analysis.customProperties = [...this.analysis.customProperties];
    this.analysis.frameworks = [...this.analysis.frameworks];
    
    // Remove Maps (can't be serialized)
    delete this.analysis.selectors;
    delete this.analysis.properties;
  }

  saveAnalysis(outputPath) {
    const analysisPath = outputPath || path.join(this.cssDirectory, '../metadata/css-analysis.json');
    
    // Ensure directory exists
    const dir = path.dirname(analysisPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    fs.writeFileSync(analysisPath, JSON.stringify(this.analysis, null, 2));
    console.log(`\n💾 CSS analysis saved to: ${analysisPath}`);
    
    return analysisPath;
  }

  printSummary() {
    const summary = this.analysis.summary;
    
    console.log('\n📊 CSS Analysis Summary:');
    console.log(`  Total CSS files: ${summary.totalFiles}`);
    console.log(`  Total size: ${(summary.totalSize / 1024).toFixed(2)} KB`);
    console.log(`  Total selectors: ${summary.totalSelectors}`);
    console.log(`  Unique selectors: ${summary.uniqueSelectors}`);
    console.log(`  Unique properties: ${summary.uniqueProperties}`);
    console.log(`  Media queries: ${summary.totalMediaQueries}`);
    console.log(`  Custom properties: ${summary.totalCustomProperties}`);
    console.log(`  Detected frameworks: ${summary.detectedFrameworks.join(', ') || 'None'}`);
    
    // Show most common selectors
    if (this.analysis.selectorsCount) {
      console.log('\n🔝 Most common selectors:');
      const sortedSelectors = Object.entries(this.analysis.selectorsCount)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 10);
      
      sortedSelectors.forEach(([selector, count]) => {
        console.log(`  ${selector}: ${count} times`);
      });
    }
  }

  runAnalysis() {
    const analysis = this.analyzeAllCSS();
    
    if (analysis) {
      this.printSummary();
      this.saveAnalysis();
      console.log('\n✅ CSS analysis complete!');
    }
    
    return analysis;
  }
}

// CLI interface
if (require.main === module) {
  const cssDir = process.argv[2];
  const analyzer = new CSSAnalyzer(cssDir);
  analyzer.runAnalysis();
}

module.exports = CSSAnalyzer;