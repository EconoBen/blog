# Visual Parity Playbook

This document describes how to run, interpret, and act on the CSR visual parity checks between the production site and the local CRA build.

## Overview

- The parity runner renders each route with Puppeteer for:
  - Production: https://econoben.dev
  - Local: http://localhost:3001
- It captures:
  - Rendered HTML (post-hydration)
  - Full-page screenshots
  - Pixel diffs (via pixelmatch)
  - Optional computed-style diagnostics (metrics JSON per route)
- It emits:
  - analysis/production-data/rendered/*.html
  - analysis/local-data/rendered/*.html
  - analysis/production-data/screenshots/*.png
  - analysis/local-data/screenshots/*.png
  - analysis/comparison/screenshots/*-diff.png
  - analysis/comparison/parity-report.json
  - analysis/comparison/PARITY_REPORT.md
  - analysis/*/rendered/*-metrics.json (computed-style diagnostics, when enabled in the runner)

## Prerequisites

- Node 20.x (LTS)
- npm 10.x
- macOS/Linux/Windows supported
- Stable network connectivity (production pages fetched live)

Recommended environment pinning:
- In this repo we assume Node 20 and npm 10 to keep render results consistent across machines/CI.

## Quick Start

1) Install dependencies:
   - npm ci

2) Build a production bundle:
   - npm run build

3) Run the parity runner:
   - npm run parity:run
   - Or skip re-build if you already ran step 2:
     - npm run parity:run:skip-build

The script automatically:
- Launches a static server on :3001 if none is running (npx serve -s build -l 3001)
- Renders the routes defined inside scripts/verification/parity-runner.js
- Writes parity artifacts into analysis/**

## Outputs

After a run, check these:

- analysis/comparison/PARITY_REPORT.md
  - Table of routes with mismatch %, per-route thresholds, pass/fail status
  - Links to production, local, and diff screenshots
  - (Appended) Computed Metrics Diffs for selectors that differ in width/height/line-height/font-size

- analysis/comparison/parity-report.json
  - Machine-readable version of the results

- Screenshots
  - analysis/production-data/screenshots/*.png
  - analysis/local-data/screenshots/*.png
  - analysis/comparison/screenshots/*-diff.png

- Rendered HTML
  - analysis/production-data/rendered/*.html
  - analysis/local-data/rendered/*.html

- Metrics (diagnostics)
  - analysis/*/rendered/*-metrics.json
  - Shows computed CSS metrics (width, height, margins, line-height, font-size) for key selectors

## Interpreting Results

- Mismatch % is computed across the full screenshot via pixelmatch with a small threshold (includeAA enabled).
- Values near 0–0.5% usually indicate excellent parity.
- Larger diffs distributed vertically typically mean:
  - Subtle spacing/line-height cadence differences that accumulate across long pages
  - Text-wrapping behavior differences
  - Occasional asset rendering differences (icons/underlines, etc.)

### Metrics Diffs

When Computed Metrics Diffs section shows no significant discrepancies (e.g., equal widths/line-heights/fonts), remaining differences usually come from:
- Tiny glyph rendering/kerning differences, which we try to normalize
- Composition differences in content blocks (distinct sequences of paragraphs, lists, images, or code blocks)

Use the metrics JSON and rendered HTML together:
- Compare the per-route rendered/*.html (prod vs local)
- Cross-check selectors in *-metrics.json for numeric alignment
- If numeric metrics match, examine any DOM ordering or extra elements around contentious regions

## Acceptance Criteria

- Non-detail (list/index) routes should be ≤0.50% mismatch
- Detail routes (long posts) target ≤1.00% mismatch
- CI should fail if any route exceeds its threshold (see THRESHOLDS inside the runner)

Notes:
- During active tuning, detail routes may have temporary relaxed thresholds (documented and to be tightened back to ≤1.0% before finalizing)

## Troubleshooting

- Local server not detected / port in use
  - Ensure nothing else uses :3001
  - Kill stale serve instances if necessary, then re-run

- Transient fetch errors (e.g., net::ERR_NETWORK_CHANGED)
  - Re-run the parity runner; the production fetch is live and can fail intermittently

- Font/antialiasing differences
  - The runner injects normalization to eliminate most rendering variance
  - If diffs remain, focus on content spacing cadence and code block line-height

- Very long pages / huge screenshots
  - Expect more pixels and thus larger raw mismatch counts for the same percentage
  - Prefer reading mismatch % rather than raw pixel counts

## Typical Workflow

1) Run parity
2) Open PARITY_REPORT.md and view failing routes
3) Inspect diff screenshots for patterns
4) Open rendered HTML for both environments to compare structure/order
5) Review metrics JSON to confirm spacing/line-height/font-size alignment
6) Apply minimal, scoped CSS fixes (prefer scoping under .post-detail to avoid regressions)
7) Re-run parity
8) Tighten thresholds when all routes are within targets

## Scope and Safety

- Prefer the smallest possible changes that fix parity for the affected page structure
- Scope overrides under a wrapper like .post-detail, so list pages and other routes remain unaffected
- Keep overrides non-destructive and easy to revert

## CI Integration (Suggested)

- Create a GitHub Actions workflow to:
  - Setup Node 20/npm 10
  - npm ci
  - npm run build
  - node scripts/verification/parity-runner.js
  - Upload analysis/** as artifacts even on failure
  - Optionally post a PR comment with a table of diffs and links to images
- Gate merges on parity pass

## Extending Coverage

- Add more detail routes in scripts/verification/parity-runner.js ROUTES
- Optionally introduce a routes JSON file and a CLI flag to pass custom route sets

## Flags & Configuration

Currently supported:
- --skip-build (skip CRA build step)

Planned (optional future enhancements):
- --routes path/to/routes.json
- --viewport WxH
- --threshold defaultThreshold
- --only-detail (run detail pages only)
- Retry policy for transient network errors
- Multi-run averaging (flake detection) with stddev in the report

## Style & Cadence Guidelines (for fixes)

- For long posts, normalize:
  - Heading spacing cadence (h2/h3 margins)
  - Paragraph margins
  - Code block margins and line-height
  - Numeric alignment inside code tables (tabular-nums)
- Scope typography normalizations only inside the post content wrapper
- Avoid global changes that can affect list pages or other sections

## Example Commands

- Full run with build:
  - npm run parity:run

- Faster iteration while tuning CSS:
  - npm run parity:run:skip-build

- Inspect results:
  - Open analysis/comparison/PARITY_REPORT.md in your editor
  - Navigate to analysis/…/screenshots for visual diffs
  - Inspect analysis/*/rendered/*.html and *-metrics.json for structure/metrics

## Maintenance Checklist

- Keep Node/npm pinned (engines and .nvmrc recommended)
- Update ROUTES as content evolves
- Commit parity changes along with CSS/component tweaks that resolve mismatches
- Regularly re-run parity before releases