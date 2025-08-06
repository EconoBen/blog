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
0:{"P":null,"b":"ZIsDc9NLOzuz-XovXmNxI","p":"","c":["",""],"i":false,"f":[[["",{"children":["__PAGE__",{}]},"$undefined","$undefined",true],["",["$","$1","c",{"children":[[["$","link","0",{"rel":"stylesheet","href":"/_next/static/css/e67a3fef1494970c.css","precedence":"next","crossOrigin":"$undefined","nonce":"$undefined"}]],["$","html",null,{"lang":"en","children":["$","body",null,{"className":"__className_e8ce0c","children":["$","$L2",null,{"children":["$","$L3",null,{"parallelRouterKey":"children","error":"$undefined","errorStyles":"$undefined","errorScripts":"$undefined","template":["$","$L4",null,{}],"templateStyles":"$undefined","templateScripts":"$undefined","notFound":[[["$","title",null,{"children":"404: This page could not be found."}],["$","div",null,{"style":{"fontFamily":"system-ui,\"Segoe UI\",Roboto,Helvetica,Arial,sans-serif,\"Apple Color Emoji\",\"Segoe UI Emoji\"","height":"100vh","textAlign":"center","display":"flex","flexDirection":"column","alignItems":"center","justifyContent":"center"},"children":["$","div",null,{"children":[["$","style",null,{"dangerouslySetInnerHTML":{"__html":"body{color:#000;background:#fff;margin:0}.next-error-h1{border-right:1px solid rgba(0,0,0,.3)}@media (prefers-color-scheme:dark){body{color:#fff;background:#000}.next-error-h1{border-right:1px solid rgba(255,255,255,.3)}}"}}],["$","h1",null,{"className":"next-error-h1","style":{"display":"inline-block","margin":"0 20px 0 0","padding":"0 23px 0 0","fontSize":24,"fontWeight":500,"verticalAlign":"top","lineHeight":"49px"},"children":404}],["$","div",null,{"style":{"display":"inline-block"},"children":["$","h2",null,{"style":{"fontSize":14,"fontWeight":400,"lineHeight":"49px","margin":0},"children":"This page could not be found."}]}]]}]}]],[]],"forbidden":"$undefined","unauthorized":"$undefined"}]}]}]}]]}],{"children":["__PAGE__",["$","$1","c",{"children":["$L5",null,["$","$L6",null,{"children":["$L7","$L8",["$","$L9",null,{"promise":"$@a"}]]}]]}],{},null,false]},null,false],["$","$1","h",{"children":[null,["$","$1","cLkEykV2Arj3dCwoV5Ryrv",{"children":[["$","$Lb",null,{"children":"$Lc"}],["$","meta",null,{"name":"next-size-adjust","content":""}]]}],["$","$Ld",null,{"children":"$Le"}]]}],false]],"m":"$undefined","G":["$f","$undefined"],"s":false,"S":true}
10:"$Sreact.suspense"
11:I[4911,[],"AsyncMetadata"]
13:I[2898,["874","static/chunks/874-218abc435b2ae46c.js","974","static/chunks/app/page-7cde50b2d444d68b.js"],"default"]
14:I[7893,["874","static/chunks/874-218abc435b2ae46c.js","974","static/chunks/app/page-7cde50b2d444d68b.js"],"default"]
1f:I[671,["874","static/chunks/874-218abc435b2ae46c.js","974","static/chunks/app/page-7cde50b2d444d68b.js"],"MainContent"]
25:I[8818,["874","static/chunks/874-218abc435b2ae46c.js","974","static/chunks/app/page-7cde50b2d444d68b.js"],"SidebarToggle"]
e:["$","div",null,{"hidden":true,"children":["$","$10",null,{"fallback":null,"children":["$","$L11",null,{"promise":"$@12"}]}]}]
15:T316c,

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
16:Ted8,

AI is redefining the economy. This is a not a question or a prediction, but a fact. Companies such as Meta, Amazon, Alphabet, and Microsoft [are investing](https://arxiv.org/abs/2303.10130) hundreds of billions of dollars in AI data centers in 2025—the equivalent of the GDP of small nations. [From November 2022 – when ChatGPT launched – to the end of 2024, 65% of the growth in market capitalisation of the S&P 500 came from companies that either deploy AI or integrate AI into their core operations.](https://www.iea.org/reports/energy-and-ai) Labor is being redefined by the emergence of AI and agents acting as general purpose technologies (GPTs) as defined in [GPTs Are GPTs (2023)](https://arxiv.org/abs/2303.10130). At this point, we have enough evidence to suggest AI is redefining the economy. Yet despite this unprecedented investment and market response, we still lack granular empirical evidence about how AI exposure translates into actual economic transformation at the firm level.

A more interesting question, then, is *how* is AI impacting the economy. If we focus our question narrowly enough, such as, "how are the dynamics of AI reflected in labor demand among  firms?" we can start to see some interesting patterns. At least, those are the claims my co-authors and I make in our recently published paper [Extending "GPTs Are GPTs" to Firms (2025)](https://www.aeaweb.org/articles?id=10.1257/pandp.20251045) in the American Economic Associations (AEA) Papers and Proceedings.

Using workforce composition data from 7,894 publicly traded firms, we find unmistakable variations in AI exposure across companies. The average firm has approximately 17% of its workers' tasks exposed to large language models alone—but this figure jumps to 47% when accounting for partial integration with complementary software tools such as GitHub Copilot. These aren't hypothetical projections; they represent measurable exposure based on the actual occupational mix within each firm's workforce.

Perhaps most intriguingly, as my coauthor Sam Manning [highlights in his analysis](https://typefully.com/t/gsUTw14), we document substantial gaps between firms' measured exposure to AI and their reported adoption rates. This suggests that AI integration is happening organically at the worker level, potentially flying under the radar of executive surveys and formal adoption metrics. Tech firms and those with higher concentrations of AI-skilled workers show the highest exposure, while larger firms consistently outpace smaller ones—patterns that align with broader adoption trends but reveal much more granular economic dynamics.

This bears repeating: the impacts of AI already seem to be dependent upon productivity exposure and are highly-varied between firms in the economy—with potentially the biggest benefits going to "superstar firms" with the greatest digital capital (see [Digital Capital and Superstar Firms (2020)](https://www.nber.org/system/files/working_papers/w28285/w28285.pdf). Do these results imply that AI will inflame labor inequalities, or attenuate them? And, will these inequalities be most visible intra-firm or inter-firm? This is an area of active research among my co-authors and me.

What we do know now is that the redefinition of the world economy by AI may end up being uneven—with superstar firms reaping greater benefits. That being said, such an outcome wouldn't preclude more economy-wide gains. Smaller firms may well become more productive, relying on complementary technologies such as Copilot to operate with leaner labor forces, producing more than they'd do on their own. Moving forward, the question isn't whether AI will reshape competitive advantage—it's whether and how firms will recognize the transformation while it's happening.
17:T64b9,

![Cole Thomas - The Oxbow](/assets/2025/01/1060px-Cole_Thomas_The_Oxbow_The_Connecticut_River_near_Northampton_1836-1.jpg)

**Ben Labaschin **on Jan 06, 2025 **3

## Host Your Own Local LLM / RAG Behind a Private VPN, Access It From Anywhere

# Part One

#### Building Our LLM: Making It Accessible To Us Alone—Anywhere

The other day, I was reading [this](https://tdhopper.com/blog/accessing-my-home-server-around-the-world-with-custom-domain-names/) article by Tim Hopper about how to host your Synology and Synology services on their own (sub)domains all while hiding each service behind a personal VPN. As I was following along the article, implementing this solution on my own Synology, I realized—wait, why couldn't I use my Synology to serve my own LLM service through a custom domain too? For that matter, if I built a RAG around my Obsidian notes (also stored and served on my Synology), I could theoretically have my own note-based RAG accessible anywhere in the world, without taking up precious compute on my local computer to serve it.

What followed was a few hours of tinkering and learning. After troubleshooting a few mistakes made along the way, I had it: my own local model and RAG system hidden behind a lightweight VPN (Tailscale), accessible only by me anywhere in the world (with an internet connection).

In this first article, I will walk you through how I built this system up until you are able to access your own, personal LLM located safely behind a Tailscale VPN. In a follow-up article, I will describe how I built a RAG system for my notes that I can query.

**Services Used In This Article**

| Service                                                 | Description                                                                     | Cost(s)                                                                                                                                                                                        |
| ------------------------------------------------------- | ------------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Cloudflare](https://www.cloudflare.com/)               | For hosting a domain.                                                           | Domain reservation, potential transfer costs from a different host                                                                                                                             |
| [Caddy](https://caddyserver.com/)                       | For creating a reverse-proxy service for my sub-domains.                        | Free                                                                                                                                                                                           |
| [Tailscale](https://tailscale.com/)                     | A lightweight VPN to hide my services behind.                                   | Free for personal use                                                                                                                                                                          |
| [Ollama](https://ollama.com/)                           | For building and serving my LLM.                                                | Free                                                                                                                                                                                           |
| [Synology NAS](https://www.synology.com/en-us)          | A personal home cloud solution for hosting files, services, and much more.      | Pricey. Check out [NewEgg](https://www.newegg.com/) or [B\&H](https://www.newegg.com/), they periodically have sales.                                                                          |
| (Optional) [Raspberry Pi](https://www.raspberrypi.com/) | For hosting my reverse proxy service (you can just use Synology if you'd like). | You can get a Raspberry Pi for "cheap" these days on [Amazon](https://a.co/d/eq9d0ql) or wherever you buy your tech. If you want to be really rebellious, you could even try using an old fold |

## Where To Proxy?

A brief note about where to place your reverse proxy. Your Synology NAS (or whatever cloud solution you use) is very likely capable of hosting the reverse proxy. Most of the instructions below will apply the same way. The reason I host my reverse proxy on a separate machine than my NAS is:

1. **Separation of concerns**: My Synology already does a lot and if I can offload something lightweight to my Pi, I will.
2. **Paranoia**: With my reverse proxy on the Pi, that's one step away from the Synology and makes it somewhat more secure.
3. **Troubleshooting**: If I want to adjust the proxy in someway, I just need to mess with the Pi and not the Synology as well.

# **Setting Up Our Reverse Proxy**

### Access Your Reverse Proxy Machine

To get started, let's begin by creating our reverse proxy server. For the uninitiated, a reverse proxy server is basically just system that sits between a client device—which hopes to access certain backend services—and the services themselves. Reverse proxies are appealing for many reasons. For our purposes they're convenient because they:

1. Centralize access to our services through a single, secure point of entry.
2. Act as a central pipeline to reroute client device requests (i.e. CLI or GUI API calls) to their appropriate backend services.

I'm going to be setting up my reverse proxy on my Raspberry Pi. Should you want to set up a different way, there are plenty of articles like [this](https://www.wundertech.net/synology-reverse-proxy-setup-config/) one.

The first thing you'll want to do is find your Raspberry Pi IP address (or whatever machine you plan to host your reverse proxy on). Note, the machine you host on should be an always-on server. So a personal laptop probably won't do. If you don't know what network your Pi / machine is on, you can try the following lines of code try the [arp-scan](https://formulae.brew.sh/formula/arp-scan) package to scan your local network for a Raspberry Pi.

```bash
sudo arp-scan --interface=eth0 --localnet # alternatively try wlan0
```

Once you see your pi, you'll want to `ssh` into the network. You'll need the hostname of the service. Usually the hostname is `raspberrypi`. Altogether you'll type:

```shell
ssh raspberrypi@<LOCAL IP>
```

Here's an example of what that will look like.

![SSHing into your reverse proxy machine via CLI](/assets/2025/01/ssh_into_pi.png)

SSHing into your reverse proxy machine via CLI

## Install and Setup Tailscale on Your Raspberry Pi

Once you’re connected to your “always-on” reverse proxy machine (in my case, a Raspberry Pi), we'll want to install [Tailscale](https://tailscale.com/) to keep everything private. Tailscale creates a lightweight VPN, meaning only devices you’ve authenticated can access your reverse proxy—or any other service behind it.

1. **Install Tailscale**\
   If you’re on a Raspberry Pi, you can follow Tailscale’s official docs or run:

   ```bash
   curl -fsSL https://tailscale.com/install.sh | sh
   ```

   That script detects your Pi’s OS and installs Tailscale for you.

2. **Authenticate Your Pi**

   ```bash
   sudo tailscale up
   ```

   This will give you a link to tailscale.com where you log in with your own account, or SSO using a Google/GitHub/Microsoft account. Once authorized, your Pi will show up in your Tailscale admin panel.

3. **Verify Connectivity**\
   On another device already running Tailscale (like your laptop), run:

   ```bash
   ping <tailscale-ip-of-your-pi>
   ```

If you see responses, you’re good to go. No one else on the internet can see that IP—only your Tailscale-connected devices.

## **Install Tailscale n Your Synology**

Next, let’s do the same on your Synology, so it can join the Tailscale network and expose services via its Tailscale IP.

1. Open Synology Package Center and search for **Tailscale** (or manually install Tailscale following official instructions).
2. Log into Tailscal\* directly from the Synology Tailscale client. The NAS should now appear in your Tailscale admin panel.
3. Grab the Synology Tailscale IP by checking the Tailscale client UI or your admin panel. It typically looks like `100.x.x.x`.

Keep that IP handy—we’ll need it next when we configure Caddy to reverse-proxy Synology services.

## **Obtain a Domain Name**

If you want to access your home services at a nice custom URL (like `home.mydomain.com`), you’ll need a domain. You can purchase (or transfer) a domain in a few ways:

* Through Cloudflare directly, if you want to manage everything in one place.
* Via a separate registrar like Namecheap or GoDaddy. If you do this, just update your domain’s nameservers to point to Cloudflare so Cloudflare can manage the DNS records.

Personally, every domain I have, I have now transferred to Cloudflare. I like what they're doing as a company, and appreciate all the options and quality of life use-cases afforded to me with a Cloudflare account. Whichever route you choose, once you have the domain set up in your dashboard, you’ll be ready to add DNS records for your Tailscale IP and configure Caddy.

## **Add a Cloudflare DNS Record for Your Tailscale IP**

Before we move on to obtaining a Cloudflare API token, let’s create (or update) the DNS record for the domain/subdomain that will point to your Pi.

1. Log In to your Cloudflare dashboard.
2. Select Your Domain from the list.
3. **Go to DNS** → **Records** → Click **Add record**.
4. **Record Type**: Choose **A**.
5. **Name**: Enter the subdomain you’ll be using (e.g. `home` for `home.mydomain.com`).
6. **IPv4 address**: Paste the Tailscale IP of your Pi (e.g. `100.x.x.x`).
7. **Proxy status**: Typically set to “DNS only” so traffic goes directly to your Pi over Tailscale. *(Some folks prefer turning off Cloudflare’s orange-cloud proxying here, since Tailscale is handling security.)*

Save the record. Even though this Tailscale IP isn’t publicly routable, Cloudflare will still let you create an A record for it—this is **key** to how Caddy does its DNS challenge. If you are not using Cloudflare, the API token logic should similarly apply to through your domain provider.

## **Add a Wildcard DNS Record for Your Tailscale IP (Optional)**

If you’d like to use multiple subdomains (e.g., `home.mydomain.com`, `llm.mydomain.com`, `photos.mydomain.com`, etc.) without adding separate A records each time, you can create a **wildcard** A record. This instructs Cloudflare that any subdomain of `mydomain.com` should resolve to the same IP—in our case, your Pi’s Tailscale IP.

1. Log In to your Cloudflare dashboard.
2. Select Your Domain from the list.
3. **Go to DNS** → **Records** → Click **Add Record**.
4. **Record Type**: Choose **A**.
5. **Name**: Enter `*` (this is your wildcard subdomain).
6. **IPv4 address**: Paste the Tailscale IP of your Pi (e.g., `100.x.x.x`).
7. **Proxy status**: Typically set to “DNS only” so traffic goes directly to your Pi over Tailscale.

Click **Save**. Even though `100.x.x.x` isn’t publicly routable, Cloudflare will still let you create an A record for it—this is **key** to how Caddy does its DNS challenge. Now, **any** subdomain like `home.mydomain.com` or `llm.mydomain.com` will resolve to your Pi’s Tailscale IP.

### Install and Setup Caddy

Next, we install [Caddy](https://caddyserver.com/) on the Pi to handle the actual reverse proxying.

1. **Install Caddy**

   **First, update your package list and install necessary tools for secure package management.**

   ```bash
   sudo apt-get update
   sudo apt-get install -y debian-keyring debian-archive-keyring apt-transport-https
   ```

   **This downloads and installs Caddy's GPG security from Cloudsmith (a package distribution platform).**

   ```bash
   curl -1sLf https://dl.cloudsmith.io/public/caddy/stable/gpg.key | sudo gpg --dearmor -o /usr/share/keyrings/caddy-stable-archive-keyring.gpg
   ```

   **Add Caddy's official repository to APT package sources.**

   ```bash
   curl -1sLf "https://dl.cloudsmith.io/public/caddy/stable/deb/debian.repo" | sudo tee /etc/apt/sources.list.d/caddy-stable-debian.repo
   ```

   **Install Caddy fully into your system**

   ```bash
   sudo apt-get update
   sudo apt-get install caddy
   ```

2. **Setup your Caddy** folder and permissions. Caddy will need access to `/etc/caddy`.

   ```bash
   # Create the Caddy folder in /etc/
   sudo mkdir /etc/caddy/
   ```

   **Give write permissions to the folder**

   ```bash
   sudo chmod 755 /etc/caddy/
   ```

# Get Your Cloudflare API Token

Here we'll create an API token that has permission to edit / access your DNS records for your personal domain certificate.

1. Log into Cloudflare and navigate to the user icon at the top right of your homepage. Select **My Profile** → **API Tokens**.
2. Select **Create Tokens** → **Edit Zone DNS: Use Template**
3. Next you'll want to go to Zone Resources. For the middle drop-down, as opposed to "all zones" you'll want to select "Specific zone" and then in the next dropdown select the specific domain you'd like to dedicate to your Reverse Proxy private domain server. For more, see the image below.

![Cloudflare DNS Configuration](/assets/2025/01/cloudflare_dns.png)

Accessing your Cloudflare DNS API key

### Create a Caddy Environment File

1. Create a file called `caddy.env` (or `cloudflare.env`, etc.) where Caddy can read environment variables (you can keep it in `/etc/caddy`, for instance). `touch /etc/caddy/caddy.env && nano /etc/caddy/caddy.env` should do fine.

2. Paste your token from the previous step inside the file, like so:

   ```bash
   CLOUDFLARE_API_TOKEN=your_cloudflare_api_token_goes_here
   ```

3. Load this environment file when starting Caddy, or source it into your shell. The approach I took is to reload Caddy after exiting the file via `systemctl`, i.e. `sudo systemctl reload caddy`

### Configure DNS Challenge in Caddyfile

At `/etc/caddy/Caddyfile`, set up your domain(s). Let’s assume you want to expose access to your Synology home screen service at `home.mydomain.com`, forwarded to Synology’s Tailscale IP on port 5001 (or whichever service port you like).

```bash
{
    email [email protected]
    debug
}

(common) {
    header {
        # Enable HSTS
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        # Prevent clickjacking
        X-Frame-Options "DENY"
        # Help prevent XSS attacks
        X-Content-Type-Options "nosniff"
    }
}

# Handle domain access
home.mydomain.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    import common
    reverse_proxy 100.xx.xx.xx:5001 {
        transport http {
            tls_insecure_skip_verify
        }
    }
}
```

Where:

* `home.mydomain.com` is the subdomain you created in Cloudflare.
* `100.xx.xx.xx` is the **Synology’s Tailscale IP** you grabbed after installing Tailscale on the NAS.
* `:5001` is an example port—adjust to match the Synology service you want to proxy.

Caddy will automatically create and renew a **publicly trusted** certificate for `home.mydomain.com` using Cloudflare. The key advantage of the DNS challenge is that Caddy doesn’t need to listen on public ports 80 or 443—perfect if you’re behind Tailscale or otherwise hiding your server.

Finally let's reload Caddy with our new settings.

```bash
sudo systemctl reload caddy
```

or (if you prefer an alias in your `~/.bash_aliases`):

```bash
alias caddyreload='sudo systemctl reload caddy' # Then just do: caddyreload
```

That’s it for the reverse proxy. You now have a Pi that’s behind Tailscale and is also running Caddy to proxy any domain or subdomain you like to your home services—assuming your DNS points to your Pi’s Tailscale IP. The best part is, you can repeat this for as many subdomains as you like—maybe `photos.mydomain.com`, `media.mydomain.com`, etc.—all of them hidden behind Tailscale and fronted by a Pi running Caddy.

## **Configure Caddy for Each Subdomain**

If you used a wildcard record, you can define specific sites (subdomains) within Caddy:

```bash
{
    email [email protected]
    debug
}

(common) {
    header {
        Strict-Transport-Security "max-age=31536000; includeSubDomains"
        X-Frame-Options "DENY"
        X-Content-Type-Options "nosniff"
    }
}

# Example #1: home.mydomain.com -> Synology Tailscale IP:5001
home.mydomain.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    import common
    reverse_proxy 100.x.x.x:5001 {
        transport http {
            tls_insecure_skip_verify
        }
    }
}

# Example #2: files.mydomain.com -> Some other service on port 8000
files.mydomain.com {
    tls {
        dns cloudflare {env.CLOUDFLARE_API_TOKEN}
    }
    import common
    reverse_proxy 100.x.x.x:8000 {
        transport http {
            tls_insecure_skip_verify
        }
    }
}

# (Add more subdomains as needed)
```

Finally, reload Caddy:

```bash
sudo systemctl reload caddy
```

And that’s it! Now you have a wildcard DNS setup plus a fine-grained Caddy config for each subdomain. This allows you to add or remove subdomains in Caddy at will, without needing to touch Cloudflare DNS again.

One note however: you'll want to notice that with each new subdomain youn specify, you'll want to allocate a specific port for that service. That way, despite using the same underlying Synology IP, you'll be able to route to its different services.

## **Building and Serving Our LLM**

Now for the fun part: hosting a local LLM (Large Language Model) so you can query it from anywhere, while still keeping it private behind Tailscale.

### **Install and Setup Ollama**

[Ollama](https://ollama.com/) is a neat utility that makes it easy to download and run large language models on your own hardware—CPU or GPU. We’ll run it in [Container Manager](https://www.synology.com/en-global/dsm/feature/docker) on a Synology NAS in my case, but you can do the same on the Pi or any Docker-capable box.

1. Create an Ollama directory in your volume

   ```bash
   sudo mkdir /volume1/docker/
   ```

   **Give that directory permissions**

   ```bash
   sudo chmod 755 /volume1/docker/
   ```

   **Create the requisite Ollama directory**

   ```bash
   sudo mkdir /volume1/docker/caddy/
   ```

   **Give Ollama permissions**

   ```bash
   sudo chmod 755 /volume1/docker/ollama
   ```

2. **Create a Docker Compose File**\
   On your Synology, open up **Container Manager** (or the Docker UI, depending on DSM version). Create a new **Project** and paste something like:

```yaml
version: "3"

services:
  webui:
    image: ollamawebui/ollama-webui:latest
    ports:
      - "3000:8080"
    environment:
      - OLLAMA_API_BASE_URL=https://llm.mydomain.com
    volumes:
      - open-webui:/data
    depends_on:
      - ollama
    network_mode: synobridge

  ollama:
    image: ollama/ollama:latest
    container_name: ollama
    hostname: llm.mydomain.com
    environment:
      PUID: 1027
      PGID: 65536
      UMASK: 002
      TZ: 'America/Los_Angeles'
      VIRTUAL_HOST: 'llm.mydomain.com'
    volumes:
      - /volume1/docker/ollama:/root/.ollama
    ports:
      - "11434:11434"
    restart: unless-stopped
    network_mode: synobridge
volumes:
  open-webui:
```

That means:

* We’re pulling `ollama/ollama:latest`.
* Port `11434` is exposed, so you can hit the model with `http://<SynologyIP>:11434`.
* We store the models in `/volume1/docker/ollama`.

**Deploy the Container**

* Once saved, start the container. Check logs in Container Manager to confirm it’s running. If you see “Ollama is running” or can `curl http://<SynologyIP>:11434`, you’re in business.

## A Note About Synobridge

In the Docker Compose file, you'll notice we're using `network_mode: synobridge`. Synobridge is Synology's bridge network driver that allows Docker containers to communicate as if they were on your local network. This means containers using `synobridge` can:

* Access your LAN resources directly using local IP addresses
* Be accessed by other devices on your network using the container's port
* Communicate with other containers using their container names as hostnames

To use synobridge, make sure the "Use the same network as Docker Host" option is enabled in Container Manager when creating your container. You can find this under Network settings. If you prefer to use Docker's default bridge network instead, you can simply omit the `network_mode` line entirely - though you might need to set up explicit container-to-container networking if you add more services later. If you do want or need to proceed with `synobridge`, check out [this](https://drfrankenstein.co.uk/step-3-setting-up-a-docker-bridge-network/) article for setup instructions.

### **Download a Model**

Ollama hosts a library of models you can pull. For instance:

```bash
curl -X POST http://<SynologyIP>:11434/api/pull -d '{   "name": "llama3.2:1b" }'
```

Note: We’re using a small 1B param model so it fits in \~4GB RAM. Models like 7B, 13B, or 70B will require significantly more memory.

### **Access The Model**

If you want to pipe the model through your Pi’s reverse proxy:

1. **Edit Caddyfile**\
   Point `llm.yourdomain.com` to `<SynologyIP>:11434` (or whatever your Synology’s LAN IP is).

   ```bash
   llm.yourdomain.com {
   tls {
       dns cloudflare {env.CLOUDFLARE_API_TOKEN}
   }
   import common
   reverse_proxy http://100.xx.xx.xx:11434 {
       header_up Host {http.reverse_proxy.upstream.hostport}
   }
   }
   ```

2. **Reload Caddy**

   ```bash
   caddyreload
   ```

   Now hitting `https://llm.yourdomain.com/api/generate` will forward traffic to your Synology’s Ollama container on port 11434.

***

## Testing Our LLM from a Local Computer

Now that our LLM is safely tucked behind Tailscale, it’s time to actually *use* it! We’ll confirm everything works by accessing the LLM from a local computer (or laptop) that’s already on our Tailscale network.

## Quick CLI Check

First, let’s do a quick check in the terminal to ensure our output is correct:

```bash
curl -v https://llm.mydomain.com/api/version
```

Let's check our output:

![Ollama is Running](/assets/2025/01/ollama_is_running.png)

We have successfully connected to Ollama!

Here’s what’s happening:

1. We’re using our custom domain (`llm.mydomain.com`), which points to the Raspberry Pi’s Tailscale IP.
2. Caddy is listening for requests on HTTPS and forwarding them to Ollama on the Synology (or whichever box you’re using).

## Web UI

If you set up the Ollama Web UI and pointed a domain like `ui.mydomain.com` at it, open your browser:

```
https://ui.mydomain.com
```

You should see a straightforward interface listing any models you’ve downloaded. From there, you can select a model and start chatting. If you hit connection errors, double-check:

* That you’re on Tailscale and can ping your Pi.
* Caddy has a block in `/etc/caddy/Caddyfile` for `ui.mydomain.com`.
* Your Docker Compose for the WebUI maps the correct ports (`3000:8080` or however you set it up).

### 3. Testing the Chat Endpoint

If you’re a command-line fan and want to chat via `curl`, try:

```bash
curl -X POST https://llm.mydomain.com/api/chat \
  -d '{
    "model": "llama3.2:1b",
    "messages": [
      {"role": "user", "content": "Tell me a joke!"}
    ],
    "stream": false
  }'
```

With `"stream": false`, the response should arrive in one shot. If you’d rather see each token appear in real time, set `"stream": true` and watch the output scroll by.

![Ollama Query](/assets/2025/01/ollama_query.png)

In depth Ollama query via your CLI using Ollama. We get a successful response from the LLM!

### 4. Add a Handy Alias

For extra convenience, you can add a quick alias in your `~/.bashrc` (or `~/.zshrc`) to query the LLM without retyping `curl` all the time:

```bash
alias @='f(){ \
  curl -s -X POST "https://llm.mydomain.com/api/chat" \
    -d "{\"model\":\"llama3.2:1b\",\"messages\":[{\"role\":\"user\",\"content\":\"$*\"}],\"stream\":false}" \
    | jq -r .message.content; \
  unset -f f; \
}; f'
```

Then, just open a new terminal (or run `source ~/.bashrc`) and do: `@ "Knock knock"`

![Custom LLM CLI](/assets/2025/01/custom_llm_cli.png)

Response from the CLI API call to the hosted model.

Voila! Instant local LLM request from your Tailscale-protected domain.

***

### Troubleshooting

* **No Response or Timeouts**\
  Confirm you can `ping <your-pi-tailscale-ip>` or `curl <synology-tailscale-ip>:11434`. If that fails, something’s up with Tailscale or your Docker container.
* **SSL or Certificate Errors**\
  Make sure your Cloudflare DNS challenge is set up correctly. Caddy automatically renews certs, but if your domain is new, it might take a few minutes to propagate.
* **Model OOM (Out of Memory)**\
  If the model fails to load, consider picking a smaller one. Check your Synology’s actual RAM; a 7B+ model likely won’t fit on a 4GB NAS.

With this, you’ve proven your local LLM is not only up and running, but also accessible from anywhere you’re connected via Tailscale—fully encrypted, no weird firewall rules, and no random open ports to the public internet.

***

Keep an eye out for part two this series in which I demonstrate how to take your LLM to the next level and operate as your own, private knowledge system you can query with natural from anywhere in the world!
18:T205a,


![Guiding my young niece through Balboa Park](/assets/2025/01/niece_and_I_optimized.jpeg)


## My 2024 Year In Review: AI, Archery, and Goals

At the end of each year I attempt to write a “year in review”. I started this trend for a few reasons. The most prominent reason was that I am simply unable to remember all I do in a year. So much happens—even though it often doesn’t feel like it—that I eventually felt the need to write some of it down.

The second reason is that it’s simply meaningful to reflect on how one spends one’s time, and by extension how one values it. I find this practice particularly meaningful. I’m acutely aware of the finitude of my time. By reflecting on my year, I am attending to the effort I put into valuing my time and giving it its due. If you’re like me, then I suggest you engage in this practice as well.

Of the accomplishments I feel I have attained this year, I believe my professional achievements were particularly notable.

## Professional

As I’ve said, work-related accomplishments took precedent this year. However, due to IP concerns I cannot openly describe many of their specifics. At a high level, I spent this year building out AI/ML infrastructure that we are able to deploy at enterprise scale. I started this side project earlier in the year due to my conviction that it could be impactful. Eventually, what started as a side project became a proof of concept for a large enterprise customer, became a fully containerized “experimentation and monitoring platform” that handles everything from data extraction to embeddings generation and analytics for our customers.

It’s pretty cool to look back and see how a solo project based on a hunch turned into a core offering for enterprise companies—many of which you’ll have heard of—replete with custom LLM pipelines and all. What I most appreciate about this process was how much software engineering and system architecture knowledge it required of me. In the end, it took just as much effort to implement to build out the software ecosystem as it did to build the AI/ML pipelines. The result is that I find myself a much better engineer than when I started the year.

Below is a list containing some of my 2024 professional successes:

* Built an enterprise grade experiment and monitoring platform that leverages embeddings for unique client analytics
* In April, I presented to Professor Hamsa Bastani’s class on Optimization and Large Language Models (OIDD 321) at the Wharton School, University of Pennsylvania. For the [presentation](https://docs.google.com/presentation/d/1xbH6BSqoQ1PoGH9waLP3VF4mUzxElq3yU8vbTaod2PY/edit?usp=sharing), “Building a Workforce Optimization Platform From Scratch, I used mock data to decompose real-world work activities into tasks, embedded the tasks, assigned those tasks to [OCC SOC codes](https://www.bls.gov/soc/), and then demonstrated that, given these tasks, how one might go about optimizing how organizations are structured depending on their priorities. Code [here](https://github.com/EconoBen/opt_and_sim_with_llms).
* In early January of 2024, I gave a presentation, “A Normie Approach to Validating LLM Outputs”, at an LLMOps workshop gathering. The talk, really more of a deep dive into a real POC, discussed how we can implement normal software engineering practices upon LLM output to validate their results. Presentation materials [here](https://docs.google.com/presentation/d/1y1h72tVKrLhcH0dJPtL3e0yajGGJP4Q1Z6hSIvV1dDQ/edit?usp=sharing).
* I consulted a few companies this year who reached out for advice on how they can start out their AI / ML journeys, which tech stacks to use, how they can think about their development and product pipelines, and more! I love doing this kind of work and am eager to continue doing so in the future.
* I built a bunch of small software tools involving LLMs about which I will write about in the coming months.
* I have started to contribute to research in the field of economics of work and AI more directly. I hope to have this work published in the new year.

## Personal

Like every year, this year I wanted to take more risks and try new things. After thinking about it for a while, I tested a few hobbies that I had been considering for a while: the first was lifting, which I discuss more below (see \[\[#Health]]). The other was archery, for which I quickly gained an affinity and for which I quickly determined I have an aptitude! After two practice sessions at my local range, I decided I’d buy a compound bow of my own. I’m now fully ensconced in the practice. In the coming year, I hope to practice even more.

Below is a list containing some of my 2024 successes:

* Spent time visiting family and my niece in particular

* Hiking, camping, and traveling:

  * I did a bunch of traveling from within California in which I had a bunch of firsts

    * First trips to: San Fransisco, San Jose, Palm Springs, Cupertino
    * Hiked and camped Joshua Tree, Cleveland National Forest

  * Hawaii x2 — helps when there are direct flights from San Diego

  * Boston for my good friend’s wedding

  * Illinois (to visit family!)

* I engaged with and talked about poetry and literature at a level rivaled only by my college days. I loved this and I’m hoping to continue this into the new year.

* Started streaming coding and video games on Twitch on a lark

* Archery and lifting

## Where I Can Improve

* Service
  * I’d like to live a life more dedicated to service. I donate money to causes I care for; I live a life that I would argue is relatively conscious in how my actions and choices affect others. But I’d like to give my most valuable resource—time—to those who could use it. I’ll be looking for volunteer opportunities this coming year.
* Patience
  * I think I can overvalue my time, which causes me to lose perspective and not be in the moment. I want to be more patient with those I love, if not with myself.
* Socializing
  * I’d like to dedicate more time to friends and family this year. Simple as that.
* Study and reading habits
  * This year it was hard to keep with my study habits. I’d like to develop and maintain a better relationship with studying instead of simply building. I think this first starts with curiosity, and I find my curiosity is best fueled by reading often and widely. This coming year, I hope to give myself room to explore my curiosity more.

## Goals for 2025

* Write one post a month, no matter how small
* Attend more economics conferences
* Contribute more (and publish) economics research, especially as relating to AI/ML and the economics of work
* Practice archery twice a month
* More twitch streams, especially with regard to coding and machine learning
* I live 45 minutes from the Mexico border. I’d like to visit Mexico in 2025!
* Making more friends in the area
* Camp more in National Parks!
* Complete 2 educational courses this year
* Hopefully I’m able to get back to lifting and endurance running!

***

A note on health.

## Health

Upon reflection I find that I didn’t “accomplish” as much as I’d have liked in the latter half of the year. This year was tough in many ways. This particular lapse in productivity is due to health issues I developed in August. It turns out, in the process of “valuing my time” by picking up a new hobby—namely lifting—I exacerbated an underlying health condition I wasn’t aware I had. Since these health issues emerged, I quickly realized that sometimes valuing one’s time means treading water and fighting to retain equilibrium. If this past 4-5 months have taught me anything, it’s how impactful health-concerns can be on my sense of homeostasis.

Thankfully, after a few months of trying to figure out what even was causing my symptoms, my doctors and I were finally able to devise a process that will, I dearly hope, cure my symptoms. I’m currently undergoing that process now. And even though it comes with some difficult (and hopefully temporary) tradeoffs, I can already tell I’m improving. Should I overcome these health issues in 2025 and return to a sense of normalcy, that will far and away be my best achievement.

Happy New Year all! May 2025 bring us peace and growth.
19:T1428,

## What Did I Do This Year?

2023 was a year that I won’t forget—one full of opportunity and promise. As I sit here reflecting on it, I notice that I’m writing in the office of a new apartment while visiting family bustles about in the background. Later tonight I’ll be playing video games online with friends, while tomorrow I’ll be headed to camp in a national park (I’m not sure which—it’s a surprise organized by my wonderful partner). Security, family, friends, nature—all in the course of two sentences and twenty-four hours. How many blessings can one person have? Despite all the effort and intentionality I put into my life, I know that I am lucky for what I have.

As another year winds down, I want to take this opportunity once again to reflect on the year I’ve had—who I’ve shared it with, what I feel I’ve accomplished, and what I hope to strive for in 2024—its through line being gratitude.

## Personal Accomplishments (Unordered)

💰 Last year (2022), I paid off my private student loans. This year (2023), I paid off my remaining public student loan debt. In total, I paid off $194k of student loan debt in the span of six years. I wrote about this saga, my goal of paying them off before I turn 30, what it meant to me, and how I accomplished my goal [here](https://benjaminlabaschin.com/194k-in-loans-in-six-years/).

👨‍🏫 I taught Intro to Machine Learning for Business at Chapman University’s Argyros College of Business and Economics to \~35 students this Fall semester. It was both grueling—including driving 90 miles there and back twice a week—but also fulfilling. I loved the students and believe I made a difference. For access to the course content, see my [GitHub repo](https://github.com/EconoBen/MGSC_310).

![Teaching at Chapman](/assets/2023/12/chapman-scaled.jpg)

Teaching at Chapman

📇 I wrote about Large Language Models and AI Agents for O’Reilly! This was a dream come true and as you’ll see below, I only hope to write more. For more about my report on large language models and AI Agents, see [this post](https://benjaminlabaschin.com/what-are-ai-agents/).

🐥 I’m an uncle! I am very grateful that my niece, Shoshana was born. I’ve visited her now twice since October, and I intend to do so more in the coming year. 

![Shoshana and Me](/assets/2023/12/D2420EE3-9737-4667-AE43-3F1AE6183F43.jpeg)

Shoshana and Me

✍️ I wrote more posts (5) than I ever have! I hope to write more in the coming year. 

🎂 I turned 30! You may not think it’s an accomplishment—but I think it is. And so it makes my list. 

![Turning 30](/assets/2023/12/50816F92-A0CE-46E8-AE75-63A90FBF74AF_1_105_c.jpeg)

Turning 30

🗺️ I had a big European travel year! I visited: Slovenia, Croatia, Italy, and Austria in August. I also visited Canada for work, as well as a few cities I’ve never been to before: Boston and San Fransisco.

![Ljubljana, Slovenia (August)](/assets/2023/12/5FE0EE9F-9806-4513-972F-5FCEA8F82B6B_1_105_c.jpeg)

Ljubljana, Slovenia (August)

📚 I attended another college course at USCD this year. I have enjoyed this tradition of continuing my education despite having a full-time career. I credit my mother for instilling this drive in me.

🧬 For some people, work is a means to an end—for me it is the thing itself. I generally enjoy the process and, as I approach my second year working as Principal MLE @ Workhelix, I am still just as grateful for the time I’ve had, the team I work with, and what we are building.

![Ice cream in Toronto—a must.](/assets/2023/12/11944B3A-BE52-4820-BE89-D780ADC6464E_1_105_c.jpeg)

Ice cream in Toronto—a must.

📣 I gave a few talks this year on Large Language Models. I’ll be sure to post them in the New Year!

🐶 We successfully fostered a dog and found him a loving home! He was very cute (and energetic…)

![Toast, being cute.](/assets/2023/12/82896869-8FFA-4810-BCDF-071FA3CC0949_1_105_c.jpeg)

Toast, being cute.

🤝 I’ve also had the pleasure to assist and advise work on projects involving Large Language Models! This has been great and I look forward to discussing all my learnings soon.

## What do I want to accomplish next year?

📖 While I’ve had a good education, for most of my life I’ve avoided formally reading philosophy. I’d like to change that this year. I have some plans. Hopefully I can manifest them.

🔧 More personal projects! I’d like to build more at home and flex this creativity muscle. I may start with home networking and expand from there.

🌏 I have tentative plans to travel to Asia for the first time. I’ll do my best to make this a reality.

📔 Another class! I would like to continue my streak and attend another class (probably in math or something technical) at the local university.

🐥 I’m definitely going to see my niece more this year.

📝 I definitely want to write more, ideally for O’Reilly again since I enjoyed working with them so much. My focus will likely be on Large Language Models. But I’m also hopeful for a formal paper… more in the New Year.

We’ll see what 2024 brings. Happy New Year!

1a:T99d,
![What Are AI Agents?](/posts/oreilly_what_are_ai_agents.png)

As some of you may already know, over the summer I wrote a book/report for [O'Reilly Media](https://www.oreilly.com/) on AI agents and large language models. I am now pleased to announce that as of this month (November 2023) it has been published—you can find it [here](https://www.oreilly.com/library/view/what-are-ai/9781098159726/)! As the book's title suggests, _What Are AI Agents? When and How to Use LLM Agents_ is about when and how to use AI agents.

_What Are AI Agents?_ (or _WAAA?_ as I affectionaly call it) is an introductory report for those who have not worked with AI Agents before. For some of us, it may be hard to recall a world without GenAI, but that world is only actually about a year old. [Stable Diffusion](https://github.com/CompVis/stable-diffusion), one of the first high-quality text-to-image open-source, was only released in August 2022. ChatGPT was a fast-follow, released in November of that same year. In the year since, we saw the software industry change from approaching these tools as revolutionary but flawed, to a staple of the development process.

Still, most people haven't used AI agents, and far fewer still actually _know_ what an AI agent is, let alone a large language model. That's what this report is about—introducing the uninitiated to what AI agents are and where they can be useful. _WAAA?_ is not meant to be technically comprehensive. Instead, its purpose is to break down concepts in a high-level, approachable manner, focusing on ways people are using AI agents: whether it be as document retrieval mechanisms or coding assistents. It also addresses critical questions such as what AI are and how they are different than the large language models that power them.

By the end of the report, I hope I'll have convinced readers why AI agents are likely here to stay, and not some fad like other tech crazes of the past. Readers are also encouraged to look ahead and anticipate some problems to come with AI agents, including problems of bias, law, and economics.

If this sounds like a book/report you could benefit from, then I encourage you to read it! It's short enough to digest in an afternoon! You can find _What are AI Agents? When and How to Use LLM Agents_ [here](https://www.oreilly.com/library/view/what-are-ai/9781098159726/) and the Github repo associated the report [here](https://github.com/EconoBen/what_are_ai_agents).
1b:T882,
In a bit of surreal news, I'm happy to announce that with the imminent publishing of "What Are AI Agents? When and How to Use LLM Agents" I will officially be an O'Reilly author. To say it is meaningful to me to write for O'Reilly doesn't quite capture it. Without O'Reilly authors or the editors who gave those authors a chance, I wouldn't have the career I do today.

After college, the only job could manage to get was one pulling weeds. Every day after work, I would return to my parent's house sweaty, covered in dirt and ticks, and I'd spend my time doing one of two things: applying to jobs or reading O'Reilly books. I believed then what I believe now: that education is a key to prosperity.

Like so many others, my first O'Reilly book was R for Data Science by Hadley Wickham and Garrett Grolemund. To this day, I believe it to be one of the best introductions to data analytics. At the time I couldn't afford to buy these vaunted animal books, but this was no matter. My local library had many O'Reilly books to loan. I remember borrowing my mom's car every week to go to the library after work. Often I'd simply walk the aisles of computer science books, scanning their spines for that signature red-and-white, adding ever-more titles to my internal to-read list. The time I spent reading those books were some of the most valuable investments I've made in my career.

So yes, it's utterly meaningful to me that in my own small way, I too would contribute to the O'Reilly collection. I think of "What Are AI Agents?" less as a book and more as a pamphlet for those individuals like me who were first getting into machine learning and data science all those years ago—it's also a great fit for anyone who simply wants to understand at a high level what AI Agents are! I'll be sure to write more about the contents of "What Are AI Agents?" when it comes out, but for now I will simply say this: I'm so grateful to have been able to write for O'Reilly. If I can play even a small role in a reader's career development like others did for me, I will be deeply grateful.

"What Are AI Agents" should be out within the month! I'll be sure to post again with an update.
1c:Tb4df,


<div style="text-align: center;">
    <figure>
        <img src="/assets/2023/07/512px-Song_of_the_Lark_-_Jules_Breton.png" style="display: block; margin: auto; width: 512px; height: auto;">
        <figcaption>The Song of the Lark, Jules Adolphe Breton (1884)</figcaption>
    </figure>
</div>


<div id="table-of-contents" style="padding: 20px; width: 100%; margin: 20px auto;">

<h2 style="text-align: center;">Table of Contents</h2>

<ol>
 <li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#disbelief">Disbelief</a><br/>
        <span style="font-size: 0.9em; color: grey;"> In which I accomplish a long sought after financial goal and determine the need to reflect on how it came to be. </span>
    </p>
  </li>
  <li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#adventures-in-aliens-and-castration">Adventures in Aliens and Castration</a>
        <span style="font-size: 0.9em; color: grey;">In which I discuss a ruined scheme to bypass a formal education.</span>
    </p>
</li>
 <li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#deer-dear-friends">"Deer", Dear Friends</a><br/>
        <span style="font-size: 0.9em; color: grey;"> In which I discuss the forces that led to my future financial burdens.</span>
    </p>
</li>
 <li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#the-price-of-learning-to-learn">The Price of Learning To Learn</a><br/>
        <span style="font-size: 0.9em; color: grey;">In which I face the cost of years of eschewing education.</span>
    </p>
</li>
 <li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#a-mad-scramble-against-financial-reality">A Mad Scramble Against Madness and Financial Reality</a><br/>
        <span style="font-size: 0.9em; color: grey;"> In which I struggle to navigate a tumultuous job market while loan repayments loom.</span>
    </p>
</li>
 <li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#my-chance">My Chance</a><br/>
        <span style="font-size: 0.9em; color: grey;"> In which I am given the chance to overcome past decisions. </span>
    </p>
</li>
 <li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#oblique-machine-dreams"> Oblique Machine Dreams </a><br/>
        <span style="font-size: 0.9em; color: grey;"> In which I decide the best way to become an economist is to do everything I can to become a machine learning engineer? </span>
    </p>
</li>
<li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#Sticking-To-It"> Sticking To It </a><br/>
        <span style="font-size: 0.9em; color: grey;"> In which I save a lot, and then dump most of it into my loans... </span>
    </p>
</li>
<li style="margin-bottom: -10px;">
    <p style="line-height: 2; margin-top: 0;">
        <a href="#Pay-Off"> Pay Off </a><br/>
        <span style="font-size: 0.9em; color: grey;">  In which I achieve my goal and think about what's next. </span>
    </p>
</li>
</ol>
</div>



## Disbelief

When I was 23 years old, I graduated college with approximately $150 thousand dollars in student debt. That year, as I faced what felt like my life falling down a financial cliff that I hadn't even realized I'd summited, I made myself a promise: I would pay all of my debt off before I was 30. I wasn't sure how serious the promise was, but it felt real. The joke was on the bank anyway—that was forever away.

Apparently not. I turn 30 in two months...

With all that money being owed, you'd think I wouldn't meet my goal. And yet, as of Sunday, July 16th the most unexpected thing happened: I did it? I actually paid off all of that debt and more. For the first time in six years, I am debt free.

While wonderful and financially freeing, that hasn't been the part that gets me. See, I've run the numbers in several different ways, and every time the same number comes up: $194,537.70. That's how much I actually ended up paying for a four year undergraduate degree. What happened to the $150k I mentioned earlier? Well, the best and worst part of finance happened (depending on which side of the deal you're on). When I took out my loans, it was 2012. The world was still coming down from the financial crisis, and rates for a private student loan were... high. 8% and above high. At the time, due to circumstances that I get into later in this post, I didn't feel I had much of a choice. And the result of that thinking is the number you see above. $194k dollars paid back in six years.

You may judge the amount I paid for my education (and rightfully so!), but I'm not the only one who dealt themselves a bad hand as a kid, and took burdensome loans in an attempt to get escape to a better life.

According to the Federal Reserve Bank of New York, [as of Q1 2023 Americans owe a combined $1.6 trillion dollars in student debt](https://www.newyorkfed.org/medialibrary/interactives/householdcredit/data/pdf/HHDC_2023Q1). And while delinquency rates have plummeted in the last few years due to a pause in student loan payments and interest rates (at least among public loans), don't expect that to last for long. Compared to their predcessors, 18-29 year olds hold the most student debt of any previous generation (see chart below). While many would prefer to ignore the plight of student loan debt upon this generation—answering the problem with whataboutism comparisons to mortgage debt and cold "they made their choice" sentiments—the consequence of ignoring balooning debt is a potential future economic crisis. After all, my student loan story is by no means indicative of the rest of the population of debt holders. But it is my story and one I'd like to tell.

![Student Debt by Generation](/assets/2023/07/Screenshot-2023-07-24-at-16.38.32.png)

So about the shit load of money I paid back...

I think of myself as a pretty astute follower of my own finances and even I didn't realize how much I'd sunk into those loans. The amount I paid off, uncomfortably close to 200k dollars, still daunts me (as if somehow $160k were any better?). It's bothered me so much that I've decided to write about my journey—how I came to even sign onto these loans, the psychological and emotional weight they held over me, and my almost monomancial mission to study and work my way into a position to pay them off by 30...obliquely.

Admittedly, this post may not be the tried-and-true way of engaing with one's audience. Instead of writing a how-to post about "how you too can pay off your loans!", I much prefer to write a "how-did" post—as in "how did I even get here." For me, this is in large part a journey throughout the choices I made that got me here. It will be a lengthy post. For those of you who choose to continue to read, I hope you'll gain some insights too.

Before I start though, I want to get ahead of the cynics out there. You know those feel-good stories about the person who pays off all this debt, only you're then to find out that they inherited a trust, or that their parents came in to help them out, or some other such convenience? I just want to get ahead of that: this will not be one of those stories. This all was truly paid off by me... by somehow scrambling to turn my life around.

## Adventures in Aliens and Castration

I graduated my alma mater with a double major in economics, environmental studies, and around $150k in public and private student loan debt (that would soon balloon thanks to the magic of interest rates). I didn't actually want to go to college when I graduated high school. Despite being president of my high school senior class, I was a terrible student—deeply curious, but probably to the point of being depressed and therefore unmotivated. For a reason I was begged by every significant adult in my life to arcitulate, but that I could not, I simply wouldn't (couldn't?) do school work. No one could make me, despite many wonderful people's best efforts. On the contrary, I knew I was "ruining" my future with my inaction, but that was part of the point: I was cutting my nose to spite my face. If I punched myself hard enough (metaphorically) maybe things would change and my life would get better. Still, I couldn't truly understand how many doors would shut on me because of it. That would come later.

Upon graduation, as my friends were going everywhere from state schools to artsy liberal arts schools to lauded Ivy Leagues, I was the only person I knew who simply didn't have a plan. Among a graduating class of over a thousand people, most of whom I knew (I was very social), I was thinking about maybe farming for a while? Honestly, I took a bit of pleasure out of it. The school I went to, although public, was in a Chicago suburb and known for being one of the best in the state. In my mind I thought about how it reflected badly on the school. "That'll show 'em!" or some such other nonsense. In hindesight colored by life experience, it's easy to see how arrogant and emotionlly immature I was. To think anyone thought about me at all, beyond the caring teachers who got me over the finish line of high school graduation, was a categorical mistake. Plenty of students do not succeed in high school. It's par for the course.

As I said, as graduation approached and friends were talking about the colleges they were going to, I thought about farming. I had built up farming in my mind for quite some time. It was practical. Without it and the energy food provided, humans could not survive. It made all the existnential sense in the world to me. Even though I had no relationship to farming growing up (maybe that's evident from my content so far), it called to me. From some connections, I learned of the concept of WWOOFing—World Wide Opportunities in Organic Farming. The way I describe it is it's the Craglist of farming. Farmers post about what work needs to be done and, in exchange for doing that work, agree to host these laborers for a season or so. I looked for what was probably 20 minutes, found a post, called the gentleman who ran the "farm" (more on that soon) and convinced myself this was the move to make.

I settled for a farming position in Hawaii. I'd never been, and indeed had not really thought about Hawaii much before. But it was the furthest place in the US I could go to that was feasible enough to convince my parents of, and that I could afford with my savings. I bought myself a ticket (around $600 in 2012 dollars) and was off by late summer.

The farm saga was a fiasco, as you might imagine. Here I'll just state the cliff-notes.

In late August,/early September I arrived on the Island and was picked up by my host's associate who I'd never heard of before. Good start. Always get into cars with your host's "associate".

The associate took me to a get a "drink" at a seaside bar, only to learn I was 18. I got mango juice. We got to talking a while. As the conversation progressed I slowly averted my gaze to the water, trying not to look at my new associate as she regaled me about her numerous abductions by aliens. Indeed, it was a regular occurence and she could (and did!) tell me all about the interior of the UFOs. Obviously I was not comfortable, but played it off by asking such light follow-up questions as "what did the aliens look like" and "oh, I see.  And what did they do to you *then*?"

After what felt like forever, the conversation subsided and she drove us to my host's house up on the side of a mountain, next to a large rainforest. But alas, what was this? There was no farm to be seen! Ah, it turned out that my host had never farmed before, and that *I* was to make the farm, among other activities. Okay, fair enough. It wasn't the plan, but I wanted to be pushed physically, to pay for the mistakes of my past and to earn my place in the world. This could work, maybe...

By nightfall, I inquired as to where my room was. Duped again! Despite what I had been told, there was not actually a room for me. Instead I was provided a massage table to sleep on while my *tent*, which apparently I was to live in, was prepared... A tent could be nice? So long as you could get past all the mosquitos and the rain that periodically falls in rainforest climates...

As I settled in to my massage table that night, ready to sleep, my host came up to me and asked for my help. It would seem his three large black dogs had gotten out "again". And wouldn't you know it, they escaped into the rainforest! You know, the one with poisonous catepillars and snakes. Don't worry, I was provided a flashlight. Thus began my attempt to navigate the rainforest to find his dogs. Eventually they returned on their own—though it would have been nice if *I* had known that earlier as I continued to search...

Eventually I returned to back to my trusty massage table to sleep, uncomfortable, afraid of what I had gotten myself into, trying not to give in. But I couldn't take it. The next morning I called my sister, Nikki. I told her I was deeply uncomfortable, that I made a mistake, and that I didn't want to give up but I think maybe I should come home... I was so mad at myself, I hated being a person who gave up but this place was seriously off. After some...vigorous debate with my parents, with some strong-arming from my ever-faithful sister, it was determined I was to come home.

The next morning, I broke the news to my would-be host. To which he not so subtly responded, among other things, that a worse person would "castrate you". Thank goodness *he* wouldn't do that...right? We eventually agreed that he would drop me at the airport if I paid for gas (and that I would arrive intact? It was never made clear.)

## "Deer", Dear Friends

After a string of connecting flights, I made it back home. My one and only plan a total failure. The next few months were a blur of self-flagalation and isolation. I barely showed my face to my family, and certainly not my friends. I didn't know what I was going to do with my life. The feeling of failure permeating my thoughts.

I wrestled with a bunch of potential next steps including shoe cobbling, guitar making, and of course the military. Unbeknownst to my parents, I visited the marine recruiter and navy recruiter multiple times. Let me tell you this: there are few better salespeople for the lost than the military (and probably the priesthood but I digress...). Ultimately, I didn't sign up. I was certainly interested. It would have been a release of pressure—a means with which to structure my life. But as with many choices in my life, it came down to not wanting to put my mother through more stress than I already had.

So, none of those options worked out. During some of my free time, besides escaping my reality by watching Doctor Who, I would simply walk. I didn't have a direction or a purpose. I just needed to get out of my room, and therefore my head. There was a forest by my house, just west of us down the road. Eventually my walks would take me there. It was tick-ridden. There were few well-trodden paths. But it was the closest "escape" I felt I had access to. As I began to map out the forest on my walks, I eventually came across a small, graffiti-ridden bridge with train tracks running over it. It appeared many youths such as myself used the small bridge to get away from it all (or to smoke and drink...). The bridge became a frequent stop on my walks. I would walk to the bridge, sit on the edge, avoid the train, and stare at the water of the North Branch of the Chicago River as it trickled by.

> The West of which I speak is but another name for the Wild; and what I have been preparing to say is, that in Wildness is the preservation of the World.
>
> Walking, Henry David Thoreau

Time slowly passed, like that trickle of water, and I felt life and friends were moving on without me. Except one friend. Her name was Alex. We went to high school together. During home room every morning, I would ask my advisor to go to the bathroom, and simply walk the halls finding different home rooms to join. He knew I wasn't coming back. *I* knew I wasn't coming back. He would *ask* me if I was coming back, and I would *say* I was coming back. But I would not come back...

Always it was a girl's home room (home rooms were gendered). Sometimes it was a random room, other times it was the chorus teacher's home room because she knew and loved my older sister. But often it was Alex's. Many of my friends were there including my childhood best friend, my soon-to-be girlfriend, and Alex who would become one of my dearest friends.

Alex was a nerd like me, and despite being downstate at UIUC studying engineering, she would text me to talk. Often I would pepper her with questions about the Doctor Who universe or [vlogbrothers](https://www.youtube.com/@vlogbrothers), asking for her theories or why certain things occured. But beyond simple chatter, she would also encourage me to go to college. Lightly, politely, in a way wholly unique to her, she would simply tell me it was a good idea with a level of stoicism and certainty that I had nowhere else in my life. It was an attractive prospect. I didn't know what she saw in me, or how she could know college was a good idea. But the idea of having structure like college could provide me was as appealing as an oasis in the desert. I just couldn't understand *why* she said this. She knew how bad of a student I was only a few months ago. And yet, she encouraged it. I didn't say yes right way, but I did say I'd think about it.

This continued for weeks. I would walk around, look into different opportunities, walk around, text Alex about some some show or YouTube video we were into.

One day, I was walking the forest west of my house. It was late fall. I remember the orange and red maple leaves that matted the forest floor. As I made it to the bridge hidden in the forest, leaves crunching under my feet, I suddenly decided I would cross it and descend onto the other side of the river tributary. I hadn't done this before, but that day felt different. As I walked new, unfamiliar paths, in no direction in particular, I looked up. In the distance was a deer. The deer was standing just on the other side of a brief bend in the path—a few scattered trees and bushes between us. It was staring at me, as deer are wont to do. I stared back, thinking it would eventually move. For a while we stood like this, silent in the forest. But it didn't move. So, slowly, I began to walk toward the deer. Still it did not move.

> Then he was aware of the wilderness itself, not as the background frame of earth and foilage in which he lived, but as a sentient, constant being…
>
> Go Down Moses (The Bear), William Faulkner

As I got to the bend in the path that I'd seen from a distance, I came to a standstill—just a few trees and foliage between the deer and myself, the deer standing whisper still. We stood as we had been, staring. I decided I would follow the path briefly around the bend, past the boughs of trees, and see if I could walk up to it on the other side. As I walked around this brief little bend, the deer's anticipated position returned to my line of sight. But what I saw was...nothing. The deer was gone. The bend wasn't significant at all, I thought I would have heard it run away. But it was simply gone.

Slightly confused, I walked up to where the deer had been and stood there, thinking. After a few moments, I heard a creaking sound. I looked around but couldn't pinpoint where it was coming from. The creaking sound started to get louder, and louder, until it was very significant. I swivled around desperately trying to identify what was happening until a loud crash! Right where I had stood staring at the deer, on the other side of the brief little bend, a tree had crashed to the forest floor. Like, a legitimate tree! In that exact spot. There was no wind, no movement of any kind that I could detect.

I'm not sure how anyone else would react, but to me it was very amusing. Laughing to myself, I looked around as if to say "did you see that" to the nobody that was around me, when I saw a deer, *the* deer, far down the path, across the river tributary, staring at me once more. I looked back at the fallen tree, and then looked back to the deer as it began to walk away.

Did that deer try to kill me? Was it trying to tell me something? I don't think think so. It was very probably just a coincidence. What I *do* know is that I also had had enough. As the deer started to walk away, I said aloud, flatly to the universe: "fine, I'll go to college."

## The Price of Learning To Learn

College was four years of my life and a rich enough experience to take up many pages of writing. But I'll try to keep it short. What's important to say is this: before college I had not truly learned to learn. Thus far I have characterized high school as anomolous in my education career. But the truth is, I had always had an adversarial relationship with education. I remember in fourth grade I told my teacher that I wasn't going to do the work any more because I wasn't happy. In the years before and after, I would often act out in class, or else completely withdraw. One time I came to school dressed up in "goth" makeup. I was told to take it off almost immediately (I threatened to sue...it did not work).

<div style="text-align: center;">
    <figure>
        <img src="/assets/2023/07/Pre-wedding-2007-002-300x225.jpg" alt="" width="300" height="225" class="size-medium wp-image-1063" />
        <figcaption>Dressing Up for School, 2006</figcaption>
    </figure>
</div>

This pattern of withdrawing from my education had followed me on and off throughout the rest of my middle school and junior high experience. Sometimes I would delve deeply in my education—investing into it all that I hoped it could do for me, hoping to escape. If these periods lasted long enough, I'd be fed into the advanced placement courses to talk Freud or math, or some such thing. But it never lasted. I would simply withdraw again.

Because of this pattern, which continued into high school, by the time I started college, the truth is that I had never really had learnt how to learn. College changed that in myriad ways.

I started college in the winter of 2013. That fall I had decided to attend a small liberal arts college. That may seem like an insane (and expensive) idea, but unlike my WWOOFing experience, there was real thought put behind it. First, despite sometimes acting out or not doing the work, I had always bonded with my teachers, probably because my mother was one. By being able to foster relationships with my professors, the hope would be that this would sustain my academic motivation (this is exactly what happened). Second, I did well in smaller, more intimate communities and figured this would sustain me college (this also turned out to be true). Finally, Lake Forest College, the college I ended up attending, was willing to admit me the very next semester, and I *had* to get out of the house.

The price of this deal was, as we now know, high. Below is the semester by semester breakdown of my loans (public and private) from 2013-2016.

![Semester by Semester Breakdown](/assets/2023/07/semesters.png)

Because I didn't come from money and because school was so expensive, public loans wouldn't be enough and I had to from a large, private loan provider. I won't name it directly, let's just say it that rhymes with Discover...

Breaking things down, my public loans came to a seemingly hefty $27,000 dollars. Of course, then you look at my private loans and you realize that wasn't anything. Altogether my private loans came to $122,001.20. Together that's a total of $149,001.20 taken out over four years (without interest).

So, briefly, what did this get me?

I left college in Dec of 2016 a different person than I started. When I started college I was neither driven nor properly educated. Thankfully, blessedly, I met professors (too many to name) that not only inspired me with their knowledge, but gave me the time and energy enough to help me lift myself out of the hole I dug for myself. When I left college, my intellectual motivation was self-sustainaing for the first time in my life. It was the most free I had, or have, ever felt.

This was reflected on paper too. During college I travelled to Southern Africa to study economics and human trafficking. I even got to "farm" of sorts, as I became deeply involved to prairie and ravine restoration projects on and off campus. I graduated Lake Forest College in 2016 with multiple scholarships and distinshuishments to my name including graduating *cum laude* and earning honors and awards for my senior thesis. It was was reflected internally as well. I had entered college not knowing what I wanted to do. By the end of my first year, I knew with every shroud of my being that I wanted to become an economist, and did everything I could over the rest of my undergraduate career to work to make it happen.

Then, one day, like a record scratching, the party was over,  and I was back home where I started.

## A Mad Scramble Against Madness and Financial Reality

After graduation, I was scared. Suddenly I was back home in my same childhood room, the same place I had spent so many years in unproductive isolation. All the work I had done over the last four years to become a better, different person—to actually *do* instead of just think—would it come crashing down? Did college really not change my life like I'd hoped it had?

The truth, as ever, was complicated. What I couldn't know as I put my bags down, staring into my old room in despair, was that over the next eight months I would engage in a mad scramble against the financial reality that the last four years of loans had wrought me.

As soon as I got home, I told myself that I had to act. I needed to apply all of my self-sustaining motivation that I had learned in college, that I had saved up my whole life, into applying for jobs. I was going to dig myself out my situation using pure grit and determination.

I spent next 4 months trying to get a job. Every day was the same pattern: I would wake up at 6 am, go on a run, come back, and spend the next 8 hours searching for jobs. It was the same process over and over again. First I found a job on some website, then I would write a cover letter, then apply. Rinse and repeat. During these months, I barely left my room, talked to my family, or contacted my friends. In part it was because I was embarrased about not having a job. In part it was because I told myself the only time worth spending was time working toward my goal of independence—to get back to the life I left at school.

I suspect I sent hundreds of applications, with less than a 1% hit rate for callbacks. Not even Starbucks would call me back. I remember mustering up the courage to walk into my neighborhood store one day. I asked for the manager and told her that I would like to apply in person to demonstrate that I'm ready to show up to work hard. Her response was to go back and apply online like everyone else. Like most of my applications, I didn't get a follow-up call.

I tried not to be deterred, but it was hard. Even now I feel that familiar lump in my throat, that creeping pressure to get out from under the rock of my own making and the knowledge mourning of a lost academic community in which I felt I belonged. I didn't give up though. I told myself that almost any obstacle can be overcome with determination. But the ticking clock of all that debt was looming over me like Damocles' Sword. I had to start earning money.

One day, out of desperation, I reached out to the career center of my alma mater and set up a meeting—maybe they could help me? When I met with a career counselor, this is what he told me: almost every job he ever got was through knowing people—that he hadn't applied to a job in decades. I didn't know what I felt more fiercely, frustration at what I'd just been told in the face of months of trying, annoyance at the college for not helping me more after all the money I'd spent, or desperation about my situation.

For obvious reasons, it was frustrating to hear. But despite being a bitter pill to swallow, I forced myself to take *something* from what he said: networking was critical. Maybe I could get a job that way? I tried, I really did. I reached out to people I thought could be good to speak with, but the perverse reality of networking is that if you have a good network, you're probably not in the position of being desperate for a job in the first place. Well, I was in that position. I had a handful of "coffee" sessions with various connections. But they all led to nowhere.

It was starting to get close to when my repayments would begin. I wasn't clear on how much I would need to pay every month, but I knew it would be significant.

Eventually, my mental state began to crack. Months of self-imposed isolation, nonstop work, and stress had caught up with me. College was so intellectually thrilling, so freeing, and I was good at it! There I could engage at a pace that suited me, while surrounding myself with interesting people and professors. There I had become the person I'd always wanted to be. Yet so many companies, organizations, and schools which I admired ignored my applications or worse, saw the college on my resume and laughed at me. Yes, this really happened in the case of a particularly entitled Northwestern professor I had attempted to network with.

The resentment began to build.

It was finally hitting me, the force of the doors I had pre-emptively shut on myself as a kid were finally starting to impact me, as if the delayed shock wave of a particularly distant and powerful bomb.

I was out of breath emotionally and I couldn't tread water any longer. I remember calling my sister one day, crying. I didn't even know what to say. It was all too much. I ended up just saying "I'm sad." I knew it was an understatement, but I was just too emotionally exhuasted. It had been months of applying 8 hours a day in self-imposed isolation. I just needed help. I just wanted to prove myself. Nikki supported me, as she always has. But I didn't make it easy on her. She had supported me before college and now she was left supporting me emotionally after college too.

Obviously, in hindsight I understand the situation a bit more clearly. The fact is, joblessness enduced mental-health issues are a special kind of hell. We are such a job-defined society, to not have a job—even a (wrongly) low-regarded service job—can force one to consider themselves less-than. And if you have people who depend on you, I can't even imagine how desperate that would make a person. But it's also more fundamental than that. It's about a sense of competance, and meaning, and *wanting*  and *trying* to work but not be deemed suitable enough to do so. It's why I especially feel for the job-seekers who have been on the market for some time. That process takes a toll on you in ways hard to describe.

But to me it was also about how easily the echoes of our past mistakes as young adults reverberate with us, even when we do everything we can to overcome them, to make up for them. Many children and young adults *have* to be able to make mistakes, to stumble and learn and grow. Unfortunately, the consequence of those of us who make those mistakes (such as having mental health problems during the critical time of one's education) can be shutting the door on potential future opportunities and feeling forced to take out crippling loans. But it can also be more severe than than the choices I made: it can be drugs, crime, jail, or worse. Of my experience during this time, one of my fiercest wishes was for a world in which the mistakes we make as young adults are are not made to follow us throughout our lives. The best way to achieve this, I think, is simply to afford the young adults a chance. Just give them a chance, and see if they take it. Some wont'! But many will.

## My Chance

One day, four months into my monomania, I was granted a blessed respite and received a rare follow-up email for an application I had sent. It was from the Chicago Botanic Gardens. I had applied for a "Restoration Ecologist" job in their prairies. As I mentioned, in college, I had spent much of my time building prairies on and around campus. It was some the most fulfilling, hardest work I've done in my life. There I was finally able to push myself physically, to improve the world while also making up for the mistakes I had made.

I ended up getting the job. It paid something like 12 dollars an hour. In reality, it was mostly pulling weeds all day. But at least it was a job, I thought. With a few weeks until my loan repayments would begin, I figured I'd build a buffer of money before my payments started. Daily I'd walk the prairies and dutifully pull weeds, spray Glyphosate (a carcinogenic weed killer), and identify and tag troublesome plants for future mitigation efforts, the words of the environmentalists Aldo Leopold and Emily Dickinson running through my head, lightly filling the space in my mind where meaning was needed to push me forward. With their words and with the knowledge I was being paid, I could withstand the ticks, the sun, and the labor. So I thought.

When my loan repayments began, a few weeks later, I was in for a shock. My private loan payments came to $1106.42 per month, my public loans $387.02. Altogether, I would owe $1493.22 per month. I did the calculations in my mind. At a 40 hour work week, I'd earn around $1902 per month before taxes. Subtract my loan payments, and I'd take home around $425 per month before taxes. On the one hand, great at least I'd be able to pay off my loans. On the other, I'd never be able to leave the garden, let alone my parent's house, at this rate. It soon became clear to me that the only way I was going to get out of this mess was to get a better paying job. I wasn't done with the job application process.

![](https://benjaminlabaschin.com/wp-content/uploads/2023/07/garden_pay-2.png)

My schedule only shifted slightly with my new job. Every day I'd wake up, write a few applications to better paying jobs, go to work, pull weeds, come back, eat dinner, apply more and sleep. This continued for 4 more months. In the meantime, I dutifully went to work. Luckily, I had a colleague who ended up becoming a close friend. Her name was Jess and she was a very patient indivudal. When you're pulling weeds in the sun, you mostly have audiobooks or each other to talk to. Often I would talk to Jess about my favorite passtime: economics. I know it sounds annoying, but these were (are) my genuine interests and Jess didn't seem to be against these conversations. I would talk to her about different aspects of economics I was interested in, different theories, how they applied to the books I was listening to or to world events, all while we pulled weeds. Jess was a great listener. I tried to be the same for her.

This process continued week after week. Jess would talk to be about her interests (biology) and I would talk about mine. Until one day, Jess told me that I needed to stop restoration. It was clear that I should be working in economics and not restoration ecology. I told her I had been trying, but she told me that wasn't enough. I needed to take a risk and devote myself to it. I thought about it and agreed.

I talked to my parents and they suppoted me. I resigned from my position, despite the risk of running out of funds, and devoted myself full time to getting a better paying job in economics. And wouldn't you know it, a few weeks later, I landed one.

The job, if I agreed to take it, was as an economic researcher at Arity, a telematics "startup" within the Alltstate family. My job was to write internal white papers about different subjects related to Arity's products so that product managers, VPs, and other key decision makers could understand the landscape better. I heartily agreed. For my work I would be paid the unimaginably high income of around $50k a year. It was a dream come true. I threw myself into the work. There were no guidelines or deadlines beyond just writing something useful for the execs. It was perfect—just the amount of oversight I wanted (none). By October 2017, three weeks into my new job, I wrote a 24-page single-spaced paper that reverberated around the company about the economic conditions that led up to the use of rideshare in the American economy.

The positive feedback fueled me. My next paper, part one of a two part report, I released  a few weeks after that. It was a 38 page single-spaced diatribe about the impending semiconductor crisis and labor and parts shortages of American motor companies. Part 2, released in January 2018, balooned to 78 pages single-spaced (table of contents below). It covered everything from the history of automobile use in America, millenial debt (I've been on this train for a while), spatial and urban economics, and more. As I've said, I was monomanical. I wouldn't stop. All I wanted to do was to prove myself, to push myself.

![](https://benjaminlabaschin.com/wp-content/uploads/2023/07/Screenshot-2023-07-24-at-18.14.59.png)

By April 2018, my final report was published (less fancy table of contents below). At this point I slowly came to realize that I was pretty much writing for myself. No product manager was going to read an 88 page, single-space report on the origins and uses of Pigouvian taxes on traffic congestion mitigation, regardless of how well written it was. One day I looked up from all my writing and realized my data scientist colleagues across the way were simply more impactful than me. It became clear to me that it wasn't economic report writing that was going to affect change, but modeling.

![](https://benjaminlabaschin.com/wp-content/uploads/2023/07/Screenshot-2023-07-24-at-18.17.49.png)

Far from an inconvenient reality, I viewed this as good news. After all, there was a lot of math and modeling in data science. And seeing as how I didn't have an extensive background in math—I only really started getting into math my Junior year of college, maybe this would finally get all those grad school economics professors to look my way when I eventually, some day, applied to grad school. Suddenly I saw it. This was an oblique means to my ultimate ends: to one day become an economist.

It was time to learn programming and machine learning.

## Oblique Machine Dreams

It turns out, all the monomania that I had put into college, into applying to jobs, and into my research at Arity, had helped me build a very useful habit: studying programming and ML. Over the course of the following weeks I taught myself R, and then Python when I was told R would hold me back. I started to try to integrate coding into my work as best I could—anytime there was a task, I'd try to leverage my newfound skills to practice, and to get work experience for my resume.

The process of becoming a data scientist and eventually machine learning engineer was not smooth, nor marked with very many clear boundaries officially declaring my progress. I'm sure I will write a more detailed post in the future about how I got into this field. What I do know for certain was, like college, surrounding myself with individuals far more knowledgeable than me was very helpful in keeping me curious and motivated. At work we had many data scientists and engineers. I tried not to ask them too many questions (though it's hard to help yourself sometimes), but instead surround myself with them and to listen about what they were working on, what they had trouble with, and what problems interested them.

From my experience, the best thing you can do is to find one or two individuals in particular that you like and who seem to like you, and ask them to mentor you. One day, I found mine. His name was (is) Justin. He came into work with a very "loud" Dragonball Z anime hoody on that stood out among all the button down shirts at the office. We got along well. He was down to Earth, but clearly sensitive like me. Eventually he was assigned to the team I had been working with, and I took my chance to ask if I could shadow him a bit and learn about data science. He was happy to oblige me. More than teaching anything in particular, it was great just to have the kind of guidance and perspective he provided. He likely doesn't think he did much for my career but I will always be grateful to him.

It wasn't just studying at work that got me prepared, however. There was a lot of outside work that had to be done. When I was at home I spent a lot of my time reading and studying. Every day on the train to work, at lunch, on the train back, at home, and over the weekend, I would study. Luckily this stuff actually interested me, so it didn't get too overwhelming. Data science and ML work was so satisfying because you immediately saw the consequence of your work—the feedback mechanism of coding is one of its most attractive features.

After a few months, I was very comfortable in this world. That was good timing too, because one day Justin brought me and the team into a conference room to talk. He was leaving for a different job. I was devestated. I cared a lot about Justin. I hadn't yet embraced the cold, distant relationship style that allows people to remain unmoved when a colleague suddenly stops apppearing day after day. But I also learned a lot about how to approach work and work-related problems from Justin. I knew there simply wouldn't be another mentor like him.

That's when I decided to start looking myself. Although my work at Arity had clearly shifted from research, to analysis, to data science and ML, my pay did not reflect this. I learned from Justin, this had to change and it wasn't going to change there.

I'm glossing over many details but basically, after Justin left I started to look for jobs. A few months later, I got one. My first "official" data science job. With some negotiation help from Justin, who had kindly kept in communication with me, I was able to more than *double* my salary. I didn't even think that was possible to do, but it was. Suddenly I realized that my goal of paying off my loans before I'm 30 could actually happen.

## Sticking To It

The next few years brought more work, more ML related problems and solutions, and different jobs with still better pay still. All the while I would simply grind, study, and save. I wasn't in the same position from when I left college, but still I remained motivated to break the chains of this debt. My strategy, if you want to call it that was relatively simple: I would ensure payments were made on time every month, while saving my money. I have a sample of these payments down below. After a few years of saving for emergencies, any leftover surplus would accumulate. Eventually it would accumulate enough such that I could take a chunk out of my debt. And that's what I would do as you can see below. I would throw a big chunk of savings at the loans with the highest interest and attempt to pay them down. Ideally, I'd pay off an entire loan so that my monthly payments would shrink too, relieving the pressure. Over the years I would refrain from spending much on anything—I was busy working and studying anyway so there wasn't much to spend it on. Then I would commit burts of $15k, $25k, even $47k at once, just to get rid of this debt. Admittedly, the day I paid back $47k at once felt a bit weird. But it came with a greater sense of freedom, so that was nice.

<div style="text-align: center;">
    <figure>
        <img src="/assets/2023/07/repayments-1024x931.png" alt="" width="1024" height="931" class="size-medium wp-image-1063" />
        <figcaption>Repayments Over Time (Sample)</figcaption>
    </figure>
</div>

Finally, when the debt was whittled down to around $38k I realized that I should probably refinance my loans so they don't have such high interest. Folks, if I can suggest one thing, maybe look into refinancing your loans when rates are low. There is literally zero downside for you. I'm sure I could have save upwards of $20k this way.

Maybe six months after I refinanced my loans, finally shrinking interest rates from 8% to 3%, I paid off my loans entirely.

## Pay Off

As I've said, I am now debt free. But somehow the journey to paying off these loans felt far more significant to me than the final act of paying them off. I've been asked: now that you're debt free, how do you want to celebrate? I haven't come up with an answer. Maybe I don't feel like celebrating. It was an unreasonable amount of money to pay off. But perhaps more simply than that, maybe it's just that I feel gratitude that I was even able to achieve this. I've felt for a long time now that hard work pays off, if you're willing to put in the effort. I am *not* saying that I believe everyone is able to work their way out of their problems, but I am saying I am grateful I was.

My journey isn't over, however. I love my career so far in machine learning and don't plan to stop pushing myself. I'm even applying my research background to writing reports on Large Language Models for O'Reilly Media! I'lll be teaching an Introduction to Machine Learning Course at the Argyros School of Business & Eeconomics at Chapman University this Fall. And I still haven't closed the book on the possibility of grad school in economics. Crazier things have happened, like, for instance, paying off $194k in debt in six years.

A final note: In 2020, as the pandemic began to proliferate around the globe, I had the honor of being my friend Alex's witness to the signing of her marriage contract (Ketubah). During that wonderful, intimate ceremony, as friends and family were giving words of blessing and thanks to Alex and her husband-to-be, I was able to take a moment to publicly thank Alex for all she'd done for me, for the belief she showed in me, and for the impact she's had on my life.

1d:T3dc4,
*Thank you to the McCausland family for reviewing this post before it was published.*

On February 1st, 2014, in the early hours of the morning, my friend Sarah McCausland was struck and killed by a drunk driver. She was walking back to campus with her friends near Bard College. She had only recently turned 19. She wasn’t alone. Her friend Evelina Brown was also killed in that very same incident. 

It’s been 9 years since Sarah’s death, and every year since I’ve told myself I would write publicly about her—about the days and years that followed—and every year I haven’t. Part of the reason I haven’t is that I didn’t want to make Sarah’s death about me, “to take up space in Sarah’s story” as a close friend characterized it. This was her family’s nightmare, and the last thing I’d want would be to disrespect Sarah’s memory or to make their lives harder. But if I’m being honest, part of the reason why I didn't write anything was simply because I didn't know what I wanted to say—just that I wanted to say it.

So why is this year any different?

A few months ago Sarah’s dad Andy contacted me. This wasn’t necessarily out of the blue—since her passing, I’d contact her family, at minimum, on the anniversary of the incident to let them know that I hadn’t forgotten, to ensure they knew that Sarah mattered to me. But this time it was for something in particular: the McCauslands were making a documentary about Sarah’s life and they were wondering if they could interview me.

I said yes. But I wasn’t without reservations. The thing I’ve discovered about the death of a friend is that it evokes some pernicious questions in one’s mind. The most fundamental of which being: was I truly her friend? How can I even know I was her friend if there is no concrete way to prove it? From the outside, it may seem an odd, even teenage-like logic to seek validation from the friendship of a now-deceased person. Perhaps it’s because the death of a friend cements their temporal likeness in your mind—who they were at the time of their death is who they will ever be—in addition to cementing who you were when they passed. In essence, death freezes relations, indelibly stamping them into the sands of time. In that way, it makes a kind of sense that I’d still ask the kinds of questions natural to me at that time.


![A picture of Sarah, her best friend Emily, and I](/assets/2023/01/Sarah_Emily_and_I-768x603.jpeg)

A picture of Sarah, her best friend Emily, and me

So yes, I’ve never been certain about who I was to Sarah. But for 9 years since her death, I’ve been wrestling about who she was to me. Her father’s interview only sped up the process.

First let me say this: like many once-teens, high school was a deeply dark period in my life. It is in no way hyperbole when I say that my memories from that period are shaded as if a pall had been cast over every experience. Unsurprisingly, it's because I was a deeply depressed adolescent who struggled with inchoate, existential issues that someone of my emotional maturity could not yet overcome. I didn’t have the methods I needed. But Sarah was one of the few lights in the dark, and it's not an exaggeration. Sarah truly was a light. When I saw Sarah in the hall between classes, or on the weekends at some friend’s house, I can recall memories of a different sort: memories of color that to this day allow me to access a kind of vibrancy from that period that most recollections simply do not evoke.

It’s not that I was in love with her or anything. Ask anyone who knew her and they’ll agree that Sarah’s personality was magnetic when she wanted it to be. There’s no other way to put it. Sarah had the ability to turn on a kind of gravitational pull of personality, lightening the air around her with an improvisational wit and joviality that you were powerless to deny. And if you were one of the lucky few she chose to partner with in a round of intellectual improvisation, trading jokes and witticisms, it felt like lightning. 

That was the thing about Sarah, she was so quick. And she was quick because she was smart, really smart. She played multiple instruments, all self-taught. She was a straight-A student. And she had the most wonderful, moving voice that constantly touched those around her. I’ve linked a recording of one of her serenades below.

Sarah\_SomebodyLikeYou.mp4

[](https://benjaminlabaschin.com/wp-content/uploads/2023/01/Sarah_SomebodyLikeYou.mp4)

Because Sarah was so smart, she could read people quickly. And because she could read people quickly, she tended not to want to put up with their bullshit. This was fine if you were on her good side. But certainly it would put you in an uncomfortable situation if you found yourself on the other side of the coin. 

Which brings me to my interview for her documentary. Honestly, I don’t entirely remember all the questions asked of me. Before the interview I know we had a lovely lunch with her father Andy and her mother Sandy. But when we went to the makeshift studio in the back of an office converted for filming, and I started answering questions, I think I accessed a side of myself that is habitually shut off.

I do recall a few of things I said though. One is a memory of a lesson I was given during Sarah's wake. It was one of the few times I can remember ever being in a church service. The priest speaking at the time said that he and the McCauslands believe that it does a disservice to the memory of the deceased to paint of them a rosier picture than that which was strictly true. That stuck with me. I think it’s because Sarah and I were so deeply allergic to inauthenticity. And so to paint her as perfect truly would have been wrong.

That’s what I meant when I implied above that Sarah could also be harsh. She judged people like I judged people—it’s why I liked her! She dealt with the absurdity of adolescence with a cutting humor and, like me, perhaps an unforgiving lack of patience for perceived artifice. I could not articulate it at the time, but her casual confidence and intellectualism was a source of connection and a temporary palliative to a deeply depressed, lost teenager. 

Sarah’s death is still painful. Most markedly to her family, whose tragedy is beyond words. To her parents, certainly. But also to her younger sister Tori whose life’s trajectory undoubtedly shifted after that night. And not to mention some friends who were unabashedly closer to Sarah than I was. Maybe others haven’t experienced it, but at least to me one of the obstacles of losing a friend is the knowledge that while they meant so much to me, they meant even more to others. For me it naturally leads to the question: who am I to write about Sarah? I know for a fact she was more to others than to me. Am I somehow disrespecting her name if I write about her then? Or how about an even more cutting, uncomfortable question: If she were alive today, would we have been as close? I can’t confidently say we would have. Which leads me back to the fundamental question, the kind that I think Sarah might have asked: is writing about Sarah publicly in some way performative? I think the answer to this last question is yes. But as a brilliant actor, Sarah was no stranger to performance. She knew there was utility in it—catharsis even, for the performer and audience both. That gives me some solace. To the other questions I raise, I don’t have the answers. I still struggle with these and questions like them, and therefore with the legitimacy of my words and mourning.

All I can say is I take some solace in knowing that at least I’m still trying, still reaching out to her family, still working with her picture next to my desk.

```
        <style>/*! elementor - v3.6.8 - 27-07-2022 */
```

.elementor-widget-divider{--divider-border-style:none;--divider-border-width:1px;--divider-color:#2c2c2c;--divider-icon-size:20px;--divider-element-spacing:10px;--divider-pattern-height:24px;--divider-pattern-size:20px;--divider-pattern-url:none;--divider-pattern-repeat:repeat-x}.elementor-widget-divider .elementor-divider{display:-webkit-box;display:-ms-flexbox;display:flex}.elementor-widget-divider .elementor-divider**text{font-size:15px;line-height:1;max-width:95%}.elementor-widget-divider .elementor-divider**element{margin:0 var(--divider-element-spacing);-ms-flex-negative:0;flex-shrink:0}.elementor-widget-divider .elementor-icon{font-size:var(--divider-icon-size)}.elementor-widget-divider .elementor-divider-separator{display:-webkit-box;display:-ms-flexbox;display:flex;margin:0;direction:ltr}.elementor-widget-divider--view-line\_icon .elementor-divider-separator,.elementor-widget-divider--view-line\_text .elementor-divider-separator{-webkit-box-align:center;-ms-flex-align:center;align-items:center}.elementor-widget-divider--view-line\_icon .elementor-divider-separator:after,.elementor-widget-divider--view-line\_icon .elementor-divider-separator:before,.elementor-widget-divider--view-line\_text .elementor-divider-separator:after,.elementor-widget-divider--view-line\_text .elementor-divider-separator:before{display:block;content:"";border-bottom:0;-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1;border-top:var(--divider-border-width) var(--divider-border-style) var(--divider-color)}.elementor-widget-divider--element-align-left .elementor-divider .elementor-divider-separator>.elementor-divider**svg:first-of-type{-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:100;flex-shrink:100}.elementor-widget-divider--element-align-left .elementor-divider-separator:before{content:none}.elementor-widget-divider--element-align-left .elementor-divider**element{margin-left:0}.elementor-widget-divider--element-align-right .elementor-divider .elementor-divider-separator>.elementor-divider**svg:last-of-type{-webkit-box-flex:0;-ms-flex-positive:0;flex-grow:0;-ms-flex-negative:100;flex-shrink:100}.elementor-widget-divider--element-align-right .elementor-divider-separator:after{content:none}.elementor-widget-divider--element-align-right .elementor-divider**element{margin-right:0}.elementor-widget-divider:not(.elementor-widget-divider--view-line\_text):not(.elementor-widget-divider--view-line\_icon) .elementor-divider-separator{border-top:var(--divider-border-width) var(--divider-border-style) var(--divider-color)}.elementor-widget-divider--separator-type-pattern{--divider-border-style:none}.elementor-widget-divider--separator-type-pattern.elementor-widget-divider--view-line .elementor-divider-separator,.elementor-widget-divider--separator-type-pattern:not(.elementor-widget-divider--view-line) .elementor-divider-separator:after,.elementor-widget-divider--separator-type-pattern:not(.elementor-widget-divider--view-line) .elementor-divider-separator:before,.elementor-widget-divider--separator-type-pattern:not(\[class\*=elementor-widget-divider--view]) .elementor-divider-separator{width:100%;min-height:var(--divider-pattern-height);-webkit-mask-size:var(--divider-pattern-size) 100%;mask-size:var(--divider-pattern-size) 100%;-webkit-mask-repeat:var(--divider-pattern-repeat);mask-repeat:var(--divider-pattern-repeat);background-color:var(--divider-color);-webkit-mask-image:var(--divider-pattern-url);mask-image:var(--divider-pattern-url)}.elementor-widget-divider--no-spacing{--divider-pattern-size:auto}.elementor-widget-divider--bg-round{--divider-pattern-repeat:round}.rtl .elementor-widget-divider .elementor-divider\_\_text{direction:rtl}.e-container>.elementor-widget-divider{width:var(--container-widget-width,100%);-webkit-box-flex:1;-ms-flex-positive:1;flex-grow:1}

When you lose a friend, especially when you’re young, it leaves an indelible mark, as I’ve said. Like any trauma, it sears into your brain, as it did mine. Back in February 2014, I was a sophomore in college. I was also a resident assistant (RA), which means I was paid to watch over other students in the dorm. I liked to think I was a pretty good RA—straddling the perilous social line that allowed residents to do what the fuck they wanted so long as they knew not to let you see it, so long as they were safe and kind to each other. One day, being the upstanding RA that I was, I decided that an unused dorm room should be accessible to everyone: why close it off to the people? So I used my building key to unlock the door and proceeded, with a few choice residents who would actually become my closest friends at the college, to build the biggest pillow fort in Lake Forest College history (according to us). It was there that weekend, within that not-so-college-sanctioned pillow fort, that I received a phone call from my hometown best friend. I knew something was wrong because even in 2014, you didn’t really call people out of the blue. I answered the phone to crying on the other end. It was there, surrounded by pillows and blankets fastened to the ceiling tiles that I received the news of Sarah’s death. I received it succinctly, with slight confusion, and few other emotions that seemed appropriate for the time. Suddenly, I was deeply aware of my surroundings, ashamed and self-conscious. You can probably imagine why. While I was being childish in college, encased in a pillow fort, Sarah died. It wasn’t right. Whatever that situation was, its character instantly altered my perspective.

That memory, of learning of Sarah’s death as I did, is one I returned to often in the intervening months. Sarah’s death affected so many of her contemporaries' lives—mine is simply the only example I can speak to. For me, I think it sped up the rate at which I shed my adolescence, a catalyst that only fast-forwarded me further into the fertile ground of intellectualism and academia like so many before me who used it as an escape. I expect it also contributed to my leaving the US altogether. The following year, in the winter of 2015, I left the US to study in about as remote a place as I could find: Botswana, Africa. It was there, surrounded by the Kalahari desert, that I wrote to myself a month into my six-month semester abroad:

Today I woke up in a tent in Botswana, approximately eight thousand five hundred and thirteen miles away from Illinois. Yet, still my friend Sarah’s presence remains as strong as ever to me. I am haunted by the tragedy of her death one year ago today, but I am embraced by her memory. 

Since then, I have done work to limit the burden of Sarah’s death on my psyche, though I’m sure there is plenty of room to psychoanalyze what I’ve written here. But after all this time, here’s what I think is important: there’s never a good time to have a friend’s life stolen from them, from their family. Sarah’s death has impacted so many. From her death there were many hard lessons, imparted onto me and surely onto others. Mine isn’t the real story. I struggled to write about her death for long both because I never fully internalized her loss, and because I didn’t want to make it about me. The story that I wish I could have written is that of all the accomplishments Sarah would surely have had today, were she still alive. Instead this is what I have to offer:

Today is the 9 year anniversary of Sarah and Evilina’s deaths. I know their families miss them dearly, and so too do their friends like me who have each struggled in their own way to properly mourn their loss. These were young lives snatched from our world all too soon. There was so much they would surely have done–notable to themselves, to their families, and possibly to the world. I hope you are wise enough not to need a story like this to avoid drinking and driving. But if this is the kick you need, so be it. Don’t drink and drive. You risk shattering lives.
1e:T1201,

# What Did I Do This Year?

As 2022 winds down, I've found myself looking back and wondering: what did I do that matters to me? In many ways, it was a blur. Being a founding member of a seed-stage startup will do that to you, not to mention moving to a new state and all that involves.

And so, while I haven't historically publicized my accomplishments like this, this year I figure I'll try it. More than anything, I hope it will serve to inspire me to achieve my goals for 2023, some of which I'll also post below.

### Personal Accomplishments (Unordered)
  💰 This year, I successfully paid off my private student loans by paying down the remaining $53k I had left. While I still have a chunk remaining in the form of public student loan debt, this has been a deeply engrained goal of mine since I graduated college. Stay tuned for this one, I have more to say.
  🌅 In March of this year, we visited San Diego. A week after, I quit my job. 2 weeks after that we packed our thing and made the 3 day drive to San Diego to start a new life. I haven't regretted it once (though I do miss my family).
  👰‍♀️ Despite the pandemic, and my own concerns, I was able to attend my sister and now brother-in-law's wedding in Puerto Rico. It was a wonderful occasion and I'm grateful I was there to see it.
  💻 This year I joined as a founding hire for a new startup (technically Dec 2021). It may have been a risk financially. But it has paid of emotionally and experentially. I love my colleagues and Workheli. I believe in each of them, and I believe in what we're building.
  📊 NormConf. This year I was able to co-organize, speak-at, and attend [NormConf](https://normconf.com/). NormConf was a labor of love. There have been many takes. Perhaps I'll say something more about it one day. But I think Vicki's take has said what needed to be said. ❤️
  Among my conributions (it was a <i>team</i> effort) were:
  - organizing the conference
  - tracking and forecasting the financials
  - organizing the surprise appearence of the International String Band
  - design the community guidelines and moderation policy
  - deploying the conference API
  - coordinating with NumFOCUS to help raise $16k dollars!

  🏫 Despite all the busyness of this year, I stuck to my goal of continuing my math education by taking a DiffEq course at UCSD. I learned a bunch.
  🖥️ After monitoring prices for some time and slowly accumulating the parts, I built a PC for the first time this break. I love it and I'm already using my NVIDIA GPU.
  🏃‍♂️ I don't talk about it much, but a decade ago I started running and have rarely stopped since. I continued my pattern of running (or biking) almost every day (this year was a little less running than I'm use to. Going to change that next year.
  👨‍💻 This year I launched new version of my website. I'm relatively happy with it (though it could use some improvements). I'd been meaning to do it for a while and I'm happy I did.
  📋 I wrote 3 posts this year (this one counts!). I love writing. I intend to do more in the coming year.
  ⛺️ In 2021 I hiked Sequoia for the first time with my close friends. Unfortunately, my partner Hannah was unable to attend. This always bothered me. Thankfully, she surprised me with a National Park pass and a planned trip to Sequoia for my birthday. It was a highlight and I'm grateful we got to go.

### What do I want to accomplish next year?
  💸 My goal has always been to pay off all my student loans by the time I am 30. As 2023 will be that year (September), I intend to meet or exceed that goal.
  👩‍💼 My sister is going to be starting a business this year and I have committed to helping her get started. I'm excited for her, I'm confident in her business accumen, and I'm looking forward to the successes we'll have.
  👨‍🏫 I have already signed up for another math class at UCSD. I hope to take at least one additional credited course this year.
  📟 I'd like to contribute to at least one popular OSS package this year.
  🏞️ I'd like to visit at least two national parks this year and camp at least twice.
  🗒️ I aim to write at least 5 posts this year.
  👫 I'm going to look into joining a running club in San Diego this year.
  🗺️ I hope to travel to at least two countries this year.
  📄 I'd like to write an economic research article for a journal based on the work we're doing at Workhelix.
  📓 Speaking of journals, I'd like to read more—especially foundational journal articles.


We'll see what 2023 brings. Happy new year!
20:T3aad,
# Intro

If you're reading this post then you probably want to learn how to deploy a docker container to AWS cheaply, quickly, and without much ado. Perhaps you've seen my NormConf Talk "Building an HTTPS API for Cheap: AWS, Docker, and the NormConf API".

In the example below, I will push a FastAPI app that has been containerized by Docker, pushed to AWS ECR, and hosted using Farage in ECS. I assume you seek to have external users connect to your API, so I demosntrate how to use a Route 53 A record and an Application Load Balancer to connect to the ECR image.

This is a lot, so I've written instructions as succinctly and directly as I could. If I've missed anything, please feel free to reach out!

This post assumes the following of you:

    - You have the proper IAM permissions to deploy in an AWS environment.
    - You've installed the AWS CLI in your terminal.
    - You have a docker image built and are ready to deploy it to the cloud.
    - Have access to a domain or will buy one in Route53


Alright, let's get to it.

## Getting Started
[Goodies API](https://www.github.com/cormconf/goodies)

As I've said, ensure you have the IAM permissions for all of the below AWS services.

     - S3
     - ECS
     - ECR
     - VPC
     - Load Balancing
     - Route53
     - Certificate Manager
     - KMS
     - SSM

## Elastic Container Registry (ECR)

First you're going to need a repo into which your images will be stored:

1. Go to AWS ECR and create a repo named my repo\
`aws ecr create-repository --repository-name <REPOSITORY NAME>`

## Docker to ECR

Now that you have a repository, you'll want to load an image to ECR:

2. Get your ECR password, pass it to docker to login\
`aws ecr get-login-password --region <REGION> | docker login --username AWS --password-stdin <ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com`
3. Tag your image\
`docker tag goodies:latest <ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/<REPOSITORY NAME>`
4. Push your image\
`docker push <ACCOUNT>.dkr.ecr.<REGION>.amazonaws.com/<IMAGE NAME>`


## VPC & Subnets
5. Create a [VPC](https://docs.aws.amazon.com/vpc/latest/userguide/what-is-amazon-vpc.html). You'll need to determine what CIDR block is best for your use-case.\
`aws ec2 create-vpc --cidr-block 10.0.0.0/16`

6. Record the ID of the VPC\
`aws ec2 describe-vpcs` -> e.g. `vpc-123456789`

7. Create Subnets using the ID of the VPC, do this twice, one per [availability zone](https://docs.aws.amazon.com/AmazonElastiCache/latest/mem-ug/RegionsAndAZs.html). Be sure to check the documentation to determine which availability zone to use, for example `us-west-2a` \
`aws ec2 create-subnet --vpc-id <VPC ID> --cidr-block 10.0.0.0/24 --availability-zone <REGION>a`
`aws ec2 create-subnet --vpc-id <VPC ID> --cidr-block 10.0.1.0/24 --availability-zone <REGION>d`

## Network Engineering

8. First create an [internet gateway](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Internet_Gateway.html) and record the id (you'll use this for the next step).\
`aws ec2 create-internet-gateway --query InternetGateway.InternetGatewayId --output text` -> e.g. `igw-123456789`
9. Attach the internet gateway to your VPC.\
`aws ec2 attach-internet-gateway --vpc-id <VPC ID> --internet-gateway-id <INTERNET GATEWAY ID>`
10. Create a custom route table for your vpc and record the id.\
`aws ec2 create-route-table --vpc-id <VPC ID> --query RouteTable.RouteTableId --output text` -> e.g. `rtb-123456789`
11. Create a route in [route table](https://docs.aws.amazon.com/vpc/latest/userguide/VPC_Route_Tables.html) for traffic use.\
`aws ec2 create-route --route-table-id <ROUTE TABLE ID> --destination-cidr-block 0.0.0.0/0 --gateway-id <INTERNET GATEWAY ID>`
12. Create a route to internet gateway for 10.0.0.0/16 (or whichever CIDR block you chose in step 6).\
`aws ec2 create-route --route-table-id <ROUTE TABLE ID> --destination-cidr-block 10.0.0.0/16`
13. Check if your routes were created.\
`aws ec2 describe-route-tables --route-table-id <ROUTE TABLE ID>`
14. Get the subnet IDs to associate (use your vpc id to get them) (there should be two).
`aws ec2 describe-subnets --filters "Name=vpc-id,Values=<VPC ID>" --query "Subnets[*].{ID:SubnetId,CIDR:CidrBlock}"` -> e.g. `subnet-123456789` & `subnet-987654321`
15. Associate the subnets to your route table.\
`aws ec2 associate-route-table --subnet-id <SUBNET ID A> --route-table-id <ROUTE TABLE ID>`
`aws ec2 associate-route-table --subnet-id<SUBNET ID A> --route-table-id <ROUTE TABLE ID>`



## Security Groups
You'll need to create two security groups here.

### Group 1: The Network Security Group
16. Create a security group for your networks and record the id. Group name should be made up here. Ensure you record the ID for the newly created security group. -> e.g. `sg-123456789`\
`aws ec2 create-security-group --group-name <GROUP 1 NAME> --description "SG used for Fargate VPC" --vpc-id <VPC ID>`

17. Add port rules for security group 1. These will allow or connectivity to your app, and to securely forward to HTTPS on port 443.\
 `aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 1 ID> --protocol tcp --port 8000 --cidr 0.0.0.0/0`\
`aws ec2 authorize-security-group-ingress --group-id  <SECURITY GROUP 1 ID> --protocol tcp --port 80 --cidr 0.0.0.0/0`\
`aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 1 ID> --protocol tcp --port 443 --cidr 0.0.0.0/0`

### Group 2: The App/API Security Group
18. Create a security group for your app/its APIs and record the id. Group name should be made up here. Ensure you record the ID for the newly created security group. -> e.g. `sg-987654321`\
`aws ec2 create-security-group --group-name <GROUP NAME 2> --description "SG used for api" --vpc-id <VPC ID>`
19. Add security group tcp: port 8000\
`aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 2 ID> --protocol tcp --port 8000 --source-group <SECURITY GROUP 1 ID>`
20. Add security group tcp: port 80\
`aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 2 ID> --protocol tcp --port 80 --source-group <SECURITY GROUP 1 ID>`
21. Add security group tcp: port 443\
`aws ec2 authorize-security-group-ingress --group-id <SECURITY GROUP 2 ID> --protocol tcp --port 443 --source-group <SECURITY GROUP 1 ID>`

## Certificate Manager

If your domain is hosted through a different vendor, you'll need to import the SSL certificate. This is what websites use to "prove" they're not sketchy.

Go to AWS Certificate Manager, enter the subdomain + domain, email verification, press send, and have the site owner approve the reques through their email. Otherwise, you'll need to get the SSL certs from your site yourself and import them into AWS. You will need your SSL established before moving forward.

## Target Group
Before creating your load balancer and its listeners, you'll need to create a [Target Group](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/load-balancer-target-groups.html) which routes requests. Here's the high level overview you'll need for your target group:

- Protocol: HTTP
- Port: 8000 (or whatever your docker image port is exposed as)
- Protocol Version: HTTP1
- Target Type: IP
- IP Address Type: IPV4
- Path: /
- Load Balancing Algorithm: Round Robin

22. Create Target Group via CLI
```
    aws elbv2 create-target-group
    --name <TARGET GROUP NAME>
    --protocol HTTP --port 8000
    --target-type ip
    --protocol-version HTTP1
    --vpc-id <VPC ID>
```

## Load Balancers
Next you'll need to create an [application load balancer](https://docs.aws.amazon.com/elasticloadbalancing/latest/application/introduction.html). Here's the high level overview you'll need for your application load balancer:

- Type: Application Load Balancer
- Scheme: Internet Facing
- IP address type: IPv4
- Network Mapping: Your VPC
- Mappings: Select at least two Availability Zones

23. Create load balancer via CLI:\
    ```
        aws elbv2 create-load-balancer
        --name <LOAD BALANCER NAME>
        --type application
        --ip-address-type ipv4
        --subnets "<SUBNET ID A>" "<SUBNET ID B>"
        --security-group <SECURITY GROUP 1 ID>
    ```

## Listeners
Here you'll need to create *two* [listeners](https://docs.aws.amazon.com/elasticloadbalancing/latest/classic/elb-listener-config.html) to allows your load balancer to check for connection requests.

You'll need your loadbalancer arn and your target group arn. Here are some helpful CLIs for these

24. Load-balancer ARN:\
`aws elbv2 describe-load-balancers --names <LOAD BALANCER NAME> --query "LoadBalancers[0].LoadBalancerArn" --output text`

25. Target Group ARN:\
    `aws elbv2 describe-target-groups --names <TARGET GROUP NAME> --query 'TargetGroups[0].TargetGroupArn' --output text`

    Details of the first listener:
    - Listener Protocol: http:80
    - Forward to target group above: `<TARGET GROUP NAME>`

26. Create first listener via CLI:\
    ```
        aws elbv2 create-listener
        --load-balancer-arn <LOAD BALANCER ARN>
        --protocol HTTP --port 80
        --default-actions Type=forward,TargetGroupArn=arn:<TARGET GROUP ARN>
    ```

    Details of the second listener:
    This one is a bit more complicated. We need to reference both our security policy and our SSL certificate we established above
        - Listener Protocol: https: 443
        - Forward to target group above: normconf-target

27. To get your ssl certificate arn:\
`aws acm list-certificates --query "CertificateSummaryList[?DomainName=='<YOUR DOMAIN>'].CertificateArn" --output text`

28. To create a second Listener via cli:
```bash
    aws elbv2 create-listener
    --load-balancer-arn <LOAD BALANCER ARN>
    --protocol HTTPS
    --port 443
    --certificates CertificateArn=<CERTIFICATE ARN>
    --ssl-policy ELBSecurityPolicy-2016-08
    --default-actions Type=forward,TargetGroupArn=<TARGET GROUP ARN>
```


## Route 53
29. Now that you've created your load balancer, you'll need to create a public facing hosted zone. The name should be a subdomain/domain that you own or have access to (i.e. `api.normconf.com`). The caller-reference should be random. Try using the current date.\
`aws route53 create-hosted-zone --name <DOMAIN YOU OWN> --caller-reference 2022-12-13 --hosted-zone-config Comment="cli version"`

30. You'll need your hosted zones id for the next step. If you've misplace your hosted zone id, here's a command to retrieve it:\
`aws route53 list-hosted-zones | jq -r '.HostedZones[] | select(.Name=="<YOUR DOMAIN>.") | .Id'`
(requires you install `jq`, I suggest `brew install jq`)

31. Next, we're going to connect the application load balancer to a new "record A" Alias recordset. I prefer to use a json for this command, but you could enter it in your CLI. The example below uses a JSON file. You'll need the following information:

    Details of Record A
    - Action: `CREATE`
    - Name: `<YOUR DOMAIN>` -> e.g. `api.normconf.com`
    - Type: A
    - DNSNAme: `<LOAD BALANACER ADDRESS>` -> e.g. `dualstack.myapp-loadbalancer-123456789.<REGION>.elb.amazonaws.com`

    Example Record A JSON:
    ```json
    {
    "Comment": "Creating Alias resource record sets in Route 53",
    "Changes": [
        {
        "Action": "CREATE",
        "ResourceRecordSet": {
            "Name": "<YOUR DOMAIN>",
            "Type": "A",
            "AliasTarget": {
            "HostedZoneId": "<HOSTED ZONE ID>",
            "DNSName": "dualstack.myapp-loadbalancer-123456789.<REGION>.elb.amazonaws.com",
            "EvaluateTargetHealth": false
            }
        }
        }
    ]
    }
    ```

    `aws route53 change-resource-record-sets --hosted-zone-id <HOSTED ZONE ID> --change-batch file://record_A.json `


## Transferring NS Records
<b>Skip this section if you host your domain in AWS</b>

If you don't host your domain on AWS, you'll need to ensure that your DNS host has access to your NS records information. For example, for [namecheap.com](https://www.namecheap.com/support/knowledgebase/article.aspx/9776/2237/how-to-create-a-subdomain-for-my-domain/#cname) you would need to do the following:
- After logging in, from the dashboard on the left select `domain list`
- Find your url row and select `manage`
- From the `advanced dns` tab look for `host record`, there should be a button that says `add new record`
- From there we need to add 4 NS records, one submission for each NS found in your Route53 NS record:
    1. ns-`<NUMBER>`.awsdns-`<NUMBER>`.org
    2. ns-`<NUMBER>`.awsdns-`<NUMBER>`.co.uk
    3. ns-`<NUMBER>`.awsdns-`<NUMBER>`.com
    4. ns-`<NUMBER>`.awsdns-`<NUMBER>`.net


## Create IAM Policy
32. We're almost done. At this point we need to create a role for our ECS which we'll use to deploy our task definition. Give it a name like `ecsTaskExecutionRole`. We'll be using a JSON again to pass in the information.

Example IAM policy JSON:
```json
    {
        "Version": "2008-10-17",
        "Statement": [
            {
            "Sid": "",
            "Effect": "Allow",
            "Principal": {"Service": "ecs-tasks.amazonaws.com"},
            "Action": "sts:AssumeRole"
            }
            ]
}
```

`aws iam create-policy --policy-name <POLICY NAME> --policy-document file://ecs_policy.json`

## ECS
A note: filling out service and task definition from scratchthe first time is an exercise in madness as they are highly-configurable objects. I suggest doing this part in the UI the first time just to learn what you want. Below, I write out the CLI instructions.

### Create Cluster
33. Create an AWS ECS [cluster](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/clusters.html)\
`aws ecs create-cluster --cluster-name <CLUSTER NAME>`

### Create Service
34. Next, you'll need a `service` to run within your cluster (it manages your task definitions). I prefer to add this as a json rather than using all the cli. You can find a [service template](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/quickref-ecs.html) here.
    `aws ecs create-service --cli-input-json file://service.json`

### Create Task Defintion
35. Here we are creating the template of instructions that tells ECS how to build and run our container and API.

Be sure to include the following details in your task definition.
    - The ARN from the policy we created above
    - The ARN of the ECR image we pushed earlier
    -
  I prefer to add this as a json rather than typing the instructions in the the cli. Here's an [example template](https://docs.aws.amazon.com/AmazonECS/latest/developerguide/create-task-definition-classic.html) you can edit.
    `aws ecs register-task-definition --cli-input-json file:/task-definition.json`


# Conclusion

And that's it! Wasn't that easy?

Oh, it was actually highly confusing and convoluted? Well, welcome to the cloud.

At this point your task definition should be deployed in your cluster and your image should be hosted in ECS from ECR. In a future post, I'll demonstrate how to automate this deployment process using GitHub Actions.

21:T1310,

## Introduction
Recently I was building a new repo in GitHub and realized I needed a new SSH key to push to GitHub. Upon bringing up GitHub's SSH creation UI, I was prompted by [1Password](https://1password.com/) with a "Create SSH Key..." option. Apparently I had opted into SSH-key creation 1Password and forgotten. What ensued was a few hours of overhauling how I maintain my GitHub SSH keys entirely. In this post, I'll walk you through how I've begun to maintain multiple accounts with 1Password's SSH Key management system (hint: as of `8/21/22` don't follow the 1Password's instructions...).

## Setting Up Multiple GitHub Accounts with SSH

Let's say you're like me and maintain multiple GitHub accounts. From experience you've realized that SSH Keys ("Secure Shell Keys") are a secure, simple method to access these accounts. Typically, you'd open your shell, type `ssh-keygen -t rsa`, point your file to an `~/.ssh/...` folder, and you'd be off to the races. Now, if you use 1Password, you can simply follow these instructions.

### 1Password
First, we're going to activate 1Password's SSH key generation option (that I forgot I had activated...)

1. In your 1Password, go to your ribbon and select `1Password` -> `Preferences` (or type `CMD + ,`)

	<div text-align: center>
   <img src="/assets/2022/08/1pwd_preferences.png" alt="1Password Preferences">
   </div>
2. In the Preferecnes screen, press `Developer`, then check the `Use the SSH agent` and `Display key names when authorizing connections` boxes.
   <div text-align: center>
   <img src="/assets/2022/08/activate_ssh.png" alt="Activate SSH">
   </div>

### GitHub
Next, we need to generate the key and add it to GitHub.

1. Login to your GitHub Account
2. Navigate to Settings
   <div text-align: center>
   <img src="/assets/2022/08/settings.png" alt="GitHub Settings">
   </div>
3. Select SSH and GPG Keys
   <div text-align: center>
   <img src="/assets/2022/08/ssh_gpg.png" alt="SSH and GPG Keys">
   </div>
4. New SSH key
   <div text-align: center>
   <img src="/assets/2022/08/new_ssh_key.png" alt="New SSH Key">
   </div>
5. Click into title (if not logged into 1Password, select the icon and log in)
   <div text-align: center>
   <img src="/assets/2022/08/1password_ssh_example.png" alt="1Password SSH Example">
   </div>
6. Select `Create SSH Key`
7. In the 1Password prompt, enter a simple, one-word title and select ed25519
   <div text-align: center>
   <img src="/assets/2022/08/testgit.png" alt="Test Git">
   </div>
8. Press `Create & Fill` then `Submit`.

### To 1Password Once More...
Now that our key has been generated and assigned to GitHub, we need to grab the information we need.

1. In your 1Password, go to your newly formed ssh key and download the *private key*.

   <div text-align: center>
   <img src="/assets/2022/08/1pwd_private_key.png" alt="1Password Private Key">
   </div>

- Fun Fact: 1Password's instructions tell you to download the *public key*. This does not work (and should not work). *DO NOT FOLLOW THESE INSTRUCTIONS.*
   <div text-align: center>
   <img src="/assets/2022/08/wrong_instructions.png" alt="Wrong Instructions">
   </div>

### To The Terminal! SSH and Git
Now that we have our private SSH key that we assigned to GitHub, we simply need to add that information to an `~/.ssh/config` file and connect our repo to Git.

First need to move our private key to its proper folder:
1.  Open your terminal and type `mv ~/Downloads/id_ed25519 ~/.ssh/[FILE NAME]`, where `FILE NAME` is whatever you'd like to call the private key file. I think `testgitkey` makes sense, so that's what I'll call it:
    <div text-align: center>
    <img src="/assets/2022/08/move_private_key.png" alt="Move Private Key">
    </div>

Next, we need to use our `.ssh/config` file to instruct our computer how to use our `.ssh` file. If you don't have an `.ssh/config` file, simply enter `touch  ~/.ssh/config` in your terminal.

2. Access your `~/.ssh/config` either by `open ~/.ssh/config` or something like `vi ~/.ssh/config`.

3. Paste the following information into your config file, replacing the information as needed
    ```
    # Test GitHub
    Host testgit
    HostName github.com
    User git
    IdentityFile ~/.ssh/testgitkey
    IdentitiesOnly yes
    ```
    Notice that I provided `Host` the exact same name as was written in GitHub's title field. In the same vein, next to IdentityFile, be sure to enter the name you gave your downloaded private key from 1Password.

Finally, we get to connect our GitHub to 1Password!

4. Navigate to a local GitHub directory you'd like to push.
5. Set the remote url to as follows: `<HOST>`:`<ACCOUNT NAME>/<REPO NAME>.git`\
   e.g. `git remote set-url origin testgit:Econoben/testrepo.git`

That's it! Simply rinse and repeat for each GitHub account you maintain, adding each account to your `~/.ssh/config`. Happy coding.
22:T17af,

# Introduction

Let's see if this sounds familiar: It's your first day at Finch—an e-commerce startup that sells bird food and supplies. As you're onboarded you're gradually introduced to the company's internal services. First there's Macaw, a wrapper around Airflow DAGs; then there's Senegal, which leverages Terraform; of course, you'll need Falcon which ingests avro files from Redis; also there's Junco, Starling, Kestrel...are you keeping up?

Flash forward three months, and it's turned out that you haven't even needed most of those services you heard about your first week. Some services have been mentioned in passing, but you haven't had to touch them. Except, oh, today you're in a meeting with engineering and they're talking about how in order to deploy your model to production, you need to connect Kestrel to Macaw, but to do that you've got to modify protobufs so that Junco reads in, which is where Starling comes in handy…

You see where this is going.

Why are these services named after birds? Well, as most of us know, it’s a norm in tech that the person or people who’ve created a project have the right to name it. Very often, the names will be thematic to your company's "culture"—services will be named in reference to the company name, or mascot, or business area. Except often these names are not only confusing as hell—they actively add to the significant cognitive load that tech workers have to balance on a daily basis. 

So here’s the truth: just because someone creates a useful internal service does not mean they're the best people to name them. The services we build are for others, not ourselves, and therefore, just like a good presentation or book, we should think of our audience. If your project is initially just for you, sure go ahead and use a funny stand-in name. But if your audience will be expansive, then consider abiding by reasonable naming standards. 

To me, no matter the company, service names should be:

- **Intuitive**
- **Easy**
- **Specific**

## Intuitive Service Names 

The primary function of a service should be the central theme of its naming. Why? Because then people will remember it... When people don't have to do extra work connecting a name to a function, you can spend more time solving and less time explaining. If your service is the order data pipeline for e-commerce, call it Finch Order Data Pipeline. If you've built a model that predicts customer churn: Finch Churn Model. It's that easy.

## Easy (to type, to say, ...) Service Names

Sometimes you'll have an engineer create a service who's something of an ornithologist themselves. They just so happen to love the Stresemann's bristlefront (Merulaxis stresemanni), one of the rarest birds on earth. So, they've taken it upon themselves to name their services Merulaxis. What, it's bird themed!  

Service names should be easy. Though the above example may seem overly eccentric, there truly are people who, without a thought for utilitarianism, will name services like this when given the chance. But let us not cast aspersions—it's hard to balk at the opportunity to name things that might outlast us. Let us instead point to naming standards and say, "Sorry that's not easy." 

Though "easy" is relative, I suggest the following guidelines when determining whether a service name is easy. 

It is simple to type.
It is reasonably easy for most people to say.
It doesn't contain uncommon letters or symbols.

## Specific Service Names

A service name should ideally be associated with one, and only one, function. For example, data-centric organizations often have many pipelines that process and transfer data from one state and service to another state and service. It therefore doesn't make much sense to call a service Finch Data Pipeline. Which pipeline, for what data? Better to take a moment to specify the name (e.g. Millet Shipping Data Pipeline), than to regret it later.

## But What About Fun?

At this point—or perhaps as soon as you started reading—you may protest. What about fun names? Don’t take the heart out of tech! Fair enough. If you are set on choosing a fun name, then I’ll point out there are libraries and services that meet the standards I listed above that are also fun. Plotly, the open-source visualization library, has a fun name that is intuitive, easy (by many standards), and specific—it’s a plotting library. NumPy allows for efficient, numerical operations in Python—it’s very straightforward. 

You get the idea. The point is, it’s not that names shouldn’t be fun, it’s that service names should also convey intuitive, easy, and specific meaning to internal audiences who use them.

One last note on this: “Maybe,” you might respond, “names are unfamiliar at first but with adoption they can grow into ubiquity.” My counter to that claim is that most people believe this to be true when they name their services, and very few achieve their goal. Most of the time service names just remain confusing.

## Additional Points
### Acronyms

Too many acronyms are already used in business, and unless it is a patently obvious, commonly used acronym, avoid names-as-acronyms when possible.

### Jargon and Insider Knowledge

Do not use names that assume shared context or use unreasonable jargon when perfectly straightforward alternatives exist. For example, say you create a fancy Transformer Reinforcement Learning model that calculates Customer Lifetime Value. Since you're very proud of it you name it TRTL. Except the model isn’t for you, it’s for Product. So, why not simply call it the Customer Lifetime Value service, since that's its function? 

### Rename Services

Finally, let’s say you’re part of a company that has confusing naming conventions such as those I wrote about above. Why not push to apply some standards to the names of existing services? While renaming the legacy services of your organization's may be difficult at first, I'm confident it will improve communication within your company moving forward. 
23:T241a,

<link href="themes/prism.css" rel="stylesheet" />
<script src="prism.js"></script>

## Introduction

Pandas groupbys are some of the most useful functions in a data scientist's toolkit. And yet, time and again I have found that colleagues do not realize the flexibility these ubiquitous functions can grant them. In the following post, I will demonstrate some of my favorite uses of groupbys in the hope that it will help others in the future.

## The Data

Let's start with a simple example and work our way up in difficulty. We'll start with reading in Covid19 data that Johns Hopkins University aggregated from the World Health Organization. The dataset contains approximately 300,000 observations from different countries and regions of the world on Covid19 cases, recoveries, and deaths.

<pre><code class="language-python">from pandas as import read_csv, Grouper
from datetime import timedelta

covid_ts = read_csv("covid_19_data.csv").dropna()
covid_ts['ObservationDate'] = pd.to_datetime(covid_ts['ObservationDate']
</code></pre>

Now that we've loaded our data, we can take a look.

<pre><code class="language-python">covid_ts.head()
</code></pre>

[table id=1 /]

Here we can confirm that we have seven columns of regional and national-level disease data. ObservationDate and Last Update don't differ by much, so for our purposes we'll simply stick with Observation Date, dropping the other. 

Since we'll be leveraging the temporality of our dataset, let's quickly check the range of our data.

<pre><code class="language-python">
start = min(covid_ts['ObservationDate'])
end = max(covid_ts['ObservationDate'])
range_ = end - start + timedelta(days=1) # inclusive range

print(f"Observations range form {str(start.date())} to {str(end.date())}, or {range_.days} days"
</code></pre>
Observations range from 2020-01-22 to 2021-05-29, or 494 days.

Okay, with that let's jump into some groupbys.

## Advanced Groupbys

Being Covid timeseries data, the first thing we can do is check how the disease has progressed over the weeks. Enter pandas.Grouper, a groupby-specific function that allows users to control how their data will be grouped at a time-based level. All we have to do is invoke Grouper within a typical groupby function, provide an offset alias (e.g. D for daily, W for weekly, Y for yearly), and an aggregation metric (e.g. sum, mean, count) such as is done in the following lines of code:

## Multiline functions can be surrounded with () for readability

<pre><code class="language-python">
(
 covid_ts.groupby(Grouper(key="ObservationDate", freq="1W"))
         [['Confirmed']]
         .sum()
         .reset_index()
)
</code></pre>

Resulting in the Weekly Aggregate Covid19 Cases table below:

[table id=2 /]


By grouping "confirmed" cases in covid_ts using Grouper, the offset alias 1W, and sum, we have easily aggregated weekly confirmed cases over the date range of our data. If we wanted more granular aggregations we could have easily changed our offsets to _D, where _ is any number of day offets. But this is only step one of what we can achieve with Grouper, and groupby aggregations in general.

The convenience of Grouper is extended by its ability to aggregate subgroups by the offsets it's provided—all that matters is the placement of Grouper relative to other groupby columns. For example, in the groupby snippet below, "Country/Region" is placed in a list before our Grouper function at the 1M (one month) offset, producing the National/Regional Covid Cases By Month table below.

<pre><code class="language-python">
(
   covid_ts
   .groupby(["Country/Region", Grouper(key="ObservationDate", freq="1M")])
   [['Confirmed']]
   .sum()
   .reset_index()
)
</code></pre>

[table id=3 /]

Whereas, by placing "Country/Region" in a list after Grouper, one can get a similar, but slightly different aggregation of the data: Monthly Covid Cases by Country/Region.
<pre><code class="language-python">
(
    covid_ts
    .groupby([
    Grouper(key="ObservationDate", freq="1M"), "Country/Region"])
    [['Confirmed']]
    .sum()
    .reset_index()
)
</code></pre>

[table id=4 /]

Note here that as we progress down our table, we pass the total number of covid cases for each country reporting, whereas previously we would pass through the entire history of reported covid cases per country. As ever, the order our data is listed as is determined by the placement of columns in our groupby. With Grouper, our options are simply extended to aggregations of date-values—and the extensibility does not end there.

## Complementary Functions

After grouping our data, we often want to operate on the values we have derived. Luckily, pandas provides us with assign, a function for manipulating newly derived columns in place. To use assign, most often one will also want to be comfortable with lambda expressions, so we'll be sure to implement them here as a reminder. Let's return to our National/Regional Covid Cases By Month for a use-case.

First, we'll rename our columns with some named aggregations for clarity, replacing "Confirmed" with the more accurate "Total_Cases".
<pre><code class="language-python">
(
    covid_ts
    .groupby(["Country/Region",
    .Grouper(key="ObservationDate", freq="1M"), ])
    .agg(Total_Cases=("Confirmed", "sum"),
            )
    .reset_index()
    .head()
)
</code></pre>

[table id=5 /]

Next, we'll add additional data to our table by inserting a named aggregation for "Total_Deaths" per country per month.
<pre><code class="language-python">
(
    covid_ts
    .groupby(["Country/Region",
    .Grouper(key="ObservationDate", freq="1M"), ])
    .agg(Total_Deaths=("Deaths", "sum"),
    	 Total_Cases=("Confirmed", "sum"),
         )
    .reset_index()
    .head()
   )
</code></pre>

[table id=6 /]

Finally, we'll leverage assign by referencing our new "Total_Deaths" and "Total_Cases" in-line, using them to create an entirely new column of data: "Death_Case_Ratio", or "Total_Deaths" divided by "Total_Cases". By multiplying our new ratio by 100 we can derive an informative metric: the percentage of infected individuals who die each month in a given country/region. Finally, we'll rename our columns to more aesthetic titles, as spaces aren't allowed in named aggregations.

<pre><code class="language-python">
(
    covid_ts
    .groupby(["Country/Region",
    pd.Grouper(key="ObservationDate", freq="1M"), ])
    .agg(Total_Deaths=("Deaths", "sum"),
         Total_Cases=("Confirmed", "sum")
        )
    .assign(
Death_Case_Ratio=lambda x: round(x['Total_Deaths']/x['Total_Cases']*100,2)           )
    .reset_index()
    .rename({'Total_Deaths':'Total Deaths',
             'Total_Cases':'Total Cases',
             'Death_Case_Ratio':'Death/Case Ratio (%)'},
             axis=1)
)
</code></pre>
And wala we have the following National/Regional Death/Case Ratio By Month table.

[table id=7 /]

## Aggregating Text and Filtering

Groupbys are not simply convenient for aggregating numerical data—they are also useful for summarizing text data too. Let's return again to our National/Regional Death/Case Ratio by Month table. This time, we'll leverage a lambda function within  our agg function, expanding its flexibility to its fullest extent.
<pre><code class="language-python">
(
   covid_ts
   .groupby(["Country/Region",
   pd.Grouper(key="ObservationDate", freq="1M"), ])
   .agg(Total_Deaths=("Deaths", "sum"),
        Total_Cases=("Confirmed", "sum"),
        City_States=('Province/State', lambda x: ', '.join(set(x)))
           )
   .assign(
Death_Case_Ratio=lambda x: round(x['Total_Deaths']/x['Total_Cases']*100,2)           )
   .reset_index()
   .rename({'Total_Deaths':'Total Deaths',
            'Total_Cases':'Total Cases',
            'City_States':'City/States',
            'Death_Case_Ratio':'Death/Case Ratio (%)'},
            axis=1)
   .query(""" `Country/Region` == 'US'""")
       )
</code></pre>

Here we generate a "City_States" column (subsequently renamed to "City/States") in which we aggregate "Province/State" text data to the monthly and country level. By implementing a join function, and filtering redundant data with set, we are instructing pandas to list out which cities and towns comprise our data. To visualize this, a filter was also added in the form of Pandas' powerful query function, which allows us to filter columns in place using boolean expressions. Here we filtered "Country/Region" to only include the United States. The result of our work can be seen in the US Death/Case Ratio by Month table below. 

[table id=8 /]

## Summary

As we can see, pandas groupbys are far more flexible than they are typically used for. We have seen that when we leverage functions such as Grouper, we are able to aggregate timeseries data using offset aliases. By implementing the agg function with named aggregations, we can reference and manipulate these new columns in place by appending an assign function to our code. Finally, we have seen that even text need not be ignored, thanks to our ability to use lambda functions within agg functions as well. To top it off, we saw that Pandas' powerful query function allows us to filter our data to whatever granularity we'd like using boolean expressions.
24:T5e93,

<!DOCTYPE html>
  <html>
  <head>
     <link href="/Users/blabaschin/Documents/Publii/post_config/prism.css" rel="stylesheet" />
  </head>
  <body>

<script src="/Users/blabaschin/Documents/Publii/post_config/prism.js"></script>
  </body>
  </html>

![The Fighting Temeraire, JMW Turner, National Gallery](/assets/2022/08/1024px-The_Fighting_Temeraire_JMW_Turner_National_Gallery.jpg)

**Keywords/Topics:**
<html>
    <head>
        <style type="text/css">
            ul { display:inline-block; padding:0; text-align:center }
            li a { white-space:nowrap }
            li:after { content:" "; letter-spacing:1em; background:center center no-repeat url(data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAUAAAAFCAYAAACNbyblAAAABGdBTUEAALGPC/xhBQAAAAlwSFlzAAAOwAAADsABataJCQAAABl0RVh0U29mdHdhcmUAcGFpbnQubmV0IDQuMC4xMkMEa+wAAAAnSURBVBhXY/Dz89MA4sNA/B9Ka4AEYQIwfBgkiCwAxjhVopnppwEApxQqhnyQ+VkAAAAASUVORK5CYII=); }
        </style>
    </head>
    <body>
        <ul>
            <li style=" display:inline">ARPA</li>
            <li style=" display:inline">Project Mac</li>
            <li style=" display:inline" >Robert Fano</li>
            <li style=" display:inline">Fernando Corbató</li>
            <li style=" display:inline">Time-Sharing</li>
            <li style=" display:inline">Project SAGE</li>
            <li style=" display:inline">Batch-Processing</li>
            <li style=" display:inline">Multiprogramming</li>
            <li style=" display:inline">Round-Robin Algorithm</li>
            <li style=" display:inline">William Nordhaus</li>
            <li style=" display:inline">Cloud Computing</li>
        </ul>

   </body>
</html>

# Introduction

Recently I began writing a post on ways to automate python scripts passively.<sup><a href="#fn1" id="ref1">1</a></sup> For the purpose of the post I chose cron, an operating system utility that is run as a daemon—a program that runs passively in the background of a computer. If cron and daemon both seem etymologically Greek to you, they did to me as well. While researching whether this was true (it probably is), I fell down an interdisciplinary rabbit-hole of computer science history. What I discovered and have since written about below is a more complete history than I've been able to find about time-sharing computing and the function of the round-robin algorithm. In future a post, I plan on writing more about the economics of cloud computing.

# Early Innovations

In the early 1960s, the Advanced Research Projects Agency (ARPA)<sup><a href="#fn2" id="ref2">2</a></sup> was investing in different projects that could be used to fight the Soviets. The agency, only a few years old, had been founded just four months after Sputnik's October 1957 launch. Its [express mission](https://www.darpa.mil/about-us/timeline/creation-of-darpa) was to maintain the US's technological (military) superiority over other nations. With an initial [budget of $400 million dollars](
https://www.jstor.org/stable/23406949) (about $3.7 billion in 2020 dollars), the agency had few limits.

One such project that received ARPA funding was the politically named Project MAC (Mathematics and Computation) out of MIT. Established by computer scientists Robert Fano and Fernando José Corbató in 1963, by calling the endeavor Project MAC [Fano and Corbató were able to attract researchers from existing labs](https://www.britannica.com/topic/Project-Mac) without anyone's loyalties (or funding) being questioned.


![Robert Fano (left) and Fernando Corbató (right)](/assets/2022/08/jak080.jpg)
<a href="https://www.multicians.org/reunion-04/#g2-22">Robert Fano (left) and Fernando Corbató (right)</a></p></div>

Project MAC had multiple objectives, but its main focus was Corbató's previous work on time-sharing systems. Though many strides in computer hardware and software had been made over the previous decade—the invention of the compiler<sup><a href="#fn3" id="ref3">3</a></sup>, the use of the transistor computer<sup><a href="#fn4" id="ref4">4</a></sup>, and the creation of FORTRAN, LISP, and COBOL<sup><a href="#fn5" id="ref5">5</a></sup>—there were still struggles. Despite all the progress computing had made in the previous decade, compute-time—actually using the computer—remained cumbersome.

For efficiency, batch-processing was used for computation: [decks of punch cards featuring multiple programs were encoded onto magnetic tape](https://www.britannica.com/technology/computer/Time-sharing-and-minicomputers) and fed by an operator into a central computer for iterative processing. But while a computer read the program, [its central processor remained idle: a waste of precious compute-time](http://www.cs.cornell.edu/wya/AcademicComputing/text/earlytimesharing.html). And, if errors occurred in a program itself, then hours had to be taken to debug it by hand.<sup><a href="#fn6" id="ref6">6</a></sup> Even when the code was actually fixed, a program still had to be rewritten onto a new magnetic strip and subsequently rescheduled by an operator for computation. So frustrating was this process that [in 1967 students at Stanford took to producing](https://www.computerhistory.org/revolution/punched-cards/2/211/2253) a humorous (if dated) short film about the matter.

# Sharing Time: Round Robin and Multilevel Scheduling
In recognizing how burdensome compute times were, Corbató laid out his plans for ["the improvement of man-machine interaction by a process called time-sharing"](https://web.archive.org/web/20090906104446/http://larch-www.lcs.mit.edu:8001/~corbato/sjcc62/) in a 1962 paper submitted to the International Federation of Information Processing (IFIP). Like many computer science-related projects of the time, time-sharing was a concept that emerged from military operations. In the late 1950s, the North American Air Defense Command (later known as NORAD) had begun operating a first-of-its-kind network of IBM-manufactured computers connected to near real-time radar data. The Semi-Automatic Ground Environment (SAGE) air-defense system was unique, not only its capacity to detect Soviet missiles, but also [in its ability to programmatically loop through its systems in as little as 2.5 seconds](https://web.stanford.edu/~learnest/nets/timesharing.htm). John McCarthy, a computer scientist from MIT who had seen a prototype of SAGE, was inspired enough to conceptualize a similarly fast system to be used by multiple programmers at once. [In a memo sent out to the MIT community, McCarthy outlined how such a shared-system would work](http://www-formal.stanford.edu/jmc/history/timesharing/timesharing.html). Corbató, picking up the mantle, aimed to make tangible such a system. But, as so often happens with the popular usage of terms in computer science, even trying to communicate what Corbató meant by time-sharing became confusing.<sup><a href="#fn7" id="ref7">7</a></sup> Corabtó explained the multiple meanings of time-sharing in [his 1962 paper](https://web.archive.org/web/20090906104446/http://larch-www.lcs.mit.edu:8001/~corbato/sjcc62/):

>One can mean using different parts of the hardware at the same time for different tasks, or one can mean several persons making use of the computer at the same time. The first meaning, often called multiprogramming, is oriented towards hardware efficiency in the sense of attempting to attain complete utilization of all components. The second meaning of time-sharing, which is meant here, is primarily concerned with the efficiency of persons trying to use a computer.

Unlike the SAGE system which was a feat of multiprogramming, Corbató aimed to make real the latter definition with Project MAC. And, with the wind at their back and ARPA funding in their pockets, Corbató and his colleagues were able to succeed in this, compiling new commercially viable hardware and software systems such that multiple individuals could seamlesly submit code to a central processor. Users would access a mainframe computer remotely via their very own typewriter console. Constantly running in the background would be a multilevel queuing routine which would schedule program calls by priority: determining whether a submitted program was a foreground process or a background process. Once queued, these programs would then be operated by a Round-Robin algorithm<sup><a href="#fn8" id="ref8">8</a></sup> that ran queued programs for set slices of time, in this case approximately .2 seconds, which Corbató estimated was the speed of human reactivity.

An example of the Round-Robin algorithm can be seen in the first chart below. Given a program \\(p\\) that takes \\(t\\) seconds to run, each program is limited to run for a length of time \\(q\\). If \\(t > q\\) then after \\(q\\) seconds \\(p\\) is paused, sent back to the queue with time \\(t := t - q\\) left, and set to continue running once it reaches the head of the queue again. This process continues until all programs in the queue have fully completed. The benefits of the Round-Robin algorithm, and why it was used with the advent of time-sharing computers, was the priority response time took in computing, [where response time is the time difference between when a programmer enters a program into a queue and when it begins to first run.](http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf) Recall that programmers wanted to start their programs as soon as possible in order to reduce CPU idle time. As can be seen, as the slice of time decreases to the left of the x-axis, the number of iterations—or loops through the queue—increase exponentially on the y-axis. As the length of the time slice increases to the right of the x-axis the number of iterations decrease on the y-axis. This is the case for all three different programs of length 10, 35, and 100 seconds.

![](../docs/static/round_robin.png)

![](../docs/static/response_time.png)

<details>
	<summary>Expand for Code</summary>
	<pre>
   <code class="language-python">
# Load Libraries

from timeit import default_timer as timer
from collections import defaultdict
from collections import deque
from typing import Dict
from typing import List
import pandas as pd
import numpy as np

# Plotting
from matplotlib.lines import Line2D
import matplotlib.pyplot as plt
import matplotlib as mpl

mpl.rcParams['figure.dpi'] = 250
#
# Round Robin Simulation
def round_robin_scheduling_sim(p1: List[int], p2: List[int], p3: List[int], time_slice: List[float]) -> Dict[str, List[int]]:
```
Given three programs (p), where each program has a different program length (t),
quantize or time-slice some fixed amount (q) to simulate a round-robin scheduler.
---------------------
Params:
p1,p2,p3: arrays of form [program, program_length, iteration count, response time]

time_slice: length of to run program before continuing in queue
---------
Returns:

program_dictionary: dictionary of program keys and number of iterations given time-slices
```

		# create a list to collect results
		time_slice_results = []

		# for each time slice (q), loop through the round-robin scheduler
		for time_slice in time_slice_list:

				# record time program entered in queue...
				parent_arrival_time = timer()

				# ...into response time position in each list
				p1[3] += parent_arrival_time
				p2[3] += parent_arrival_time
				p3[3] += parent_arrival_time

				# create tuple of structure: program, program_length, iteration count, response time
				program_tuple = [p1, p2, p3]

				# program tuple enters queue
				program_queue = deque(program_tuple)

				# create list to collect short-term results
				result_list = []

				# begin round-robin scheduler: loop while a program is in queue
				while len(program_queue) != 0:

						# access program and unpack tuple
						program, program_length, iteration, arrival_time = program_queue.popleft()

						# if response time has not been calculated, calculate it
						if parent_arrival_time == arrival_time:
								# response time: first-run - arrival time
								arrival_time = timer() - arrival_time

						# run program for length of time-slice, and record results
						program_length = program_length - time_slice

						# if program still has positive value, it is incomplete
						if program_length > 0:
								# record that an iteration has been run
								iteration += 1
								# place unfinished program back into end of queue
								program_queue.append([program, program_length, iteration, arrival_time])

						# if program is zero or negative, it has completed its run-time
						else:
								# record last iteration
								iteration += 1
								# record which program has finished, and iteration count
								result_list.append((program, iteration, arrival_time))

				[[after]] all programs have left queue, record results
				time_slice_results.append(result_list)

				# reset iteration count, arrival time for next run
				p1[2], p1[3] = (0,0)
				p2[2], p2[3] = (0,0)
				p3[2], p3[3] = (0,0)


		# unpack results into single list of tuples
		time_slice_results_single_list = [x for y in time_slice_results for x in y]

		# organize single list into dictionary
		program_dictionary = defaultdict(list)
		for program, iteration, arrival_time in time_slice_results_single_list:
				program_dictionary[program].append([iteration, arrival_time])

		# return dictionary of results
		return program_dictionary


def response_time_simulation(x: int)->plt.Figure:
```
Loop x amount of times through round-robin scheduler,
track response times, and plot average of all x response times,
where average response times:

average response time = sigma {i,n} first-run_i - queue-time_i / n
for each program p
----------------------
Parameters:

x: number of simulations to run
----------------------
Returns:

plt.Figure: plot of simulations
```

# generate 100 different slices (q) between 10 and .5 seconds
time_slice_list = [round(q,2) for q in np.linspace(10, .5, num = 110)]
average_response_list = []
for i in range(1000):
		program_dictionary = round_robin_scheduling_sim(p1=['p1',10,0,0],
																								p2=['p2',35,0,0],
																								p3=['p3',100,0,0],
																								time_slice=time_slice_list)

		average_response = [(x[1] + y[1] + z[1])/3 for x,y,z in zip(program_dictionary['p1'],
																																program_dictionary['p2'],
																																program_dictionary['p3'])]
		average_response_list.append(average_response)

fig, ax = plt.subplots(figsize = [7,3])
ax.plot([x[0] for x in program_dictionary['p1']][::-1], label = 'Program 1')
ax.plot([x[0] for x in program_dictionary['p2']][::-1], label = 'Program 2')
ax.plot([x[0] for x in program_dictionary['p3']][::-1], label = 'Program 3')


custom_lines = [Line2D([0], [0], color='green'),
								Line2D([0], [0], color='orange'),
								Line2D([0], [0], color='blue')]

ax.legend(custom_lines, ['p3: 100 seconds',
												'p2: 35 seconds',
												'p1: 10 seconds',])


plt.xticks(np.arange(0, 110, 10), labels=time_slice_list[==10][==-1])

# remove tick marks
ax.xaxis.set_tick_params(size=0)
ax.yaxis.set_tick_params(size=0)

# change the color of the top and right spines to opaque gray
ax.spines['right'].set_visible(False)
ax.spines['top'].set_visible(False)

# set labels
ax.set_xlabel("Slice Length (seconds)")
ax.set_ylabel("# Iterations")

# alter axis labels
xlab = ax.xaxis.get_label()
ylab = ax.yaxis.get_label()

xlab.set_size(10)
ylab.set_size(10)

# title
ax.set_title("Round-Robin Scheduling")
ttl = ax.title
ttl.set_weight('bold')

if __name__ == "__main__":
	response_time_simulation(1000)
</details>
 </code>
</pre>

<div>
<p></p>
</div>

For programmers who wanted their programs running as soon as possible, the usefulness of the Round-Robin scheduler can be seen in the response time chart above. Just as before, the x-axis represents the measure of different periods of time programs are run for before being paused and re-queued. The y-axis, however, now represents the average response time \\(r_t\\) of all programs: where average response time is the difference between when a program is entered into the queue \\(p_q\\) and when it first begins to run \\(p_r\\). Together, the variables form the equation below:

$$\bar{r_t}=\frac{\sum_{i=1}^n p_r^i - p_q^i}{n}$$

Notably, programs initially placed at the end of the queue will by definition have longer response times than those initially placed at the front of the queue if these programs are submitted at the same time. So, even if two progams are comparatively similar, their response times may differ. Not only that, but by using the Round-Robin algorithm with shorter time slices, submitted programs would be iterated over more frequently, as seen in the first chart. Despite this increase, time-sharing still allowed for a lower average response time for submitted programs compared to their pre-time-sharing alternatives, as seen in the second chart. Said another way, the difference between the exponential rise in average response times to the far-right of chart and the low response times to the far-left illustrates the significance of time-sharing before and after its invention.

# From Time-Sharing to the Personal Computer to Cloud Computing?

Of course, the simulations shown above are simplifications. For one thing, the hardware that ran these simulations—a simple Macbook pro—is far more powerful than anything that was available at the time of Project MAC. Omitted completely has been any mention of other extraneous factors such as the cost of context switching, which can overwhelm computers if time slices are set too short. In other words, unlike the charts above, in reality [there is a lower-bound on the efficiency of short-duration time slices.](http://pages.cs.wisc.edu/~remzi/OSTEP/cpu-sched.pdf) Finally, and as Corbató readily admitted, as more individuals used a system at once or if programs became more complex, response times would be negatively affected. Both factors that were sure to increase with time.

![](../docs/static/Nordhaus_computing_power.png)

Diseconomies of scale and program complexity were, in part, contributing factors into why time-sharing computers did not become ubiquitous. But they were not the sole reason. As computer prices declined and processing power improved, it became more feasible for individuals to simply access their own computers, with their own CPU's, to run their programs. As the chart above indicates from William Nordhaus' illuminating 2007 paper, [Two Centuries of Productivity Growth in Computing](http://www.econ.yale.edu/~nordhaus/homepage/homepage/nordhaus_computers_jeh_2007.pdf), computing power since the mid-19th century—if expanded to include manual computational power—was, per second, increasing rapidly in the 1960s.<sup><a href="#fn9" id="ref9">9</a></sup> More specifically, by indexing manual computation to 1 computation per second (generous), the chart plots all other means of computation per second relative to that 1. By the 1960s, for example, computing power was approximately 1 million times greater than the index at 1850. In the decades to come, that computational power would only increase.

The second chart, seen below, depicts the cost of _millions_ of computations per second, weighed by a 2006 GDP price index. Beginning in 1850, Nordhaus estimated a cost of approximately $500 per million computations by hand. By the 1960s, the cost per million computations by computer declined to \\(\frac{1}{50,000}\\) the cost of manual computation. By 2006, the computation cost of computers would decline by a factor of 7 trillion. That is to say, the best computers in 2006 were 7 trillion times less costly per million computations compared to the manual-based index.

![](../docs/static/Nordhaus_Cost_per_Computation.png)

So, computing costs became cheap, and as they cheapened, the need to share resources became less pressing and time-sharing became less commercially prominent...but not forever. As with so many great ideas, time-sharing had other applications amenable to our modern needs—needs that Corbató himself anticipated. In his 1962 IFIP paper, Corbató expounded upon the many benefits to time-sharing. Prominent in the paper was his suggestion that time-sharing had ["numerous applications in business and in industry where it would be advantageous to have powerful computing facilities available at isolated locations with only the incremental capital investment of each console."](https://web.archive.org/web/20090906104446/http://larch-www.lcs.mit.edu:8001/~corbato/sjcc62/)

Today, despite the affordability of conducting millions of computations per second on a personal computer, there are still computationally intensive algorithms and Big Data operations that businesses want to engage in. In order to do so, it can make sense for these businesses to engage in cloud-computing, which, in essence, is the rental of severs of virtual machines at isolated data warehouses for the processing of these computationally intensive operations. Although not 1-to-1, cloud computing very much relies on the precedent set by Corbató's time-sharing work, and in particular the idea that multiple users could queue programs at will to a computer for processing.

We have Corbató's work on time-sharing to thank for the ability to process for much of the cloud in data science today—espcially when it comes to processing our work in the cloud on clusters of computers. As someone who was trained in economics, rather than computer science, I'd never heard this story and thought it fascinating enough to share. But after doing this research, I've also been left with some important questions—questions such as how much progress in computer science is due to investments by the military? I'm also very much planning on researching the economics of cloud computing, and hope to post more about this research soon.

<p id="fn1" >[1]: This was supposed to be a post where I showed people how to run cron jobs. Instead, it's looking like it will be a multi-part post about the interdisciplinary aspects of computer science. If you're still interested in seeing that cron code, I will embed a link to that post at the to p once it is done.<a href="#ref1">↩</a></p>
<p><a id="fn2" >[2]: ARPA would be <a href="https://www.britannica.com/topic/Defense-Advanced-Research-Projects-Agency">renamed</a> the more familiarly-named DARPA (Defense Advanced Research Projects Agency in the 1970s.<a href="#ref2">↩</a></p>
<p id="fn3" >[3]: There are different types of compilers, but generally compilers take one programming language, usually a computer's base-language, and "compile" or translate that language into another language with its own requisite benefits and costs.<a href="#ref3">↩</a></p>
<p id="fn4" >[4]: The transistor computer followed the vacuum-tube based computers and could therefore considered the "second generation" of computers.<a href="#ref4">↩</a></p>
<p id="fn5" >[5]: FORTRAN, LISP, and COBOL are examples of some of the first and compiled languages.<a href="#ref5">↩</a></p>
<p id="fn6" >[6]: Debugging could have been done on computers, but that would have been considered a waste of compute-time as well.<a href="#ref6">↩</a></p>
<p id="fn7" >[7]: So jumbled was the concept at the time that years later Stanford Professor Donald Knuth would reach out to computer scientist Christopher Strachey to figure out who had created what. ![Origin of Time Sharing](/assets/2022/08/origin_of_time_sharing.png)<a href="#ref7">↩</a></p>
<p id="fn8" >[8]: The first Round-Robin reference, if not analysis, researches have found was in paper published in a Navy guidebook by Leonard Kleinrock <a href="https://books.google.com/books?hl=en&lr=&id=svrkb7YPMR0C&oi=fnd&pg=PA59&ots=SyCCUcsvZp&sig=5hZK3vpjaowOMaxNEQi2C2jwnCA#v=onepage&q&f=false"></a>.<a href="#ref8">↩</a></p>
<p id="fn9" >[9]: The large circles represent computaional systems with relatively reliable measurements, the smaller circles were not verified at the time of publication.<a href="#ref9">↩</a></p>

<script type="text/javascript" async

src="https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML">
5:["$","$L13",null,{"children":["$","div",null,{"className":"blog-container","children":[["$","$L14",null,{"posts":[{"slug":"adding-text-to-speech-to-your-blog-openai-tts-pipeline","title":"Adding Text-to-Speech to Your Blog: Building an OpenAI TTS Pipeline with Smart Chunking and AWS S3","date":"$D2025-06-29T00:00:00.000Z","summary":"A technical deep-dive into building a production-ready text-to-speech pipeline for blog posts using OpenAI's TTS API, smart text processing with NLP, automatic chunking for long content, and AWS S3 for scalable audio hosting.","tags":["OpenAI","TTS","AWS","S3","React","NLP","Audio","FFmpeg","Node.js"],"content":"$15","coverImage":"/assets/2025/06/tts-front-matter.png","readingTime":8},{"slug":"extending_\"GPTs_Are_GPTs\"_to_Firms","title":"Extending 'GPTs Are GPTs' to Firms","date":"$D2025-06-02T00:00:00.000Z","summary":"A new paper on the impact of AI on labor demand at the firm level.","tags":["AI","Economics","Labor","Productivity","GPTs"],"content":"$16","coverImage":"$undefined","readingTime":3},{"slug":"host-your-own-private-llm-access-it-from-anywhere","title":"Host Your Own Local LLM / RAG Behind a Private VPN, Access It From Anywhere","date":"$D2025-01-06T00:00:00.000Z","summary":"A step-by-step guide on hosting your own private Large Language Model and RAG system using Synology, Tailscale, Caddy, and Ollama—all protected behind a lightweight VPN and accessible anywhere.","tags":["LLM","RAG","Synology","Ollama","Caddy","Tailscale","self-hosting","reverse proxy","VPN"],"content":"$17","coverImage":"$undefined","readingTime":18},{"slug":"2024-year-in-review","title":"2024: My Year In Review — AI, Archery, and Goals","date":"$D2024-12-31T00:00:00.000Z","summary":"Reflections on a year of growth, experimentation, and resilience—covering professional wins, personal pursuits like archery and lifting, and the challenges of navigating health setbacks. Plus, my goals for 2025.","tags":["year in review","LLMs","archery","health","personal growth","AI"],"content":"$18","coverImage":"$undefined","readingTime":7},{"slug":"2023-my-year-in-review","title":"2023: My Year In Review","date":"$D2023-12-30T00:00:00.000Z","summary":"A reflection on a year of growth, gratitude, teaching, travel, and paying off the final student loan. Here’s what I accomplished in 2023 and what I’m hoping to do in 2024.","tags":["year in review","student loans","teaching","travel","machine learning","LLMs","writing"],"content":"$19","coverImage":"$undefined","readingTime":5},{"slug":"what_are_ai_agents_an_introduction","title":"What Are AI Agents? An Introduction to AI Agents and LLMs","date":"$D2023-11-27T00:00:00.000Z","summary":"I wrote a book for O'Reilly Media about AI agents and LLMs, exploring what they are, how they're different from traditional AI, and when to use them. The report breaks down these concepts in an approachable way for newcomers to the field.","tags":["AI","LLM","Agents","Machine Learning","Technology"],"content":"$1a","coverImage":"$undefined","readingTime":2},{"slug":"publishing_for_oreilly","title":"Publishing for O'Reilly","date":"$D2023-11-13T00:00:00.000Z","summary":"A reflection on the upcoming release of 'What Are AI Agents?' and the significance of joining the ranks of O'Reilly authors—a milestone shaped by library visits, borrowed books, and years of persistence.","tags":["O'Reilly","AI Agents","Machine Learning","Career Journeys","Publishing"],"content":"$1b","coverImage":"$undefined","readingTime":3},{"slug":"I_paid_off_194k_in_student_loans_in_six_years._it_wasn't_easy","title":"I Paid Off $194k in Student Loans in Six Years. It Wasn’t Easy.","date":"$D2023-07-24T00:00:00.000Z","summary":"I graduated with $150k in debt and paid back over $194k in six years. This is the story of how I got there, what I learned, and what came next.","tags":["student loans","debt payoff","financial independence","machine learning","career","economics"],"content":"$1c","coverImage":"$undefined","readingTime":41},{"slug":"on_the_death_of_a_friend","title":"I Waited 9 Years to Write This: On The Death of a Friend","date":"$D2023-01-31T00:00:00.000Z","summary":"On the ninth anniversary of Sarah McCausland’s passing, a reflection on grief, memory, and the enduring questions that follow the loss of a friend taken too soon.","tags":["Personal","Grief","Loss","Friendship","Reflection","Memory"],"content":"$1d","coverImage":"$undefined","readingTime":11},{"slug":"2022_reflection","title":"2022: My Year in Review","date":"$D2022-12-31T00:00:00.000Z","summary":"A personal recap of the milestones, memories, and goals that shaped 2022—from paying off loans and co-organizing NormConf to hiking Sequoia and building a PC—with a look ahead to ambitions for 2023.","tags":["Year in Review","Personal Goals","Startup Life","NormConf","2022 Reflection"],"content":"$1e","coverImage":"$undefined","readingTime":5}]}],["$","$L1f",null,{"posts":["$5:props:children:props:children:0:props:posts:0","$5:props:children:props:children:0:props:posts:1","$5:props:children:props:children:0:props:posts:2","$5:props:children:props:children:0:props:posts:3","$5:props:children:props:children:0:props:posts:4","$5:props:children:props:children:0:props:posts:5","$5:props:children:props:children:0:props:posts:6","$5:props:children:props:children:0:props:posts:7","$5:props:children:props:children:0:props:posts:8","$5:props:children:props:children:0:props:posts:9",{"slug":"building_an_https_model_apI_for_cheap","title":"Building an HTTPS Model API for Cheap: A Step-by-Step Guide to Deploying APIs to AWS on Your Own Domain","date":"$D2022-12-15T00:00:00.000Z","summary":"A straight-to-the-point guide for deploying a Dockerized FastAPI app on AWS using ECS, ECR, Route 53, and an Application Load Balancer—ideal for developers looking to get an HTTPS API live without overspending or overengineering.","tags":["AWS","Docker","ECS","ECR","FastAPI","DevOps","Cloud Infrastructure"],"content":"$20","coverImage":"$undefined","readingTime":10},{"slug":"github_ssh_and_1password","title":"The *Right* Way to Maintain Multiple GitHub Accounts Using 1Password's SSH Key Agent","date":"$D2022-08-22T00:00:00.000Z","summary":"A walkthrough for managing multiple GitHub accounts with 1Password's SSH key integration, covering common pitfalls and offering a cleaner setup than the official docs.","tags":["SSH","GitHub","1Password","Developer Tooling","Multi-Account Setup"],"content":"$21","coverImage":"$undefined","readingTime":4},{"slug":"legacy_naming_conventions_are_holding_us_back","title":"Legacy Naming Conventions Are Holding Us Back","date":"$D2021-12-08T00:00:00.000Z","summary":"A case for naming internal services with intention—favoring names that are intuitive, easy, and specific over clever or obscure references. A little clarity can go a long way in reducing cognitive overhead and improving team communication.","tags":["Service Design","Developer Experience","Naming Conventions","Engineering Culture","Internal Tools"],"content":"$22","coverImage":"$undefined","readingTime":5},{"slug":"pandas_functions_advanced_groupbys_with_grouper_assign_and_query","title":"Pandas Functions: Advanced Groupbys with Grouper, Assign, and Query","date":"$D2021-06-26T00:00:00.000Z","summary":"A technical walkthrough on advanced uses of Pandas groupbys, showcasing time-based aggregations, lambda expressions, and inline data manipulation with assign, all framed around real-world Covid19 data.","tags":["Pandas","Groupby","Python","Data Science","Time Series","Covid19"],"content":"$23","coverImage":"$undefined","readingTime":7},{"slug":"on_the_origin_of_time_sharing_computers_round_robin_algorithms_and_cloud_computing","title":"On the Origin of Time-Sharing Computers, Round-Robin Algorithms, and Cloud Computing","date":"$D2020-08-30T00:00:00.000Z","summary":"An exploration of time-sharing's origins—from Cold War military investments and Project MAC to the round-robin algorithm—and how these foundational ideas helped shape cloud computing as we know it.","tags":["Time-Sharing","Computer History","Cloud Computing","ARPA","Round-Robin","Economics of Computing"],"content":"$24","coverImage":"$undefined","readingTime":16}]}],["$","$L25",null,{}]]}]}]
8:null
c:[["$","meta","0",{"charSet":"utf-8"}],["$","meta","1",{"name":"viewport","content":"width=device-width, initial-scale=1"}]]
7:null
a:{"metadata":[["$","title","0",{"children":"Economic Notes - Exploring Economics, Technology, and Life"}],["$","meta","1",{"name":"description","content":"A blog about economics, technology, and personal experiences."}],["$","meta","2",{"name":"author","content":"Benjamin Labaschin"}],["$","link","3",{"rel":"manifest","href":"/manifest.json","crossOrigin":"$undefined"}],["$","meta","4",{"name":"keywords","content":"economics,technology,AI,machine learning,blog"}],["$","meta","5",{"property":"og:title","content":"Economic Notes"}],["$","meta","6",{"property":"og:description","content":"A blog about economics, technology, and personal experiences."}],["$","meta","7",{"property":"og:url","content":"https://econoben.dev"}],["$","meta","8",{"property":"og:site_name","content":"Economic Notes"}],["$","meta","9",{"property":"og:locale","content":"en_US"}],["$","meta","10",{"property":"og:type","content":"website"}],["$","meta","11",{"name":"twitter:card","content":"summary_large_image"}],["$","meta","12",{"name":"twitter:title","content":"Economic Notes"}],["$","meta","13",{"name":"twitter:description","content":"A blog about economics, technology, and personal experiences."}]],"error":null,"digest":"$undefined"}
12:{"metadata":"$a:metadata","error":null,"digest":"$undefined"}
