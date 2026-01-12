# Production Site Analysis Infrastructure

This directory contains tools for systematically analyzing the production site at econoben.dev to identify differences with the local Next.js build.

## Scripts

### `run-analysis.js`
Main orchestrator script that runs the complete production analysis pipeline.

**Usage:**
```bash
npm run analyze-production
```

**What it does:**
1. Captures HTML from all key production pages
2. Downloads and analyzes CSS files
3. Inventories all assets (images, fonts, scripts)
4. Generates comprehensive analysis reports

### `local-build-analyzer.js`
Comprehensive local build analysis tool that mirrors production analysis.

**Usage:**
```bash
# Run complete local analysis
npm run analyze-local

# Run specific phases
npm run analyze-local-build    # Generate build only
npm run analyze-local-html     # Capture HTML only
npm run analyze-local-css      # Analyze CSS only
npm run analyze-local-assets   # Analyze assets only
```

**What it does:**
1. Generates a production-equivalent Next.js build
2. Captures HTML from local pages (requires server running)
3. Analyzes Tailwind output and custom CSS
4. Inventories local assets and build structure
5. Generates comprehensive local analysis reports

### `comprehensive-analyzer.js`
Runs both production and local analysis, then generates comparison reports.

**Usage:**
```bash
npm run analyze-comprehensive
```

**What it does:**
1. Runs complete production site analysis
2. Runs complete local build analysis
3. Compares HTML, CSS, assets, and build structure
4. Generates actionable recommendations for achieving parity

### `capture-production-data.js`
Core data capture script for production site analysis.

**Usage:**
```bash
# Run complete capture
node scripts/production-analysis/capture-production-data.js

# Run specific phases
npm run capture-production-html  # HTML only
node scripts/production-analysis/capture-production-data.js css    # CSS only
node scripts/production-analysis/capture-production-data.js assets # Assets only
```

**Features:**
- Captures HTML from key pages (home, posts, about, archive, etc.)
- Extracts CSS references and downloads stylesheets
- Analyzes asset loading (images, fonts, scripts)
- Handles both external and inline CSS

### `css-analyzer.js`
Detailed CSS analysis tool for framework detection and style analysis.

**Usage:**
```bash
npm run analyze-production-css
# or
node scripts/production-analysis/css-analyzer.js [css-directory]
```

**Features:**
- Detects CSS frameworks (Tailwind, Bootstrap, Foundation, etc.)
- Analyzes selectors, properties, and media queries
- Extracts CSS custom properties (variables)
- Generates detailed CSS usage statistics

## Output Structure

### Production Analysis
All production analysis results are saved to `analysis/production-data/`:

```
analysis/production-data/
├── html/                          # Captured HTML files
│   ├── home.html
│   ├── posts.html
│   ├── about.html
│   └── ...
├── css/                           # Downloaded CSS files
│   ├── main.da68fc15.css
│   └── [page]-inline-[n].css      # Extracted inline styles
├── metadata/                      # Analysis metadata
│   ├── css-references.json        # List of CSS URLs
│   ├── css-analysis.json          # Detailed CSS analysis
│   └── asset-inventory.json       # Complete asset inventory
├── analysis-summary.json          # Basic analysis summary
├── comprehensive-report.json      # Complete analysis data
└── analysis-report.md            # Human-readable report
```

### Local Analysis
All local analysis results are saved to `analysis/local-data/`:

```
analysis/local-data/
├── html/                          # Captured local HTML files
├── css/                           # Local CSS files and build output
│   ├── build-[hash].css          # CSS from Next.js build
│   ├── globals.css               # Custom global CSS
│   ├── tailwind.config.js        # Tailwind configuration
│   └── [page]-inline-[n].css     # Extracted inline styles
├── assets/                        # Asset analysis
├── metadata/                      # Local analysis metadata
│   ├── local-css-analysis.json   # Local CSS analysis
│   └── local-asset-inventory.json # Local asset inventory
├── build-analysis/                # Build structure analysis
│   └── build-structure.json      # Next.js build analysis
└── local-analysis-summary.json   # Local analysis summary
```

### Comparison Analysis
Comparison results are saved to `analysis/comparison/`:

```
analysis/production-data/
├── html/                          # Captured HTML files
│   ├── home.html
│   ├── posts.html
│   ├── about.html
│   └── ...
├── css/                           # Downloaded CSS files
│   ├── main.da68fc15.css
│   └── [page]-inline-[n].css      # Extracted inline styles
├── metadata/                      # Analysis metadata
│   ├── css-references.json        # List of CSS URLs
│   ├── css-analysis.json          # Detailed CSS analysis
│   └── asset-inventory.json       # Complete asset inventory
├── analysis-summary.json          # Basic analysis summary
├── comprehensive-report.json      # Complete analysis data
└── analysis-report.md            # Human-readable report
```

## Key Pages Analyzed

The infrastructure captures data from these production pages:
- Home (`/`)
- Posts (`/posts`)
- About (`/about`)
- Archive (`/archive`)
- Publications (`/publications`)
- Talks (`/talks`)
- Search (`/search`)

### Comparison Analysis
Comparison results are saved to `analysis/comparison/`:

```
analysis/comparison/
├── comprehensive-comparison.json  # Complete comparison data
└── comparison-report.md          # Human-readable comparison report
```

## Requirements Satisfied

This infrastructure satisfies the following requirements from the spec:

- **1.1**: Systematically captures production site data using curl and web scraping
- **1.2**: Implements HTML extraction for key pages and local build analysis
- **1.3**: Builds CSS analysis tools to identify stylesheets and sources for both environments

## Next Steps

After running the analysis:

1. Review the generated `analysis-report.md` for insights
2. Compare the captured data with your local build
3. Use the CSS analysis to identify framework and styling differences
4. Proceed to the next task in the implementation plan

## Troubleshooting

### No CSS files found
- Check that the production site is accessible
- Verify CSS references are being extracted correctly
- Look at the `css-references.json` file to see what was detected

### Missing assets
- Some assets may be loaded dynamically via JavaScript
- Check the asset inventory to see what was detected
- Consider running the analysis on specific pages if needed

### Network issues
- The scripts include retry logic and error handling
- Check your internet connection if downloads fail
- Verify the production URL is accessible