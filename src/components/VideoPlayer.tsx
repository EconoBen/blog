import React from 'react';

interface VideoPlayerProps {
  src: string;
  title?: string;
  poster?: string;
  width?: string;
  height?: string;
}

/**
 * VideoPlayer component for embedding videos
 * Supports both external URLs and GitHub-hosted videos
 */
const VideoPlayer: React.FC<VideoPlayerProps> = ({ 
  src, 
  title = "Video", 
  poster,
  width = "100%",
  height = "auto"
}) => {
  // Check if it's a local path that needs to be converted
  const videoSrc = src.startsWith('/assets/') 
    ? `https://github.com/EconoBen/blog/releases/download/v1.0-media/${src.split('/').pop()}`
    : src;

  return (
    <div className="video-container" style={{ 
      width, 
      maxWidth: '800px', 
      margin: '20px auto',
      borderRadius: '8px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
    }}>
      <video 
        controls 
        width="100%" 
        height={height}
        poster={poster}
        style={{ display: 'block' }}
        preload="metadata"
      >
        <source src={videoSrc} type="video/mp4" />
        <source src={videoSrc.replace('.mp4', '.m4v')} type="video/mp4" />
        <p>
          Your browser does not support the video tag. 
          <a href={videoSrc} download>Download the video</a> instead.
        </p>
      </video>
      {title && (
        <p style={{ 
          textAlign: 'center', 
          margin: '10px 0', 
          fontSize: '0.9em',
          color: 'var(--text-secondary)'
        }}>
          {title}
        </p>
      )}
    </div>
  );
};

export default VideoPlayer;