import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, postService } from '../services/PostService';

/**
 * Interface for tag data with count
 */
interface TagData {
  tag: string;
  count: number;
}

/**
 * Interface for archive data with month and count
 */
interface ArchiveData {
  month: string;
  count: number;
}

/**
 * Sidebar component for the blog
 *
 * @returns {JSX.Element} The rendered Sidebar component
 */
const Sidebar: React.FC = () => {
  const [recentPosts, setRecentPosts] = useState<Post[]>([]);
  const [tags, setTags] = useState<TagData[]>([]);
  const [archives, setArchives] = useState<ArchiveData[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    /**
     * Loads all required data for the sidebar
     */
    const loadData = async (): Promise<void> => {
      try {
        // Load recent posts, tags, and archives in parallel
        const [posts, tagData, archiveData] = await Promise.all([
          postService.getRecentPosts(4),
          postService.getAllTags(),
          postService.getArchiveByMonth()
        ]);

        setRecentPosts(posts);
        setTags(tagData);
        setArchives(archiveData);
      } catch (error) {
        console.error('Failed to load sidebar data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

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

  return (
    <div className="sidebar">
      <div className="sidebar-inner">
        <div className="sidebar-logo">cd ~/tech-notes</div>

        <div className="sidebar-section">
          <div className="sidebar-heading">RECENT POSTS</div>
          {loading ? (
            <div>Loading posts...</div>
          ) : (
            <ul className="post-list">
              {recentPosts.map(post => (
                <li key={post.slug} className="post-item">
                  <div className="post-title">
                    <Link to={`/posts/${post.slug}`}>{post.title}</Link>
                  </div>
                  <div className="post-meta">{formatDate(post.date)}</div>
                  <div className="post-tags">
                    {post.tags.map(tag => (
                      <span key={tag} className="post-tag">
                        <Link to={`/tags/${tag}`}>{tag}</Link>
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
                  {tag.tag}
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
                    <a href={`/archives/${encodeURIComponent(archive.month)}`}>
                      {archive.month}
                    </a>
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
