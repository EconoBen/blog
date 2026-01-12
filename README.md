# Economic Notes Blog

A modern, feature-rich blog built with Next.js 15, featuring AI-generated audio content, dynamic search, and comprehensive content management.

## Features

- 📝 **Markdown Blog Posts** with full metadata support
- 🎙️ **Text-to-Speech Integration** using OpenAI TTS
- 🔍 **Advanced Search** with fuzzy matching across posts, talks, and publications
- 🎤 **Talks & Publications** management
- 🔧 **Code Workshop** with GitHub Gists integration
- 🌙 **Dark Mode** support
- 📱 **Mobile-First** responsive design
- 🚀 **Static Site Generation** with Next.js App Router
- 📊 **Analytics** integration with Vercel Analytics
- 🖼️ **Automatic Image Optimization**
- 📄 **PDF Processing** for publications

## Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd blog

# Install dependencies
npm install

# Set up environment variables
cp .env.local.example .env.local
# Edit .env.local with your API keys
```

### Development

```bash
# Start development server
npm run dev
# or
make dev

# Open http://localhost:3000 (or 3001 if 3000 is in use)
```

### Building for Production

```bash
# Build the application
npm run build
# or  
make build

# Serve production build locally
npm start
# or
make serve
```

## Environment Variables

Create a `.env.local` file with the following variables:

```bash
# OpenAI API (for TTS generation)
OPENAI_API_KEY=your_openai_api_key

# GitHub (for Gists integration)
GITHUB_TOKEN=your_github_token

# AWS S3 (for audio storage)
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=us-west-2
S3_AUDIO_BUCKET=your_s3_bucket_name

# Analytics
NEXT_PUBLIC_GA_ID=your_google_analytics_id
```

## Project Structure

```
blog/
├── app/                    # Next.js App Router
│   ├── components/         # React components
│   ├── config/            # Configuration files
│   ├── services/          # Business logic
│   └── utils/             # Utility functions
├── posts/                 # Markdown blog posts
├── public/                # Static assets
│   ├── assets/           # Images and media
│   └── audio/            # Generated TTS audio files
├── scripts/               # Build and utility scripts
└── config/               # Global configuration
```

## Content Management

### Adding Blog Posts

1. Create a new `.md` file in the `posts/` directory
2. Add frontmatter metadata:

```yaml
---
title: "Your Post Title"
date: "2025-01-01"
tags: ["tag1", "tag2"]
excerpt: "Brief description"
featured: true
tts: true  # Enable text-to-speech
---

Your post content here...
```

3. Run `npm run dev` to see your post

### Adding Images

```bash
# Add images to originals directory
make add-image IMG=path/to/image.jpg YEAR=2025 MONTH=01

# Or process existing images
make process-images
```

### Managing Publications

Edit `config/publicationsConfig.ts` to add new publications, or place PDF files in `public/posts/` and run:

```bash
npm run process-pdfs
```

## Available Scripts

### Development
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint

### Content Processing
- `npm run fetch-gists` - Fetch GitHub Gists for code workshop
- `npm run generate-audio` - Generate TTS audio for posts
- `npm run upload-audio` - Upload audio files to S3
- `npm run process-pdfs` - Generate PDF thumbnails
- `npm run optimize-images` - Optimize images

### Utility
- `npm run post-build` - Post-build cleanup

## Makefile Commands

For convenience, you can use make commands:

```bash
make help              # Show available commands
make dev               # Start development server
make build             # Build for production
make deploy            # Deploy to Vercel (preview)
make deploy-prod       # Deploy to production
make clean             # Clean build artifacts
make setup             # Initial project setup
```

## Deployment

### Vercel (Recommended)

```bash
# Deploy preview
make deploy

# Deploy to production
make deploy-prod
```

### Manual Deployment

```bash
npm run build
# Upload .next/ and public/ directories to your hosting provider
```

## Features in Detail

### Text-to-Speech

Posts with `tts: true` in frontmatter automatically generate audio versions using OpenAI's TTS API. Audio files are uploaded to S3 and served via CDN.

### Search Functionality

The blog includes a powerful search system that indexes:
- Blog post content and metadata
- Talk descriptions
- Publication abstracts
- Code workshop snippets

### Mobile Experience

Fully responsive design with:
- Mobile-optimized navigation
- Touch-friendly interfaces
- Performance optimizations
- Progressive loading

## Development Guidelines

### Adding New Features

1. Create feature branch from main
2. Implement changes with TypeScript
3. Test thoroughly on mobile and desktop
4. Update documentation
5. Submit pull request

### Code Style

- TypeScript for type safety
- ESLint for code quality
- Responsive design principles
- Component-based architecture

## Troubleshooting

### Common Issues

**Build fails with module errors:**
```bash
rm -rf node_modules package-lock.json
npm install
```

**Images not optimizing:**
```bash
make process-images
```

**Search not working:**
Check that all content files have proper frontmatter and run:
```bash
npm run build
```

### Getting Help

- Check the [Next.js documentation](https://nextjs.org/docs)
- Review error logs in `.next/`
- Use `make clean` to reset build cache

## License

This project is licensed under the MIT License.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using Next.js, TypeScript, and modern web technologies.
