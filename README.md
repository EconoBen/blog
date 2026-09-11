# econoben.dev

Ben Labaschin's writing, talks, and *Agent Memory* book site. Built with Next.js 16, React 19 and TypeScript, with Markdown articles, search, existing article audio, and the naturalist grebe identity.

## Local development

Use Node 22 (matching Vercel) and the committed npm lockfile:

```sh
nvm use
npm ci
npm run dev
```

Open the localhost address printed by Next. Ordinary site development does not require API credentials. Copy only needed values into an ignored `.env.local` when working on optional content pipelines. Keep credentials outside Git and release snapshots.

```sh
npm test            # Source and mocked interaction regressions
npm run typecheck   # Generate route types, then check TypeScript
npm run build       # Local build; preserves all source assets
npm start           # Serve the local production build
```

`make build` follows the same source-preserving build. It does not fetch or rewrite Gists. Fetching content, optimizing originals, generating audio, and uploading media remain explicit content-maintenance commands.

## Release review

**Do not deploy or push changes that could deploy without Ben's approval.** The local preparation command installs the lockfile in a disposable snapshot, runs checks/build/served verification, and records exact source and rollback evidence:

```sh
npm run release:prepare -- --rollback-url https://<ready-deployment>.vercel.app --rollback-source <full-source-sha>
```

See [the release procedure](docs/releasing.md) for current rollback values, local visual review, cache limitations, and the branch/Vercel reconciliation plan. Preparation does not publish. Legacy `make deploy` and `make deploy-prod` stop with the approval guidance.

## Project layout

- `app/`: routes, components, shared configuration and styles.
- `src/posts/`: Markdown articles and metadata.
- `services/` and `app/services/`: content loading and discovery.
- `public/`: published images, cover artwork, icons and other static files.
- `scripts/`: verification and explicit content processing.
- `openspec/`: approved proposals, requirements, tasks and execution records.
- `design/social/`: sharing artwork sources, provenance and reproduction commands.

Generated `.next`, `next-env.d.ts`, TypeScript incremental caches, local dependencies, and local release artifacts are ignored. Builds keep original images and videos intact; `.vercelignore` controls upload exclusions.

## Content maintenance

Add Markdown under `src/posts/` following existing frontmatter and naming patterns. Preserve published slugs when editing an article. Preview article headings, audio availability, related-reading reasons and topic pages before releasing.

Useful explicit commands:

```sh
npm run fetch-gists
npm run optimize-images
npm run process-pdfs
npm run generate-audio
npm run upload-audio
```

Audio generation uses OpenAI and uploads use S3. These commands may incur charges or change remote assets, so they are deliberately excluded from build and verification. Existing audio plays only after a reader starts it.

## Documentation and checks

Read `AGENTS.md` and the installed Next documentation before framework changes. Keep OpenSpec tasks current. Tests run through `npm test`; scripts requiring a served site run in `release:prepare`. There is no configured working ESLint installation currently, and the release gate does not claim a lint result. Dependency maintenance is tracked separately in [issue 80](https://github.com/EconoBen/blog/issues/80).
