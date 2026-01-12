import { Metadata } from 'next';
import Link from 'next/link';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'All Posts | Economic Notes',
  description: 'Browse all blog posts on economics, technology, and AI.',
};

export default async function PostsPage() {
  const posts = await postService.getAllPosts();

  return (
    <div className="posts-page">
      <div className="page-header">
        <h1 className="page-title">All Posts</h1>
        <p className="page-subtitle">
          {posts.length} posts on economics, technology, and more
        </p>
      </div>

      <div className="posts-grid">
        {posts.map((post) => (
          <article key={post.slug} className="blog-card">
            <Link href={`/posts/${post.slug}`}>
              <div className="blog-card-content">
                {post.coverImage && (
                  <div className="blog-card-image">
                    <img src={post.coverImage} alt={post.title} />
                  </div>
                )}
                
                <h2 className="blog-card-title">{post.title}</h2>
                
                <time className="blog-card-date">
                  {post.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                
                {post.summary && (
                  <p className="blog-card-summary">{post.summary}</p>
                )}
                
                <div className="blog-card-footer">
                  <div className="blog-card-tags">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="tag">
                        {tag}
                      </span>
                    ))}
                    {post.tags.length > 3 && (
                      <span className="tag tag-more">
                        +{post.tags.length - 3}
                      </span>
                    )}
                  </div>
                  
                  <span className="read-more-link">
                    Read more →
                  </span>
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}