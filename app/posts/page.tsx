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

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const latestPost = posts[0];
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

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Reading archive</p>
          <h1 className="editorial-page-title">Posts</h1>
          <p className="editorial-page-copy">
            A browsable index of essays, reports, and field notes. Start with the newest post, then use the year and topic routes when you want to branch out. /archive keeps the month-by-month ledger separate.
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
      </section>

      <section className="editorial-list-section">
        <p className="editorial-home-section-label">Start here</p>
        {latestPost ? (
          <article className="editorial-home-card editorial-home-card-featured">
            <p className="editorial-home-card-label">Latest post</p>
            <h3>
              <Link href={`/posts/${latestPost.slug}`}>{latestPost.title}</Link>
            </h3>
            {latestPost.summary ? <p>{latestPost.summary}</p> : null}
            <div className="editorial-post-meta">
              <span>{shortDateFormatter.format(latestPost.date)}</span>
              <span>{latestPost.readingTime ? `${latestPost.readingTime} min read` : 'Long-form post'}</span>
              <span>{latestPost.tags.length} topic{latestPost.tags.length === 1 ? '' : 's'}</span>
            </div>
            <div className="editorial-chip-row">
              {latestPost.tags.slice(0, 4).map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                  {tag}
                </Link>
              ))}
            </div>
            <div className="editorial-link-row">
              <Link href={`/posts/${latestPost.slug}`} className="editorial-home-card-link">
                Open the latest post
              </Link>
              <Link href={archiveLink} className="editorial-home-card-link">
                Open the archive
              </Link>
            </div>
          </article>
        ) : null}
      </section>

      <section className="editorial-list-section" id="posts-by-year">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Archive by year</p>
          <h2 className="editorial-page-section-title">Browse selected posts by year, with the full archive one click away.</h2>
        </div>

        <div className="editorial-two-column">
          {yearEntries.map(({ year, posts: yearPosts, featuredPosts, remainingPosts, yearTopics, summary, archiveHref }) => (
            <article key={year} className="editorial-home-card">
              <p className="editorial-home-card-label">Year {year}</p>
              <h3>{yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}</h3>
              <p>{summary}</p>
              <div className="editorial-post-meta">
                <span>{yearPosts.length > 0 ? `Latest ${shortDateFormatter.format(yearPosts[0].date)}` : 'No posts'}</span>
                <span>{yearPosts.length > 0 ? `Earliest ${shortDateFormatter.format(yearPosts[yearPosts.length - 1].date)}` : ''}</span>
              </div>
              <div className="editorial-chip-row">
                {yearTopics.map(({ tag, count }) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                    {tag} <span>({count})</span>
                  </Link>
                ))}
              </div>
              <ul className="posts-list">
                {featuredPosts.map((post) => (
                  <li key={post.slug} className="archive-post">
                    <Link href={`/posts/${post.slug}`}>
                      <time className="archive-post-date">
                        {shortDateFormatter.format(post.date)}
                      </time>
                      <span className="archive-post-title">{post.title}</span>
                    </Link>
                    {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
                    <div className="editorial-chip-row">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                          {tag}
                        </Link>
                      ))}
                    </div>
                  </li>
                ))}
              </ul>
              {remainingPosts > 0 ? (
                <Link href={archiveHref} className="editorial-home-card-link">
                  Open the full archive for {year} ({remainingPosts} more post{remainingPosts === 1 ? '' : 's'})
                </Link>
              ) : (
                <Link href={archiveHref} className="editorial-home-card-link">
                  Open the full archive view
                </Link>
              )}
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-list-section" id="topics">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Recurring topics</p>
          <h2 className="editorial-page-section-title">Follow the themes that repeat across years and formats.</h2>
        </div>

        <div className="editorial-post-grid">
          {topicClusters.map(({ tag, count, samplePosts }) => (
            <article key={tag} className="editorial-post-card">
              <p className="editorial-home-card-label">{count} post{count === 1 ? '' : 's'}</p>
              <h3>
                <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
              </h3>
              <p>
                The tag appears repeatedly across the archive. Start with these representative posts, then expand to the full topic page.
              </p>
              <div className="editorial-link-row">
                {samplePosts.map((post) => (
                  <Link key={post.slug} href={`/posts/${post.slug}`} className="editorial-post-link">
                    {post.title}
                  </Link>
                ))}
              </div>
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
