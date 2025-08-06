'use client';

import React, { useState } from 'react';
import Link from 'next/link';

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

/**
 * Get hero title lines from post title
 */
const getHeroTitleLines = (title: string): string[] => {
  // Split by natural breaks like commas, semicolons, or dashes
  const splitChars = /[,;:-]/;
  if (splitChars.test(title)) {
    return title.split(splitChars).map(line => line.trim()).filter(line => line);
  }

  // If no natural breaks, try to split in the middle of the title
  const words = title.split(' ');

  // For longer titles, try to create more balanced lines for better animation
  if (words.length >= 8) {
    const wordsPerLine = Math.ceil(words.length / 4); // Create up to 4 lines for very long titles
    return [
      words.slice(0, wordsPerLine).join(' '),
      words.slice(wordsPerLine, wordsPerLine * 2).join(' '),
      words.slice(wordsPerLine * 2, wordsPerLine * 3).join(' '),
      words.slice(wordsPerLine * 3).join(' ')
    ].filter(line => line.trim());
  }

  // For medium-long titles, create 3 lines
  if (words.length >= 6) {
    const wordsPerLine = Math.ceil(words.length / 3);
    return [
      words.slice(0, wordsPerLine).join(' '),
      words.slice(wordsPerLine, wordsPerLine * 2).join(' '),
      words.slice(wordsPerLine * 2).join(' ')
    ].filter(line => line.trim());
  }

  // For medium titles, create 2 lines
  if (words.length >= 3) {
    const midpoint = Math.floor(words.length / 2);
    return [
      words.slice(0, midpoint).join(' '),
      words.slice(midpoint).join(' ')
    ];
  }

  // For short titles, just use as is
  return [title];
};

/**
 * Calculate estimated reading time based on content length
 */
const calculateReadingTime = (content: string): number => {
  const wordsPerMinute = 200; // Average reading speed
  const wordCount = content.split(/\s+/).length;
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
};

/**
 * Get excerpt from post content, preferring the summary field if available
 */
const getExcerpt = (content: string, summary?: string): string => {
  // If a summary is provided in frontmatter, use it
  if (summary && summary.trim()) {
    return summary.length <= 150 ? summary : summary.substring(0, 147) + '...';
  }

  // Fallback to first paragraph if no summary is available
  const firstParagraph = content.split('\n\n')[0];
  if (firstParagraph.length <= 150) {
    return firstParagraph;
  }
  return firstParagraph.substring(0, 147) + '...';
};

/**
 * Extract tech keywords from post tags
 */
const getTechBadges = (tags: string[]): Array<{icon: string, name: string}> => {
  // All tech badges will use hashtag icon
  return tags.map(tag => {
    return {
      icon: '#', // Using hashtag instead of emoji icons
      name: tag
    };
  }).slice(0, 4); // Only show maximum of 4 tech badges
};

const DefaultHomeContent: React.FC<DefaultHomeContentProps> = ({ posts }) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!posts || posts.length === 0) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing content...</p>
      </div>
    );
  }

  // Get the newest post for hero section
  const newestPost = posts[0];
  
  // Get next 3 posts as featured (exclude the hero post)
  const featuredPosts = posts.slice(1, 4);

  // Extract unique categories from post tags
  const categories = Array.from(new Set(posts.flatMap(post => post.tags)));

  // Filter posts by category/tag
  const getFilteredPosts = (): Post[] => {
    if (activeCategory === 'all') {
      return posts;
    }
    return posts.filter(post => post.tags.includes(activeCategory));
  };

  // Get title lines and tech badges from newest post
  const titleLines = getHeroTitleLines(newestPost.title);
  const techBadges = getTechBadges(newestPost.tags);
  const postExcerpt = getExcerpt(newestPost.content, newestPost.summary);

  return (
    <div className="home-container">
      {/* Hero Section based on newest post */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <Link href={`/posts/${newestPost.slug}`} className="hero-title-link">
              {titleLines.map((line: string, index: number) => (
                <span key={index} className="hero-line">{line}</span>
              ))}
            </Link>
          </h1>
          <p className="hero-subtitle">
            {postExcerpt}
          </p>
          <div className="hero-cta">
            <Link href={`/posts/${newestPost.slug}`} className="hero-button primary">
              Read Article
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link href="/about" className="hero-button secondary">
              About Me
            </Link>
          </div>
          <div className="tech-badges">
            {techBadges.map((tech, index: number) => (
              <div key={index} className="tech-badge">
                <Link href={`/tags/${tech.name}`} className="tech-badge-link">
                  <span className="tech-icon">{tech.icon}</span>
                  <span className="tech-name">{tech.name}</span>
                </Link>
              </div>
            ))}
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-graphic">
            <svg
              width="600"
              height="600"
              viewBox="-50 -50 500 500"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="animated-graphic"
            >
              <circle cx="200" cy="200" r="180" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="4 4" className="outer-circle" />
              <circle cx="200" cy="200" r="150" stroke="var(--accent-color-secondary)" strokeWidth="2" opacity="0.7" className="middle-circle" />
              <circle cx="200" cy="200" r="120" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" className="inner-circle" />

              {/* Neural network nodes */}
              {/* Input layer */}
              <circle cx="100" cy="150" r="10" fill="var(--accent-color)" fillOpacity="0.2" stroke="var(--accent-color)" strokeWidth="1.5" className="node input-node-1" />
              <circle cx="100" cy="200" r="10" fill="var(--accent-color)" fillOpacity="0.2" stroke="var(--accent-color)" strokeWidth="1.5" className="node input-node-2" />
              <circle cx="100" cy="250" r="10" fill="var(--accent-color)" fillOpacity="0.2" stroke="var(--accent-color)" strokeWidth="1.5" className="node input-node-3" />

              {/* Hidden layer */}
              <circle cx="200" cy="130" r="10" fill="var(--accent-color-secondary)" fillOpacity="0.2" stroke="var(--accent-color-secondary)" strokeWidth="1.5" className="node hidden-node-1" />
              <circle cx="200" cy="200" r="10" fill="var(--accent-color-secondary)" fillOpacity="0.2" stroke="var(--accent-color-secondary)" strokeWidth="1.5" className="node hidden-node-2" />
              <circle cx="200" cy="270" r="10" fill="var(--accent-color-secondary)" fillOpacity="0.2" stroke="var(--accent-color-secondary)" strokeWidth="1.5" className="node hidden-node-3" />

              {/* Output layer */}
              <circle cx="300" cy="170" r="10" fill="var(--accent-color)" fillOpacity="0.2" stroke="var(--accent-color)" strokeWidth="1.5" className="node output-node-1" />
              <circle cx="300" cy="230" r="10" fill="var(--accent-color)" fillOpacity="0.2" stroke="var(--accent-color)" strokeWidth="1.5" className="node output-node-2" />

              {/* Connections from input to hidden layer */}
              <path d="M110 150 L190 130" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i1-h1" />
              <path d="M110 150 L190 200" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i1-h2" />
              <path d="M110 150 L190 270" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i1-h3" />

              <path d="M110 200 L190 130" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i2-h1" />
              <path d="M110 200 L190 200" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i2-h2" />
              <path d="M110 200 L190 270" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i2-h3" />

              <path d="M110 250 L190 130" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i3-h1" />
              <path d="M110 250 L190 200" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i3-h2" />
              <path d="M110 250 L190 270" stroke="var(--accent-color)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection i3-h3" />

              {/* Connections from hidden to output layer */}
              <path d="M210 130 L290 170" stroke="var(--accent-color-secondary)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection h1-o1" />
              <path d="M210 130 L290 230" stroke="var(--accent-color-secondary)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection h1-o2" />

              <path d="M210 200 L290 170" stroke="var(--accent-color-secondary)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection h2-o1" />
              <path d="M210 200 L290 230" stroke="var(--accent-color-secondary)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection h2-o2" />

              <path d="M210 270 L290 170" stroke="var(--accent-color-secondary)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection h3-o1" />
              <path d="M210 270 L290 230" stroke="var(--accent-color-secondary)" strokeWidth="1" strokeDasharray="3 3" opacity="0.4" className="connection h3-o2" />

              {/* Center decoration */}
              <circle cx="200" cy="200" r="40" fill="var(--accent-color)" fillOpacity="0.1" stroke="var(--accent-color)" strokeWidth="2" className="center-circle" />
            </svg>
          </div>
        </div>
      </section>

      {/* Featured Posts Section */}
      <section className="featured-section">
        <div className="section-header">
          <h2 className="section-title">Featured Posts</h2>
          <div className="section-line"></div>
        </div>
        <div className="featured-posts">
          {featuredPosts.map(post => (
            <div className="featured-post-card" key={post.slug}>
              <div className="featured-post-content">
                <span className="featured-label">Featured</span>
                <h3 className="featured-post-title">
                  <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                </h3>
                <div className="featured-post-meta">
                  <span className="featured-post-date">
                    {post.date.toLocaleDateString('en-US', {
                      month: 'long',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </span>
                  <span className="featured-post-reading-time">
                    {calculateReadingTime(post.content)} min read
                  </span>
                </div>
                <p className="featured-post-excerpt">{getExcerpt(post.content, post.summary)}</p>
                <Link href={`/posts/${post.slug}`} className="featured-post-link">
                  Read Article
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                  </svg>
                </Link>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* All Posts Section with Category Filter */}
      <section className="posts-section">
        <div className="section-header">
          <h2 className="section-title">Latest Articles</h2>
          <div className="section-line"></div>
        </div>

        <div className="category-filter">
          <button
            className={`category-button ${activeCategory === 'all' ? 'active' : ''}`}
            onClick={() => setActiveCategory('all')}
          >
            All
          </button>
          {categories.slice(0, 10).map(category => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => setActiveCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="blog-cards-container">
          {getFilteredPosts().map(post => (
            <div key={post.slug} className="blog-card">
              <Link href={`/posts/${post.slug}`}>
                <div className="blog-card-content">
                  <h3 className="blog-card-title">{post.title}</h3>
                  <div className="blog-card-meta">
                    <span className="blog-card-date">
                      {post.date.toLocaleDateString('en-US', {
                        month: 'long',
                        day: 'numeric',
                        year: 'numeric'
                      })}
                    </span>
                    <span className="blog-card-reading-time">
                      {calculateReadingTime(post.content)} min read
                    </span>
                  </div>
                  <p className="blog-card-excerpt">
                    {getExcerpt(post.content, post.summary)}
                  </p>
                  <div className="blog-card-tags">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="blog-card-tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
            </div>
          ))}
        </div>

        {getFilteredPosts().length === 0 && (
          <div className="no-posts-message">
            <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="12" y1="8" x2="12" y2="12"></line>
              <line x1="12" y1="16" x2="12.01" y2="16"></line>
            </svg>
            <p>No posts found in this category.</p>
          </div>
        )}
      </section>
    </div>
  );
};

export const MainContent: React.FC<MainContentProps> = ({ posts, children }) => {
  return (
    <div className="main-content">
      <div className="content-wrapper">
        {children || <DefaultHomeContent posts={posts} />}
      </div>
    </div>
  );
};