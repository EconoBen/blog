# Ben Labaschin's Blog

A modern, responsive blog built with React, TypeScript, and Markdown. Features a mobile-first design, dark mode, visual regression testing, and automated image optimization.

## 🚀 Quick Start

```bash
# Initial setup
make setup

# Start development server (port 3001)
make dev

# Open visual regression tests
make test-visual
```

## 📱 Features

### Core Features
- **Markdown-based blog posts** with frontmatter support
- **Responsive design** optimized for all devices
- **Dark mode** with system preference detection
- **Full-text search** across all posts
- **Tag system** for categorizing content
- **Archive view** organized by month
- **Publications page** with PDF thumbnails
- **Talks page** with embedded videos
- **About page** with personal information

### Mobile Experience
- **Touch-optimized** navigation and search
- **Scroll-based navigation hiding** for better reading experience
- **Bottom navigation bar** for easy access on mobile
- **iPad-specific optimizations** for search and layout
- **Android device support** with proper touch targets

### Performance & Optimization
- **Automatic image optimization** with multiple sizes and WebP format
- **PDF thumbnail generation** for publications
- **Lazy loading** for images and content
- **Visual regression testing** for multiple device sizes
- **Build-time post compilation** for fast page loads

## 🛠️ Technology Stack

- **Frontend**: React 19, TypeScript, React Router
- **Styling**: CSS with mobile-first approach
- **Content**: Markdown with gray-matter frontmatter
- **Build**: Create React App with Craco
- **Deployment**: Vercel
- **Image Processing**: Sharp
- **PDF Processing**: pdf-poppler
- **Analytics**: Vercel Analytics

## 📂 Project Structure

```
blog/
├── public/
│   ├── assets/           # Optimized images
│   │   └── originals/    # Original high-quality images
│   └── posts/            # PDF publications
├── src/
│   ├── components/       # React components
│   ├── posts/           # Markdown blog posts
│   ├── styles/          # CSS files
│   ├── hooks/           # Custom React hooks
│   ├── utils/           # Utility functions
│   └── services/        # Data services
├── scripts/             # Build and utility scripts
├── tests/              # Visual regression tests
└── docs/               # Documentation
```

## 🔧 Development

### Using Make Commands

We use a Makefile for common tasks. Run `make help` to see all available commands:

```bash
# Development
make dev              # Start development server
make dev-full         # Start with all preprocessing
make build            # Build for production
make serve            # Serve production build locally

# Testing
make test             # Run tests
make test-visual      # Open visual regression tests
make lint             # Run ESLint
make typecheck        # TypeScript type checking

# Deployment
make deploy           # Deploy to Vercel preview
make deploy-prod      # Deploy to production
make pre-deploy       # Run all checks before deployment

# Maintenance
make process-images   # Optimize images
make process-pdfs     # Generate PDF thumbnails
make clean            # Clean build artifacts
make reset            # Full reset (clean + reinstall)
```

### Manual Commands

If you prefer npm scripts:

```bash
npm start             # Start development server
npm run build         # Build for production
npm test              # Run tests
npm run optimize-images  # Process images
npm run process-pdfs     # Process PDFs
```

## 📸 Working with Images

### Adding Images

1. **Using the Makefile** (recommended):
   ```bash
   make add-image IMG=~/Desktop/photo.jpg YEAR=2025 MONTH=01
   ```

2. **Manual process**:
   - Add original images to `public/assets/originals/YYYY/MM/`
   - Run `make process-images` to generate optimized versions

### Image Optimization

The system automatically creates:
- Multiple sizes (150px, 300px, 768px, 1024px, 1536px, 2048px)
- WebP format for modern browsers
- Optimized JPEG with 85% quality
- Preserves originals in `public/assets/originals/`

## 📝 Writing Blog Posts

1. Create a new `.md` file in `src/posts/`
2. Add frontmatter:
   ```markdown
   ---
   title: "Your Post Title"
   date: "2025-01-15"
   tags: ["tag1", "tag2"]
   summary: "Brief description"
   coverImage: "/assets/2025/01/image.jpg" (optional)
   ---
   
   Your content here...
   ```

3. Run `npm start` - the post will be automatically imported

### Supported Markdown Features
- Standard Markdown syntax
- GitHub Flavored Markdown
- Raw HTML support
- Code blocks with syntax highlighting
- Images with captions
- Tables
- Task lists

## 🧪 Visual Regression Testing

Test the blog across multiple devices:

```bash
# Start dev server first
make dev

# In another terminal, open tests
make test-visual
```

### Tested Devices
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- Samsung Galaxy S21 (360x800)
- Google Pixel 5 (393x851)
- iPad (768x1024)
- iPad Pro 11" (834x1194)
- Android Tablet (768x1024)
- Desktop (1200x800)

### Test Features
- Horizontal overflow detection
- Touch target size validation
- Text readability checks
- Search functionality testing
- Fixed positioning issues
- Android-specific requirements

## 🚀 Deployment

### Preview Deployment

```bash
make deploy
```

This creates a preview URL for testing changes.

### Production Deployment

```bash
# Run all checks first
make pre-deploy

# If everything passes
make deploy-prod
```

### Environment Variables

Create a `.env` file:

```env
FAST_REFRESH=false
PORT=3001
```

### Vercel Configuration

The `.vercelignore` file excludes:
- Large video files
- Original unoptimized images
- Test files
- Backup files

## 🎨 Customization

### Styling

- **Main styles**: `src/index.css`
- **Mobile styles**: `src/styles/mobile.css`
- **Mobile search**: `src/styles/mobile-search-fixes.css`
- **Responsive**: `src/styles/responsive.css`

### Configuration

- **Blog config**: `src/config/blogConfig.ts`
- **Publications**: `src/config/publicationsConfig.ts`
- **Talks**: `src/config/talksConfig.ts`

### Dark Mode

Automatically detects system preferences. Toggle button available on all pages.

## 🐛 Troubleshooting

### Common Issues

1. **Port 3000 already in use**
   - The project uses port 3001 by default
   - Change in `.env` if needed

2. **Dependencies broken after npm audit fix**
   ```bash
   make reset
   ```

3. **Images not showing**
   - Ensure images are in `public/assets/`
   - Run `make process-images`

4. **Build errors**
   ```bash
   make clean
   npm install
   ```

5. **Visual tests not opening**
   - Ensure dev server is running on port 3001
   - Manually open `tests/visual-regression-test.html`

### Getting Help

- Run `make help` for command list
- Run `make docs` for detailed documentation
- Check `docs/MAKEFILE_GUIDE.md` for comprehensive guide
- See `docs/QUICK_REFERENCE.md` for quick tips

## 📚 Documentation

- [Makefile Guide](docs/MAKEFILE_GUIDE.md) - Detailed command documentation
- [Quick Reference](docs/QUICK_REFERENCE.md) - Common commands and tips
- [Image Management](docs/image-management.md) - Image optimization guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run `make pre-deploy` to ensure everything works
5. Submit a pull request

## 📄 License

This project is private and proprietary.

## 🙏 Acknowledgments

- Built with Create React App
- Deployed on Vercel
- Images optimized with Sharp
- PDF processing with pdf-poppler