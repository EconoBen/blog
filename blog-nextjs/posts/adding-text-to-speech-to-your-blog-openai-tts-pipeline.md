---
title: "Adding Text-to-Speech to Your Blog: Building an OpenAI TTS Pipeline with Smart Chunking and AWS S3"
date: "2025-06-29"
tags: ["OpenAI", "TTS", "AWS", "S3", "React", "NLP", "Audio", "FFmpeg", "Node.js"]
summary: "A technical deep-dive into building a production-ready text-to-speech pipeline for blog posts using OpenAI's TTS API, smart text processing with NLP, automatic chunking for long content, and AWS S3 for scalable audio hosting."
image: "/assets/2025/06/tts-front-matter.png"
---


![TTS Pipeline Architecture](/assets/2025/06/tts-front-matter.png)

## Intro

If you're reading this post then you probably want to add audio versions to your blog posts. Perhaps you've noticed more sites offering "listen to this article" features, or maybe you just want to make your content more accessible.

Whatever your reason, I'll show you exactly how I built a complete text-to-speech pipeline that automatically generates high-quality audio for every post on this blog—including the one you're reading right now.

This post assumes the following of you:

- You have a Node.js-based blog or can integrate Node scripts into your build process
- You have an OpenAI API key (for their TTS service)
- You have an AWS account with S3 access
- You're comfortable with basic command-line tools
- You want professional-quality audio without manual recording

Alright, let's get to it.

## The Architecture

Here's how the pipeline works end-to-end:

```tts-pipeline-diagram
# This will render our custom TTS pipeline diagram
```

The beauty of this system is that it's fully automated. Write a post, run the build, and audio appears. No manual steps, no recording equipment, just code.

## Text Processing: Making Markdown Sound Natural

The first challenge is that blog posts aren't written to be read aloud. They contain:
- Code blocks that shouldn't be narrated
- Abbreviations like "API" or "AWS"
- Special formatting like `$53k` or "Dec 2021"
- Emojis and special characters
- Links and images

Here's how I handle text extraction using the Compromise NLP library ([full source](https://github.com/EconoBen/blog/blob/main/scripts/generate-audio.js#L61-L106)):

```javascript
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

  // Extract link text, removing the URL
  content = content.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');

  // Use compromise to process the text
  let doc = nlp(content);

  // Expand contractions
  doc.contractions().expand();

  // Process money values
  const moneyMatches = doc.match('$#Value');
  moneyMatches.forEach(m => {
    const text = m.text();
    if (text.match(/\$\d+k/i)) {
      const num = text.match(/\d+/)[0];
      m.replaceWith(`${num} thousand dollars`);
    }
  });

  // Handle common abbreviations
  const abbreviations = {
    'API': 'A P I',
    'URL': 'U R L',
    'HTTP': 'H T T P',
    'HTTPS': 'H T T P S',
    'AWS': 'A W S',
    'GPU': 'G P U',
    // ... many more
  };

  return content.trim();
}
```

### Example Processing Output

Here's what the normalization does to actual text:

**Original:**
```
This year, I successfully paid off my private student loans by paying down the remaining $53k I had left.
I've been working on the API for NormConf using AWS.
```

**Processed:**
```
This year, I successfully paid off my private student loans by paying down the remaining 53 thousand dollars I had left.
I have been working on the A P I for NormConf using A W S.
```

The difference is subtle but crucial for natural-sounding speech.

## Chunking: Working Around OpenAI's 4096 Character Limit

OpenAI's TTS API has a hard limit of 4096 characters per request. For longer posts (like my student loans story at 43,138 characters), we need intelligent chunking ([view on GitHub](https://github.com/EconoBen/blog/blob/main/scripts/generate-audio.js#L132-L181)):

```javascript
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

    // If a single paragraph is too long, split by sentences
    if (trimmedParagraph.length > maxChars) {
      if (currentChunk.trim()) {
        chunks.push(currentChunk.trim());
        currentChunk = '';
      }

      // Use NLP to split by sentences
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

  return chunks;
}
```

This approach ensures we:
1. Never break in the middle of a sentence
2. Prefer paragraph boundaries when possible
3. Handle edge cases like single paragraphs longer than 4096 chars

## Audio Generation and Concatenation

Once we have our chunks, we generate audio for each and use FFmpeg to concatenate them seamlessly:

```javascript
// Generate audio for each chunk
const chunkPaths = [];
for (let i = 0; i < chunks.length; i++) {
  const chunkPath = path.join(AUDIO_OUTPUT_DIR, `${filename}_chunk_${i}.mp3`);
  console.log(`  Generating chunk ${i + 1}/${chunks.length} (${chunks[i].length} chars)...`);

  await generateAudio(chunks[i], chunkPath);
  chunkPaths.push(chunkPath);
}

// Concatenate with FFmpeg
if (hasFfmpeg) {
  console.log(`  Concatenating ${chunks.length} chunks with ffmpeg...`);
  await concatenateAudioFiles(chunkPaths, audioPath);

  // Clean up chunk files
  for (const chunkPath of chunkPaths) {
    await fs.unlink(chunkPath);
  }
}
```

The FFmpeg concatenation ensures there are no gaps or glitches between chunks—the audio flows naturally as if it were generated in one piece.

## Caching: Don't Regenerate Unchanged Content

To avoid unnecessary API calls and costs, I implement content-based caching:

```javascript
// Calculate hash of processed text
const contentHash = calculateHash(textContent);

// Check if audio already exists and content hasn't changed
if (!forceRegenerate && cache[filename] && cache[filename].hash === contentHash) {
  try {
    await fs.access(audioPath);
    console.log(`  ✓ Audio already exists and is up to date`);
    return { filename, audioFilename, status: 'cached' };
  } catch {
    console.log(`  Audio file missing, regenerating...`);
  }
}
```

The cache tracks:
- Content hash (MD5 of processed text)
- Generation timestamp
- Character count
- Number of chunks
- Whether the file is complete (all chunks concatenated)

## S3 Upload and Distribution

Once audio files are generated, they're uploaded to S3 for global distribution:

```javascript
// Upload to S3 with caching headers
const command = new PutObjectCommand({
  Bucket: BUCKET_NAME,
  Key: `audio/${filename}`,
  Body: fileContent,
  ContentType: 'audio/mpeg',
  CacheControl: 'public, max-age=31536000', // Cache for 1 year
  Metadata: {
    'generated-by': 'blog-audio-generator',
    'source': 'openai-tts'
  }
});

await s3Client.send(command);
```

The upload script also generates a manifest file mapping post slugs to S3 URLs:

```json
{
  "2022_reflection": "https://tech-notes-blog.s3.us-west-2.amazonaws.com/audio/2022_reflection.mp3",
  "building_an_https_model_apI_for_cheap": "https://tech-notes-blog.s3.us-west-2.amazonaws.com/audio/building_an_https_model_apI_for_cheap.mp3",
  // ... more posts
}
```

## Frontend: The Audio Player Component

The React audio player provides a clean interface with all the controls readers expect ([full component](https://github.com/EconoBen/blog/blob/main/src/components/AudioPlayer.tsx)):

```jsx
const AudioPlayer = ({ audioUrl, title }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  // ... audio event handlers

  return (
    <div className="audio-player">
      <div className="audio-player-header">
        <span className="audio-player-title">{title}</span>
      </div>

      <div className="audio-player-controls">
        <button onClick={togglePlayPause}>
          {isPlaying ? <PauseIcon /> : <PlayIcon />}
        </button>

        <div className="audio-player-time">
          {formatTime(currentTime)} / {formatTime(duration)}
        </div>

        <div className="audio-player-progress" onClick={handleProgressClick}>
          <div
            className="audio-player-progress-fill"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <button onClick={handleSpeedChange}>
          {playbackRate}x
        </button>
      </div>
    </div>
  );
};
```

Features include:
- Play/pause toggle
- Progress bar with seeking
- Time display (current/total)
- Playback speed control (1x, 1.25x, 1.5x, 1.75x, 2x)
- Loading states and error handling

## Results and Performance

The complete pipeline processes all 14 posts on this blog in about 15 minutes:
- 11 posts required chunking (2-11 chunks each)
- Total of 33 audio chunks generated
- Longest post: 43,138 characters (11 chunks)
- All audio seamlessly concatenated with FFmpeg
- Zero manual intervention required

## Cost Analysis

OpenAI TTS pricing:
- tts-1-hd: $0.030 per 1,000 characters
- Average blog post: ~10,000 characters = $0.30
- Total for 14 posts: ~$4.20

AWS S3 costs:
- Storage: ~100MB total = $0.0023/month
- Bandwidth: Depends on traffic, but audio files are cached for 1 year

## The Command Line Interface

Simple npm scripts make the whole process painless:

```bash
# Generate audio for all posts
npm run generate-audio

# Generate for specific post
npm run generate-audio post-name

# Force regenerate (ignore cache)
npm run generate-audio post-name --force

# Upload to S3
npm run upload-audio

# Full pipeline
npm run process-audio
```

## Lessons Learned

1. **Text normalization is crucial** - Raw markdown sounds terrible when read aloud
2. **Smart chunking matters** - Breaking at sentence boundaries maintains flow
3. **Caching saves money** - Content-based hashing prevents unnecessary regeneration
4. **FFmpeg is your friend** - Seamless audio concatenation with one command
5. **S3 + CloudFront works great** - Fast global delivery with minimal configuration

## Try It Yourself

If you want to implement this for your own blog, you'll need:
1. OpenAI API key (get one at platform.openai.com)
2. AWS account with S3 bucket
3. Node.js environment
4. FFmpeg installed locally
5. About an hour to set everything up

The complete implementation is running on this blog—in fact, you can listen to this very post by clicking the audio player at the top.

## Source Code

All the code for this TTS pipeline is available on GitHub:

- **Audio Generation Script**: [scripts/generate-audio.js](https://github.com/EconoBen/blog/blob/main/scripts/generate-audio.js) - Core logic for text extraction, NLP processing, chunking, and OpenAI API integration
- **S3 Upload Script**: [scripts/upload-audio-s3.js](https://github.com/EconoBen/blog/blob/main/scripts/upload-audio-s3.js) - Handles uploading audio files to S3 and generating the manifest
- **Audio Player Component**: [src/components/AudioPlayer.tsx](https://github.com/EconoBen/blog/blob/main/src/components/AudioPlayer.tsx) - React component with full playback controls
- **Post Detail Integration**: [src/components/PostDetail.tsx](https://github.com/EconoBen/blog/blob/main/src/components/PostDetail.tsx) - Shows how the audio player is integrated into blog posts
- **Audio Manifest**: [src/config/audioManifest.json](https://github.com/EconoBen/blog/blob/main/src/config/audioManifest.json) - Maps post slugs to S3 audio URLs
- **Setup Documentation**: [docs/AUDIO_SETUP.md](https://github.com/EconoBen/blog/blob/main/docs/AUDIO_SETUP.md) - Detailed setup instructions

Happy listening!
