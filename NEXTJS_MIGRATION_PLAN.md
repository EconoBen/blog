# Next.js Migration Plan: Complete Feature Preservation

## Overview
This plan ensures a complete migration from the React app to Next.js while preserving ALL functionality. The migration will be done in phases to minimize risk and allow for testing at each stage.

## Pre-Migration Checklist
- [ ] **Backup current working React app** (create git branch `react-app-backup`)
- [ ] **Document all environment variables** currently in use
- [ ] **Test all features** in React app to ensure baseline functionality
- [ ] **Choose target Next.js app**: Use `/blog-nextjs` as base (already has some setup)

## Phase 1: Foundation Setup (Day 1)

### 1.1 Environment & Configuration
```bash
# Copy all environment variables
cp .env .env.backup
cp .env blog-nextjs/.env.local

# Required environment variables:
- OPENAI_API_KEY
- AWS_ACCESS_KEY_ID
- AWS_SECRET_ACCESS_KEY
- AWS_REGION
- S3_AUDIO_BUCKET
- GITHUB_TOKEN
- NEXT_PUBLIC_GA_ID (for analytics)
```

### 1.2 Complete Route Structure
```
app/
├── layout.tsx (with Sidebar/NavBar)
├── page.tsx (home)
├── posts/
│   └── [slug]/
│       └── page.tsx
├── archives/
│   ├── page.tsx
│   └── [month]/
│       └── page.tsx
├── tags/
│   └── [tag]/
│       └── page.tsx
├── about/
│   └── page.tsx
├── talks/
│   └── page.tsx
├── publications/
│   └── page.tsx
├── code-ai/
│   └── page.tsx
├── search/
│   └── page.tsx
└── api/
    ├── og/
    │   └── route.tsx
    └── search/
        └── route.ts
```

### 1.3 Core Services Migration
- [ ] Copy `UnifiedSearchService.ts` → `app/services/`
- [ ] Update `PostService.ts` with all methods from React version
- [ ] Create `ConfigService.ts` for managing configurations

## Phase 2: Component Migration (Day 2-3)

### 2.1 Layout Components
Priority order (these affect all pages):
1. [ ] `Sidebar.tsx` - Desktop navigation
2. [ ] `NavBar.tsx` - Top navigation (merge with existing)
3. [ ] `MobileNavBar.tsx` - Mobile navigation
4. [ ] `BottomNav.tsx` - Mobile bottom nav
5. [ ] `SocialLinks.tsx` - Social media links

### 2.2 Content Display Components
6. [ ] `BlogCard.tsx` - Post preview cards
7. [ ] `BlogContent.tsx` - Full post display
8. [ ] `MarkdownRenderer.tsx` - Advanced markdown features
9. [ ] `CodeBlock.tsx` - Syntax highlighting
10. [ ] `AudioPlayer.tsx` - TTS playback
11. [ ] `VideoPlayer.tsx` - Video embedding

### 2.3 Page-Specific Components
12. [ ] `TalkCard.tsx` - Talks display
13. [ ] `PublicationCard.tsx` - Publications display
14. [ ] `SearchResults.tsx` - Search UI
15. [ ] `TagPage.tsx` - Tag filtering
16. [ ] `TTSPipelineDiagram.tsx` - Technical diagrams

### 2.4 Utility Components
17. [ ] `ThemeToggle.tsx` - Dark mode switch
18. [ ] `ScrollToTop.tsx` - Scroll behavior
19. [ ] `LoadingSpinner.tsx` - Loading states
20. [ ] `ErrorBoundary.tsx` - Error handling

## Phase 3: Feature Implementation (Day 4-5)

### 3.1 Search Functionality
```typescript
// app/api/search/route.ts
- Implement unified search across posts, talks, publications
- Add search suggestions/autocomplete
- Include fuzzy matching
```

### 3.2 Dark Mode
```typescript
// app/providers/ThemeProvider.tsx
- Create theme context
- Implement localStorage persistence
- Add system preference detection
```

### 3.3 Mobile Optimizations
- [ ] Copy all mobile-specific utilities
- [ ] Implement scroll direction detection
- [ ] Add mobile-specific event handlers
- [ ] Configure viewport fixes

## Phase 4: API Integrations (Day 6-7)

### 4.1 OpenAI TTS Pipeline
```bash
# Copy and adapt scripts
cp scripts/generate-audio.js blog-nextjs/scripts/
cp scripts/upload-audio-s3.js blog-nextjs/scripts/

# Update for Next.js paths
- Update file paths in scripts
- Configure for app directory structure
```

### 4.2 GitHub Gists Integration
```bash
cp scripts/fetch-gists.js blog-nextjs/scripts/
cp scripts/create-gists.js blog-nextjs/scripts/

# Add to build process
- Integrate with Next.js build
- Update cache paths
```

### 4.3 AWS S3 Configuration
- [ ] Set up S3 client in Next.js
- [ ] Configure CORS for audio streaming
- [ ] Update audio URLs in components

## Phase 5: Build Process & Scripts (Day 8)

### 5.1 Update package.json Scripts
```json
{
  "scripts": {
    "dev": "next dev",
    "build": "npm run fetch-gists && npm run generate-audio && next build",
    "postbuild": "npm run upload-audio && npm run cleanup",
    "fetch-gists": "node scripts/fetch-gists.js",
    "generate-audio": "node scripts/generate-audio.js",
    "upload-audio": "node scripts/upload-audio-s3.js",
    "optimize-images": "node scripts/optimize-images.js",
    "cleanup": "node scripts/post-build-cleanup.js"
  }
}
```

### 5.2 Migrate Build Scripts
- [ ] `generate-post-imports.js` → Dynamic imports in Next.js
- [ ] `optimize-images.js` → Next.js Image optimization
- [ ] `generate-pdf-thumbnails.js` → API route
- [ ] `post-build-cleanup.js` → Next.js specific

## Phase 6: Styling & Assets (Day 9)

### 6.1 Consolidate Styles
```css
/* app/globals.css */
@import 'styles/variables.css';
@import 'styles/typography.css';
@import 'styles/components.css';
@import 'styles/layout.css';
@import 'styles/navigation.css';
@import 'styles/responsive.css';
@import 'styles/mobile.css';
@import 'styles/dark-mode.css';
```

### 6.2 Asset Migration
- [ ] Copy all images maintaining directory structure
- [ ] Copy all audio files
- [ ] Copy all PDF files
- [ ] Update all asset references in components

## Phase 7: Testing & Validation (Day 10)

### 7.1 Feature Testing Checklist
- [ ] **Navigation**: All routes work, mobile nav functions
- [ ] **Posts**: Display correctly, markdown renders properly
- [ ] **Search**: Returns results, filters work
- [ ] **Audio**: TTS plays, controls work
- [ ] **Dark Mode**: Toggles properly, persists
- [ ] **Mobile**: Responsive design, touch events
- [ ] **SEO**: OG images generate, meta tags present
- [ ] **Performance**: Lighthouse score ≥ 90

### 7.2 Content Validation
- [ ] All 16 posts display correctly
- [ ] Archives show proper monthly grouping
- [ ] Tags filter posts accurately
- [ ] Talks and publications load
- [ ] Code & AI section works
- [ ] Search indexes all content

## Phase 8: Deployment (Day 11)

### 8.1 Vercel Configuration
```json
// vercel.json updates
{
  "functions": {
    "app/api/og/route.tsx": {
      "maxDuration": 10
    }
  },
  "redirects": [
    { "source": "/workshop", "destination": "/code-ai", "permanent": true }
  ]
}
```

### 8.2 Environment Variables
- [ ] Set all env vars in Vercel dashboard
- [ ] Configure build settings
- [ ] Set up custom domain

## Phase 9: Cleanup (Day 12)

### 9.1 Repository Cleanup
```bash
# After confirming Next.js app works perfectly:
1. git checkout -b cleanup
2. rm -rf src/ (React app)
3. rm -rf app/ (partial Next.js)
4. rm -rf build/
5. mv blog-nextjs/* .
6. rm -rf blog-nextjs/
7. Update .gitignore
8. Update README.md
```

### 9.2 Final Structure
```
blog/
├── app/              # Next.js app directory
├── public/           # Static assets
├── posts/            # Markdown content
├── scripts/          # Build scripts
├── styles/           # Global styles
├── lib/              # Utilities
├── components/       # Shared components
└── [config files]    # package.json, etc.
```

## Rollback Plan

If any issues arise:
1. The React app remains untouched until Phase 9
2. Git branch `react-app-backup` preserves working state
3. Environment variables backed up in `.env.backup`
4. Can deploy React app from backup branch anytime

## Success Criteria

Migration is complete when:
- ✅ All 23 React components have Next.js equivalents
- ✅ All 8 scripts function properly
- ✅ All routes from React app work in Next.js
- ✅ TTS audio generation and playback works
- ✅ Search returns same results as React app
- ✅ Mobile experience matches or exceeds React app
- ✅ Performance metrics equal or better
- ✅ Zero functionality regression

## Estimated Timeline

- **Total Duration**: 12 days
- **Daily Commitment**: 2-4 hours
- **Testing Buffer**: 2 additional days
- **Total Project**: 2 weeks

This plan ensures a systematic migration with no loss of functionality, proper testing at each phase, and a clear rollback strategy if needed.