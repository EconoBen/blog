#!/usr/bin/env node

/**
 * Test script for the Difference Engine
 * Verifies all comparison functions work correctly
 */

const DifferenceEngine = require('./difference-engine');
const fs = require('fs');
const path = require('path');

class DifferenceEngineTest {
  constructor() {
    this.engine = new DifferenceEngine();
    this.testResults = {
      htmlComparison: false,
      cssComparison: false,
      assetComparison: false,
      configComparison: false,
      overallTest: false
    };
  }

  async runTests() {
    console.log('🧪 Testing Difference Engine Components...\n');

    try {
      // Test HTML comparison
      console.log('1. Testing HTML comparison...');
      const htmlResult = await this.engine.compareHTML();
      this.testResults.htmlComparison = this.validateHTMLResult(htmlResult);
      console.log(`   ${this.testResults.htmlComparison ? '✅' : '❌'} HTML comparison test\n`);

      // Test CSS comparison
      console.log('2. Testing CSS comparison...');
      const cssResult = await this.engine.compareCSS();
      this.testResults.cssComparison = this.validateCSSResult(cssResult);
      console.log(`   ${this.testResults.cssComparison ? '✅' : '❌'} CSS comparison test\n`);

      // Test Asset comparison
      console.log('3. Testing Asset comparison...');
      const assetResult = await this.engine.compareAssets();
      this.testResults.assetComparison = this.validateAssetResult(assetResult);
      console.log(`   ${this.testResults.assetComparison ? '✅' : '❌'} Asset comparison test\n`);

      // Test Configuration comparison
      console.log('4. Testing Configuration comparison...');
      const configResult = await this.engine.compareConfigurations();
      this.testResults.configComparison = this.validateConfigResult(configResult);
      console.log(`   ${this.testResults.configComparison ? '✅' : '❌'} Configuration comparison test\n`);

      // Test overall integration
      console.log('5. Testing overall integration...');
      const overallResult = await this.engine.runComprehensiveComparison();
      this.testResults.overallTest = this.validateOverallResult(overallResult);
      console.log(`   ${this.testResults.overallTest ? '✅' : '❌'} Overall integration test\n`);

      // Print summary
      this.printTestSummary();

    } catch (error) {
      console.error('❌ Test failed with error:', error.message);
      console.error(error.stack);
      process.exit(1);
    }
  }

  validateHTMLResult(result) {
    return result && 
           typeof result === 'object' &&
           'pageComparisons' in result &&
           'summary' in result;
  }

  validateCSSResult(result) {
    return result && 
           typeof result === 'object' &&
           'frameworkDifferences' in result &&
           'summary' in result;
  }

  validateAssetResult(result) {
    return result && 
           typeof result === 'object' &&
           'imageDifferences' in result &&
           'summary' in result;
  }

  validateConfigResult(result) {
    return result && 
           typeof result === 'object' &&
           'nextConfigDifferences' in result &&
           'summary' in result;
  }

  validateOverallResult(result) {
    return result && 
           typeof result === 'object' &&
           'htmlComparison' in result &&
           'cssComparison' in result &&
           'assetComparison' in result &&
           'configComparison' in result &&
           'summary' in result;
  }

  printTestSummary() {
    console.log('📊 Test Summary:');
    console.log('================');
    
    const tests = Object.keys(this.testResults);
    const passed = tests.filter(test => this.testResults[test]).length;
    const total = tests.length;

    tests.forEach(test => {
      const status = this.testResults[test] ? '✅ PASS' : '❌ FAIL';
      console.log(`  ${test}: ${status}`);
    });

    console.log(`\nOverall: ${passed}/${total} tests passed`);
    
    if (passed === total) {
      console.log('🎉 All tests passed! Difference Engine is working correctly.');
    } else {
      console.log('⚠️  Some tests failed. Check the implementation.');
      process.exit(1);
    }
  }
}

// Run tests if called directly
if (require.main === module) {
  const tester = new DifferenceEngineTest();
  tester.runTests();
}

module.exports = DifferenceEngineTest;