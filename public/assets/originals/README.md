# Original Images Directory

This directory stores high-quality original images that are:
- **Git-tracked** (preserved in your repository)
- **Excluded from Vercel deployment** (via .vercelignore)

## How to Use

### Adding a New Image

1. **Manual Method:**
   ```bash
   # Copy your image to the appropriate year/month folder
   cp ~/Desktop/my-photo.jpg public/assets/originals/2025/01/my-photo.jpg
   
   # Run optimization
   npm run optimize-images
   ```

2. **Using Helper Script:**
   ```bash
   npm run add-image ~/Desktop/my-photo.jpg 2025/01/my-photo.jpg
   ```

### Directory Structure

```
originals/
├── 2025/
│   ├── 01/
│   │   ├── niece_and_I.jpeg (12MB original)
│   │   └── other-image.jpg
│   └── 02/
│       └── february-photo.png
└── README.md
```

### Automatic Optimization

When you run `npm start` or `npm run build`, the optimization script will:
1. Scan this originals directory
2. Generate multiple optimized versions in `public/assets/year/month/`
3. Create responsive image sizes: 150px, 300px, 768px, 1024px, 1536px, and 2048px
4. Generate WebP versions for better compression

### File Size Guidelines

- Original images can be any size (they won't be deployed)
- Optimized versions are automatically compressed
- JPEG quality: 85%
- PNG compression: Level 9
- WebP quality: 85%

### Important Notes

- This directory is excluded from Vercel deployment
- Always commit your originals to Git for preservation
- The optimization script runs automatically during build
- Optimized images go to `public/assets/year/month/` (not in originals)