#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const { optimizeImages } = require('./optimize-images');

// Get command line arguments
const args = process.argv.slice(2);

if (args.length < 2) {
  console.log('Usage: npm run add-image <source-path> <year/month/filename>');
  console.log('Example: npm run add-image ~/Desktop/photo.jpg 2025/01/my-photo.jpg');
  process.exit(1);
}

const sourcePath = path.resolve(args[0]);
const targetRelativePath = args[1];

async function addImage() {
  try {
    // Validate source exists
    if (!await fs.pathExists(sourcePath)) {
      console.error(`Error: Source file not found: ${sourcePath}`);
      process.exit(1);
    }
    
    // Ensure target path has proper structure
    const pathParts = targetRelativePath.split('/');
    if (pathParts.length !== 3) {
      console.error('Error: Target path must be in format: year/month/filename');
      console.error('Example: 2025/01/my-image.jpg');
      process.exit(1);
    }
    
    const [year, month, filename] = pathParts;
    
    // Validate year and month
    if (!/^\d{4}$/.test(year) || !/^\d{2}$/.test(month)) {
      console.error('Error: Year must be 4 digits and month must be 2 digits');
      process.exit(1);
    }
    
    // Construct target path
    const originalsDir = path.join(__dirname, '../public/assets/originals');
    const targetDir = path.join(originalsDir, year, month);
    const targetPath = path.join(targetDir, filename);
    
    // Create directory structure
    await fs.ensureDir(targetDir);
    
    // Get file sizes
    const sourceStats = await fs.stat(sourcePath);
    const sourceSizeMB = (sourceStats.size / (1024 * 1024)).toFixed(2);
    
    console.log(`\nAdding image to originals:`);
    console.log(`  Source: ${sourcePath} (${sourceSizeMB} MB)`);
    console.log(`  Target: ${targetRelativePath}`);
    
    // Copy file to originals
    await fs.copy(sourcePath, targetPath, { overwrite: true });
    console.log('  ✓ Copied to originals directory');
    
    // Run optimization
    console.log('\nOptimizing image...');
    await optimizeImages();
    
    console.log('\n✓ Image added successfully!');
    console.log(`\nOptimized versions are now available in:`);
    console.log(`  public/assets/${year}/${month}/`);
    
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

addImage();