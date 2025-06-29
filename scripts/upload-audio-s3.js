#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const { S3Client, PutObjectCommand, ListObjectsV2Command } = require('@aws-sdk/client-s3');
const crypto = require('crypto');

// Configuration
const BUCKET_NAME = process.env.S3_AUDIO_BUCKET || 'tech-notes-blog';
const REGION = process.env.AWS_REGION || 'us-west-2';
const AUDIO_DIR = path.join(__dirname, '..', 'public', 'audio');
const UPLOAD_CACHE_FILE = path.join(__dirname, '..', '.s3-upload-cache.json');

// Initialize S3 client
const s3Client = new S3Client({ region: REGION });

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
  console.log(`Audio directory: ${AUDIO_DIR}\n`);
  
  try {
    // Check if audio directory exists
    await fs.access(AUDIO_DIR);
  } catch (error) {
    console.error('Audio directory does not exist. Run generate-audio.js first.');
    process.exit(1);
  }
  
  // Load cache
  const uploadCache = await loadUploadCache();
  
  // Get all audio files (excluding chunk files)
  const files = await fs.readdir(AUDIO_DIR);
  const audioFiles = files.filter(file => 
    (file.endsWith('.mp3') || file.endsWith('.wav')) && 
    !file.includes('_chunk_')
  );
  
  if (audioFiles.length === 0) {
    console.log('No audio files found to upload.');
    return;
  }
  
  console.log(`Found ${audioFiles.length} audio files\n`);
  
  // Check S3 bucket exists
  try {
    await listS3Objects();
  } catch (error) {
    process.exit(1);
  }
  
  // Upload files
  const results = [];
  for (const filename of audioFiles) {
    const filePath = path.join(AUDIO_DIR, filename);
    const s3Key = `audio/${filename}`;
    
    try {
      // Calculate file hash
      const fileHash = await calculateFileHash(filePath);
      
      // Check if file needs to be uploaded
      if (uploadCache[filename] && uploadCache[filename].hash === fileHash) {
        console.log(`✓ ${filename} - Already uploaded (unchanged)`);
        results.push({
          filename,
          status: 'skipped',
          url: uploadCache[filename].url
        });
        continue;
      }
      
      // Upload file
      console.log(`↑ Uploading ${filename}...`);
      const url = await uploadFileToS3(filePath, s3Key);
      
      // Update cache
      uploadCache[filename] = {
        hash: fileHash,
        url,
        uploadedAt: new Date().toISOString(),
        size: (await fs.stat(filePath)).size
      };
      
      console.log(`✓ ${filename} - Uploaded successfully`);
      results.push({
        filename,
        status: 'uploaded',
        url
      });
      
    } catch (error) {
      console.error(`✗ ${filename} - Upload failed: ${error.message}`);
      results.push({
        filename,
        status: 'error',
        error: error.message
      });
    }
  }
  
  // Save updated cache
  await saveUploadCache(uploadCache);
  
  // Summary
  console.log('\n\nSummary');
  console.log('=======');
  const uploaded = results.filter(r => r.status === 'uploaded').length;
  const skipped = results.filter(r => r.status === 'skipped').length;
  const errors = results.filter(r => r.status === 'error').length;
  
  console.log(`Uploaded: ${uploaded}`);
  console.log(`Skipped: ${skipped}`);
  console.log(`Errors: ${errors}`);
  
  // Generate manifest file for the app
  const manifest = results.reduce((acc, result) => {
    if (result.status !== 'error') {
      const postName = result.filename.replace('.mp3', '').replace('.wav', '');
      acc[postName] = result.url;
    }
    return acc;
  }, {});
  
  const manifestPath = path.join(__dirname, '..', 'src', 'config', 'audioManifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\nGenerated audio manifest at: ${manifestPath}`);
  
  console.log('\nUpload complete!');
}

// Run if called directly
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { uploadFileToS3 };