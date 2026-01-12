#!/usr/bin/env node

/**
 * Local Build Analysis Tool
 * Captures HTML, CSS, and asset data from the local Next.js build
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const LOCAL_URL = 'http://localhost:3000';
const OUTPUT_DIR = path.join(__dirname, '../../analysis/local-data');

// Key pages to analyze (matching production analysis)
const KEY_PAGES = [
  { name: 'home', url: '' },
  { name: 'posts', url: '/posts' },
  { name: 'about', url: '/about' },
  { name: 'archive', url: '/archive' },
  { name: 'publications', url: '/publications' },
  { name: 'talks', url: '/talks' },
  { name: 'search', url: '/search' }
];

class LocalBuildAnalyzer {
  constructor() {
    this.buildDir = path.join(__dirname, '../../.next');
    this.publicDir = path.join(__dirname, '../../public');
    this.appDir = path.join(__dirname, '../../app');
    this.ensureOutputDirectory();
  }

  ensureOutputDirectory() {
    if (!fs.existsSync(OUTPUT_DIR)) {
      fs.mkdirSync(OUTPUT_DIR, { recursive: true });
    }
    
    // Create subdirectories
    ['html', 'css', 'assets', 'metadata', 'build-analysis'].forEach(dir => {
      const dirPath = path.join(OUTPUT_DIR, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
      }
    });
  }

  async generateLocalBuild() {
    console.log('🔨 Generating local production build...');
    
    try {
      // Clean previous build
      if (fs.existsSync(this.buildDir)) {
        console.log('  Cleaning previous build...');
        execSync(`rm -rf ${this.buildDir}`, { stdio: 'inherit' });
      }
      
      // Generate production build
      console.log('  Running Next.js build...');
      execSync('npm run build', { 
        stdio: 'inherit',
        cwd: path.join(__dirname, '../..')
      });
      
      console.log('  ✅ Local build generated successfully');
      
      // Analyze build output
      await this.analyzeBuildOutput();
      
    } catch (error) {
      console.error('  ❌ Build failed:', error.message);
      throw error;
    }
  }

  async analyzeBuildOutput() {
    console.log('📊 Analyzing build output structure...');
    
    const buildAnalysis = {
      timestamp: new Date().toISOString(),
      buildDirectory: this.buildDir,
      structure: {},
      staticFiles: [],
      serverFiles: [],
      cssFiles: [],
      jsFiles: []
    };

    if (!fs.existsSync(this.buildDir)) {
      console.error('Build directory not found. Run build first.');
      return;
    }

    // Analyze .next directory structure
    buildAnalysis.structure = this.analyzeBuildStructure(this.buildDir);
    
    // Find CSS files in build
    buildAnalysis.cssFiles = this.findBuildFiles(this.buildDir, '.css');
    
    // Find JS files in build
    buildAnalysis.jsFiles = this.findBuildFiles(this.buildDir, '.js');
    
    // Analyze static directory
    const staticDir = path.join(this.buildDir, 'static');
    if (fs.existsSync(staticDir)) {
      buildAnalysis.staticFiles = this.analyzeBuildStructure(staticDir);
    }

    // Save build analysis
    const buildAnalysisPath = path.join(OUTPUT_DIR, 'build-analysis', 'build-structure.json');
    fs.writeFileSync(buildAnalysisPath, JSON.stringify(buildAnalysis, null, 2));
    
    console.log(`  ✅ Build analysis saved to: ${buildAnalysisPath}`);
    return buildAnalysis;
  }

  analyzeBuildStructure(directory, relativePath = '') {
    const structure = {};
    
    try {
      const items = fs.readdirSync(directory);
      
      items.forEach(item => {
        const itemPath = path.join(directory, item);
        const itemRelativePath = path.join(relativePath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          structure[item] = {
            type: 'directory',
            path: itemRelativePath,
            contents: this.analyzeBuildStructure(itemPath, itemRelativePath)
          };
        } else {
          structure[item] = {
            type: 'file',
            path: itemRelativePath,
            size: stats.size,
            extension: path.extname(item)
          };
        }
      });
    } catch (error) {
      console.warn(`Warning: Could not analyze directory ${directory}: ${error.message}`);
    }
    
    return structure;
  }

  findBuildFiles(directory, extension) {
    const files = [];
    
    const searchDirectory = (dir, relativePath = '') => {
      try {
        const items = fs.readdirSync(dir);
        
        items.forEach(item => {
          const itemPath = path.join(dir, item);
          const itemRelativePath = path.join(relativePath, item);
          const stats = fs.statSync(itemPath);
          
          if (stats.isDirectory()) {
            searchDirectory(itemPath, itemRelativePath);
          } else if (item.endsWith(extension)) {
            files.push({
              name: item,
              path: itemRelativePath,
              fullPath: itemPath,
              size: stats.size
            });
          }
        });
      } catch (error) {
        // Ignore permission errors
      }
    };
    
    searchDirectory(directory);
    return files;
  }

  async startLocalServer() {
    console.log('🚀 Starting local Next.js server...');
    
    return new Promise((resolve, reject) => {
      // Start the server in the background
      const serverProcess = execSync('npm start &', { 
        stdio: 'pipe',
        cwd: path.join(__dirname, '../..'),
        encoding: 'utf8'
      });
      
      // Wait for server to be ready
      let attempts = 0;
      const maxAttempts = 30;
      
      const checkServer = () => {
        attempts++;
        try {
          execSync(`curl -s -o /dev/null -w "%{http_code}" ${LOCAL_URL}`, { 
            stdio: 'pipe',
            timeout: 2000
          });
          console.log('  ✅ Local server is ready');
          resolve();
        } catch (error) {
          if (attempts < maxAttempts) {
            setTimeout(checkServer, 1000);
          } else {
            reject(new Error('Local server failed to start within timeout'));
          }
        }
      };
      
      setTimeout(checkServer, 2000);
    });
  }

  async captureLocalHTML() {
    console.log('📄 Capturing HTML from local pages...');
    
    for (const page of KEY_PAGES) {
      try {
        const url = `${LOCAL_URL}${page.url}`;
        console.log(`  Fetching: ${url}`);
        
        // Use curl to fetch HTML with proper headers
        const curlCommand = `curl -s -L -H "User-Agent: Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36" "${url}"`;
        const html = execSync(curlCommand, { encoding: 'utf8', timeout: 10000 });
        
        // Save HTML
        const htmlPath = path.join(OUTPUT_DIR, 'html', `${page.name}.html`);
        fs.writeFileSync(htmlPath, html);
        
        console.log(`  ✅ Saved: ${page.name}.html`);
      } catch (error) {
        console.error(`  ❌ Failed to fetch ${page.name}: ${error.message}`);
      }
    }
  }

  async analyzeLocalCSS() {
    console.log('🎨 Analyzing local CSS output...');
    
    const cssAnalysis = {
      buildCSS: [],
      inlineCSS: [],
      tailwindConfig: null,
      customCSS: [],
      references: new Set()
    };

    // Analyze CSS files from build
    const buildCSSFiles = this.findBuildFiles(this.buildDir, '.css');
    
    for (const cssFile of buildCSSFiles) {
      try {
        const css = fs.readFileSync(cssFile.fullPath, 'utf8');
        
        // Copy CSS file to analysis directory
        const outputPath = path.join(OUTPUT_DIR, 'css', `build-${cssFile.name}`);
        fs.writeFileSync(outputPath, css);
        
        cssAnalysis.buildCSS.push({
          name: cssFile.name,
          path: cssFile.path,
          size: cssFile.size,
          outputPath: outputPath
        });
        
        console.log(`  ✅ Analyzed build CSS: ${cssFile.name}`);
      } catch (error) {
        console.error(`  ❌ Failed to analyze CSS file ${cssFile.name}: ${error.message}`);
      }
    }

    // Analyze Tailwind configuration
    await this.analyzeTailwindConfig(cssAnalysis);
    
    // Analyze custom CSS files
    await this.analyzeCustomCSS(cssAnalysis);
    
    // Extract CSS references from HTML
    await this.extractLocalCSSReferences(cssAnalysis);
    
    // Save CSS analysis
    const cssAnalysisPath = path.join(OUTPUT_DIR, 'metadata', 'local-css-analysis.json');
    cssAnalysis.references = [...cssAnalysis.references]; // Convert Set to Array
    fs.writeFileSync(cssAnalysisPath, JSON.stringify(cssAnalysis, null, 2));
    
    console.log(`  ✅ CSS analysis saved to: ${cssAnalysisPath}`);
    return cssAnalysis;
  }

  async analyzeTailwindConfig(cssAnalysis) {
    const tailwindConfigPath = path.join(__dirname, '../../tailwind.config.js');
    
    if (fs.existsSync(tailwindConfigPath)) {
      try {
        const configContent = fs.readFileSync(tailwindConfigPath, 'utf8');
        cssAnalysis.tailwindConfig = {
          path: tailwindConfigPath,
          content: configContent,
          exists: true
        };
        
        // Copy config to analysis directory
        const outputPath = path.join(OUTPUT_DIR, 'css', 'tailwind.config.js');
        fs.writeFileSync(outputPath, configContent);
        
        console.log('  ✅ Tailwind config analyzed');
      } catch (error) {
        console.error(`  ❌ Failed to analyze Tailwind config: ${error.message}`);
      }
    } else {
      cssAnalysis.tailwindConfig = { exists: false };
    }
  }

  async analyzeCustomCSS(cssAnalysis) {
    const globalCSSPath = path.join(__dirname, '../../app/globals.css');
    
    if (fs.existsSync(globalCSSPath)) {
      try {
        const css = fs.readFileSync(globalCSSPath, 'utf8');
        
        // Copy to analysis directory
        const outputPath = path.join(OUTPUT_DIR, 'css', 'globals.css');
        fs.writeFileSync(outputPath, css);
        
        cssAnalysis.customCSS.push({
          name: 'globals.css',
          path: globalCSSPath,
          size: css.length,
          outputPath: outputPath
        });
        
        console.log('  ✅ Global CSS analyzed');
      } catch (error) {
        console.error(`  ❌ Failed to analyze global CSS: ${error.message}`);
      }
    }

    // Look for other CSS files in app directory
    const appStylesDir = path.join(__dirname, '../../app/styles');
    if (fs.existsSync(appStylesDir)) {
      const styleFiles = fs.readdirSync(appStylesDir).filter(f => f.endsWith('.css'));
      
      for (const styleFile of styleFiles) {
        try {
          const stylePath = path.join(appStylesDir, styleFile);
          const css = fs.readFileSync(stylePath, 'utf8');
          
          const outputPath = path.join(OUTPUT_DIR, 'css', `app-${styleFile}`);
          fs.writeFileSync(outputPath, css);
          
          cssAnalysis.customCSS.push({
            name: styleFile,
            path: stylePath,
            size: css.length,
            outputPath: outputPath
          });
          
          console.log(`  ✅ App CSS analyzed: ${styleFile}`);
        } catch (error) {
          console.error(`  ❌ Failed to analyze app CSS ${styleFile}: ${error.message}`);
        }
      }
    }
  }

  async extractLocalCSSReferences(cssAnalysis) {
    const htmlDir = path.join(OUTPUT_DIR, 'html');
    
    if (!fs.existsSync(htmlDir)) {
      console.warn('HTML directory not found. Capture HTML first.');
      return;
    }

    const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
    
    for (const htmlFile of htmlFiles) {
      const htmlPath = path.join(htmlDir, htmlFile);
      const html = fs.readFileSync(htmlPath, 'utf8');
      
      // Extract CSS link tags
      const linkRegex = /<link[^>]*(?:rel=["']stylesheet["'][^>]*href=["']([^"']+)["']|href=["']([^"']+\.css)["'][^>]*rel=["']stylesheet["'])[^>]*>/gi;
      let match;
      
      while ((match = linkRegex.exec(html)) !== null) {
        const href = match[1] || match[2];
        if (href) {
          cssAnalysis.references.add(href);
        }
      }
      
      // Extract inline styles
      const styleRegex = /<style[^>]*>([\s\S]*?)<\/style>/gi;
      let styleMatch;
      let inlineStyleCount = 0;
      
      while ((styleMatch = styleRegex.exec(html)) !== null) {
        const inlineCSS = styleMatch[1];
        if (inlineCSS.trim()) {
          const inlineStylePath = path.join(OUTPUT_DIR, 'css', `${htmlFile.replace('.html', '')}-inline-${inlineStyleCount}.css`);
          fs.writeFileSync(inlineStylePath, inlineCSS);
          
          cssAnalysis.inlineCSS.push({
            source: htmlFile,
            index: inlineStyleCount,
            path: inlineStylePath,
            size: inlineCSS.length
          });
          
          inlineStyleCount++;
        }
      }
    }
  }

  async analyzeLocalAssets() {
    console.log('🖼️  Analyzing local assets...');
    
    const assets = {
      images: new Set(),
      fonts: new Set(),
      scripts: new Set(),
      other: new Set(),
      publicAssets: [],
      buildAssets: []
    };

    // Analyze public directory assets
    if (fs.existsSync(this.publicDir)) {
      assets.publicAssets = this.analyzePublicAssets(this.publicDir);
    }

    // Analyze build assets
    const buildStaticDir = path.join(this.buildDir, 'static');
    if (fs.existsSync(buildStaticDir)) {
      assets.buildAssets = this.analyzeBuildAssets(buildStaticDir);
    }

    // Extract asset references from HTML
    const htmlDir = path.join(OUTPUT_DIR, 'html');
    if (fs.existsSync(htmlDir)) {
      const htmlFiles = fs.readdirSync(htmlDir).filter(file => file.endsWith('.html'));
      
      for (const htmlFile of htmlFiles) {
        const htmlPath = path.join(htmlDir, htmlFile);
        const html = fs.readFileSync(htmlPath, 'utf8');
        
        // Extract images
        const imgRegex = /<img[^>]*src=["']([^"']+)["'][^>]*>/gi;
        let imgMatch;
        while ((imgMatch = imgRegex.exec(html)) !== null) {
          assets.images.add(imgMatch[1]);
        }
        
        // Extract scripts
        const scriptRegex = /<script[^>]*src=["']([^"']+)["'][^>]*>/gi;
        let scriptMatch;
        while ((scriptMatch = scriptRegex.exec(html)) !== null) {
          assets.scripts.add(scriptMatch[1]);
        }
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
          assets.fonts.add(fontMatch[1]);
        }
      }
    }

    // Convert Sets to Arrays and save
    const assetInventory = {
      images: [...assets.images],
      fonts: [...assets.fonts],
      scripts: [...assets.scripts],
      other: [...assets.other],
      publicAssets: assets.publicAssets,
      buildAssets: assets.buildAssets,
      summary: {
        totalImages: assets.images.size,
        totalFonts: assets.fonts.size,
        totalScripts: assets.scripts.size,
        totalOther: assets.other.size,
        totalPublicAssets: assets.publicAssets.length,
        totalBuildAssets: assets.buildAssets.length
      }
    };

    const assetsPath = path.join(OUTPUT_DIR, 'metadata', 'local-asset-inventory.json');
    fs.writeFileSync(assetsPath, JSON.stringify(assetInventory, null, 2));
    
    console.log(`  ✅ Found ${assetInventory.summary.totalImages} images, ${assetInventory.summary.totalFonts} fonts, ${assetInventory.summary.totalScripts} scripts`);
    console.log(`  ✅ Found ${assetInventory.summary.totalPublicAssets} public assets, ${assetInventory.summary.totalBuildAssets} build assets`);
    
    return assetInventory;
  }

  analyzePublicAssets(directory, relativePath = '') {
    const assets = [];
    
    try {
      const items = fs.readdirSync(directory);
      
      items.forEach(item => {
        const itemPath = path.join(directory, item);
        const itemRelativePath = path.join(relativePath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          assets.push(...this.analyzePublicAssets(itemPath, itemRelativePath));
        } else {
          assets.push({
            name: item,
            path: itemRelativePath,
            fullPath: itemPath,
            size: stats.size,
            extension: path.extname(item),
            type: this.getAssetType(item)
          });
        }
      });
    } catch (error) {
      console.warn(`Warning: Could not analyze public directory ${directory}: ${error.message}`);
    }
    
    return assets;
  }

  analyzeBuildAssets(directory, relativePath = '') {
    const assets = [];
    
    try {
      const items = fs.readdirSync(directory);
      
      items.forEach(item => {
        const itemPath = path.join(directory, item);
        const itemRelativePath = path.join(relativePath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          assets.push(...this.analyzeBuildAssets(itemPath, itemRelativePath));
        } else {
          assets.push({
            name: item,
            path: itemRelativePath,
            fullPath: itemPath,
            size: stats.size,
            extension: path.extname(item),
            type: this.getAssetType(item)
          });
        }
      });
    } catch (error) {
      console.warn(`Warning: Could not analyze build directory ${directory}: ${error.message}`);
    }
    
    return assets;
  }

  getAssetType(filename) {
    const ext = path.extname(filename).toLowerCase();
    
    if (['.jpg', '.jpeg', '.png', '.gif', '.svg', '.webp'].includes(ext)) {
      return 'image';
    } else if (['.woff', '.woff2', '.ttf', '.otf', '.eot'].includes(ext)) {
      return 'font';
    } else if (['.js', '.mjs'].includes(ext)) {
      return 'script';
    } else if (['.css'].includes(ext)) {
      return 'stylesheet';
    } else {
      return 'other';
    }
  }

  async generateLocalSummary() {
    console.log('📊 Generating local analysis summary...');
    
    const summary = {
      timestamp: new Date().toISOString(),
      localUrl: LOCAL_URL,
      pagesAnalyzed: KEY_PAGES.length,
      outputDirectory: OUTPUT_DIR,
      buildDirectory: this.buildDir,
      publicDirectory: this.publicDir
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

    // Add build information
    if (fs.existsSync(this.buildDir)) {
      const buildStats = fs.statSync(this.buildDir);
      summary.buildTimestamp = buildStats.mtime.toISOString();
      summary.buildExists = true;
    } else {
      summary.buildExists = false;
    }

    const summaryPath = path.join(OUTPUT_DIR, 'local-analysis-summary.json');
    fs.writeFileSync(summaryPath, JSON.stringify(summary, null, 2));
    
    console.log('📋 Local Analysis Summary:');
    console.log(`  Local URL: ${summary.localUrl}`);
    console.log(`  Pages analyzed: ${summary.pagesAnalyzed}`);
    console.log(`  HTML files captured: ${summary.htmlFiles || 0}`);
    console.log(`  CSS files analyzed: ${summary.cssFiles || 0}`);
    console.log(`  Build exists: ${summary.buildExists}`);
    console.log(`  Output directory: ${summary.outputDirectory}`);
    
    return summary;
  }

  async runFullAnalysis() {
    console.log('🚀 Starting local build analysis...\n');
    
    try {
      // Step 1: Generate local build
      await this.generateLocalBuild();
      console.log('');
      
      // Step 2: Start local server (in background)
      console.log('🌐 Note: Make sure local server is running on http://localhost:3000');
      console.log('   Run "npm start" in another terminal if not already running\n');
      
      // Step 3: Capture HTML from local pages
      await this.captureLocalHTML();
      console.log('');
      
      // Step 4: Analyze local CSS
      await this.analyzeLocalCSS();
      console.log('');
      
      // Step 5: Analyze local assets
      await this.analyzeLocalAssets();
      console.log('');
      
      // Step 6: Generate summary
      await this.generateLocalSummary();
      
      console.log('\n✅ Local build analysis complete!');
      console.log(`📁 Results saved to: ${OUTPUT_DIR}`);
      
    } catch (error) {
      console.error('\n❌ Local analysis failed:', error.message);
      console.error('Make sure you have a local build and server running.');
      process.exit(1);
    }
  }
}

// CLI interface
if (require.main === module) {
  const analyzer = new LocalBuildAnalyzer();
  
  const command = process.argv[2];
  
  switch (command) {
    case 'build':
      analyzer.generateLocalBuild();
      break;
    case 'html':
      analyzer.captureLocalHTML();
      break;
    case 'css':
      analyzer.analyzeLocalCSS();
      break;
    case 'assets':
      analyzer.analyzeLocalAssets();
      break;
    case 'summary':
      analyzer.generateLocalSummary();
      break;
    default:
      analyzer.runFullAnalysis();
  }
}

module.exports = LocalBuildAnalyzer;