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
 * Generate a safe variable name from a slug
 * Handles special characters and ensures the variable name is valid JavaScript
 *
 * @param {string} slug - The slug to convert
 * @returns {string} The safe variable name
 */
function generateVarName(slug) {
  // Handle filenames starting with numbers by adding a prefix
  const hasNumberPrefix = /^[0-9]/.test(slug);

  // Convert to camelCase and sanitize
  let varName = slug
    // Convert hyphens to camelCase
    .replace(/-([a-z])/g, (_, letter) => letter.toUpperCase())
    // Remove apostrophes and other problematic characters
    .replace(/['"`]/g, '')
    // Replace dots and other non-alphanumeric characters with underscores
    .replace(/[^a-zA-Z0-9_]/g, '_')
    + 'Md';

  // Handle numeric prefixes by rearranging to put numbers at the end
  if (hasNumberPrefix) {
    // Extract the numeric part from the beginning
    const numericMatch = slug.match(/^([0-9]+)(.*)$/);
    if (numericMatch) {
      const numericPart = numericMatch[1];
      // Get the rest of the name without the numeric prefix
      let restOfName = numericMatch[2];

      // Remove any leading non-alphabetic characters from the rest of the name
      restOfName = restOfName.replace(/^[^a-zA-Z]+/, '');

      // If the rest of the name starts with a hyphen or underscore, trim it
      restOfName = restOfName.replace(/^[-_]/, '');

      // Convert the first part to camelCase if it has hyphens
      const camelCaseRest = restOfName.replace(/-([a-z])/g, (_, letter) => letter.toUpperCase());

      // Create the final variable name with the number at the end
      varName = camelCaseRest + numericPart + 'Md';
    }
  }

  return varName;
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

  // Create a map to track variable names to avoid duplicates
  const varNamesMap = new Map();
  // Create a map to store the final variable name for each slug
  const slugToVarMap = new Map();

  // Generate imports
  const imports = postFiles.map(file => {
    const slug = generateSlug(file);
    let varName = generateVarName(slug);

    // Check if we've seen this variable name before
    if (varNamesMap.has(varName)) {
      // If duplicate, append a number to make it unique
      const count = varNamesMap.get(varName) + 1;
      varNamesMap.set(varName, count);
      varName = `${varName}${count}`;
    } else {
      varNamesMap.set(varName, 1);
    }

    // Store the final variable name for this slug
    slugToVarMap.set(slug, varName);

    // Escape any special characters in the path string
    const safePath = `../posts/${slug}.md`.replace(/'/g, "\\'");

    return `import ${varName} from '${safePath}';`;
  }).join('\n');

  // Generate markdown files map using the same variable names as in imports
  const markdownFilesMap = postFiles.map(file => {
    const slug = generateSlug(file);
    // Use the same variable name that was used in the imports
    const varName = slugToVarMap.get(slug);

    // Escape any special characters in the slug string
    const safeSlug = slug.replace(/'/g, "\\'");

    return `    '${safeSlug}': ${varName},`;
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
  /** Optional summary for displaying in previews */
  summary?: string;
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
          content: markdownContent,
          summary: data.summary || ''
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

// If the script is executed directly
if (require.main === module) {
  generatePostService();
}

// Export the function for use in other scripts
module.exports = { generatePostService };
