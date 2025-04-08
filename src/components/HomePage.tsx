import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Post, postService } from '../services/PostService';
import BlogPostCard from './BlogCard';
import { blogConfig } from './../config/blogConfig';
import { isMobileDevice } from '../utils/deviceDetection';

/**
 * Interface for tech badge
 */
interface TechBadge {
  icon: string;
  name: string;
}

/**
 * Enhanced HomePage component with animated hero section and featured posts
 *
 * @returns {JSX.Element} The rendered HomePage component
 */
const HomePage: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<Post[]>([]);
  const [featuredPosts, setFeaturedPosts] = useState<Post[]>([]);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [newestPost, setNewestPost] = useState<Post | null>(null);

  useEffect(() => {
    const loadContent = async () => {
      try {
        console.log("Loading all posts...");
        const allPosts = await postService.getAllPosts();

        if (allPosts && allPosts.length > 0) {
          console.log(`Successfully loaded ${allPosts.length} posts`);
          setPosts(allPosts);

          // Set the newest post (first one) for the hero section
          setNewestPost(allPosts[0]);

          // Select next 3 posts as featured (exclude the hero post)
          const featured = allPosts.slice(1, 4);
          setFeaturedPosts(featured);

          // Extract unique categories from post tags
          const uniqueTags = new Set<string>();
          allPosts.forEach(post => {
            post.tags.forEach(tag => uniqueTags.add(tag));
          });
          setCategories(Array.from(uniqueTags));
        } else {
          console.error("No posts found");
          setPosts([]);
        }
      } catch (error) {
        console.error("Failed to load posts:", error);
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };

    loadContent();
  }, []);

  /**
   * Get hero title lines from post title
   *
   * @param {string} title - Post title
   * @returns {string[]} Array of title lines
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
   *
   * @param {string} content - Post content
   * @returns {number} Estimated reading time in minutes
   */
  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  /**
   * Filter posts by category/tag
   *
   * @param {string} category - Category to filter by
   */
  const filterByCategory = (category: string) => {
    setActiveCategory(category);
  };

  /**
   * Get filtered posts based on active category
   *
   * @returns {Post[]} Filtered posts
   */
  const getFilteredPosts = (): Post[] => {
    if (activeCategory === 'all') {
      return posts;
    }
    return posts.filter(post => post.tags.includes(activeCategory));
  };

  /**
   * Get excerpt from post content, preferring the summary field if available
   *
   * @param {string} content - Post content
   * @param {string} [summary] - Optional summary from frontmatter
   * @returns {string} Excerpt for display
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
   *
   * @param {string[]} tags - Post tags
   * @returns {Array<{icon: string, name: string}>} Array of tech badges
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

  if (loading) {
    return (
      <div className="home-loading">
        <div className="loading-spinner"></div>
        <p>Loading amazing content...</p>
      </div>
    );
  }

  // Fallback to default config if no posts
  if (!newestPost) {
    return (
      <div className="home-page">
        {/* Hero Section */}
        <section className="hero-section">
          <div className="hero-content">
            <h1 className="hero-title">
              {blogConfig.hero.titleLines.map((line: string, index: number) => (
                <span key={index} className="hero-line">{line}</span>
              ))}
            </h1>
            <p className="hero-subtitle">
              {blogConfig.hero.subtitle}
            </p>
            <div className="hero-cta">
              <Link to="/about" className="hero-button primary">
                About Me
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <line x1="5" y1="12" x2="19" y2="12"></line>
                  <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
              </Link>
            </div>
            <div className="tech-badges">
              {blogConfig.hero.techBadges.map((tech: TechBadge, index: number) => (
                <div key={index} className="tech-badge">
                  {isMobileDevice() ? (
                    // On mobile: Just display as span, not linked
                    <span className="tech-badge-text">
                      <span className="tech-icon">{tech.icon}</span>
                      <span className="tech-name">{tech.name}</span>
                    </span>
                  ) : (
                    // On desktop: Use Link component
                    <Link to={`/tags/${tech.name}`} className="tech-badge-link">
                      <span className="tech-icon">{tech.icon}</span>
                      <span className="tech-name">{tech.name}</span>
                    </Link>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="hero-decoration">
            <div className="hero-graphic">
              <svg width="400" height="400" viewBox="0 0 400 400" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="200" cy="200" r="180" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="4 4" />
                <circle cx="200" cy="200" r="150" stroke="var(--accent-color-secondary)" strokeWidth="2" opacity="0.7" />
                <circle cx="200" cy="200" r="120" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="8 8" opacity="0.5" />
                <path d="M200 80V320" stroke="var(--accent-color-secondary)" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
                <path d="M80 200H320" stroke="var(--accent-color)" strokeWidth="2" strokeDasharray="6 6" opacity="0.6" />
                <circle cx="200" cy="200" r="40" fill="var(--accent-color)" fillOpacity="0.1" stroke="var(--accent-color)" strokeWidth="2" />
                <circle cx="200" cy="200" r="8" fill="var(--accent-color)" />
                <circle cx="200" cy="120" r="6" fill="var(--accent-color-secondary)" />
                <circle cx="200" cy="280" r="6" fill="var(--accent-color-secondary)" />
                <circle cx="280" cy="200" r="6" fill="var(--accent-color)" />
                <circle cx="120" cy="200" r="6" fill="var(--accent-color-secondary)" />

                {/* Docker containers */}
                <rect x="260" y="150" width="30" height="20" rx="2" fill="var(--accent-color)" fillOpacity="0.2" stroke="var(--accent-color)" strokeWidth="1.5" />
                <rect x="260" y="175" width="30" height="20" rx="2" fill="var(--accent-color)" fillOpacity="0.3" stroke="var(--accent-color)" strokeWidth="1.5" />
                <rect x="260" y="200" width="30" height="20" rx="2" fill="var(--accent-color)" fillOpacity="0.4" stroke="var(--accent-color)" strokeWidth="1.5" />

                {/* Cloud */}
                <path d="M150 140 C140 130, 120 130, 110 140 C100 130, 80 130, 70 140 C60 150, 60 170, 70 180 L150 180 C160 170, 160 150, 150 140Z" fill="var(--accent-color-secondary)" fillOpacity="0.2" stroke="var(--accent-color-secondary)" strokeWidth="1.5" />
              </svg>
            </div>
          </div>
        </section>
      </div>
    );
  }

  // Get title lines and tech badges from newest post
  const titleLines = getHeroTitleLines(newestPost.title);
  const techBadges = getTechBadges(newestPost.tags);
  const postExcerpt = getExcerpt(newestPost.content, newestPost.summary);

  return (
    <div className="home-page">
      {/* Hero Section based on newest post */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <Link to={`/posts/${newestPost.slug}`} className="hero-title-link">
              {titleLines.map((line: string, index: number) => (
                <span key={index} className="hero-line">{line}</span>
              ))}
            </Link>
          </h1>
          <p className="hero-subtitle">
            {postExcerpt}
          </p>
          <div className="hero-cta">
            <Link to={`/posts/${newestPost.slug}`} className="hero-button primary">
              Read Article
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="5" y1="12" x2="19" y2="12"></line>
                <polyline points="12 5 19 12 12 19"></polyline>
              </svg>
            </Link>
            <Link to="/about" className="hero-button secondary">
              About Me
            </Link>
          </div>
          <div className="tech-badges">
            {techBadges.map((tech: TechBadge, index: number) => (
              <div key={index} className="tech-badge">
                {isMobileDevice() ? (
                  // On mobile: Just display as span, not linked
                  <span className="tech-badge-text">
                    <span className="tech-icon">{tech.icon}</span>
                    <span className="tech-name">{tech.name}</span>
                  </span>
                ) : (
                  // On desktop: Use Link component
                  <Link to={`/tags/${tech.name}`} className="tech-badge-link">
                    <span className="tech-icon">{tech.icon}</span>
                    <span className="tech-name">{tech.name}</span>
                  </Link>
                )}
              </div>
            ))}
          </div>
        </div>
        <div className="hero-decoration">
          <div className="hero-graphic">
            <svg width="600" height="600" viewBox="-50 -50 500 500" fill="none" xmlns="http://www.w3.org/2000/svg" className="animated-graphic">
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

              {/* Signals flowing through the network - all starting from input nodes */}
              {/* Path 1: input-1 → hidden-1 → output-1 */}
              <circle cx="100" cy="150" r="3" fill="var(--accent-color)" className="signal signal-i1-h1-o1" />
              {/* Path 2: input-1 → hidden-2 → output-2 */}
              <circle cx="100" cy="150" r="3" fill="var(--accent-color)" className="signal signal-i1-h2-o2" />
              {/* Path 3: input-2 → hidden-1 → output-2 */}
              <circle cx="100" cy="200" r="3" fill="var(--accent-color)" className="signal signal-i2-h1-o2" />
              {/* Path 4: input-2 → hidden-3 → output-1 */}
              <circle cx="100" cy="200" r="3" fill="var(--accent-color)" className="signal signal-i2-h3-o1" />
              {/* Path 5: input-3 → hidden-2 → output-1 */}
              <circle cx="100" cy="250" r="3" fill="var(--accent-color)" className="signal signal-i3-h2-o1" />
              {/* Path 6: input-3 → hidden-3 → output-2 */}
              <circle cx="100" cy="250" r="3" fill="var(--accent-color)" className="signal signal-i3-h3-o2" />

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
                  <Link to={`/posts/${post.slug}`}>{post.title}</Link>
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
                <Link to={`/posts/${post.slug}`} className="featured-post-link">
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
            onClick={() => filterByCategory('all')}
          >
            All
          </button>
          {categories.slice(0, 10).map(category => (
            <button
              key={category}
              className={`category-button ${activeCategory === category ? 'active' : ''}`}
              onClick={() => filterByCategory(category)}
            >
              {category}
            </button>
          ))}
        </div>

        <div className="blog-cards-container">
          {getFilteredPosts().map(post => (
            <BlogPostCard
              key={post.slug}
              slug={post.slug}
              title={post.title}
              date={post.date}
              tags={post.tags}
              excerpt={getExcerpt(post.content, post.summary)}
              readingTime={calculateReadingTime(post.content)}
            />
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

export default HomePage;
