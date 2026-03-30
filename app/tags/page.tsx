import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Tags | Ben Labaschin',
  description: 'Browse every topic covered across the writing archive.',
};

export default async function TagsPage() {
  const posts = await postService.getAllPosts();

  const tagCounts = new Map<string, number>();
  const latestByTag = new Map<string, (typeof posts)[number]>();

  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      if (!latestByTag.has(tag)) {
        latestByTag.set(tag, post);
      }
    });
  });

  const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]);
  const tagsByLetter = new Map<string, Array<[string, number]>>();

  sortedTags.forEach(([tag, count]) => {
    const firstLetter = tag[0].toUpperCase();
    if (!tagsByLetter.has(firstLetter)) {
      tagsByLetter.set(firstLetter, []);
    }
    tagsByLetter.get(firstLetter)!.push([tag, count]);
  });

  const sortedLetters = Array.from(tagsByLetter.keys()).sort();
  const featuredTags = sortedTags.slice(0, 3).map(([tag, count]) => ({
    tag,
    count,
    latestPost: latestByTag.get(tag),
  }));

  return (
    <EditorialPageFrame currentPath="/tags" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Topics</p>
          <h1 className="editorial-page-title">Tags</h1>
          <p className="editorial-page-copy">
            Explore topics across {posts.length} posts, with featured themes surfaced first and the full alphabetic index preserved below.
          </p>
          <div className="editorial-breadcrumb" aria-label="Tag navigation">
            <Link href="/posts">Posts</Link>
            <span>/</span>
            <Link href="/archive">Archive</Link>
            <span>/</span>
            <span>Tags</span>
          </div>
          <div className="editorial-chip-row">
            {featuredTags.map(({ tag, count }) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                {tag} <span>({count})</span>
              </Link>
            ))}
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Topic index</p>
          <div className="editorial-page-metric-list" style={{ marginTop: '12px' }}>
            <div>
              <span className="editorial-page-metric-value">{sortedTags.length}</span>
              <span className="editorial-page-metric-label">Unique tags in the archive</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">Posts covered by these topics</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{featuredTags[0]?.tag ?? 'Topics'}</span>
              <span className="editorial-page-metric-label">Most frequent topic</span>
            </div>
          </div>
          <div className="editorial-link-row" style={{ marginTop: '16px' }}>
            <Link href="/search" className="editorial-post-link">
              Search
            </Link>
            <Link href="/archive" className="editorial-post-link">
              Archive
            </Link>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Featured topics</p>
          <h2 className="editorial-page-section-title">The archive topics with the clearest current signal.</h2>
        </div>
        <div className="editorial-topic-grid">
          {featuredTags.map(({ tag, count, latestPost }) => (
            <article key={tag} className="editorial-topic-card">
              <p className="editorial-home-card-label">{tag}</p>
              <h3 style={{ marginTop: '10px' }}>{count} post{count !== 1 ? 's' : ''}</h3>
              <p>
                {latestPost ? (
                  <>
                    Latest appearance: <Link href={`/posts/${latestPost.slug}`}>{latestPost.title}</Link>.
                  </>
                ) : (
                  'This topic currently has no linked post.'
                )}
              </p>
              <div className="editorial-chip-row">
                <Link href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                  Open topic
                </Link>
                {latestPost ? (
                  <Link href={`/posts/${latestPost.slug}`} className="editorial-chip">
                    Latest post
                  </Link>
                ) : null}
              </div>
            </article>
          ))}
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Alphabetical grid</p>
          <h2 className="editorial-page-section-title">Every topic grouped by first letter for easy scanning.</h2>
        </div>
        <div className="editorial-year-jump" style={{ marginBottom: '16px' }}>
          {sortedLetters.map((letter) => (
            <a key={letter} href={`#tag-letter-${letter}`} className="editorial-filter-chip">
              {letter}
            </a>
          ))}
        </div>
        <div className="editorial-letter-grid">
          {sortedLetters.map((letter) => (
            <section key={letter} id={`tag-letter-${letter}`} className="editorial-letter-card">
              <p className="editorial-home-card-label">{letter}</p>
              <div style={{ display: 'grid', gap: '12px', marginTop: '12px' }}>
                {tagsByLetter.get(letter)!.map(([tag, count]) => (
                  <div
                    key={tag}
                    style={{
                      display: 'flex',
                      alignItems: 'baseline',
                      justifyContent: 'space-between',
                      gap: '12px',
                    }}
                  >
                    <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                    <span className="editorial-post-summary">{count} post{count !== 1 ? 's' : ''}</span>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
