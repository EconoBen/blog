# Makefile Guide

This guide explains how to use the Makefile for common development tasks.

## Table of Contents

- [Installation](#installation)
- [Basic Usage](#basic-usage)
- [Development Commands](#development-commands)
- [Testing Commands](#testing-commands)
- [Deployment Commands](#deployment-commands)
- [Image and PDF Processing](#image-and-pdf-processing)
- [Troubleshooting](#troubleshooting)

## Installation

First, ensure you have `make` installed:

```bash
# macOS (already installed)
which make

# Linux
sudo apt-get install build-essential

# Windows (use WSL or Git Bash)
```

## Basic Usage

To see all available commands:

```bash
make help
```

To see detailed documentation:

```bash
make docs
```

## Development Commands

### Initial Setup

Set up the project for the first time:

```bash
make setup
```

This will:
- Install npm dependencies
- Create a `.env` file with default settings
- Configure the development environment

### Start Development Server

```bash
make dev
```

Or with full preprocessing:

```bash
make dev-full
```

The server runs on port 3001 by default.

### Build for Production

```bash
make build
```

### Serve Production Build Locally

```bash
make serve
```

## Testing Commands

### Run Visual Regression Tests

```bash
make test-visual
```

This opens the visual regression test page in your browser. Make sure the dev server is running first!

**Visual Test Features:**
- Tests multiple device sizes (iPhone, Android, iPad, Desktop)
- Checks for common mobile CSS issues
- Validates touch target sizes
- Detects horizontal overflow
- Tests search functionality

### Run All Tests

```bash
make test
```

### Lint Code

```bash
make lint
```

### Type Check

```bash
make typecheck
```

### Pre-deployment Checks

Run all checks before deploying:

```bash
make pre-deploy
```

## Deployment Commands

### Deploy to Vercel Preview

Creates a preview deployment with a unique URL:

```bash
make deploy
```

### Deploy to Production

⚠️ **WARNING**: This deploys to your live production site!

```bash
make deploy-prod
```

### View Deployment Logs

```bash
make vercel-logs
```

### List Recent Deployments

```bash
make vercel-list
```

## Image and PDF Processing

### Optimize All Images

Process images in `public/assets/originals/`:

```bash
make process-images
```

### Add a New Image

Add and optimize a single image:

```bash
make add-image IMG=~/Desktop/photo.jpg YEAR=2025 MONTH=01
```

### Process PDFs

Generate thumbnails and publications:

```bash
make process-pdfs
```

## Git and GitHub Commands

### Create a Pull Request

```bash
make pr
```

### Commit with AI-generated Message

```bash
make commit
```

## Utility Commands

### Clean Build Artifacts

```bash
make clean
```

### Full Clean (including node_modules)

```bash
make clean-all
```

### Full Reset

Clean everything and reinstall:

```bash
make reset
```

### Security Audit

```bash
make audit
```

### Check for Outdated Dependencies

```bash
make update-deps
```

## Troubleshooting

### Common Issues

1. **Port already in use**
   ```bash
   # Change port in .env file
   PORT=3002
   ```

2. **Dependencies broken after npm audit fix**
   ```bash
   make reset
   ```

3. **Visual tests not opening**
   - Make sure dev server is running: `make dev`
   - Manually open: `tests/visual-regression-test.html`

4. **Deployment fails**
   - Run `make pre-deploy` to check for issues
   - Check `.vercelignore` for excluded files
   - Ensure all images are optimized

### Environment Variables

The `.env` file controls:
- `PORT`: Development server port (default: 3001)
- `FAST_REFRESH`: React Fast Refresh (default: false)

### Vercel Configuration

The `.vercelignore` file excludes:
- Large video files (`*.mp4`, `*.m4v`)
- Backup files (`*.backup`)
- Test files
- Original unoptimized images

## Advanced Usage

### Custom Port

```bash
PORT=3002 make dev
```

### Parallel Commands

Run multiple commands:

```bash
make lint typecheck test
```

### Verbose Output

```bash
make dev VERBOSE=1
```

## Tips

1. **Before deploying**: Always run `make pre-deploy`
2. **Image optimization**: Keep originals in `public/assets/originals/`
3. **Visual testing**: Test on real devices when possible
4. **Commits**: Use `make commit` for consistent commit messages

## Contributing

When adding new commands to the Makefile:

1. Use the format: `target: ## Description`
2. Keep descriptions concise (< 50 characters)
3. Group related commands together
4. Add appropriate warning messages for destructive operations

Example:

```makefile
.PHONY: my-command
my-command: ## Short description here
	@echo "$(BLUE)Running my command...$(NC)"
	# Command implementation
```