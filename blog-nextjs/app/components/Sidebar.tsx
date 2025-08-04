'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: string;
  tags: string[];
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
  width: number;
  isOpen: boolean;
  onToggle: () => void;
  isResizing: boolean;
}

const Sidebar: React.FC<SidebarProps> = ({ width, isOpen, onToggle, isResizing }) => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [archives, setArchives] = useState<ArchiveData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadData = async (): Promise<void> => {
      try {
        const response = await fetch('/api/sidebar');
        const data = await response.json();
        
        setRecentPosts(data.recentPosts);
        setTags(data.tags);
        setArchives(data.archives);
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const formatDate = (date: string): string => {
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <>
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`} style={{ width: `${width}px` }}>
        <div className="sidebar-inner">
          <div className="sidebar-logo">cd ~/bjl/tech-notes</div>

        <div className="sidebar-section">
          <div className="sidebar-heading">RECENT POSTS</div>
          {loading ? (
            <div>Loading posts...</div>
          ) : (
            <ul className="post-list">
              {recentPosts.map(post => (
                <li key={post.slug} className="post-item">
                  <div className="post-title">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </div>
                  <div className="post-meta">{formatDate(post.date)}</div>
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="post-tag">
                        <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                      </span>
                    ))}
                  </div>
                </li>
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
              {tags.slice(0, 10).map(tag => (
                <div key={tag.tag} className="tag">
                  <Link href={`/tags/${encodeURIComponent(tag.tag)}`}>
                    {tag.tag}
                  </Link>
                </div>
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
                    <Link href={`/archive#${encodeURIComponent(archive.month)}`}>
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
      
      <div 
        className="sidebar-resize-handle" 
        style={{ 
          cursor: isResizing ? 'col-resize' : 'ew-resize',
          userSelect: isResizing ? 'none' : 'auto'
        }}
      />
    </div>

    <button 
      className={`sidebar-toggle ${isOpen ? 'sidebar-open' : ''}`}
      onClick={onToggle}
      aria-label={isOpen ? 'Close sidebar' : 'Open sidebar'}
    >
      <span className="toggle-icon">
        <span></span>
        <span></span>
        <span></span>
      </span>
    </button>
    </>
  );
};

export default Sidebar;