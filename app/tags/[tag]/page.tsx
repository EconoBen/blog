import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditorialPageFrame } from '../../components/EditorialPageFrame';
import { postService } from '../../../services/PostService';

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

const groupPostsByYear = (posts: Awaited<ReturnType<typeof postService.getPostsByTag>>) => {
  const groups = new Map<number, typeof posts>();

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

function TagPostRow({ post }: { post: Awaited<ReturnType<typeof postService.getPostsByTag>>[number] }) {
  return (
    <article className="editorial-post-row">
      <div className="editorial-post-row-header">
        <div className="editorial-post-row-title">
          <p className="editorial-home-card-label">{longDateFormatter.format(post.date)}</p>
          <h3 style={{ margin: 0 }}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>
        </div>
        <span className="editorial-post-summary">
          {post.readingTime ? `${post.readingTime} min read` : 'Post'}
        </span>
      </div>
      {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
      <div className="editorial-chip-row">
        {post.tags.slice(0, 4).map((postTag) => (
          <Link key={postTag} href={`/tags/${encodeURIComponent(postTag)}`} className="editorial-chip">
            {postTag}
          </Link>
        ))}
      </div>
    </article>
  );
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);

  return {
    title: `${tag} | Ben Labaschin`,
    description: `Browse all posts tagged with "${tag}".`,
  };
}

export async function generateStaticParams() {
  const tags = await postService.getAllTags();
  return tags.map((tagData: any) => ({
    tag: encodeURIComponent(tagData.tag),
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const posts = await postService.getPostsByTag(tag);
  const postsByYear = groupPostsByYear(posts);

  if (posts.length === 0) {
    notFound();
  }

  const relatedTagCounts = new Map<string, number>();
  posts.forEach((post) => {
    post.tags
      .filter((postTag) => postTag !== tag)
      .forEach((postTag) => {
        relatedTagCounts.set(postTag, (relatedTagCounts.get(postTag) ?? 0) + 1);
      });
  });
  const relatedTags = Array.from(relatedTagCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);

  return (
    <EditorialPageFrame currentPath="/tags" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Tag archive</p>
          <h1 className="editorial-page-title">{tag}</h1>
          <p className="editorial-page-copy">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found for this topic, ordered newest first and kept in the same reading vocabulary as the broader archive.
          </p>
          <div className="editorial-breadcrumb" aria-label="Tag breadcrumb">
            <Link href="/tags">Tags</Link>
            <span>/</span>
            <span>{tag}</span>
          </div>
          <div className="editorial-chip-row">
            <span className="editorial-chip">{posts.length} posts</span>
            <span className="editorial-chip">Newest first</span>
            <Link href="/tags" className="editorial-chip">
              Back to tags
            </Link>
            <Link href="/archive" className="editorial-chip">
              Archive
            </Link>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Topic context</p>
          <div className="editorial-page-metric-list" style={{ marginTop: '12px' }}>
            <div>
              <span className="editorial-page-metric-value">{postsByYear.length}</span>
              <span className="editorial-page-metric-label">Years with posts under this tag</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{relatedTags.length}</span>
              <span className="editorial-page-metric-label">Nearby topics pulled from the same posts</span>
            </div>
          </div>
          <div className="editorial-chip-row" style={{ marginTop: '16px' }}>
            {relatedTags.length > 0 ? (
              relatedTags.map(([relatedTag, count]) => (
                <Link key={relatedTag} href={`/tags/${encodeURIComponent(relatedTag)}`} className="editorial-chip">
                  {relatedTag} <span>({count})</span>
                </Link>
              ))
            ) : (
              <span className="editorial-chip">No nearby topics</span>
            )}
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">By year</p>
          <h2 className="editorial-page-section-title">Matching posts, grouped to preserve the archive rhythm.</h2>
        </div>
        <div style={{ display: 'grid', gap: '22px' }}>
          {postsByYear.map(({ year, posts: yearPosts }) => (
            <section key={year} className="editorial-month-grid">
              <div className="editorial-list-heading" style={{ marginBottom: 0 }}>
                <p className="editorial-home-section-label">Year {year}</p>
                <h3 className="editorial-page-section-title" style={{ fontSize: '1.4rem' }}>
                  {yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}
                </h3>
              </div>
              {yearPosts.map((post) => (
                <TagPostRow key={post.slug} post={post} />
              ))}
            </section>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
