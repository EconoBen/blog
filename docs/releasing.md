# Local verification and approved releases

**Current gate:** no deployments, hosted previews, remote branch updates, merges, or Vercel setting changes without Ben's explicit approval. Git pushes and pull requests can trigger hosted previews, so they are included in this gate. `release:prepare` never publishes.

## Current production — September 10, 2026

Ben explicitly approved deployment through Vercel after the branch push. Production now serves commit `e221eab7878402d012c3a4ff930bbecf318ad07b` through deployment `dpl_HopkTX98TsxzzYAAGa2kXcoqc9iS`, [blog-5j5dgb0p2-bens-projects-0b44e0e4.vercel.app](https://blog-5j5dgb0p2-bens-projects-0b44e0e4.vercel.app). Vercel reported Ready and confirmed `econoben.dev`, `www.econoben.dev` and the project domain aliases. This approval covered this release, not future deployments or a merge into `main`. No dashboard settings were changed.

The clean committed source passed the complete local gate in `econoben-release-QwDz2p`, with build `kw9XJlzQfY3qECA4VjK35` and source-manifest SHA256 `b97dd054d8252fc5890054eb78c5225966e5cd3f4005dfbbfd3a9353c558c5c2`. All 43 source suites, types, build and six served checks passed. All six checks then passed against the final live domain, including 227 internal routes and 28 fragments across 19 articles. The grebe, share-card and icon assets matched reviewed bytes; the corrected recording returned audio with the exact source bytes.

Independent live desktop and phone checks passed full autoplay, Replay, Skip, Book navigation and return home with no repeated autoplay or console/page errors. These checks ran on the first production deployment of the identical application source; the final deployment changes only upload inclusion and documentation. The final live release was also reloaded in the actual in-app browser and its Replay button successfully opened the animation. Replay remains a small control beneath the pond/article card, below the initial phone viewport, and is deliberately hidden for reduced motion. Physical-phone performance and the other native-device limits in the wing QA record remain unverified.

The first upload attempt stopped before deployment because repository CLI 44.7.2 is no longer accepted by Vercel's upload endpoint. The successful releases used the pinned current CLI without changing application dependencies:

```sh
npm exec --yes --package=vercel@59.15.1 -- vercel --prod --yes \
  --scope bens-projects-0b44e0e4 --meta sourceCommit=<approved-full-sha>
```

The first Ready release, `dpl_J8a8StGJGoq9VAHFH74v9aheQUUT` from `158107741df7bae38c3dbbdd87031e14258d1265`, exposed one missing linked recording in the live crawl. `.vercelignore` excluded all MP3 files even though an older article links to `public/assets/2023/01/Sarah_SomebodyLikeYou.mp3`. The exact allowlist exception adds only that 1.7 MB recording; independent CLI-matcher review and the 917-to-918 upload file count confirmed scope. Other audio, video and environment-file handling stays unchanged. Local preparation builds the source snapshot without applying Vercel upload exclusions, so the live link crawl remains necessary.

The previous September 6 production, `dpl_69RwYg9oEMF5i6Bru4mjwykJHcjo` from `608f879b1fe3b6376eb3e9e094f0b39b7e5524e4`, remains retained. Release records, failed and successful check logs, asset hashes and browser evidence are preserved locally under `release-artifacts/2026-09-10-production-deploy/`. The source fix and this documentation are published on the feature branch, whose Git-triggered deployments remain disabled; `main` was not merged. OpenSpec archive remains deferred until branch reconciliation. Issue #81 stays open for the remaining returning-browser migration criteria; fresh production cache-header checks now pass.

## Earlier branch approval and preparation

On September 10, 2026, Ben approved pushing all reviewed changes to `feat/grebe-field-notes`. Deployment and merge approval remain separate. Read-only inspection confirmed Vercel is connected to `EconoBen/blog`, with `main` as its production branch. The branch-specific `git.deploymentEnabled` rule in `vercel.json` prevents this feature branch from creating automatic deployments, following [Vercel's Git configuration](https://vercel.com/docs/project-configuration/git-configuration#git.deploymentenabled). It leaves other branches and manual CLI deployment behavior unchanged; those still require the applicable approval. No Vercel dashboard settings were changed.

## September 10 committed verification

Commit `158107741df7bae38c3dbbdd87031e14258d1265` passed `release:prepare` from a clean working tree on Node 22.14.0. All 43 source suites, type checking, the production build and all six served checks passed. The 922 source files were preserved through install/build, and the local server's build manifest matched the prepared output. Build `OBKdrefMenbf3qo0IdrvA` has source-manifest SHA256 `36d57b4ebff710fe6789858f218b87b4900d31a347cbeb817ea16dfa66e5894e`. The retained local record is `econoben-release-oHUXEQ/release-record.json`.

All 618 application, public-asset and script inputs match the independently reviewed `pGdpjA` preview. Differences from that snapshot are completion documentation and the reviewed feature-branch deployment restriction. The publication audit found no unrelated files or credentials among the pending changes; generated build-file removals are the previously approved cleanup. The Vercel Git rule passed its official property schema and independent review. All eight OpenSpec changes passed strict validation. This verification note is a subsequent documentation-only commit; it does not change the tested application. Production deployment and merging into `main` remain pending separate approval.

## Prepare one reviewable release

Use Node 22 (`nvm use`; `.nvmrc` and `package.json` agree with the production runtime), then run:

```sh
npm run release:prepare -- \
  --rollback-url https://blog-5j5dgb0p2-bens-projects-0b44e0e4.vercel.app \
  --rollback-source e221eab7878402d012c3a4ff930bbecf318ad07b
```

Those rollback values were verified Ready on September 10, 2026 after the live checks above. Before preparing another release, inspect the actual current production deployment read-only and supply its URL and associated source commit. Do not assume this target is still current.

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
4. If the approved release instead uses the CLI, keep Git publishing behavior controlled and deploy only the verified source snapshot from its committed revision. Associate the snapshot with the known `blog` project, then use the pinned CLI command above. This command is intentionally absent from package/Makefile automation.
5. Inspect the Ready deployment and `econoben.dev`/`www.econoben.dev` aliases. Run served cache/social/article/link checks against production, compare the reviewed share image bytes, and manually check the key phone and desktop paths. Record source SHA, deployment ID/URL, aliases, checks and previous deployment in the release record.
6. If key production checks fail, restore the recorded known-good deployment using Vercel's rollback control, then verify the aliases and affected paths again. Do not discard the prior deployment until the new release is confirmed.

Do not close cache issue [#81](https://github.com/EconoBen/blog/issues/81) based on local checks alone; confirm production headers after the approved release. No self-hosted runner is proposed for this public repository.
