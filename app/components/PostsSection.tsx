'use client';

import React, { useState } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  summary?: string;
  readingTime?: number;
}

interface PostsSectionProps {
  posts: Post[];
}

interface BlogCardProps {
  post: Post;
}

const BlogCard: React.FC<BlogCardProps> = ({ post }) => {
  const getExcerpt = (content: string, summary?: string): string => {
    if (summary) return summary;
    return content.split('\n\n')[0].substring(0, 150) + '...';
  };

  const calculateReadingTime = (content: string): number => {
    const wordsPerMinute = 200;
    const words = content.split(/\s+/).length;
    return Math.ceil(words / wordsPerMinute);
  };

  return (
    <div className="blog-card" key={post.slug}>
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
              {post.readingTime || 5} min read
            </span>
          </div>
          <p className="blog-card-excerpt">
            {getExcerpt('', post.summary)}
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
  );
};

export const PostsSection: React.FC<PostsSectionProps> = ({ posts }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  
  // Get unique categories from posts
  const categories = ['all', ...Array.from(new Set(posts.flatMap(post => post.tags)))].slice(0, 11);
  
  // Filter posts by category
  const filteredPosts = selectedCategory === 'all' 
    ? posts 
    : posts.filter(post => post.tags.includes(selectedCategory));

  // Get posts for display (skip first few that might be featured)
  const displayPosts = filteredPosts.slice(0, 12);

  return (
    <section className="posts-section">
      <div className="section-header">
        <h2 className="section-title">Latest Articles</h2>
        <div className="section-line"></div>
      </div>
      
      <div className="category-filter">
        <button 
          className={`category-button ${selectedCategory === 'all' ? 'active' : ''}`}
          onClick={() => setSelectedCategory('all')}
        >
          All
        </button>
        {categories.slice(1, 10).map((category) => (
          <button
            key={category}
            className={`category-button ${selectedCategory === category ? 'active' : ''}`}
            onClick={() => setSelectedCategory(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <div className="blog-cards-container">
        {displayPosts.map((post) => (
          <BlogCard key={post.slug} post={post} />
        ))}
      </div>

      {filteredPosts.length === 0 && (
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
  );
};