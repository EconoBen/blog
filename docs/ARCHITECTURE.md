# Architecture Overview

This document describes the technical architecture of the blog application.

## 🏗️ High-Level Architecture

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Markdown Files │────▶│  Build Process  │────▶│  Static Output  │
│   (src/posts)   │     │   (scripts/)    │     │    (build/)     │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│  Image Assets   │────▶│ Image Optimizer │────▶│     Vercel      │
│   (originals)   │     │    (sharp)      │     │   Deployment    │
│                 │     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

## 📁 Project Structure

```
blog/
├── public/                    # Static assets
│   ├── assets/               # Optimized images
│   │   ├── YYYY/MM/         # Organized by date
│   │   └── originals/       # High-quality source images
│   └── posts/               # PDF files and thumbnails
│
├── src/                      # Source code
│   ├── components/          # React components
│   │   ├── Layout/         # Layout components
│   │   ├── Blog/           # Blog-specific components
│   │   └── Common/         # Shared components
│   │
│   ├── posts/              # Markdown blog posts
│   │
│   ├── styles/             # CSS files
│   │   ├── mobile.css      # Mobile-specific styles
│   │   ├── responsive.css  # Responsive breakpoints
│   │   └── mobile-search-fixes.css # Enhanced search
│   │
│   ├── hooks/              # Custom React hooks
│   │   └── useScrollDirection.js
│   │
│   ├── utils/              # Utility functions
│   │   ├── deviceDetection.ts
│   │   └── mobileScrollFix.js
│   │
│   ├── services/           # Data services
│   │   ├── PostService.ts  # Blog post management
│   │   └── UnifiedSearchService.ts
│   │
│   └── config/             # Configuration files
│       ├── blogConfig.ts
│       ├── publicationsConfig.ts
│       └── talksConfig.ts
│
├── scripts/                 # Build and utility scripts
│   ├── generate-post-imports.js
│   ├── optimize-images.js
│   ├── generate-pdf-thumbnails.js
│   └── add-image.js
│
└── tests/                   # Test files
    └── visual-regression-test.html
```

## 🔄 Data Flow

### 1. Content Pipeline

```
Markdown Files → Gray Matter Parser → PostService → React Components
```

- Markdown files in `src/posts/` contain frontmatter and content
- Build script generates imports automatically
- PostService loads and parses all posts at build time
- Components consume posts via PostService API

### 2. Image Processing Pipeline

```
Original Image → Sharp → Multiple Sizes + WebP → CDN
```

- Original images stored in `public/assets/originals/`
- Sharp generates 6 sizes: 150, 300, 768, 1024, 1536, 2048px
- WebP format created for modern browsers
- Originals excluded from deployment via `.vercelignore`

### 3. Search Implementation

```
User Input → Debounced Search → PostService → Filtered Results
```

- Real-time search across title, content, and tags
- 300ms debounce to reduce API calls
- Results limited to 3 on mobile for performance
- Full results available on dedicated search page

## 🎨 Styling Architecture

### CSS Organization

1. **Base Styles** (`index.css`)
   - CSS variables
   - Typography
   - Layout foundations

2. **Component Styles** (inline)
   - Component-specific styles
   - Scoped to component

3. **Mobile Styles** (`mobile.css`)
   - Mobile-first overrides
   - Touch-specific adjustments
   - Responsive utilities

4. **Responsive Breakpoints**
   - Mobile: < 576px
   - Tablet: 576px - 768px
   - iPad: 768px - 1024px
   - Desktop: > 1024px

### CSS Variables

```css
:root {
  --sidebar-width: 240px;
  --color-primary: #0070f3;
  --bg-color: #fff;
  --text-primary: #333;
  /* ... more variables */
}
```

Dark mode switches variables:
```css
.dark-mode {
  --bg-color: #1a1a1a;
  --text-primary: #fff;
  /* ... more overrides */
}
```

## 🏃 Performance Optimizations

### 1. Build-Time Optimizations
- Static post compilation
- Image pre-optimization
- PDF thumbnail generation
- Markdown parsing at build time

### 2. Runtime Optimizations
- Lazy loading for images
- Debounced search
- Scroll-based nav hiding
- CSS-only animations

### 3. Bundle Optimizations
- Code splitting by route
- Tree shaking
- Minification
- Compression

## 📱 Mobile Architecture

### Device Detection

```typescript
export const isMobileDevice = (): boolean => {
  return window.innerWidth <= 768 || 
         /Android|webOS|iPhone|iPad|iPod/i.test(navigator.userAgent);
};
```

### Mobile-Specific Features

1. **Bottom Navigation**
   - Fixed position bottom bar
   - 5 main navigation items
   - Hide/show on scroll

2. **Touch Optimizations**
   - 44px minimum touch targets (iOS)
   - 48px for Android devices
   - Tap highlights disabled
   - Smooth scrolling

3. **Viewport Management**
   - iOS Safari height fixes
   - Android keyboard handling
   - Orientation change support

## 🧪 Testing Strategy

### Visual Regression Testing

- 8 device viewports tested
- Automated issue detection
- Touch target validation
- Overflow detection

### Test Devices

```javascript
const devices = [
  { name: "iPhone SE", width: 375, height: 667 },
  { name: "iPhone 12 Pro", width: 390, height: 844 },
  { name: "Samsung Galaxy S21", width: 360, height: 800 },
  { name: "Google Pixel 5", width: 393, height: 851 },
  { name: "iPad", width: 768, height: 1024 },
  { name: "iPad Pro 11", width: 834, height: 1194 },
  { name: "Android Tablet", width: 768, height: 1024 },
  { name: "Desktop", width: 1200, height: 800 }
];
```

## 🚀 Deployment Architecture

### Vercel Configuration

```
Build Command: npm run build
Output Directory: build
Install Command: npm install
```

### Deployment Flow

1. Push to GitHub
2. Vercel webhook triggered
3. Build process runs
4. Static files deployed to CDN
5. Cache invalidation

### Excluded Files

`.vercelignore`:
- Video files (*.mp4, *.m4v)
- Original images
- Test files
- Backup files

## 🔒 Security Considerations

1. **No Server-Side Code**
   - Pure static site
   - No database
   - No API endpoints

2. **Content Security**
   - Markdown sanitization
   - No user-generated content
   - Static file serving only

3. **Dependencies**
   - Regular security audits
   - Careful with `npm audit fix --force`
   - Dependency review on PRs

## 🔧 Development Tools

### Build Scripts

1. **generate-post-imports.js**
   - Scans `src/posts/`
   - Generates TypeScript imports
   - Updates PostService.ts

2. **optimize-images.js**
   - Processes images in originals
   - Creates multiple sizes
   - Generates WebP versions

3. **generate-pdf-thumbnails.js**
   - Uses pdf-poppler
   - Creates PNG thumbnails
   - Stores in posts/thumbnails

### Development Workflow

```bash
make dev        # Start dev server
make test-visual # Test responsive design
make lint       # Check code quality
make build      # Production build
make deploy     # Deploy to Vercel
```

## 📈 Future Considerations

### Potential Enhancements

1. **Performance**
   - Service Worker for offline
   - Image lazy loading improvements
   - Bundle size optimization

2. **Features**
   - RSS feed generation
   - Search indexing improvements
   - Comment system integration

3. **Developer Experience**
   - Hot module replacement fix
   - Better TypeScript coverage
   - E2E testing with Playwright

### Scalability

- Current: ~14 posts
- Tested up to: 100+ posts
- Bottlenecks: Build time, search performance
- Solutions: Pagination, search indexing