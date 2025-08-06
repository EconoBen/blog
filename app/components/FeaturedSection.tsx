'use client';

import React from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  summary?: string;
  readingTime?: number;
}

interface FeaturedSectionProps {
  posts: Post[];
}

export const FeaturedSection: React.FC<FeaturedSectionProps> = ({ posts }) => {
  // Get featured posts - prioritize posts with certain tags or recent popular posts
  const featuredPosts = posts
    .filter(post => 
      post.tags.some(tag => 
        ['AI', 'Economics', 'Machine Learning', 'LLM', 'featured'].includes(tag)
      )
    )
    .slice(0, 3);

  if (featuredPosts.length === 0) {
    return null;
  }

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  const getExcerpt = (content: string, summary?: string): string => {
    if (summary) return summary;
    return content.split('\n\n')[0].substring(0, 150) + '...';
  };

  return (
    <section className="featured-section">
      <div className="section-header">
        <h2 className="section-title">Featured Posts</h2>
        <div className="section-line"></div>
      </div>
      <div className="featured-posts">
        {featuredPosts.map((post) => (
          <div key={post.slug} className="featured-post-card">
            <div className="featured-post-content">
              <span className="featured-label">Featured</span>
              <h3 className="featured-post-title">
                <Link href={`/posts/${post.slug}`}>
                  {post.title}
                </Link>
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
                  {post.readingTime || 5} min read
                </span>
              </div>
              <p className="featured-post-excerpt">
                {getExcerpt('', post.summary)}
              </p>
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
  );
};