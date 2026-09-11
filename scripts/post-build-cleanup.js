#!/usr/bin/env node

// Historical command name retained for callers. A build must never delete source
// assets or alter the framework output; upload exclusions belong in .vercelignore.
const fs = require('node:fs');
const path = require('node:path');

function directoryBytes(directory) {
  if (!fs.existsSync(directory)) return 0;
  return fs.readdirSync(directory, { withFileTypes: true }).reduce((total, entry) => {
    const file = path.join(directory, entry.name);
    return total + (entry.isDirectory() ? directoryBytes(file) : entry.isFile() ? fs.statSync(file).size : 0);
  }, 0);
}

for (const directory of [process.env.BLOG_BUILD_DIR || '.next', 'public']) {
  const bytes = directoryBytes(path.join(__dirname, '..', directory));
  console.log(`${directory}: ${(bytes / 1024 / 1024).toFixed(1)} MiB`);
}
console.log('Build size report complete. Source assets and build output were preserved.');
