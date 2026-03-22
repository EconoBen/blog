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

const rowStyle = {
  paddingTop: '1rem',
  borderTop: '1px solid rgba(26, 36, 51, 0.12)',
  display: 'grid',
  gap: '0.75rem',
} as const;

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

  return (
    <EditorialPageFrame currentPath="/tags" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Tag archive</p>
          <h1 className="editorial-page-title">{tag}</h1>
          <p className="editorial-page-copy">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found for this topic, ordered newest first and kept in the same utility-first format as the broader archive.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">{posts.length} posts</span>
            <span className="editorial-chip">Newest first</span>
            <span className="editorial-chip">Related tags linked</span>
            <Link href="/tags" className="editorial-chip">
              Back to tags
            </Link>
          </div>
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">By year</p>
          <h2 className="editorial-page-section-title">All matching posts, grouped by year.</h2>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {postsByYear.map(({ year, posts: yearPosts }) => (
            <section key={year} className="editorial-home-card">
              <p className="editorial-home-card-label">Year {year}</p>
              <div style={{ display: 'grid', gap: '1rem' }}>
                {yearPosts.map((post) => (
                  <article key={post.slug} style={rowStyle}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline' }}>
                      <div>
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
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
