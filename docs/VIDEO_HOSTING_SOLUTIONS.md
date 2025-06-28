# Video Hosting Solutions for Your Blog

Since Vercel has file size limits, here are the best ways to handle videos:

## Option 1: YouTube or Vimeo (Recommended)
Upload videos to YouTube/Vimeo and embed them:

```markdown
<!-- YouTube -->
<iframe width="560" height="315" src="https://www.youtube.com/embed/VIDEO_ID" frameborder="0" allowfullscreen></iframe>

<!-- Or use markdown image syntax with YouTube thumbnail -->
[![Video Title](https://img.youtube.com/vi/VIDEO_ID/maxresdefault.jpg)](https://www.youtube.com/watch?v=VIDEO_ID)
```

## Option 2: Cloudinary (Free tier available)
1. Sign up at https://cloudinary.com
2. Upload your videos
3. Get the URL and use it directly:

```html
<video controls width="100%">
  <source src="https://res.cloudinary.com/YOUR_CLOUD_NAME/video/upload/v1234567890/video-name.mp4" type="video/mp4">
</video>
```

## Option 3: GitHub Releases
1. Create a release in your GitHub repo
2. Upload videos as release assets
3. Use the direct URL:

```html
<video controls width="100%">
  <source src="https://github.com/EconoBen/blog/releases/download/v1.0/video.mp4" type="video/mp4">
</video>
```

## Option 4: Vercel Blob Storage (Paid)
Vercel offers blob storage for large files:
- https://vercel.com/docs/storage/vercel-blob

## Option 5: AWS S3 or Google Cloud Storage
Set up a bucket and serve videos from there.

## Quick Fix for Your Current Videos

1. **For Sarah's videos**, since they're memorial videos, I recommend:
   - Upload to YouTube as "Unlisted" (only people with link can view)
   - Or use GitHub Releases to preserve them with your code

2. **Update your post**:
   Replace:
   ```markdown
   [](https://benjaminlabaschin.com/wp-content/uploads/2023/01/Sarah_SomebodyLikeYou.mp4)
   ```
   
   With:
   ```html
   <video controls width="100%" style="max-width: 600px;">
     <source src="HOSTED_URL_HERE" type="video/mp4">
     Your browser does not support the video tag.
   </video>
   ```

## Immediate Solution

Let me create a script to help you move videos to GitHub Releases: