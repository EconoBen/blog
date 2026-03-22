import { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Posts | Ben Labaschin',
  description: 'Essays on AI systems, engineering, memory, and adjacent technical work.',
};

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const formatter = new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
  const featuredPost = posts[0];

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Writing archive</p>
          <h1 className="editorial-page-title">Posts</h1>
          <p className="editorial-page-copy">
            Essays on agent memory, AI systems, developer tooling, and the occasional detour into economics.
          </p>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">At a glance</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">published posts</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{featuredPost?.tags[0] ?? 'AI'}</span>
              <span className="editorial-page-metric-label">current leading theme</span>
            </div>
          </div>
          {featuredPost && (
            <Link href={`/posts/${featuredPost.slug}`} className="editorial-home-button editorial-home-button-secondary">
              Start with the latest essay
            </Link>
          )}
        </aside>
      </section>

      <section className="editorial-home-proof-strip" aria-label="Posts summary">
        <span>long-form essays</span>
        <span>/</span>
        <span>systems + infrastructure</span>
        <span>/</span>
        <span>agent memory</span>
        <span>/</span>
        <span>developer workflow</span>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Archive</p>
          <h2 className="editorial-page-section-title">Recent writing with enough room to read.</h2>
        </div>

        <div className="editorial-post-grid">
        {posts.map((post) => (
          <article key={post.slug} className="editorial-post-card">
            <div className="editorial-post-meta">
              <span>{post.tags[0] ?? 'Essay'}</span>
              <span>{formatter.format(post.date)}</span>
            </div>
            <h2>{post.title}</h2>
            {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
            <div className="editorial-chip-row">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="editorial-chip">
                  {tag}
                </span>
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
