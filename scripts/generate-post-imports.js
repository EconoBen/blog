#!/usr/bin/env node

/**
 * Script to generate PostService.ts with all markdown imports
 * This script scans the src/posts directory for markdown files
 */

const fs = require('fs');
const path = require('path');

// Directory containing blog posts
const POSTS_DIR = path.join(__dirname, '../src/posts');
const OUTPUT_FILE = path.join(__dirname, '../app/services/PostService.ts');
const TEMPLATE_FILE = path.join(__dirname, '../app/services/PostService.template.txt');

/**
 * Scan posts directory and generate PostService.ts
 */
function generatePostService() {
  // Check if posts directory exists
  if (!fs.existsSync(POSTS_DIR)) {
    console.error(`Posts directory not found: ${POSTS_DIR}`);
    console.log('This script expects markdown files in src/posts/');
    process.exit(1);
  }

  // Read all markdown files
  const files = fs.readdirSync(POSTS_DIR)
    .filter(file => file.endsWith('.md'))
    .sort();

  if (files.length === 0) {
    console.error('No markdown files found in posts directory');
    process.exit(1);
  }

  console.log(`Found ${files.length} markdown files`);

  // Read template if it exists
  let template = '';
  if (fs.existsSync(TEMPLATE_FILE)) {
    template = fs.readFileSync(TEMPLATE_FILE, 'utf8');
    console.log('Using template file');
  }

  // If no template, create a basic PostService
  if (!template) {
    template = `import fs from 'fs';
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
    const fileNames = fs.readdirSync(this.postsDirectory);
    const posts = fileNames
      .filter(fileName => fileName.endsWith('.md'))
      .map(fileName => this.getPostBySlug(fileName.replace(/\\.md$/, '')))
      .filter(post => post !== null) as Post[];

    // Sort posts by date (newest first)
    return posts.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  getPostBySlug(slug: string): Post | null {
    try {
      const fullPath = path.join(this.postsDirectory, \`\${slug}.md\`);
      const fileContents = fs.readFileSync(fullPath, 'utf8');
      const { data, content } = matter(fileContents);

      // Calculate reading time (average 200 words per minute)
      const words = content.split(/\\s+/).length;
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
      console.error(\`Error reading post \${slug}:\`, error);
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
}

export const postService = new PostService();`;
  }

  // Write the PostService file
  fs.writeFileSync(OUTPUT_FILE, template);
  console.log(`✅ Generated ${OUTPUT_FILE}`);
  console.log(`   Processing ${files.length} posts`);
}

// Run the generator
generatePostService();