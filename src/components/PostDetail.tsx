import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import { Post, postService } from '../services/PostService';
import MarkdownRenderer from './MarkdownRenderer';
import { isMobileDevice } from '../utils/deviceDetection';
import AudioPlayer from './AudioPlayer';
import audioManifest from '../config/audioManifest.json';

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

  const postUrl = `https://econoben.dev/posts/${slug}`;
  
  // If post has a cover image, use it; otherwise generate dynamic OG image
  const imageUrl = post.coverImage 
    ? `https://econoben.dev${post.coverImage}`
    : (() => {
        const ogImageParams = new URLSearchParams({
          title: post.title,
          date: post.date.toISOString(),
          tags: post.tags.join(','),
          ...(post.summary && { summary: post.summary }),
        });
        return `https://econoben.dev/api/og?${ogImageParams.toString()}`;
      })();

  return (
    <>
      <Helmet>
        <title>{post.title} - Ben Labaschin</title>
        <meta name="description" content={post.summary} />
        
        {/* Open Graph tags for social media previews */}
        <meta property="og:type" content="article" />
        <meta property="og:title" content={post.title} />
        <meta property="og:description" content={post.summary} />
        <meta property="og:url" content={postUrl} />
        <meta property="og:image" content={imageUrl} />
        <meta property="og:site_name" content="Ben Labaschin's Blog" />
        
        {/* Twitter Card tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post.title} />
        <meta name="twitter:description" content={post.summary} />
        <meta name="twitter:image" content={imageUrl} />
        
        {/* Article specific meta tags */}
        <meta property="article:published_time" content={post.date.toISOString()} />
        <meta property="article:author" content="Ben Labaschin" />
        {post.tags.map((tag) => (
          <meta property="article:tag" content={tag} key={tag} />
        ))}
      </Helmet>
      
      <div className="blog-header">
        <h1 className="blog-title">{post.title}</h1>
        <div className="blog-meta">
          {formatDate(post.date)}
          {post.tags.map(tag => {
            // Check if the device is mobile
            if (isMobileDevice()) {
              // On mobile: Just display the tag as a span, no link
              return (
                <span className="blog-tag" key={tag}>{tag}</span>
              );
            } else {
              // On desktop: Use the Link component
              return (
                <Link to={`/tags/${tag}`} key={tag}>
                  <span className="blog-tag">{tag}</span>
                </Link>
              );
            }
          })}
        </div>
      </div>

      {/* Audio Player - only show if audio file exists */}
      {audioManifest[slug as keyof typeof audioManifest] && (
        <AudioPlayer 
          audioUrl={audioManifest[slug as keyof typeof audioManifest]}
          title="Listen to this post"
          className="post-audio-player"
        />
      )}

      <div className="blog-content">
        <MarkdownRenderer content={post.content} />
      </div>
    </>
  );
};

export default PostDetail;
