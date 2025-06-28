# Changelog

All notable changes to this project will be documented in this file.

## [Unreleased] - 2025-01-15

### Added
- **Visual Regression Testing**: Comprehensive testing suite for multiple device sizes
  - Tests for iPhone, Android, iPad, and Desktop viewports
  - Automated checks for common mobile CSS issues
  - Touch target size validation
  - Search functionality testing

- **Makefile Build System**: 30+ commands for development workflow
  - `make dev` - Start development server
  - `make test-visual` - Open visual regression tests
  - `make deploy` - Deploy to Vercel
  - Complete documentation in `docs/MAKEFILE_GUIDE.md`

- **Enhanced Mobile Search**:
  - iPad-specific optimizations with better spacing
  - Consistent search panel across all devices
  - Touch-friendly input fields (44px minimum targets)
  - Android-specific touch target requirements (48px)
  - Improved animations and transitions

- **Scroll-based Navigation**:
  - Top navbar hides on scroll down, shows on scroll up
  - Bottom navigation with same behavior
  - Dark mode toggle repositions dynamically
  - Smooth animations with `useScrollDirection` hook

- **Image Optimization System**:
  - Automatic generation of multiple sizes
  - WebP format support
  - Original preservation in `public/assets/originals/`
  - Excluded from Vercel deployment via `.vercelignore`

### Fixed
- **React Markdown HTML Rendering**: Added `rehype-raw` plugin to properly render HTML in markdown posts
- **Image Centering**: Fixed CSS margins from "30px 0" to "30px auto"
- **Mobile CSS**: Refactored 2000+ line file to 552 lines (73% reduction)
- **npm audit fix --force Recovery**: Fixed broken dependencies by correcting react-scripts version
- **Vercel Deployment**: Resolved "Upload aborted" errors by optimizing large images

### Changed
- **Port Configuration**: Changed default port from 3000 to 3001
- **Fast Refresh**: Disabled to avoid module import errors
- **Mobile CSS Organization**: Restructured into logical sections with utility classes
- **Search Panel Layout**: Made consistent across all device sizes

### Technical Details
- React 19 with TypeScript
- Mobile-first CSS approach
- Visual regression testing for 8 device sizes
- Automated image optimization with Sharp
- PDF thumbnail generation with pdf-poppler

## Previous Work

### Blog Setup
- Migrated 14 blog posts to local markdown files
- Updated all image paths to use local assets
- Fixed frontmatter in archived posts
- Updated meta tags and site information

### Mobile Experience
- Implemented mobile-specific navigation
- Added bottom navigation bar for mobile devices
- Created touch-optimized search interface
- Fixed dark mode toggle positioning
- Added iOS-specific scroll fixes

### Content Management
- Automated post import generation
- PDF publication system with thumbnails
- Tag-based categorization
- Archive view by month
- Full-text search implementation