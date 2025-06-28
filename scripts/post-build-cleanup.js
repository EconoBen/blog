#!/usr/bin/env node

/**
 * Post-build cleanup script
 * Removes large files from build directory that should not be deployed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running post-build cleanup...');

// Remove video files
const videoExtensions = ['.mp4', '.m4v', '.mov', '.avi'];
const buildAssetsPath = path.join(__dirname, '../build/assets');

if (fs.existsSync(buildAssetsPath)) {
  // Find and remove video files
  videoExtensions.forEach(ext => {
    try {
      execSync(`find "${buildAssetsPath}" -name "*${ext}" -delete`, { stdio: 'inherit' });
      console.log(`Removed ${ext} files from build`);
    } catch (error) {
      console.error(`Error removing ${ext} files:`, error.message);
    }
  });
  
  // Remove originals directory if it exists
  const originalsPath = path.join(buildAssetsPath, 'originals');
  if (fs.existsSync(originalsPath)) {
    fs.rmSync(originalsPath, { recursive: true, force: true });
    console.log('Removed originals directory from build');
  }
}

// Check final build size
const buildSize = execSync('du -sh build/', { encoding: 'utf-8' }).trim();
console.log(`\nFinal build size: ${buildSize}`);

console.log('Post-build cleanup complete!');