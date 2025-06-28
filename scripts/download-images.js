const https = require('https');
const http = require('http');
const fs = require('fs');
const path = require('path');
const { URL } = require('url');

// Create posts directory if it doesn't exist
const postsDir = path.join(__dirname, '../public/posts');
if (!fs.existsSync(postsDir)) {
  fs.mkdirSync(postsDir, { recursive: true });
}

// Map of image URLs to local filenames
const imagesToDownload = [
  // 2024 Year in Review
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2025/01/niece_and_I-scaled.jpeg', filename: '2024_niece_and_i.jpeg' },
  
  // 2023 Year in Review
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-4.png', filename: '2023_books_read.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-2-1024x768.png', filename: '2023_sf_heatmap.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-3-1024x673.png', filename: '2023_nyc_heatmap.png' },
  
  // I Paid Off $194k
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2023/07/Principal-Paid-Down-Chart-1024x555.png', filename: 'principal_paid_down_chart.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2023/07/download.jpeg', filename: 'family_photo.jpeg' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2023/07/Pre-wedding-2007-002-300x225.jpg', filename: 'school_2006.jpg' },
  { url: 'https://upload.wikimedia.org/wikipedia/commons/thumb/3/37/Navient_logo.svg/220px-Navient_logo.svg.png', filename: 'navient_logo.png' },
  
  // Host Your Own Local LLM
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-5.png', filename: 'local_llm_1.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-6-1024x622.png', filename: 'local_llm_2.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-7-1024x541.png', filename: 'local_llm_3.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-8-1024x604.png', filename: 'local_llm_4.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-9-1024x562.png', filename: 'local_llm_5.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-10-1024x609.png', filename: 'local_llm_6.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-11-1024x524.png', filename: 'local_llm_7.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-12-1024x606.png', filename: 'local_llm_8.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-13-1024x594.png', filename: 'local_llm_9.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-14.png', filename: 'local_llm_10.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-15-1024x582.png', filename: 'local_llm_11.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-16-1024x620.png', filename: 'local_llm_12.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-17-1024x585.png', filename: 'local_llm_13.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-18-1024x609.png', filename: 'local_llm_14.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-19-1024x650.png', filename: 'local_llm_15.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-20.png', filename: 'local_llm_16.png' },
  { url: 'https://benjaminlabaschin.com/wp-content/uploads/2024/01/image-21.png', filename: 'local_llm_17.png' }
];

function downloadImage(imageUrl, filename) {
  return new Promise((resolve, reject) => {
    const filePath = path.join(postsDir, filename);
    
    // Skip if file already exists
    if (fs.existsSync(filePath)) {
      console.log(`✓ ${filename} already exists, skipping...`);
      resolve();
      return;
    }
    
    const file = fs.createWriteStream(filePath);
    const protocol = imageUrl.startsWith('https') ? https : http;
    
    console.log(`⬇ Downloading ${filename}...`);
    
    protocol.get(imageUrl, (response) => {
      if (response.statusCode !== 200) {
        reject(new Error(`Failed to download ${imageUrl}: ${response.statusCode}`));
        return;
      }
      
      response.pipe(file);
      
      file.on('finish', () => {
        file.close();
        console.log(`✓ Downloaded ${filename}`);
        resolve();
      });
    }).on('error', (err) => {
      fs.unlink(filePath, () => {}); // Delete incomplete file
      reject(err);
    });
  });
}

async function downloadAllImages() {
  console.log('Starting image download...\n');
  
  for (const { url, filename } of imagesToDownload) {
    try {
      await downloadImage(url, filename);
    } catch (error) {
      console.error(`✗ Failed to download ${filename}: ${error.message}`);
    }
  }
  
  console.log('\nImage download complete!');
}

downloadAllImages();