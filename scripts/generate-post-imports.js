/**
 * Script to generate PostService.ts with all markdown imports
 *
 * This script scans the src/posts directory for markdown files and
 * generates the PostService.ts file with appropriate imports
 */

const fs = require('fs');
const path = require('path');
const glob = require('glob');

/**
 * Generate a slug from a filename
 *
 * @param {string} filename - The filename to convert to a slug
 * @returns {string} The generated slug
 */
function generateSlug(filename) {
  return path.basename(filename, '.md');
}

/**
 * Generate a camelCase variable name from a slug
 *
 * @param {string} slug - The slug to convert
 * @returns {string} The camelCase variable name
 */
function generateVarName(slug) {
  return slug.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase()) + 'Md';
}

/**
 * Main function to generate PostService.ts
 */
function generatePostService() {
  // Find all markdown files in the posts directory
  const postsDir = path.join(__dirname, '../src/posts');
  const postFiles = glob.sync(path.join(postsDir, '*.md'));

  if (postFiles.length === 0) {
    console.error('No markdown files found in src/posts directory');
    process.exit(1);
  }

  // Generate imports
  const imports = postFiles.map(file => {
    const slug = generateSlug(file);
    const varName = generateVarName(slug);
    const relativePath = path.relative(
      path.join(__dirname, '../src/services'),
      file
    ).replace(/\\/g, '/'); // Ensure forward slashes for imports

    return `import ${varName} from '../posts/${slug}.md';`;
  }).join('\n');

  // Generate markdown files map
  const markdownFilesMap = postFiles.map(file => {
    const slug = generateSlug(file);
    const varName = generateVarName(slug);

    return `    '${slug}': ${varName},`;
  }).join('\n');

  // Read the template file
  const templatePath = path.join(__dirname, '../src/services/PostService.template.txt');
  let template;

  try {
    template = fs.readFileSync(templatePath, 'utf8');
  } catch (error) {
    console.error('Template file not found. Creating a new one.');
    // Use a default template if the file doesn't exist
    template = `// Import required libraries
import matter from 'gray-matter';

// Import markdown files directly
// This will be transformed by webpack's raw-loader
{{IMPORTS}}

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
{{MARKDOWN_FILES_MAP}}
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
          content: markdownContent
        };
      });

      console.log(\`Loaded \${this.posts.length} posts from markdown files\`);
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
`;
  }

  // Replace placeholders in the template
  const generatedFile = template
    .replace('{{IMPORTS}}', imports)
    .replace('{{MARKDOWN_FILES_MAP}}', markdownFilesMap);

  // Write the generated file
  const outputPath = path.join(__dirname, '../src/services/PostService.ts');
  fs.writeFileSync(outputPath, generatedFile);

  console.log(`Generated PostService.ts with ${postFiles.length} markdown files imported.`);
}

// Run the generator
generatePostService();
