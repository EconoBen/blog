'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { blogConfig } from '@/config/blogConfig';

interface Post {
  slug: string;
  title: string;
  date: Date | string;
  tags: string[];
  summary?: string;
}

interface TagData {
  tag: string;
  count: number;
}

interface ArchiveData {
  month: string;
  count: number;
}

interface SidebarProps {
  posts?: Post[];
  isOpen?: boolean;
  width?: number;
  onToggle?: () => void;
  isResizing?: boolean;
}

interface SidebarPostItemProps {
  post: Post;
}

const SidebarPostItem: React.FC<SidebarPostItemProps> = ({ post }) => {
  const formatDate = (dateInput: Date | string): string => {
    const date = typeof dateInput === 'string' ? new Date(dateInput) : dateInput;
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <li className="post-item">
      <div className="post-title">
        <Link href={`/posts/${post.slug}`}>{post.title}</Link>
      </div>
      <div className="post-meta">{formatDate(post.date)}</div>
      <div className="post-tags">
        {post.tags.slice(0, 2).map(tag => (
          <span key={tag} className="post-tag">
            <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
          </span>
        ))}
      </div>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ isOpen = false, width, onToggle }) => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [archives, setArchives] = useState<ArchiveData[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSidebarData = async () => {
      try {
        const response = await fetch('/api/sidebar');
        if (response.ok) {
          const data = await response.json();
          setRecentPosts(data.recentPosts || []);
          setTags(data.tags || []);
          setArchives(data.archives || []);
        }
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchSidebarData();
  }, []);

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} style={width ? { width: `${width}px` } : undefined}>
      <div className="sidebar-inner">
        {/* Close button and dark mode toggle */}
        {onToggle && (
          <button
            className="sidebar-close-button"
            onClick={onToggle}
            aria-label="Close sidebar"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        )}

        {/* Social links */}
        <div className="sidebar-social-links">
          {blogConfig.socialLinks.github && (
            <a href={blogConfig.socialLinks.github} target="_blank" rel="noopener noreferrer" className="social-link" title="GitHub">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M9 19c-5 1.5-5-2.5-7-3m14 6v-3.87a3.37 3.37 0 0 0-.94-2.61c3.14-.35 6.44-1.54 6.44-7A5.44 5.44 0 0 0 20 4.77 5.07 5.07 0 0 0 19.91 1S18.73.65 16 2.48a13.38 13.38 0 0 0-7 0C6.27.65 5.09 1 5.09 1A5.07 5.07 0 0 0 5 4.77a5.44 5.44 0 0 0-1.5 3.78c0 5.42 3.3 6.61 6.44 7A3.37 3.37 0 0 0 9 18.13V22"></path>
              </svg>
            </a>
          )}
          {blogConfig.socialLinks.linkedin && (
            <a href={blogConfig.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" className="social-link" title="LinkedIn">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                <rect x="2" y="9" width="4" height="12"></rect>
                <circle cx="4" cy="4" r="2"></circle>
              </svg>
            </a>
          )}
          {blogConfig.socialLinks.bluesky && (
            <a href={blogConfig.socialLinks.bluesky} target="_blank" rel="noopener noreferrer" className="social-link" title="Bluesky">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M12 2 L8 6 L12 10 L16 6 Z" />
                <path d="M12 9 L8 13 L12 17 L16 13 Z" />
                <path d="M19 5 L19 19" />
                <path d="M5 5 L5 19" />
              </svg>
            </a>
          )}
          {blogConfig.socialLinks.email && (
            <a href={blogConfig.socialLinks.email} className="social-link" title="Email">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" width="20" height="20">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
            </a>
          )}
        </div>

        <div className="sidebar-logo">cd ~/bjl/tech-notes</div>

        <div className="sidebar-section">
          <div className="sidebar-heading">RECENT POSTS</div>
          {loading ? (
            <div>Loading posts...</div>
          ) : (
            <ul className="post-list">
              {recentPosts.map(post => (
                <SidebarPostItem key={post.slug} post={post} />
              ))}
            </ul>
          )}
        </div>

        <div className="sidebar-section">
          <div className="sidebar-heading">POPULAR TAGS</div>
          {loading ? (
            <div>Loading tags...</div>
          ) : (
            <div className="tag-cloud">
              {tags.slice(0, 10).map(tagData => (
                <Link
                  key={tagData.tag}
                  href={`/tags/${encodeURIComponent(tagData.tag)}`}
                  className="tag"
                >
                  {tagData.tag}
                </Link>
              ))}
            </div>
          )}
        </div>

        <div className="sidebar-section">
          <div className="sidebar-heading">ARCHIVES</div>
          {loading ? (
            <div>Loading archives...</div>
          ) : (
            <ul className="post-list">
              {archives.map(archive => (
                <li key={archive.month} className="post-item">
                  <div className="post-title">
                    <Link href={`/archives/${encodeURIComponent(archive.month)}`}>
                      {archive.month}
                    </Link>
                  </div>
                  <div className="post-meta">{archive.count} posts</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
