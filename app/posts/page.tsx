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

const buildYearSummary = (yearPosts: Posts, yearTopics: TagStat[]) => {
  if (yearPosts.length === 0) {
    return 'No posts were published in this year.';
  }

  const topTopics = yearTopics.slice(0, 2).map((topic) => topic.tag);

  if (yearPosts.length === 1) {
    const topicLabel = topTopics[0] ? `around ${topTopics[0]}` : 'as a standalone entry';
    return `A single post, ${topicLabel}, anchored by the latest editorial route.`;
  }

  if (topTopics.length === 0) {
    return `${yearPosts.length} posts arranged in chronological order, with summaries and tags kept visible for fast scanning.`;
  }

  if (topTopics.length === 1) {
    return `${yearPosts.length} posts centered on ${topTopics[0]}, with the full archive available by month in /archive.`;
  }

  return `${yearPosts.length} posts threaded through ${topTopics[0]} and ${topTopics[1]}, with the full archive available by month in /archive.`;
};

const buildYearSpan = (yearPosts: Posts) => {
  if (yearPosts.length === 0) {
    return 'No posts';
  }

  if (yearPosts.length === 1) {
    return shortDateFormatter.format(yearPosts[0].date);
  }

  return `${shortDateFormatter.format(yearPosts[yearPosts.length - 1].date)} to ${shortDateFormatter.format(yearPosts[0].date)}`;
};

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const latestPost = posts[0];
  const recentPosts = posts.slice(1, 4);
  const tagStats = countTags(posts);
  const topTags = tagStats.slice(0, 4);
  const postsByYear = groupPostsByYear(posts);
  const archiveLink = '/archive';
  const yearEntries = postsByYear.map(({ year, posts: yearPosts }) => {
    const yearTopics = countTags(yearPosts).slice(0, 2);
    const featuredPosts = yearPosts.slice(0, 3);
    const remainingPosts = yearPosts.length - featuredPosts.length;

    return {
      year,
      posts: yearPosts,
      featuredPosts,
      remainingPosts,
      yearTopics,
      summary: buildYearSummary(yearPosts, yearTopics),
      archiveHref: `${archiveLink}#year-${year}`,
    };
  });
  const topicClusters = topTags;
  const leadYearEntry = yearEntries[0];
  const remainingYearEntries = yearEntries.slice(1);

  return (
    <EditorialPageFrame currentPath="/posts">
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
            A browsable index of essays, reports, and field notes. Start with the latest writing, then move through years and recurring topics when you want a narrower route in.
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
          <article className="editorial-home-card editorial-home-card-featured" style={{ display: 'grid', gap: '1rem', alignContent: 'start' }}>
            <div className="editorial-two-column" style={{ alignItems: 'start', gap: '1rem', gridTemplateColumns: 'minmax(0, 1.15fr) minmax(260px, 0.85fr)' }}>
              <div style={{ display: 'grid', gap: '0.95rem' }}>
                <div className="editorial-list-heading" style={{ marginBottom: 0 }}>
                  <div>
                    <p className="editorial-home-card-label">Latest post</p>
                    <h3
                      style={{
                        marginBottom: '0.35rem',
                        maxWidth: '14ch',
                        fontSize: 'clamp(1.9rem, 2.7vw, 2.35rem)',
                        lineHeight: 0.98,
                      }}
                    >
                      <Link href={`/posts/${latestPost.slug}`}>{latestPost.title}</Link>
                    </h3>
                  </div>
                  <span className="editorial-post-summary" style={{ margin: 0, maxWidth: '24ch' }}>
                    Start with the newest writing, then branch into years or topics from the same opening block.
                  </span>
                </div>
                {latestPost.summary ? <p>{latestPost.summary}</p> : null}
                <div className="editorial-post-meta">
                  <span>{shortDateFormatter.format(latestPost.date)}</span>
                  <span>{latestPost.readingTime ? `${latestPost.readingTime} min read` : 'Long-form post'}</span>
                  <span>{latestPost.tags.length} topic{latestPost.tags.length === 1 ? '' : 's'}</span>
                </div>
                <div className="editorial-chip-row" style={{ marginTop: 0 }}>
                  {latestPost.tags.slice(0, 3).map((tag) => (
                    <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                      {tag}
                    </Link>
                  ))}
                </div>
                <div className="editorial-link-row" style={{ marginTop: '0.25rem' }}>
                  <Link href={`/posts/${latestPost.slug}`} className="editorial-home-card-link">
                    Open the latest post
                  </Link>
                  <Link href={archiveLink} className="editorial-home-card-link">
                    Open the archive
                  </Link>
                </div>
              </div>

              <div style={{ display: 'grid', gap: '0.9rem' }}>
                <article className="editorial-post-card" style={{ display: 'grid', gap: '0.7rem', padding: '1rem', margin: 0 }}>
                  <div className="editorial-list-heading" style={{ marginBottom: 0 }}>
                    <div>
                      <p className="editorial-home-card-label">Recent writing</p>
                      <h4 style={{ margin: 0, fontSize: '1.08rem', lineHeight: 1.08, maxWidth: '15ch' }}>
                        Move through the newest essays and notes.
                      </h4>
                    </div>
                  </div>
                  <ul className="posts-list" style={{ gap: '0.6rem' }}>
                    {recentPosts.map((post) => (
                      <li key={post.slug} className="archive-post">
                        <Link href={`/posts/${post.slug}`}>
                          <time className="archive-post-date">{shortDateFormatter.format(post.date)}</time>
                          <span className="archive-post-title">{post.title}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </article>

                <article className="editorial-post-card" style={{ display: 'grid', gap: '0.7rem', padding: '1rem', margin: 0 }}>
                  <p className="editorial-home-card-label">Topic routes</p>
                  <h4 style={{ margin: 0, fontSize: '1.08rem', lineHeight: 1.08, maxWidth: '15ch' }}>
                    Follow the threads that repeat across years.
                  </h4>
                  <div className="editorial-chip-row" style={{ marginTop: 0 }}>
                    {topTags.slice(0, 3).map(({ tag, count }) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                        {tag} <span>({count})</span>
                      </Link>
                    ))}
                  </div>
                  <div style={{ display: 'grid', gap: '0.45rem' }}>
                    {topTags.slice(0, 2).filter(({ samplePosts }) => samplePosts.length > 0).map(({ tag, samplePosts }) => (
                      <Link key={tag} href={`/posts/${samplePosts[0].slug}`} className="editorial-post-link" style={{ marginTop: 0 }}>
                        {samplePosts[0].title}
                      </Link>
                    ))}
                  </div>
                </article>
              </div>
            </div>
          </article>
        ) : null}
      </section>

      <section className="editorial-list-section" id="posts-by-year">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Archive by year</p>
          <h2 className="editorial-page-section-title">Browse selected posts by year, with the full archive one click away.</h2>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {leadYearEntry ? (
            <article className="editorial-home-card editorial-home-card-featured" style={{ display: 'grid', gap: '1rem' }}>
              <div className="editorial-list-heading" style={{ marginBottom: 0 }}>
                <div>
                  <p className="editorial-home-card-label">Year {leadYearEntry.year}</p>
                  <h3 style={{ marginBottom: '0.35rem' }}>
                    {leadYearEntry.posts.length} post{leadYearEntry.posts.length !== 1 ? 's' : ''}
                  </h3>
                </div>
                <span className="editorial-post-summary" style={{ margin: 0, maxWidth: '28ch' }}>
                  Start with the most recent year, then move into the archive ledger below.
                </span>
              </div>

              <div className="editorial-two-column" style={{ gap: '1rem', gridTemplateColumns: 'minmax(220px, 0.78fr) minmax(0, 1.22fr)' }}>
                <div style={{ display: 'grid', gap: '0.9rem', alignContent: 'start' }}>
                  <p>{leadYearEntry.summary}</p>
                  <div className="editorial-post-meta">
                    <span>{buildYearSpan(leadYearEntry.posts)}</span>
                    <span>{leadYearEntry.posts.length} post{leadYearEntry.posts.length === 1 ? '' : 's'} in the year ledger</span>
                  </div>
                  <div className="editorial-chip-row">
                    {leadYearEntry.yearTopics.map(({ tag, count }) => (
                      <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                        {tag} <span>({count})</span>
                      </Link>
                    ))}
                  </div>
                  <Link href={leadYearEntry.archiveHref} className="editorial-home-card-link">
                    Open the full archive for {leadYearEntry.year} ({leadYearEntry.remainingPosts} more post{leadYearEntry.remainingPosts === 1 ? '' : 's'})
                  </Link>
                </div>

                <ul className="posts-list">
                  {leadYearEntry.featuredPosts.map((post) => (
                    <li key={post.slug} className="archive-post">
                      <Link href={`/posts/${post.slug}`}>
                        <time className="archive-post-date">
                          {shortDateFormatter.format(post.date)}
                        </time>
                        <span className="archive-post-title">{post.title}</span>
                      </Link>
                      {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ) : null}

          {remainingYearEntries.length > 0 ? (
            <div style={{ display: 'grid', gap: '1rem' }}>
              {remainingYearEntries.map(({ year, posts: yearPosts, yearTopics, summary, archiveHref, remainingPosts }) => {
                return (
                  <article
                    key={year}
                    className="editorial-home-card"
                    style={{ display: 'grid', gap: '1rem', padding: '1.05rem 1.15rem' }}
                  >
                    <div
                      className="editorial-two-column"
                      style={{
                        alignItems: 'start',
                        gap: '1rem',
                        gridTemplateColumns: 'minmax(180px, 220px) minmax(0, 1fr)',
                      }}
                    >
                      <div style={{ display: 'grid', gap: '0.85rem', alignContent: 'start' }}>
                        <div>
                          <p className="editorial-home-card-label">Year {year}</p>
                          <h3 style={{ marginBottom: '0.35rem', fontSize: '1.7rem', maxWidth: 'none' }}>
                            {yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}
                          </h3>
                          <p className="editorial-post-summary" style={{ margin: 0 }}>
                            {buildYearSpan(yearPosts)}
                          </p>
                        </div>

                        <p>{summary}</p>
                        <div className="editorial-chip-row" style={{ marginTop: 0 }}>
                          {yearTopics.map(({ tag, count }) => (
                            <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                              {tag} <span>({count})</span>
                            </Link>
                          ))}
                        </div>
                        <div className="editorial-link-row" style={{ marginTop: 0 }}>
                          <Link href={archiveHref} className="editorial-home-card-link">
                            Open the full archive for {year}
                          </Link>
                          {remainingPosts > 0 ? (
                            <span className="editorial-post-summary" style={{ margin: 0 }}>
                              {remainingPosts} more post{remainingPosts === 1 ? '' : 's'} in the archive
                            </span>
                          ) : null}
                        </div>
                      </div>

                      <ul className="posts-list">
                        {yearPosts.slice(0, 3).map((post) => (
                          <li key={post.slug} className="archive-post">
                            <Link href={`/posts/${post.slug}`}>
                              <time className="archive-post-date">{shortDateFormatter.format(post.date)}</time>
                              <span className="archive-post-title">{post.title}</span>
                            </Link>
                            {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </article>
                );
              })}
            </div>
          ) : null}
        </div>
      </section>

      <section className="editorial-list-section" id="topics">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Recurring topics</p>
          <h2 className="editorial-page-section-title">Follow the themes that repeat across years and formats.</h2>
        </div>

        <div className="editorial-post-grid">
          {topicClusters.map(({ tag, count, samplePosts }) => (
            <article key={tag} className="editorial-post-card" style={{ display: 'grid', gap: '0.9rem' }}>
              <p className="editorial-home-card-label">{count} post{count === 1 ? '' : 's'}</p>
              <h3>
                <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
              </h3>
              <p>The tag appears repeatedly across the archive. Start with representative posts and then open the full topic page.</p>
              <ul className="posts-list">
                {samplePosts.map((post) => (
                  <li key={post.slug} className="archive-post">
                    <Link href={`/posts/${post.slug}`}>
                      <time className="archive-post-date">{shortDateFormatter.format(post.date)}</time>
                      <span className="archive-post-title">{post.title}</span>
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href={`/tags/${encodeURIComponent(tag)}`} className="editorial-post-link">
                View all {tag} posts
              </Link>
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
