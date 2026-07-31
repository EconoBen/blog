import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';

const root = process.cwd();
const read = (relativePath) => readFile(path.join(root, relativePath), 'utf8');
const sha256 = async (relativePath) => {
  const contents = await readFile(path.join(root, relativePath));
  return createHash('sha256').update(contents).digest('hex');
};

const expectedCoverSha =
  '3d60db306f84a32f09604ffa852ee5c55ccf756682e7323114857ef1c98ff300';

const requiredFiles = [
  'app/book/bookData.ts',
  'app/components/BookCover.tsx',
  'app/components/GrebeField.tsx',
  'app/components/TrackedAction.tsx',
  'public/assets/agent-memory-cover-early-release.png',
  'public/assets/grebes/grebe-mascots.png',
];

for (const relativePath of requiredFiles) {
  assert.ok(existsSync(path.join(root, relativePath)), `Missing ${relativePath}`);
}

const [
  layout,
  home,
  book,
  bookData,
  subscribe,
  editorialFrame,
  grebeField,
  trackedAction,
  globals,
  about,
] = await Promise.all([
  read('app/layout.tsx'),
  read('app/components/ShellHomePage.tsx'),
  read('app/book/page.tsx'),
  read('app/book/bookData.ts'),
  read('app/components/SubscribeForm.tsx'),
  read('app/components/EditorialPageFrame.tsx'),
  read('app/components/GrebeField.tsx'),
  read('app/components/TrackedAction.tsx'),
  read('app/globals.css'),
  read('app/about/page.tsx'),
]);

const publicPositioningCopy = `${layout}\n${home}\n${book}`;
assert.doesNotMatch(
  publicPositioningCopy,
  /\b(upcoming|forthcoming)\b/i,
  'Public positioning still calls the book upcoming or forthcoming',
);
assert.match(publicPositioningCopy, /Early Release/);
assert.match(about, /<h1[\s>]/, 'The About page must expose its visible name as the page heading');

assert.match(layout, /<Analytics\s*\/>/, 'Vercel Analytics is not mounted');
assert.equal(
  (layout.match(/<Analytics\s*\/>/g) ?? []).length,
  1,
  'Vercel Analytics must be mounted exactly once',
);

for (const eventName of [
  'homepage_book_click',
  'oreilly_read_click',
  'oreilly_trial_click',
]) {
  assert.match(
    `${home}\n${book}\n${trackedAction}`,
    new RegExp(eventName),
    `Missing analytics event ${eventName}`,
  );
}
assert.match(subscribe, /newsletter_subscribe_success/);
assert.doesNotMatch(subscribe, /track\([^)]*email/s, 'Analytics must not include email');

assert.match(
  bookData,
  /part:\s*['"]I['"][\s\S]*num:\s*['"]03['"]/,
  'Chapter 3 must be in Part I',
);
assert.match(
  bookData,
  /part:\s*['"]II['"][\s\S]*num:\s*['"]04['"]/,
  'Chapter 4 must open Part II',
);
assert.ok(
  bookData.indexOf("part: 'I'") < bookData.indexOf("num: '03'") &&
    bookData.indexOf("num: '03'") < bookData.indexOf("part: 'II'") &&
    bookData.indexOf("part: 'II'") < bookData.indexOf("num: '04'"),
  'Chapter ordering does not match the current manuscript structure',
);

assert.match(
  bookData,
  /https:\/\/www\.oreilly\.com\/library\/view\/agent-memory\/0642572370473\//,
);
assert.match(bookData, /utm_source=econoben/);
assert.match(bookData, /utm_campaign=early_release/);

assert.equal(
  (editorialFrame.match(/id=["']subscribe["']/g) ?? []).length,
  1,
  'EditorialPageFrame must own exactly one subscribe target',
);
assert.equal(
  (book.match(/id=["']subscribe["']/g) ?? []).length,
  0,
  'BookPage must not add a second subscribe target',
);

assert.match(subscribe, /subscribe-controls/);
assert.match(globals, /\.subscribe-controls/);
assert.match(globals, /@media\s*\(max-width:\s*520px\)[\s\S]*\.subscribe-controls/);
assert.match(
  globals,
  /@media\s*\(max-width:\s*520px\)[\s\S]*\.subscribe-input\s*\{[\s\S]*flex:\s*0 1 auto/,
  'The stacked mobile email field must not inherit a 16rem vertical flex basis',
);

assert.match(grebeField, /aria-hidden=["']true["']/);
assert.match(grebeField, /pointer-events-none/);
assert.match(grebeField, /'home'\s*\|\s*'book'\s*\|\s*'site'/);
assert.match(editorialFrame, /<GrebeField variant=\{grebeVariant\}\s*\/>/);
assert.match(editorialFrame, /xl:hidden/, 'The compact navigation must remain available below the 1280px desktop breakpoint');
assert.match(editorialFrame, /xl:flex/, 'The full desktop navigation must wait until it fits');
assert.match(
  editorialFrame,
  /\[\.\.\.primaryNavItems,\s*\.\.\.discoveryNavItems\]/,
  'The compact navigation must retain Tags and Search',
);
assert.match(globals, /@keyframes\s+grebe-cross-a[\s\S]*122vw/);
assert.match(globals, /@keyframes\s+grebe-cross-b[\s\S]*-122vw/);
assert.match(globals, /prefers-reduced-motion:\s*reduce[\s\S]*grebe/);

assert.equal(
  await sha256('public/assets/agent-memory-cover-early-release.png'),
  expectedCoverSha,
  'The authoritative cover source was modified',
);

console.log('Grebe refresh source contracts passed.');
