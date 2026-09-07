'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { ReadingGrebe } from './ReadingGrebe';
import '../styles/reading-memory.css';

export const READING_MEMORY_KEY = 'econoben:reading-bookmark:v1';
const MEMORY_EVENT = 'econoben:reading-bookmark';
const MAX_AGE = 30 * 24 * 60 * 60 * 1000;
const ARTICLE_ID = 'reading-content';

type ReadingBookmark = { version: 1; slug: string; title: string; position: number; savedAt: number };

export function parseReadingBookmark(raw: string | null, now = Date.now()): ReadingBookmark | null {
  if (!raw || raw.length > 2000) return null;
  try {
    const value = JSON.parse(raw);
    if (!value || value.version !== 1 || typeof value.slug !== 'string' ||
      !/^[a-zA-Z0-9][a-zA-Z0-9_."' -]{0,199}$/.test(value.slug) ||
      typeof value.title !== 'string' || !value.title.trim() || value.title.length > 500 ||
      typeof value.position !== 'number' || !Number.isFinite(value.position) ||
      value.position < 0.08 || value.position >= 0.96 ||
      typeof value.savedAt !== 'number' || !Number.isFinite(value.savedAt) ||
      value.savedAt > now + 60_000 || now - value.savedAt > MAX_AGE) return null;
    return { version: 1, slug: value.slug, title: value.title.trim(), position: value.position, savedAt: value.savedAt };
  } catch { return null; }
}

export function readingPosition(articleTop: number, articleHeight: number, scrollY: number, viewportHeight: number) {
  if (![articleTop, articleHeight, scrollY, viewportHeight].every(Number.isFinite) || articleHeight <= 0) return 0;
  return Math.max(0, Math.min(1, (scrollY + viewportHeight * 0.25 - articleTop) / articleHeight));
}

function readBookmark() {
  try { return parseReadingBookmark(window.localStorage.getItem(READING_MEMORY_KEY)); }
  catch { return null; }
}

function isCurrentArticle(slug: string) {
  try { return decodeURIComponent(window.location.pathname) === `/posts/${slug}`; }
  catch { return false; }
}

function forgetBookmark(slug: string) {
  try {
    if (readBookmark()?.slug === slug) {
      window.localStorage.removeItem(READING_MEMORY_KEY);
      window.dispatchEvent(new Event(MEMORY_EVENT));
    }
  } catch { /* Reading still works when browser storage is unavailable. */ }
}

/** Saves only after deliberate reading; ordinary visits never restore scroll. */
export function ReadingProgress({ slug, title }: { slug: string; title: string }) {
  useEffect(() => {
    const article = document.getElementById(ARTICLE_ID);
    if (!article) return;
    let activeSeconds = 0;
    let disposed = false;
    let interacted = false;
    let completed = false;
    let lastPosition = -1;
    const noteInteraction = () => { interacted = true; };
    const initialBookmark = readBookmark();
    const url = new URL(window.location.href);
    const wantsResume = url.searchParams.get('resume') === 'reading';
    let resumeTimer: ReturnType<typeof setTimeout> | undefined;
    let resumeHandled = false;
    if (wantsResume) {
      const consumeResume = () => {
        url.searchParams.delete('resume');
        window.history.replaceState(window.history.state, '', url.pathname + url.search + url.hash);
      };
      if (initialBookmark?.slug === slug) {
        // Wait briefly for fonts/images, but never move someone who already started interacting.
        const restore = () => {
          if (disposed || resumeHandled || !isCurrentArticle(slug)) return;
          resumeHandled = true;
          clearTimeout(resumeTimer);
          consumeResume();
          if (interacted) return;
          interacted = true;
          const bounds = article.getBoundingClientRect();
          window.scrollTo({ top: Math.max(0, bounds.top + window.scrollY + bounds.height * initialBookmark.position - window.innerHeight * 0.25), behavior: 'instant' });
          article.focus({ preventScroll: true });
        };
        const images = [...article.querySelectorAll('img')].filter(image => !image.complete);
        const ready = Promise.all([document.fonts?.ready, ...images.map(image => new Promise<void>(resolve => {
          image.addEventListener('load', () => resolve(), { once: true });
          image.addEventListener('error', () => resolve(), { once: true });
        }))]);
        resumeTimer = setTimeout(restore, 1200);
        void ready.then(() => { if (!disposed) restore(); });
      } else {
        consumeResume();
      }
    }

    const sample = () => {
      if (disposed || completed || document.visibilityState === 'hidden' || activeSeconds < 12 || !interacted) return;
      // A route transition can reset the viewport before effect cleanup runs.
      if (!isCurrentArticle(slug)) return;
      const bounds = article.getBoundingClientRect();
      const position = readingPosition(bounds.top + window.scrollY, bounds.height, window.scrollY, window.innerHeight);
      if (bounds.bottom <= window.innerHeight && bounds.top < 0) {
        completed = true;
        forgetBookmark(slug);
        return;
      }
      if (position < 0.08 || position >= 0.96 || Math.abs(position - lastPosition) < 0.005) return;
      const bookmark: ReadingBookmark = { version: 1, slug, title, position, savedAt: Date.now() };
      if (!parseReadingBookmark(JSON.stringify(bookmark))) return;
      try {
        window.localStorage.setItem(READING_MEMORY_KEY, JSON.stringify(bookmark));
        lastPosition = position;
        window.dispatchEvent(new Event(MEMORY_EVENT));
      } catch { /* No account, network request, or fallback storage. */ }
    };
    const timer = setInterval(() => {
      if (document.visibilityState !== 'hidden') activeSeconds += 1;
      sample();
    }, 1000);
    window.addEventListener('wheel', noteInteraction, { passive: true });
    window.addEventListener('touchstart', noteInteraction, { passive: true });
    window.addEventListener('keydown', noteInteraction);
    window.addEventListener('pointerdown', noteInteraction);
    window.addEventListener('pagehide', sample);
    return () => {
      // Do not sample on unmount: the destination may already have changed the viewport.
      disposed = true;
      clearInterval(timer);
      clearTimeout(resumeTimer);
      window.removeEventListener('wheel', noteInteraction);
      window.removeEventListener('touchstart', noteInteraction);
      window.removeEventListener('keydown', noteInteraction);
      window.removeEventListener('pointerdown', noteInteraction);
      window.removeEventListener('pagehide', sample);
    };
  }, [slug, title]);
  return null;
}

export function ReturningBookmark() {
  const [bookmark, setBookmark] = useState<ReadingBookmark | null>(null);
  useEffect(() => {
    const refresh = () => setBookmark(readBookmark());
    refresh();
    window.addEventListener('storage', refresh);
    window.addEventListener(MEMORY_EVENT, refresh);
    return () => {
      window.removeEventListener('storage', refresh);
      window.removeEventListener(MEMORY_EVENT, refresh);
    };
  }, []);
  if (!bookmark) return null;
  return (
    <aside className="reading-bookmark" aria-label="Your reading bookmark">
      <span className="reading-bookmark-bird"><ReadingGrebe /></span>
      <div className="reading-bookmark-copy">
        <p className="reading-bookmark-eyebrow">Reading bookmark</p>
        <Link href={`/posts/${encodeURIComponent(bookmark.slug)}?resume=reading`} className="reading-bookmark-link">
          {bookmark.title}<span aria-hidden="true"> ↗</span>
          <span className="reading-bookmark-continue">Continue reading · {Math.round(bookmark.position * 100)}% through</span>
        </Link>
        <p className="reading-bookmark-device">Saved on this device</p>
      </div>
      <button type="button" className="reading-bookmark-dismiss" aria-label="Dismiss reading bookmark" onClick={() => { forgetBookmark(bookmark.slug); setBookmark(null); }}>×</button>
    </aside>
  );
}
