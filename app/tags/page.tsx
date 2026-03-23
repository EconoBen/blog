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
  const tagCountMap = new Map<string, number>();

  posts.forEach((post: Post) => {
    post.tags.forEach((tag) => {
      tagCountMap.set(tag, (tagCountMap.get(tag) ?? 0) + 1);
    });
  });

  const sortedTags = Array.from(tagCountMap.entries())
    .map(([tag, count]): TagCount => ({ tag, count }))
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
      <main className="mx-auto min-h-screen max-w-7xl px-8 py-20">
        <section className="mb-16 max-w-3xl">
          <span className="mb-4 block font-label text-xs font-bold uppercase tracking-widest text-secondary">
            Archive &amp; Taxonomy
          </span>
          <h1 className="mb-6 font-headline text-6xl font-black tracking-tight text-on-surface">
            Topic index.
          </h1>
          <p className="max-w-2xl text-xl leading-relaxed text-on-surface-variant">
            Browse the archive by subject. The tags stay ranked by use, but the page keeps the hierarchy quiet and practical.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            <section className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-8">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
                <div>
                  <h2 className="font-headline text-xl font-bold text-on-surface">Top tags</h2>
                  <p className="mt-2 font-body text-sm text-on-surface-variant">
                    {sortedTags.length} tags across {posts.length} post{posts.length === 1 ? '' : 's'}.
                  </p>
                </div>
                <p className="font-body text-sm italic text-secondary">
                  Each tag still links to its own topic trail.
                </p>
              </div>

              <div className="mt-6 flex flex-wrap gap-3">
                {topTags.map((tagEntry) => (
                  <Link
                    key={tagEntry.tag}
                    href={`/tags/${encodeURIComponent(tagEntry.tag)}`}
                    className="inline-flex items-center gap-2 rounded-full bg-surface px-4 py-2 font-label text-xs font-semibold text-on-surface-variant transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                  >
                    <span>{tagEntry.tag}</span>
                    <span className="rounded-full bg-surface-container-lowest px-2 py-0.5 font-bold text-secondary">
                      {tagEntry.count}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section>
              <div className="mb-6 flex items-end justify-between gap-4 border-b border-outline-variant/10 pb-4">
                <div>
                  <h2 className="font-headline text-xl font-bold text-on-surface">Alphabetical index</h2>
                  <p className="mt-2 font-body text-sm text-on-surface-variant">
                    All tags, grouped by first letter, with counts kept visible but understated.
                  </p>
                </div>
              </div>

              <div className="space-y-8">
                {sortedLetters.map((letter) => (
                  <section key={letter} className="border-t border-outline-variant/20 pt-6">
                    <div className="flex items-baseline justify-between gap-4">
                      <h3 className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
                        {letter}
                      </h3>
                      <span className="font-body text-sm italic text-secondary">
                        {tagsByLetter[letter].length} tag{tagsByLetter[letter].length === 1 ? '' : 's'}
                      </span>
                    </div>
                    <div className="mt-4 flex flex-wrap gap-2">
                      {tagsByLetter[letter].map((tagEntry) => (
                        <Link
                          key={tagEntry.tag}
                          href={`/tags/${encodeURIComponent(tagEntry.tag)}`}
                          className="inline-flex items-center gap-2 rounded-md bg-surface-container-low px-3 py-2 font-label text-xs text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                        >
                          <span>{tagEntry.tag}</span>
                          <span className="text-secondary">{tagEntry.count}</span>
                        </Link>
                      ))}
                    </div>
                  </section>
                ))}
              </div>
            </section>
          </div>

          <aside className="space-y-8 lg:col-span-4 lg:sticky lg:top-32">
            <div className="rounded-xl bg-surface-container-highest p-8">
              <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">Tag archive</h2>
              <div className="space-y-4">
                {[
                  ['Total tags', `${sortedTags.length}`],
                  ['Posts covered', `${posts.length}`],
                  ['Top tag count', `${topTags[0]?.count ?? 0}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-on-surface/5 pb-3">
                    <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
                    <span className="font-body text-sm text-on-surface-variant">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-surface-container-low p-8">
              <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">Browse routes</h2>
              <div className="flex flex-col gap-3">
                <Link href="/archive" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Browse archive
                </Link>
                <Link href="/search" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Search site
                </Link>
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant/20 bg-surface p-8">
              <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">A useful starting point</h2>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                Pick a high-frequency tag first if you want breadth, or use the alphabetical index when you already know the subject you are chasing.
              </p>
            </div>
          </aside>
        </div>
      </main>
    </EditorialPageFrame>
  );
}
