import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Tags | Economic Notes',
  description: 'Browse all tags and topics covered in Economic Notes blog.',
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
  const topTagCount = sortedTags[0]?.[1] || 0;

  return (
    <EditorialPageFrame currentPath="/tags" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Topics</p>
          <h1 className="editorial-page-title">Tags</h1>
          <p className="editorial-page-copy">
            Explore topics across {posts.length} posts, with links preserved to every tag-specific archive.
          </p>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Tag index</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{sortedTags.length}</span>
              <span className="editorial-page-metric-label">unique tags</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{topTagCount}</span>
              <span className="editorial-page-metric-label">posts for the most-used tag</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">All tags</p>
          <h2 className="editorial-page-section-title">A weighted cloud with direct links.</h2>
        </div>
        <div className="tag-cloud">
          <div className="tag-cloud-container">
            {sortedTags.map(([tag, count]) => {
              const maxCount = topTagCount || 1;
              const minSize = 0.95;
              const maxSize = 1.85;
              const size = minSize + (count / maxCount) * (maxSize - minSize);

              return (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="tag-cloud-item"
                  style={{ fontSize: `${size}rem` }}
                  title={`${count} post${count !== 1 ? 's' : ''}`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>
        </div>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Alphabetical</p>
          <h2 className="editorial-page-section-title">Browse the same index by first letter.</h2>
        </div>
        <div className="tags-alphabetical">
          {sortedLetters.map((letter) => (
            <div key={letter} className="letter-group">
              <h3 className="letter-heading">{letter}</h3>
              <div className="letter-tags">
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
            </div>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
