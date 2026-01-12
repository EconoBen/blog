import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

export interface Post {
  slug: string;
  title: string;
  date: Date;
  summary?: string;
  tags: string[];
  content: string;
  coverImage?: string;
  image?: string;
  readingTime?: number;
}

export interface TagCount {
  tag: string;
  count: number;
}

class PostService {
  private postsDirectory = path.join(process.cwd(), 'src', 'posts');

  async getAllPosts(): Promise<Post[]> {
    // Check if directory exists
    if (!fs.existsSync(this.postsDirectory)) {
      console.warn('Posts directory not found:', this.postsDirectory);
      return [];
    }

    const fileNames = fs.readdirSync(this.postsDirectory);
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => this.getPostBySlug(fileName.replace(/\.md$/, '')))
      .filter(post => post !== null) as Post[];

    // Sort posts by date (newest first)
    return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getPostBySlug(slug: string): Post | null {
    try {
      const fullPath = path.join(this.postsDirectory, `${slug}.md`);
      
      if (!fs.existsSync(fullPath)) {
        console.warn(`Post not found: ${slug}`);
        return null;
      }

      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Calculate reading time (average 200 words per minute)
      const words = content.split(/\s+/).length;
      const readingTime = Math.ceil(words / 200);

      return {
        slug,
        title: data.title || slug,
        date: new Date(data.date || Date.now()),
        summary: data.summary || data.description || '',
        tags: data.tags || [],
        content,
        coverImage: data.coverImage || data.image || undefined,
        readingTime
      };
    } catch (error) {
      console.error(`Error reading post ${slug}:`, error);
      return null;
    }
  }

  async getPostsByTag(tag: string): Promise<Post[]> {
    const allPosts = await this.getAllPosts();
    return allPosts.filter(post => 
      post.tags.some(t => t.toLowerCase() === tag.toLowerCase())
    );
  }

  async getAllTags(): Promise<TagCount[]> {
    const allPosts = await this.getAllPosts();
    const tagCounts = new Map<string, number>();

    allPosts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts.set(tag, (tagCounts.get(tag) || 0) + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  async searchPosts(query: string): Promise<Post[]> {
    const allPosts = await this.getAllPosts();
    const searchTerm = query.toLowerCase();

    return allPosts.filter(post =>
      post.title.toLowerCase().includes(searchTerm) ||
      post.summary?.toLowerCase().includes(searchTerm) ||
      post.tags.some(tag => tag.toLowerCase().includes(searchTerm)) ||
      post.content.toLowerCase().includes(searchTerm)
    );
  }

  async getRecentPosts(limit: number = 4): Promise<Post[]> {
    const allPosts = await this.getAllPosts();
    return allPosts.slice(0, limit);
  }

  async getArchiveByMonth(): Promise<{ month: string; count: number }[]> {
    const allPosts = await this.getAllPosts();
    const archiveCounts = new Map<string, number>();

    allPosts.forEach(post => {
      const monthYear = post.date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });
      archiveCounts.set(monthYear, (archiveCounts.get(monthYear) || 0) + 1);
    });

    return Array.from(archiveCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        // Sort by date descending (newest first)
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateB.getTime() - dateA.getTime();
      });
  }
}

export const postService = new PostService();