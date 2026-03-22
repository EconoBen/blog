'use client';

import { useEffect, useState } from 'react';
import { talksConfig, type Talk } from '../config/talksConfig';

const formatDate = (dateStr: string): string =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(dateStr));

const getYouTubeUrl = (talk: Talk): string | null => {
  if (!talk.youtubeId) return null;
  return `https://www.youtube.com/watch?v=${talk.youtubeId}`;
};

const getYouTubeEmbedUrl = (talk: Talk): string | null => {
  if (!talk.youtubeId) return null;
  return `https://www.youtube.com/embed/${talk.youtubeId}?autoplay=1`;
};

const getSpotifyEmbedUrl = (talk: Talk): string | null => {
  if (!talk.spotifyUrl) return null;

  const match = talk.spotifyUrl.match(/episode\/([a-zA-Z0-9]+)/);
  if (!match) return null;

  return `https://open.spotify.com/embed/episode/${match[1]}?utm_source=generator&theme=0`;
};

const getPrimaryActionLabel = (talk: Talk): string => {
  if (talk.spotifyUrl && !talk.youtubeId) {
    return 'Open player';
  }

  return 'Play in page';
};

const getPrimarySourceLabel = (talk: Talk): string => {
  if (talk.spotifyUrl && !talk.youtubeId) {
    return 'Listen on Spotify';
  }

  return 'Watch on YouTube';
};

function TalkCard({
  talk,
  viewMode,
  isOpen,
  onOpen,
}: {
  talk: Talk;
  viewMode: 'list' | 'grid';
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const spotifyEmbedUrl = getSpotifyEmbedUrl(talk);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(talk);
  const youtubeUrl = getYouTubeUrl(talk);
  const isSpotifyOnly = Boolean(talk.spotifyUrl && !talk.youtubeId);
  const primarySourceUrl = talk.spotifyUrl ?? youtubeUrl;

  return (
    <article
      className={`talk-card ${isHovered ? 'talk-card-hovered' : ''} ${
        viewMode === 'grid' ? 'talk-card-grid' : ''
      } ${isOpen ? 'is-open' : ''}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="talk-card-video">
        {isSpotifyOnly ? (
          isOpen && spotifyEmbedUrl ? (
            <iframe
              src={spotifyEmbedUrl}
              title={talk.title}
              frameBorder="0"
              allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="spotify-embed"
            />
          ) : (
            <div
              className="talk-thumbnail-container spotify-container"
              role="button"
              tabIndex={0}
              onClick={onOpen}
              onKeyDown={(event) => {
                if (event.key === 'Enter' || event.key === ' ') {
                  event.preventDefault();
                  onOpen();
                }
              }}
              aria-label={`Open ${talk.title} in the inline player`}
            >
              <div className="spotify-placeholder">
                <span className="spotify-label">Spotify episode</span>
                <div className="talk-play-button" aria-hidden="true">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
                <span className="spotify-label">Open player</span>
              </div>
            </div>
          )
        ) : isOpen && youtubeEmbedUrl ? (
          <iframe
            src={youtubeEmbedUrl}
            title={talk.title}
            frameBorder="0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        ) : (
          <div
            className="talk-thumbnail-container"
            role="button"
            tabIndex={0}
            onClick={onOpen}
            onKeyDown={(event) => {
              if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                onOpen();
              }
            }}
            aria-label={`Open ${talk.title} in the inline player`}
          >
            {talk.youtubeId ? (
              <img
                src={`https://img.youtube.com/vi/${talk.youtubeId}/hqdefault.jpg`}
                alt={talk.title}
                className="talk-thumbnail"
              />
            ) : (
              <div className="spotify-placeholder">
                <span className="spotify-label">Recording</span>
                <span className="spotify-label">Open to play</span>
              </div>
            )}
            <div className="talk-play-button" aria-hidden="true">
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
            {isOpen && <span>Playing in page</span>}
          </div>
        </div>

        {viewMode !== 'grid' && <p className="talk-card-description">{talk.description}</p>}

        <div className="talk-card-topics">
          {talk.topics.slice(0, viewMode === 'grid' ? 4 : 6).map((topic) => (
            <span key={topic} className="talk-topic-tag">
              {topic}
            </span>
          ))}
        </div>

        <div className="talk-card-actions">
          {primarySourceUrl && (
            <a
              href={primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-talk-button"
            >
              <span>{getPrimarySourceLabel(talk)}</span>
            </a>
          )}
          {talk.transcriptUrl && (
            <a
              href={talk.transcriptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="watch-talk-button transcript-button"
            >
              <span>Read transcript</span>
            </a>
          )}
          <button type="button" className="watch-talk-button" onClick={onOpen}>
            <span>{getPrimaryActionLabel(talk)}</span>
          </button>
        </div>
      </div>
    </article>
  );
}

export default function TalksClient() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const { talks } = talksConfig;

  const sortedTalks = [...talks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  const topicCounts = new Map<string, number>();
  sortedTalks.forEach((talk) => {
    talk.topics.forEach((topic) => {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    });
  });

  const topicFilters = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 12)
    .map(([topic]) => topic);

  const filteredTalks =
    activeFilter === 'all'
      ? sortedTalks
      : sortedTalks.filter((talk) => talk.topics.includes(activeFilter));

  const [activeTalkId, setActiveTalkId] = useState<string>(sortedTalks[0]?.id ?? '');

  useEffect(() => {
    if (filteredTalks.length === 0) {
      setActiveTalkId('');
      return;
    }

    if (!filteredTalks.some((talk) => talk.id === activeTalkId)) {
      setActiveTalkId(filteredTalks[0].id);
    }
  }, [activeTalkId, filteredTalks]);

  return (
    <div className="talks-page">
      <div className="talks-controls">
        <div className="talks-filter" aria-label="Talk topics">
          <button
            type="button"
            className={`filter-button ${activeFilter === 'all' ? 'active' : ''}`}
            onClick={() => setActiveFilter('all')}
          >
            All talks
          </button>
          {topicFilters.map((topic) => (
            <button
              type="button"
              key={topic}
              className={`filter-button ${activeFilter === topic ? 'active' : ''}`}
              onClick={() => setActiveFilter(topic)}
            >
              {topic}
            </button>
          ))}
        </div>
      </div>

      <div className="talks-component-box">
        <div className="talks-component-header">
          <h2 className="talks-component-title">
            {activeFilter === 'all' ? 'Browse recordings' : `Talks about ${activeFilter}`}
          </h2>
          <div className="view-toggle" aria-label="Talk view mode">
            <button
              type="button"
              className={`view-button ${viewMode === 'grid' ? 'active' : ''}`}
              onClick={() => setViewMode('grid')}
              aria-label="Grid view"
              title="Grid view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="3" width="7" height="7" />
                <rect x="14" y="3" width="7" height="7" />
                <rect x="14" y="14" width="7" height="7" />
                <rect x="3" y="14" width="7" height="7" />
              </svg>
            </button>
            <button
              type="button"
              className={`view-button ${viewMode === 'list' ? 'active' : ''}`}
              onClick={() => setViewMode('list')}
              aria-label="List view"
              title="List view"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="8" y1="6" x2="21" y2="6" />
                <line x1="8" y1="12" x2="21" y2="12" />
                <line x1="8" y1="18" x2="21" y2="18" />
                <line x1="3" y1="6" x2="3.01" y2="6" />
                <line x1="3" y1="12" x2="3.01" y2="12" />
                <line x1="3" y1="18" x2="3.01" y2="18" />
              </svg>
            </button>
          </div>
        </div>

        <div className="talks-component-content">
          <div className={`talks-container ${viewMode === 'list' ? 'talks-list' : 'talks-grid'}`}>
            {filteredTalks.map((talk) => (
              <TalkCard
                key={talk.id}
                talk={talk}
                viewMode={viewMode}
                isOpen={talk.id === activeTalkId}
                onOpen={() => setActiveTalkId(talk.id)}
              />
            ))}
          </div>

          {filteredTalks.length === 0 && (
            <div className="no-talks-message">
              <svg xmlns="http://www.w3.org/2000/svg" width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1" strokeLinecap="round" strokeLinejoin="round">
                <circle cx="12" cy="12" r="10" />
                <line x1="12" y1="8" x2="12" y2="12" />
                <line x1="12" y1="16" x2="12.01" y2="16" />
              </svg>
              <p>No talks found for that topic.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
