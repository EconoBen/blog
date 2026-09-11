import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

// Source regressions use fixtures/mocks. Served checks belong to release:prepare,
// which supplies the disposable local production server explicitly.
const served = new Set(['verify-article-fragments.mjs', 'verify-reader-delivery.mjs', 'verify-site-links.mjs', 'verify-served-cache.mjs', 'verify-served-topics.mjs']);
const files = fs.readdirSync('scripts').filter(file => /^verify-.*\.mjs$/.test(file) && file !== 'verify-source.mjs' && !served.has(file)).sort();
const env = { ...process.env };
delete env.SITE_URL;
for (const file of files) {
  console.log(`\nChecking ${file}`);
  const result = spawnSync(process.execPath, [`scripts/${file}`], { env, stdio: 'inherit', timeout: 60_000 });
  if (result.status !== 0) {
    console.error(result.error?.message ?? `${file} failed`);
    process.exit(1);
  }
}
console.log(`\nAll ${files.length} source regression scripts passed.`);
