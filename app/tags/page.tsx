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
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
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
  const topTags = sortedTags.slice(0, 6);

  return (
    <EditorialPageFrame currentPath="/tags" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy" style={{ maxWidth: '46rem' }}>
          <p className="editorial-home-kicker">Topics</p>
          <h1 className="editorial-page-title">Tags</h1>
          <p className="editorial-page-copy">
            Explore topics across {posts.length} posts, with every tag resolving to a real archive and the broader themes surfaced first.
          </p>
          <div className="editorial-chip-row">
            {topTags.map(([tag, count]) => (
              <Link key={tag} href={`/tags/${encodeURIComponent(tag)}`} className="editorial-chip">
                {tag} <span>({count})</span>
              </Link>
            ))}
          </div>
          <div className="editorial-link-row" style={{ marginTop: '0.5rem' }}>
            <Link href="/posts" className="editorial-post-link">
              Posts
            </Link>
            <Link href="/archive" className="editorial-post-link">
              Archive
            </Link>
            <Link href="/search" className="editorial-post-link">
              Search
            </Link>
          </div>
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">All tags</p>
          <h2 className="editorial-page-section-title">A simple index of the archive topics.</h2>
        </div>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {sortedLetters.map((letter) => (
            <section key={letter} className="editorial-home-card">
              <p className="editorial-home-card-label">{letter}</p>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {tagsByLetter.get(letter)!.map(([tag, count]) => (
                  <Link
                    key={tag}
                    href={`/tags/${encodeURIComponent(tag)}`}
                    className="tag-link"
                  >
                    {tag} <span className="tag-count">({count})</span>
                  </Link>
                ))}
              </div>
            </section>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
