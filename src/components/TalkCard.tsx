import React, { useState } from 'react';
import { Talk } from '../types';

/**
 * Props for the TalkCard component
 */
interface TalkCardProps {
  /** Talk data */
  talk: Talk;
  /** Display mode - list or grid */
  viewMode: 'list' | 'grid';
}

/**
 * TalkCard component displays a conference talk with YouTube video preview
 *
 * @param {TalkCardProps} props - Component properties
 * @returns {JSX.Element} The rendered TalkCard component
 */
const TalkCard: React.FC<TalkCardProps> = ({ talk, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  /**
   * Format date for display
   *
   * @param {string} dateStr - ISO date string
   * @returns {string} Formatted date
   */
  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  /**
   * Handle playing the YouTube video
   */
  const handlePlay = () => {
    setIsPlaying(true);
  };

  // Generate appropriate CSS classes based on view mode
  const cardClasses = `talk-card ${isHovered ? 'talk-card-hovered' : ''} ${
    viewMode === 'grid' ? 'talk-card-grid' : ''
  }`;

  return (
    <div
      className={cardClasses}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="talk-card-video">
        {isPlaying ? (
          <iframe
            src={`https://www.youtube.com/embed/${talk.youtubeId}?autoplay=1`}
            title={talk.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        ) : (
          <div className="talk-thumbnail-container" onClick={handlePlay}>
            <img
              src={talk.thumbnail || `https://img.youtube.com/vi/${talk.youtubeId}/hqdefault.jpg`}
              alt={talk.title}
              className="talk-thumbnail"
            />
            <div className="talk-play-button">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
          </div>
        )}
      </div>

      <div className="talk-card-content">
        <div className="talk-card-header">
          <h3 className="talk-card-title">{talk.title}</h3>
          <div className="talk-card-meta">
            <span className="talk-card-event">{talk.event}</span>
            <span className="talk-card-date">{formatDate(talk.date)}</span>
          </div>
        </div>

        {viewMode !== 'grid' && (
          <p className="talk-card-description">{talk.description}</p>
        )}

        <div className="talk-card-topics">
          {talk.topics.map((topic, index) => (
            <span key={index} className="talk-topic-tag">{topic}</span>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TalkCard;
