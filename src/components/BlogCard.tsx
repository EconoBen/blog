import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';

/**
 * Props for the BlogPostCard component
 */
interface BlogPostCardProps {
  /** Slug for the post URL */
  slug: string;
  /** Title of the blog post */
  title: string;
  /** Publication date as a Date object */
  date: Date;
  /** Array of tags for the post */
  tags: string[];
  /** Excerpt or initial content of the post */
  excerpt: string;
  /** Estimated reading time in minutes */
  readingTime?: number;
}

/**
 * Enhanced blog post card component with hover effects and animations
 *
 * @param {BlogPostCardProps} props - Component props
 * @returns {JSX.Element} The rendered BlogPostCard component
 */
const BlogPostCard: React.FC<BlogPostCardProps> = ({
  slug,
  title,
  date,
  tags,
  excerpt,
  readingTime = 5 // Default reading time if not provided
}) => {
  const [isHovered, setIsHovered] = useState(false);

  /**
   * Format date for display
   *
   * @param {Date} date - Date to format
   * @returns {string} Formatted date string
   */
  const formatDate = (date: Date): string => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  /**
   * Generate a random gradient for the card's accent line
   * This gives each card a unique visual identity
   */
  const getRandomGradient = (): string => {
    // We'll use the post slug to deterministically generate a gradient
    // This ensures the same post always gets the same gradient
    const hash = slug.split('').reduce((acc, char) => {
      return char.charCodeAt(0) + ((acc << 5) - acc);
    }, 0);

    // Generate hue values from the hash
    const hue1 = Math.abs(hash % 360);
    const hue2 = (hue1 + 40) % 360; // Offset for complementary color

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
        <header className="blog-card-header">
          <h2 className="blog-card-title">
            <Link to={`/posts/${slug}`}>{title}</Link>
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
            {tags.map(tag => (
              <Link key={tag} to={`/tags/${tag}`} className="blog-card-tag">
                #{tag}
              </Link>
            ))}
          </div>
          <div className="blog-card-action">
            <Link to={`/posts/${slug}`} className="blog-card-read-more">
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

export default BlogPostCard;
