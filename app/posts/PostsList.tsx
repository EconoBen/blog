'use client';

import { useState } from 'react';
import Link from 'next/link';
import '../styles/editorial-index.css';

interface Post {
  slug: string;
  title: string;
  date: string | Date;
  summary?: string;
  tags: string[];
  readingTime?: number;
}

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
});

export function PostsList({ posts, latestSlug }: { posts: Post[]; latestSlug?: string }) {
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  return (
    <div className="writing-index">
      <div className="writing-index-toolbar">
        <div className="writing-index-browse">
          <p>{posts.length} posts</p>
          {latestSlug && <Link href={`/posts/${latestSlug}`}>Read the latest</Link>}
          <Link href="/archive">Browse by year</Link>
        </div>
        <div className="writing-index-switch" role="group" aria-label="Post layout">
          <button type="button" aria-pressed={viewMode === 'list'} onClick={() => setViewMode('list')}>List</button>
          <button type="button" aria-pressed={viewMode === 'grid'} onClick={() => setViewMode('grid')}>Grid</button>
        </div>
      </div>
      <div className={`writing-index-posts writing-index-posts--${viewMode}`}>
        {posts.map((post) => (
          <article key={post.slug} className="writing-index-post">
            <div className="writing-index-meta">
              <time dateTime={new Date(post.date).toISOString()}>{shortDateFormatter.format(new Date(post.date))}</time>
              {post.readingTime ? <span>{post.readingTime} min read</span> : null}
              {post.slug === latestSlug && <span className="writing-index-new">Latest</span>}
            </div>
            <div className="writing-index-copy">
              <h2><Link href={`/posts/${post.slug}`}>{post.title}</Link></h2>
              {post.summary && <p className="writing-index-summary">{post.summary}</p>}
              {post.tags.length > 0 && (
                <div className="writing-index-tags" aria-label="Topics">
                  {post.tags.slice(0, 3).map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                  ))}
                </div>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
