import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Posts | ECONOBEN.DEV',
  description: 'An editorial browse page for essays, reports, and field notes, with curated year and topic entry points and a link to the full archive.',
};

type Posts = Awaited<ReturnType<typeof postService.getAllPosts>>;
type Post = Posts[number];
type TagStat = {
  tag: string;
  count: number;
  samplePosts: Post[];
};

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const countTags = (posts: Posts) => {
  const counts = new Map<string, TagStat>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const existing = counts.get(tag) ?? {
        tag,
        count: 0,
        samplePosts: [],
      };

      existing.count += 1;

      if (existing.samplePosts.length < 2 && !existing.samplePosts.some((samplePost) => samplePost.slug === post.slug)) {
        existing.samplePosts.push(post);
      }

      counts.set(tag, existing);
    });
  });

  return Array.from(counts.values())
    .sort((a, b) => b.count - a.count);
};

const groupPostsByYear = (posts: Posts) => {
  const groups = new Map<number, Posts>();

  posts.forEach((post) => {
    const year = post.date.getFullYear();
    const yearPosts = groups.get(year) ?? [];
    yearPosts.push(post);
    groups.set(year, yearPosts);
  });

  return Array.from(groups.entries())
    .sort((a, b) => b[0] - a[0])
    .map(([year, yearPosts]) => ({
      year,
      posts: yearPosts,
    }));
};

const buildYearSpan = (yearPosts: Posts) => {
  if (yearPosts.length === 0) {
    return 'No posts';
  }

  if (yearPosts.length === 1) {
    return shortDateFormatter.format(yearPosts[0].date);
  }

  return `${shortDateFormatter.format(yearPosts[yearPosts.length - 1].date)} – ${shortDateFormatter.format(yearPosts[0].date)}`;
};

const imageSourceFor = (post: Post) => post.coverImage || post.image || null;

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const latestPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const tagStats = countTags(posts);
  const topTags = tagStats.slice(0, 4);
  const postsByYear = groupPostsByYear(posts);
  const archiveLink = '/archive';
  const yearEntries = postsByYear.map(({ year, posts: yearPosts }) => {
    const yearTopics = countTags(yearPosts).slice(0, 3);

    return {
      year,
      posts: yearPosts,
      yearTopics,
      archiveHref: `${archiveLink}#year-${year}`,
    };
  });
  const topicClusters = topTags;

  return (
    <EditorialPageFrame currentPath="/posts">
      {/* ── Proposal A: Simplified hero with clean latest-post card ── */}
      <section
        className="editorial-page-hero"
        style={{
          alignItems: 'start',
          gridTemplateColumns: 'minmax(0, 1.08fr) minmax(340px, 0.92fr)',
        }}
      >
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Reading archive</p>
          <h1 className="editorial-page-title">Posts</h1>
          <p className="editorial-page-copy">
            Essays, reports, and field notes on AI systems, developer tooling, and applied economics.
          </p>
          <div className="editorial-chip-row">
            {topTags.map(({ tag, count }) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                {tag} <span>({count})</span>
              </Link>
            ))}
          </div>
          <div className="editorial-home-actions">
            {latestPost ? (
              <Link href={`/posts/${latestPost.slug}`} className="editorial-home-button editorial-home-button-primary">
                Read latest post
              </Link>
            ) : null}
            <Link href={archiveLink} className="editorial-home-button editorial-home-button-secondary">
              Open archive
            </Link>
          </div>
        </div>

        {latestPost ? (
          <article className="editorial-post-card" style={{ display: 'grid', gap: '0.85rem' }}>
            {imageSourceFor(latestPost) ? (
              <img
                src={imageSourceFor(latestPost)!}
                alt=""
                style={{ borderRadius: '14px', width: '100%', height: 'auto', display: 'block' }}
              />
            ) : null}
            <p className="editorial-home-card-label">Latest post</p>
            <h2
              style={{
                fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                fontSize: 'clamp(1.55rem, 2.2vw, 2rem)',
                fontWeight: 700,
                letterSpacing: '-0.035em',
                lineHeight: 1.08,
                margin: 0,
                color: 'var(--editorial-ink)',
              }}
            >
              <Link href={`/posts/${latestPost.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                {latestPost.title}
              </Link>
            </h2>
            {latestPost.summary ? (
              <p className="editorial-post-summary" style={{ margin: 0 }}>
                {latestPost.summary}
              </p>
            ) : null}
            <div className="editorial-post-meta">
              <span>{shortDateFormatter.format(latestPost.date)}</span>
              <span>{latestPost.readingTime ? `${latestPost.readingTime} min read` : 'Long-form'}</span>
            </div>
            <div className="editorial-chip-row" style={{ marginTop: 0 }}>
              {latestPost.tags.slice(0, 3).map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                  {tag}
                </Link>
              ))}
            </div>
            <Link href={`/posts/${latestPost.slug}`} className="editorial-home-card-link" style={{ marginTop: '0.15rem' }}>
              Read this post
            </Link>
          </article>
        ) : null}
      </section>

      {/* ── Proposal B: Recent writing + Archive routes as their own row ── */}
      <section className="editorial-list-section" style={{ paddingTop: '0.5rem' }}>
        <div className="posts-browse-grid" style={{ alignItems: 'start' }}>
          <article className="editorial-post-card" style={{ display: 'grid', gap: '0.7rem' }}>
            <p className="editorial-home-card-label">Recent writing</p>
            <div style={{ display: 'grid', gap: '0.75rem' }}>
              {recentPosts.map((post) => (
                <Link
                  key={post.slug}
                  href={`/posts/${post.slug}`}
                  style={{
                    display: 'grid',
                    gap: '0.18rem',
                    paddingBottom: '0.75rem',
                    borderBottom: '1px solid rgba(16, 34, 54, 0.08)',
                    textDecoration: 'none',
                  }}
                >
                  <time
                    style={{
                      color: 'var(--editorial-slate)',
                      fontFamily: "'IBM Plex Mono', monospace",
                      fontSize: '0.72rem',
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
                    {shortDateFormatter.format(post.date)}
                  </time>
                  <span
                    style={{
                      color: 'var(--editorial-ink)',
                      fontFamily: "'Inter', var(--font-body)",
                      fontSize: '1rem',
                      fontWeight: 600,
                      lineHeight: 1.35,
                    }}
                  >
                    {post.title}
                  </span>
                </Link>
              ))}
            </div>
          </article>

          <article className="editorial-post-card" style={{ display: 'grid', gap: '0.75rem' }}>
            <p className="editorial-home-card-label">Archive routes</p>
            <p className="editorial-post-summary" style={{ margin: 0 }}>
              {posts.length} posts across {postsByYear.length} years and {tagStats.length} recurring topics.
            </p>
            <div className="editorial-chip-row" style={{ marginTop: 0 }}>
              {topTags.slice(0, 3).map(({ tag, count }) => (
                <Link key={`${tag}-chip`} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                  {tag} <span>({count})</span>
                </Link>
              ))}
            </div>
            <div className="editorial-link-row" style={{ marginTop: 0 }}>
              <Link href={archiveLink} className="editorial-home-card-link">
                Open the full archive
              </Link>
              <Link href="/tags" className="editorial-home-card-link">
                Browse by topic
              </Link>
            </div>
          </article>
        </div>
      </section>

      {/* ── Proposal C: Year cards with lead post getting summary + bigger title ── */}
      <section className="editorial-list-section" id="posts-by-year">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Archive by year</p>
          <h2 className="editorial-page-section-title">Selected posts by year.</h2>
        </div>

        <div style={{ display: 'grid', gap: '1.25rem' }}>
          {yearEntries.map(({ year, posts: yearPosts, yearTopics, archiveHref }) => {
            const leadPost = yearPosts[0];
            const remainingPosts = yearPosts.slice(1, 4);
            const overflowCount = yearPosts.length - 1 - remainingPosts.length;

            return (
              <article
                key={year}
                className="editorial-post-card"
                style={{ display: 'grid', gap: '1rem' }}
              >
                <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <p className="editorial-home-card-label" style={{ marginBottom: '0.15rem' }}>{year}</p>
                    <p className="editorial-post-summary" style={{ margin: 0 }}>
                      {yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''} &middot; {buildYearSpan(yearPosts)}
                    </p>
                  </div>
                  {yearTopics.length > 0 && (
                    <div className="editorial-chip-row" style={{ marginTop: 0 }}>
                      {yearTopics.map(({ tag }) => (
                        <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                          {tag}
                        </Link>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lead post: bigger title + summary */}
                {leadPost && (
                  <Link
                    href={`/posts/${leadPost.slug}`}
                    style={{
                      display: 'grid',
                      gap: '0.35rem',
                      padding: '0.75rem 0',
                      borderTop: '1px solid rgba(16, 34, 54, 0.08)',
                      borderBottom: '1px solid rgba(16, 34, 54, 0.08)',
                      textDecoration: 'none',
                    }}
                  >
                    <div className="editorial-post-meta" style={{ marginBottom: '0.1rem' }}>
                      <span>{shortDateFormatter.format(leadPost.date)}</span>
                    </div>
                    <span
                      style={{
                        color: 'var(--editorial-ink)',
                        fontFamily: "'Space Grotesk', 'Inter', sans-serif",
                        fontSize: '1.35rem',
                        fontWeight: 700,
                        letterSpacing: '-0.03em',
                        lineHeight: 1.12,
                      }}
                    >
                      {leadPost.title}
                    </span>
                    {leadPost.summary && (
                      <p className="editorial-post-summary" style={{ margin: 0 }}>
                        {leadPost.summary}
                      </p>
                    )}
                  </Link>
                )}

                {/* Remaining posts: compact date + title rows */}
                {remainingPosts.length > 0 && (
                  <div style={{ display: 'grid', gap: 0 }}>
                    {remainingPosts.map((post) => (
                      <Link
                        key={post.slug}
                        href={`/posts/${post.slug}`}
                        className="posts-year-row"
                        style={{
                          padding: '0.6rem 0',
                          borderBottom: '1px solid rgba(16, 34, 54, 0.08)',
                          textDecoration: 'none',
                        }}
                      >
                        <time
                          style={{
                            color: 'var(--editorial-slate)',
                            fontFamily: "'IBM Plex Mono', monospace",
                            fontSize: '0.72rem',
                            letterSpacing: '0.04em',
                            textTransform: 'uppercase',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {shortDateFormatter.format(post.date)}
                        </time>
                        <span
                          style={{
                            color: 'var(--editorial-ink)',
                            fontFamily: "'Inter', var(--font-body)",
                            fontSize: '0.97rem',
                            fontWeight: 600,
                            lineHeight: 1.35,
                          }}
                        >
                          {post.title}
                        </span>
                      </Link>
                    ))}
                  </div>
                )}

                {overflowCount > 0 && (
                  <Link href={archiveHref} className="editorial-home-card-link" style={{ marginTop: 0 }}>
                    {overflowCount} more in the archive
                  </Link>
                )}
              </article>
            );
          })}
        </div>
      </section>

      {/* ── Proposal D: Topic cards with real content instead of filler ── */}
      <section className="editorial-list-section" id="topics">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Recurring topics</p>
          <h2 className="editorial-page-section-title">Themes across years and formats.</h2>
        </div>

        <div className="editorial-post-grid">
          {topicClusters.map(({ tag, count, samplePosts }) => (
            <article key={tag} className="editorial-post-card" style={{ display: 'grid', gap: '0.75rem' }}>
              <p className="editorial-home-card-label">{count} post{count === 1 ? '' : 's'}</p>
              <h3 style={{ margin: 0 }}>
                <Link href={`/tags/${encodeURIComponent(tag)}`} style={{ textDecoration: 'none', color: 'inherit' }}>{tag}</Link>
              </h3>
              {samplePosts[0]?.summary ? (
                <p className="editorial-post-summary" style={{ margin: 0 }}>{samplePosts[0].summary}</p>
              ) : (
                <p className="editorial-post-summary" style={{ margin: 0 }}>{count} posts tagged {tag}.</p>
              )}
              <div style={{ display: 'grid', gap: '0.5rem' }}>
                {samplePosts.map((post) => (
                  <Link
                    key={post.slug}
                    href={`/posts/${post.slug}`}
                    style={{
                      display: 'grid',
                      gap: '0.15rem',
                      paddingBottom: '0.5rem',
                      borderBottom: '1px solid rgba(16, 34, 54, 0.06)',
                      textDecoration: 'none',
                    }}
                  >
                    <time
                      style={{
                        color: 'var(--editorial-slate)',
                        fontFamily: "'IBM Plex Mono', monospace",
                        fontSize: '0.68rem',
                        letterSpacing: '0.04em',
                        textTransform: 'uppercase',
                      }}
                    >
                      {shortDateFormatter.format(post.date)}
                    </time>
                    <span
                      style={{
                        color: 'var(--editorial-ink)',
                        fontFamily: "'Inter', var(--font-body)",
                        fontSize: '0.95rem',
                        fontWeight: 600,
                        lineHeight: 1.3,
                      }}
                    >
                      {post.title}
                    </span>
                  </Link>
                ))}
              </div>
              <Link href={`/tags/${encodeURIComponent(tag)}`} className="editorial-post-link" style={{ marginTop: '0.25rem' }}>
                View all {tag} posts
              </Link>
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
