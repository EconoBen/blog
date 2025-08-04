import Link from 'next/link';
import { postService } from '@/app/services/PostService';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';

interface ArchiveMonthPageProps {
  params: {
    month: string;
  };
}

export async function generateMetadata({ params }: ArchiveMonthPageProps): Promise<Metadata> {
  const month = decodeURIComponent(params.month);
  return {
    title: `${month} | Economic Notes Archives`,
    description: `Browse all posts from ${month}.`,
  };
}

export async function generateStaticParams() {
  const archives = await postService.getArchiveByMonth();
  return archives.map((archive) => ({
    month: encodeURIComponent(archive.month),
  }));
}

export default async function ArchiveMonthPage({ params }: ArchiveMonthPageProps) {
  const monthName = decodeURIComponent(params.month);
  const allPosts = await postService.getAllPosts();
  
  // Filter posts by month
  const monthPosts = allPosts.filter(post => {
    const postMonth = post.date.toLocaleDateString('en-US', {
      month: 'long',
      year: 'numeric'
    });
    return postMonth === monthName;
  });

  if (monthPosts.length === 0) {
    notFound();
  }

  return (
    <div className="archive-month-page">
      <h1 className="page-title">{monthName}</h1>
      
      <div className="posts-list">
        {monthPosts.map((post) => (
          <article key={post.slug} className="archive-post-item">
            <Link href={`/posts/${post.slug}`}>
              <h2>{post.title}</h2>
              <time>
                {post.date.toLocaleDateString('en-US', {
                  day: 'numeric',
                  month: 'long',
                  year: 'numeric'
                })}
              </time>
              {post.summary && (
                <p className="post-summary">{post.summary}</p>
              )}
              <div className="post-tags">
                {post.tags.map((tag) => (
                  <span key={tag} className="tag">#{tag}</span>
                ))}
              </div>
            </Link>
          </article>
        ))}
      </div>
    </div>
  );
}