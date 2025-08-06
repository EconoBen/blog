#!/usr/bin/env node

/**
 * Production Parity Monitoring System
 * 
 * This script monitors the production site for changes and alerts
 * when the local implementation may need updates to maintain parity.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');
const crypto = require('crypto');

class ParityMonitor {
    constructor() {
        this.productionUrl = 'https://econoben.dev';
        this.localUrl = 'http://localhost:3000';
        this.monitoringDir = path.join(__dirname, 'monitoring');
        this.baselineFile = path.join(this.monitoringDir, 'baseline.json');
        this.alertsFile = path.join(this.monitoringDir, 'alerts.json');
    }

    async initialize() {
        console.log('🔧 Initializing Production Parity Monitor...\n');
        
        // Ensure monitoring directory exists
        await fs.mkdir(this.monitoringDir, { recursive: true });
        
        // Create initial baseline
        await this.createBaseline();
        
        console.log('✅ Monitor initialized successfully!');
        console.log(`📁 Monitoring data stored in: ${this.monitoringDir}`);
    }

    async createBaseline() {
        console.log('📊 Creating baseline from current production state...');
        
        const browser = await puppeteer.launch({ headless: true });
        
        try {
            const baseline = {
                timestamp: new Date().toISOString(),
                pages: {}
            };

            // Monitor homepage
            baseline.pages.homepage = await this.analyzePage(browser, '/');
            
            // Monitor about page
            baseline.pages.about = await this.analyzePage(browser, '/about');
            
            // Monitor posts page
            baseline.pages.posts = await this.analyzePage(browser, '/posts');

            // Save baseline
            await fs.writeFile(this.baselineFile, JSON.stringify(baseline, null, 2));
            
            console.log('✅ Baseline created successfully');
            
        } finally {
            await browser.close();
        }
    }

    async checkForChanges() {
        console.log('🔍 Checking for production changes...\n');
        
        // Load baseline
        let baseline;
        try {
            const baselineData = await fs.readFile(this.baselineFile, 'utf8');
            baseline = JSON.parse(baselineData);
        } catch (error) {
            console.log('❌ No baseline found. Run initialize first.');
            return;
        }

        const browser = await puppeteer.launch({ headless: true });
        const alerts = [];
        
        try {
            // Check each monitored page
            for (const [pageName, baselineData] of Object.entries(baseline.pages)) {
                console.log(`🔍 Checking ${pageName}...`);
                
                const currentData = await this.analyzePage(browser, baselineData.route);
                const changes = this.comparePageData(baselineData, currentData);
                
                if (changes.length > 0) {
                    console.log(`  ⚠️  Changes detected in ${pageName}:`);
                    changes.forEach(change => {
                        console.log(`    • ${change}`);
                    });
                    
                    alerts.push({
                        page: pageName,
                        changes,
                        timestamp: new Date().toISOString()
                    });
                } else {
                    console.log(`  ✅ No changes in ${pageName}`);
                }
            }
            
        } finally {
            await browser.close();
        }

        // Save alerts if any
        if (alerts.length > 0) {
            await this.saveAlerts(alerts);
            console.log(`\n🚨 ${alerts.length} alert(s) generated`);
        } else {
            console.log('\n✅ No changes detected');
        }

        return alerts;
    }

    async analyzePage(browser, route) {
        const page = await browser.newPage();
        
        try {
            await page.goto(`${this.productionUrl}${route}`, { 
                waitUntil: 'networkidle0',
                timeout: 30000 
            });

            // Extract page structure and content
            const analysis = await page.evaluate(() => {
                const data = {
                    title: document.title,
                    metaDescription: document.querySelector('meta[name="description"]')?.content || '',
                    headings: [],
                    links: [],
                    images: [],
                    structure: {}
                };

                // Extract headings
                document.querySelectorAll('h1, h2, h3, h4, h5, h6').forEach(heading => {
                    data.headings.push({
                        tag: heading.tagName.toLowerCase(),
                        text: heading.textContent.trim(),
                        id: heading.id || null
                    });
                });

                // Extract main navigation links
                document.querySelectorAll('nav a, .nav-item a').forEach(link => {
                    data.links.push({
                        text: link.textContent.trim(),
                        href: link.getAttribute('href')
                    });
                });

                // Extract images
                document.querySelectorAll('img').forEach(img => {
                    data.images.push({
                        src: img.src,
                        alt: img.alt || '',
                        width: img.naturalWidth,
                        height: img.naturalHeight
                    });
                });

                // Extract key structural elements
                const structuralElements = [
                    '.hero-section',
                    '.featured-section', 
                    '.posts-section',
                    '.hero-title',
                    '.hero-subtitle',
                    '.hero-cta',
                    '.tech-badges',
                    '.featured-posts',
                    '.category-filter',
                    '.blog-cards-container'
                ];

                structuralElements.forEach(selector => {
                    const element = document.querySelector(selector);
                    if (element) {
                        data.structure[selector] = {
                            exists: true,
                            textContent: element.textContent.trim().substring(0, 200),
                            childCount: element.children.length,
                            classes: Array.from(element.classList)
                        };
                    } else {
                        data.structure[selector] = { exists: false };
                    }
                });

                return data;
            });

            // Add route and hash for comparison
            analysis.route = route;
            analysis.contentHash = this.generateHash(JSON.stringify(analysis));
            
            return analysis;
            
        } finally {
            await page.close();
        }
    }

    comparePageData(baseline, current) {
        const changes = [];

        // Check title changes
        if (baseline.title !== current.title) {
            changes.push(`Title changed: "${baseline.title}" → "${current.title}"`);
        }

        // Check meta description changes
        if (baseline.metaDescription !== current.metaDescription) {
            changes.push(`Meta description changed`);
        }

        // Check heading changes
        if (baseline.headings.length !== current.headings.length) {
            changes.push(`Heading count changed: ${baseline.headings.length} → ${current.headings.length}`);
        }

        // Check structural changes
        Object.keys(baseline.structure).forEach(selector => {
            const baselineEl = baseline.structure[selector];
            const currentEl = current.structure[selector];

            if (baselineEl.exists !== currentEl.exists) {
                changes.push(`Element ${selector} ${currentEl.exists ? 'added' : 'removed'}`);
            } else if (baselineEl.exists && currentEl.exists) {
                if (baselineEl.childCount !== currentEl.childCount) {
                    changes.push(`${selector} child count changed: ${baselineEl.childCount} → ${currentEl.childCount}`);
                }
                
                if (baselineEl.textContent !== currentEl.textContent) {
                    changes.push(`${selector} content changed`);
                }
            }
        });

        // Check image changes
        if (baseline.images.length !== current.images.length) {
            changes.push(`Image count changed: ${baseline.images.length} → ${current.images.length}`);
        }

        return changes;
    }

    async saveAlerts(alerts) {
        let existingAlerts = [];
        
        try {
            const alertsData = await fs.readFile(this.alertsFile, 'utf8');
            existingAlerts = JSON.parse(alertsData);
        } catch (error) {
            // File doesn't exist yet, start with empty array
        }

        existingAlerts.push(...alerts);
        
        // Keep only last 100 alerts
        if (existingAlerts.length > 100) {
            existingAlerts = existingAlerts.slice(-100);
        }

        await fs.writeFile(this.alertsFile, JSON.stringify(existingAlerts, null, 2));
    }

    async generateMonitoringReport() {
        console.log('📊 Generating monitoring report...');
        
        let alerts = [];
        try {
            const alertsData = await fs.readFile(this.alertsFile, 'utf8');
            alerts = JSON.parse(alertsData);
        } catch (error) {
            console.log('No alerts found');
        }

        let baseline = null;
        try {
            const baselineData = await fs.readFile(this.baselineFile, 'utf8');
            baseline = JSON.parse(baselineData);
        } catch (error) {
            console.log('No baseline found');
        }

        const report = {
            summary: {
                baselineCreated: baseline?.timestamp || 'Not created',
                totalAlerts: alerts.length,
                recentAlerts: alerts.filter(alert => {
                    const alertDate = new Date(alert.timestamp);
                    const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
                    return alertDate > weekAgo;
                }).length
            },
            recentAlerts: alerts.slice(-10), // Last 10 alerts
            recommendations: []
        };

        // Generate recommendations based on alerts
        if (report.summary.recentAlerts > 0) {
            report.recommendations.push('Recent changes detected in production. Review alerts and update local implementation if needed.');
        }

        if (report.summary.totalAlerts > 20) {
            report.recommendations.push('High number of alerts detected. Consider updating baseline or improving monitoring sensitivity.');
        }

        const reportPath = path.join(this.monitoringDir, 'monitoring-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        console.log('='.repeat(60));
        console.log('📊 PRODUCTION PARITY MONITORING REPORT');
        console.log('='.repeat(60));
        console.log(`Baseline Created: ${report.summary.baselineCreated}`);
        console.log(`Total Alerts: ${report.summary.totalAlerts}`);
        console.log(`Recent Alerts (7 days): ${report.summary.recentAlerts}`);
        console.log('='.repeat(60));

        if (report.recommendations.length > 0) {
            console.log('\n💡 Recommendations:');
            report.recommendations.forEach(rec => {
                console.log(`  • ${rec}`);
            });
        }

        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
    }

    generateHash(content) {
        return crypto.createHash('md5').update(content).digest('hex');
    }
}

// CLI interface
if (require.main === module) {
    const monitor = new ParityMonitor();
    const command = process.argv[2];

    switch (command) {
        case 'init':
            monitor.initialize().catch(console.error);
            break;
        case 'check':
            monitor.checkForChanges().catch(console.error);
            break;
        case 'report':
            monitor.generateMonitoringReport().catch(console.error);
            break;
        default:
            console.log('Usage:');
            console.log('  node parity-monitor.js init    - Initialize monitoring baseline');
            console.log('  node parity-monitor.js check   - Check for production changes');
            console.log('  node parity-monitor.js report  - Generate monitoring report');
    }
}

module.exports = ParityMonitor;