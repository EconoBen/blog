import { notFound } from 'next/navigation';
import { postService } from '../../services/PostService';
import BlogCard from '../../components/BlogCard';

interface ArchivePageProps {
  params: Promise<{
    month: string;
  }>;
}

export default async function ArchivePage({ params }: ArchivePageProps) {
  const { month } = await params;
  
  // Parse month parameter (expected format: YYYY-MM)
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
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Posts from {monthName}</h1>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {monthPosts.map((post) => (
          <BlogCard 
            key={post.slug} 
            slug={post.slug}
            title={post.title}
            date={post.date}
            tags={post.tags}
            excerpt={post.summary || ''}
            readingTime={post.readingTime}
            coverImage={post.coverImage}
          />
        ))}
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