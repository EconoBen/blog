'use client';

import { useState } from 'react';
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

export function PostsList({ posts }: { posts: Post[] }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('grid');

  return (
    <div>
      {/* Header with toggle */}
      <div className="mb-10 flex flex-wrap items-center justify-between gap-4">
        <div className="flex flex-wrap items-center gap-4">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">All posts</p>
          <p className="font-label text-[10px] uppercase tracking-widest text-on-surface">{posts.length} posts</p>
        </div>

        <div className="flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-container-lowest/80 p-1">
          <button
            type="button"
            className={`rounded-full px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'list'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface/50 hover:text-on-surface'
            }`}
            onClick={() => setViewMode('list')}
            aria-pressed={viewMode === 'list'}
          >
            List
          </button>
          <button
            type="button"
            className={`rounded-full px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
              viewMode === 'grid'
                ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                : 'text-on-surface/50 hover:text-on-surface'
            }`}
            onClick={() => setViewMode('grid')}
            aria-pressed={viewMode === 'grid'}
          >
            Grid
          </button>
        </div>
      </div>

      {/* List view */}
      {viewMode === 'list' ? (
        <div className="space-y-6">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1 lg:grid lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]"
            >
              <div className="min-h-[180px] bg-surface-container-low lg:min-h-full">
                {(post.coverImage || post.image) ? (
                  <img
                    src={(post.coverImage || post.image)!}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[180px] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(220,229,255,0.5),_transparent_36%),linear-gradient(135deg,_#fef9ef,_#ede8de)] p-8">
                    <div className="max-w-xs space-y-2 text-center">
                      <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface">{primaryTag(post)}</p>
                      <p className="font-headline text-xl font-bold text-on-surface">{post.title}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-5 p-8">
                <div className="flex flex-wrap items-start justify-between gap-4">
                  <div className="space-y-2">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{primaryTag(post)}</p>
                    <h3 className="font-headline text-2xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
                      <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                    </h3>
                  </div>
                  <time className="font-label text-[10px] uppercase tracking-widest text-on-surface">{shortDateFormatter.format(new Date(post.date))}</time>
                </div>

                {post.summary && (
                  <p className="font-body text-lg leading-relaxed text-on-surface">{post.summary}</p>
                )}

                <div className="flex flex-wrap gap-2">
                  {post.tags.slice(0, 5).map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface">
                      {tag}
                    </Link>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 pt-1">
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
        /* Grid view */
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <article
              key={post.slug}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1"
            >
              <div className="min-h-[160px] bg-surface-container-low">
                {(post.coverImage || post.image) ? (
                  <img
                    src={(post.coverImage || post.image)!}
                    alt={post.title}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full min-h-[160px] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(220,229,255,0.5),_transparent_36%),linear-gradient(135deg,_#fef9ef,_#ede8de)] p-6">
                    <div className="max-w-xs space-y-1 text-center">
                      <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-on-surface">{primaryTag(post)}</p>
                      <p className="font-headline text-lg font-bold text-on-surface">{post.title}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex flex-1 flex-col space-y-4 p-6">
                <div className="space-y-2">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{primaryTag(post)}</p>
                    <time className="font-label text-[10px] uppercase tracking-widest text-on-surface">{shortDateFormatter.format(new Date(post.date))}</time>
                  </div>
                  <h3 className="font-headline text-xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
                    <Link href={`/posts/${post.slug}`}>{post.title}</Link>
                  </h3>
                </div>

                {post.summary && (
                  <p className="line-clamp-3 font-body text-sm leading-relaxed text-on-surface">{post.summary}</p>
                )}

                <div className="mt-auto flex flex-wrap gap-2 pt-2">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface">
                      {tag}
                    </Link>
                  ))}
                </div>

                <Link href={`/posts/${post.slug}`} className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
                  Read the post
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
