'use client';

import React from 'react';
import Link from 'next/link';
import { useSidebar } from '../hooks/useSidebar';

interface Post {
  slug: string;
  title: string;
  date: Date;
  tags: string[];
  summary?: string;
}

interface SidebarProps {
  posts?: Post[];
}

interface SidebarPostItemProps {
  post: Post;
}

const SidebarPostItem: React.FC<SidebarPostItemProps> = ({ post }) => {
  const formatDate = (date: Date): string => {
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

export const Sidebar: React.FC<SidebarProps> = ({ posts }) => {
  const { isOpen } = useSidebar();

  // Handle case where posts might be undefined or empty
  if (!posts || posts.length === 0) {
    return (
      <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
        <div className="sidebar-inner">
          <div className="sidebar-section">
            <h3 className="sidebar-heading">RECENT POSTS</h3>
            <div className="post-list">
              <div>Loading posts...</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`sidebar ${isOpen ? 'sidebar-open' : ''}`}>
      <div className="sidebar-inner">
        <div className="sidebar-section">
          <h3 className="sidebar-heading">RECENT POSTS</h3>
          <ul className="post-list">
            {posts.map(post => (
              <SidebarPostItem key={post.slug} post={post} />
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;