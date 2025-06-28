#!/usr/bin/env node
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
  assetsPath: path.join(__dirname, '../public/assets'),
  originalsPath: path.join(__dirname, '../public/assets/originals'),
  sizeThresholdMB: 5 // Move images larger than 5MB to originals
};

// Get file size in MB
function getFileSizeInMB(filepath) {
  const stats = fs.statSync(filepath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

// Find large images
async function findLargeImages() {
  const pattern = path.join(CONFIG.assetsPath, '**/!(originals)/*.{jpg,jpeg,png,gif,webp}');
  const files = glob.sync(pattern, { nocase: true });
  
  const largeImages = [];
  
  for (const file of files) {
    const size = parseFloat(getFileSizeInMB(file));
    if (size >= CONFIG.sizeThresholdMB) {
      const relativePath = path.relative(CONFIG.assetsPath, file);
      largeImages.push({
        path: file,
        relativePath,
        sizeMB: size
      });
    }
  }
  
  return largeImages;
}

// Migrate images
async function migrateImages() {
  console.log('Searching for large images to migrate...');
  console.log(`Threshold: ${CONFIG.sizeThresholdMB} MB\n`);
  
  const largeImages = await findLargeImages();
  
  if (largeImages.length === 0) {
    console.log('No large images found that need migration.');
    return;
  }
  
  console.log(`Found ${largeImages.length} large images:\n`);
  
  for (const image of largeImages) {
    console.log(`  ${image.relativePath} (${image.sizeMB} MB)`);
  }
  
  console.log('\nThis script will:');
  console.log('1. Copy these images to the originals directory');
  console.log('2. Keep the optimized versions in place');
  console.log('3. You should manually delete the large versions from assets after confirming');
  
  // Ask for confirmation
  console.log('\nProceed with migration? (yes/no)');
  
  // For automated environments, you might want to add a --yes flag
  const args = process.argv.slice(2);
  if (!args.includes('--yes')) {
    console.log('Run with --yes flag to proceed automatically');
    return;
  }
  
  // Migrate each image
  for (const image of largeImages) {
    const targetPath = path.join(CONFIG.originalsPath, image.relativePath);
    const targetDir = path.dirname(targetPath);
    
    console.log(`\nMigrating: ${image.relativePath}`);
    
    try {
      // Ensure target directory exists
      await fs.ensureDir(targetDir);
      
      // Copy to originals
      await fs.copy(image.path, targetPath, { overwrite: true });
      console.log(`  ✓ Copied to originals`);
      
      // Note: We don't delete the original here for safety
      console.log(`  ℹ Original still exists at: ${image.relativePath}`);
      console.log(`  ℹ You should delete it manually after confirming optimization worked`);
      
    } catch (error) {
      console.error(`  ✗ Error: ${error.message}`);
    }
  }
  
  console.log('\n✓ Migration complete!');
  console.log('\nNext steps:');
  console.log('1. Run: npm run optimize-images');
  console.log('2. Verify optimized versions were created');
  console.log('3. Manually delete the large versions from public/assets/');
  console.log('\nLarge files to delete after verification:');
  
  for (const image of largeImages) {
    console.log(`  rm "${image.path}"`);
  }
}

// Run
migrateImages().catch(console.error);