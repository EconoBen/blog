# Image Management System

This project uses an automated image optimization system that preserves high-quality originals while serving optimized versions.

## Quick Start

### Adding a New Image

```bash
# Method 1: Use the helper script
npm run add-image ~/Desktop/photo.jpg 2025/01/my-photo.jpg

# Method 2: Manual
cp ~/Desktop/photo.jpg public/assets/originals/2025/01/my-photo.jpg
npm run optimize-images
```

### How It Works

1. **Original images** are stored in `public/assets/originals/`
   - These are git-tracked (preserved in repository)
   - Excluded from Vercel deployment (via .vercelignore)
   - Can be any size (12MB, 50MB, etc.)

2. **Optimized versions** are generated in `public/assets/year/month/`
   - Multiple sizes: 150px, 300px, 768px, 1024px, 1536px, 2048px
   - WebP format for better compression
   - JPEG quality: 85%, PNG compression: Level 9

3. **Automatic optimization** runs during:
   - `npm start` (development)
   - `npm run build` (production)
   - `npm run optimize-images` (manual)

## Example

Your 12MB image:
- **Original**: `public/assets/originals/2025/01/niece_and_I.jpeg` (12MB)
- **Optimized outputs**:
  - `niece_and_I-150.jpeg` (11KB) - Thumbnail
  - `niece_and_I-300.jpeg` (36KB) - Small
  - `niece_and_I-768.jpeg` (181KB) - Medium
  - `niece_and_I-1024.jpeg` (297KB) - Medium-large
  - `niece_and_I-1536.jpeg` (561KB) - Large
  - `niece_and_I.jpeg` (871KB) - Full size (max 2048px)
  - `niece_and_I.webp` (457KB) - WebP version

## Migrating Existing Large Images

If you have existing large images in your assets:

```bash
# Find and migrate images over 5MB
node scripts/migrate-existing-images.js --yes
```

## Best Practices

1. **Always add originals** to the originals directory
2. **Never edit optimized versions** - they'll be regenerated
3. **Use descriptive filenames** without spaces
4. **Follow the year/month structure** for organization

## Responsive Images in React

When using images in your React components:

```jsx
<picture>
  <source 
    type="image/webp" 
    srcSet="/assets/2025/01/photo.webp" 
  />
  <img 
    src="/assets/2025/01/photo-768.jpeg"
    srcSet="/assets/2025/01/photo-300.jpeg 300w,
            /assets/2025/01/photo-768.jpeg 768w,
            /assets/2025/01/photo-1024.jpeg 1024w,
            /assets/2025/01/photo-1536.jpeg 1536w"
    sizes="(max-width: 640px) 100vw, 
           (max-width: 1024px) 50vw, 
           33vw"
    alt="Description"
  />
</picture>
```

## Troubleshooting

- **Images not optimizing**: Run `npm run optimize-images` manually
- **Missing dependencies**: Run `npm install`
- **Permission errors**: Check file permissions in originals directory