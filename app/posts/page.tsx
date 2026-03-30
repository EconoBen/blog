import { Metadata } from 'next';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import { SidebarToggle } from '../components/SidebarToggle';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'All Posts | Economic Notes',
  description: 'Browse all blog posts on economics, technology, and AI.',
};

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const recentPosts = posts.slice(0, 10);

  return (
    <div className="blog-container">
      <Sidebar posts={recentPosts} />

      <div className="main-content">
        <NavBar />

        <div className="content-wrapper">
          <h1 className="page-title">All Posts</h1>

          <div className="blog-cards-container">
            {posts.map((post) => (
              <article key={post.slug} className="blog-card">
                <div className="blog-card-content">
                  <header className="blog-card-header">
                    <h2 className="blog-card-title">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h2>
                    <div className="blog-card-meta">
                      <span className="blog-card-date">
                        {post.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </span>
                      <span className="blog-card-reading-time">
                        {(post.readingTime ?? Math.ceil(post.content.split(/\s+/).length / 200))} min read
                      </span>
                    </div>
                  </header>

                  {post.summary && (
                    <div className="blog-card-excerpt">
                      <p>{post.summary}</p>
                    </div>
                  )}

                  <div className="blog-card-footer">
                    <div className="blog-card-tags">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Link
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="blog-card-tag"
                        >
                          {tag}
                        </Link>
                      ))}
                    </div>

                    <Link href={`/posts/${post.slug}`} className="blog-card-read-more">
                      Read more
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 8h6M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <SidebarToggle />
      </div>
    </div>
  );
}