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
      <main className="mx-auto max-w-7xl px-8 py-20">
        <section className="mb-16 max-w-3xl">
          <div className="flex flex-col gap-4">
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
              Topic archive
            </span>
            <h1 className="font-headline text-6xl font-black tracking-tighter text-on-surface">
              {tag}
            </h1>
            <p className="max-w-2xl text-xl leading-relaxed text-on-surface-variant">
              {posts.length} post{posts.length === 1 ? '' : 's'} collected under this topic, grouped by year and left fully linked for browsing.
            </p>
          </div>
        </section>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-12 lg:col-span-8">
            {postsByYear.map((yearGroup) => (
              <section key={yearGroup.year} className="space-y-6">
                <div className="flex items-end justify-between gap-4 border-b border-outline-variant/10 pb-4">
                  <div>
                    <h2 className="font-headline text-3xl font-bold tracking-tight text-on-surface">{yearGroup.year}</h2>
                    <p className="mt-2 font-body text-sm text-on-surface-variant">
                      {yearGroup.posts.length} post{yearGroup.posts.length === 1 ? '' : 's'} in this year.
                    </p>
                  </div>
                </div>

                <div className="space-y-4">
                  {yearGroup.posts.map((post) => (
                    <article
                      key={post.slug}
                      className="rounded-xl border border-outline-variant/10 bg-surface-container-low px-6 py-6 transition-colors hover:bg-surface-container-high"
                    >
                      <div className="flex flex-col gap-4">
                        <div className="flex flex-wrap items-center gap-4 font-label text-xs uppercase tracking-widest text-secondary">
                          <span>{longDateFormatter.format(post.date)}</span>
                          <span className="h-1 w-1 rounded-full bg-outline-variant" />
                          <span>{post.readingTime ? `${post.readingTime} min read` : `${post.tags.length} tags`}</span>
                        </div>
                        <h3 className="font-headline text-3xl font-bold tracking-tight text-on-surface">
                          <Link href={`/posts/${post.slug}`} className="transition-colors hover:text-primary">
                            {post.title}
                          </Link>
                        </h3>
                        {post.summary ? (
                          <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant">
                            {post.summary}
                          </p>
                        ) : null}
                        <div className="flex flex-wrap gap-2">
                          {post.tags.map((postTag) => (
                            <Link
                              key={`${post.slug}-${postTag}`}
                              href={`/tags/${encodeURIComponent(postTag)}`}
                              className="rounded-sm bg-surface px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                            >
                              {postTag}
                            </Link>
                          ))}
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <aside className="space-y-8 lg:col-span-4 lg:sticky lg:top-32">
            <div className="rounded-xl bg-surface-container-highest p-8">
              <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">Topic notes</h2>
              <div className="space-y-4">
                {[
                  ['Posts', `${posts.length}`],
                  ['Years covered', `${postsByYear.length}`],
                  ['Related tags', `${relatedTags.length}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-start justify-between gap-4 border-b border-on-surface/5 pb-3">
                    <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
                    <span className="font-body text-sm text-on-surface-variant">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            {relatedTags.length > 0 ? (
              <div className="rounded-xl bg-surface-container-low p-8">
                <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">Related tags</h2>
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map(([relatedTag, count]) => (
                    <Link
                      key={relatedTag}
                      href={`/tags/${encodeURIComponent(relatedTag)}`}
                      className="inline-flex items-center gap-2 rounded-md bg-surface px-3 py-2 font-label text-xs text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
                    >
                      <span>{relatedTag}</span>
                      <span className="text-secondary">{count}</span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-xl border border-outline-variant/20 bg-surface p-8">
              <h2 className="mb-4 font-headline text-lg font-bold text-on-surface">Browse beyond this topic</h2>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant">
                Switch from this topic trail to the full archive or run a direct search if you want a broader slice of the same material.
              </p>
              <div className="mt-6 flex flex-col gap-3">
                <Link href="/archive" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Open archive
                </Link>
                <Link href={`/search?q=${encodeURIComponent(tag)}`} className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Search this topic
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </EditorialPageFrame>
  );
}
