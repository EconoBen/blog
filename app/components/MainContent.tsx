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

const DefaultHomeContent = ({ posts }: DefaultHomeContentProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Preparing the latest posts.</p>
      </div>
    );
  }

  const selectedPosts = posts.slice(0, 2);

  return (
    <EditorialPageFrame currentPath="/" pageClassName="editorial-home-page">
      <section className="editorial-home-hero">
        <div className="editorial-home-hero-copy">
          <p className="editorial-home-kicker">Technical editorial platform</p>
          <h1>Writing about how AI systems remember, fail, and stay useful.</h1>
          <p className="editorial-home-subtitle">
            A public platform for posts, talks, O&apos;Reilly reports, code, and the forthcoming book on agent memory.
          </p>
          <div className="editorial-home-actions">
            <Link href="/book" className="editorial-home-button editorial-home-button-primary">
              Follow the book
            </Link>
            <Link href="/posts" className="editorial-home-button editorial-home-button-secondary">
              Browse posts
            </Link>
          </div>
        </div>

        <aside className="editorial-home-book-card">
          <p className="editorial-home-card-label">Book in progress</p>
          <h2>Agent Memory</h2>
          <p>A forthcoming O&apos;Reilly book on how modern AI systems structure retrieval, context, and long-running memory.</p>
          <div className="editorial-home-book-meta">
            <span>Drafting</span>
            <span>O&apos;Reilly</span>
            <span>Updates</span>
          </div>
          <Link href="/book" className="editorial-home-button editorial-home-button-accent">
            Open book page
          </Link>
        </aside>
      </section>

      <section className="editorial-home-scope-line" aria-label="Site areas">
        <span>Posts</span>
        <span>/</span>
        <span>Talks</span>
        <span>/</span>
        <span>Publications</span>
        <span>/</span>
        <span>Code &amp; Tools</span>
        <span>/</span>
        <span>Book</span>
      </section>

      <section className="editorial-home-section">
        <p className="editorial-home-section-label">Selected posts</p>
        <h2>A homepage that keeps the useful posts up front.</h2>
        <div className="editorial-home-grid">
          {selectedPosts.map((post) => {
            const excerpt = getExcerpt(post.content, post.summary);
            return (
              <article
                key={post.slug}
                className="editorial-home-card"
              >
                <p className="editorial-home-card-label">Post</p>
                <h3>
                  <Link href={`/posts/${post.slug}`} className="editorial-home-card-link">
                    {post.title}
                  </Link>
                </h3>
                <p>{excerpt}</p>
                <div className="editorial-home-book-meta">
                  <span>{dateFormatter.format(post.date)}</span>
                  <span>{post.readingTime ? `${post.readingTime} min read` : 'Read now'}</span>
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
          <p className="editorial-home-card-label">Book updates</p>
          <h3>Follow the book without losing the rest of the site.</h3>
          <p>
            Get occasional updates on the book, then use the rest of the site for posts, talks, publications, and code.
          </p>
        </div>
        <Link href="/book" className="editorial-home-button editorial-home-button-primary">
          Get updates
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
