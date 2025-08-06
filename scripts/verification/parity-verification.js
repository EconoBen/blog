#!/usr/bin/env node

/**
 * Production Parity Verification System
 * 
 * This script verifies that the local Next.js implementation matches
 * the production site functionality and appearance.
 */

const puppeteer = require('puppeteer');
const fs = require('fs').promises;
const path = require('path');

class ParityVerificationSystem {
    constructor() {
        this.productionUrl = 'https://econoben.dev';
        this.localUrl = 'http://localhost:3000';
        this.results = {
            passed: 0,
            failed: 0,
            tests: []
        };
    }

    async runAllTests() {
        console.log('🚀 Starting Production Parity Verification...\n');
        
        const browser = await puppeteer.launch({ 
            headless: false,
            defaultViewport: { width: 1200, height: 800 }
        });

        try {
            // Test 1: Page Structure Comparison
            await this.testPageStructure(browser);
            
            // Test 2: Hero Section Content
            await this.testHeroSection(browser);
            
            // Test 3: Featured Posts Section
            await this.testFeaturedPosts(browser);
            
            // Test 4: Category Filtering
            await this.testCategoryFiltering(browser);
            
            // Test 5: Navigation and Links
            await this.testNavigation(browser);
            
            // Test 6: Responsive Design
            await this.testResponsiveDesign(browser);
            
            // Test 7: Performance Comparison
            await this.testPerformance(browser);

        } finally {
            await browser.close();
        }

        this.generateReport();
    }

    async testPageStructure(browser) {
        console.log('📋 Testing page structure...');
        
        const productionPage = await browser.newPage();
        const localPage = await browser.newPage();
        
        try {
            await productionPage.goto(this.productionUrl, { waitUntil: 'networkidle0' });
            await localPage.goto(this.localUrl, { waitUntil: 'networkidle0' });

            // Test main sections exist
            const sections = ['.hero-section', '.featured-section', '.posts-section'];
            
            for (const section of sections) {
                const prodExists = await productionPage.$(section) !== null;
                const localExists = await localPage.$(section) !== null;
                
                this.addTestResult(
                    `Page Structure - ${section}`,
                    prodExists === localExists,
                    `Production: ${prodExists}, Local: ${localExists}`
                );
            }

            // Test hero section structure
            const heroElements = ['.hero-title', '.hero-subtitle', '.hero-cta', '.tech-badges'];
            
            for (const element of heroElements) {
                const prodExists = await productionPage.$(element) !== null;
                const localExists = await localPage.$(element) !== null;
                
                this.addTestResult(
                    `Hero Elements - ${element}`,
                    prodExists === localExists,
                    `Production: ${prodExists}, Local: ${localExists}`
                );
            }

        } catch (error) {
            this.addTestResult('Page Structure', false, `Error: ${error.message}`);
        } finally {
            await productionPage.close();
            await localPage.close();
        }
    }

    async testHeroSection(browser) {
        console.log('🎯 Testing hero section content...');
        
        const productionPage = await browser.newPage();
        const localPage = await browser.newPage();
        
        try {
            await productionPage.goto(this.productionUrl, { waitUntil: 'networkidle0' });
            await localPage.goto(this.localUrl, { waitUntil: 'networkidle0' });

            // Test hero title exists and is clickable
            const prodHeroTitle = await productionPage.$('.hero-title a');
            const localHeroTitle = await localPage.$('.hero-title a');
            
            this.addTestResult(
                'Hero Title Link',
                (prodHeroTitle !== null) === (localHeroTitle !== null),
                'Hero title should be clickable'
            );

            // Test hero buttons exist
            const prodButtons = await productionPage.$$('.hero-button');
            const localButtons = await localPage.$$('.hero-button');
            
            this.addTestResult(
                'Hero Buttons Count',
                prodButtons.length === localButtons.length,
                `Production: ${prodButtons.length}, Local: ${localButtons.length}`
            );

            // Test tech badges exist
            const prodBadges = await productionPage.$$('.tech-badge');
            const localBadges = await localPage.$$('.tech-badge');
            
            this.addTestResult(
                'Tech Badges',
                prodBadges.length > 0 && localBadges.length > 0,
                `Production: ${prodBadges.length}, Local: ${localBadges.length}`
            );

        } catch (error) {
            this.addTestResult('Hero Section', false, `Error: ${error.message}`);
        } finally {
            await productionPage.close();
            await localPage.close();
        }
    }

    async testFeaturedPosts(browser) {
        console.log('⭐ Testing featured posts section...');
        
        const localPage = await browser.newPage();
        
        try {
            await localPage.goto(this.localUrl, { waitUntil: 'networkidle0' });

            // Test featured posts section exists
            const featuredSection = await localPage.$('.featured-section');
            this.addTestResult(
                'Featured Section Exists',
                featuredSection !== null,
                'Featured posts section should exist'
            );

            // Test featured post cards
            const featuredCards = await localPage.$$('.featured-post-card');
            this.addTestResult(
                'Featured Posts Count',
                featuredCards.length === 3,
                `Expected 3 featured posts, found ${featuredCards.length}`
            );

            // Test featured post structure
            if (featuredCards.length > 0) {
                const firstCard = featuredCards[0];
                const hasTitle = await firstCard.$('.featured-post-title') !== null;
                const hasMeta = await firstCard.$('.featured-post-meta') !== null;
                const hasExcerpt = await firstCard.$('.featured-post-excerpt') !== null;
                const hasLink = await firstCard.$('.featured-post-link') !== null;
                
                this.addTestResult(
                    'Featured Post Structure',
                    hasTitle && hasMeta && hasExcerpt && hasLink,
                    `Title: ${hasTitle}, Meta: ${hasMeta}, Excerpt: ${hasExcerpt}, Link: ${hasLink}`
                );
            }

        } catch (error) {
            this.addTestResult('Featured Posts', false, `Error: ${error.message}`);
        } finally {
            await localPage.close();
        }
    }

    async testCategoryFiltering(browser) {
        console.log('🏷️ Testing category filtering...');
        
        const localPage = await browser.newPage();
        
        try {
            await localPage.goto(this.localUrl, { waitUntil: 'networkidle0' });

            // Test category buttons exist
            const categoryButtons = await localPage.$$('.category-button');
            this.addTestResult(
                'Category Buttons Exist',
                categoryButtons.length > 0,
                `Found ${categoryButtons.length} category buttons`
            );

            if (categoryButtons.length > 1) {
                // Test initial state - "All" should be active
                const allButton = await localPage.$('.category-button.active');
                const allButtonText = await allButton?.evaluate(el => el.textContent);
                
                this.addTestResult(
                    'Initial Active Category',
                    allButtonText === 'All',
                    `Active button text: ${allButtonText}`
                );

                // Test clicking a category button
                const secondButton = categoryButtons[1];
                await secondButton.click();
                await localPage.waitForTimeout(500); // Wait for state update

                // Check if the button becomes active
                const isActive = await secondButton.evaluate(el => el.classList.contains('active'));
                this.addTestResult(
                    'Category Button Click',
                    isActive,
                    'Category button should become active when clicked'
                );

                // Test if posts are filtered (basic check)
                const blogCards = await localPage.$$('.blog-card');
                this.addTestResult(
                    'Posts After Filtering',
                    blogCards.length > 0,
                    `Found ${blogCards.length} posts after filtering`
                );
            }

        } catch (error) {
            this.addTestResult('Category Filtering', false, `Error: ${error.message}`);
        } finally {
            await localPage.close();
        }
    }

    async testNavigation(browser) {
        console.log('🧭 Testing navigation and links...');
        
        const localPage = await browser.newPage();
        
        try {
            await localPage.goto(this.localUrl, { waitUntil: 'networkidle0' });

            // Test hero title link
            const heroLink = await localPage.$('.hero-title a');
            if (heroLink) {
                const href = await heroLink.evaluate(el => el.getAttribute('href'));
                this.addTestResult(
                    'Hero Title Link',
                    href && href.startsWith('/posts/'),
                    `Hero link href: ${href}`
                );
            }

            // Test hero buttons
            const heroButtons = await localPage.$$('.hero-button');
            for (let i = 0; i < heroButtons.length; i++) {
                const button = heroButtons[i];
                const href = await button.evaluate(el => el.getAttribute('href'));
                this.addTestResult(
                    `Hero Button ${i + 1} Link`,
                    href !== null && href !== '',
                    `Button ${i + 1} href: ${href}`
                );
            }

            // Test tech badge links
            const techBadges = await localPage.$$('.tech-badge a');
            for (let i = 0; i < Math.min(techBadges.length, 3); i++) {
                const badge = techBadges[i];
                const href = await badge.evaluate(el => el.getAttribute('href'));
                this.addTestResult(
                    `Tech Badge ${i + 1} Link`,
                    href && href.startsWith('/tags/'),
                    `Badge ${i + 1} href: ${href}`
                );
            }

            // Test featured post links
            const featuredLinks = await localPage.$$('.featured-post-link');
            for (let i = 0; i < Math.min(featuredLinks.length, 3); i++) {
                const link = featuredLinks[i];
                const href = await link.evaluate(el => el.getAttribute('href'));
                this.addTestResult(
                    `Featured Post ${i + 1} Link`,
                    href && href.startsWith('/posts/'),
                    `Featured post ${i + 1} href: ${href}`
                );
            }

        } catch (error) {
            this.addTestResult('Navigation', false, `Error: ${error.message}`);
        } finally {
            await localPage.close();
        }
    }

    async testResponsiveDesign(browser) {
        console.log('📱 Testing responsive design...');
        
        const page = await browser.newPage();
        
        try {
            // Test mobile viewport
            await page.setViewport({ width: 375, height: 667 });
            await page.goto(this.localUrl, { waitUntil: 'networkidle0' });

            // Test hero section on mobile
            const heroSection = await page.$('.hero-section');
            const heroStyles = await heroSection?.evaluate(el => {
                const styles = window.getComputedStyle(el);
                return {
                    flexDirection: styles.flexDirection,
                    textAlign: styles.textAlign
                };
            });

            this.addTestResult(
                'Mobile Hero Layout',
                heroStyles?.flexDirection === 'column' || heroStyles?.textAlign === 'center',
                `Flex direction: ${heroStyles?.flexDirection}, Text align: ${heroStyles?.textAlign}`
            );

            // Test tablet viewport
            await page.setViewport({ width: 768, height: 1024 });
            await page.reload({ waitUntil: 'networkidle0' });

            // Test desktop viewport
            await page.setViewport({ width: 1200, height: 800 });
            await page.reload({ waitUntil: 'networkidle0' });

            const desktopHeroStyles = await heroSection?.evaluate(el => {
                const styles = window.getComputedStyle(el);
                return {
                    display: styles.display,
                    alignItems: styles.alignItems
                };
            });

            this.addTestResult(
                'Desktop Hero Layout',
                desktopHeroStyles?.display === 'flex',
                `Display: ${desktopHeroStyles?.display}, Align items: ${desktopHeroStyles?.alignItems}`
            );

        } catch (error) {
            this.addTestResult('Responsive Design', false, `Error: ${error.message}`);
        } finally {
            await page.close();
        }
    }

    async testPerformance(browser) {
        console.log('⚡ Testing performance...');
        
        const page = await browser.newPage();
        
        try {
            // Enable performance monitoring
            await page.coverage.startJSCoverage();
            await page.coverage.startCSSCoverage();

            const startTime = Date.now();
            await page.goto(this.localUrl, { waitUntil: 'networkidle0' });
            const loadTime = Date.now() - startTime;

            this.addTestResult(
                'Page Load Time',
                loadTime < 5000,
                `Load time: ${loadTime}ms`
            );

            // Test if all images load
            const images = await page.$$('img');
            let loadedImages = 0;
            
            for (const img of images) {
                const isLoaded = await img.evaluate(el => el.complete && el.naturalHeight !== 0);
                if (isLoaded) loadedImages++;
            }

            this.addTestResult(
                'Images Loaded',
                loadedImages === images.length,
                `${loadedImages}/${images.length} images loaded`
            );

            // Stop coverage
            await page.coverage.stopJSCoverage();
            await page.coverage.stopCSSCoverage();

        } catch (error) {
            this.addTestResult('Performance', false, `Error: ${error.message}`);
        } finally {
            await page.close();
        }
    }

    addTestResult(testName, passed, details) {
        const result = {
            name: testName,
            passed,
            details,
            timestamp: new Date().toISOString()
        };
        
        this.results.tests.push(result);
        
        if (passed) {
            this.results.passed++;
            console.log(`  ✅ ${testName}`);
        } else {
            this.results.failed++;
            console.log(`  ❌ ${testName}: ${details}`);
        }
    }

    async generateReport() {
        console.log('\n📊 Generating verification report...\n');
        
        const report = {
            summary: {
                total: this.results.passed + this.results.failed,
                passed: this.results.passed,
                failed: this.results.failed,
                successRate: Math.round((this.results.passed / (this.results.passed + this.results.failed)) * 100)
            },
            timestamp: new Date().toISOString(),
            tests: this.results.tests
        };

        // Save detailed report
        const reportPath = path.join(__dirname, 'parity-verification-report.json');
        await fs.writeFile(reportPath, JSON.stringify(report, null, 2));

        // Generate summary
        console.log('='.repeat(60));
        console.log('🎯 PRODUCTION PARITY VERIFICATION RESULTS');
        console.log('='.repeat(60));
        console.log(`Total Tests: ${report.summary.total}`);
        console.log(`Passed: ${report.summary.passed} ✅`);
        console.log(`Failed: ${report.summary.failed} ❌`);
        console.log(`Success Rate: ${report.summary.successRate}%`);
        console.log('='.repeat(60));

        if (report.summary.failed > 0) {
            console.log('\n❌ Failed Tests:');
            this.results.tests
                .filter(test => !test.passed)
                .forEach(test => {
                    console.log(`  • ${test.name}: ${test.details}`);
                });
        }

        console.log(`\n📄 Detailed report saved to: ${reportPath}`);
        
        // Return success/failure for CI
        process.exit(report.summary.failed > 0 ? 1 : 0);
    }
}

// Run verification if called directly
if (require.main === module) {
    const verifier = new ParityVerificationSystem();
    verifier.runAllTests().catch(console.error);
}

module.exports = ParityVerificationSystem;