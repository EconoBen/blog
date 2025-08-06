'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { isMobileDevice } from '../utils/deviceDetection';

interface BlogCardProps {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  excerpt: string;
  readingTime?: number;
  coverImage?: string;
}

const BlogCard: React.FC<BlogCardProps> = ({
  slug,
  title,
  date,
  tags,
  excerpt,
  readingTime = 5,
  coverImage
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const getRandomGradient = (): string => {
    // Use the post slug to deterministically generate a gradient
    const hash = slug.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Generate hue values from the hash
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 40) % 360;

    return `linear-gradient(135deg,
      hsl(${hue1}, 80%, 60%) 0%,
      hsl(${hue2}, 80%, 60%) 100%)`;
  };

  // Memoize the gradient so it doesn't change on re-renders
  const cardGradient = useMemo(getRandomGradient, [slug]);

  return (
    <article
      className={`blog-card ${isHovered ? 'blog-card-hovered' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div
        className="blog-card-accent"
        style={{ background: cardGradient }}
      ></div>

      <div className="blog-card-content">
        {coverImage && (
          <div className="blog-card-image">
            <img src={coverImage} alt={title} loading="lazy" />
          </div>
        )}
        
        <header className="blog-card-header">
          <h2 className="blog-card-title">
            <Link href={`/posts/${slug}`}>{title}</Link>
          </h2>
          <div className="blog-card-meta">
            <time className="blog-card-date">{formatDate(date)}</time>
            <span className="blog-card-reading-time">{readingTime} min read</span>
          </div>
        </header>

        <div className="blog-card-excerpt">
          <p>{excerpt}</p>
        </div>

        <footer className="blog-card-footer">
          <div className="blog-card-tags">
            {tags.map(tag => {
              if (isMobileDevice()) {
                // On mobile: Just display as span, not linked
                return (
                  <span key={tag} className="blog-card-tag">
                    #{tag}
                  </span>
                );
              } else {
                // On desktop: Use Link component
                return (
                  <Link key={tag} href={`/tags/${tag}`} className="blog-card-tag">
                    #{tag}
                  </Link>
                );
              }
            })}
          </div>
          <div className="blog-card-action">
            <Link href={`/posts/${slug}`} className="blog-card-read-more">
              Read Article
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
          </div>
        </footer>
      </div>
    </article>
  );
};

export default BlogCard;