#!/usr/bin/env node

/**
 * Comprehensive Difference Detection Engine
 * Systematically identifies all discrepancies between production and local builds
 */

const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

class DifferenceEngine {
  constructor() {
    this.productionDataDir = path.join(__dirname, '../../analysis/production-data');
    this.localDataDir = path.join(__dirname, '../../analysis/local-data');
    this.outputDir = path.join(__dirname, '../../analysis/comparison');
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(this.outputDir)) {
      fs.mkdirSync(this.outputDir, { recursive: true });
    }
  }

  /**
   * HTML Comparison Functions
   */
  async compareHTML() {
    console.log('🔍 Performing detailed HTML comparison...');
    
    const htmlComparison = {
      pageComparisons: {},
      structuralDifferences: [],
      contentDifferences: [],
      metaDifferences: [],
      summary: {}
    };

    const productionHtmlDir = path.join(this.productionDataDir, 'html');
    const localHtmlDir = path.join(this.localDataDir, 'html');

    if (!fs.existsSync(productionHtmlDir) || !fs.existsSync(localHtmlDir)) {
      htmlComparison.error = 'HTML directories not found. Run analysis first.';
      return htmlComparison;
    }

    const productionFiles = fs.readdirSync(productionHtmlDir).filter(f => f.endsWith('.html'));
    const localFiles = fs.readdirSync(localHtmlDir).filter(f => f.endsWith('.html'));

    // Compare each page in detail
    for (const file of productionFiles) {
      if (localFiles.includes(file)) {
        const productionHtml = fs.readFileSync(path.join(productionHtmlDir, file), 'utf8');
        const localHtml = fs.readFileSync(path.join(localHtmlDir, file), 'utf8');
        
        htmlComparison.pageComparisons[file] = await this.compareHTMLPages(productionHtml, localHtml, file);
      } else {
        htmlComparison.pageComparisons[file] = {
          status: 'missing_local',
          message: 'Page exists in production but not in local build',
          severity: 'high'
        };
      }
    }

    // Check for local-only pages
    for (const file of localFiles) {
      if (!productionFiles.includes(file)) {
        htmlComparison.pageComparisons[file] = {
          status: 'local_only',
          message: 'Page exists in local build but not in production',
          severity: 'medium'
        };
      }
    }

    // Generate summary
    htmlComparison.summary = this.generateHTMLSummary(htmlComparison);
    
    return htmlComparison;
  }

  async compareHTMLPages(productionHtml, localHtml, pageName) {
    const comparison = {
      pageName,
      status: 'compared',
      differences: [],
      structuralDifferences: [],
      contentDifferences: [],
      metaDifferences: [],
      sizeDifference: localHtml.length - productionHtml.length,
      similarity: 0
    };

    try {
      // Parse HTML using JSDOM for detailed comparison
      const prodDOM = new JSDOM(productionHtml);
      const localDOM = new JSDOM(localHtml);
      
      const prodDoc = prodDOM.window.document;
      const localDoc = localDOM.window.document;

      // Compare document structure
      comparison.structuralDifferences = this.compareDocumentStructure(prodDoc, localDoc);
      
      // Compare meta information
      comparison.metaDifferences = this.compareMetaInformation(prodDoc, localDoc);
      
      // Compare content
      comparison.contentDifferences = this.compareContent(prodDoc, localDoc);
      
      // Compare CSS references
      comparison.cssReferences = this.compareCSSReferences(prodDoc, localDoc);
      
      // Compare JavaScript references
      comparison.jsReferences = this.compareJSReferences(prodDoc, localDoc);
      
      // Calculate overall similarity
      comparison.similarity = this.calculateHTMLSimilarity(comparison);
      
      // Combine all differences
      comparison.differences = [
        ...comparison.structuralDifferences,
        ...comparison.metaDifferences,
        ...comparison.contentDifferences,
        ...comparison.cssReferences.differences,
        ...comparison.jsReferences.differences
      ];

    } catch (error) {
      comparison.error = `Failed to parse HTML: ${error.message}`;
      comparison.status = 'error';
    }

    return comparison;
  }

  compareDocumentStructure(prodDoc, localDoc) {
    const differences = [];
    
    // Compare basic structure elements
    const structureElements = ['header', 'nav', 'main', 'section', 'article', 'aside', 'footer'];
    
    structureElements.forEach(tagName => {
      const prodCount = prodDoc.querySelectorAll(tagName).length;
      const localCount = localDoc.querySelectorAll(tagName).length;
      
      if (prodCount !== localCount) {
        differences.push({
          type: 'structural',
          element: tagName,
          production: prodCount,
          local: localCount,
          severity: 'medium',
          description: `${tagName} element count differs: production has ${prodCount}, local has ${localCount}`
        });
      }
    });

    // Compare class usage
    const prodClasses = this.extractClasses(prodDoc);
    const localClasses = this.extractClasses(localDoc);
    
    const missingClasses = prodClasses.filter(cls => !localClasses.includes(cls));
    const extraClasses = localClasses.filter(cls => !prodClasses.includes(cls));
    
    if (missingClasses.length > 0) {
      differences.push({
        type: 'structural',
        element: 'classes',
        subtype: 'missing',
        classes: missingClasses,
        severity: 'high',
        description: `Missing CSS classes in local: ${missingClasses.slice(0, 10).join(', ')}${missingClasses.length > 10 ? '...' : ''}`
      });
    }
    
    if (extraClasses.length > 0) {
      differences.push({
        type: 'structural',
        element: 'classes',
        subtype: 'extra',
        classes: extraClasses,
        severity: 'low',
        description: `Extra CSS classes in local: ${extraClasses.slice(0, 10).join(', ')}${extraClasses.length > 10 ? '...' : ''}`
      });
    }

    return differences;
  }

  compareMetaInformation(prodDoc, localDoc) {
    const differences = [];
    
    // Compare title
    const prodTitle = prodDoc.title;
    const localTitle = localDoc.title;
    
    if (prodTitle !== localTitle) {
      differences.push({
        type: 'meta',
        element: 'title',
        production: prodTitle,
        local: localTitle,
        severity: 'high',
        description: 'Page titles differ'
      });
    }

    // Compare meta tags
    const prodMeta = this.extractMetaTags(prodDoc);
    const localMeta = this.extractMetaTags(localDoc);
    
    // Check for missing meta tags
    Object.keys(prodMeta).forEach(key => {
      if (!localMeta[key]) {
        differences.push({
          type: 'meta',
          element: 'meta-tag',
          subtype: 'missing',
          key: key,
          value: prodMeta[key],
          severity: 'medium',
          description: `Missing meta tag: ${key}`
        });
      } else if (prodMeta[key] !== localMeta[key]) {
        differences.push({
          type: 'meta',
          element: 'meta-tag',
          subtype: 'different',
          key: key,
          production: prodMeta[key],
          local: localMeta[key],
          severity: 'medium',
          description: `Meta tag value differs: ${key}`
        });
      }
    });

    return differences;
  }

  compareContent(prodDoc, localDoc) {
    const differences = [];
    
    // Compare text content length
    const prodTextLength = prodDoc.body.textContent.length;
    const localTextLength = localDoc.body.textContent.length;
    
    if (Math.abs(prodTextLength - localTextLength) > 100) {
      differences.push({
        type: 'content',
        element: 'text-length',
        production: prodTextLength,
        local: localTextLength,
        difference: localTextLength - prodTextLength,
        severity: 'medium',
        description: `Text content length differs by ${Math.abs(localTextLength - prodTextLength)} characters`
      });
    }

    // Compare image sources
    const prodImages = Array.from(prodDoc.querySelectorAll('img')).map(img => img.src);
    const localImages = Array.from(localDoc.querySelectorAll('img')).map(img => img.src);
    
    const missingImages = prodImages.filter(src => !localImages.includes(src));
    const extraImages = localImages.filter(src => !prodImages.includes(src));
    
    if (missingImages.length > 0) {
      differences.push({
        type: 'content',
        element: 'images',
        subtype: 'missing',
        images: missingImages,
        severity: 'high',
        description: `Missing images in local: ${missingImages.length} images`
      });
    }

    if (extraImages.length > 0) {
      differences.push({
        type: 'content',
        element: 'images',
        subtype: 'extra',
        images: extraImages,
        severity: 'low',
        description: `Extra images in local: ${extraImages.length} images`
      });
    }

    return differences;
  }

  compareCSSReferences(prodDoc, localDoc) {
    const prodCSS = Array.from(prodDoc.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href);
    const localCSS = Array.from(localDoc.querySelectorAll('link[rel="stylesheet"]')).map(link => link.href);
    
    const missingCSS = prodCSS.filter(href => !localCSS.includes(href));
    const extraCSS = localCSS.filter(href => !prodCSS.includes(href));
    
    const differences = [];
    
    if (missingCSS.length > 0) {
      differences.push({
        type: 'css-reference',
        subtype: 'missing',
        stylesheets: missingCSS,
        severity: 'high',
        description: `Missing CSS references: ${missingCSS.length} stylesheets`
      });
    }
    
    if (extraCSS.length > 0) {
      differences.push({
        type: 'css-reference',
        subtype: 'extra',
        stylesheets: extraCSS,
        severity: 'low',
        description: `Extra CSS references: ${extraCSS.length} stylesheets`
      });
    }

    return {
      production: prodCSS,
      local: localCSS,
      missing: missingCSS,
      extra: extraCSS,
      differences
    };
  }

  compareJSReferences(prodDoc, localDoc) {
    const prodJS = Array.from(prodDoc.querySelectorAll('script[src]')).map(script => script.src);
    const localJS = Array.from(localDoc.querySelectorAll('script[src]')).map(script => script.src);
    
    const missingJS = prodJS.filter(src => !localJS.includes(src));
    const extraJS = localJS.filter(src => !prodJS.includes(src));
    
    const differences = [];
    
    if (missingJS.length > 0) {
      differences.push({
        type: 'js-reference',
        subtype: 'missing',
        scripts: missingJS,
        severity: 'high',
        description: `Missing JavaScript references: ${missingJS.length} scripts`
      });
    }
    
    if (extraJS.length > 0) {
      differences.push({
        type: 'js-reference',
        subtype: 'extra',
        scripts: extraJS,
        severity: 'low',
        description: `Extra JavaScript references: ${extraJS.length} scripts`
      });
    }

    return {
      production: prodJS,
      local: localJS,
      missing: missingJS,
      extra: extraJS,
      differences
    };
  }

  extractClasses(doc) {
    const classes = new Set();
    const elements = doc.querySelectorAll('[class]');
    
    elements.forEach(element => {
      const classList = element.className.split(/\s+/).filter(cls => cls.trim());
      classList.forEach(cls => classes.add(cls));
    });
    
    return Array.from(classes);
  }

  extractMetaTags(doc) {
    const meta = {};
    const metaTags = doc.querySelectorAll('meta');
    
    metaTags.forEach(tag => {
      const name = tag.getAttribute('name') || tag.getAttribute('property');
      const content = tag.getAttribute('content');
      
      if (name && content) {
        meta[name] = content;
      }
    });
    
    return meta;
  }

  calculateHTMLSimilarity(comparison) {
    let totalDifferences = comparison.differences.length;
    let criticalDifferences = comparison.differences.filter(diff => diff.severity === 'high').length;
    
    // Simple similarity calculation - can be enhanced
    if (totalDifferences === 0) return 1.0;
    
    const similarityScore = Math.max(0, 1 - (criticalDifferences * 0.2 + totalDifferences * 0.05));
    return Math.round(similarityScore * 100) / 100;
  }

  generateHTMLSummary(htmlComparison) {
    const pages = Object.keys(htmlComparison.pageComparisons);
    const totalDifferences = pages.reduce((sum, page) => {
      const comp = htmlComparison.pageComparisons[page];
      return sum + (comp.differences ? comp.differences.length : 0);
    }, 0);
    
    const avgSimilarity = pages.reduce((sum, page) => {
      const comp = htmlComparison.pageComparisons[page];
      return sum + (comp.similarity || 0);
    }, 0) / pages.length;

    return {
      totalPages: pages.length,
      totalDifferences,
      averageSimilarity: Math.round(avgSimilarity * 100) / 100,
      pagesWithIssues: pages.filter(page => {
        const comp = htmlComparison.pageComparisons[page];
        return comp.differences && comp.differences.length > 0;
      }).length
    };
  }

  /**
   * CSS Comparison Functions
   */
  async compareCSS() {
    console.log('🎨 Performing detailed CSS comparison...');
    
    const cssComparison = {
      frameworkDifferences: [],
      styleDifferences: [],
      selectorDifferences: [],
      propertyDifferences: [],
      sizeDifferences: [],
      summary: {}
    };

    // Load CSS analyses
    const prodCSSPath = path.join(this.productionDataDir, 'metadata', 'css-analysis.json');
    const localCSSPath = path.join(this.localDataDir, 'metadata', 'local-css-analysis.json');

    let productionCSS = null;
    let localCSS = null;

    try {
      if (fs.existsSync(prodCSSPath)) {
        productionCSS = JSON.parse(fs.readFileSync(prodCSSPath, 'utf8'));
      }
      if (fs.existsSync(localCSSPath)) {
        localCSS = JSON.parse(fs.readFileSync(localCSSPath, 'utf8'));
      }
    } catch (error) {
      cssComparison.error = `Failed to load CSS analyses: ${error.message}`;
      return cssComparison;
    }

    if (!productionCSS || !localCSS) {
      cssComparison.error = 'CSS analysis data missing. Run CSS analysis first.';
      return cssComparison;
    }

    // Compare frameworks
    cssComparison.frameworkDifferences = this.compareFrameworks(productionCSS, localCSS);
    
    // Compare file sizes
    cssComparison.sizeDifferences = this.compareCSSSize(productionCSS, localCSS);
    
    // Compare selectors
    cssComparison.selectorDifferences = this.compareSelectors(productionCSS, localCSS);
    
    // Compare properties
    cssComparison.propertyDifferences = this.compareProperties(productionCSS, localCSS);
    
    // Compare individual CSS files
    cssComparison.fileDifferences = this.compareCSSFiles(productionCSS, localCSS);
    
    // Generate summary
    cssComparison.summary = this.generateCSSSummary(cssComparison);
    
    return cssComparison;
  }

  compareFrameworks(productionCSS, localCSS) {
    const differences = [];
    
    const prodFrameworks = new Set(productionCSS.summary?.detectedFrameworks || []);
    const localFrameworks = new Set(localCSS.summary?.detectedFrameworks || []);
    
    const missingFrameworks = [...prodFrameworks].filter(f => !localFrameworks.has(f));
    const extraFrameworks = [...localFrameworks].filter(f => !prodFrameworks.has(f));
    
    if (missingFrameworks.length > 0) {
      differences.push({
        type: 'framework',
        subtype: 'missing',
        frameworks: missingFrameworks,
        severity: 'high',
        description: `Missing CSS frameworks in local: ${missingFrameworks.join(', ')}`
      });
    }
    
    if (extraFrameworks.length > 0) {
      differences.push({
        type: 'framework',
        subtype: 'extra',
        frameworks: extraFrameworks,
        severity: 'low',
        description: `Extra CSS frameworks in local: ${extraFrameworks.join(', ')}`
      });
    }

    return differences;
  }

  compareCSSSize(productionCSS, localCSS) {
    const differences = [];
    
    const prodSize = productionCSS.summary?.totalSize || 0;
    const localSize = localCSS.summary?.totalSize || 0;
    const sizeDiff = localSize - prodSize;
    
    if (Math.abs(sizeDiff) > 10000) { // 10KB threshold
      differences.push({
        type: 'size',
        production: prodSize,
        local: localSize,
        difference: sizeDiff,
        percentageDiff: prodSize > 0 ? Math.round((sizeDiff / prodSize) * 100) : 0,
        severity: Math.abs(sizeDiff) > 50000 ? 'high' : 'medium',
        description: `CSS size differs by ${(sizeDiff / 1024).toFixed(2)} KB (${sizeDiff > 0 ? 'larger' : 'smaller'} locally)`
      });
    }

    return differences;
  }

  compareSelectors(productionCSS, localCSS) {
    const differences = [];
    
    const prodSelectors = new Set(Object.keys(productionCSS.selectorsCount || {}));
    const localSelectors = new Set(Object.keys(localCSS.selectorsCount || {}));
    
    const missingSelectors = [...prodSelectors].filter(sel => !localSelectors.has(sel));
    const extraSelectors = [...localSelectors].filter(sel => !prodSelectors.has(sel));
    
    if (missingSelectors.length > 0) {
      differences.push({
        type: 'selectors',
        subtype: 'missing',
        count: missingSelectors.length,
        selectors: missingSelectors.slice(0, 20), // Limit for readability
        severity: missingSelectors.length > 50 ? 'high' : 'medium',
        description: `Missing CSS selectors in local: ${missingSelectors.length} selectors`
      });
    }
    
    if (extraSelectors.length > 0) {
      differences.push({
        type: 'selectors',
        subtype: 'extra',
        count: extraSelectors.length,
        selectors: extraSelectors.slice(0, 20),
        severity: 'low',
        description: `Extra CSS selectors in local: ${extraSelectors.length} selectors`
      });
    }

    return differences;
  }

  compareProperties(productionCSS, localCSS) {
    const differences = [];
    
    const prodProperties = new Set(Object.keys(productionCSS.propertiesCount || {}));
    const localProperties = new Set(Object.keys(localCSS.propertiesCount || {}));
    
    const missingProperties = [...prodProperties].filter(prop => !localProperties.has(prop));
    const extraProperties = [...localProperties].filter(prop => !prodProperties.has(prop));
    
    if (missingProperties.length > 0) {
      differences.push({
        type: 'properties',
        subtype: 'missing',
        count: missingProperties.length,
        properties: missingProperties,
        severity: 'medium',
        description: `Missing CSS properties in local: ${missingProperties.join(', ')}`
      });
    }
    
    if (extraProperties.length > 0) {
      differences.push({
        type: 'properties',
        subtype: 'extra',
        count: extraProperties.length,
        properties: extraProperties,
        severity: 'low',
        description: `Extra CSS properties in local: ${extraProperties.join(', ')}`
      });
    }

    return differences;
  }

  compareCSSFiles(productionCSS, localCSS) {
    const differences = [];
    
    const prodFiles = productionCSS.files || [];
    const localFiles = localCSS.files || [];
    
    const prodFileNames = prodFiles.map(f => f.fileName);
    const localFileNames = localFiles.map(f => f.fileName);
    
    const missingFiles = prodFileNames.filter(name => !localFileNames.includes(name));
    const extraFiles = localFileNames.filter(name => !prodFileNames.includes(name));
    
    if (missingFiles.length > 0) {
      differences.push({
        type: 'files',
        subtype: 'missing',
        files: missingFiles,
        severity: 'high',
        description: `Missing CSS files in local: ${missingFiles.join(', ')}`
      });
    }
    
    if (extraFiles.length > 0) {
      differences.push({
        type: 'files',
        subtype: 'extra',
        files: extraFiles,
        severity: 'low',
        description: `Extra CSS files in local: ${extraFiles.join(', ')}`
      });
    }

    return differences;
  }

  generateCSSSummary(cssComparison) {
    const allDifferences = [
      ...cssComparison.frameworkDifferences,
      ...cssComparison.sizeDifferences,
      ...cssComparison.selectorDifferences,
      ...cssComparison.propertyDifferences,
      ...cssComparison.fileDifferences
    ];

    return {
      totalDifferences: allDifferences.length,
      highSeverityIssues: allDifferences.filter(diff => diff.severity === 'high').length,
      mediumSeverityIssues: allDifferences.filter(diff => diff.severity === 'medium').length,
      lowSeverityIssues: allDifferences.filter(diff => diff.severity === 'low').length
    };
  }

  /**
   * Asset Comparison Functions
   */
  async compareAssets() {
    console.log('🖼️ Performing detailed asset comparison...');
    
    const assetComparison = {
      imageDifferences: [],
      fontDifferences: [],
      scriptDifferences: [],
      pathDifferences: [],
      availabilityDifferences: [],
      summary: {}
    };

    // Load asset inventories
    const prodAssetsPath = path.join(this.productionDataDir, 'metadata', 'asset-inventory.json');
    const localAssetsPath = path.join(this.localDataDir, 'metadata', 'local-asset-inventory.json');

    let productionAssets = {};
    let localAssets = {};

    try {
      if (fs.existsSync(prodAssetsPath)) {
        productionAssets = JSON.parse(fs.readFileSync(prodAssetsPath, 'utf8'));
      }
      if (fs.existsSync(localAssetsPath)) {
        localAssets = JSON.parse(fs.readFileSync(localAssetsPath, 'utf8'));
      }
    } catch (error) {
      assetComparison.error = `Failed to load asset inventories: ${error.message}`;
      return assetComparison;
    }

    // Compare different asset types
    assetComparison.imageDifferences = this.compareAssetType(
      productionAssets.images || [],
      localAssets.images || [],
      'images'
    );
    
    assetComparison.fontDifferences = this.compareAssetType(
      productionAssets.fonts || [],
      localAssets.fonts || [],
      'fonts'
    );
    
    assetComparison.scriptDifferences = this.compareAssetType(
      productionAssets.scripts || [],
      localAssets.scripts || [],
      'scripts'
    );

    // Analyze asset paths for differences
    assetComparison.pathDifferences = this.compareAssetPaths(productionAssets, localAssets);
    
    // Generate summary
    assetComparison.summary = this.generateAssetSummary(assetComparison);
    
    return assetComparison;
  }

  compareAssetType(productionList, localList, assetType) {
    const differences = [];
    
    const prodSet = new Set(productionList);
    const localSet = new Set(localList);
    
    const missing = productionList.filter(asset => !localSet.has(asset));
    const extra = localList.filter(asset => !prodSet.has(asset));
    
    if (missing.length > 0) {
      differences.push({
        type: assetType,
        subtype: 'missing',
        count: missing.length,
        assets: missing.slice(0, 20), // Limit for readability
        severity: 'high',
        description: `Missing ${assetType} in local: ${missing.length} ${assetType}`
      });
    }
    
    if (extra.length > 0) {
      differences.push({
        type: assetType,
        subtype: 'extra',
        count: extra.length,
        assets: extra.slice(0, 20),
        severity: 'low',
        description: `Extra ${assetType} in local: ${extra.length} ${assetType}`
      });
    }

    return differences;
  }

  compareAssetPaths(productionAssets, localAssets) {
    const differences = [];
    
    // Compare asset path patterns
    const prodPaths = [...(productionAssets.images || []), ...(productionAssets.scripts || [])];
    const localPaths = [...(localAssets.images || []), ...(localAssets.scripts || [])];
    
    // Analyze path patterns
    const prodPathPatterns = this.analyzePathPatterns(prodPaths);
    const localPathPatterns = this.analyzePathPatterns(localPaths);
    
    // Compare CDN usage
    const prodCDN = prodPaths.filter(path => this.isCDNPath(path)).length;
    const localCDN = localPaths.filter(path => this.isCDNPath(path)).length;
    
    if (prodCDN !== localCDN) {
      differences.push({
        type: 'path-pattern',
        subtype: 'cdn-usage',
        production: prodCDN,
        local: localCDN,
        severity: 'medium',
        description: `CDN usage differs: production uses ${prodCDN} CDN assets, local uses ${localCDN}`
      });
    }
    
    // Compare relative vs absolute paths
    const prodRelative = prodPaths.filter(path => this.isRelativePath(path)).length;
    const localRelative = localPaths.filter(path => this.isRelativePath(path)).length;
    
    if (Math.abs(prodRelative - localRelative) > 5) {
      differences.push({
        type: 'path-pattern',
        subtype: 'relative-paths',
        production: prodRelative,
        local: localRelative,
        severity: 'medium',
        description: `Relative path usage differs significantly`
      });
    }

    return differences;
  }

  analyzePathPatterns(paths) {
    return {
      cdn: paths.filter(path => this.isCDNPath(path)).length,
      relative: paths.filter(path => this.isRelativePath(path)).length,
      absolute: paths.filter(path => this.isAbsolutePath(path)).length,
      dataUrls: paths.filter(path => path.startsWith('data:')).length
    };
  }

  isCDNPath(path) {
    return /^https?:\/\/(?:cdn\.|assets\.|static\.)/.test(path) || 
           path.includes('cloudfront') || 
           path.includes('jsdelivr') || 
           path.includes('unpkg');
  }

  isRelativePath(path) {
    return !path.startsWith('http') && !path.startsWith('//') && !path.startsWith('data:');
  }

  isAbsolutePath(path) {
    return path.startsWith('http') || path.startsWith('//');
  }

  generateAssetSummary(assetComparison) {
    const allDifferences = [
      ...assetComparison.imageDifferences,
      ...assetComparison.fontDifferences,
      ...assetComparison.scriptDifferences,
      ...assetComparison.pathDifferences
    ];

    return {
      totalDifferences: allDifferences.length,
      highSeverityIssues: allDifferences.filter(diff => diff.severity === 'high').length,
      mediumSeverityIssues: allDifferences.filter(diff => diff.severity === 'medium').length,
      lowSeverityIssues: allDifferences.filter(diff => diff.severity === 'low').length
    };
  }

  /**
   * Configuration Comparison Functions
   */
  async compareConfigurations() {
    console.log('🔧 Performing configuration comparison...');
    
    const configComparison = {
      nextConfigDifferences: [],
      packageJsonDifferences: [],
      vercelConfigDifferences: [],
      buildConfigDifferences: [],
      summary: {}
    };

    // Compare Next.js configuration
    configComparison.nextConfigDifferences = await this.compareNextConfig();
    
    // Compare package.json
    configComparison.packageJsonDifferences = await this.comparePackageJson();
    
    // Compare Vercel configuration
    configComparison.vercelConfigDifferences = await this.compareVercelConfig();
    
    // Compare build settings
    configComparison.buildConfigDifferences = await this.compareBuildSettings();
    
    // Generate summary
    configComparison.summary = this.generateConfigSummary(configComparison);
    
    return configComparison;
  }

  async compareNextConfig() {
    const differences = [];
    
    const nextConfigPath = path.join(__dirname, '../../next.config.js');
    const nextConfigTsPath = path.join(__dirname, '../../next.config.ts');
    
    let configExists = false;
    let configContent = '';
    
    if (fs.existsSync(nextConfigPath)) {
      configExists = true;
      configContent = fs.readFileSync(nextConfigPath, 'utf8');
    } else if (fs.existsSync(nextConfigTsPath)) {
      configExists = true;
      configContent = fs.readFileSync(nextConfigTsPath, 'utf8');
    }
    
    if (!configExists) {
      differences.push({
        type: 'next-config',
        subtype: 'missing',
        severity: 'medium',
        description: 'No Next.js configuration file found'
      });
    } else {
      // Analyze configuration content
      const configAnalysis = this.analyzeNextConfig(configContent);
      
      // Check for common production settings
      if (!configAnalysis.hasTrailingSlash) {
        differences.push({
          type: 'next-config',
          subtype: 'setting',
          setting: 'trailingSlash',
          severity: 'low',
          description: 'trailingSlash setting not configured'
        });
      }
      
      if (!configAnalysis.hasImageOptimization) {
        differences.push({
          type: 'next-config',
          subtype: 'setting',
          setting: 'images',
          severity: 'medium',
          description: 'Image optimization not configured'
        });
      }
    }
    
    return differences;
  }

  analyzeNextConfig(configContent) {
    return {
      hasTrailingSlash: configContent.includes('trailingSlash'),
      hasImageOptimization: configContent.includes('images'),
      hasExperimental: configContent.includes('experimental'),
      hasOutput: configContent.includes('output'),
      hasAssetPrefix: configContent.includes('assetPrefix')
    };
  }

  async comparePackageJson() {
    const differences = [];
    
    const packageJsonPath = path.join(__dirname, '../../package.json');
    
    if (!fs.existsSync(packageJsonPath)) {
      differences.push({
        type: 'package-json',
        subtype: 'missing',
        severity: 'high',
        description: 'package.json not found'
      });
      return differences;
    }
    
    try {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      
      // Check for essential scripts
      const requiredScripts = ['build', 'start', 'dev'];
      requiredScripts.forEach(script => {
        if (!packageJson.scripts || !packageJson.scripts[script]) {
          differences.push({
            type: 'package-json',
            subtype: 'missing-script',
            script: script,
            severity: 'high',
            description: `Missing required script: ${script}`
          });
        }
      });
      
      // Check for Next.js dependency
      if (!packageJson.dependencies || !packageJson.dependencies.next) {
        differences.push({
          type: 'package-json',
          subtype: 'missing-dependency',
          dependency: 'next',
          severity: 'high',
          description: 'Next.js dependency not found'
        });
      }
      
    } catch (error) {
      differences.push({
        type: 'package-json',
        subtype: 'parse-error',
        severity: 'high',
        description: `Failed to parse package.json: ${error.message}`
      });
    }
    
    return differences;
  }

  async compareVercelConfig() {
    const differences = [];
    
    const vercelJsonPath = path.join(__dirname, '../../vercel.json');
    
    if (fs.existsSync(vercelJsonPath)) {
      try {
        const vercelConfig = JSON.parse(fs.readFileSync(vercelJsonPath, 'utf8'));
        
        // Analyze Vercel configuration
        if (vercelConfig.builds) {
          differences.push({
            type: 'vercel-config',
            subtype: 'legacy-builds',
            severity: 'medium',
            description: 'Using legacy builds configuration (consider migrating to Build Output API)'
          });
        }
        
        if (!vercelConfig.headers && !vercelConfig.redirects) {
          differences.push({
            type: 'vercel-config',
            subtype: 'missing-optimization',
            severity: 'low',
            description: 'No headers or redirects configured for optimization'
          });
        }
        
      } catch (error) {
        differences.push({
          type: 'vercel-config',
          subtype: 'parse-error',
          severity: 'medium',
          description: `Failed to parse vercel.json: ${error.message}`
        });
      }
    } else {
      differences.push({
        type: 'vercel-config',
        subtype: 'missing',
        severity: 'low',
        description: 'No vercel.json configuration found'
      });
    }
    
    return differences;
  }

  async compareBuildSettings() {
    const differences = [];
    
    // Check for build output
    const buildDir = path.join(__dirname, '../../.next');
    
    if (!fs.existsSync(buildDir)) {
      differences.push({
        type: 'build',
        subtype: 'no-build',
        severity: 'high',
        description: 'No build output found (.next directory missing)'
      });
    } else {
      // Analyze build output
      const buildManifest = path.join(buildDir, 'build-manifest.json');
      if (!fs.existsSync(buildManifest)) {
        differences.push({
          type: 'build',
          subtype: 'incomplete-build',
          severity: 'medium',
          description: 'Build appears incomplete (missing build-manifest.json)'
        });
      }
    }
    
    return differences;
  }

  generateConfigSummary(configComparison) {
    const allDifferences = [
      ...configComparison.nextConfigDifferences,
      ...configComparison.packageJsonDifferences,
      ...configComparison.vercelConfigDifferences,
      ...configComparison.buildConfigDifferences
    ];

    return {
      totalDifferences: allDifferences.length,
      highSeverityIssues: allDifferences.filter(diff => diff.severity === 'high').length,
      mediumSeverityIssues: allDifferences.filter(diff => diff.severity === 'medium').length,
      lowSeverityIssues: allDifferences.filter(diff => diff.severity === 'low').length
    };
  }

  /**
   * Main execution function
   */
  async runComprehensiveComparison() {
    console.log('🔍 Starting comprehensive difference detection...\n');
    
    const comparison = {
      metadata: {
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      },
      htmlComparison: null,
      cssComparison: null,
      assetComparison: null,
      configComparison: null,
      summary: {}
    };

    try {
      // Run all comparisons
      comparison.htmlComparison = await this.compareHTML();
      comparison.cssComparison = await this.compareCSS();
      comparison.assetComparison = await this.compareAssets();
      comparison.configComparison = await this.compareConfigurations();
      
      // Generate overall summary
      comparison.summary = this.generateOverallSummary(comparison);
      
      // Save comprehensive comparison
      const outputPath = path.join(this.outputDir, 'comprehensive-differences.json');
      fs.writeFileSync(outputPath, JSON.stringify(comparison, null, 2));
      
      // Generate human-readable report
      this.generateDifferenceReport(comparison);
      
      console.log('\n✅ Comprehensive difference detection complete!');
      console.log(`📁 Results saved to: ${this.outputDir}`);
      
      return comparison;
      
    } catch (error) {
      console.error('\n❌ Difference detection failed:', error.message);
      console.error(error.stack);
      throw error;
    }
  }

  generateOverallSummary(comparison) {
    const htmlIssues = comparison.htmlComparison?.summary?.totalDifferences || 0;
    const cssIssues = comparison.cssComparison?.summary?.totalDifferences || 0;
    const assetIssues = comparison.assetComparison?.summary?.totalDifferences || 0;
    const configIssues = comparison.configComparison?.summary?.totalDifferences || 0;
    
    const totalIssues = htmlIssues + cssIssues + assetIssues + configIssues;
    
    const highSeverity = (comparison.htmlComparison?.summary?.highSeverityIssues || 0) +
                        (comparison.cssComparison?.summary?.highSeverityIssues || 0) +
                        (comparison.assetComparison?.summary?.highSeverityIssues || 0) +
                        (comparison.configComparison?.summary?.highSeverityIssues || 0);

    return {
      totalDifferences: totalIssues,
      highSeverityIssues: highSeverity,
      htmlIssues,
      cssIssues,
      assetIssues,
      configIssues,
      overallHealth: this.calculateOverallHealth(totalIssues, highSeverity)
    };
  }

  calculateOverallHealth(totalIssues, highSeverity) {
    if (highSeverity > 10) return 'poor';
    if (totalIssues > 50) return 'fair';
    if (totalIssues > 20) return 'good';
    if (totalIssues > 5) return 'very-good';
    return 'excellent';
  }

  generateDifferenceReport(comparison) {
    console.log('📝 Generating difference report...');
    
    let report = `# Production Parity Difference Report

Generated: ${new Date().toLocaleString()}

## Executive Summary

This report identifies all differences between the production site and local build that need to be addressed for complete parity.

**Overall Health**: ${comparison.summary.overallHealth.toUpperCase()}
**Total Issues**: ${comparison.summary.totalDifferences}
**High Priority Issues**: ${comparison.summary.highSeverityIssues}

## Issue Breakdown

- **HTML Issues**: ${comparison.summary.htmlIssues}
- **CSS Issues**: ${comparison.summary.cssIssues}  
- **Asset Issues**: ${comparison.summary.assetIssues}
- **Configuration Issues**: ${comparison.summary.configIssues}

`;

    // HTML Issues Section
    if (comparison.htmlComparison && comparison.summary.htmlIssues > 0) {
      report += `## HTML Differences

`;
      Object.keys(comparison.htmlComparison.pageComparisons).forEach(page => {
        const pageComp = comparison.htmlComparison.pageComparisons[page];
        if (pageComp.differences && pageComp.differences.length > 0) {
          report += `### ${page}

`;
          pageComp.differences.forEach(diff => {
            report += `- **${diff.severity.toUpperCase()}**: ${diff.description}
`;
          });
          report += `
`;
        }
      });
    }

    // CSS Issues Section
    if (comparison.cssComparison && comparison.summary.cssIssues > 0) {
      report += `## CSS Differences

`;
      const cssTypes = ['frameworkDifferences', 'sizeDifferences', 'selectorDifferences', 'propertyDifferences', 'fileDifferences'];
      
      cssTypes.forEach(type => {
        const differences = comparison.cssComparison[type] || [];
        if (differences.length > 0) {
          report += `### ${type.replace('Differences', '').replace(/([A-Z])/g, ' $1').trim()}

`;
          differences.forEach(diff => {
            report += `- **${diff.severity.toUpperCase()}**: ${diff.description}
`;
          });
          report += `
`;
        }
      });
    }

    // Asset Issues Section
    if (comparison.assetComparison && comparison.summary.assetIssues > 0) {
      report += `## Asset Differences

`;
      const assetTypes = ['imageDifferences', 'fontDifferences', 'scriptDifferences', 'pathDifferences'];
      
      assetTypes.forEach(type => {
        const differences = comparison.assetComparison[type] || [];
        if (differences.length > 0) {
          report += `### ${type.replace('Differences', '').replace(/([A-Z])/g, ' $1').trim()}

`;
          differences.forEach(diff => {
            report += `- **${diff.severity.toUpperCase()}**: ${diff.description}
`;
          });
          report += `
`;
        }
      });
    }

    // Configuration Issues Section
    if (comparison.configComparison && comparison.summary.configIssues > 0) {
      report += `## Configuration Differences

`;
      const configTypes = ['nextConfigDifferences', 'packageJsonDifferences', 'vercelConfigDifferences', 'buildConfigDifferences'];
      
      configTypes.forEach(type => {
        const differences = comparison.configComparison[type] || [];
        if (differences.length > 0) {
          report += `### ${type.replace('Differences', '').replace(/([A-Z])/g, ' $1').trim()}

`;
          differences.forEach(diff => {
            report += `- **${diff.severity.toUpperCase()}**: ${diff.description}
`;
          });
          report += `
`;
        }
      });
    }

    // Recommendations Section
    report += `## Recommended Actions

### High Priority (Fix First)
`;
    
    if (comparison.summary.highSeverityIssues > 0) {
      report += `1. Address all HIGH severity issues identified above
2. Focus on missing frameworks and assets first
3. Fix configuration issues that prevent proper builds
4. Resolve missing CSS and JavaScript references

`;
    } else {
      report += `No high priority issues found! 🎉

`;
    }

    report += `### Medium Priority
1. Review CSS size differences and optimize if needed
2. Align asset loading patterns between environments
3. Update configuration files for better production alignment

### Low Priority
1. Clean up extra assets and references not used in production
2. Optimize build configuration for better performance
3. Consider implementing additional production optimizations

## Next Steps

1. **Fix High Priority Issues**: Start with the most critical differences
2. **Test Changes**: Verify each fix doesn't break existing functionality  
3. **Re-run Analysis**: Use this tool again to verify fixes
4. **Monitor**: Set up regular parity checks to catch future drift

`;

    const reportPath = path.join(this.outputDir, 'difference-report.md');
    fs.writeFileSync(reportPath, report);
    
    console.log(`  ✅ Difference report saved to: ${reportPath}`);
  }
}

// CLI interface
if (require.main === module) {
  const engine = new DifferenceEngine();
  engine.runComprehensiveComparison();
}

module.exports = DifferenceEngine;