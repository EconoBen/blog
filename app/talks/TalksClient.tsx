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

const getPrimarySourceLabel = (talk: Talk): string => {
  if (talk.spotifyUrl && !talk.youtubeId) {
    return 'Open on Spotify';
  }

  return 'Watch on YouTube';
};

function TalkCard({
  talk,
  featured = false,
  compact = false,
  isOpen,
  onOpen,
}: {
  talk: Talk;
  featured?: boolean;
  compact?: boolean;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const [isHovered, setIsHovered] = useState(false);
  const spotifyEmbedUrl = getSpotifyEmbedUrl(talk);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(talk);
  const youtubeUrl = getYouTubeUrl(talk);
  const isSpotifyOnly = Boolean(talk.spotifyUrl && !talk.youtubeId);
  const primarySourceUrl = talk.spotifyUrl ?? youtubeUrl;
  const topicLimit = featured ? 6 : 4;

  return (
    <article
      className={`talk-card ${featured ? 'talk-card-featured' : ''} ${compact ? 'talk-card-grid' : ''} ${isHovered ? 'talk-card-hovered' : ''} ${isOpen ? 'is-open' : ''}`}
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
            <button
              type="button"
              className="talk-thumbnail-container spotify-container"
              onClick={onOpen}
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
            </button>
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
          <button
            type="button"
            className="talk-thumbnail-container"
            onClick={onOpen}
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
          </button>
        )}
      </div>

      <div className="talk-card-content">
        <div className="talk-card-header">
          <h3 className="talk-card-title">{talk.title}</h3>
          <div className="talk-card-meta">
            <span>{talk.event}</span>
            <span className="talk-card-date">{formatDate(talk.date)}</span>
            {talk.transcriptUrl && <span>Transcript available</span>}
          </div>
        </div>

        <p className="talk-card-description">{talk.description}</p>

        <div className="talk-card-topics">
          {talk.topics.slice(0, topicLimit).map((topic) => (
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
          {!isOpen && (
            <button type="button" className="watch-talk-button" onClick={onOpen}>
              <span>Open in page</span>
            </button>
          )}
        </div>
      </div>
    </article>
  );
}

export default function TalksClient() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
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
    .slice(0, 10)
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

  const activeTalk = filteredTalks.find((talk) => talk.id === activeTalkId) ?? filteredTalks[0] ?? null;
  const secondaryTalks = filteredTalks.filter((talk) => talk.id !== activeTalk?.id);

  return (
    <div className="talks-page">
      <div className="talks-controls" aria-label="Talk topics">
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

      {activeTalk && (
        <section className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Featured talk</p>
            <h2 className="editorial-page-section-title">Open the player inline, then use the source or transcript links if you need them.</h2>
          </div>
          <TalkCard
            key={activeTalk.id}
            talk={activeTalk}
            featured
            isOpen
            onOpen={() => setActiveTalkId(activeTalk.id)}
          />
        </section>
      )}

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Browse recordings</p>
          <h2 className="editorial-page-section-title">
            {activeFilter === 'all' ? 'Recent talks, podcasts, and livestreams.' : `More on ${activeFilter}.`}
          </h2>
        </div>

        <div className="editorial-talk-grid">
          {secondaryTalks.map((talk) => (
            <TalkCard
              key={talk.id}
              talk={talk}
              compact
              isOpen={false}
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
      </section>
    </div>
  );
}
