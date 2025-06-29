# Audio Setup Guide

This guide explains how to set up text-to-speech functionality for your blog posts using OpenAI's TTS API and AWS S3.

## Prerequisites

1. **OpenAI API Key**: Get your API key from [OpenAI Platform](https://platform.openai.com/)
2. **AWS Account**: For S3 storage
3. **AWS CLI**: Configured with proper credentials

## Setup Steps

### 1. Environment Variables

Set the following environment variables:

```bash
export OPENAI_API_KEY="your-openai-api-key"  # or OPENAI_TOKEN
export AWS_REGION="us-west-2"  # or your preferred region
export S3_AUDIO_BUCKET="your-bucket-name"  # e.g., "blog-audio-files"
```

### 2. Create S3 Bucket

Create an S3 bucket for storing audio files:

```bash
aws s3 mb s3://your-bucket-name --region us-west-2
```

Configure the bucket for public read access (for audio playback):

```bash
aws s3api put-bucket-policy --bucket your-bucket-name --policy '{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Sid": "PublicReadGetObject",
      "Effect": "Allow",
      "Principal": "*",
      "Action": "s3:GetObject",
      "Resource": "arn:aws:s3:::your-bucket-name/audio/*"
    }
  ]
}'
```

### 3. Generate Audio Files

Run the audio generation script:

```bash
npm run generate-audio
```

This will:
- Read all markdown files from `src/posts/`
- Extract text content (removing code blocks, images, etc.)
- Generate audio using OpenAI's TTS API
- Save MP3 files to `public/audio/`
- Cache results to avoid regenerating unchanged content

### 4. Upload to S3

Upload generated audio files to S3:

```bash
npm run upload-audio
```

This will:
- Upload all audio files to S3
- Skip files that haven't changed
- Generate `src/config/audioManifest.json` with URLs

### 5. Process All Audio (Combined)

Run both steps at once:

```bash
npm run process-audio
```

## Configuration

### TTS Settings

Edit `scripts/generate-audio.js` to change:
- **Voice**: Choose from `alloy`, `echo`, `fable`, `onyx`, `nova`, `shimmer`
- **Model**: `tts-1` (faster) or `tts-1-hd` (higher quality)
- **Speed**: 0.25 to 4.0 (default: 1.0)

### Audio Player

The audio player appears automatically on posts that have audio files. It includes:
- Play/pause controls
- Progress bar with seeking
- Time display
- Playback speed control (1x, 1.25x, 1.5x, 1.75x, 2x)

## Costs

OpenAI TTS pricing (as of 2024):
- **tts-1**: $0.015 per 1,000 characters
- **tts-1-hd**: $0.030 per 1,000 characters

AWS S3 costs:
- Storage: ~$0.023 per GB per month
- Bandwidth: ~$0.09 per GB transferred

## Troubleshooting

### "Post not found" errors
- Ensure post slugs match exactly between markdown files and audio files
- Check `src/config/audioManifest.json` for correct mappings

### Audio not playing
- Verify S3 bucket policy allows public read access
- Check browser console for CORS errors
- Ensure audio URLs in manifest are correct

### Rate limiting
- The script adds 1-second delays between API calls
- For large blogs, you may need to increase delays or batch processing

### Large posts (>4096 characters)
- Posts are automatically split into chunks
- Currently only the first chunk is used (manual concatenation required)
- Consider using ffmpeg to join audio chunks

## Maintenance

### Regenerate specific posts
1. Delete the post entry from `.audio-cache.json`
2. Run `npm run generate-audio`

### Clear all cache
```bash
rm .audio-cache.json .s3-upload-cache.json
```

### Update all audio files
1. Clear cache files
2. Run `npm run process-audio`

## Important Notes

- **Disclosure Required**: OpenAI requires clear disclosure that the voice is AI-generated
- **Character Limit**: Maximum 4,096 characters per request
- **File Size**: Audio files are ~1MB per 10 minutes of speech
- **Caching**: Audio is cached for 1 year on S3 (configure in upload script)