import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditorialPageFrame } from '../../components/EditorialPageFrame';
import { postService } from '../../services/PostService';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

type Posts = Awaited<ReturnType<typeof postService.getPostsByTag>>;

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
    .map(([year, yearPosts]) => ({
      year,
      posts: yearPosts,
    }));
};

function getRelatedTags(posts: Posts, currentTag: string) {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags
      .filter((tag) => tag.toLowerCase() !== currentTag.toLowerCase())
      .forEach((tag) => {
        counts.set(tag, (counts.get(tag) ?? 0) + 1);
      });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]))
    .slice(0, 6);
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);

  return {
    title: `${tag} | Tags | ECONOBEN.DEV`,
    description: `Browse all posts tagged with "${tag}".`,
  };
}

export async function generateStaticParams() {
  const tags = await postService.getAllTags();
  return tags.map((tagData) => ({
    tag: encodeURIComponent(tagData.tag),
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const posts = await postService.getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  const postsByYear = groupPostsByYear(posts);
  const relatedTags = getRelatedTags(posts, tag);

  return (
    <EditorialPageFrame currentPath="/tags">
      <div className="mx-auto max-w-7xl px-5 py-12 sm:px-6 md:px-8 md:py-20">
        <section className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-start">
          <div className="space-y-10 lg:col-span-8 lg:order-first">
            <div className="max-w-3xl">
              <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                Topic archive
              </span>
              <h1 className="mt-6 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
                {tag}
              </h1>
              <p className="mt-6 max-w-2xl text-base leading-relaxed text-on-surface-variant sm:text-lg md:text-xl">
                {posts.length} post{posts.length === 1 ? '' : 's'} collected under this topic, grouped by year and left fully linked for browsing.
              </p>
            </div>

            <div className="flex flex-wrap gap-2 lg:hidden">
              <Link
                href="/tags"
                className="rounded-full bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container"
              >
                Back to tags
              </Link>
              <Link
                href="/archive"
                className="rounded-full bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container"
              >
                Open archive
              </Link>
              <Link
                href={`/search?q=${encodeURIComponent(tag)}`}
                className="rounded-full bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container"
              >
                Search this topic
              </Link>
            </div>

            <div className="flex flex-wrap gap-2 text-[11px] font-bold uppercase tracking-widest text-secondary lg:hidden">
              <span className="rounded-full bg-surface-container-low px-3 py-1.5">
                {posts.length} post{posts.length === 1 ? '' : 's'}
              </span>
              <span className="rounded-full bg-surface-container-low px-3 py-1.5">
                {postsByYear.length} year{postsByYear.length === 1 ? '' : 's'}
              </span>
              <span className="rounded-full bg-surface-container-low px-3 py-1.5">
                {relatedTags.length} related tag{relatedTags.length === 1 ? '' : 's'}
              </span>
            </div>

            <p className="max-w-2xl text-sm leading-relaxed text-on-surface-variant lg:hidden">
              Use the route chips above to switch surfaces, then scroll the year groups below for the full topic trail.
            </p>

            {postsByYear.map((yearGroup) => (
              <section key={yearGroup.year} className="space-y-5">
                <div className="flex items-end justify-between gap-4 border-b border-outline-variant/10 pb-4">
                  <div>
                    <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                      {yearGroup.year}
                    </h2>
                    <p className="mt-3 font-body text-sm text-on-surface-variant">
                      {yearGroup.posts.length} post{yearGroup.posts.length === 1 ? '' : 's'} in this year.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {yearGroup.posts.map((post) => (
                    <Link
                      key={post.slug}
                      href={`/posts/${post.slug}`}
                      className="group block no-underline"
                      style={{ color: 'inherit', textDecoration: 'none' }}
                    >
                      <article className="sticky-note cursor-pointer px-5 py-5 transition-all duration-300 hover:-translate-y-1 md:px-6 md:py-6">
                        <div className="flex flex-wrap items-center gap-4 font-label text-xs uppercase tracking-widest text-secondary" suppressHydrationWarning>
                          <span>{longDateFormatter.format(post.date)}</span>
                          <span className="h-1 w-1 rounded-full bg-outline-variant" />
                          <span>{post.readingTime ? `${post.readingTime} min read` : `${post.tags.length} tags`}</span>
                        </div>
                        <h3 className="mt-3 font-headline text-2xl font-bold tracking-tight text-on-surface transition-colors group-hover:text-primary md:text-3xl">
                          {post.title}
                        </h3>
                        {post.summary ? (
                          <p className="mt-3 max-w-2xl text-base leading-relaxed text-on-surface-variant">
                            {post.summary}
                          </p>
                        ) : null}
                        <div className="mt-4 flex flex-wrap gap-2">
                          {post.tags.map((postTag) => (
                            <span
                              key={`${post.slug}-${postTag}`}
                              className="rounded-full bg-surface px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary"
                            >
                              {postTag}
                            </span>
                          ))}
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-6 lg:col-span-4 lg:order-last lg:sticky lg:top-32">
            <div className="hidden sticky-note p-6 md:block md:p-8">
              <h2 className="font-headline text-lg font-bold text-on-surface" style={{ marginBottom: '2rem' }}>Topic notes</h2>
              <div className="grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
                {[
                  ['Posts', `${posts.length}`],
                  ['Years covered', `${postsByYear.length}`],
                  ['Related tags', `${relatedTags.length}`],
                ].map(([label, value]) => (
                  <div key={label} className="sticky-note p-4">
                    <span className="block font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
                    <span className="mt-3 block font-body text-lg text-on-surface-variant">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {relatedTags.length > 0 ? (
              <div className="hidden sticky-note p-6 md:block md:p-8">
                <h2 className="font-headline text-lg font-bold text-on-surface" style={{ marginBottom: '1.5rem' }}>Related tags</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map(([relatedTag, count]) => (
                    <Link
                      key={relatedTag}
                      href={`/tags/${encodeURIComponent(relatedTag)}`}
                      className="inline-flex items-center gap-2 rounded-full bg-surface px-3 py-2 font-label text-xs text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-surface-container-high hover:text-on-surface"
                    >
                      <span>{relatedTag}</span>
                      <span className="text-secondary">{count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="hidden sticky-note p-6 md:block md:p-8">
              <h2 className="font-headline text-lg font-bold text-on-surface" style={{ marginBottom: '1.25rem' }}>Browse beyond this topic</h2>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                Switch from this topic trail to the full archive or run a direct search if you want a broader slice of the same material.
              </p>
              <div className="mt-6 flex flex-wrap gap-3">
                <Link href="/archive" className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container">
                  Open archive
                </Link>
                <Link href={`/search?q=${encodeURIComponent(tag)}`} className="rounded-full bg-surface-container-high px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container">
                  Search this topic
                </Link>
              </div>
            </div>
          </aside>
        </section>
      </div>
    </EditorialPageFrame>
  );
}
