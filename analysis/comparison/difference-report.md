# Production Parity Difference Report

Generated: 8/7/2025, 5:41:40 PM

## Executive Summary

This report identifies all differences between the production site and local build that need to be addressed for complete parity.

**Overall Health**: FAIR
**Total Issues**: 97
**High Priority Issues**: 5

## Issue Breakdown

- **HTML Issues**: 87
- **CSS Issues**: 5  
- **Asset Issues**: 5
- **Configuration Issues**: 0

## HTML Differences

### about.html

- **MEDIUM**: nav element count differs: production has 0, local has 1
- **MEDIUM**: section element count differs: production has 0, local has 5
- **LOW**: Extra CSS classes in local: __className_e8ce0c, sidebar, sidebar-inner, sidebar-section, sidebar-heading, post-list, main-content, main-nav, nav-container, nav-brand...
- **HIGH**: Page titles differ
- **MEDIUM**: Meta tag value differs: viewport
- **MEDIUM**: Missing meta tag: theme-color
- **MEDIUM**: Meta tag value differs: description
- **MEDIUM**: Text content length differs by 10762 characters
- **HIGH**: Missing CSS references: 1 stylesheets
- **LOW**: Extra CSS references: 1 stylesheets
- **HIGH**: Missing JavaScript references: 1 scripts
- **LOW**: Extra JavaScript references: 7 scripts

### archive.html

- **MEDIUM**: nav element count differs: production has 0, local has 1
- **MEDIUM**: section element count differs: production has 0, local has 6
- **LOW**: Extra CSS classes in local: __className_e8ce0c, sidebar, sidebar-inner, sidebar-section, sidebar-heading, post-list, main-content, main-nav, nav-container, nav-brand...
- **HIGH**: Page titles differ
- **MEDIUM**: Meta tag value differs: viewport
- **MEDIUM**: Missing meta tag: theme-color
- **MEDIUM**: Meta tag value differs: description
- **MEDIUM**: Text content length differs by 19879 characters
- **HIGH**: Missing CSS references: 1 stylesheets
- **LOW**: Extra CSS references: 1 stylesheets
- **HIGH**: Missing JavaScript references: 1 scripts
- **LOW**: Extra JavaScript references: 8 scripts

### home.html

- **MEDIUM**: nav element count differs: production has 0, local has 1
- **MEDIUM**: section element count differs: production has 0, local has 2
- **MEDIUM**: article element count differs: production has 0, local has 5
- **LOW**: Extra CSS classes in local: __className_e8ce0c, sidebar, sidebar-inner, sidebar-section, sidebar-heading, post-list, main-content, main-nav, nav-container, nav-brand...
- **HIGH**: Page titles differ
- **MEDIUM**: Meta tag value differs: viewport
- **MEDIUM**: Missing meta tag: theme-color
- **MEDIUM**: Meta tag value differs: description
- **MEDIUM**: Text content length differs by 152784 characters
- **HIGH**: Missing CSS references: 1 stylesheets
- **LOW**: Extra CSS references: 1 stylesheets
- **HIGH**: Missing JavaScript references: 1 scripts
- **LOW**: Extra JavaScript references: 8 scripts

### posts.html

- **MEDIUM**: nav element count differs: production has 0, local has 1
- **MEDIUM**: article element count differs: production has 0, local has 15
- **LOW**: Extra CSS classes in local: __className_e8ce0c, sidebar, sidebar-inner, sidebar-section, sidebar-heading, post-list, main-content, main-nav, nav-container, nav-brand...
- **HIGH**: Page titles differ
- **MEDIUM**: Meta tag value differs: viewport
- **MEDIUM**: Missing meta tag: theme-color
- **MEDIUM**: Meta tag value differs: description
- **MEDIUM**: Text content length differs by 31153 characters
- **LOW**: Extra images in local: 1 images
- **HIGH**: Missing CSS references: 1 stylesheets
- **LOW**: Extra CSS references: 1 stylesheets
- **HIGH**: Missing JavaScript references: 1 scripts
- **LOW**: Extra JavaScript references: 8 scripts

### publications.html

- **MEDIUM**: nav element count differs: production has 0, local has 1
- **MEDIUM**: section element count differs: production has 0, local has 2
- **MEDIUM**: article element count differs: production has 0, local has 6
- **LOW**: Extra CSS classes in local: __className_e8ce0c, sidebar, sidebar-inner, sidebar-section, sidebar-heading, post-list, main-content, main-nav, nav-container, nav-brand...
- **HIGH**: Page titles differ
- **MEDIUM**: Meta tag value differs: viewport
- **MEDIUM**: Missing meta tag: theme-color
- **MEDIUM**: Meta tag value differs: description
- **MEDIUM**: Text content length differs by 24031 characters
- **LOW**: Extra images in local: 6 images
- **HIGH**: Missing CSS references: 1 stylesheets
- **LOW**: Extra CSS references: 1 stylesheets
- **HIGH**: Missing JavaScript references: 1 scripts
- **LOW**: Extra JavaScript references: 7 scripts

### search.html

- **MEDIUM**: nav element count differs: production has 0, local has 1
- **LOW**: Extra CSS classes in local: __className_e8ce0c, sidebar, sidebar-inner, sidebar-section, sidebar-heading, post-list, main-content, main-nav, nav-container, nav-brand...
- **HIGH**: Page titles differ
- **MEDIUM**: Meta tag value differs: viewport
- **MEDIUM**: Missing meta tag: theme-color
- **MEDIUM**: Meta tag value differs: description
- **MEDIUM**: Text content length differs by 6061 characters
- **HIGH**: Missing CSS references: 1 stylesheets
- **LOW**: Extra CSS references: 1 stylesheets
- **HIGH**: Missing JavaScript references: 1 scripts
- **LOW**: Extra JavaScript references: 8 scripts

### talks.html

- **MEDIUM**: nav element count differs: production has 0, local has 1
- **MEDIUM**: article element count differs: production has 0, local has 8
- **LOW**: Extra CSS classes in local: __className_e8ce0c, sidebar, sidebar-inner, sidebar-section, sidebar-heading, post-list, main-content, main-nav, nav-container, nav-brand...
- **HIGH**: Page titles differ
- **MEDIUM**: Meta tag value differs: viewport
- **MEDIUM**: Missing meta tag: theme-color
- **MEDIUM**: Meta tag value differs: description
- **MEDIUM**: Text content length differs by 29812 characters
- **HIGH**: Missing CSS references: 1 stylesheets
- **LOW**: Extra CSS references: 1 stylesheets
- **HIGH**: Missing JavaScript references: 1 scripts
- **LOW**: Extra JavaScript references: 7 scripts

## CSS Differences

### framework

- **HIGH**: Missing CSS frameworks in local: Foundation

### size

- **HIGH**: CSS size differs by -92.92 KB (smaller locally)

### selector

- **HIGH**: Missing CSS selectors in local: 769 selectors

### property

- **MEDIUM**: Missing CSS properties in local: animation, background, border-bottom, border-radius, box-shadow, left, max-width, padding, position, right, top, transform, width, z-index, opacity, border, flex, font-size, border-color, outline, color, cursor, margin-left, transition, align-items, display, gap, margin-top, max-height, overflow-y, text-decoration, font-weight, line-height, height, justify-content, margin-right, backdrop-filter, -webkit-backdrop-filter, -webkit-appearance, appearance, min-height, min-width, -webkit-overflow-scrolling, border-top, text-align, outline-offset, border-width, --sidebar-width, --content-max-width, --content-padding, --color-text, --color-text-light, --color-background, --bg-color-rgb, --color-primary, --color-primary-hover, --color-sidebar-bg, --color-border, --color-border-light, --color-code-bg, --color-tag-bg, --color-tag-text, --color-button-bg, --color-button-hover, --color-block-quote-bg, --card-bg, --card-border, --text-secondary, --tag-bg, --hero-bg, --accent-color, --accent-color-secondary, --accent-color-rgb, --accent-color-dark, --accent-color-light, --text-color, --text-muted, --heading-color, --border-color, --bg-color-translucent, --search-bg, --font-heading, --font-body, --button-bg, --button-hover-bg, --font-size-base, --font-size-small, --font-size-smaller, --font-size-smallest, --line-height-base, --line-height-content, --shadow-small, --shadow-medium, --radius-small, --radius-medium, --radius-large, --radius-full, --spacing-xs, --spacing-sm, --spacing-md, --spacing-lg, --spacing-xl, xl, --transition-fast, --transition-medium, --vh, background-color, font-family, margin, box-sizing, margin-bottom, padding-bottom, flex-wrap, overflow, border-left, flex-shrink, object-fit, flex-grow, text-transform, padding-top, overflow-x, white-space, font-style, grid-template-columns, padding-right, justify-self, bottom, list-style, flex-direction, grid-gap, background-clip, -webkit-background-clip, content, padding-left, order, word-wrap, overflow-wrap, align-self, transform-origin, grid-column, border-left-color, text-overflow, letter-spacing, border-top-color, list-style-type, background-image, background-position, background-repeat, background-size, animation-fill-mode, border-collapse, table-layout, font-feature-settings, border-right, font-variant-numeric, -webkit-user-select, user-select, vertical-align, word-break, animation-delay, cx, cy, r, fill-opacity, stroke-dasharray, pointer-events, filter, object-position, -webkit-hyphens, hyphens, border-bottom-color, border-right-color, overscroll-behavior-y, flex-basis, touch-action

### file

- **HIGH**: Missing CSS files in local: main.da68fc15.css

## Asset Differences

### image

- **LOW**: Extra images in local: 7 images

### font

- **LOW**: Extra fonts in local: 7 fonts

### script

- **HIGH**: Missing scripts in local: 1 scripts
- **LOW**: Extra scripts in local: 11 scripts

### path

- **MEDIUM**: Relative path usage differs significantly

## Recommended Actions

### High Priority (Fix First)
1. Address all HIGH severity issues identified above
2. Focus on missing frameworks and assets first
3. Fix configuration issues that prevent proper builds
4. Resolve missing CSS and JavaScript references

### Medium Priority
1. Review CSS size differences and optimize if needed
2. Align asset loading patterns between environments
3. Update configuration files for better production alignment

### Low Priority
1. Clean up extra assets and references not used in production
2. Optimize build configuration for better performance
3. Consider implementing additional production optimizations

## Next Steps

1. **Fix High Priority Issues**: Start with the most critical differences
2. **Test Changes**: Verify each fix doesn't break existing functionality  
3. **Re-run Analysis**: Use this tool again to verify fixes
4. **Monitor**: Set up regular parity checks to catch future drift

