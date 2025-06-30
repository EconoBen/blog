# Social Media Preview Setup

## Current Implementation

I've added React Helmet to dynamically set Open Graph meta tags for each blog post. This includes:
- Post title
- Post description/summary
- Post URL
- Article metadata (author, publish date, tags)

## Important Limitations

**React Helmet alone won't work for LinkedIn/Twitter previews!** Social media crawlers don't execute JavaScript, so they won't see the dynamically added meta tags.

## Solutions for Working Social Previews

### Option 1: Server-Side Rendering (Recommended)
Convert to Next.js or Remix for proper SSR/SSG:
- Next.js can statically generate pages at build time
- Meta tags will be in the initial HTML
- Best for SEO and social previews

### Option 2: Prerendering Service
Use a service like:
- Prerender.io
- Rendertron
- Netlify's prerendering feature

These services render your pages server-side when social media bots visit.

### Option 3: Static Meta Tags (Limited)
Add static Open Graph tags to your index.html, but these won't be post-specific.

### Option 4: Build-Time Generation
Generate static HTML files for each post during build with proper meta tags.

## Next Steps

1. **Add a default Open Graph image**: Create and upload an image at `/public/og-default.png`
2. **Consider post-specific images**: Add an `image` field to your post frontmatter
3. **Choose a solution above** for proper social media preview support

## Testing Your Previews

Use these tools to test:
- LinkedIn Post Inspector: https://www.linkedin.com/post-inspector/
- Facebook Sharing Debugger: https://developers.facebook.com/tools/debug/
- Twitter Card Validator: https://cards-dev.twitter.com/validator

## Current Meta Tags Structure

The meta tags are now set up in `PostDetail.tsx` but need one of the above solutions to actually work on social media.