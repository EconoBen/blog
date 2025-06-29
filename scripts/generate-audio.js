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
          reject(new Error(`OpenAI API error (${res.statusCode}): ${errorBody}`));
        });
        return;
      }

      const fileStream = require('fs').createWriteStream(outputPath);
      res.pipe(fileStream);
      
      fileStream.on('finish', () => {
        fileStream.close();
        resolve();
      });
      
      fileStream.on('error', (err) => {
        fs.unlink(outputPath, () => {}); // Delete the file on error
        reject(err);
      });
    });

    req.on('error', reject);
    req.write(postData);
    req.end();
  });
}

// Process a single markdown file
async function processMarkdownFile(filePath) {
  try {
    const filename = path.basename(filePath, '.md');
    console.log(`\nProcessing: ${filename}`);
    
    // Read the markdown content
    const content = await fs.readFile(filePath, 'utf-8');
    
    // Extract text for TTS
    const textContent = extractTextFromMarkdown(content);
    const contentHash = calculateHash(textContent);
    
    // Debug: write extracted text to file for inspection
    const debugPath = path.join(AUDIO_OUTPUT_DIR, `${filename}_processed.txt`);
    await fs.writeFile(debugPath, textContent);
    console.log(`  Debug: Processed text saved to ${debugPath}`);
    
    // Load cache to check if we need to regenerate
    const cache = await loadCache();
    const audioFilename = `${filename}.mp3`;
    const audioPath = path.join(AUDIO_OUTPUT_DIR, audioFilename);
    
    // Check if audio already exists and content hasn't changed (unless --force)
    if (!forceRegenerate && cache[filename] && cache[filename].hash === contentHash) {
      try {
        await fs.access(audioPath);
        console.log(`  ✓ Audio already exists and is up to date`);
        return { filename, audioFilename, status: 'cached' };
      } catch {
        // File doesn't exist, need to regenerate
        console.log(`  Audio file missing, regenerating...`);
      }
    } else if (forceRegenerate) {
      console.log(`  Force regeneration requested`);
    }
    
    // Split text into chunks if necessary
    const chunks = splitTextIntoChunks(textContent, MAX_CHARS_PER_REQUEST);
    
    if (chunks.length > 1) {
      console.log(`  Text is too long, splitting into ${chunks.length} chunks...`);
      
      // Save chunk information for debugging
      const chunkInfoPath = path.join(AUDIO_OUTPUT_DIR, `${filename}_chunks.json`);
      await fs.writeFile(chunkInfoPath, JSON.stringify({
        totalChunks: chunks.length,
        chunks: chunks.map((chunk, i) => ({
          index: i,
          length: chunk.length,
          preview: chunk.substring(0, 100) + '...'
        }))
      }, null, 2));
      
      // Generate audio for each chunk
      const chunkPaths = [];
      for (let i = 0; i < chunks.length; i++) {
        const chunkPath = path.join(AUDIO_OUTPUT_DIR, `${filename}_chunk_${i}.mp3`);
        console.log(`  Generating chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)...`);
        
        // Save chunk text for debugging
        const chunkTextPath = path.join(AUDIO_OUTPUT_DIR, `${filename}_chunk_${i}.txt`);
        await fs.writeFile(chunkTextPath, chunks[i]);
        
        await generateAudio(chunks[i], chunkPath);
        chunkPaths.push(chunkPath);
        
        // Small delay between chunks to avoid rate limiting
        if (i < chunks.length - 1) {
          await new Promise(resolve => setTimeout(resolve, 500));
        }
      }
      
      console.log(`  ✓ All chunks generated successfully`);
      
      // Check if ffmpeg is available
      const hasFfmpeg = await checkFfmpeg();
      
      if (hasFfmpeg) {
        console.log(`  Concatenating ${chunks.length} chunks with ffmpeg...`);
        try {
          await concatenateAudioFiles(chunkPaths, audioPath);
          console.log(`  ✓ Audio chunks concatenated successfully`);
          
          // Clean up chunk files if not in debug mode
          if (process.env.DEBUG !== 'true') {
            for (const chunkPath of chunkPaths) {
              await fs.unlink(chunkPath);
            }
          }
        } catch (error) {
          console.error(`  ✗ Failed to concatenate chunks: ${error.message}`);
          console.log(`  Using first chunk as fallback`);
          await fs.copyFile(chunkPaths[0], audioPath);
        }
      } else {
        console.log(`  ⚠️  ffmpeg not found. Using first chunk only.`);
        console.log(`  Install ffmpeg to concatenate all chunks automatically.`);
        await fs.copyFile(chunkPaths[0], audioPath);
      }
      
    } else {
      console.log(`  Generating audio (${textContent.length} characters)...`);
      await generateAudio(textContent, audioPath);
    }
    
    // Update cache
    cache[filename] = {
      hash: contentHash,
      generatedAt: new Date().toISOString(),
      audioFile: audioFilename,
      characterCount: textContent.length,
      chunks: chunks.length,
      processor: 'compromise',
      complete: chunks.length === 1 || (await checkFfmpeg())
    };
    await saveCache(cache);
    
    console.log(`  ✓ Audio generated successfully: ${audioFilename}`);
    return { filename, audioFilename, status: 'generated', chunks: chunks.length };
    
  } catch (error) {
    console.error(`  ✗ Error processing ${filePath}:`, error.message);
    return { filename: path.basename(filePath, '.md'), status: 'error', error: error.message };
  }
}

// Main function
async function main() {
  console.log('Audio Generation for Blog Posts (using Compromise NLP)');
  console.log('=====================================================\n');
  
  // Check for API key
  if (!OPENAI_API_KEY) {
    console.error('Error: OPENAI_API_KEY or OPENAI_TOKEN environment variable not set');
    console.error('Please set your OpenAI API key before running this script');
    process.exit(1);
  }
  
  // Ensure audio directory exists
  await ensureAudioDirectory();
  
  // Show options
  if (forceRegenerate) {
    console.log('Force regeneration: ENABLED');
  }
  if (process.env.DEBUG === 'true') {
    console.log('Debug mode: ENABLED (temporary files will be kept)');
  }
  
  // Check for ffmpeg
  const hasFfmpeg = await checkFfmpeg();
  console.log(`FFmpeg: ${hasFfmpeg ? 'Available' : 'Not found (audio chunks will not be concatenated)'}\n`);
  
  let markdownFiles;
  if (specificFile) {
    // Process specific file
    const filePath = path.join(POSTS_DIR, specificFile.endsWith('.md') ? specificFile : `${specificFile}.md`);
    markdownFiles = [filePath];
    console.log(`Processing specific file: ${specificFile}`);
  } else {
    // Get all markdown files
    const files = await fs.readdir(POSTS_DIR);
    markdownFiles = files
      .filter(file => file.endsWith('.md'))
      .map(file => path.join(POSTS_DIR, file));
    console.log(`Found ${markdownFiles.length} markdown files`);
  }
  
  console.log(`Audio output directory: ${AUDIO_OUTPUT_DIR}`);
  console.log(`Using voice: ${TTS_CONFIG.voice}, model: ${TTS_CONFIG.model}`);
  console.log(`Text processor: Compromise NLP\n`);
  
  // Process files
  const results = [];
  for (const file of markdownFiles) {
    const result = await processMarkdownFile(file);
    results.push(result);
    
    // Add a small delay to avoid rate limiting
    if (result.status === 'generated') {
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }
  
  // Summary
  console.log('\n\nSummary');
  console.log('=======');
  const generated = results.filter(r => r.status === 'generated').length;
  const cached = results.filter(r => r.status === 'cached').length;
  const errors = results.filter(r => r.status === 'error').length;
  const multiChunk = results.filter(r => r.chunks && r.chunks > 1).length;
  
  console.log(`Generated: ${generated}`);
  console.log(`Cached: ${cached}`);
  console.log(`Errors: ${errors}`);
  console.log(`Multi-chunk files: ${multiChunk}`);
  
  if (errors > 0) {
    console.log('\nErrors:');
    results
      .filter(r => r.status === 'error')
      .forEach(r => console.log(`  - ${r.filename}: ${r.error}`));
  }
  
  if (multiChunk > 0) {
    console.log('\nFiles requiring chunk concatenation:');
    results
      .filter(r => r.chunks && r.chunks > 1)
      .forEach(r => console.log(`  - ${r.filename}: ${r.chunks} chunks`));
  }
  
  const ffmpegAvailable = await checkFfmpeg();
  if (!ffmpegAvailable && multiChunk > 0) {
    console.log('\n⚠️  Warning: Install ffmpeg to properly concatenate multi-chunk audio files');
    console.log('  On macOS: brew install ffmpeg');
    console.log('  On Ubuntu: sudo apt-get install ffmpeg');
  }
  
  console.log('\nAudio generation complete!');
}

// Run the script
if (require.main === module) {
  main().catch(console.error);
}

module.exports = { generateAudio, extractTextFromMarkdown };