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

interface ProductionHomeContentProps {
  posts: Post[];
}

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

// Production-matching content structure using production class names
const ProductionHomeContent: React.FC<ProductionHomeContentProps> = ({ posts }) => {
  if (!posts || posts.length === 0) {
    return (
      <div className="content-loading">
        <p>Loading posts...</p>
      </div>
    );
  }

  return (
    <div className="content-wrapper">
      <ul className="post-list">
        {posts.map((post) => (
          <li key={post.slug} className="post-item">
            <div className="post-title">
              <Link href={`/posts/${post.slug}`}>{post.title}</Link>
            </div>
            <div className="post-meta">
              {post.date.toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
              {` • ${calculateReadingTime(post.content)} min read`}
            </div>
            {post.summary && (
              <p className="post-excerpt">{getExcerpt(post.content, post.summary)}</p>
            )}
            <div className="post-tags">
              {post.tags.slice(0, 3).map((tag) => (
                <span key={tag} className="post-tag">
                  <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                </span>
              ))}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export const MainContent: React.FC<MainContentProps> = ({ posts, children }) => {
  return (
    <>
      {children || <ProductionHomeContent posts={posts} />}
    </>
  );
};
