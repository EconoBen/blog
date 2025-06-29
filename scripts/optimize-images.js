// Skip image optimization on Vercel to avoid Sharp issues
if (process.env.VERCEL || process.env.CI) {
  console.log('Skipping image optimization in CI/Vercel environment');
  process.exit(0);
}

const sharp = require('sharp');
const fs = require('fs-extra');
const path = require('path');
const glob = require('glob');

// Configuration
const CONFIG = {
  originalsPath: path.join(__dirname, '../public/assets/originals'),
  assetsPath: path.join(__dirname, '../public/assets'),
  maxWidth: 2048,
  maxHeight: 2048,
  quality: 85,
  formats: {
    jpeg: { quality: 85, progressive: true },
    png: { quality: 90, compressionLevel: 9 },
    webp: { quality: 85 }
  },
  sizeVariants: [
    { suffix: '', maxWidth: 2048 },        // Original size (up to 2048px)
    { suffix: '-1536', maxWidth: 1536 },   // Large
    { suffix: '-1024', maxWidth: 1024 },   // Medium-large
    { suffix: '-768', maxWidth: 768 },     // Medium
    { suffix: '-300', maxWidth: 300 },     // Small
    { suffix: '-150', maxWidth: 150 }      // Thumbnail
  ]
};

// Get file size in MB
function getFileSizeInMB(filepath) {
  const stats = fs.statSync(filepath);
  return (stats.size / (1024 * 1024)).toFixed(2);
}

// Process a single image
async function processImage(originalPath, relativePath) {
  try {
    const ext = path.extname(originalPath).toLowerCase();
    const basename = path.basename(originalPath, ext);
    const outputDir = path.dirname(path.join(CONFIG.assetsPath, relativePath));
    
    // Ensure output directory exists
    await fs.ensureDir(outputDir);
    
    // Get image metadata
    const metadata = await sharp(originalPath).metadata();
    console.log(`\nProcessing: ${relativePath}`);
    console.log(`  Original size: ${getFileSizeInMB(originalPath)} MB (${metadata.width}x${metadata.height})`);
    
    // Skip if it's an SVG
    if (ext === '.svg') {
      const outputPath = path.join(outputDir, path.basename(originalPath));
      await fs.copy(originalPath, outputPath);
      console.log('  SVG copied without modification');
      return;
    }
    
    // Process each size variant
    for (const variant of CONFIG.sizeVariants) {
      const outputFilename = `${basename}${variant.suffix}${ext}`;
      const outputPath = path.join(outputDir, outputFilename);
      
      // Skip if the variant would be larger than the original
      if (variant.maxWidth >= metadata.width && variant.suffix !== '') {
        continue;
      }
      
      // Calculate dimensions maintaining aspect ratio
      const width = Math.min(variant.maxWidth, metadata.width);
      const height = Math.round((width / metadata.width) * metadata.height);
      
      // Process based on format
      let pipeline = sharp(originalPath)
        .resize(width, height, {
          fit: 'inside',
          withoutEnlargement: true
        });
      
      // Apply format-specific settings
      if (ext === '.jpg' || ext === '.jpeg') {
        pipeline = pipeline.jpeg(CONFIG.formats.jpeg);
      } else if (ext === '.png') {
        pipeline = pipeline.png(CONFIG.formats.png);
      }
      
      await pipeline.toFile(outputPath);
      
      const size = getFileSizeInMB(outputPath);
      console.log(`  Created ${outputFilename}: ${size} MB (${width}x${height})`);
    }
    
    // Also create a WebP version of the main image
    if (ext !== '.webp') {
      const webpPath = path.join(outputDir, `${basename}.webp`);
      await sharp(originalPath)
        .resize(CONFIG.maxWidth, CONFIG.maxHeight, {
          fit: 'inside',
          withoutEnlargement: true
        })
        .webp(CONFIG.formats.webp)
        .toFile(webpPath);
      
      const size = getFileSizeInMB(webpPath);
      console.log(`  Created ${basename}.webp: ${size} MB`);
    }
    
  } catch (error) {
    console.error(`Error processing ${originalPath}:`, error.message);
  }
}

// Find all images in originals directory
async function findOriginalImages() {
  const pattern = path.join(CONFIG.originalsPath, '**/*.{jpg,jpeg,png,gif,webp,svg}');
  const files = glob.sync(pattern, { nocase: true });
  
  return files.map(file => ({
    path: file,
    relative: path.relative(CONFIG.originalsPath, file)
  }));
}

// Main function
async function optimizeImages() {
  console.log('Starting image optimization...');
  console.log(`Originals path: ${CONFIG.originalsPath}`);
  console.log(`Assets path: ${CONFIG.assetsPath}`);
  
  // Ensure originals directory exists
  await fs.ensureDir(CONFIG.originalsPath);
  
  // Find all original images
  const images = await findOriginalImages();
  
  if (images.length === 0) {
    console.log('\nNo images found in originals directory.');
    console.log('Place your original images in: public/assets/originals/');
    console.log('They should follow the year/month structure, e.g.:');
    console.log('  public/assets/originals/2025/01/image.jpg');
    return;
  }
  
  console.log(`\nFound ${images.length} original images to process.`);
  
  // Process each image
  for (const image of images) {
    await processImage(image.path, image.relative);
  }
  
  console.log('\nImage optimization complete!');
}

// Run if called directly
if (require.main === module) {
  optimizeImages().catch(console.error);
}

module.exports = { optimizeImages };