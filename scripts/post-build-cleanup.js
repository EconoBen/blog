#!/usr/bin/env node

/**
 * Post-build cleanup script for Next.js
 * Removes large files from build directory that should not be deployed
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

console.log('Running post-build cleanup...');

// Remove video files
const videoExtensions = ['.mp4', '.m4v', '.mov', '.avi'];
const buildAssetsPath = path.join(__dirname, '../.next/static');
const publicAssetsPath = path.join(__dirname, '../public/assets');

// Clean .next/static directory
if (fs.existsSync(buildAssetsPath)) {
  videoExtensions.forEach(ext => {
    try {
      execSync(`find "${buildAssetsPath}" -name "*${ext}" -delete`, { stdio: 'inherit' });
      console.log(`Removed ${ext} files from .next/static`);
    } catch (error) {
      console.error(`Error removing ${ext} files:`, error.message);
    }
  });
}

// Clean public/assets directory (remove originals and videos)
if (fs.existsSync(publicAssetsPath)) {
  // Remove video files
  videoExtensions.forEach(ext => {
    try {
      execSync(`find "${publicAssetsPath}" -name "*${ext}" -delete`, { stdio: 'inherit' });
      console.log(`Removed ${ext} files from public/assets`);
    } catch (error) {
      console.error(`Error removing ${ext} files:`, error.message);
    }
  });
  
  // Remove originals directory if it exists
  const originalsPath = path.join(publicAssetsPath, 'originals');
  if (fs.existsSync(originalsPath)) {
    fs.rmSync(originalsPath, { recursive: true, force: true });
    console.log('Removed originals directory from public/assets');
  }
}

// Check final build size
try {
  const nextBuildSize = execSync('du -sh .next/', { encoding: 'utf-8' }).trim();
  console.log(`\nNext.js build size: ${nextBuildSize}`);
  
  const publicSize = execSync('du -sh public/', { encoding: 'utf-8' }).trim();
  console.log(`Public directory size: ${publicSize}`);
} catch (error) {
  console.log('Could not determine build sizes');
}

console.log('Post-build cleanup complete!');