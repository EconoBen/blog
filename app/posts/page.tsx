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

const rowStyle = {
  paddingTop: '1rem',
  borderTop: '1px solid rgba(26, 36, 51, 0.12)',
  display: 'grid',
  gap: '0.75rem',
} as const;

function PostRow({ post }: { post: Posts[number] }) {
  return (
    <article style={rowStyle}>
      <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', alignItems: 'baseline' }}>
        <div style={{ minWidth: 0 }}>
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
  const topTags = countTags(posts);
  const postsByYear = groupPostsByYear(posts);

  return (
    <EditorialPageFrame currentPath="/posts">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Posts</p>
          <h1 className="editorial-page-title">Technical posts.</h1>
          <p className="editorial-page-copy">
            A chronological index of posts on AI systems, memory, engineering practice, and the occasional economics detour. The archive stays list-led so the newest work is easy to scan, but the older posts remain one click away.
          </p>
          <div className="editorial-chip-row">
            {topTags.map(([tag, count]) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                {tag} <span>({count})</span>
              </Link>
            ))}
          </div>
          <div className="editorial-link-row" style={{ marginTop: '0.5rem' }}>
            <Link href="/archive" className="editorial-post-link">
              Browse archive
            </Link>
            <Link href="/tags" className="editorial-post-link">
              Browse tags
            </Link>
            <Link href="/search" className="editorial-post-link">
              Search posts
            </Link>
          </div>
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">By year</p>
          <h2 className="editorial-page-section-title">A compact list that keeps each year readable without hiding the details.</h2>
        </div>
        {postsByYear.map(({ year, posts: yearPosts }) => (
          <section key={year} className="editorial-list-section" style={{ paddingTop: 0 }}>
            <div className="editorial-list-heading">
              <p className="editorial-home-section-label">Year {year}</p>
              <h3 className="editorial-page-section-title" style={{ fontSize: '1.4rem' }}>
                {yearPosts.length} post{yearPosts.length !== 1 ? 's' : ''}
              </h3>
            </div>
            <div style={{ display: 'grid', gap: '0.25rem' }}>
              {yearPosts.map((post) => (
                <PostRow key={post.slug} post={post} />
              ))}
            </div>
          </section>
        ))}
      </section>
    </EditorialPageFrame>
  );
}
