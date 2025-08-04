import matter from 'gray-matter';
import fs from 'fs';
import path from 'path';

/**
 * Interface representing a blog post
 */
export interface Post {
  /** Unique slug derived from filename */
  slug: string;
  /** Post title from frontmatter */
  title: string;
  /** Publication date */
  date: Date;
  /** Array of tags associated with the post */
  tags: string[];
  /** Post content in markdown format */
  content: string;
  /** Optional summary for displaying in previews */
  summary?: string;
  /** Optional cover image URL */
  coverImage?: string;
}

/**
 * Service for handling blog post operations
 */
class PostService {
  private posts: Post[] = [];
  private initialized = false;
  
  /**
   * Initialize the post service by loading all posts from markdown files
   *
   * @returns {Promise<void>}
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      const postsDirectory = path.join(process.cwd(), 'src/posts');
      const filenames = fs.readdirSync(postsDirectory);
      
      this.posts = filenames
        .filter(filename => filename.endsWith('.md'))
        .map(filename => {
          const slug = filename.replace(/\.md$/, '');
          const fullPath = path.join(postsDirectory, filename);
          const fileContents = fs.readFileSync(fullPath, 'utf8');
          const { data, content } = matter(fileContents);
          
          return {
            slug,
            title: data.title,
            date: new Date(data.date),
            tags: data.tags || [],
            content: content,
            summary: data.summary || '',
            coverImage: data.coverImage || data.image || undefined
          };
        });

      console.log(`Loaded ${this.posts.length} posts from markdown files`);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to load posts:', error);
      this.posts = [];
      this.initialized = true;
    }
  }

  /**
   * Get all posts, sorted by date (newest first)
   *
   * @returns {Promise<Post[]>} Array of all posts
   */
  async getAllPosts(): Promise<Post[]> {
    await this.ensureInitialized();
    return [...this.posts].sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Get recent posts, limited by count
   *
   * @param {number} count - Number of posts to return
   * @returns {Promise<Post[]>} Array of recent posts
   */
  async getRecentPosts(count: number = 5): Promise<Post[]> {
    const allPosts = await this.getAllPosts();
    return allPosts.slice(0, count);
  }

  /**
   * Get all tags with post counts
   *
   * @returns {Promise<{tag: string, count: number}[]>} Array of tags with counts
   */
  async getAllTags(): Promise<{tag: string, count: number}[]> {
    await this.ensureInitialized();

    const tagCounts = new Map<string, number>();

    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        const currentCount = tagCounts.get(tag) || 0;
        tagCounts.set(tag, currentCount + 1);
      });
    });

    return Array.from(tagCounts.entries())
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get posts filtered by tag
   *
   * @param {string} tag - Tag to filter by
   * @returns {Promise<Post[]>} Array of posts with the specified tag
   */
  async getPostsByTag(tag: string): Promise<Post[]> {
    await this.ensureInitialized();
    return this.posts
      .filter(post => post.tags.includes(tag))
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Get archive data by month
   *
   * @returns {Promise<{month: string, count: number}[]>} Array of months with post counts
   */
  async getArchiveByMonth(): Promise<{month: string, count: number}[]> {
    await this.ensureInitialized();

    const monthCounts = new Map<string, number>();

    this.posts.forEach(post => {
      const monthYear = post.date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      const currentCount = monthCounts.get(monthYear) || 0;
      monthCounts.set(monthYear, currentCount + 1);
    });

    return Array.from(monthCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateB.getTime() - dateA.getTime();
      });
  }

  /**
   * Get a post by its slug
   *
   * @param {string} slug - Post slug to find
   * @returns {Promise<Post | null>} The found post or null
   */
  async getPostBySlug(slug: string): Promise<Post | null> {
    await this.ensureInitialized();
    return this.posts.find(post => post.slug === slug) || null;
  }

  /**
   * Search posts by query term in title, content, and tags
   *
   * @param {string} query - Search query
   * @returns {Promise<Post[]>} Array of matching posts
   */
  async searchPosts(query: string): Promise<Post[]> {
    await this.ensureInitialized();

    if (!query.trim()) {
      return [];
    }

    const normalizedQuery = query.toLowerCase().trim();

    return this.posts
      .filter(post => {
        const titleMatch = post.title.toLowerCase().includes(normalizedQuery);
        const contentMatch = post.content.toLowerCase().includes(normalizedQuery);
        const tagsMatch = post.tags.some(tag =>
          tag.toLowerCase().includes(normalizedQuery)
        );

        return titleMatch || contentMatch || tagsMatch;
      })
      .sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Ensure the service is initialized before operations
   *
   * @private
   * @returns {Promise<void>}
   */
  private async ensureInitialized(): Promise<void> {
    if (!this.initialized) {
      await this.initialize();
    }
  }
}

// Create and export a singleton instance
export const postService = new PostService();