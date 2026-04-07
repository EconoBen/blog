import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { EditorialPageFrame } from '../../components/EditorialPageFrame';
import { postService } from '../../../services/PostService';

interface TagPageProps {
  params: Promise<{
    tag: string;
  }>;
}

export async function generateMetadata({ params }: TagPageProps): Promise<Metadata> {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);

  return {
    title: `${tag} | Economic Notes`,
    description: `Browse all posts tagged with "${tag}".`,
  };
}

export async function generateStaticParams() {
  const tags = await postService.getAllTags();
  return tags.map((tagData: any) => ({
    tag: encodeURIComponent(tagData.tag),
  }));
}

export default async function TagPage({ params }: TagPageProps) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const posts = await postService.getPostsByTag(tag);

  if (posts.length === 0) {
    notFound();
  }

  return (
    <EditorialPageFrame currentPath="/tags" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Tag archive</p>
          <h1 className="editorial-page-title">{tag}</h1>
          <p className="editorial-page-copy">
            {posts.length} post{posts.length !== 1 ? 's' : ''} found for this topic, ordered newest first.
          </p>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Browse links</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{posts.length}</span>
              <span className="editorial-page-metric-label">posts in this tag</span>
            </div>
            <div>
              <Link href="/tags" className="editorial-post-link">
                Back to tags
              </Link>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Posts</p>
          <h2 className="editorial-page-section-title">Everything indexed under {tag}.</h2>
        </div>
        <div className="editorial-post-grid">
          {posts.map((post) => (
            <article key={post.slug} className="editorial-post-card">
              <div className="editorial-post-meta">
                <span>{post.date.toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                })}</span>
                <span>{post.tags.length} tags</span>
              </div>
              <h2>{post.title}</h2>
              {post.summary && <p className="editorial-post-summary">{post.summary}</p>}
              <div className="editorial-chip-row">
                {post.tags.map((postTag) => (
                  <span key={postTag} className="editorial-chip">
                    {postTag}
                  </span>
                ))}
              </div>
              <Link href={`/posts/${post.slug}`} className="editorial-post-link">
                Read post
              </Link>
            </article>
          ))}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
