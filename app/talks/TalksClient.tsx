'use client';

import { useState } from 'react';
import { talksConfig, type Talk } from '../config/talksConfig';

const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const formatDate = (dateStr: string): string => {
  const [year, month, day] = dateStr.split('-');
  return `${MONTHS[Number(month) - 1]} ${Number(day)}, ${year}`;
};

const getYouTubeUrl = (talk: Talk): string | null => {
  if (!talk.youtubeId) return null;
  return `https://www.youtube.com/watch?v=${talk.youtubeId}`;
};

const getYouTubeEmbedUrl = (talk: Talk): string | null => {
  if (!talk.youtubeId) return null;
  return `https://www.youtube.com/embed/${talk.youtubeId}`;
};

const getSpotifyEmbedUrl = (talk: Talk): string | null => {
  if (!talk.spotifyUrl) return null;

  const match = talk.spotifyUrl.match(/episode\/([a-zA-Z0-9]+)/);
  if (!match) return null;

  return `https://open.spotify.com/embed/episode/${match[1]}?utm_source=generator&theme=0`;
};

const getPrimarySourceLabel = (talk: Talk): string => {
  if (talk.spotifyUrl && !talk.youtubeId) {
    return 'Listen on Spotify';
  }

  return 'Watch on YouTube';
};

const getPrimaryActionLabel = (talk: Talk): string => {
  if (talk.spotifyUrl && !talk.youtubeId) {
    return 'Open player';
  }

  return 'Play in page';
};

const getPrimarySourceUrl = (talk: Talk): string | null => talk.spotifyUrl ?? getYouTubeUrl(talk);

function TalkMediaPreview({
  talk,
}: {
  talk: Talk;
}) {
  const [playerOpen, setPlayerOpen] = useState(false);
  const spotifyEmbedUrl = getSpotifyEmbedUrl(talk);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(talk);
  const isSpotifyOnly = Boolean(talk.spotifyUrl && !talk.youtubeId);

  if (playerOpen && isSpotifyOnly && spotifyEmbedUrl) {
    return (
      <div className="h-full w-full">
        <iframe
          src={spotifyEmbedUrl}
          title={talk.title}
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    );
  }

  if (playerOpen && youtubeEmbedUrl) {
    return (
      <div className="h-full w-full">
        <iframe
          src={youtubeEmbedUrl}
          title={talk.title}
          frameBorder="0"
          sandbox="allow-scripts allow-same-origin allow-popups allow-forms allow-presentation"
          allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          referrerPolicy="strict-origin-when-cross-origin"
          loading="lazy"
          className="h-full w-full"
        />
      </div>
    );
  }

  if (talk.youtubeId) {
    return (
      <button
        type="button"
        onClick={() => setPlayerOpen(true)}
        className="group relative block h-full w-full overflow-hidden text-left"
        aria-label={`Open ${talk.title} in the inline player`}
      >
        <img
          src={`https://img.youtube.com/vi/${talk.youtubeId}/hqdefault.jpg`}
          alt={talk.title}
          className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent" />
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-xl transition-transform duration-300 group-hover:scale-105">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-7 w-7">
              <path d="M8 5v14l11-7z" />
            </svg>
          </div>
        </div>
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={() => setPlayerOpen(true)}
      className="flex h-full w-full items-center justify-center bg-[#fdf8ec] text-left"
      aria-label={`Open ${talk.title} in the inline player`}
    >
      <div className="space-y-3 p-10 text-[#1d1c16]">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-10 w-10 text-[#0035a0]/40">
          <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55C7.79 13 6 14.79 6 17s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z" />
        </svg>
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#0035a0]">Podcast</p>
        <p className="max-w-sm font-headline text-xl font-bold leading-tight">{talk.event}</p>
        <span className="hidden items-center gap-2 rounded-lg bg-[#0035a0]/8 px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-[#0035a0] md:inline-flex">
          Open player
        </span>
      </div>
    </button>
  );
}

function FeaturedTalk({ talk }: { talk: Talk }) {
  const [videoOpen, setVideoOpen] = useState(false);
  const primarySourceUrl = getPrimarySourceUrl(talk);
  const spotifyEmbedUrl = getSpotifyEmbedUrl(talk);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(talk);
  const isSpotifyOnly = Boolean(talk.spotifyUrl && !talk.youtubeId);

  return (
    <article className="sticky-note overflow-hidden featured-shimmer transition-shadow duration-300 hover:shadow-[0_24px_60px_rgba(29,28,22,0.1)]">
      {/* Spotify: show embed directly */}
      {isSpotifyOnly && spotifyEmbedUrl && (
        <div className="border-b border-[#1d1c16]/6">
          <iframe
            src={spotifyEmbedUrl}
            title={talk.title}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-[152px] w-full"
          />
        </div>
      )}

      {/* YouTube: show thumbnail or embed */}
      {talk.youtubeId && (
        <div className="relative aspect-video max-h-[360px] w-full overflow-hidden bg-surface-container-low">
          {videoOpen && youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              title={talk.title}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          ) : (
            <button
              type="button"
              onClick={() => setVideoOpen(true)}
              className="group relative block h-full w-full overflow-hidden text-left"
              aria-label={`Play ${talk.title}`}
            >
              <img
                src={`https://img.youtube.com/vi/${talk.youtubeId}/maxresdefault.jpg`}
                alt={talk.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#1d1c16]/50 via-transparent to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white/90 text-[#1d1c16] shadow-xl transition-transform duration-300 group-hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-1 h-7 w-7">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </div>
            </button>
          )}
        </div>
      )}

      <div className="p-5 md:p-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div className="flex-1 space-y-2">
            <div className="flex flex-wrap items-center gap-3">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{talk.event}</p>
              <span className="font-label text-[10px] uppercase tracking-widest text-secondary">{formatDate(talk.date)}</span>
            </div>
            <h2 className="font-headline text-xl font-bold tracking-tight text-on-surface md:text-2xl">{talk.title}</h2>
            <p className="max-w-2xl font-body text-sm leading-relaxed text-secondary">{talk.description}</p>
          </div>
          <div className="flex shrink-0 flex-wrap items-center gap-3">
            {primarySourceUrl && (
              <a
                href={primarySourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1"
              >
                {getPrimarySourceLabel(talk)}
              </a>
            )}
            {talk.transcriptUrl && (
              <a
                href={talk.transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center font-label text-[11px] font-bold uppercase tracking-widest text-secondary transition-colors hover:text-primary"
              >
                Transcript
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}

function TalkCard({
  talk,
  viewMode,
}: {
  talk: Talk;
  viewMode: 'list' | 'grid';
}) {
  const [isOpen, setIsOpen] = useState(false);
  const spotifyEmbedUrl = getSpotifyEmbedUrl(talk);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(talk);
  const primarySourceUrl = getPrimarySourceUrl(talk);
  const isSpotifyOnly = Boolean(talk.spotifyUrl && !talk.youtubeId);

  return (
    <article
      className={`sticky-note overflow-hidden group transition-transform duration-300 hover:-translate-y-1 ${
        viewMode === 'grid' ? 'flex h-full flex-col' : 'lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
      }`}
    >
      {isSpotifyOnly && spotifyEmbedUrl ? (
        <div className="bg-[#282828]">
          <iframe
            src={spotifyEmbedUrl}
            title={talk.title}
            frameBorder="0"
            allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
            allowFullScreen
            loading="lazy"
            className="h-[152px] w-full"
          />
        </div>
      ) : (
        <div className={`relative overflow-hidden bg-surface-container-low ${viewMode === 'grid' ? 'aspect-video' : 'aspect-video lg:aspect-auto lg:min-h-full'}`}>
          {isOpen && youtubeEmbedUrl ? (
            <iframe
              src={youtubeEmbedUrl}
              title={talk.title}
              frameBorder="0"
              allow="accelerometer; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              loading="lazy"
              className="h-full w-full"
            />
          ) : (
            <>
              {talk.youtubeId && (
                <img
                  src={`https://img.youtube.com/vi/${talk.youtubeId}/hqdefault.jpg`}
                  alt={talk.title}
                  className="absolute inset-0 h-full w-full object-cover"
                />
              )}
              <button
                type="button"
                onClick={() => setIsOpen(true)}
                className="absolute inset-0 z-10 flex items-center justify-center"
                aria-label={`Open ${talk.title} in the inline player`}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white text-[#1d1c16] shadow-md transition-transform duration-300 hover:scale-110">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="ml-0.5 h-4 w-4">
                    <path d="M8 5v14l11-7z" />
                  </svg>
                </div>
              </button>
            </>
          )}
        </div>
      )}

      <div className="flex flex-1 flex-col space-y-3 p-5">
        <div className="flex flex-wrap items-center gap-3" suppressHydrationWarning>
          <span className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{talk.event}</span>
          <span className="font-label text-[10px] uppercase tracking-widest text-secondary" suppressHydrationWarning>{formatDate(talk.date)}</span>
        </div>
        <h3 className="font-headline text-base font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
          {talk.title}
        </h3>

        <div className="mt-auto space-y-1.5 pt-2">
          <div className="flex flex-wrap gap-1.5">
            {talk.topics.slice(0, 3).map((topic) => (
              <span key={topic} className="rounded-full bg-surface-container-low px-2.5 py-0.5 font-label text-[9px] font-bold uppercase tracking-wider text-secondary">
                {topic}
              </span>
            ))}
          </div>
          {primarySourceUrl && (
            <a
              href={primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-3 py-1.5 font-label text-[10px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
            >
              {getPrimarySourceLabel(talk)}
            </a>
          )}
        </div>
      </div>
    </article>
  );
}

export default function TalksClient() {
  const [activeFilter, setActiveFilter] = useState<string>('all');
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const { talks } = talksConfig;

  const sortedTalks = [...talks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const topicCounts = new Map<string, number>();
  sortedTalks.forEach((talk) => {
    talk.topics.forEach((topic) => {
      topicCounts.set(topic, (topicCounts.get(topic) ?? 0) + 1);
    });
  });

  const topicFilters = Array.from(topicCounts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([topic]) => topic);

  const filteredTalks =
    activeFilter === 'all'
      ? sortedTalks
      : sortedTalks.filter((talk) => talk.topics.includes(activeFilter));

  const featuredTalk = filteredTalks[0] ?? null;
  const archiveTalks = filteredTalks;
  const archiveSummary =
    activeFilter === 'all'
      ? `${archiveTalks.length} more session${archiveTalks.length === 1 ? '' : 's'} below the featured recording.`
      : `${filteredTalks.length} session${filteredTalks.length === 1 ? '' : 's'} tagged ${activeFilter}.`;

  return (
    <section className="mx-auto max-w-[1440px] px-8">
      {featuredTalk && (
        <div className="space-y-5">
          <FeaturedTalk talk={featuredTalk} />
          <div className="pt-1">
            <div className="sticky-note space-y-4 px-4 py-4 lg:px-5">
              <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
                <div className="flex items-center gap-2 rounded-full border border-outline-variant/15 p-1 self-start lg:self-auto" style={{ background: '#fdf8ec' }}>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      viewMode === 'list' ? 'text-on-surface shadow-sm' : 'text-on-surface/50 hover:text-on-surface'
                    }`}
                    style={viewMode === 'list' ? { background: '#fdf8ec' } : undefined}
                    onClick={() => setViewMode('list')}
                    aria-pressed={viewMode === 'list'}
                  >
                    List
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      viewMode === 'grid' ? 'text-on-surface shadow-sm' : 'text-on-surface/50 hover:text-on-surface'
                    }`}
                    style={viewMode === 'grid' ? { background: '#fdf8ec' } : undefined}
                    onClick={() => setViewMode('grid')}
                    aria-pressed={viewMode === 'grid'}
                  >
                    Grid
                  </button>
                </div>
              </div>
              <div
                className="flex gap-2 overflow-x-auto pb-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden lg:flex-wrap lg:overflow-visible lg:pb-0"
                aria-label="Talk topics"
              >
                <button
                  type="button"
                  className={`shrink-0 px-3.5 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                    activeFilter === 'all'
                      ? 'rounded-t-lg rounded-b-none bg-[#0035a0] text-white'
                      : 'text-on-surface/50 hover:text-on-surface'
                  }`}
                  onClick={() => setActiveFilter('all')}
                  aria-pressed={activeFilter === 'all'}
                >
                  All talks
                </button>
                {topicFilters.map((topic) => (
                  <button
                    type="button"
                    key={topic}
                    className={`shrink-0 px-3.5 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      activeFilter === topic
                        ? 'rounded-t-lg rounded-b-none bg-[#0035a0] text-white'
                        : 'text-on-surface/50 hover:text-on-surface'
                    }`}
                    onClick={() => setActiveFilter(topic)}
                    aria-pressed={activeFilter === topic}
                  >
                    {topic}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {filteredTalks.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-low p-10 text-center">
          <p className="font-headline text-2xl font-bold text-on-surface">
            {activeFilter === 'all' ? 'No talks available yet.' : 'No talks found for that topic.'}
          </p>
        </div>
      ) : archiveTalks.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-low p-8">
          <p className="font-body text-base leading-relaxed text-secondary">
            This filter only leaves the featured recording. Open it above or clear the filter to browse the rest of the archive.
          </p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid gap-5 sm:grid-cols-2 lg:grid-cols-3' : 'space-y-5'}>
          {archiveTalks.map((talk) => (
            <TalkCard
              key={talk.id}
              talk={talk}
              viewMode={viewMode}
            />
          ))}
        </div>
      )}
    </section>
  );
}
