import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Posts | ECONOBEN.DEV',
  description: 'Essays, reports, and field notes on AI systems, developer tooling, and applied economics.',
};

type Posts = Awaited<ReturnType<typeof postService.getAllPosts>>;
type Post = Posts[number];

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const countTags = (posts: Posts) => {
  const counts = new Map<string, { tag: string; count: number; samplePosts: Post[] }>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const existing = counts.get(tag) ?? { tag, count: 0, samplePosts: [] };
      existing.count += 1;
      if (existing.samplePosts.length < 2 && !existing.samplePosts.some((s) => s.slug === post.slug)) {
        existing.samplePosts.push(post);
      }
      counts.set(tag, existing);
    });
  });

  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
};

const groupPostsByYear = (posts: Posts) => {
  const groups = new Map<number, Posts>();
  posts.forEach((post) => {
    const year = post.date.getFullYear();
    const yearPosts = groups.get(year) ?? [];
    yearPosts.push(post);
    groups.set(year, yearPosts);
  });
  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, yearPosts]) => ({ year, posts: yearPosts }));
};

const primaryTag = (post: Post) => post.tags[0] ?? 'Editorial';

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const tagStats = countTags(posts);
  const topTags = tagStats.slice(0, 4);
  const postsByYear = groupPostsByYear(posts);

  return (
    <EditorialPageFrame currentPath="/posts">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1440px] px-8 pb-12 pt-14 md:pb-16 md:pt-20">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Reading archive</p>
        <h1 className="mt-4 max-w-3xl font-headline text-4xl font-black tracking-tight text-on-surface md:text-6xl">
          Posts
        </h1>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-secondary">
          Essays, reports, and field notes on AI systems, developer tooling, and applied economics
        </p>
        <div className="mt-6 flex flex-wrap gap-3">
          <Link href={`/posts/${posts[0]?.slug}`} className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
            Read latest post
          </Link>
          <Link href="/archive" className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
            Open archive
          </Link>
        </div>
      </section>

      {/* ── All posts by year ── */}
      <section className="border-t border-outline-variant/20 py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-8">
          <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">All posts</p>
            <p className="font-label text-[10px] uppercase tracking-widest text-secondary">{posts.length} posts across {postsByYear.length} years</p>
          </div>

          <div className="space-y-8">
            {postsByYear.map(({ year, posts: yearPosts }) => {
              const yearTopics = countTags(yearPosts).slice(0, 3);

              return (
                <div key={year}>
                  <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-outline-variant/20 pb-3">
                    <h2 className="font-headline text-xl font-bold text-on-surface">{year}</h2>
                    <div className="flex flex-wrap gap-2">
                      {yearTopics.map(({ tag }) => (
                        <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-6">
                    {yearPosts.map((post) => (
                      <article
                        key={post.slug}
                        className="group overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1 lg:grid lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]"
                      >
                        {/* Left: cover image or gradient placeholder */}
                        <div className="min-h-[180px] bg-surface-container-low lg:min-h-full">
                          {(post.coverImage || post.image) ? (
                            <img
                              src={(post.coverImage || post.image)!}
                              alt={post.title}
                              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                            />
                          ) : (
                            <div className="flex h-full min-h-[180px] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(220,229,255,0.5),_transparent_36%),linear-gradient(135deg,_#fef9ef,_#ede8de)] p-8">
                              <div className="max-w-xs space-y-2 text-center">
                                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">{primaryTag(post)}</p>
                                <p className="font-headline text-xl font-bold text-on-surface">{post.title}</p>
                              </div>
                            </div>
                          )}
                        </div>

                        {/* Right: content */}
                        <div className="space-y-5 p-8">
                          <div className="flex flex-wrap items-start justify-between gap-4">
                            <div className="space-y-2">
                              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{primaryTag(post)}</p>
                              <h3 className="font-headline text-2xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
                                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                              </h3>
                            </div>
                            <time className="font-label text-[10px] uppercase tracking-widest text-secondary">{shortDateFormatter.format(post.date)}</time>
                          </div>

                          {post.summary && (
                            <p className="font-body text-lg leading-relaxed text-secondary">{post.summary}</p>
                          )}

                          <div className="flex flex-wrap gap-2">
                            {post.tags.slice(0, 5).map((tag) => (
                              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
                                {tag}
                              </Link>
                            ))}
                          </div>

                          <div className="flex flex-wrap gap-3 pt-1">
                            <Link href={`/posts/${post.slug}`} className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
                              Read the post
                            </Link>
                            {post.readingTime && (
                              <span className="inline-flex items-center font-label text-[10px] uppercase tracking-widest text-secondary">
                                {post.readingTime} min read
                              </span>
                            )}
                          </div>
                        </div>
                      </article>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Topics ── */}
      <section className="border-t border-outline-variant/20 py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-8">
          <p className="mb-8 font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Recurring topics</p>

          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topTags.map(({ tag, count, samplePosts }) => (
              <article key={tag} className="group overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest p-6 shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{count} posts</p>
                  <h3 className="font-headline text-xl font-bold text-on-surface transition-colors group-hover:text-primary">
                    <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                  </h3>
                  {samplePosts[0]?.summary && (
                    <p className="line-clamp-3 font-body text-sm leading-relaxed text-secondary">{samplePosts[0].summary}</p>
                  )}
                  <Link href={`/tags/${encodeURIComponent(tag)}`} className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
                    View all
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
