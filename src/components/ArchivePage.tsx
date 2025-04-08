import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, postService } from '../services/PostService';
import { isMobileDevice } from '../utils/deviceDetection';

/**
 * Props for the ArchivePage component
 */
interface ArchivePageProps {
  /** Month in "Month Year" format to filter posts by */
  month: string;
}

/**
 * Component to display posts from a specific month
 *
 * @param {ArchivePageProps} props - Component props
 * @returns {JSX.Element} The rendered ArchivePage component
 */
const ArchivePage: React.FC<ArchivePageProps> = ({ month }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Loads posts for the specified month
     */
    const loadPosts = async (): Promise<void> => {
      setLoading(true);
      try {
        // Get all posts and filter by month
        const allPosts = await postService.getAllPosts();
        const monthPosts = allPosts.filter(post => {
          const postMonth = post.date.toLocaleString('en-US', {
            month: 'long',
            year: 'numeric'
          });
          return postMonth === month;
        });

        setPosts(monthPosts);
      } catch (err) {
        console.error('Failed to load posts for month:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [month]);

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

  if (loading) {
    return <div className="archive-page-loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="archive-page-error">{error}</div>;
  }

  return (
    <div className="archive-page">
      <h1 className="archive-heading">Posts from {month}</h1>
      {posts.length === 0 ? (
        <div className="no-posts">No posts found for this month.</div>
      ) : (
        <div className="post-list">
          {posts.map(post => (
            <div key={post.slug} className="post-item">
              <h2 className="post-title">
                <Link to={`/posts/${post.slug}`}>{post.title}</Link>
              </h2>
              <div className="post-meta">
                <span className="post-date">{formatDate(post.date)}</span>
                <div className="post-tags">
                  {post.tags.map(tag => (
                    <span key={tag} className="post-tag">
                      {isMobileDevice() ? (
                        // On mobile: Just display the tag text
                        tag
                      ) : (
                        // On desktop: Use Link component
                        <Link to={`/tags/${tag}`}>{tag}</Link>
                      )}
                    </span>
                  ))}
                </div>
              </div>
              <div className="post-excerpt">
                {post.content.split('\n\n')[0]}...
              </div>
              <div className="post-read-more">
                <Link to={`/posts/${post.slug}`}>Read more &rarr;</Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ArchivePage;
