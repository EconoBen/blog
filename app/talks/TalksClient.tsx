'use client';

import React, { useState } from 'react';
import { talksConfig, Talk } from '../config/talksConfig';

interface TalkCardProps {
  talk: Talk;
  viewMode: 'list' | 'grid';
}

const TalkCard: React.FC<TalkCardProps> = ({ talk, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const formatDate = (dateStr: string): string => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handlePlay = () => {
    setIsPlaying(true);
  };

  const getYouTubeUrl = (): string => {
    return `https://www.youtube.com/watch?v=${talk.youtubeId}`;
  };

  const getSpotifyEmbedUrl = (): string | null => {
    if (!talk.spotifyUrl) return null;
    // Extract episode ID from Spotify URL
    const match = talk.spotifyUrl.match(/episode\/([a-zA-Z0-9]+)/);
    if (match) {
      return `https://open.spotify.com/embed/episode/${match[1]}?utm_source=generator&theme=0`;
    }
    return null;
  };

  const isSpotify = !!talk.spotifyUrl && !talk.youtubeId;

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
        {isSpotify && getSpotifyEmbedUrl() ? (
          <iframe
            src={getSpotifyEmbedUrl()!}
            title={talk.title}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="spotify-embed"
          ></iframe>
        ) : isPlaying ? (
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
              src={`https://img.youtube.com/vi/${talk.youtubeId}/hqdefault.jpg`}
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

        <div className="talk-card-actions">
          {isSpotify ? (
            <>
              <a
                href={talk.spotifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="watch-talk-button spotify-button"
                aria-label={`Listen to ${talk.title} on Spotify`}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 496 512" fill="currentColor">
                  <path d="M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm100.7 364.9c-4.2 0-6.8-1.3-10.7-3.6-62.4-37.6-135-39.2-206.7-24.5-3.9 1-9 2.6-11.9 2.6-9.7 0-15.8-7.7-15.8-15.8 0-10.3 6.1-15.2 13.6-16.8 81.9-18.1 165.6-16.5 237 26.2 6.1 3.9 9.7 7.4 9.7 16.5s-7.1 15.4-15.2 15.4zm26.9-65.6c-5.2 0-8.7-2.3-12.3-4.2-62.5-37-155.7-51.9-238.6-29.4-4.8 1.3-7.4 2.6-11.9 2.6-10.7 0-19.4-8.7-19.4-19.4s5.2-17.8 15.5-20.7c27.8-7.8 56.2-13.6 97.8-13.6 64.9 0 127.6 16.1 177 45.5 8.1 4.8 11.3 11 11.3 19.7-.1 10.8-8.5 19.5-19.4 19.5zm31-76.2c-5.2 0-8.4-1.3-12.9-3.9-71.2-42.5-198.5-52.7-280.9-29.7-3.6 1-8.1 2.6-12.9 2.6-13.2 0-23.3-10.3-23.3-23.6 0-13.6 8.4-21.3 17.4-23.9 35.2-10.3 74.6-15.2 117.5-15.2 73 0 149.5 15.2 205.4 47.8 7.8 4.5 12.9 10.7 12.9 22.6 0 13.6-11 23.3-23.2 23.3z"/>
                </svg>
                <span>Listen on Spotify</span>
              </a>
              {talk.transcriptUrl && (
                <a
                  href={talk.transcriptUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="watch-talk-button transcript-button"
                  aria-label={`Read transcript of ${talk.title}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
                    <polyline points="14 2 14 8 20 8"></polyline>
                    <line x1="16" y1="13" x2="8" y2="13"></line>
                    <line x1="16" y1="17" x2="8" y2="17"></line>
                    <polyline points="10 9 9 9 8 9"></polyline>
                  </svg>
                  <span>Read Transcript</span>
                </a>
              )}
            </>
          ) : (
            <a
              href={getYouTubeUrl()}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-talk-button"
              aria-label={`Watch ${talk.title} on YouTube`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33A2.78 2.78 0 0 0 3.4 19c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.25 29 29 0 0 0-.46-5.33z"></path>
                <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
              </svg>
              <span>Watch Talk</span>
            </a>
          )}
        </div>
      </div>
    </div>
  );
};

const TalksClient: React.FC = () => {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const { title, subtitle, talks } = talksConfig;

  // Sort talks by date (newest first)
  const sortedTalks = [...talks].sort((a, b) =>
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const getTopTenTopics = (): string[] => {
    const topicCount = new Map<string, number>();

    talks.forEach(talk => {
      talk.topics.forEach(topic => {
        topicCount.set(topic, (topicCount.get(topic) || 0) + 1);
      });
    });

    return Array.from(topicCount.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 15)
      .map(entry => entry[0]);
  };

  const getFilteredTalks = (): Talk[] => {
    if (activeFilter === 'all') {
      return sortedTalks;
    }
    return sortedTalks.filter(talk => talk.topics.includes(activeFilter));
  };

  const handleFilterChange = (filter: string) => {
    setActiveFilter(filter);
  };

  return (
    <div className="talks-page">
      <div className="section-header">
        <h1 className="section-title">{title}</h1>
        <div className="section-line"></div>
        <p className="section-subtitle">{subtitle}</p>
      </div>

      <div className="talks-controls">
        <div className="talks-filter">
          <button
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => handleFilterChange('all')}
          >
            All Topics
          </button>
          {getTopTenTopics().map(topic => (
            <button
              key={topic}
              className={`filter-button ${activeFilter === topic ? 'active' : ''}`}
              onClick={() => handleFilterChange(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="talks-component-box">
        <div className="talks-component-header">
          <h2 className="talks-component-title">
            {activeFilter === 'all' ? 'All Talks' : `Talks about ${activeFilter}`}
          </h2>
          <div className="view-toggle">
            <button
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid View"
              title="Grid View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7"></rect>
                <rect x="14" y="3" width="7" height="7"></rect>
                <rect x="14" y="14" width="7" height="7"></rect>
                <rect x="3" y="14" width="7" height="7"></rect>
              </svg>
            </button>
            <button
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List View"
              title="List View"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6"></line>
                <line x1="8" y1="12" x2="21" y2="12"></line>
                <line x1="8" y1="18" x2="21" y2="18"></line>
                <line x1="3" y1="6" x2="3.01" y2="6"></line>
                <line x1="3" y1="12" x2="3.01" y2="12"></line>
                <line x1="3" y1="18" x2="3.01" y2="18"></line>
              </svg>
            </button>
          </div>
        </div>

        <div className="talks-component-content">
          <div className={`talks-container ${viewMode === 'list' ? 'talks-list' : 'talks-grid'}`}>
            {getFilteredTalks().map(talk => (
              <TalkCard key={talk.id} talk={talk} viewMode={viewMode} />
            ))}
          </div>

          {getFilteredTalks().length === 0 && (
            <div className="no-talks-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10"></circle>
                <line x1="12" y1="8" x2="12" y2="12"></line>
                <line x1="12" y1="16" x2="12.01" y2="16"></line>
              </svg>
              <p>No talks found with the selected topic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TalksClient;
