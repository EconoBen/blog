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
  const [featuredPost, ...remainingPosts] = posts;
  const relatedTags = getRelatedTags(posts, tag);

  return (
    <EditorialPageFrame currentPath="/tags">
      <main className="mx-auto max-w-7xl px-8 py-20">
        <section className="mb-20">
          <div className="flex flex-col gap-4">
            <span className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">Category Archive</span>
            <h1 className="mb-6 font-headline text-6xl font-black tracking-tighter text-on-surface">{tag}</h1>
            <div className="max-w-2xl rounded-lg bg-surface-container-low p-8">
              <p className="text-xl italic leading-relaxed text-on-surface-variant">
                {posts.length} post{posts.length === 1 ? '' : 's'} collected under this topic, ordered newest first and left fully linked for browsing.
              </p>
            </div>
          </div>
        </section>

        <section className="grid grid-cols-12 gap-12">
          <div className="col-span-12 flex flex-col gap-16 md:col-span-8">
            <article className="rounded-xl bg-surface-container-highest p-10">
              <div className="mb-6 flex items-center gap-4 font-label text-xs uppercase tracking-widest text-secondary">
                <span>{longDateFormatter.format(featuredPost.date)}</span>
                <span className="h-1 w-1 rounded-full bg-outline-variant" />
                <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : `${featuredPost.tags.length} tags`}</span>
              </div>
              <h2 className="mb-4 font-headline text-4xl font-bold tracking-tight text-on-surface">
                <Link href={`/posts/${featuredPost.slug}`} className="transition-colors hover:text-primary">
                  {featuredPost.title}
                </Link>
              </h2>
              {featuredPost.summary ? (
                <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">{featuredPost.summary}</p>
              ) : null}
              <div className="mt-6 flex flex-wrap gap-2">
                {featuredPost.tags.map((postTag) => (
                  <Link
                    key={postTag}
                    href={`/tags/${encodeURIComponent(postTag)}`}
                    className="rounded-sm bg-surface px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-surface-container-high hover:text-on-surface"
                  >
                    {postTag}
                  </Link>
                ))}
              </div>
            </article>

            <div className="space-y-12">
              {remainingPosts.map((post) => (
                <article key={post.slug} className="border-b border-outline-variant/20 pb-12 last:border-b-0 last:pb-0">
                  <div className="mb-4 flex items-center gap-4 font-label text-xs uppercase tracking-widest text-secondary">
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
                    <p className="mt-4 max-w-2xl text-lg leading-relaxed text-on-surface-variant">
                      {post.summary}
                    </p>
                  ) : null}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.map((postTag) => (
                      <Link
                        key={`${post.slug}-${postTag}`}
                        href={`/tags/${encodeURIComponent(postTag)}`}
                        className="rounded-sm bg-surface-container-highest px-3 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
                      >
                        {postTag}
                      </Link>
                    ))}
                  </div>
                </article>
              ))}
            </div>
          </div>

          <aside className="hidden flex-col gap-12 md:col-span-4 md:flex">
            <div className="flex flex-col gap-6 rounded-xl bg-surface-container p-8">
              <h3 className="font-headline text-lg font-bold">Topic Snapshot</h3>
              <div className="space-y-4">
                {[
                  ['Posts', `${posts.length}`],
                  ['Years covered', `${postsByYear.length}`],
                  ['Related tags', `${relatedTags.length}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
                    <span className="font-headline text-lg font-bold text-on-surface">{value}</span>
                  </div>
                ))}
              </div>
              <Link href="/tags" className="inline-flex items-center gap-2 font-label text-xs font-bold uppercase tracking-widest text-primary">
                Back to all tags
              </Link>
            </div>

            {relatedTags.length > 0 ? (
              <div className="flex flex-col gap-6 px-4">
                <h3 className="font-label text-xs font-bold uppercase tracking-widest text-secondary">Related Tags</h3>
                <div className="flex flex-wrap gap-2">
                  {relatedTags.map(([relatedTag, count]) => (
                    <Link
                      key={relatedTag}
                      href={`/tags/${encodeURIComponent(relatedTag)}`}
                      className="rounded-md bg-surface-container-low px-3 py-2 font-label text-xs text-on-surface-variant transition-colors hover:bg-surface-container-high"
                    >
                      {relatedTag} ({count})
                    </Link>
                  ))}
                </div>
              </div>
            ) : null}

            <div className="rounded-xl bg-surface-container-low p-8">
              <h3 className="mb-4 font-headline text-lg font-bold text-on-surface">Browse Beyond This Topic</h3>
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
        </section>
      </main>
    </EditorialPageFrame>
  );
}
