'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';

interface Post {
  slug: string;
  title: string;
  date: Date;
  summary?: string;
  tags: string[];
  coverImage?: string;
  image?: string;
  readingTime?: number;
}

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const primaryTag = (post: Post) => post.tags[0] ?? 'Editorial';

/* ── Theme mapping: tags → colors + CSS gradient illustrations ── */

interface CardTheme {
  bg: string;
  gradient: string;
  dotColor: string;
  accentColor: string;
}

const themeMap: Record<string, CardTheme> = {
  ai:        { bg: '#eef2ff', gradient: 'radial-gradient(circle at 75% 30%, #c7d2fe 0%, transparent 50%), radial-gradient(circle at 25% 70%, #a5b4fc 0%, transparent 40%)', dotColor: '#818cf8', accentColor: '#6366f1' },
  llm:       { bg: '#f0f9ff', gradient: 'radial-gradient(circle at 30% 40%, #bae6fd 0%, transparent 50%), radial-gradient(circle at 80% 60%, #7dd3fc 0%, transparent 45%)', dotColor: '#38bdf8', accentColor: '#0ea5e9' },
  cloud:     { bg: '#f0fdf4', gradient: 'radial-gradient(circle at 50% 30%, #bbf7d0 0%, transparent 55%), radial-gradient(circle at 20% 70%, #dcfce7 0%, transparent 40%)', dotColor: '#4ade80', accentColor: '#22c55e' },
  finance:   { bg: '#fefce8', gradient: 'radial-gradient(circle at 60% 50%, #fef08a 0%, transparent 50%), radial-gradient(circle at 20% 30%, #fde047 0%, transparent 35%)', dotColor: '#facc15', accentColor: '#eab308' },
  code:      { bg: '#fdf4ff', gradient: 'radial-gradient(circle at 40% 35%, #e9d5ff 0%, transparent 50%), radial-gradient(circle at 80% 70%, #d8b4fe 0%, transparent 40%)', dotColor: '#c084fc', accentColor: '#a855f7' },
  review:    { bg: '#fff7ed', gradient: 'radial-gradient(circle at 70% 40%, #fed7aa 0%, transparent 50%), radial-gradient(circle at 25% 65%, #fdba74 0%, transparent 40%)', dotColor: '#fb923c', accentColor: '#f97316' },
  economics: { bg: '#f8fafc', gradient: 'radial-gradient(circle at 55% 45%, #cbd5e1 0%, transparent 50%), radial-gradient(circle at 20% 25%, #e2e8f0 0%, transparent 40%)', dotColor: '#94a3b8', accentColor: '#64748b' },
  security:  { bg: '#ecfdf5', gradient: 'radial-gradient(circle at 45% 40%, #a7f3d0 0%, transparent 50%), radial-gradient(circle at 80% 60%, #6ee7b7 0%, transparent 40%)', dotColor: '#34d399', accentColor: '#10b981' },
  personal:  { bg: '#fdf2f8', gradient: 'radial-gradient(circle at 35% 50%, #fbcfe8 0%, transparent 50%), radial-gradient(circle at 75% 35%, #f9a8d4 0%, transparent 40%)', dotColor: '#f472b6', accentColor: '#ec4899' },
  history:   { bg: '#f5f3ff', gradient: 'radial-gradient(circle at 50% 40%, #ddd6fe 0%, transparent 55%), radial-gradient(circle at 15% 60%, #c4b5fd 0%, transparent 35%)', dotColor: '#a78bfa', accentColor: '#7c3aed' },
};

const tagToThemeKey = (tags: string[]): string => {
  const joined = tags.join(' ').toLowerCase();
  if (joined.includes('ai agent') || joined.includes('agents')) return 'ai';
  if (joined.includes('llm') || joined.includes('llms')) return 'llm';
  if (joined.includes('aws') || joined.includes('docker') || joined.includes('ecs') || joined.includes('cloud')) return 'cloud';
  if (joined.includes('student loan') || joined.includes('debt') || joined.includes('financial')) return 'finance';
  if (joined.includes('year in review') || joined.includes('personal goals')) return 'review';
  if (joined.includes('developer') || joined.includes('spec-driven') || joined.includes('podcast') || joined.includes('developer tooling')) return 'code';
  if (joined.includes('ssh') || joined.includes('1password') || joined.includes('vpn') || joined.includes('security')) return 'security';
  if (joined.includes('economics') || joined.includes('labor') || joined.includes('gpt')) return 'economics';
  if (joined.includes('pandas') || joined.includes('python') || joined.includes('groupby')) return 'code';
  if (joined.includes('service design') || joined.includes('naming')) return 'code';
  if (joined.includes('time-sharing') || joined.includes('computer history') || joined.includes('round-robin')) return 'history';
  if (joined.includes('personal') || joined.includes('grief') || joined.includes('loss')) return 'personal';
  if (joined.includes('openai') || joined.includes('tts') || joined.includes('text-to-speech')) return 'ai';
  if (joined.includes('rag') || joined.includes('synology')) return 'llm';
  if (joined.includes("o'reilly") || joined.includes('publishing') || joined.includes('machine learning')) return 'ai';
  if (joined.includes('ai')) return 'ai';
  return 'economics';
};

const hashSlug = (slug: string) => {
  let h = 0;
  for (let i = 0; i < slug.length; i++) {
    h = ((h << 5) - h + slug.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

function PostIllustration({ post }: { post: Post }) {
  const themeKey = tagToThemeKey(post.tags);
  const theme = themeMap[themeKey] ?? themeMap.economics;
  const seed = hashSlug(post.slug);
  const x1 = 15 + (seed % 30);
  const x2 = 55 + ((seed >> 4) % 30);
  const y1 = 20 + (seed % 25);
  const y2 = 35 + ((seed >> 3) % 25);
  const s1 = 6 + (seed % 8);
  const s2 = 4 + ((seed >> 2) % 6);
  const s3 = 8 + ((seed >> 5) % 10);

  return (
    <div className="h-[60px] overflow-hidden rounded-lg md:h-[80px]" style={{ background: theme.bg, position: 'relative' }}>
      <div style={{ position: 'absolute', inset: 0, backgroundImage: theme.gradient, opacity: 0.7 }} />
      <div style={{ position: 'absolute', left: `${x1}%`, top: `${y1}%`, width: s1 * 2, height: s1 * 2, borderRadius: '50%', background: theme.dotColor, opacity: 0.25 }} />
      <div style={{ position: 'absolute', left: `${x2}%`, top: `${y2}%`, width: s2 * 2, height: s2 * 2, borderRadius: 2, background: theme.accentColor, opacity: 0.15, transform: 'rotate(45deg)' }} />
      <div style={{ position: 'absolute', left: `${String(35 + ((seed >> 8) % 25))}%`, top: '50%', width: s3 * 3, height: 2, background: theme.accentColor, opacity: 0.18, borderRadius: 1, transform: 'translateY(-50%)' }} />
      <div style={{ position: 'absolute', right: `${12 + (seed % 15)}%`, top: `${18 + ((seed >> 6) % 20)}%`, width: s2 * 3, height: s2 * 3, borderRadius: '50%', border: `1.5px solid ${theme.dotColor}`, opacity: 0.2 }} />
      <div style={{ position: 'absolute', right: `${8 + ((seed >> 1) % 12)}%`, bottom: `${15 + ((seed >> 7) % 18)}%`, width: s1, height: s1, borderRadius: '50%', background: theme.dotColor, opacity: 0.18 }} />
    </div>
  );
}

export function PostsList({ posts, latestSlug }: { posts: Post[]; latestSlug?: string }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');
  const [hasMounted, setHasMounted] = useState(false);
  useEffect(() => { setHasMounted(true); }, []);

  if (!hasMounted) {
    return <div style={{ minHeight: 400 }} />;
  }

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">All posts</p>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface">{posts.length} posts</p>
          {latestSlug && (
            <Link href={`/posts/${latestSlug}`} className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
              Read latest post
            </Link>
          )}
          <Link href="/archive" className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
            Open archive
          </Link>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-outline-variant/15 p-1" style={{ background: '#fdf8ec' }}>
          <button
            type="button"
            className={`rounded-full px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'list'
                ? 'text-on-surface shadow-sm'
                : 'text-on-surface/50 hover:text-on-surface'
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
              viewMode === 'grid'
                ? 'text-on-surface shadow-sm'
                : 'text-on-surface/50 hover:text-on-surface'
            }`}
            style={viewMode === 'grid' ? { background: '#fdf8ec' } : undefined}
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
          >
            Grid
          </button>
        </div>
      </div>

      {viewMode === 'list' ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group sticky-note overflow-hidden p-6 transition-transform duration-300 hover:-translate-y-1"

            >
              <div className="space-y-4">
                <PostIllustration post={post} />
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{primaryTag(post)}</p>
                    <h3 className="font-headline text-2xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h3>
                  </div>
                  <time className="font-label text-[10px] uppercase tracking-widest text-on-surface" suppressHydrationWarning>{shortDateFormatter.format(new Date(post.date))}</time>
                </div>
                {post.summary && (
                  <p className="max-w-3xl font-body text-base leading-relaxed text-on-surface">{post.summary}</p>
                )}
                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 5).map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-primary">
                      {tag}
                    </Link>
                  ))}
                </div>
                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <Link href={`/posts/${post.slug}`} className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
                    Read the post
                  </Link>
                  {post.readingTime && (
                    <span className="inline-flex items-center font-label text-[10px] uppercase tracking-widest text-on-surface">
                      {post.readingTime} min read
                    </span>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link key={post.slug} href={`/posts/${post.slug}`} className="group block h-full no-underline" style={{ color: 'inherit', textDecoration: 'none' }}>
              <article className="sticky-note flex h-full cursor-pointer flex-col overflow-hidden p-4 text-[#1d1c16] transition-transform duration-300 hover:-translate-y-1 md:p-6">
                <PostIllustration post={post} />
                <div className="flex flex-1 flex-col">
                  <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{primaryTag(post)}</p>
                    <time className="font-label text-[10px] uppercase tracking-widest text-on-surface" suppressHydrationWarning>{shortDateFormatter.format(new Date(post.date))}</time>
                  </div>
                  <h3 className="mt-2 font-headline text-xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
                    {post.title}
                  </h3>
                  {post.summary ? (
                    <p className="mt-3 flex-1 line-clamp-3 font-body text-sm leading-relaxed text-on-surface">{post.summary}</p>
                  ) : (
                    <div className="flex-1" />
                  )}
                  <div className="mt-5 flex flex-wrap gap-2">
                    {post.tags.slice(0, 3).map((tag) => (
                      <span key={tag} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface">
                        {tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-5">
                    <span className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface">
                      Read the post
                    </span>
                  </div>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
