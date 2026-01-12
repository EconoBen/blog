1:"$Sreact.fragment"
2:I[2848,["874","static/chunks/874-218abc435b2ae46c.js","177","static/chunks/app/layout-04a0c423dc4c7100.js"],"default"]
3:I[7555,[],""]
4:I[1295,[],""]
6:I[9665,[],"OutletBoundary"]
9:I[4911,[],"AsyncMetadataOutlet"]
b:I[9665,[],"ViewportBoundary"]
d:I[9665,[],"MetadataBoundary"]
f:I[6614,[],""]
:HL["/_next/static/media/e4af272ccee01ff0-s.p.woff2","font",{"crossOrigin":"","type":"font/woff2"}]
:HL["/_next/static/css/e67a3fef1494970c.css","style"]
0:{"P":null,"b":"ZIsDc9NLOzuz-XovXmNxI","p":"","c":["","posts","adding-text-to-speech-to-your-blog-openai-tts-pipeline"],"i":false,"f":[[["",{"children":["posts",{"children":[["slug","adding-text-to-speech-to-your-blog-openai-tts-pipeline","d"],{"children":["__PAGE__",{}]}]}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/e67a3fef1494970c.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"__className_e8ce0c","children":["$","$L2",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":["posts",["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":[["slug","adding-text-to-speech-to-your-blog-openai-tts-pipeline","d"],["$","$1","c",{"children":[null,["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":"$undefined","forbidden":"$undefined","unauthorized":"$undefined"}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L5",null,["$","$L6",null,{"children":["$L7","$L8",["$","$L9",null,{"promise":"$@a"}]]}]]}],{},null,false]},null,false]},null,false]},null,false],["$","$1","h",{"children":[null,["$","$1","E1svyViLd2R8xlaI3oh0Nv",{"children":[["$","$Lb",null,{"children":"$Lc"}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}],["$","$Ld",null,{"children":"$Le"}]]}],false]],"m":"$undefined","G":["$f","$undefined"],"s":false,"S":true}
10:"$Sreact.suspense"
11:I[4911,[],"AsyncMetadata"]
e:["$","div",null,{"hidden":true,"children":["$","$10",null,{"fallback":null,"children":["$","$L11",null,{"promise":"$@12"}]}]}]
8:null
13:I[6874,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],""]
14:I[4372,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
15:I[1778,["874","static/chunks/874-218abc435b2ae46c.js","601","static/chunks/601-bda34c32a07f1aee.js","858","static/chunks/app/posts/%5Bslug%5D/page-9394db66ac0edac0.js"],"default"]
16:T316c,

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
5:["$","article",null,{"className":"post-detail","children":[["$","header",null,{"className":"post-header","children":[["$","div",null,{"className":"breadcrumb","children":["$","$L13",null,{"href":"/posts","children":"← Back to all posts"}]}],["$","h1",null,{"className":"post-title","children":"Adding Text-to-Speech to Your Blog: Building an OpenAI TTS Pipeline with Smart Chunking and AWS S3"}],["$","div",null,{"className":"post-meta","children":[["$","time",null,{"className":"post-date","children":"June 28, 2025"}],["$","span",null,{"className":"post-separator","children":"•"}],["$","span",null,{"className":"post-reading-time","children":[8," min read"]}]]}],["$","div",null,{"className":"post-tags","children":[["$","$L13","OpenAI",{"href":"/tags/OpenAI","className":"post-tag","children":"OpenAI"}],["$","$L13","TTS",{"href":"/tags/TTS","className":"post-tag","children":"TTS"}],["$","$L13","AWS",{"href":"/tags/AWS","className":"post-tag","children":"AWS"}],["$","$L13","S3",{"href":"/tags/S3","className":"post-tag","children":"S3"}],["$","$L13","React",{"href":"/tags/React","className":"post-tag","children":"React"}],["$","$L13","NLP",{"href":"/tags/NLP","className":"post-tag","children":"NLP"}],["$","$L13","Audio",{"href":"/tags/Audio","className":"post-tag","children":"Audio"}],["$","$L13","FFmpeg",{"href":"/tags/FFmpeg","className":"post-tag","children":"FFmpeg"}],["$","$L13","Node.js",{"href":"/tags/Node.js","className":"post-tag","children":"Node.js"}]]}]]}],["$","div",null,{"className":"post-cover-image","children":["$","img",null,{"src":"/assets/2025/06/tts-front-matter.png","alt":"Adding Text-to-Speech to Your Blog: Building an OpenAI TTS Pipeline with Smart Chunking and AWS S3"}]}],["$","div",null,{"className":"post-audio-section","children":["$","$L14",null,{"audioUrl":"https://tech-notes-blog.s3.us-west-2.amazonaws.com/audio/adding-text-to-speech-to-your-blog-openai-tts-pipeline.mp3","title":"Listen to this post","className":"post-audio-player"}]}],["$","div",null,{"className":"post-content","children":["$","$L15",null,{"content":"$16"}]}],["$","footer",null,{"className":"post-footer","children":[["$","div",null,{"className":"post-footer-tags","children":[["$","h3",null,{"children":"Tagged with:"}],["$","div",null,{"className":"post-tags","children":[["$","$L13","OpenAI",{"href":"/tags/OpenAI","className":"post-tag","children":"OpenAI"}],["$","$L13","TTS",{"href":"/tags/TTS","className":"post-tag","children":"TTS"}],["$","$L13","AWS",{"href":"/tags/AWS","className":"post-tag","children":"AWS"}],["$","$L13","S3",{"href":"/tags/S3","className":"post-tag","children":"S3"}],["$","$L13","React",{"href":"/tags/React","className":"post-tag","children":"React"}],["$","$L13","NLP",{"href":"/tags/NLP","className":"post-tag","children":"NLP"}],["$","$L13","Audio",{"href":"/tags/Audio","className":"post-tag","children":"Audio"}],["$","$L13","FFmpeg",{"href":"/tags/FFmpeg","className":"post-tag","children":"FFmpeg"}],["$","$L13","Node.js",{"href":"/tags/Node.js","className":"post-tag","children":"Node.js"}]]}]]}],["$","div",null,{"className":"post-navigation","children":["$","$L13",null,{"href":"/posts","className":"back-to-posts","children":"← View all posts"}]}]]}]]}]
c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
7:null
a:{"metadata":[["$","title","0",{"children":"Adding Text-to-Speech to Your Blog: Building an OpenAI TTS Pipeline with Smart Chunking and AWS S3 | Economic Notes"}],["$","meta","1",{"name":"description","content":"A technical deep-dive into building a production-ready text-to-speech pipeline for blog posts using OpenAI's TTS API, smart text processing with NLP, automatic chunking for long content, and AWS S3 for scalable audio hosting."}],["$","meta","2",{"name":"author","content":"Benjamin Labaschin"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"economics,technology,AI,machine learning,blog"}],["$","meta","5",{"property":"og:title","content":"Adding Text-to-Speech to Your Blog: Building an OpenAI TTS Pipeline with Smart Chunking and AWS S3"}],["$","meta","6",{"property":"og:description","content":"A technical deep-dive into building a production-ready text-to-speech pipeline for blog posts using OpenAI's TTS API, smart text processing with NLP, automatic chunking for long content, and AWS S3 for scalable audio hosting."}],["$","meta","7",{"property":"og:url","content":"https://econoben.dev/posts/adding-text-to-speech-to-your-blog-openai-tts-pipeline"}],["$","meta","8",{"property":"og:site_name","content":"Economic Notes"}],["$","meta","9",{"property":"og:image","content":"https://econoben.dev/assets/2025/06/tts-front-matter.png"}],["$","meta","10",{"property":"og:type","content":"article"}],["$","meta","11",{"property":"article:published_time","content":"2025-06-29T00:00:00.000Z"}],["$","meta","12",{"property":"article:author","content":"Benjamin Labaschin"}],["$","meta","13",{"property":"article:tag","content":"OpenAI"}],["$","meta","14",{"property":"article:tag","content":"TTS"}],["$","meta","15",{"property":"article:tag","content":"AWS"}],["$","meta","16",{"property":"article:tag","content":"S3"}],["$","meta","17",{"property":"article:tag","content":"React"}],["$","meta","18",{"property":"article:tag","content":"NLP"}],["$","meta","19",{"property":"article:tag","content":"Audio"}],["$","meta","20",{"property":"article:tag","content":"FFmpeg"}],["$","meta","21",{"property":"article:tag","content":"Node.js"}],["$","meta","22",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","23",{"name":"twitter:title","content":"Adding Text-to-Speech to Your Blog: Building an OpenAI TTS Pipeline with Smart Chunking and AWS S3"}],["$","meta","24",{"name":"twitter:description","content":"A technical deep-dive into building a production-ready text-to-speech pipeline for blog posts using OpenAI's TTS API, smart text processing with NLP, automatic chunking for long content, and AWS S3 for scalable audio hosting."}],["$","meta","25",{"name":"twitter:image","content":"https://econoben.dev/assets/2025/06/tts-front-matter.png"}]],"error":null,"digest":"$undefined"}
12:{"metadata":"$a:metadata","error":null,"digest":"$undefined"}
