#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const { fromIni } = require('@aws-sdk/credential-provider-ini');
const crypto = require('crypto');

// Configuration
const BUCKET_NAME = process.env.S3_AUDIO_BUCKET || 'tech-notes-blog';
const REGION = process.env.AWS_REGION || 'us-west-2';
const AWS_PROFILE = process.env.AWS_PROFILE || 'bjl';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');
const UPLOAD_CACHE_FILE = path.join(__dirname, '..', '.s3-upload-cache.json');
const AUDIO_MANIFEST_FILE = path.join(__dirname, '..', 'app', 'config', 'audioManifest.json');

// Initialize S3 client with profile
const s3Client = new S3Client({ 
  region: REGION,
  credentials: fromIni({ profile: AWS_PROFILE })
});

// Load upload cache
async function loadUploadCache() {
  try {
    const cacheContent = await fs.readFile(UPLOAD_CACHE_FILE, 'utf-8');
    return JSON.parse(cacheContent);
  } catch (error) {
    return {};
  }
}

// Save upload cache
async function saveUploadCache(cache) {
  await fs.writeFile(UPLOAD_CACHE_FILE, JSON.stringify(cache, null, 2));
}

// Calculate file hash for change detection
async function calculateFileHash(filePath) {
  const fileBuffer = await fs.readFile(filePath);
  return crypto.createHash('md5').update(fileBuffer).digest('hex');
}

// Upload a single file to S3
async function uploadFileToS3(filePath, key) {
  const fileContent = await fs.readFile(filePath);
  const contentType = path.extname(filePath) === '.mp3' ? 'audio/mpeg' : 'audio/wav';
  
  const command = new PutObjectCommand({
    Bucket: BUCKET_NAME,
    Key: key,
    Body: fileContent,
    ContentType: contentType,
    CacheControl: 'public, max-age=31536000', // Cache for 1 year
    Metadata: {
      'generated-by': 'blog-audio-generator',
      'source': 'openai-tts'
    }
  });
  
  await s3Client.send(command);
  return `https://${BUCKET_NAME}.s3.${REGION}.amazonaws.com/${key}`;
}

// List existing objects in S3
async function listS3Objects(prefix = '') {
  const command = new ListObjectsV2Command({
    Bucket: BUCKET_NAME,
    Prefix: prefix
  });
  
  try {
    const response = await s3Client.send(command);
    return response.Contents || [];
  } catch (error) {
    if (error.name === 'NoSuchBucket') {
      console.error(`\nError: S3 bucket '${BUCKET_NAME}' does not exist.`);
      console.error('Please create the bucket first or update the BUCKET_NAME environment variable.\n');
      throw error;
    }
    throw error;
  }
}

// Main upload function
async function main() {
  console.log('S3 Audio Upload Script');
  console.log('=====================\n');
  console.log(`Bucket: ${BUCKET_NAME}`);
  console.log(`Region: ${REGION}`);
  console.log(`AWS Profile: ${AWS_PROFILE}`);
  console.log(`Audio directory: ${AUDIO_DIR}\n`);
  
  try {
    // Check if audio directory exists
    await fs.access(AUDIO_DIR);
  } catch (error) {
    console.error('Audio directory does not exist. Run generate-audio.js first.');
    process.exit(1);
  }
  
  // List existing objects in S3
  console.log('Checking existing files in S3...');
  const existingObjects = await listS3Objects('audio/');
  const existingKeys = new Set(existingObjects.map(obj => obj.Key));
  console.log(`Found ${existingObjects.length} existing audio files in S3\n`);
  
  // Load upload cache
  const uploadCache = await loadUploadCache();
  
  // Get all audio files
  const audioFiles = await fs.readdir(AUDIO_DIR);
  const mp3Files = audioFiles.filter(f => f.endsWith('.mp3'));
  
  console.log(`Found ${mp3Files.length} audio files to process\n`);
  
  const audioManifest = {};
  let uploadCount = 0;
  let skipCount = 0;
  
  for (const file of mp3Files) {
    const filePath = path.join(AUDIO_DIR, file);
    const key = `audio/${file}`;
    const slug = file.replace('.mp3', '');
    
    try {
      // Calculate file hash
      const fileHash = await calculateFileHash(filePath);
      
      // Check if file needs to be uploaded
      if (uploadCache[file] && uploadCache[file].hash === fileHash && existingKeys.has(key)) {
        console.log(`✓ Skipping ${file} (already uploaded)`);
        audioManifest[slug] = uploadCache[file].url;
        skipCount++;
      } else {
        console.log(`⬆ Uploading ${file}...`);
        const url = await uploadFileToS3(filePath, key);
        console.log(`  ✓ Uploaded to: ${url}`);
        
        // Update cache
        uploadCache[file] = {
          hash: fileHash,
          url: url,
          uploadedAt: new Date().toISOString()
        };
        
        audioManifest[slug] = url;
        uploadCount++;
      }
    } catch (error) {
      console.error(`✗ Error uploading ${file}:`, error.message);
    }
  }
  
  // Save upload cache
  await saveUploadCache(uploadCache);
  
  // Save audio manifest for the React app
  await fs.writeFile(AUDIO_MANIFEST_FILE, JSON.stringify(audioManifest, null, 2));
  
  console.log('\n=============================');
  console.log(`✓ Upload complete!`);
  console.log(`  - Uploaded: ${uploadCount} files`);
  console.log(`  - Skipped: ${skipCount} files`);
  console.log(`  - Manifest saved to: ${AUDIO_MANIFEST_FILE}`);
  console.log('=============================\n');
  
  // Display URLs for testing
  if (Object.keys(audioManifest).length > 0) {
    console.log('Audio URLs for testing:');
    Object.entries(audioManifest).slice(0, 3).forEach(([slug, url]) => {
      console.log(`  ${slug}: ${url}`);
    });
    if (Object.keys(audioManifest).length > 3) {
      console.log(`  ... and ${Object.keys(audioManifest).length - 3} more`);
    }
  }
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});