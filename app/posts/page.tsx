import { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Posts | Ben Labaschin',
  description: 'Essays, field notes, and technical writing on AI systems, memory, engineering practice, and adjacent work.',
};

type Posts = Awaited<ReturnType<typeof postService.getAllPosts>>;

const formatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'short',
  day: 'numeric',
});

const countTags = (posts: Posts) => {
  const counts = new Map<string, number>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      counts.set(tag, (counts.get(tag) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort((a, b) => b[1] - a[1])
    .slice(0, 4);
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
  const featuredPost = posts[0];
  const topTags = countTags(posts);
  const postsByYear = groupPostsByYear(posts);
  const publicationYears = postsByYear.length;

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Writing archive</p>
          <h1 className="editorial-page-title">Posts</h1>
          <p className="editorial-page-copy">
            Essays, field notes, and working-throughs on agent memory, AI systems, engineering practice, and the occasional economics detour, arranged so the newest work stays easy to find.
          </p>
          <div className="editorial-chip-row">
            {topTags.map(([tag, count]) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                {tag} <span>({count})</span>
              </Link>
            ))}
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">At a glance</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">posts in the archive</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{publicationYears}</span>
              <span className="editorial-page-metric-label">years represented</span>
            </div>
          </div>
          {featuredPost && (
            <p className="editorial-post-summary">
              Latest: {featuredPost.title} on {formatter.format(featuredPost.date)}.
            </p>
          )}
          {featuredPost && (
            <Link href={`/posts/${featuredPost.slug}`} className="editorial-home-button editorial-home-button-secondary">
              Start with the latest essay
            </Link>
          )}
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Featured reading</p>
          <h2 className="editorial-page-section-title">Start with the latest essay, then move backward by year.</h2>
        </div>
        {featuredPost ? (
          <article className="editorial-home-card">
            <p className="editorial-home-card-label">{formatter.format(featuredPost.date)}</p>
            <h3>
              <Link href={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
            </h3>
            {featuredPost.summary && <p>{featuredPost.summary}</p>}
            <div className="editorial-post-meta">
              {featuredPost.tags[0] ? (
                <Link href={`/tags/${encodeURIComponent(featuredPost.tags[0])}`} className="editorial-chip">
                  <span>{featuredPost.tags[0]}</span>
                </Link>
              ) : (
                <span className="editorial-chip">Essay</span>
              )}
              <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : 'Long-form note'}</span>
            </div>
            <div className="editorial-chip-row">
              {featuredPost.tags.slice(0, 3).map((tag) => (
                <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                  {tag}
                </Link>
              ))}
            </div>
            <Link href={`/posts/${featuredPost.slug}`} className="editorial-home-card-link">
              Read the post
            </Link>
          </article>
        ) : null}
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">By year</p>
          <h2 className="editorial-page-section-title">A compact index that keeps each year readable on mobile.</h2>
        </div>

        <div className="editorial-two-column">
          {postsByYear.map(({ year, posts: yearPosts }) => (
            <article key={year} className="editorial-home-card">
              <p className="editorial-home-card-label">Year {year}</p>
              <h3>{yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}</h3>
              <p>Newest first, with each post left visible so the archive can be scanned without opening every page.</p>
              {yearPosts[0] ? (
                <div>
                  <p className="editorial-home-card-label">Featured post</p>
                  <Link href={`/posts/${yearPosts[0].slug}`} className="editorial-home-card-link">
                    {yearPosts[0].title}
                  </Link>
                  {yearPosts[0].summary && <p className="editorial-post-summary">{yearPosts[0].summary}</p>}
                </div>
              ) : null}
              <ul className="posts-list">
                {yearPosts.slice(1).map((post) => (
                  <li key={post.slug} className="archive-post">
                    <Link href={`/posts/${post.slug}`}>
                      <time className="archive-post-date">
                        {post.date.getDate().toString().padStart(2, '0')}
                      </time>
                      <span className="archive-post-title">{post.title}</span>
                    </Link>
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
