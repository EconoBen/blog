# Production Parity Troubleshooting Guide

This guide provides solutions to common issues that may arise when maintaining production parity between the local Next.js implementation and the production React site.

## Quick Reference

### Emergency Commands
```bash
# Quick parity check
cd scripts/verification && npm run verify

# Visual comparison
cd scripts/verification && npm run visual

# Check production changes
cd scripts/verification && npm run monitor:check

# Restart development server
npm run dev

# Clean build
rm -rf .next && npm run build
```

### Common File Locations
- Main content component: `app/components/MainContent.tsx`
- Global styles: `app/globals.css`
- Next.js config: `next.config.ts`
- Verification scripts: `scripts/verification/`

## Issue Categories

## 1. Build and Development Issues

### Issue: Next.js Build Fails
**Symptoms**: 
- Build process stops with errors
- TypeScript compilation errors
- Missing dependencies

**Diagnosis**:
```bash
# Check for TypeScript errors
npm run build

# Check dependencies
npm ls

# Check for missing packages
npm install
```

**Solutions**:

1. **TypeScript Errors**:
   ```bash
   # Fix TypeScript configuration
   # Check tsconfig.json for correct settings
   
   # Add missing type definitions
   npm install --save-dev @types/node @types/react @types/react-dom
   ```

2. **Dependency Issues**:
   ```bash
   # Clear node_modules and reinstall
   rm -rf node_modules package-lock.json
   npm install
   ```

3. **Next.js Configuration**:
   ```javascript
   // next.config.ts - ensure proper configuration
   const nextConfig = {
     experimental: {
       appDir: true
     }
   }
   ```

### Issue: Development Server Won't Start
**Symptoms**:
- Port already in use
- Server crashes on startup
- Module not found errors

**Solutions**:

1. **Port Conflicts**:
   ```bash
   # Kill process on port 3000
   lsof -ti:3000 | xargs kill -9
   
   # Or use different port
   npm run dev -- -p 3001
   ```

2. **Module Errors**:
   ```bash
   # Clear Next.js cache
   rm -rf .next
   
   # Reinstall dependencies
   npm install
   ```

## 2. Component and Functionality Issues

### Issue: Hero Section Not Displaying Correctly
**Symptoms**:
- Hero section appears blank
- Content not loading
- Styling issues

**Diagnosis**:
```bash
# Check if posts are being loaded
# Look at browser console for errors
# Verify MainContent component props
```

**Solutions**:

1. **Posts Not Loading**:
   ```typescript
   // Check app/page.tsx
   export default async function Home() {
     const posts = await getAllPosts();
     console.log('Posts loaded:', posts.length); // Debug line
     return <MainContent posts={posts} />;
   }
   ```

2. **Component State Issues**:
   ```typescript
   // In MainContent.tsx, check for posts array
   if (!posts || posts.length === 0) {
     return <div className="loading">Loading...</div>;
   }
   ```

3. **CSS Issues**:
   ```css
   /* Verify hero section styles in globals.css */
   .hero-section {
     display: flex;
     align-items: center;
     /* ... other styles */
   }
   ```

### Issue: Category Filtering Not Working
**Symptoms**:
- Category buttons don't respond to clicks
- Posts don't filter when category selected
- Active state not updating

**Diagnosis**:
```javascript
// Check browser console for JavaScript errors
// Verify 'use client' directive is present
// Check state management in MainContent component
```

**Solutions**:

1. **Client Component Issue**:
   ```typescript
   // Ensure 'use client' is at top of MainContent.tsx
   'use client';
   
   import React, { useState } from 'react';
   ```

2. **State Management**:
   ```typescript
   // Verify useState is working correctly
   const [activeCategory, setActiveCategory] = useState<string>('all');
   
   // Check filter function
   const getFilteredPosts = (): Post[] => {
     if (activeCategory === 'all') {
       return posts;
     }
     return posts.filter(post => post.tags.includes(activeCategory));
   };
   ```

3. **Event Handlers**:
   ```typescript
   // Ensure click handlers are properly bound
   <button
     className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
     onClick={() => setActiveCategory('all')}
   >
     All
   </button>
   ```

### Issue: Links Not Working
**Symptoms**:
- Hero title link doesn't navigate
- Featured post links broken
- Tech badge links not working

**Solutions**:

1. **Next.js Link Component**:
   ```typescript
   // Use Next.js Link component
   import Link from 'next/link';
   
   <Link href={`/posts/${post.slug}`}>
     {post.title}
   </Link>
   ```

2. **Href Attributes**:
   ```typescript
   // Verify href paths are correct
   const href = `/posts/${newestPost.slug}`;
   console.log('Link href:', href); // Debug
   ```

## 3. Styling and Visual Issues

### Issue: Styles Not Matching Production
**Symptoms**:
- Colors don't match
- Layout differences
- Missing hover effects

**Diagnosis**:
```bash
# Run visual regression test
cd scripts/verification
npm run visual

# Compare screenshots
open screenshots/visual-comparison-report.html
```

**Solutions**:

1. **CSS Variables**:
   ```css
   /* Verify CSS variables in globals.css */
   :root {
     --hero-bg: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
     --accent-color: #0070f3;
     /* ... other variables */
   }
   ```

2. **Missing Styles**:
   ```css
   /* Check if all necessary styles are imported */
   @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&family=Roboto:wght@400;500&display=swap');
   ```

3. **Responsive Issues**:
   ```css
   /* Verify media queries */
   @media (max-width: 768px) {
     .hero-section {
       flex-direction: column;
       padding: 40px 20px;
     }
   }
   ```

### Issue: Images Not Loading
**Symptoms**:
- Broken image icons
- Images not displaying
- Slow image loading

**Solutions**:

1. **Image Paths**:
   ```typescript
   // Verify image paths are correct
   const imagePath = '/assets/images/hero-bg.jpg';
   ```

2. **Next.js Image Component**:
   ```typescript
   import Image from 'next/image';
   
   <Image
     src="/assets/hero-image.jpg"
     alt="Hero image"
     width={500}
     height={300}
   />
   ```

## 4. Performance Issues

### Issue: Slow Page Loading
**Symptoms**:
- Page takes >3 seconds to load
- Poor Lighthouse scores
- High bundle size

**Diagnosis**:
```bash
# Run Lighthouse audit
lighthouse http://localhost:3000

# Check bundle size
npm run build
npx @next/bundle-analyzer
```

**Solutions**:

1. **Code Splitting**:
   ```typescript
   // Use dynamic imports for heavy components
   const HeavyComponent = dynamic(() => import('./HeavyComponent'), {
     loading: () => <p>Loading...</p>
   });
   ```

2. **Image Optimization**:
   ```typescript
   // Use Next.js Image component with optimization
   import Image from 'next/image';
   
   <Image
     src="/hero-image.jpg"
     alt="Hero"
     width={1200}
     height={600}
     priority // For above-the-fold images
   />
   ```

3. **Bundle Optimization**:
   ```javascript
   // next.config.ts
   const nextConfig = {
     experimental: {
       optimizeCss: true
     },
     compiler: {
       removeConsole: process.env.NODE_ENV === 'production'
     }
   }
   ```

## 5. Testing and Verification Issues

### Issue: Automated Tests Failing
**Symptoms**:
- Verification tests report failures
- Visual regression tests show differences
- Monitoring alerts triggered

**Diagnosis**:
```bash
# Run detailed verification
cd scripts/verification
DEBUG=true npm run verify

# Check specific test results
cat parity-verification-report.json | jq '.tests[] | select(.passed == false)'
```

**Solutions**:

1. **Test Environment Issues**:
   ```bash
   # Ensure local server is running
   npm run dev
   
   # Check if server is accessible
   curl http://localhost:3000
   ```

2. **Timing Issues**:
   ```javascript
   // In verification scripts, add longer waits
   await page.waitForTimeout(3000); // Increase wait time
   await page.waitForSelector('.hero-section', { timeout: 10000 });
   ```

3. **Element Selection Issues**:
   ```javascript
   // Use more specific selectors
   const heroTitle = await page.$('.hero-section .hero-title');
   ```

### Issue: Visual Regression Differences
**Symptoms**:
- Screenshots don't match
- Layout shifts detected
- Font rendering differences

**Solutions**:

1. **Font Loading**:
   ```css
   /* Ensure fonts load before screenshots */
   @import url('https://fonts.googleapis.com/css2?family=Roboto+Mono:wght@400;500&display=swap');
   ```

2. **Animation Issues**:
   ```javascript
   // Disable animations for testing
   await page.addStyleTag({
     content: `
       *, *::before, *::after {
         animation-duration: 0s !important;
         animation-delay: 0s !important;
         transition-duration: 0s !important;
         transition-delay: 0s !important;
       }
     `
   });
   ```

## 6. Production Monitoring Issues

### Issue: False Positive Alerts
**Symptoms**:
- Monitoring reports changes that aren't significant
- Too many alerts generated
- Alert fatigue

**Solutions**:

1. **Adjust Monitoring Sensitivity**:
   ```javascript
   // In parity-monitor.js, modify comparison logic
   const isSignificantChange = (baseline, current) => {
     // Add threshold for minor changes
     const threshold = 0.1; // 10% change threshold
     return Math.abs(baseline - current) > threshold;
   };
   ```

2. **Update Baseline**:
   ```bash
   # Update baseline after intentional changes
   cd scripts/verification
   npm run monitor:init
   ```

### Issue: Monitoring Not Detecting Real Changes
**Symptoms**:
- Actual production changes not caught
- Monitoring system not running
- Baseline outdated

**Solutions**:

1. **Check Monitoring Schedule**:
   ```bash
   # Verify cron job is running
   crontab -l
   
   # Check monitoring logs
   tail -f /var/log/parity-monitor.log
   ```

2. **Update Monitoring Logic**:
   ```javascript
   // Add more comprehensive checks
   const checkStructuralChanges = async (page) => {
     // Add checks for new elements
     // Monitor content changes
     // Track layout modifications
   };
   ```

## 7. Deployment and Configuration Issues

### Issue: Environment Variables Not Working
**Symptoms**:
- Features work locally but not in production
- API calls failing
- Configuration differences

**Solutions**:

1. **Check Environment Files**:
   ```bash
   # Verify .env.local exists and has correct values
   cat .env.local
   
   # Check Next.js environment variable loading
   console.log(process.env.NEXT_PUBLIC_API_URL);
   ```

2. **Next.js Environment Variable Rules**:
   ```javascript
   // Only NEXT_PUBLIC_ variables are available in browser
   const apiUrl = process.env.NEXT_PUBLIC_API_URL;
   ```

### Issue: Build Configuration Differences
**Symptoms**:
- Local build works but production fails
- Different behavior between environments
- Asset loading issues

**Solutions**:

1. **Check Next.js Configuration**:
   ```javascript
   // next.config.ts
   const nextConfig = {
     output: 'standalone', // For production deployment
     images: {
       domains: ['econoben.dev']
     }
   };
   ```

2. **Build Process Alignment**:
   ```bash
   # Test production build locally
   npm run build
   npm start
   ```

## Diagnostic Tools and Commands

### Quick Diagnostics
```bash
# System health check
npm run build && npm run dev

# Full verification suite
cd scripts/verification && npm run test:all

# Check for console errors
# Open browser dev tools and check console

# Network tab analysis
# Check for failed requests in browser network tab
```

### Detailed Analysis
```bash
# Bundle analysis
npx @next/bundle-analyzer

# Performance audit
lighthouse http://localhost:3000

# Dependency check
npm audit
npm outdated

# Git history for recent changes
git log --oneline -10
```

### Debug Mode
```bash
# Enable debug logging
DEBUG=true npm run dev

# Verbose verification
DEBUG=true cd scripts/verification && npm run verify
```

## Prevention Strategies

### 1. Regular Maintenance
- Run weekly verification tests
- Monitor production changes daily
- Update dependencies monthly
- Review and update documentation quarterly

### 2. Code Quality
- Use TypeScript for type safety
- Implement comprehensive testing
- Follow consistent coding standards
- Regular code reviews

### 3. Monitoring and Alerting
- Set up automated monitoring
- Configure appropriate alert thresholds
- Maintain up-to-date baselines
- Regular monitoring system health checks

## When to Escalate

### Escalation Criteria
- Critical functionality broken for >2 hours
- Unable to identify root cause within 4 hours
- Security vulnerabilities discovered
- Data loss or corruption suspected

### Escalation Process
1. Document all troubleshooting steps taken
2. Gather relevant logs and error messages
3. Create detailed incident report
4. Notify team lead or senior developer
5. Consider rollback if issue is severe

## Additional Resources

### Documentation
- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [Production Parity Documentation](./PRODUCTION_PARITY_DOCUMENTATION.md)
- [Maintenance Procedures](./MAINTENANCE_PROCEDURES.md)

### Tools
- Browser Developer Tools
- Lighthouse Performance Auditing
- Next.js Bundle Analyzer
- Visual Studio Code with React/TypeScript extensions

### Community Resources
- Next.js GitHub Issues
- Stack Overflow
- React Community Discord
- Next.js Discord

---

**Remember**: When in doubt, start with the basics - check the console, verify the server is running, and ensure all dependencies are installed. Most issues can be resolved by following the systematic approach outlined in this guide.

**Document Version**: 1.0  
**Last Updated**: [Current Date]  
**Maintained By**: Development Team