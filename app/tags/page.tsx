import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Tags | ECONOBEN.DEV',
  description: 'Browse topics covered across the writing archive.',
};

export default async function TagsPage() {
  const posts = await postService.getAllPosts();
  const allTags = await postService.getAllTags();
  const sortedTags = [...allTags].sort((a, b) => b.count - a.count || a.tag.localeCompare(b.tag));
  const [primaryTag, secondaryTag, ...remainingTags] = sortedTags;
  const topTags = sortedTags.slice(0, 8);

  const tagsByLetter = remainingTags.reduce<Record<string, typeof remainingTags>>((acc, tagEntry) => {
    const letter = tagEntry.tag.charAt(0).toUpperCase();
    acc[letter] ??= [];
    acc[letter].push(tagEntry);
    return acc;
  }, {});

  const sortedLetters = Object.keys(tagsByLetter).sort();

  return (
    <EditorialPageFrame currentPath="/tags">
      <main className="mx-auto min-h-screen max-w-7xl px-8 py-20">
        <section className="mb-20 max-w-3xl">
          <span className="mb-4 block font-label text-xs font-bold uppercase tracking-widest text-secondary">
            Archive &amp; Taxonomy
          </span>
          <h1 className="mb-6 font-headline text-6xl font-black tracking-tight text-on-surface">
            Topic Index
          </h1>
          <p className="text-xl leading-relaxed text-on-surface-variant">
            Browse the archive by subject, with the most-used topics surfaced first and every tag still linking through to its own post trail.
          </p>
        </section>

        <div className="grid grid-cols-1 gap-8 md:grid-cols-12">
          {primaryTag ? (
            <Link
              href={`/tags/${encodeURIComponent(primaryTag.tag)}`}
              className="cursor-pointer rounded-xl bg-surface-container-highest p-10 transition-colors hover:bg-surface-container-high md:col-span-8"
            >
              <div className="mb-8 flex items-start justify-between gap-6">
                <span className="rounded-full bg-primary px-3 py-1 font-label text-xs font-bold text-on-primary">
                  MOST USED
                </span>
                <span className="font-headline text-4xl font-bold text-on-surface">{primaryTag.count}</span>
              </div>
              <h2 className="mb-4 font-headline text-4xl font-extrabold transition-colors hover:text-primary">
                {primaryTag.tag}
              </h2>
              <p className="max-w-xl text-lg text-on-surface-variant">
                The densest topic cluster in the archive, currently spanning {primaryTag.count} post{primaryTag.count === 1 ? '' : 's'}.
              </p>
              <div className="mt-12 flex flex-wrap gap-3">
                {posts
                  .filter((post) => post.tags.includes(primaryTag.tag))
                  .slice(0, 4)
                  .map((post) => (
                    <span
                      key={post.slug}
                      className="rounded bg-secondary-container px-2 py-1 font-label text-[10px] uppercase tracking-tighter text-on-secondary-container"
                    >
                      {post.title}
                    </span>
                  ))}
              </div>
            </Link>
          ) : null}

          {secondaryTag ? (
            <Link
              href={`/tags/${encodeURIComponent(secondaryTag.tag)}`}
              className="rounded-xl border border-outline-variant/10 bg-surface-container-low p-10 transition-colors hover:bg-surface-container-high md:col-span-4"
            >
              <div className="mb-8 flex justify-between">
                <span className="font-headline text-3xl font-bold text-secondary">{secondaryTag.count}</span>
              </div>
              <h2 className="mb-4 font-headline text-3xl font-extrabold text-on-surface">
                {secondaryTag.tag}
              </h2>
              <p className="text-on-surface-variant">
                Another high-signal topic area that stays one click away from the underlying posts.
              </p>
              <span className="mt-8 inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary">
                Explore topic
              </span>
            </Link>
          ) : null}

          <div className="mt-12 md:col-span-12">
            <div className="mb-8 flex flex-col gap-4 border-b border-outline-variant/10 pb-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <h3 className="font-headline text-xl font-bold text-on-surface">Alphabetical Index</h3>
                <p className="mt-2 font-body text-sm text-on-surface-variant">
                  {sortedTags.length} tags across {posts.length} post{posts.length === 1 ? '' : 's'}.
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                {topTags.map((tagEntry) => (
                  <Link
                    key={tagEntry.tag}
                    href={`/tags/${encodeURIComponent(tagEntry.tag)}`}
                    className="rounded-full bg-surface-container-low px-3 py-1.5 font-label text-xs font-semibold text-secondary transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                  >
                    {tagEntry.tag}
                  </Link>
                ))}
              </div>
            </div>

            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {sortedLetters.map((letter) => (
                <section key={letter} className="rounded-xl bg-surface p-6">
                  <h4 className="mb-4 font-headline text-lg font-bold text-on-surface">{letter}</h4>
                  <div className="space-y-3">
                    {tagsByLetter[letter].map((tagEntry) => (
                      <Link
                        key={tagEntry.tag}
                        href={`/tags/${encodeURIComponent(tagEntry.tag)}`}
                        className="flex items-center justify-between border-b border-outline-variant/10 pb-3 transition-colors hover:text-primary"
                      >
                        <span className="font-headline font-semibold text-on-surface">{tagEntry.tag}</span>
                        <span className="rounded bg-surface-container-highest px-2 py-1 font-label text-xs text-secondary">
                          {tagEntry.count}
                        </span>
                      </Link>
                    ))}
                  </div>
                </section>
              ))}
            </div>
          </div>
        </div>

        <section className="mx-auto mt-32 max-w-4xl rounded-xl border border-outline-variant/20 bg-surface-container-low p-12 text-center">
          <h3 className="mb-4 font-headline text-2xl font-bold text-on-surface">Need a broader route in?</h3>
          <p className="mb-8 font-body text-lg italic text-on-surface-variant">
            Move from tags into the full archive or search the site directly if you know the subject already.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link
              href="/archive"
              className="rounded-md bg-primary-container px-6 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-primary"
            >
              Browse archive
            </Link>
            <Link
              href="/search"
              className="rounded-md border border-outline-variant bg-surface px-6 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-surface-container-high"
            >
              Search site
            </Link>
          </div>
        </section>
      </main>
    </EditorialPageFrame>
  );
}
