import { notFound } from 'next/navigation';
import { postService } from '../../services/PostService';
import Sidebar from '../../components/Sidebar';
import NavBar from '../../components/NavBar';
import { SidebarToggle } from '../../components/SidebarToggle';
import BlogCard from '../../components/BlogCard';

interface ArchivePageProps {
  params: Promise<{
    month: string;
  }>;
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { month } = await params;

  // Expected format: YYYY-MM
  const [year, monthNum] = month.split('-');

  if (!year || !monthNum || isNaN(parseInt(year)) || isNaN(parseInt(monthNum))) {
    notFound();
  }

  const allPosts = await postService.getAllPosts();

  // Filter posts by month
  const monthPosts = allPosts.filter(post => {
    const postDate = new Date(post.date);
    const postYear = postDate.getFullYear().toString();
    const postMonth = (postDate.getMonth() + 1).toString().padStart(2, '0');
    return postYear === year && postMonth === monthNum;
  });

  if (monthPosts.length === 0) {
    notFound();
  }

  const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  const recentPosts = allPosts.slice(0, 10);

  return (
    <div className="blog-container">
      <Sidebar posts={recentPosts} />

      <div className="main-content">
        <NavBar />

        <div className="content-wrapper">
          <h1 className="page-title">Posts from {monthName}</h1>

          <div className="blog-cards-container">
            {monthPosts.map((post) => (
              <article key={post.slug} className="blog-card">
                <div className="blog-card-content">
                  <header className="blog-card-header">
                    <h2 className="blog-card-title">
                      <a href={`/posts/${post.slug}`}>{post.title}</a>
                    </h2>
                    <div className="blog-card-meta">
                      <span className="blog-card-date">
                        {post.date.toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric'
                        })}
                      </span>
                      <span className="blog-card-reading-time">
                        {(post.readingTime ?? Math.ceil(post.content.split(/\s+/).length / 200))} min read
                      </span>
                    </div>
                  </header>

                  {post.summary && (
                    <div className="blog-card-excerpt">
                      <p>{post.summary}</p>
                    </div>
                  )}

                  <div className="blog-card-footer">
                    <div className="blog-card-tags">
                      {post.tags.slice(0, 3).map((tag) => (
                        <a
                          key={tag}
                          href={`/tags/${encodeURIComponent(tag)}`}
                          className="blog-card-tag"
                        >
                          {tag}
                        </a>
                      ))}
                    </div>

                    <a href={`/posts/${post.slug}`} className="blog-card-read-more">
                      Read more
                      <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path d="M5 8h6M9 5l3 3-3 3" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>

        <SidebarToggle />
      </div>
    </div>
  );
}

export async function generateStaticParams() {
  const allPosts = await postService.getAllPosts();

  // Get unique months from all posts
  const months = new Set<string>();

  allPosts.forEach(post => {
    const postDate = new Date(post.date);
    const year = postDate.getFullYear();
    const month = (postDate.getMonth() + 1).toString().padStart(2, '0');
    months.add(`${year}-${month}`);
  });

  return Array.from(months).map(month => ({
    month,
  }));
}

export async function generateMetadata({ params }: ArchivePageProps) {
  const { month } = await params;
  const [year, monthNum] = month.split('-');

  if (!year || !monthNum) {
    return {
      title: 'Archive Not Found',
    };
  }

  const monthName = new Date(parseInt(year), parseInt(monthNum) - 1).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long'
  });

  return {
    title: `Posts from ${monthName} - Economic Notes`,
    description: `Browse all blog posts from ${monthName}`,
  };
}