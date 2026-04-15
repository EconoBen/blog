'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { EditorialPageFrame } from './EditorialPageFrame';
import type { Post } from '../services/PostService';

interface MainContentProps {
  posts: Post[];
  children?: ReactNode;
}

interface DefaultHomeContentProps {
  posts: Post[];
}

const dateFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
});

const getExcerpt = (content: string, summary?: string): string => {
  if (summary && summary.trim()) {
    return summary.length <= 150 ? summary : summary.substring(0, 147) + '...';
  }

  const firstParagraph = content.split('\n\n')[0] || '';
  if (firstParagraph.length <= 150) {
    return firstParagraph;
  }
  return firstParagraph.substring(0, 147) + '...';
};

const getPrimaryTag = (post: Post): string => post.tags[0] ?? 'Post';

const DefaultHomeContent = ({ posts }: DefaultHomeContentProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Preparing the latest writing.</p>
      </div>
    );
  }

  const newestPost = posts[0];
  const featuredPosts = posts.slice(0, 3);
  const newestExcerpt = getExcerpt(newestPost.content, newestPost.summary);

  return (
    <EditorialPageFrame currentPath="/" pageClassName="editorial-home-page">
      <section className="editorial-home-hero">
        <div className="editorial-home-hero-copy">
          <p className="editorial-home-kicker">Technical writing archive</p>
          <h1>Posts on how AI systems remember, fail, and scale in production.</h1>
          <p className="editorial-home-subtitle">
            Posts, talks, and book notes on the engineering choices that separate demos from durable products.
          </p>
          <div className="editorial-home-actions">
            <Link href={`/posts/${newestPost.slug}`} className="editorial-home-button editorial-home-button-primary">
              Read the newest post
            </Link>
            <Link href="/posts" className="editorial-home-button editorial-home-button-secondary">
              Browse the archive
            </Link>
          </div>
        </div>

        <aside className="editorial-home-book-card">
          <p className="editorial-home-card-label">Latest post</p>
          <h2>{newestPost.title}</h2>
          <p>{newestExcerpt}</p>
          <div className="editorial-home-book-meta">
            <span>{dateFormatter.format(newestPost.date)}</span>
            <span>{newestPost.readingTime ? `${newestPost.readingTime} min read` : 'Read now'}</span>
            <span>{getPrimaryTag(newestPost)}</span>
          </div>
          <Link href={`/posts/${newestPost.slug}`} className="editorial-home-button editorial-home-button-accent">
            Read the post
          </Link>
        </aside>
      </section>

      <section className="editorial-home-proof-strip" aria-label="Proof of work">
        <span>{posts.length} published posts</span>
        <span>/</span>
        <span>Principal ML/AI Engineer</span>
        <span>/</span>
        <span>O&apos;Reilly reports</span>
        <span>/</span>
        <span>forthcoming book on agent memory</span>
      </section>

      <section className="editorial-home-section">
        <p className="editorial-home-section-label">Selected writing</p>
        <h2>Recent posts with enough context to know where to go next.</h2>
        <div className="editorial-home-grid">
          {featuredPosts.map((post, index) => {
            const excerpt = getExcerpt(post.content, post.summary);
            return (
              <article
                key={post.slug}
                className={`editorial-home-card ${index === 0 ? 'editorial-home-card-featured' : 'editorial-home-card-compact'}`}
              >
                <p className="editorial-home-card-label">{getPrimaryTag(post)}</p>
                <h3>
                  <Link href={`/posts/${post.slug}`} className="editorial-home-card-link">
                    {post.title}
                  </Link>
                </h3>
                <p>{excerpt}</p>
                <div className="editorial-home-book-meta">
                  <span>{dateFormatter.format(post.date)}</span>
                  <span>{post.readingTime ? `${post.readingTime} min read` : 'Essay'}</span>
                </div>
                <div className="editorial-chip-row">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                      {tag}
                    </Link>
                  ))}
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="editorial-home-cta-band">
        <div>
          <p className="editorial-home-card-label">Book notes + archive</p>
          <h3>Follow the longer arc without losing the thread.</h3>
          <p>
            Start with the book notes, then move through the archive, talks, and publications if you want the broader technical context.
          </p>
        </div>
        <Link href="/book" className="editorial-home-button editorial-home-button-primary">
          Follow the book
        </Link>
      </section>
    </EditorialPageFrame>
  );
};

export const MainContent = ({ posts, children }: MainContentProps) => {
  if (!children) {
    return <DefaultHomeContent posts={posts} />;
  }

  return (
    <div className="main-content">
      <div className="content-wrapper">
        {children}
      </div>
    </div>
  );
};
