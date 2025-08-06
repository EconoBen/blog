import Link from 'next/link';
import { postService } from '../../../services/PostService';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface TagPageProps {
  params: {
    tag: string;
  };
}

export async function generateMetadata({ params }: { params: Promise<{ tag: string }> }): Promise<Metadata> {
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

export default async function TagPage({ params }: { params: Promise<{ tag: string }> }) {
  const { tag: encodedTag } = await params;
  const tag = decodeURIComponent(encodedTag);
  const posts = await postService.getPostsByTag(tag);
  
  if (posts.length === 0) {
    notFound();
  }

  return (
    <div className="tag-page">
      <div className="page-header">
        <h1 className="page-title">Posts tagged with "{tag}"</h1>
        <p className="page-subtitle">{posts.length} post{posts.length !== 1 ? 's' : ''} found</p>
      </div>
      
      <div className="posts-grid">
        {posts.map((post: any) => (
          <article key={post.slug} className="blog-card">
            <Link href={`/posts/${post.slug}`}>
              <div className="blog-card-content">
                <h2 className="blog-card-title">{post.title}</h2>
                <time className="blog-card-date">
                  {post.date.toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
                {post.summary && (
                  <p className="blog-card-summary">{post.summary}</p>
                )}
                <div className="blog-card-tags">
                  {post.tags.map((t: string) => (
                    <span key={t} className={`tag ${t === tag ? 'tag-active' : ''}`}>
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}