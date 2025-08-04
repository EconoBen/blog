#!/usr/bin/env node

const fs = require('fs').promises;
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { spawn } = require('child_process');
const nlp = require('compromise');

const OPENAI_API_KEY = process.env.OPENAI_API_KEY || process.env.OPENAI_TOKEN;
const AUDIO_OUTPUT_DIR = path.join(__dirname, '..', 'public', 'audio');
const POSTS_DIR = path.join(__dirname, '..', 'src', 'posts');
const CACHE_FILE = path.join(__dirname, '..', '.audio-cache.json');

// Configuration
const TTS_CONFIG = {
  model: 'tts-1-hd', // Use HD model for better quality
  voice: 'nova', // Options: alloy, echo, fable, onyx, nova, shimmer
  response_format: 'mp3',
  speed: 1.0
};

// Maximum characters per request (OpenAI limit is 4096)
const MAX_CHARS_PER_REQUEST = 4096;

// Parse command line arguments
const args = process.argv.slice(2);
const forceRegenerate = args.includes('--force');
const specificFile = args.find(arg => !arg.startsWith('--'));

// Create audio directory if it doesn't exist
async function ensureAudioDirectory() {
  try {
    await fs.mkdir(AUDIO_OUTPUT_DIR, { recursive: true });
  } catch (error) {
    console.error('Error creating audio directory:', error);
  }
}

// Check if ffmpeg is available
async function checkFfmpeg() {
  return new Promise((resolve) => {
    const ffmpeg = spawn('ffmpeg', ['-version']);
    ffmpeg.on('error', () => resolve(false));
    ffmpeg.on('exit', (code) => resolve(code === 0));
  });
}

// Concatenate audio files using ffmpeg
async function concatenateAudioFiles(inputFiles, outputFile) {
  return new Promise((resolve, reject) => {
    // Create a temporary file list for ffmpeg
    const listContent = inputFiles.map(f => `file '${path.basename(f)}'`).join('\n');
    const listFile = path.join(AUDIO_OUTPUT_DIR, 'concat_list.txt');
    
    fs.writeFile(listFile, listContent).then(() => {
      const ffmpeg = spawn('ffmpeg', [
        '-f', 'concat',
        '-safe', '0',
        '-i', listFile,
        '-c', 'copy',
        '-y', // Overwrite output
        outputFile
      ], {
        cwd: AUDIO_OUTPUT_DIR
      });

      let stderr = '';
      ffmpeg.stderr.on('data', (data) => {
        stderr += data.toString();
      });

      ffmpeg.on('error', (err) => {
        fs.unlink(listFile, () => {}); // Clean up
        reject(new Error(`FFmpeg error: ${err.message}`));
      });

      ffmpeg.on('exit', (code) => {
        fs.unlink(listFile, () => {}); // Clean up
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`FFmpeg exited with code ${code}: ${stderr}`));
        }
      });
    }).catch(reject);
  });
}

// Load cache of already generated audio files
async function loadCache() {
  try {
    const cacheContent = await fs.readFile(CACHE_FILE, 'utf-8');
    return JSON.parse(cacheContent);
  } catch (error) {
    return {};
  }
}

// Save cache
async function saveCache(cache) {
  await fs.writeFile(CACHE_FILE, JSON.stringify(cache, null, 2));
}

// Calculate hash of content for cache comparison
function calculateHash(content) {
  return crypto.createHash('md5').update(content).digest('hex');
}

// Extract and normalize text content from markdown
function extractTextFromMarkdown(markdown) {
  // Remove frontmatter
  let content = markdown.replace(/^---[\s\S]*?---\n/, '');
  
  // Remove all emojis and special Unicode characters
  content = content.replace(/[\u{1F300}-\u{1F9FF}]|[\u{1F600}-\u{1F64F}]|[\u{1F680}-\u{1F6FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]|[\u{1F900}-\u{1F9FF}]|[\u{1F1E0}-\u{1F1FF}]/gu, '');
  
  // Remove code blocks entirely
  content = content.replace(/```[\s\S]*?```/g, '');
  
  // Handle inline code - replace with the word or phrase without backticks
  content = content.replace(/`([^`]+)`/g, '$1');
  
  // Remove images completely
  content = content.replace(/!\[.*?\]\(.*?\)/g, '');
  
  // Extract link text, removing the URL
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
  
  // Handle HTML tags
  content = content.replace(/<\/?[^>]+(>|$)/g, ''); // remove all HTML tags
  
  // Convert headers to clear section breaks with pauses
  content = content.replace(/^#{1}\s+(.+)$/gm, '\n\n$1.\n\n');    // H1
  content = content.replace(/^#{2}\s+(.+)$/gm, '\n\n$1.\n\n');    // H2
  content = content.replace(/^#{3,6}\s+(.+)$/gm, '\n$1:\n');      // H3-H6
  
  // Handle bullet points and numbered lists
  content = content.replace(/^\s*[-*+]\s+/gm, '\n');
  content = content.replace(/^\s*\d+\.\s+/gm, '\n');
  
  // Use compromise to process the text
  let doc = nlp(content);
  
  // Expand contractions
  doc.contractions().expand();
  
  // Process money values using match
  const moneyMatches = doc.match('$#Value');
  moneyMatches.forEach(m => {
    const text = m.text();
    // Convert $53k to "53 thousand dollars"
    if (text.match(/\$\d+k/i)) {
      const num = text.match(/\d+/)[0];
      m.replaceWith(`${num} thousand dollars`);
    }
    // Convert $10m to "10 million dollars"
    else if (text.match(/\$\d+m/i)) {
      const num = text.match(/\d+/)[0];
      m.replaceWith(`${num} million dollars`);
    }
    // Convert $1b to "1 billion dollars"
    else if (text.match(/\$\d+b/i)) {
      const num = text.match(/\d+/)[0];
      m.replaceWith(`${num} billion dollars`);
    }
  });
  
  // Handle common abbreviations
  const abbreviations = {
    'Mr.': 'Mister',
    'Mrs.': 'Missus', 
    'Ms.': 'Miss',
    'Dr.': 'Doctor',
    'Prof.': 'Professor',
    'Sr.': 'Senior',
    'Jr.': 'Junior',
    'Co.': 'Company',
    'Corp.': 'Corporation',
    'Inc.': 'Incorporated',
    'Ltd.': 'Limited',
    'vs.': 'versus',
    'etc.': 'et cetera',
    'i.e.': 'that is',
    'e.g.': 'for example',
    'API': 'A P I',
    'URL': 'U R L',
    'URLs': 'U R Ls',
    'HTTP': 'H T T P',
    'HTTPS': 'H T T P S',
    'HTML': 'H T M L',
    'CSS': 'C S S',
    'JS': 'JavaScript',
    'SQL': 'S Q L',
    'OSS': 'open source software',
    'PC': 'personal computer',
    'GPU': 'G P U',
    'NVIDIA': 'N-vidia',
    'UCSD': 'U C S D'
  };
  
  // Get the processed text
  content = doc.text();
  
  // Apply additional abbreviation replacements
  for (const [abbr, full] of Object.entries(abbreviations)) {
    const regex = new RegExp(`\\b${abbr.replace('.', '\\.')}\\b`, 'g');
    content = content.replace(regex, full);
  }
  
  // Handle specific patterns that compromise might miss
  content = content.replace(/(\d+)k\b/g, '$1 thousand');
  content = content.replace(/(\d+)m\b/g, '$1 million');
  content = content.replace(/(\d+)b\b/g, '$1 billion');
  
  // Clean up whitespace
  content = content.replace(/\s+/g, ' ');
  content = content.replace(/\n\s*\n\s*\n/g, '\n\n');
  
  // Add natural pauses between paragraphs
  content = content.replace(/\.\s*\n\n/g, '.\n\n');
  
  // Ensure sentences end with proper punctuation
  content = content.replace(/([a-zA-Z0-9])\n\n/g, '$1.\n\n');
  
  return content.trim();
}

// Split text into chunks at natural boundaries
function splitTextIntoChunks(text, maxChars) {
  if (text.length <= maxChars) {
    return [text];
  }
  
  const chunks = [];
  
  // First try to split by double newlines (paragraphs)
  const paragraphs = text.split(/\n\n+/);
  let currentChunk = '';
  
  for (const paragraph of paragraphs) {
    const trimmedParagraph = paragraph.trim();
    if (!trimmedParagraph) continue;
    
    // If a single paragraph is too long, we need to split it by sentences
    if (trimmedParagraph.length > maxChars) {
      // Save current chunk if it exists
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }
      
      // Use compromise to split by sentences
      const doc = nlp(trimmedParagraph);
      const sentences = doc.sentences().out('array');
      
      for (const sentence of sentences) {
        if ((currentChunk + ' ' + sentence).length > maxChars && currentChunk.length > 0) {
          chunks.push(currentChunk.trim());
          currentChunk = sentence;
        } else {
          currentChunk += (currentChunk ? ' ' : '') + sentence;
        }
      }
    } else {
      // Check if adding this paragraph would exceed the limit
      const separator = currentChunk ? '\n\n' : '';
      const combined = currentChunk + separator + trimmedParagraph;
      
      if (combined.length > maxChars && currentChunk.length > 0) {
        chunks.push(currentChunk.trim());
        currentChunk = trimmedParagraph;
      } else {
        currentChunk = combined;
      }
    }
  }
  
  // Don't forget the last chunk
  if (currentChunk.trim()) {
    chunks.push(currentChunk.trim());
  }
  
  return chunks;
}

// Generate audio using OpenAI TTS API
async function generateAudio(text, outputPath) {
  return new Promise((resolve, reject) => {
    const postData = JSON.stringify({
      model: TTS_CONFIG.model,
      input: text,
      voice: TTS_CONFIG.voice,
      response_format: TTS_CONFIG.response_format,
      speed: TTS_CONFIG.speed
    });

    const options = {
      hostname: 'api.openai.com',
      port: 443,
      path: '/v1/audio/speech',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      if (res.statusCode !== 200) {
        let errorBody = '';
        res.on('data', chunk => errorBody += chunk);
        res.on('end', () => {
          reject(new Error(`API returned ${res.statusCode}: ${errorBody}`));
        });
        return;
      }

      const writeStream = require('fs').createWriteStream(outputPath);
      res.pipe(writeStream);
      
      writeStream.on('finish', () => {
        resolve();
      });
      
      writeStream.on('error', reject);
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Process a single markdown file
async function processMarkdownFile(filePath) {
  const slug = path.basename(filePath, '.md');
  console.log(`\nProcessing: ${slug}`);

  try {
    // Read the markdown file
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract and normalize text
    const normalizedText = extractTextFromMarkdown(content);
    const contentHash = calculateHash(normalizedText);
    
    // Load cache
    const cache = await loadCache();
    
    // Check if we need to regenerate
    if (!forceRegenerate && cache[slug] && cache[slug].hash === contentHash) {
      console.log(`  ✓ Already generated (cached)`);
      return;
    }
    
    // Split into chunks if necessary
    const chunks = splitTextIntoChunks(normalizedText, MAX_CHARS_PER_REQUEST);
    console.log(`  - Text length: ${normalizedText.length} characters`);
    console.log(`  - Split into ${chunks.length} chunk(s)`);
    
    const audioFiles = [];
    
    // Generate audio for each chunk
    for (let i = 0; i < chunks.length; i++) {
      const chunkFile = chunks.length > 1 
        ? path.join(AUDIO_OUTPUT_DIR, `${slug}_part${i + 1}.mp3`)
        : path.join(AUDIO_OUTPUT_DIR, `${slug}.mp3`);
      
      console.log(`  - Generating audio for chunk ${i + 1}/${chunks.length}...`);
      
      try {
        await generateAudio(chunks[i], chunkFile);
        audioFiles.push(chunkFile);
        console.log(`    ✓ Generated: ${path.basename(chunkFile)}`);
      } catch (error) {
        console.error(`    ✗ Error generating chunk ${i + 1}:`, error.message);
        // Clean up any partial files
        for (const file of audioFiles) {
          try {
            await fs.unlink(file);
          } catch (e) {}
        }
        throw error;
      }
    }
    
    // If multiple chunks, concatenate them
    if (chunks.length > 1) {
      const hasFfmpeg = await checkFfmpeg();
      if (hasFfmpeg) {
        const finalFile = path.join(AUDIO_OUTPUT_DIR, `${slug}.mp3`);
        console.log(`  - Concatenating ${chunks.length} chunks...`);
        
        try {
          await concatenateAudioFiles(audioFiles, finalFile);
          console.log(`    ✓ Created final audio: ${path.basename(finalFile)}`);
          
          // Clean up individual chunk files
          for (const file of audioFiles) {
            await fs.unlink(file);
          }
        } catch (error) {
          console.error(`    ✗ Error concatenating chunks:`, error.message);
          console.log(`    ! Individual chunks kept as fallback`);
        }
      } else {
        console.log(`  ! FFmpeg not found - keeping ${chunks.length} separate audio files`);
      }
    }
    
    // Update cache
    cache[slug] = {
      hash: contentHash,
      generatedAt: new Date().toISOString(),
      chunks: chunks.length
    };
    await saveCache(cache);
    
    console.log(`  ✓ Completed: ${slug}`);
  } catch (error) {
    console.error(`  ✗ Error processing ${slug}:`, error.message);
  }
}

// Main function
async function main() {
  if (!OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY or OPENAI_TOKEN environment variable is required');
    process.exit(1);
  }

  await ensureAudioDirectory();
  
  if (specificFile) {
    // Process a specific file
    const filePath = path.join(POSTS_DIR, specificFile.endsWith('.md') ? specificFile : `${specificFile}.md`);
    try {
      await fs.access(filePath);
      await processMarkdownFile(filePath);
    } catch (error) {
      console.error(`Error: File not found: ${filePath}`);
      process.exit(1);
    }
  } else {
    // Process all markdown files
    try {
      const files = await fs.readdir(POSTS_DIR);
      const mdFiles = files.filter(f => f.endsWith('.md'));
      
      console.log(`Found ${mdFiles.length} markdown files to process`);
      
      for (const file of mdFiles) {
        await processMarkdownFile(path.join(POSTS_DIR, file));
      }
      
      console.log('\n✓ Audio generation complete!');
    } catch (error) {
      console.error('Error reading posts directory:', error);
      process.exit(1);
    }
  }
}

// Run the script
main().catch(console.error);