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
  const featuredPost = posts[0];

  if (posts.length === 0) {
    notFound();
  }

  return (
    <EditorialPageFrame currentPath="/tags" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Tag archive</p>
          <h1 className="editorial-page-title">{tag}</h1>
          <p className="editorial-page-copy">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found for this topic, ordered newest first and arranged so the topic reads like a guided trail.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">{posts.length} posts</span>
            <span className="editorial-chip">Newest first</span>
            <span className="editorial-chip">Related tags linked</span>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Browse links</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">posts in this tag</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{postsByYear.length}</span>
              <span className="editorial-page-metric-label">years represented</span>
            </div>
            <div>
              <Link href="/tags" className="editorial-post-link">
                Back to tags
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Featured match</p>
          <h2 className="editorial-page-section-title">Start with the newest post, then move through the year-by-year trail.</h2>
        </div>
        {featuredPost ? (
          <article className="editorial-home-card">
            <p className="editorial-home-card-label">{longDateFormatter.format(featuredPost.date)}</p>
            <h3>
              <Link href={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
            </h3>
            {featuredPost.summary && <p>{featuredPost.summary}</p>}
            <div className="editorial-post-meta">
              <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : `${featuredPost.tags.length} tags`}</span>
              <span>{featuredPost.tags.length} topic tag{featuredPost.tags.length !== 1 ? 's' : ''}</span>
            </div>
            <div className="editorial-chip-row">
              {featuredPost.tags.map((postTag) => (
                <Link key={postTag} href={`/tags/${encodeURIComponent(postTag)}`} className="editorial-chip">
                  {postTag}
                </Link>
              ))}
            </div>
            <Link href={`/posts/${featuredPost.slug}`} className="editorial-home-card-link">
              Read post
            </Link>
          </article>
        ) : null}
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">By year</p>
          <h2 className="editorial-page-section-title">A lighter index that keeps every tagged post visible on mobile.</h2>
        </div>
        <div className="editorial-two-column">
          {postsByYear.map(({ year, posts: yearPosts }) => (
            <article key={year} className="editorial-home-card">
              <p className="editorial-home-card-label">Year {year}</p>
              <h3>{yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}</h3>
              <p>Newest first, with titles and summaries kept together so the topic stays scannable.</p>
              {yearPosts[0] ? (
                <div>
                  <p className="editorial-home-card-label">Featured post</p>
                  <Link href={`/posts/${yearPosts[0].slug}`} className="editorial-home-card-link">
                    {yearPosts[0].title}
                  </Link>
                  {yearPosts[0].summary && <p className="editorial-post-summary">{yearPosts[0].summary}</p>}
                </div>
              ) : null}
              <ul className="posts-list">
                {yearPosts.slice(1).map((post) => (
                  <li key={post.slug} className="archive-post">
                    <Link href={`/posts/${post.slug}`}>
                      <time className="archive-post-date">
                        {post.date.getDate().toString().padStart(2, '0')}
                      </time>
                      <span className="archive-post-title">{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
