import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, postService } from '../services/PostService';

/**
 * Props for the TagPage component
 */
interface TagPageProps {
  /** Tag to filter posts by */
  tag: string;
}

/**
 * Component to display posts filtered by tag
 *
 * @param {TagPageProps} props - Component props
 * @returns {JSX.Element} The rendered TagPage component
 */
const TagPage: React.FC<TagPageProps> = ({ tag }) => {
  const [posts, setPosts] = useState<Post[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Loads posts filtered by tag
     */
    const loadPosts = async (): Promise<void> => {
      setLoading(true);
      try {
        const taggedPosts = await postService.getPostsByTag(tag);
        setPosts(taggedPosts);
      } catch (err) {
        console.error('Failed to load posts for tag:', err);
        setError('Failed to load posts');
      } finally {
        setLoading(false);
      }
    };

    loadPosts();
  }, [tag]);

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
    return <div className="tag-page-loading">Loading posts...</div>;
  }

  if (error) {
    return <div className="tag-page-error">{error}</div>;
  }

  return (
    <div className="tag-page">
      <h1 className="tag-heading">Posts tagged with "{tag}"</h1>
      {posts.length === 0 ? (
        <div className="no-posts">No posts found with this tag.</div>
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
                  {post.tags.map(t => (
                    <span
                      key={t}
                      className={`post-tag ${t === tag ? 'post-tag-active' : ''}`}
                    >
                      <Link to={`/tags/${t}`}>{t}</Link>
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

export default TagPage;
