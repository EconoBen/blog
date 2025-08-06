#!/usr/bin/env node

/**
 * Production Site Analysis Tool
 * Captures HTML, CSS, and asset data from the production site at econoben.dev
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PRODUCTION_URL = 'https://econoben.dev';
const OUTPUT_DIR = path.join(__dirname, '../../analysis/production-data');

// Key pages to analyze
const KEY_PAGES = [
  { name: 'home', url: '' },
  { name: 'posts', url: '/posts' },
  { name: 'about', url: '/about' },
  { name: 'archive', url: '/archive' },
  { name: 'publications', url: '/publications' },
  { name: 'talks', url: '/talks' },
  { name: 'search', url: '/search' }
];

class ProductionAnalyzer {
  constructor() {
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Create subdirectories
    ['html', 'css', 'assets', 'metadata'].forEach(dir => {
      const dirPath = path.join(OUTPUT_DIR, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  async captureHTML() {
    console.log('📄 Capturing HTML from production pages...');
    
    for (const page of KEY_PAGES) {
      try {
        const url = `${PRODUCTION_URL}${page.url}`;
        console.log(`  Fetching: ${url}`);
        
        // Use curl to fetch HTML with proper headers
        const curlCommand = `curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" "${url}"`;
        const html = execSync(curlCommand, { encoding: 'utf8' });
        
        // Save HTML
        const htmlPath = path.join(OUTPUT_DIR, 'html', `${page.name}.html`);
        fs.writeFileSync(htmlPath, html);
        
        console.log(`  ✅ Saved: ${page.name}.html`);
      } catch (error) {
        console.error(`  ❌ Failed to fetch ${page.name}: ${error.message}`);
      }
    }
  }

  async extractCSSReferences() {
    console.log('🎨 Extracting CSS references from HTML...');
    
    const cssReferences = new Set();
    const htmlDir = path.join(OUTPUT_DIR, 'html');
    
    if (!fs.existsSync(htmlDir)) {
      console.error('HTML directory not found. Run captureHTML first.');
      return;
    }

    const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
    
    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(htmlDir, htmlFile);
      const html = fs.readFileSync(htmlPath, 'utf8');
      
      // Extract CSS link tags (both rel="stylesheet" and href with .css)
      const linkRegex = /<link[^>]*(?:rel=["']stylesheet["'][^>]*href=["']([^"']+)["']|href=["']([^"']+\.css)["'][^>]*rel=["']stylesheet["'])[^>]*>/gi;
      let match;
      
      while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1] || match[2];
        if (href && (href.startsWith('http') || href.startsWith('/'))) {
          cssReferences.add(href.startsWith('/') ? `${PRODUCTION_URL}${href}` : href);
        }
      }
      
      // Also look for any href ending in .css
      const cssHrefRegex = /href=["']([^"']+\.css)["']/gi;
      let cssMatch;
      
      while ((cssMatch = cssHrefRegex.exec(html)) !== null) {
        const href = cssMatch[1];
        if (href && (href.startsWith('http') || href.startsWith('/'))) {
          cssReferences.add(href.startsWith('/') ? `${PRODUCTION_URL}${href}` : href);
        }
      }
      
      // Extract inline styles for analysis
      const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      let styleMatch;
      let inlineStyleCount = 0;
      
      while ((styleMatch = styleRegex.exec(html)) !== null) {
        const inlineCSS = styleMatch[1];
        if (inlineCSS.trim()) {
          const inlineStylePath = path.join(OUTPUT_DIR, 'css', `${htmlFile.replace('.html', '')}-inline-${inlineStyleCount}.css`);
          fs.writeFileSync(inlineStylePath, inlineCSS);
          inlineStyleCount++;
        }
      }
    }

    // Save CSS references list
    const cssRefsPath = path.join(OUTPUT_DIR, 'metadata', 'css-references.json');
    fs.writeFileSync(cssRefsPath, JSON.stringify([...cssReferences], null, 2));
    
    console.log(`  ✅ Found ${cssReferences.size} CSS references`);
    return [...cssReferences];
  }

  async downloadCSS(cssReferences) {
    console.log('⬇️  Downloading CSS files...');
    
    for (const cssUrl of cssReferences) {
      try {
        const urlObj = new URL(cssUrl);
        const filename = path.basename(urlObj.pathname) || 'main.css';
        const cssPath = path.join(OUTPUT_DIR, 'css', filename);
        
        console.log(`  Downloading: ${cssUrl}`);
        
        const curlCommand = `curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" "${cssUrl}"`;
        const css = execSync(curlCommand, { encoding: 'utf8' });
        
        fs.writeFileSync(cssPath, css);
        console.log(`  ✅ Saved: ${filename}`);
      } catch (error) {
        console.error(`  ❌ Failed to download CSS from ${cssUrl}: ${error.message}`);
      }
    }
  }

  async analyzeAssets() {
    console.log('🖼️  Analyzing assets from HTML...');
    
    const assets = {
      images: new Set(),
      fonts: new Set(),
      scripts: new Set(),
      other: new Set()
    };

    const htmlDir = path.join(OUTPUT_DIR, 'html');
    const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
    
    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(htmlDir, htmlFile);
      const html = fs.readFileSync(htmlPath, 'utf8');
      
      // Extract images
      const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
      let imgMatch;
      while ((imgMatch = imgRegex.exec(html)) !== null) {
        const src = imgMatch[1];
        if (src.startsWith('http') || src.startsWith('/')) {
          assets.images.add(src.startsWith('/') ? `${PRODUCTION_URL}${src}` : src);
        }
      }
      
      // Extract scripts
      const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
      let scriptMatch;
      while ((scriptMatch = scriptRegex.exec(html)) !== null) {
        const src = scriptMatch[1];
        if (src.startsWith('http') || src.startsWith('/')) {
          assets.scripts.add(src.startsWith('/') ? `${PRODUCTION_URL}${src}` : src);
        }
      }
      
      // Extract font references from CSS
      const cssDir = path.join(OUTPUT_DIR, 'css');
      if (fs.existsSync(cssDir)) {
        const cssFiles = fs.readdirSync(cssDir).filter(file => file.endsWith('.css'));
        
        for (const cssFile of cssFiles) {
          const cssPath = path.join(cssDir, cssFile);
          const css = fs.readFileSync(cssPath, 'utf8');
          
          // Extract font URLs
          const fontRegex = /url\(['"]?([^'")\s]+\.(woff2?|ttf|otf|eot))['"]?\)/gi;
          let fontMatch;
          while ((fontMatch = fontRegex.exec(css)) !== null) {
            const fontUrl = fontMatch[1];
            if (fontUrl.startsWith('http') || fontUrl.startsWith('/')) {
              assets.fonts.add(fontUrl.startsWith('/') ? `${PRODUCTION_URL}${fontUrl}` : fontUrl);
            }
          }
        }
      }
    }

    // Convert Sets to Arrays and save
    const assetInventory = {
      images: [...assets.images],
      fonts: [...assets.fonts],
      scripts: [...assets.scripts],
      other: [...assets.other],
      summary: {
        totalImages: assets.images.size,
        totalFonts: assets.fonts.size,
        totalScripts: assets.scripts.size,
        totalOther: assets.other.size
      }
    };

    const assetsPath = path.join(OUTPUT_DIR, 'metadata', 'asset-inventory.json');
    fs.writeFileSync(assetsPath, JSON.stringify(assetInventory, null, 2));
    
    console.log(`  ✅ Found ${assetInventory.summary.totalImages} images, ${assetInventory.summary.totalFonts} fonts, ${assetInventory.summary.totalScripts} scripts`);
    return assetInventory;
  }

  async generateSummary() {
    console.log('📊 Generating analysis summary...');
    
    const summary = {
      timestamp: new Date().toISOString(),
      productionUrl: PRODUCTION_URL,
      pagesAnalyzed: KEY_PAGES.length,
      outputDirectory: OUTPUT_DIR
    };

    // Add file counts
    const htmlDir = path.join(OUTPUT_DIR, 'html');
    const cssDir = path.join(OUTPUT_DIR, 'css');
    
    if (fs.existsSync(htmlDir)) {
      summary.htmlFiles = fs.readdirSync(htmlDir).filter(f => f.endsWith('.html')).length;
    }
    
    if (fs.existsSync(cssDir)) {
      summary.cssFiles = fs.readdirSync(cssDir).filter(f => f.endsWith('.css')).length;
    }

    const summaryPath = path.join(OUTPUT_DIR, 'analysis-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log('📋 Analysis Summary:');
    console.log(`  Production URL: ${summary.productionUrl}`);
    console.log(`  Pages analyzed: ${summary.pagesAnalyzed}`);
    console.log(`  HTML files captured: ${summary.htmlFiles || 0}`);
    console.log(`  CSS files downloaded: ${summary.cssFiles || 0}`);
    console.log(`  Output directory: ${summary.outputDirectory}`);
    
    return summary;
  }

  async runFullAnalysis() {
    console.log('🚀 Starting production site analysis...\n');
    
    try {
      // Step 1: Capture HTML
      await this.captureHTML();
      console.log('');
      
      // Step 2: Extract CSS references
      const cssReferences = await this.extractCSSReferences();
      console.log('');
      
      // Step 3: Download CSS files
      if (cssReferences && cssReferences.length > 0) {
        await this.downloadCSS(cssReferences);
        console.log('');
      }
      
      // Step 4: Analyze assets
      await this.analyzeAssets();
      console.log('');
      
      // Step 5: Generate summary
      await this.generateSummary();
      
      console.log('\n✅ Production site analysis complete!');
      console.log(`📁 Results saved to: ${OUTPUT_DIR}`);
      
    } catch (error) {
      console.error('\n❌ Analysis failed:', error.message);
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new ProductionAnalyzer();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'html':
      analyzer.captureHTML();
      break;
    case 'css':
      analyzer.extractCSSReferences().then(refs => {
        if (refs) analyzer.downloadCSS(refs);
      });
      break;
    case 'assets':
      analyzer.analyzeAssets();
      break;
    case 'summary':
      analyzer.generateSummary();
      break;
    default:
      analyzer.runFullAnalysis();
  }
}

module.exports = ProductionAnalyzer;