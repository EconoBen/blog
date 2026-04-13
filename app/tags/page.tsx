import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService, type Post, type TagCount } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Tags | ECONOBEN.DEV',
  description: 'Browse topics covered across the writing archive.',
};

export default async function TagsPage() {
  const posts = await postService.getAllPosts();
  const tagCountMap = new Map<string, { display: string; count: number }>();

  posts.forEach((post: Post) => {
    post.tags.forEach((tag) => {
      const key = tag.toLowerCase().trim();
      const existing = tagCountMap.get(key);
      if (existing) {
        existing.count += 1;
        // Keep the longer or more capitalized version as display name
        if (tag.length > existing.display.length) existing.display = tag;
      } else {
        tagCountMap.set(key, { display: tag, count: 1 });
      }
    });
  });

  const sortedTags = Array.from(tagCountMap.values())
    .map(({ display, count }): TagCount => ({ tag: display, count }))
    .sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  const topTags = sortedTags.slice(0, 8);

  const tagsByLetter = sortedTags.reduce<Record<string, typeof sortedTags>>((acc, tagEntry) => {
    const letter = tagEntry.tag.charAt(0).toUpperCase();
    acc[letter] ??= [];
    acc[letter].push(tagEntry);
    return acc;
  }, {});

  const sortedLetters = Object.keys(tagsByLetter).sort();

  return (
    <EditorialPageFrame currentPath="/tags">
      <main className="mx-auto min-h-screen max-w-7xl px-8 py-16 md:py-20">
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <div className="space-y-8 lg:col-span-8">
            <div className="max-w-3xl">
              <span className="mb-6 block font-label text-xs font-bold uppercase tracking-widest text-secondary">
                Archive &amp; Taxonomy
              </span>
              <h1 className="font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
                Topic index.
              </h1>
              <p className="mt-6 max-w-2xl text-lg leading-relaxed text-on-surface-variant md:text-xl">
                Browse the archive by subject. The tags stay ranked by use, but the page keeps the hierarchy quiet and practical.
              </p>
            </div>

            <section className="sticky-note p-6 md:p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-headline text-xl font-bold text-on-surface">Top tags</h2>
                  <p className="mt-3 font-body text-sm text-on-surface-variant">
                    {sortedTags.length} tags across {posts.length} post{posts.length === 1 ? '' : 's'}.
                  </p>
                </div>
                <p className="font-body text-sm italic text-secondary">
                  Each tag still links to its own topic trail.
                </p>
              </div>

              <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">
                {topTags.map((tagEntry) => (
                  <Link
                    key={tagEntry.tag}
                    href={`/tags/${encodeURIComponent(tagEntry.tag)}`}
                    className="sticky-note flex items-center justify-between gap-3 px-4 py-3 transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container"
                  >
                    <span className="min-w-0 font-label text-xs font-bold uppercase tracking-wider text-on-surface-variant">
                      {tagEntry.tag}
                    </span>
                    <span className="rounded-full bg-surface-container-lowest px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary">
                      {tagEntry.count}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="sticky-note p-6 md:p-8">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-headline text-xl font-bold text-on-surface">Alphabetical index</h2>
                <div className="flex flex-wrap gap-1">
                  {sortedLetters.map((letter) => (
                    <a
                      key={letter}
                      href={`#tag-letter-${letter}`}
                      className="px-1.5 py-0.5 font-label text-[10px] font-bold uppercase tracking-wider text-secondary transition-all hover:text-primary hover:-translate-y-0.5"
                    >
                      {letter}
                    </a>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
                {sortedLetters.map((letter) => (
                  <div key={letter} id={`tag-letter-${letter}`} className="contents">
                    <span className="pt-1 font-headline text-sm font-black text-on-surface/30">{letter}</span>
                    <div className="flex flex-wrap gap-1.5">
                      {tagsByLetter[letter].map((tagEntry) => (
                        <Link
                          key={tagEntry.tag}
                          href={`/tags/${encodeURIComponent(tagEntry.tag)}`}
                          className="inline-flex items-center gap-1 rounded-full bg-surface-container-low px-2.5 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-primary"
                        >
                          {tagEntry.tag}
                          <span className="text-secondary/60">({tagEntry.count})</span>
                        </Link>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-6 lg:sticky lg:top-32 lg:col-span-4">
            <div className="sticky-note p-6 md:p-8">
              <h2 className="font-headline text-lg font-bold text-on-surface" style={{ marginBottom: '2rem' }}>Tag archive</h2>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ['Total tags', `${sortedTags.length}`],
                  ['Posts covered', `${posts.length}`],
                  ['Top tag count', `${topTags[0]?.count ?? 0}`],
                ].map(([label, value]) => (
                  <div key={label} className="sticky-note p-4">
                    <span className="block font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
                    <span className="mt-3 block font-body text-lg text-on-surface-variant">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="sticky-note p-6 md:p-8">
              <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">Browse routes</h2>
              <div className="flex flex-wrap gap-3">
                <Link href="/archive" className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container">
                  Browse archive
                </Link>
                <Link href="/search" className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container">
                  Search site
                </Link>
              </div>
            </div>

            <div className="sticky-note p-6 md:p-8">
              <h2 className="font-headline text-lg font-bold text-on-surface" style={{ marginBottom: '1.25rem' }}>A useful starting point</h2>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                Pick a high-frequency tag first if you want breadth, or use the alphabetical index when you already know the subject you are chasing.
              </p>
            </div>
          </aside>
        </section>
      </main>
    </EditorialPageFrame>
  );
}
