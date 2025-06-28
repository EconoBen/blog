#!/usr/bin/env node

/**
 * Mobile CSS Test Script
 * Compares the old and new mobile.css files to ensure critical styles are preserved
 */

const fs = require('fs');
const path = require('path');

const originalFile = path.join(__dirname, '../src/styles/mobile.css.backup');
const newFile = path.join(__dirname, '../src/styles/mobile.css');

// Critical selectors that must be preserved
const criticalSelectors = [
  '.mobile-container',
  '.mobile-navbar',
  '.bottom-nav',
  '.bottom-nav-item',
  '.search-panel',
  '.blog-content',
  '.blog-card',
  '.mobile-container .main-content',
  '.mobile-container .sidebar',
  '.mobile-container .page-container'
];

// Critical properties that should be maintained
const criticalProperties = [
  'position: fixed',
  'display: none',
  'width: 100%',
  'max-width: 100%',
  'overflow-x: hidden',
  'z-index: 1000'
];

// Media queries that must exist
const requiredMediaQueries = [
  '@media screen and (max-width: 767px)',
  '@supports (-webkit-touch-callout: none)'
];

function readCSS(filePath) {
  return fs.readFileSync(filePath, 'utf8');
}

function extractSelectors(css) {
  const selectorRegex = /([^{]+)\s*{[^}]*}/g;
  const selectors = [];
  let match;
  
  while ((match = selectorRegex.exec(css)) !== null) {
    selectors.push(match[1].trim());
  }
  
  return selectors;
}

function checkCriticalSelectors(css, selectors) {
  const cssLower = css.toLowerCase();
  const missing = [];
  
  selectors.forEach(selector => {
    if (!cssLower.includes(selector.toLowerCase())) {
      missing.push(selector);
    }
  });
  
  return missing;
}

function checkCriticalProperties(css, properties) {
  const cssNormalized = css.replace(/\s+/g, ' ').toLowerCase();
  const missing = [];
  
  properties.forEach(property => {
    if (!cssNormalized.includes(property.toLowerCase())) {
      missing.push(property);
    }
  });
  
  return missing;
}

function compareFileSizes(original, refactored) {
  const originalSize = Buffer.byteLength(original, 'utf8');
  const refactoredSize = Buffer.byteLength(refactored, 'utf8');
  const reduction = ((originalSize - refactoredSize) / originalSize * 100).toFixed(2);
  
  return {
    original: originalSize,
    refactored: refactoredSize,
    reduction: reduction
  };
}

function countImportantRules(css) {
  const matches = css.match(/!important/g);
  return matches ? matches.length : 0;
}

// Run tests
console.log('🔍 Testing Mobile CSS Refactoring...\n');

try {
  const originalCSS = readCSS(originalFile);
  const newCSS = readCSS(newFile);
  
  // Test 1: Check critical selectors
  console.log('1. Checking critical selectors...');
  const missingSelectors = checkCriticalSelectors(newCSS, criticalSelectors);
  if (missingSelectors.length === 0) {
    console.log('   ✅ All critical selectors preserved');
  } else {
    console.log('   ❌ Missing selectors:', missingSelectors);
  }
  
  // Test 2: Check critical properties
  console.log('\n2. Checking critical properties...');
  const missingProperties = checkCriticalProperties(newCSS, criticalProperties);
  if (missingProperties.length === 0) {
    console.log('   ✅ All critical properties preserved');
  } else {
    console.log('   ❌ Missing properties:', missingProperties);
  }
  
  // Test 3: Check media queries
  console.log('\n3. Checking required media queries...');
  const missingQueries = checkCriticalSelectors(newCSS, requiredMediaQueries);
  if (missingQueries.length === 0) {
    console.log('   ✅ All required media queries present');
  } else {
    console.log('   ❌ Missing media queries:', missingQueries);
  }
  
  // Test 4: File size comparison
  console.log('\n4. File size comparison...');
  const sizeInfo = compareFileSizes(originalCSS, newCSS);
  console.log(`   Original: ${sizeInfo.original} bytes`);
  console.log(`   Refactored: ${sizeInfo.refactored} bytes`);
  console.log(`   Reduction: ${sizeInfo.reduction}%`);
  
  // Test 5: !important usage
  console.log('\n5. !important usage...');
  const originalImportant = countImportantRules(originalCSS);
  const newImportant = countImportantRules(newCSS);
  console.log(`   Original: ${originalImportant} !important rules`);
  console.log(`   Refactored: ${newImportant} !important rules`);
  console.log(`   Reduction: ${originalImportant - newImportant} fewer !important rules`);
  
  // Test 6: Line count
  console.log('\n6. Line count...');
  const originalLines = originalCSS.split('\n').length;
  const newLines = newCSS.split('\n').length;
  console.log(`   Original: ${originalLines} lines`);
  console.log(`   Refactored: ${newLines} lines`);
  console.log(`   Reduction: ${((originalLines - newLines) / originalLines * 100).toFixed(2)}%`);
  
  console.log('\n✅ Mobile CSS testing complete!');
  
} catch (error) {
  console.error('❌ Error running tests:', error.message);
  process.exit(1);
}