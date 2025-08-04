# Deployment Guide for Economic Notes Blog (Next.js)

## Deploying to Vercel

### Prerequisites
1. A Vercel account (sign up at https://vercel.com)
2. Vercel CLI installed: `npm i -g vercel`
3. Environment variables ready (see below)

### Environment Variables Required
You'll need to set these in Vercel's dashboard or via CLI:

- `OPENAI_API_KEY` - Your OpenAI API key for TTS and content generation
- `AWS_REGION` - AWS region for S3 bucket (e.g., us-east-1)
- `AWS_ACCESS_KEY_ID` - AWS access key with S3 permissions
- `AWS_SECRET_ACCESS_KEY` - AWS secret key
- `S3_BUCKET_NAME` - Name of your S3 bucket for audio files
- `GITHUB_TOKEN` - GitHub personal access token for fetching gists
- `NEXT_PUBLIC_SITE_URL` - Your production URL (e.g., https://economicnotes.com)

### Deployment Steps

#### Option 1: Deploy via Vercel Dashboard
1. Push your code to GitHub
2. Go to https://vercel.com/new
3. Import your GitHub repository
4. Configure environment variables in the dashboard
5. Click "Deploy"

#### Option 2: Deploy via CLI
1. Run `vercel` in the project directory
2. Follow the prompts to link your project
3. Set environment variables:
   ```bash
   vercel env add OPENAI_API_KEY
   vercel env add AWS_REGION
   vercel env add AWS_ACCESS_KEY_ID
   vercel env add AWS_SECRET_ACCESS_KEY
   vercel env add S3_BUCKET_NAME
   vercel env add GITHUB_TOKEN
   ```
4. Deploy to production: `vercel --prod`

### Post-Deployment Tasks

1. **Update DNS**: Point your domain to Vercel's servers
2. **Test all routes**: Verify all pages load correctly
3. **Check API endpoints**: Test search, TTS, and OpenAI endpoints
4. **Verify assets**: Ensure images and audio files load properly
5. **Test mobile responsiveness**: Check on various devices
6. **Monitor performance**: Use Vercel Analytics

### Build Optimization

The project includes several optimizations:
- Image optimization with Sharp (skipped on Vercel to avoid issues)
- Post-build cleanup to remove large files
- Static generation for blog posts and tags
- API route caching headers

### Troubleshooting

**Build fails with Sharp error**: 
- The `optimize-images.js` script automatically skips on Vercel

**Environment variables not working**:
- Ensure they're set for the correct environment (preview/production)
- Rebuild after adding new env vars

**Large build size**:
- The post-build cleanup script removes video files and originals
- Consider using Vercel's Image Optimization API instead of storing images

**API routes returning 500**:
- Check Vercel Functions logs in the dashboard
- Verify all environment variables are set correctly

### Monitoring

After deployment:
1. Enable Vercel Analytics for performance monitoring
2. Set up error tracking (e.g., Sentry)
3. Monitor API usage, especially OpenAI credits
4. Track S3 bandwidth usage

### Continuous Deployment

With GitHub integration:
- Main branch deploys to production
- Pull requests create preview deployments
- Use `vercel.json` for consistent configuration