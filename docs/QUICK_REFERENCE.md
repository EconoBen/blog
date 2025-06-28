# Quick Reference Card

## 🚀 Most Common Commands

```bash
make help            # Show all commands
make dev             # Start development server
make test-visual     # Open visual regression tests
make deploy          # Deploy to Vercel preview
make deploy-prod     # Deploy to production
```

## 📱 Testing Mobile Layouts

1. Start dev server:
   ```bash
   make dev
   ```

2. Open visual tests:
   ```bash
   make test-visual
   ```

3. Click "Run All Tests" to check all device sizes

## 🖼️ Working with Images

```bash
# Add a new image
make add-image IMG=~/photo.jpg YEAR=2025 MONTH=01

# Optimize all images
make process-images
```

## 🚢 Deployment Workflow

```bash
# 1. Run all checks
make pre-deploy

# 2. Preview deployment
make deploy

# 3. If everything looks good, deploy to production
make deploy-prod
```

## 🔧 Troubleshooting

```bash
make reset           # Fix broken dependencies
make clean           # Clean build artifacts
make audit           # Check security issues
```

## 📊 Visual Test Devices

The visual regression test includes:
- iPhone SE (375x667)
- iPhone 12 Pro (390x844)
- Samsung Galaxy S21 (360x800)
- Google Pixel 5 (393x851)
- iPad (768x1024)
- iPad Pro 11" (834x1194)
- Android Tablet (768x1024)
- Desktop (1200x800)

## ⚡ Pro Tips

1. **Broken after npm audit fix?**
   ```bash
   make reset
   ```

2. **Want to see what a command does?**
   ```bash
   make help
   make docs
   ```

3. **Need a different port?**
   ```bash
   PORT=3002 make dev
   ```

4. **Check everything before deploying?**
   ```bash
   make pre-deploy
   ```