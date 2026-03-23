import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Posts | ECONOBEN.DEV',
  description: 'A chronological archive of essays, reports, and field notes on AI systems, memory, engineering practice, and adjacent work.',
};

type Posts = Awaited<ReturnType<typeof postService.getAllPosts>>;

const shortDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const monthFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
});

const countTags = (posts: Posts) => {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1]);
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

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const latestPost = posts[0];
  const topTags = countTags(posts).slice(0, 4);
  const postsByYear = groupPostsByYear(posts);
  const uniqueTagCount = new Set(posts.flatMap((post) => post.tags)).size;
  const mostRecentMonth = latestPost ? monthFormatter.format(latestPost.date) : 'No posts yet';

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Reading archive</p>
          <h1 className="editorial-page-title">Posts</h1>
          <p className="editorial-page-copy">
            A chronological archive of essays, reports, and field notes. Start with the newest post, then move backward by year when you want more context.
          </p>
          <div className="editorial-chip-row">
            {topTags.map(([tag, count]) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                {tag} <span>({count})</span>
              </Link>
            ))}
          </div>
          <div className="editorial-home-actions">
            <Link href="#archive-years" className="editorial-home-button editorial-home-button-secondary">
              Jump to years
            </Link>
            {latestPost ? (
              <Link href={`/posts/${latestPost.slug}`} className="editorial-home-button editorial-home-button-primary">
                Read latest post
              </Link>
            ) : null}
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Archive details</p>
          <div className="grid gap-3 sm:grid-cols-3">
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
              <span className="block font-headline text-2xl font-bold text-on-surface">{posts.length}</span>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">posts</span>
            </div>
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
              <span className="block font-headline text-2xl font-bold text-on-surface">{uniqueTagCount}</span>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">topics</span>
            </div>
            <div className="rounded-2xl border border-outline-variant/20 bg-surface-container-low p-4">
              <span className="block font-headline text-2xl font-bold text-on-surface">{postsByYear.length}</span>
              <span className="font-label text-[10px] uppercase tracking-[0.2em] text-secondary">years</span>
            </div>
          </div>
          <p className="editorial-post-summary">
            Latest month: {mostRecentMonth}
          </p>
          {latestPost ? (
            <Link href={`/posts/${latestPost.slug}`} className="editorial-home-button editorial-home-button-secondary">
              Read the latest post
            </Link>
          ) : null}
        </aside>
      </section>

      <section className="editorial-list-section" id="archive-years">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Archive by year</p>
          <h2 className="editorial-page-section-title">Browse the archive in compact yearly groups.</h2>
        </div>

        <div className="editorial-two-column">
          {postsByYear.map(({ year, posts: yearPosts }) => (
            <article key={year} className="editorial-home-card">
              <p className="editorial-home-card-label">Year {year}</p>
              <h3>{yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}</h3>
              <p>Newest first, with summaries and topics kept visible so the year stays easy to scan.</p>
              <ul className="posts-list">
                {yearPosts.map((post) => (
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
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
