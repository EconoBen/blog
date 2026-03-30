'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { EditorialPageFrame } from './EditorialPageFrame';
import type { Post } from '../services/PostService';
import { talksConfig } from '../config/talksConfig';
import { publicationsConfig } from '../config/publicationsConfig';

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

const latestByDate = <T extends { date: string }>(items: T[]): T | undefined => {
  if (!items.length) {
    return undefined;
  }

  return [...items].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];
};

const getExcerpt = (content: string, summary?: string): string => {
  if (summary && summary.trim()) {
    return summary.length <= 150 ? summary : `${summary.substring(0, 147)}...`;
  }

  const firstParagraph = content.split('\n\n')[0] || '';
  if (firstParagraph.length <= 150) {
    return firstParagraph;
  }

  return `${firstParagraph.substring(0, 147)}...`;
};

const DefaultHomeContent = ({ posts }: DefaultHomeContentProps) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="home-loading">
        <div className="loading-spinner" />
        <p>Preparing the latest posts.</p>
      </div>
    );
  }

  const featuredPost = posts[0];
  const latestPublication = latestByDate(publicationsConfig.publications);
  const latestTalk = latestByDate(talksConfig.talks);

  return (
    <EditorialPageFrame currentPath="/" pageClassName="editorial-home-page">
      <section className="editorial-home-hero">
        <div className="editorial-home-hero-copy">
          <p className="editorial-home-kicker">Ben Labaschin</p>
          <h1>Practical notes on AI systems, memory, and the work around them.</h1>
          <p className="editorial-home-subtitle">
            Posts, talks, publications, and the Agent Memory book, kept in one place.
          </p>
          <div className="editorial-home-actions">
            <Link href="/posts" className="editorial-home-button editorial-home-button-primary">
              Read the latest posts
            </Link>
            <Link href="/book" className="editorial-home-button editorial-home-button-secondary">
              Book page
            </Link>
          </div>
        </div>

        <aside className="editorial-home-book-card">
          <p className="editorial-home-card-label">Current book</p>
          <h2>Agent Memory</h2>
          <p>A forthcoming O&apos;Reilly book on how AI systems store, retrieve, compress, and act on useful context.</p>
          <div className="editorial-home-book-meta">
            <span>O&apos;Reilly</span>
            <span>In progress</span>
            <span>Updates</span>
          </div>
          <Link href="/book" className="editorial-home-button editorial-home-button-accent">
            Open book page
          </Link>
        </aside>
      </section>

      <section className="editorial-home-section">
        <div className="editorial-home-section-header">
          <p className="editorial-home-section-label">Selected work</p>
          <h2>Three current pieces worth opening next.</h2>
        </div>

        <div className="editorial-home-work-grid">
          {featuredPost ? (
            <article className="editorial-home-card editorial-home-work-feature">
              <p className="editorial-home-card-label">Latest post</p>
              <h3>
                <Link href={`/posts/${featuredPost.slug}`} className="editorial-home-card-link">
                  {featuredPost.title}
                </Link>
              </h3>
              <p>{getExcerpt(featuredPost.content, featuredPost.summary)}</p>
              <div className="editorial-home-book-meta">
                <span>{dateFormatter.format(featuredPost.date)}</span>
                <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : 'Read now'}</span>
              </div>
              <div className="editorial-chip-row">
                {featuredPost.tags.slice(0, 3).map((tag) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                    {tag}
                  </Link>
                ))}
              </div>
              <Link href={`/posts/${featuredPost.slug}`} className="editorial-home-card-link">
                Open the post
              </Link>
            </article>
          ) : null}

          <div className="editorial-home-work-stack">
            {latestPublication ? (
              <article className="editorial-home-card editorial-home-work-item">
                <p className="editorial-home-card-label">Latest publication</p>
                <h3>
                  <Link href="/publications" className="editorial-home-card-link">
                    {latestPublication.title}
                  </Link>
                </h3>
                <p>{latestPublication.abstract || `Published with ${latestPublication.venue || "O'Reilly Media"}.`}</p>
                <div className="editorial-home-book-meta">
                  <span>{latestPublication.venue || "O'Reilly Media"}</span>
                  <span>{latestPublication.year}</span>
                </div>
                <Link href="/publications" className="editorial-home-card-link">
                  See publications
                </Link>
              </article>
            ) : null}

            {latestTalk ? (
              <article className="editorial-home-card editorial-home-work-item">
                <p className="editorial-home-card-label">Latest talk</p>
                <h3>
                  <Link href="/talks" className="editorial-home-card-link">
                    {latestTalk.title}
                  </Link>
                </h3>
                <p>{latestTalk.description}</p>
                <div className="editorial-home-book-meta">
                  <span>{latestTalk.event}</span>
                  <span>{dateFormatter.format(new Date(latestTalk.date))}</span>
                </div>
                <Link href="/talks" className="editorial-home-card-link">
                  See talks
                </Link>
              </article>
            ) : null}
          </div>
        </div>
      </section>

      <section className="editorial-home-newsletter">
        <div className="editorial-home-newsletter-copy">
          <p className="editorial-home-card-label">Newsletter</p>
          <h2>Get occasional book updates.</h2>
          <p>
            If you want updates on Agent Memory, email is the simplest path. The rest of the site stays public and easy to browse.
          </p>
        </div>
        <div className="editorial-home-newsletter-actions">
          <a href="mailto:benjaminlabaschindev@gmail.com?subject=Agent%20Memory%20updates" className="editorial-home-button editorial-home-button-primary">
            Email for updates
          </a>
          <Link href="/book" className="editorial-home-button editorial-home-button-secondary">
            Read the book page
          </Link>
        </div>
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
