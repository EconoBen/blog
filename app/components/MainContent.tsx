'use client';

import React from 'react';
import Link from 'next/link';
import { EditorialPageFrame } from './EditorialPageFrame';

interface Post {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  summary?: string;
  content: string;
  readingTime?: number;
}

interface MainContentProps {
  posts: Post[];
  children?: React.ReactNode;
}

interface DefaultHomeContentProps {
  posts: Post[];
}

const getExcerpt = (content: string, summary?: string): string => {
  if (summary && summary.trim()) {
    return summary.length <= 150 ? summary : summary.substring(0, 147) + '...';
  }

  const firstParagraph = content.split('\n\n')[0];
  if (firstParagraph.length <= 150) {
    return firstParagraph;
  }
  return firstParagraph.substring(0, 147) + '...';
};

const DefaultHomeContent: React.FC<DefaultHomeContentProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing content...</p>
      </div>
    );
  }

  const newestPost = posts[0];
  const secondaryPost = posts[1] ?? newestPost;
  const tertiaryPost = posts[2] ?? secondaryPost;
  const newestExcerpt = getExcerpt(newestPost.content, newestPost.summary);

  return (
    <EditorialPageFrame currentPath="/" pageClassName="editorial-home-page">
        <section className="editorial-home-hero">
          <div className="editorial-home-hero-copy">
            <p className="editorial-home-kicker">Technical editorial platform</p>
            <h1>Writing about how AI systems remember, fail, and scale.</h1>
            <p className="editorial-home-subtitle">
              A public platform for essays, talks, O&apos;Reilly reports, and the forthcoming book on agent memory.
            </p>
            <div className="editorial-home-actions">
              <Link href="/book" className="editorial-home-button editorial-home-button-primary">
                Follow the book
              </Link>
              <Link href={`/posts/${newestPost.slug}`} className="editorial-home-button editorial-home-button-secondary">
                Browse selected writing
              </Link>
            </div>
          </div>

          <aside className="editorial-home-book-card">
            <p className="editorial-home-card-label">Book in progress</p>
            <h2>Agent Memory</h2>
            <p>
              A forthcoming O&apos;Reilly book on how modern AI systems structure retrieval, memory, and long-running context.
            </p>
            <div className="editorial-home-book-meta">
              <span>Q1 2027</span>
              <span>O&apos;Reilly</span>
              <span>newsletter-led launch</span>
            </div>
            <Link href="/book" className="editorial-home-button editorial-home-button-accent">
              Read updates
            </Link>
          </aside>
        </section>

        <section className="editorial-home-proof-strip" aria-label="Proof of work">
          <span>Principal ML Engineer</span>
          <span>/</span>
          <span>O&apos;Reilly reports</span>
          <span>/</span>
          <span>ODSC + Agents in Production talks</span>
          <span>/</span>
          <span>forthcoming book</span>
        </section>

        <section className="editorial-home-section">
          <p className="editorial-home-section-label">Selected work</p>
          <h2>A homepage that curates, instead of dumping a feed.</h2>
          <div className="editorial-home-grid">
            <article className="editorial-home-card">
              <p className="editorial-home-card-label">Essay</p>
              <h3>The strongest writing gets space to breathe.</h3>
              <p>
                Feature one important post or report with enough room for an opinion, not just a thumbnail and a date.
              </p>
              <Link href={`/posts/${newestPost.slug}`} className="editorial-home-card-link">
                {newestPost.title}
              </Link>
              <p className="editorial-home-card-footnote">{newestExcerpt}</p>
            </article>

            <article className="editorial-home-card">
              <p className="editorial-home-card-label">Talks + proof</p>
              <h3>Pull authority forward. Don&apos;t hide it in subpages.</h3>
              <p>
                Talks, reports, and current work should reinforce the same story visitors infer from the hero.
              </p>
              <div className="editorial-home-proof-links">
                <Link href="/talks">See talks</Link>
                <Link href="/publications">See publications</Link>
              </div>
            </article>
          </div>
        </section>

        <section className="editorial-home-cta-band">
          <div>
            <p className="editorial-home-card-label">Newsletter + book</p>
            <h3>A lightweight conversion layer. Present, not pushy.</h3>
            <p>
              Make the next action obvious: follow the book, subscribe for updates, or browse the strongest writing and talks.
            </p>
          </div>
          <Link href="/book" className="editorial-home-button editorial-home-button-primary">
            Start the list
          </Link>
        </section>
    </EditorialPageFrame>
  );
};

export const MainContent: React.FC<MainContentProps> = ({ posts, children }) => {
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
