#!/usr/bin/env node

/**
 * Script to help set up video hosting using GitHub Releases
 */

const fs = require('fs');
const path = require('path');

console.log('Setting up video hosting solution...\n');

// Find all video files
const videoExtensions = ['.mp4', '.m4v', '.mov', '.avi'];
const assetsPath = path.join(__dirname, '../public/assets');
const videos = [];

function findVideos(dir) {
  const files = fs.readdirSync(dir);
  files.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat.isDirectory()) {
      findVideos(filePath);
    } else if (videoExtensions.includes(path.extname(file).toLowerCase())) {
      const size = (stat.size / 1024 / 1024).toFixed(2);
      videos.push({
        path: filePath,
        name: file,
        size: size + ' MB',
        relativePath: filePath.replace(assetsPath, '')
      });
    }
  });
}

findVideos(assetsPath);

console.log('Found videos in your project:');
console.log('==============================');
videos.forEach(video => {
  console.log(`\n📹 ${video.name}`);
  console.log(`   Size: ${video.size}`);
  console.log(`   Path: ${video.relativePath}`);
});

console.log('\n\nTo host these videos on GitHub:');
console.log('================================');
console.log('1. Go to: https://github.com/EconoBen/blog/releases/new');
console.log('2. Create a new release (e.g., "v1.0-media")');
console.log('3. Upload these video files as release assets:');

videos.forEach(video => {
  console.log(`   - ${video.path}`);
});

console.log('\n4. After uploading, you\'ll get URLs like:');
console.log('   https://github.com/EconoBen/blog/releases/download/v1.0-media/video-name.mp4');

console.log('\n5. Update your markdown files to use these URLs');

// Create a mapping file
const videoMapping = {
  videos: videos.map(v => ({
    original: `/assets${v.relativePath}`,
    name: v.name,
    size: v.size,
    githubUrl: `https://github.com/EconoBen/blog/releases/download/v1.0-media/${v.name}`
  }))
};

fs.writeFileSync(
  path.join(__dirname, '../video-mapping.json'),
  JSON.stringify(videoMapping, null, 2)
);

console.log('\n✅ Created video-mapping.json with URL mappings');

// Create example HTML for video embedding
const exampleHtml = `
<!-- Example video embed code -->
<video controls width="100%" style="max-width: 600px; margin: 20px auto; display: block;">
  <source src="https://github.com/EconoBen/blog/releases/download/v1.0-media/VIDEO_NAME.mp4" type="video/mp4">
  Your browser does not support the video tag.
</video>

<!-- Or for a more styled version -->
<div style="position: relative; padding-bottom: 56.25%; height: 0; overflow: hidden; max-width: 100%; margin: 20px 0;">
  <video controls style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;">
    <source src="https://github.com/EconoBen/blog/releases/download/v1.0-media/VIDEO_NAME.mp4" type="video/mp4">
  </video>
</div>
`;

console.log('\n📝 Example HTML for embedding videos:');
console.log(exampleHtml);

console.log('\nAlternative: Use GitHub Gists for smaller videos (<100MB)');
console.log('Or consider YouTube for better performance and features.');