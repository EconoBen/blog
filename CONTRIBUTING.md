# Contributing to Ben Labaschin's Blog

Thank you for your interest in contributing! This document provides guidelines and instructions for contributing to this project.

## 🚀 Getting Started

1. Fork the repository
2. Clone your fork:
   ```bash
   git clone https://github.com/YOUR-USERNAME/blog.git
   cd blog
   ```
3. Set up the project:
   ```bash
   make setup
   make dev
   ```

## 🔄 Development Workflow

1. Create a feature branch:
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. Make your changes

3. Test thoroughly:
   ```bash
   make lint          # Check code style
   make typecheck     # Check TypeScript types
   make test          # Run tests
   make test-visual   # Test on multiple devices
   ```

4. Commit your changes:
   ```bash
   make commit        # Uses AI to generate commit message
   # or manually:
   git add .
   git commit -m "feat: add amazing feature"
   ```

5. Push to your fork:
   ```bash
   git push origin feature/your-feature-name
   ```

6. Create a Pull Request

## 📝 Commit Message Guidelines

We follow conventional commits:

- `feat:` New feature
- `fix:` Bug fix
- `docs:` Documentation changes
- `style:` Code style changes (formatting, missing semicolons, etc)
- `refactor:` Code refactoring
- `test:` Adding or updating tests
- `chore:` Maintenance tasks

Examples:
```
feat: add RSS feed generation
fix: correct image alignment on mobile devices
docs: update README with deployment instructions
style: format code with prettier
refactor: simplify search algorithm
test: add visual regression tests for iPad
chore: update dependencies
```

## 🧪 Testing Guidelines

### Before Submitting

Always run:
```bash
make pre-deploy
```

This runs all checks and ensures your code is ready for deployment.

### Visual Testing

Test your changes on multiple devices:

1. Start the dev server: `make dev`
2. Open visual tests: `make test-visual`
3. Click "Run All Tests"
4. Fix any issues found

### Manual Testing Checklist

- [ ] Test on mobile devices (or browser mobile view)
- [ ] Test on iPad/tablet
- [ ] Test on desktop
- [ ] Test dark mode
- [ ] Test search functionality
- [ ] Check for horizontal scroll
- [ ] Verify touch targets are 44px+ (iOS) or 48px+ (Android)

## 💅 Code Style

### TypeScript/JavaScript

- Use TypeScript for all new code
- Add proper type annotations
- Document complex functions with JSDoc
- Follow existing code patterns

### CSS

- Mobile-first approach
- Use CSS variables for theming
- Keep specificity low
- Avoid `!important` unless necessary
- Test on all breakpoints

### Components

- Keep components focused and single-purpose
- Use functional components with hooks
- Add proper TypeScript interfaces
- Include JSDoc comments for props

Example:
```typescript
/**
 * Card component for displaying blog post previews
 *
 * @param {BlogCardProps} props - Component props
 * @returns {JSX.Element} Rendered card component
 */
const BlogCard: React.FC<BlogCardProps> = ({ post, featured = false }) => {
  // Component logic
};
```

## 📸 Working with Images

When adding images:

1. Use the proper directory structure:
   ```
   public/assets/originals/YYYY/MM/image.jpg
   ```

2. Optimize images:
   ```bash
   make add-image IMG=path/to/image.jpg YEAR=2025 MONTH=01
   ```

3. Reference in markdown:
   ```markdown
   ![Alt text](/assets/2025/01/image.jpg)
   ```

## 🚨 Common Issues

### Port Already in Use
The project uses port 3001. If occupied, update `.env`:
```env
PORT=3002
```

### Dependencies Broken
```bash
make reset
```

### ESLint Errors
```bash
make lint
# Fix automatically where possible:
npx eslint src --fix
```

## 📦 Adding Dependencies

1. Justify why the dependency is needed
2. Check bundle size impact
3. Ensure it works on all supported browsers
4. Update README if it's a major feature

## 🔒 Security

- Never commit sensitive data
- Review dependencies for vulnerabilities
- Run `make audit` before submitting
- Don't use `npm audit fix --force`

## 📚 Documentation

Update documentation when you:
- Add new features
- Change existing behavior
- Add new commands
- Modify the build process

Files to consider updating:
- `README.md`
- `CHANGELOG.md`
- `docs/` directory
- Code comments

## 🎯 Pull Request Guidelines

### PR Title
Use conventional commit format:
```
feat: add dark mode toggle animation
fix: resolve iPad search panel positioning
```

### PR Description Template
```markdown
## Description
Brief description of changes

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update

## Testing
- [ ] Tested on mobile
- [ ] Tested on tablet
- [ ] Tested on desktop
- [ ] Ran visual regression tests
- [ ] All tests pass

## Screenshots
(if applicable)

## Additional Notes
Any extra context
```

## 🤝 Code Review Process

1. Automated checks run on PR
2. Manual review by maintainer
3. Address feedback
4. Merge when approved

## ❓ Questions?

- Check existing issues first
- Ask in PR comments
- Be patient and respectful

Thank you for contributing!