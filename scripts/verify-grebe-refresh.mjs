import assert from 'node:assert/strict';
import { createHash } from 'node:crypto';
import { readFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import sharp from 'sharp';

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
  'public/assets/agent-memory-early-release-banner.jpg',
  'public/assets/grebes/grebe-mascots.png',
  'src/posts/agent-memory-is-in-early-release.md',
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
  launchPost,
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
  read('src/posts/agent-memory-is-in-early-release.md'),
]);

const publicPositioningCopy = `${layout}\n${home}\n${book}`;
assert.doesNotMatch(
  publicPositioningCopy,
  /\b(upcoming|forthcoming)\b/i,
  'Public positioning still calls the book upcoming or forthcoming',
);
assert.match(publicPositioningCopy, /Early Release/);
assert.match(about, /<h1[\s>]/, 'The About page must expose its visible name as the page heading');
assert.match(launchPost, /title: "Agent Memory Is in Early Release"/);
assert.match(launchPost, /date: "2026-07-30T12:00:00-07:00"/);
assert.match(launchPost, /image: "\/assets\/agent-memory-early-release-banner\.jpg"/);
assert.match(
  launchPost,
  /https:\/\/www\.oreilly\.com\/library\/view\/agent-memory\/0642572370473\/\?utm_source=econoben&utm_medium=post&utm_campaign=early_release/,
  'The launch post must link directly to the current O’Reilly book with campaign attribution',
);
assert.match(launchPost, /\[subscribe here\]\(\/book#subscribe\)/);

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
assert.match(editorialFrame, /<SiteMobileMenu/, 'The compact navigation must remain available');
assert.match(await read('app/styles/navigation-refinements.css'), /min-width:1280px[\s\S]*site-mobile-navigation[^}]*display:none/, 'Compact navigation yields to the full desktop header at 1280px');
assert.match(editorialFrame, /xl:flex/, 'The full desktop navigation must wait until it fits');
assert.match(
  editorialFrame,
  /\[\.\.\.primaryNavItems,\s*\.\.\.discoveryNavItems/,
  'The compact navigation must retain Tags and Search',
);
const fieldNotes = await read('app/styles/living-pond.css');
assert.match(grebeField, /pond-swimmer/, 'The grebe field must restore swimming birds');
assert.match(grebeField, /startPondVisits/, 'Background visits must use the bounded scheduler');
assert.match(grebeField, /<ReadingGrebe/);
assert.doesNotMatch(await read('app/components/GrebePond.tsx'), /<ReadingGrebe/, 'The reader should be a passing visitor, not a permanent hero companion');
assert.match(bookData, /num: '03',[\s\S]*?status: 'live'/);
assert.doesNotMatch(`${bookData} ${book} ${home} ${about}`, /Chapter 3 (?:is )?submitted|[Cc]hapters 1 (?:and|&amp;) 2/);
assert.match(fieldNotes, /prefers-reduced-motion:\s*reduce[\s\S]*pond/);
assert.ok(existsSync(path.join(root, 'public/assets/grebes/horned-grebe-engraving.webp')));
assert.match(home, /<GrebePond\s*\/>/, 'The homepage must expose the interactive pond');
assert.match(home, /<FieldPondProvider[\s\S]*?<GrebePond[\s\S]*?<FieldAtlasExplorer[\s\S]*?<\/FieldPondProvider>/, 'Discovery and the atlas must share an essay selection');
assert.doesNotMatch(editorialFrame, /PondMotionToggle/, 'The header must not contain a pond toggle');
const swimmerImage = sharp(path.join(root, 'public/assets/grebes/grebe-swimmers.webp'));
assert.equal((await swimmerImage.metadata()).hasAlpha, true, 'Swimming grebes need genuine alpha, not a white matte');
const swimmerStats = await swimmerImage.stats();
assert.equal(swimmerStats.channels[3].min, 0, 'The swimmer background must include fully transparent pixels');
assert.equal(swimmerStats.channels[3].max, 255, 'The grebe illustration must remain visible');
assert.doesNotMatch(grebeField, /horned-grebe-engraving/, 'White-background hero art must not be used for viewport swimmers');

assert.equal(
  await sha256('public/assets/agent-memory-cover-early-release.png'),
  expectedCoverSha,
  'The authoritative cover source was modified',
);

console.log('Grebe refresh source contracts passed.');
