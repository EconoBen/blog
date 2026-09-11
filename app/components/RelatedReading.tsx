import Link from 'next/link';
import type { RelatedReadingItem } from '../services/readingDiscovery';
import type { Post } from '../services/PostService';

const articleDate = (post: Post) => post.date.toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' });

export function RelatedReading({ items }: { items: readonly RelatedReadingItem[] }) {
  if (!items.length) return null;
  return (
    <section className="article-related" aria-labelledby="article-related-heading">
      <header>
        <p className="article-reader-label">Continue reading</p>
        <h2 id="article-related-heading">Related articles</h2>
        <p>References and shared subjects from the writing.</p>
      </header>
      <ol>{items.map(({ post, reason, kind }) => <li key={post.slug} data-connection-kind={kind}>
        <h3><Link href={`/posts/${encodeURIComponent(post.slug)}`}>{post.title}</Link></h3>
        <p className="article-related-reason">{reason}</p>
        <p className="article-related-meta"><time dateTime={post.date.toISOString()}>{articleDate(post)}</time>{post.readingTime && <span>{post.readingTime} min read</span>}</p>
      </li>)}</ol>
    </section>
  );
}

export function ChronologicalNavigation({ newer, older }: { newer?: Post; older?: Post }) {
  if (!newer && !older) return null;
  return (
    <nav className="article-chronology" aria-label="Articles by publication date">
      <p className="article-reader-label">By publication date</p>
      <div>{([{ label: 'Newer article', post: newer }, { label: 'Older article', post: older }]).map(({ label, post }) => post ? (
        <Link key={post.slug} href={`/posts/${encodeURIComponent(post.slug)}`}>
          <span>{label}</span><strong>{post.title}</strong><time dateTime={post.date.toISOString()}>{articleDate(post)}</time>
        </Link>
      ) : null)}</div>
    </nav>
  );
}
