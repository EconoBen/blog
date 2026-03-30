import { Metadata } from 'next';
import Link from 'next/link';
import Sidebar from '../components/Sidebar';
import NavBar from '../components/NavBar';
import { SidebarToggle } from '../components/SidebarToggle';
import { postService } from '../services/PostService';

export const metadata: Metadata = {
  title: 'Tags | Economic Notes',
  description: 'Browse all tags and topics covered in Economic Notes blog.',
};

export default async function TagsPage() {
  const posts = await postService.getAllPosts();

  // Extract all unique tags with counts
  const tagCounts = new Map<string, number>();
  posts.forEach(post => {
    post.tags.forEach(tag => {
      tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
    });
  });

  // Convert to array and sort by count
  const sortedTags = Array.from(tagCounts.entries()).sort((a, b) => b[1] - a[1]);

  // Group tags by first letter
  const tagsByLetter = new Map<string, Array<[string, number]>>();
  sortedTags.forEach(([tag, count]) => {
    const firstLetter = tag[0].toUpperCase();
    if (!tagsByLetter.has(firstLetter)) tagsByLetter.set(firstLetter, []);
    tagsByLetter.get(firstLetter)!.push([tag, count]);
  });

  const sortedLetters = Array.from(tagsByLetter.keys()).sort();

  const recentPosts = posts.slice(0, 10);

  return (
    <div className="blog-container">
      <Sidebar posts={recentPosts} />

      <div className="main-content">
        <NavBar />

        <div className="content-wrapper tag-page">
          <h1 className="page-title">Tags</h1>

          <div className="tag-cloud">
            {sortedTags.map(([tag, count]) => {
              const maxCount = sortedTags[0][1];
              const minSize = 0.9;
              const maxSize = 1.8;
              const size = minSize + (count / maxCount) * (maxSize - minSize);

              return (
                <Link
                  key={tag}
                  href={`/tags/${encodeURIComponent(tag)}`}
                  className="tag-link"
                  style={{ fontSize: `${size}rem` }}
                  title={`${count} post${count !== 1 ? 's' : ''}`}
                >
                  {tag}
                </Link>
              );
            })}
          </div>

          <div className="tags-grid">
            {sortedLetters.map(letter => (
              <div key={letter} className="tag-item">
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
        </div>

        <SidebarToggle />
      </div>
    </div>
  );
}