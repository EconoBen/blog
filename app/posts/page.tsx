import { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Posts | Ben Labaschin',
  description: 'Posts, field notes, and technical writing on AI systems, memory, engineering practice, and adjacent work.',
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

function PostRow({ post }: { post: Posts[number] }) {
  return (
    <article className="editorial-post-row">
      <div className="editorial-post-row-header">
        <div className="editorial-post-row-title">
          <p className="editorial-home-card-label">{formatter.format(post.date)}</p>
          <h3 style={{ margin: 0 }}>
            <Link href={`/posts/${post.slug}`}>{post.title}</Link>
          </h3>
        </div>
        <span className="editorial-post-summary" style={{ whiteSpace: 'nowrap' }}>
          {post.readingTime ? `${post.readingTime} min read` : 'Post'}
        </span>
      </div>
      {post.summary && <p className="editorial-post-summary">{post.summary}</p>}

      <div className="editorial-post-row-meta">
        <span>{post.date.getFullYear()}</span>
        <span>{post.tags.length} tag{post.tags.length === 1 ? '' : 's'}</span>
        <Link href={`/archives/${post.date.toISOString().slice(0, 7)}`}>Archive month</Link>
      </div>

      <div className="editorial-chip-row">
        {post.tags.slice(0, 4).map((tag) => (
          <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
            {tag}
          </Link>
        ))}
      </div>
    </article>
  );
}

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const topTags = countTags(posts);
  const featuredPost = posts[0];
  const postsByYear = groupPostsByYear(posts.slice(1));

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Posts</p>
          <h1 className="editorial-page-title">Posts</h1>
          <p className="editorial-page-copy">
            A chronological index of posts on AI systems, memory, engineering practice, and adjacent work. The newest writing stays easy to scan, but the older posts remain one click away.
          </p>
          <div className="editorial-breadcrumb" aria-label="Posts navigation">
            <span>Posts</span>
            <span>/</span>
            <Link href="/archive">Archive</Link>
            <span>/</span>
            <Link href="/tags">Topics</Link>
          </div>
          <div className="editorial-chip-row">
            <Link href="/posts" className="editorial-chip">
              Latest first
            </Link>
            <Link href="/search" className="editorial-chip">
              Search
            </Link>
            <Link href="/archive" className="editorial-chip">
              Archive
            </Link>
            {topTags.map(([tag, count]) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                {tag} <span>({count})</span>
              </Link>
            ))}
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">At a glance</p>
          <div className="editorial-page-metric-list" style={{ marginTop: '12px' }}>
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">Posts in the archive</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{postsByYear.length}</span>
              <span className="editorial-page-metric-label">Visible years after the featured row</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{topTags[0]?.[0] ?? 'Posts'}</span>
              <span className="editorial-page-metric-label">Most common topic</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Filter bar</p>
          <h2 className="editorial-page-section-title">Jump by year or topic without losing the chronology.</h2>
        </div>
        <div className="editorial-filter-bar">
          <Link href="/posts" className="editorial-filter-chip is-active">
            Featured
          </Link>
          {postsByYear.map(({ year }) => (
            <a key={year} href={`#year-${year}`} className="editorial-filter-chip">
              {year}
            </a>
          ))}
          <Link href="/tags" className="editorial-filter-chip">
            Topics
          </Link>
          <Link href="/archive" className="editorial-filter-chip">
            Archive
          </Link>
        </div>
      </section>

      {featuredPost && (
        <section className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Featured row</p>
            <h2 className="editorial-page-section-title">The newest post gets a stronger read-first treatment.</h2>
          </div>
          <article className="editorial-discovery-card is-featured">
            <div>
              <p className="editorial-home-card-label">{formatter.format(featuredPost.date)}</p>
              <h2 style={{ marginTop: '10px' }}>
                <Link href={`/posts/${featuredPost.slug}`}>{featuredPost.title}</Link>
              </h2>
              {featuredPost.summary && <p className="editorial-post-summary">{featuredPost.summary}</p>}
              <div className="editorial-post-meta-panel" style={{ marginTop: '16px' }}>
                <span>{featuredPost.readingTime ? `${featuredPost.readingTime} min read` : 'Post'}</span>
                <span>{featuredPost.tags.length} tag{featuredPost.tags.length === 1 ? '' : 's'}</span>
                <Link href={`/archives/${featuredPost.date.toISOString().slice(0, 7)}`}>Browse this month</Link>
              </div>
              <div className="editorial-chip-row">
                {featuredPost.tags.slice(0, 5).map((tag) => (
                  <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                    {tag}
                  </Link>
                ))}
              </div>
              <Link href={`/posts/${featuredPost.slug}`} className="editorial-post-link">
                Open featured post
              </Link>
            </div>
            <aside className="editorial-discovery-card-aside">
              <div className="editorial-page-aside">
                <p className="editorial-home-card-label">Why it stands out</p>
                <p className="editorial-page-copy" style={{ marginTop: '10px' }}>
                  The latest post gets a wider treatment so the scan path starts with the current entry and then drops into the year-by-year archive.
                </p>
                <div className="editorial-chip-row">
                  <Link href="/search" className="editorial-chip">
                    Search posts
                  </Link>
                  <Link href="/tags" className="editorial-chip">
                    Browse topics
                  </Link>
                </div>
              </div>
            </aside>
          </article>
        </section>
      )}

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">By year</p>
          <h2 className="editorial-page-section-title">Chronological reading, grouped so the archive stays legible.</h2>
        </div>
        <div style={{ display: 'grid', gap: '22px' }}>
          {postsByYear.map(({ year, posts: yearPosts }) => (
            <section key={year} id={`year-${year}`} className="editorial-month-grid">
              <div className="editorial-list-heading" style={{ marginBottom: 0 }}>
                <p className="editorial-home-section-label">Year {year}</p>
                <h3 className="editorial-page-section-title" style={{ fontSize: '1.4rem' }}>
                  {yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}
                </h3>
              </div>
              {yearPosts.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </section>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
