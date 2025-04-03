import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Post, postService } from '../services/PostService';
import MarkdownRenderer from './MarkdownRenderer';

/**
 * Props for the PostDetail component
 */
interface PostDetailProps {
  /** Slug of the post to display */
  slug: string;
}

/**
 * Component to display a full blog post
 *
 * @param {PostDetailProps} props - Component props
 * @returns {JSX.Element} The rendered PostDetail component
 */
const PostDetail: React.FC<PostDetailProps> = ({ slug }) => {
  const [post, setPost] = useState<Post | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    /**
     * Loads the post data
     */
    const loadPost = async (): Promise<void> => {
      setLoading(true);
      try {
        console.log(`Attempting to load post with slug: ${slug}`);
        const postData = await postService.getPostBySlug(slug);
        if (postData) {
          console.log(`Successfully loaded post: ${postData.title}`);
          setPost(postData);
        } else {
          console.error(`Post with slug '${slug}' not found`);
          setError('Post not found');
        }
      } catch (err) {
        console.error('Failed to load post:', err);
        setError('Failed to load post');
      } finally {
        setLoading(false);
      }
    };

    loadPost();
  }, [slug]);

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
    return <div className="post-detail-loading">Loading post...</div>;
  }

  if (error || !post) {
    return <div className="post-detail-error">{error || 'Post not found'}</div>;
  }

  return (
    <>
      <div className="blog-header">
        <h1 className="blog-title">{post.title}</h1>
        <div className="blog-meta">
          {formatDate(post.date)}
          {post.tags.map(tag => (
            <Link to={`/tags/${tag}`} key={tag}>
              <span className="blog-tag">{tag}</span>
            </Link>
          ))}
        </div>
      </div>

      <div className="blog-content">
        <MarkdownRenderer content={post.content} />
      </div>
    </>
  );
};

export default PostDetail;
