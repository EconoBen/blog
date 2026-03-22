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
  isOpen,
  onOpen,
}: {
  talk: Talk;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const spotifyEmbedUrl = getSpotifyEmbedUrl(talk);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(talk);
  const isSpotifyOnly = Boolean(talk.spotifyUrl && !talk.youtubeId);

  if (isOpen && isSpotifyOnly && spotifyEmbedUrl) {
    return (
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
    );
  }

  if (isOpen && youtubeEmbedUrl) {
    return (
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
    );
  }

  if (talk.youtubeId) {
    return (
      <button
        type="button"
        onClick={onOpen}
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
      onClick={onOpen}
      className="flex h-full w-full items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(180,197,255,0.45),_transparent_34%),linear-gradient(135deg,_#1d1c16,_#32302a)] text-left"
      aria-label={`Open ${talk.title} in the inline player`}
    >
      <div className="space-y-3 p-10 text-[#fef9ef]">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary-fixed-dim">Recording</p>
        <p className="max-w-sm font-headline text-2xl font-bold leading-tight">{talk.event}</p>
        <p className="max-w-sm font-body text-lg text-[#e7e2d8]">Open this session in the inline player or jump straight to the source.</p>
        <span className="inline-flex items-center gap-2 rounded-full bg-[#fef9ef]/10 px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest">
          Open player
        </span>
      </div>
    </button>
  );
}

function FeaturedTalk({
  talk,
  isOpen,
  onOpen,
}: {
  talk: Talk;
  isOpen: boolean;
  onOpen: () => void;
}) {
  const primarySourceUrl = getPrimarySourceUrl(talk);

  return (
    <article className="overflow-hidden rounded-2xl bg-surface-container-highest shadow-[0_24px_60px_rgba(29,28,22,0.06)]">
      <div className="grid h-full gap-0 lg:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)]">
        <div className="min-h-[340px] bg-surface-container-low">
          <TalkMediaPreview talk={talk} isOpen={isOpen} onOpen={onOpen} />
        </div>
        <div className="flex flex-col justify-between p-8 lg:p-10">
          <div className="space-y-6">
            <div className="flex flex-wrap items-center gap-3">
              <span className="rounded-sm bg-secondary-fixed-dim px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-fixed-variant">
                Featured recording
              </span>
              <span className="font-label text-xs uppercase tracking-widest text-secondary">{formatDate(talk.date)}</span>
            </div>
            <div className="space-y-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{talk.event}</p>
              <h2 className="max-w-xl font-headline text-3xl font-bold tracking-tight text-on-surface lg:text-4xl">{talk.title}</h2>
              <p className="max-w-xl font-body text-lg leading-relaxed text-secondary">{talk.description}</p>
            </div>
            <div className="flex flex-wrap gap-2">
              {talk.topics.slice(0, 6).map((topic) => (
                <span key={topic} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <div className="mt-8 flex flex-wrap gap-3">
            {primarySourceUrl && (
              <a
                href={primarySourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-primary-container px-5 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-primary"
              >
                {getPrimarySourceLabel(talk)}
              </a>
            )}
            {talk.transcriptUrl && (
              <a
                href={talk.transcriptUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-5 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-surface"
              >
                Read transcript
              </a>
            )}
            <button
              type="button"
              onClick={onOpen}
              className="inline-flex items-center justify-center rounded-lg bg-on-surface px-5 py-3 font-label text-xs font-bold uppercase tracking-widest text-surface"
            >
              {getPrimaryActionLabel(talk)}
            </button>
          </div>
        </div>
      </div>
    </article>
  );
}

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
  const spotifyEmbedUrl = getSpotifyEmbedUrl(talk);
  const youtubeEmbedUrl = getYouTubeEmbedUrl(talk);
  const primarySourceUrl = getPrimarySourceUrl(talk);
  const isSpotifyOnly = Boolean(talk.spotifyUrl && !talk.youtubeId);

  return (
    <article
      className={`group overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1 ${
        viewMode === 'grid' ? 'h-full' : 'lg:grid lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.05fr)]'
      }`}
    >
      <div className={`min-h-[240px] bg-surface-container-low ${viewMode === 'grid' ? '' : 'lg:min-h-full'}`}>
        {isOpen && isSpotifyOnly && spotifyEmbedUrl ? (
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
        ) : isOpen && youtubeEmbedUrl ? (
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
        ) : (
          <button
            type="button"
            onClick={onOpen}
            className="group relative block h-full w-full text-left"
            aria-label={`Open ${talk.title} in the inline player`}
          >
            {talk.youtubeId ? (
              <img
                src={`https://img.youtube.com/vi/${talk.youtubeId}/hqdefault.jpg`}
                alt={talk.title}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            ) : (
              <div className="flex h-full min-h-[240px] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(255,219,205,0.65),_transparent_36%),linear-gradient(135deg,_#fef9ef,_#ede8de)] p-8">
                <div className="max-w-xs space-y-3 text-center">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Recording</p>
                  <p className="font-headline text-2xl font-bold text-on-surface">{talk.event}</p>
                  <p className="font-body text-base leading-relaxed text-secondary">Open this session in the inline player to watch or listen in place.</p>
                </div>
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-on-surface/40 via-transparent to-transparent" />
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="flex h-14 w-14 items-center justify-center rounded-full bg-primary-container text-on-primary shadow-xl transition-transform duration-300 group-hover:scale-105">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="h-6 w-6">
                  <path d="M8 5v14l11-7z" />
                </svg>
              </div>
            </div>
          </button>
        )}
      </div>

      <div className="space-y-5 p-8">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="space-y-2">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{talk.event}</p>
            <h3 className="font-headline text-2xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
              {talk.title}
            </h3>
          </div>
          <time className="font-label text-[10px] uppercase tracking-widest text-secondary">{formatDate(talk.date)}</time>
        </div>

        <p className={`font-body text-secondary ${viewMode === 'grid' ? 'text-base' : 'text-lg leading-relaxed'}`}>
          {talk.description}
        </p>

        <div className="flex flex-wrap gap-2">
          {talk.topics.slice(0, viewMode === 'grid' ? 4 : 6).map((topic) => (
            <span key={topic} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
              {topic}
            </span>
          ))}
        </div>

        <div className="flex flex-wrap gap-3 pt-1">
          {primarySourceUrl && (
            <a
              href={primarySourceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
            >
              {getPrimarySourceLabel(talk)}
            </a>
          )}
          {talk.transcriptUrl && (
            <a
              href={talk.transcriptUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
            >
              Transcript
            </a>
          )}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-lg bg-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-surface"
            onClick={onOpen}
          >
            {isOpen ? 'Playing in page' : getPrimaryActionLabel(talk)}
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

  const sortedTalks = [...talks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

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

  const featuredTalk = filteredTalks.find((talk) => talk.id === activeTalkId) ?? filteredTalks[0] ?? null;

  return (
    <section className="mx-auto max-w-7xl px-8 pb-32">
      {featuredTalk && (
        <div className="mb-16 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(320px,0.8fr)]">
          <FeaturedTalk talk={featuredTalk} isOpen={featuredTalk.id === activeTalkId} onOpen={() => setActiveTalkId(featuredTalk.id)} />
          <aside className="rounded-2xl bg-surface-container-low p-8">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Browse recordings</p>
            <h2 className="mt-4 font-headline text-3xl font-bold leading-tight text-on-surface">
              {activeFilter === 'all' ? 'All talks, newest first.' : `Talks about ${activeFilter}.`}
            </h2>
            <p className="mt-4 font-body text-lg leading-relaxed text-secondary">
              Open a card, play it in place, and use the source links that matter for that recording.
            </p>
            <div className="mt-8 flex flex-wrap gap-2">
              <span className="rounded-full bg-surface-container-high px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
                Inline playback
              </span>
              <span className="rounded-full bg-surface-container-high px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
                Transcripts
              </span>
              <span className="rounded-full bg-surface-container-high px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
                Source links
              </span>
            </div>
            <div className="mt-8 space-y-3">
              {filteredTalks.slice(0, 3).map((talk) => (
                <button
                  key={talk.id}
                  type="button"
                  onClick={() => setActiveTalkId(talk.id)}
                  className="flex w-full items-start justify-between gap-4 rounded-xl bg-surface-container-high/60 px-4 py-3 text-left transition-colors hover:bg-surface-container-high"
                >
                  <span className="min-w-0">
                    <span className="block font-label text-[10px] font-bold uppercase tracking-[0.2em] text-primary">{talk.event}</span>
                    <span className="mt-1 block line-clamp-2 font-headline text-sm font-bold leading-snug text-on-surface">{talk.title}</span>
                  </span>
                  <span className="shrink-0 font-label text-[10px] uppercase tracking-widest text-secondary">{formatDate(talk.date)}</span>
                </button>
              ))}
            </div>
          </aside>
        </div>
      )}

      <div className="mb-8 flex flex-col gap-6 border-b border-outline-variant/30 pb-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex flex-wrap gap-3" aria-label="Talk topics">
          <button
            type="button"
            className={`rounded-full px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
              activeFilter === 'all'
                ? 'bg-surface-container-highest text-on-surface'
                : 'bg-surface-container-low text-secondary hover:bg-secondary-container hover:text-primary'
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
              className={`rounded-full px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                activeFilter === topic
                  ? 'bg-surface-container-highest text-on-surface'
                  : 'bg-surface-container-low text-secondary hover:bg-secondary-container hover:text-primary'
              }`}
              onClick={() => setActiveFilter(topic)}
              aria-pressed={activeFilter === topic}
            >
              {topic}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 rounded-lg bg-surface-container-low p-1">
            <button
              type="button"
              className={`rounded-md px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'grid' ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-secondary hover:text-on-surface'
              }`}
              onClick={() => setViewMode('grid')}
              aria-pressed={viewMode === 'grid'}
            >
              Grid
            </button>
            <button
              type="button"
              className={`rounded-md px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                viewMode === 'list' ? 'bg-surface-container-lowest text-on-surface shadow-sm' : 'text-secondary hover:text-on-surface'
              }`}
              onClick={() => setViewMode('list')}
              aria-pressed={viewMode === 'list'}
            >
              List
            </button>
          </div>
          <div className="hidden font-label text-[11px] uppercase tracking-widest text-secondary md:block">
            {filteredTalks.length} recordings
          </div>
        </div>
      </div>

      {filteredTalks.length === 0 ? (
        <div className="rounded-2xl bg-surface-container-low p-10 text-center">
          <p className="font-headline text-2xl font-bold text-on-surface">No talks found for that topic.</p>
        </div>
      ) : (
        <div className={viewMode === 'grid' ? 'grid gap-8 md:grid-cols-2 xl:grid-cols-3' : 'space-y-8'}>
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
      )}
    </section>
  );
}
