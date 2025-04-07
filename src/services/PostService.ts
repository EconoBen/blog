// Import required libraries
import matter from 'gray-matter';

// Import markdown files directly
// This will be transformed by webpack's raw-loader
import what_are_ai_agents_an_introductionMd from '../posts/what_are_ai_agents_an_introduction.md';
import publishing_for_oreillyMd from '../posts/publishing_for_oreilly.md';
import pandas_functions_advanced_groupbys_with_grouper_assign_and_queryMd from '../posts/pandas_functions_advanced_groupbys_with_grouper_assign_and_query.md';
import on_the_origin_of_time_sharing_computers_round_robin_algorithms_and_cloud_computingMd from '../posts/on_the_origin_of_time_sharing_computers_round_robin_algorithms_and_cloud_computing.md';
import on_the_death_of_a_friendMd from '../posts/on_the_death_of_a_friend.md';
import legacy_naming_conventions_are_holding_us_backMd from '../posts/legacy_naming_conventions_are_holding_us_back.md';
import hostYourOwnPrivateLlmAccessItFromAnywhereMd from '../posts/host-your-own-private-llm-access-it-from-anywhere.md';
import github_ssh_and_1passwordMd from '../posts/github_ssh_and_1password.md';
import building_an_https_model_apI_for_cheapMd from '../posts/building_an_https_model_apI_for_cheap.md';
import I_paid_off_194k_in_student_loans_in_six_years__it_wasnt_easyMd from '../posts/I_paid_off_194k_in_student_loans_in_six_years._it_wasn\'t_easy.md';
import yearInReview2024Md from '../posts/2024-year-in-review.md';
import myYearInReview2023Md from '../posts/2023-my-year-in-review.md';
import reflection2022Md from '../posts/2022_reflection.md';

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
   * Constructor that automatically initializes the service
   */
  constructor() {
    // Initialize immediately to avoid timing issues
    this.initialize().catch(err => {
      console.error('Failed to initialize PostService:', err);
    });
  }

  /**
   * Initialize the post service by loading all posts from markdown files
   *
   * @returns {Promise<void>}
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // Create a map of markdown content with their slugs
      const markdownFiles: Record<string, string> = {
    'what_are_ai_agents_an_introduction': what_are_ai_agents_an_introductionMd,
    'publishing_for_oreilly': publishing_for_oreillyMd,
    'pandas_functions_advanced_groupbys_with_grouper_assign_and_query': pandas_functions_advanced_groupbys_with_grouper_assign_and_queryMd,
    'on_the_origin_of_time_sharing_computers_round_robin_algorithms_and_cloud_computing': on_the_origin_of_time_sharing_computers_round_robin_algorithms_and_cloud_computingMd,
    'on_the_death_of_a_friend': on_the_death_of_a_friendMd,
    'legacy_naming_conventions_are_holding_us_back': legacy_naming_conventions_are_holding_us_backMd,
    'host-your-own-private-llm-access-it-from-anywhere': hostYourOwnPrivateLlmAccessItFromAnywhereMd,
    'github_ssh_and_1password': github_ssh_and_1passwordMd,
    'building_an_https_model_apI_for_cheap': building_an_https_model_apI_for_cheapMd,
    'I_paid_off_194k_in_student_loans_in_six_years._it_wasn\'t_easy': I_paid_off_194k_in_student_loans_in_six_years__it_wasnt_easyMd,
    '2024-year-in-review': yearInReview2024Md,
    '2023-my-year-in-review': myYearInReview2023Md,
    '2022_reflection': reflection2022Md,
      };

      // Process all markdown files
      this.posts = Object.entries(markdownFiles).map(([slug, content]) => {
        // Parse frontmatter and content
        const { data, content: markdownContent } = matter(content);

        // Return Post object
        return {
          slug,
          title: data.title,
          date: new Date(data.date),
          tags: data.tags || [],
          content: markdownContent,
          summary: data.summary || '',
          coverImage: data.coverImage || undefined
        };
      });

      console.log(`Loaded ${this.posts.length} posts from markdown files`);
      this.initialized = true;
    } catch (error) {
      console.error('Failed to load posts:', error);
      // Fallback to empty posts array
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

    // Create a map of tag counts
    const tagCounts = new Map<string, number>();

    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        const currentCount = tagCounts.get(tag) || 0;
        tagCounts.set(tag, currentCount + 1);
      });
    });

    // Convert to array and sort by count (descending)
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

    // Group posts by month
    const monthCounts = new Map<string, number>();

    this.posts.forEach(post => {
      const monthYear = post.date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      const currentCount = monthCounts.get(monthYear) || 0;
      monthCounts.set(monthYear, currentCount + 1);
    });

    // Convert to array and sort by date (newest first)
    return Array.from(monthCounts.entries())
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        // Sort by date (most recent first)
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

    // If query is empty, return empty array
    if (!query.trim()) {
      return [];
    }

    // Convert query to lowercase for case-insensitive matching
    const normalizedQuery = query.toLowerCase().trim();

    // Filter posts that match the query in title, content, or tags
    return this.posts
      .filter(post => {
        const titleMatch = post.title.toLowerCase().includes(normalizedQuery);
        const contentMatch = post.content.toLowerCase().includes(normalizedQuery);
        const tagsMatch = post.tags.some(tag =>
          tag.toLowerCase().includes(normalizedQuery)
        );

        // Return true if any field matches
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
