#!/usr/bin/env node

/**
 * Visual Regression Testing for Production Parity
 * 
 * This script captures screenshots of key pages and compares them
 * with production to identify visual differences.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class VisualRegressionTester {
    constructor() {
        this.productionUrl = 'https://econoben.dev';
        this.localUrl = 'http://localhost:3000';
        this.screenshotsDir = path.join(__dirname, 'screenshots');
        this.viewports = [
            { name: 'desktop', width: 1200, height: 800 },
            { name: 'tablet', width: 768, height: 1024 },
            { name: 'mobile', width: 375, height: 667 }
        ];
    }

    async runVisualTests() {
        console.log('📸 Starting Visual Regression Testing...\n');
        
        // Ensure screenshots directory exists
        await fs.mkdir(this.screenshotsDir, { recursive: true });

        const browser = await puppeteer.launch({ 
            headless: true,
            defaultViewport: null
        });

        try {
            // Test homepage
            await this.capturePageScreenshots(browser, '/', 'homepage');
            
            // Test about page
            await this.capturePageScreenshots(browser, '/about', 'about');
            
            // Test posts page
            await this.capturePageScreenshots(browser, '/posts', 'posts');

            console.log('\n✅ Visual regression testing complete!');
            console.log(`📁 Screenshots saved to: ${this.screenshotsDir}`);
            
        } finally {
            await browser.close();
        }
    }

    async capturePageScreenshots(browser, route, pageName) {
        console.log(`📸 Capturing screenshots for ${pageName}...`);

        for (const viewport of this.viewports) {
            console.log(`  📱 ${viewport.name} (${viewport.width}x${viewport.height})`);
            
            // Production screenshots
            const prodPage = await browser.newPage();
            await prodPage.setViewport(viewport);
            
            try {
                await prodPage.goto(`${this.productionUrl}${route}`, { 
                    waitUntil: 'networkidle0',
                    timeout: 30000 
                });
                
                // Wait for any animations to complete
                await prodPage.waitForTimeout(2000);
                
                await prodPage.screenshot({
                    path: path.join(this.screenshotsDir, `${pageName}-${viewport.name}-production.png`),
                    fullPage: true
                });
            } catch (error) {
                console.log(`    ⚠️  Production screenshot failed: ${error.message}`);
            } finally {
                await prodPage.close();
            }

            // Local screenshots
            const localPage = await browser.newPage();
            await localPage.setViewport(viewport);
            
            try {
                await localPage.goto(`${this.localUrl}${route}`, { 
                    waitUntil: 'networkidle0',
                    timeout: 30000 
                });
                
                // Wait for any animations to complete
                await localPage.waitForTimeout(2000);
                
                await localPage.screenshot({
                    path: path.join(this.screenshotsDir, `${pageName}-${viewport.name}-local.png`),
                    fullPage: true
                });
            } catch (error) {
                console.log(`    ⚠️  Local screenshot failed: ${error.message}`);
            } finally {
                await localPage.close();
            }
        }
    }

    async captureElementScreenshots(browser, route, pageName, selectors) {
        console.log(`🎯 Capturing element screenshots for ${pageName}...`);

        const prodPage = await browser.newPage();
        const localPage = await browser.newPage();

        try {
            await prodPage.goto(`${this.productionUrl}${route}`, { waitUntil: 'networkidle0' });
            await localPage.goto(`${this.localUrl}${route}`, { waitUntil: 'networkidle0' });

            for (const selector of selectors) {
                const elementName = selector.replace(/[^a-zA-Z0-9]/g, '-');
                
                // Production element screenshot
                try {
                    const prodElement = await prodPage.$(selector);
                    if (prodElement) {
                        await prodElement.screenshot({
                            path: path.join(this.screenshotsDir, `${pageName}-${elementName}-production.png`)
                        });
                    }
                } catch (error) {
                    console.log(`    ⚠️  Production element ${selector} screenshot failed`);
                }

                // Local element screenshot
                try {
                    const localElement = await localPage.$(selector);
                    if (localElement) {
                        await localElement.screenshot({
                            path: path.join(this.screenshotsDir, `${pageName}-${elementName}-local.png`)
                        });
                    }
                } catch (error) {
                    console.log(`    ⚠️  Local element ${selector} screenshot failed`);
                }
            }
        } finally {
            await prodPage.close();
            await localPage.close();
        }
    }

    async generateComparisonReport() {
        console.log('📊 Generating visual comparison report...');
        
        const screenshots = await fs.readdir(this.screenshotsDir);
        const comparisons = [];

        // Group screenshots by page and viewport
        const groups = {};
        screenshots.forEach(filename => {
            const match = filename.match(/^(.+)-(desktop|tablet|mobile)-(production|local)\.png$/);
            if (match) {
                const [, page, viewport, source] = match;
                const key = `${page}-${viewport}`;
                if (!groups[key]) groups[key] = {};
                groups[key][source] = filename;
            }
        });

        // Generate HTML report
        let html = `
<!DOCTYPE html>
<html>
<head>
    <title>Visual Regression Test Report</title>
    <style>
        body { font-family: Arial, sans-serif; margin: 20px; }
        .comparison { margin-bottom: 40px; border: 1px solid #ddd; padding: 20px; }
        .comparison h3 { margin-top: 0; }
        .images { display: flex; gap: 20px; }
        .image-container { flex: 1; }
        .image-container img { max-width: 100%; border: 1px solid #ccc; }
        .image-container h4 { margin: 10px 0 5px 0; }
    </style>
</head>
<body>
    <h1>Visual Regression Test Report</h1>
    <p>Generated: ${new Date().toISOString()}</p>
`;

        Object.entries(groups).forEach(([key, sources]) => {
            if (sources.production && sources.local) {
                html += `
    <div class="comparison">
        <h3>${key.replace('-', ' - ')}</h3>
        <div class="images">
            <div class="image-container">
                <h4>Production</h4>
                <img src="screenshots/${sources.production}" alt="Production ${key}">
            </div>
            <div class="image-container">
                <h4>Local</h4>
                <img src="screenshots/${sources.local}" alt="Local ${key}">
            </div>
        </div>
    </div>
`;
            }
        });

        html += `
</body>
</html>`;

        const reportPath = path.join(this.screenshotsDir, 'visual-comparison-report.html');
        await fs.writeFile(reportPath, html);
        
        console.log(`📄 Visual comparison report saved to: ${reportPath}`);
    }
}

// Run visual regression tests if called directly
if (require.main === module) {
    const tester = new VisualRegressionTester();
    tester.runVisualTests()
        .then(() => tester.generateComparisonReport())
        .catch(console.error);
}

module.exports = VisualRegressionTester;