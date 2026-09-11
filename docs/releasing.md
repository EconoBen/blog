# Local verification and approved releases

**Current gate:** no deployments, hosted previews, remote branch updates, merges, or Vercel setting changes without Ben's explicit approval. Git pushes and pull requests can trigger hosted previews, so they are included in this gate. `release:prepare` never publishes.

On September 10, 2026, Ben approved pushing all reviewed changes to `feat/grebe-field-notes`. Deployment and merge approval remain separate. Read-only inspection confirmed Vercel is connected to `EconoBen/blog`, with `main` as its production branch. The branch-specific `git.deploymentEnabled` rule in `vercel.json` prevents this feature branch from creating automatic deployments, following [Vercel's Git configuration](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled). It leaves other branches and manual CLI deployment behavior unchanged; those still require the applicable approval. No Vercel dashboard settings were changed.

## Prepare one reviewable release

Use Node 22 (`nvm use`; `.nvmrc` and `package.json` agree with the production runtime), then run:

```sh
npm run release:prepare -- \
  --rollback-url https://blog-f15m2kk7r-bens-projects-0b44e0e4.vercel.app \
  --rollback-source 608f879b1fe3b6376eb3e9e094f0b39b7e5524e4
```

Those rollback values were verified Ready on September 6, 2026. Before preparing another release, inspect the actual current production deployment read-only and supply its URL and associated source commit. Do not assume this historical target is still current.

The command copies current tracked and untracked source into a disposable directory, excludes all environment files, dependencies, build output, and Vercel linkage, and records a SHA256 manifest. It installs the exact lockfile with `npm ci`, runs source regressions and generated-route TypeScript checking, builds, verifies source bytes were preserved, and starts a temporary local production server. Served checks cover cache/revalidation, share metadata/assets, article delivery/fragments, and internal links. The command rejects an occupied local port, waits for its own server process to announce readiness, and compares the served build identifier and manifest bytes against the snapshot before accepting HTTP checks. Readiness has a bounded timeout. The temporary server stops even on failure. Tests mock subscription transport; the gate does not send signups or generate content through paid APIs.

The retained directory contains the source snapshot, per-check logs, `source-manifest.json`, and `release-record.json`. A dirty-worktree preparation identifies both its base commit and exact snapshot hashes; it is not presented as a test of the base commit alone. Review the local pages, then commit coherent source and rerun preparation for the approved final revision. Application changes after preparation invalidate that verification. Documentation-only release notes do not change the built application, but their commit should be recorded separately.

For a local visual review, run `npm start -- --hostname 127.0.0.1 --port 3111` inside the reported snapshot. This does not create a hosted preview. Stop that server when review finishes.

The gate does not yet run a complete browser accessibility audit or cross-browser matrix. Add recorded desktop/phone, keyboard and reduced-motion review before requesting approval. Dependency advisories are tracked separately in [#80](https://github.com/EconoBen/blog/issues/80); the gate does not claim they are resolved. There is no functioning repository ESLint installation, so the gate names the tests/types/build checks it actually runs instead of claiming lint passed.

## Cache ownership

`next.config.ts` keeps output tracing inside this standalone app, so an unrelated parent lockfile cannot widen its dependency boundary. It owns custom cache and security headers; `vercel.json` supplies build/install settings and the feature branch's automatic-deployment restriction. Editable article and media URLs revalidate; their content can change at the same URL. Framework-fingerprinted `/_next/static` files retain Next's immutable caching. Do not add a broad immutable header at Vercel, middleware, or the domain layer.

Previously cached responses that already advertised a year of browser freshness cannot be recalled by new server headers. A user with an old cached article may need a reload that bypasses cache once. Versioned share/icon filenames address that asset case; future editable responses will revalidate. The post-deployment check must inspect actual response headers because hosted routing can differ from `next start`.

`npm run build` only reports build sizes. It preserves `public/assets/originals`, videos and framework output. Large upload exclusions remain in `.vercelignore`; never implement them by deleting source. `.next`, `next-env.d.ts`, and TypeScript incremental caches are reproducible and are no longer tracked.

## Reconciliation plan held for approval

Read-only baseline on September 6, 2026 (`git ls-remote`, `vercel inspect`, and `vercel project inspect`; no settings changed):

| Item | Verified baseline | Intended state after approval |
| --- | --- | --- |
| GitHub `main` | `24e82a1223945e6e5d1548953c634d833fab3928` | Contains the reviewed feature branch through a merge commit |
| GitHub feature branch | `feat/grebe-field-notes`, `8b8c4485135e78476d1ff5d857b101a67706c82e` before this local initiative | Includes the new coherent source and release evidence |
| Current production source | `608f879b1fe3b6376eb3e9e094f0b39b7e5524e4` | Exactly the approved, verified source |
| Current production deployment | `dpl_69RwYg9oEMF5i6Bru4mjwykJHcjo` | Retained as a known-good rollback target |
| Vercel project/scope | `blog` / `bens-projects-0b44e0e4` | Same project and domains |
| Vercel framework setting | Create React App; repo overrides Next.js | Next.js, matching repository |
| Install/build/output | `npm install --legacy-peer-deps` / `npm run build` / no output override | `npm ci` / `npm run build` / `.next` |
| Runtime | Vercel Node 22; local default was Node 25 | Node 22, confirmed in evidence |

After approval, perform these steps deliberately; none is executed by preparation:

1. Refresh remote branch/deployment information read-only. Inspect the diff between current `main` and approved feature source, confirm no new remote work was missed, and recheck the current Git integration's production-branch/preview settings. Identify which push/merge would deploy before publishing anything.
2. Align the existing Vercel project's Framework Preset to Next.js, Node.js version to 22.x, and build/install/output values with `vercel.json`. Remove redundant dashboard overrides where Vercel supports inheritance. Keep project, domains and environment variables unchanged. Re-read the settings to confirm the resulting values.
3. Push only the reviewed branch/source and create the PR if the approval covers the resulting preview. Include local verification and independent review evidence. Merge using a merge commit after required checks/review are satisfied; never force-push `main`. An approved Git-triggered production deployment can be the release. Avoid also sending a duplicate CLI deployment.
4. If the approved release instead uses the CLI, keep Git publishing behavior controlled and deploy only the verified source snapshot from its committed revision. Associate the snapshot with the known `blog` project, then run `vercel --prod --yes --scope bens-projects-0b44e0e4 --meta sourceCommit=<approved-full-sha>`. This command is intentionally absent from package/Makefile automation.
5. Inspect the Ready deployment and `econoben.dev`/`www.econoben.dev` aliases. Run served cache/social/article/link checks against production, compare the reviewed share image bytes, and manually check the key phone and desktop paths. Record source SHA, deployment ID/URL, aliases, checks and previous deployment in the release record.
6. If key production checks fail, restore the recorded known-good deployment using Vercel's rollback control, then verify the aliases and affected paths again. Do not discard the prior deployment until the new release is confirmed.

Do not close cache issue [#81](https://github.com/EconoBen/blog/issues/81) based on local checks alone; confirm production headers after the approved release. No self-hosted runner is proposed for this public repository.
