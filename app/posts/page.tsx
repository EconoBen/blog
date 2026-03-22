import { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Posts | Ben Labaschin',
  description: 'Essays, field notes, and technical writing on AI systems, memory, engineering practice, and adjacent work.',
};

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const countTags = (posts: Awaited<ReturnType<typeof postService.getAllPosts>>) => {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
};

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const featuredPost = posts[0];
  const topTags = countTags(posts);
  const publicationYears = new Set(posts.map((post) => post.date.getFullYear())).size;

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Writing archive</p>
          <h1 className="editorial-page-title">Posts</h1>
          <p className="editorial-page-copy">
            Essays, field notes, and working-throughs on agent memory, AI systems, engineering practice, and the occasional economics detour.
          </p>
          <div className="editorial-chip-row">
            {topTags.map(([tag, count]) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                {tag} <span>({count})</span>
              </Link>
            ))}
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">At a glance</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">published essays</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">
                {featuredPost ? formatter.format(featuredPost.date) : 'n/a'}
              </span>
              <span className="editorial-page-metric-label">latest post</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{publicationYears}</span>
              <span className="editorial-page-metric-label">years of writing</span>
            </div>
          </div>
          {featuredPost?.summary && <p className="editorial-post-summary">{featuredPost.summary}</p>}
          {featuredPost && (
            <Link href={`/posts/${featuredPost.slug}`} className="editorial-home-button editorial-home-button-secondary">
              Start with the latest essay
            </Link>
          )}
        </aside>
      </section>

      <section className="editorial-home-proof-strip" aria-label="Posts summary">
        <span>{posts.length} posts</span>
        <span>/</span>
        <span>essays + field notes</span>
        <span>/</span>
        <span>agent memory</span>
        <span>/</span>
        <span>systems + workflow</span>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Archive</p>
          <h2 className="editorial-page-section-title">Recent writing, newest first, with tags and context left visible.</h2>
        </div>

        <div className="editorial-post-grid">
          {posts.map((post) => (
            <article key={post.slug} className="editorial-post-card">
              <div className="editorial-post-meta">
                {post.tags[0] ? (
                  <Link href={`/tags/${encodeURIComponent(post.tags[0])}`} className="editorial-chip">
                    <span>{post.tags[0]}</span>
                  </Link>
                ) : (
                  <span className="editorial-chip">Essay</span>
                )}
                <span>{formatter.format(post.date)}</span>
                {post.readingTime && <span>{post.readingTime} min read</span>}
                <span>{post.tags.length} tags</span>
              </div>
              <h2>
                <Link href={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
              <div className="editorial-chip-row">
                {post.tags.slice(0, 3).map((tag) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                    {tag}
                  </Link>
                ))}
              </div>
              <Link href={`/posts/${post.slug}`} className="editorial-post-link">
                Read the post
              </Link>
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
