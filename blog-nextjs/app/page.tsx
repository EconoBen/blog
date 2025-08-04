import Link from 'next/link';
import { postService } from './services/PostService';

export default async function HomePage() {
  const posts = await postService.getAllPosts();
  
  // Get recent posts (first 10)
  const recentPosts = posts.slice(0, 10);
  
  // Get featured/popular posts (you can implement your own logic)
  const featuredPosts = posts
    .filter(post => post.tags.includes('featured') || post.tags.includes('popular'))
    .slice(0, 3);

  return (
    <div className="home-page">
      <section className="hero-section">
        <h1 className="hero-title">Economic Notes</h1>
        <p className="hero-subtitle">
          Exploring the intersection of economics, technology, and artificial intelligence
        </p>
      </section>

      {featuredPosts.length > 0 && (
        <section className="featured-section">
          <h2 className="section-title">Featured Posts</h2>
          <div className="featured-grid">
            {featuredPosts.map((post) => (
              <article key={post.slug} className="featured-card">
                <Link href={`/posts/${post.slug}`}>
                  <h3 className="featured-title">{post.title}</h3>
                  <time className="featured-date">
                    {post.date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  {post.summary && (
                    <p className="featured-summary">{post.summary}</p>
                  )}
                  <div className="featured-tags">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag-small">
                        {tag}
                      </span>
                    ))}
                  </div>
                </Link>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="recent-section">
        <div className="section-header">
          <h2 className="section-title">Recent Posts</h2>
          <Link href="/posts" className="see-all-link">
            See all posts →
          </Link>
        </div>
        
        <div className="posts-list">
          {recentPosts.map((post) => (
            <article key={post.slug} className="post-item">
              <Link href={`/posts/${post.slug}`}>
                <div className="post-item-content">
                  <h3 className="post-item-title">{post.title}</h3>
                  <time className="post-item-date">
                    {post.date.toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                  {post.summary && (
                    <p className="post-item-summary">{post.summary}</p>
                  )}
                  <div className="post-item-footer">
                    <div className="post-item-tags">
                      {post.tags.slice(0, 3).map((tag) => (
                        <span key={tag} className="tag-small">
                          {tag}
                        </span>
                      ))}
                    </div>
                    <span className="read-more">Read more →</span>
                  </div>
                </div>
              </Link>
            </article>
          ))}
        </div>
      </section>

      <section className="explore-section">
        <h2 className="section-title">Explore More</h2>
        <div className="explore-grid">
          <Link href="/code-ai" className="explore-card">
            <div className="explore-icon">🤖</div>
            <h3>Code & AI</h3>
            <p>Practical code snippets and ML/AI insights</p>
          </Link>
          <Link href="/talks" className="explore-card">
            <div className="explore-icon">🎤</div>
            <h3>Talks</h3>
            <p>Conference presentations and workshops</p>
          </Link>
          <Link href="/publications" className="explore-card">
            <div className="explore-icon">📚</div>
            <h3>Publications</h3>
            <p>Articles, papers, and research</p>
          </Link>
          <Link href="/archive" className="explore-card">
            <div className="explore-icon">📅</div>
            <h3>Archive</h3>
            <p>Browse all posts by date</p>
          </Link>
        </div>
      </section>
    </div>
  );
}