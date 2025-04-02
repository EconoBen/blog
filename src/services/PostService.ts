import matter from 'gray-matter';

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

// Mock data for development - in production, this would be loaded dynamically
const POST_DATA = [
  {
    file: 'optimizing-docker-build-pipelines.md',
    content: `---
title: Optimizing Docker Build Pipelines for CI/CD
date: 2025-04-02
tags: [docker, cicd, performance]
---

After analyzing build times across several projects, I've identified key optimization strategies that significantly reduce Docker image build times without compromising quality. These approaches are particularly valuable in CI/CD pipelines where every second of build time impacts developer productivity and infrastructure costs.

## Layer Caching Strategy

The most impactful improvement comes from proper <span class="term-reference">layer caching<div class="hover-card"><div class="hover-card-title">Docker Layer Caching</div>Docker builds images in layers, with each instruction creating a new layer. When you rebuild an image, Docker can reuse unchanged layers from cache, saving build time. Layers are identified by their content hash.</div></span>. By organizing your \`Dockerfile\` to place rarely changed instructions at the top and frequently modified code at the bottom, you can maximize cache utilization.

<div class="code-block">
  <div class="code-header">
    <div class="code-filename">Dockerfile</div>
    <div class="code-actions">
      <div class="code-action">Copy</div>
    </div>
  </div>
  <div class="code-container">
    <div class="line-numbers">
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
      <span>6</span>
      <span>7</span>
      <span>8</span>
      <span>9</span>
    </div>
    <div class="code-content">
      <div class="code-line"><span class="comment"># Place rarely changing instructions at the top</span></div>
      <div class="code-line"><span class="keyword">FROM</span> node:16-alpine</div>
      <div class="code-line"><span class="keyword">WORKDIR</span> /app</div>
      <div class="code-line"></div>
      <div class="code-line"><span class="comment"># Dependencies change less frequently than code</span></div>
      <div class="code-line"><span class="keyword">COPY</span> package*.json ./</div>
      <div class="code-line"><span class="keyword">RUN</span> npm ci</div>
      <div class="code-line"></div>
      <div class="code-line"><span class="comment"># Application code changes most frequently - keep at bottom</span></div>
      <div class="code-line"><span class="keyword">COPY</span> . .</div>
      <div class="code-line"><span class="keyword">RUN</span> npm run build</div>
    </div>
  </div>
</div>

This ordering ensures that changes to your application code don't invalidate the cached layers for dependency installation, which is typically the most time-consuming part of the build process.

## Multi-Stage Builds

<span class="term-reference">Multi-stage builds<div class="hover-card"><div class="hover-card-title">Multi-stage Builds</div>A technique that uses multiple FROM statements in a Dockerfile. Each FROM instruction begins a new stage of the build. You can selectively copy artifacts from one stage to another, leaving behind everything you don't need in the final image.</div></span> provide another dimension of optimization, separating build dependencies from runtime requirements. This approach creates smaller, more secure production images by discarding unnecessary build tools and intermediate files.

<div class="code-block">
  <div class="code-header">
    <div class="code-filename">Dockerfile.multistage</div>
    <div class="code-actions">
      <div class="code-action">Copy</div>
    </div>
  </div>
  <div class="code-container">
    <div class="line-numbers">
      <span>1</span>
      <span>2</span>
      <span>3</span>
      <span>4</span>
      <span>5</span>
      <span>6</span>
      <span>7</span>
      <span>8</span>
      <span>9</span>
      <span>10</span>
      <span>11</span>
      <span>12</span>
      <span>13</span>
    </div>
    <div class="code-content">
      <div class="code-line"><span class="comment"># Build stage</span></div>
      <div class="code-line"><span class="keyword">FROM</span> node:16-alpine <span class="keyword">AS</span> build</div>
      <div class="code-line"><span class="keyword">WORKDIR</span> /app</div>
      <div class="code-line"><span class="keyword">COPY</span> package*.json ./</div>
      <div class="code-line"><span class="keyword">RUN</span> npm ci</div>
      <div class="code-line"><span class="keyword">COPY</span> . .</div>
      <div class="code-line"><span class="keyword">RUN</span> npm run build</div>
      <div class="code-line"></div>
      <div class="code-line"><span class="comment"># Production stage</span></div>
      <div class="code-line"><span class="keyword">FROM</span> nginx:alpine</div>
      <div class="code-line"><span class="keyword">COPY</span> --from=build /app/dist /usr/share/nginx/html</div>
      <div class="code-line"><span class="keyword">EXPOSE</span> 80</div>
      <div class="code-line"><span class="keyword">CMD</span> [<span class="string">"nginx"</span>, <span class="string">"-g"</span>, <span class="string">"daemon off;"</span>]</div>
    </div>
  </div>
</div>

In this example, the build tools, node_modules, and source code remain in the build stage, while only the compiled artifacts are copied to the production image, resulting in a dramatically smaller footprint.

## BuildKit Optimizations

Modern Docker installations include <span class="term-reference">BuildKit<div class="hover-card"><div class="hover-card-title">BuildKit</div>Docker's modern build system with advanced features like concurrent dependency resolution, enhanced caching, and automatic garbage collection of unused build cache. Enable with DOCKER_BUILDKIT=1 environment variable.</div></span>, which offers several performance improvements over the legacy builder:

- Concurrent dependency resolution
- More efficient caching with content-addressable storage
- Automatic garbage collection of unused cache
- Build secrets without leaving them in the image layers

Enable BuildKit by setting the \`DOCKER_BUILDKIT=1\` environment variable before your build commands:

<div class="code-block">
  <div class="code-header">
    <div class="code-filename">build.sh</div>
    <div class="code-actions">
      <div class="code-action">Copy</div>
    </div>
  </div>
  <div class="code-container">
    <div class="line-numbers">
      <span>1</span>
      <span>2</span>
    </div>
    <div class="code-content">
      <div class="code-line"><span class="keyword">export</span> <span class="string">DOCKER_BUILDKIT=1</span></div>
      <div class="code-line">docker build -t myapp:latest .</div>
    </div>
  </div>
</div>

## Conclusion

By implementing these strategies—layer caching optimization, multi-stage builds, and BuildKit adoption—you can achieve significant reductions in Docker build times. In my projects, these techniques have consistently reduced build times by 40-60%, with some complex applications seeing even greater improvements.`
  },
  {
    file: 'kubernetes-resource-management.md',
    content: `---
title: Kubernetes Resource Management Strategies
date: 2025-03-28
tags: [kubernetes, devops]
---

# Kubernetes Resource Management Strategies

Effective resource management is crucial for running stable Kubernetes clusters. This post covers best practices for CPU, memory, and storage allocation.

## Resource Management Techniques

- Setting appropriate resource requests and limits
- Implementing horizontal pod autoscaling
- Using vertical pod autoscaling for stateful workloads
- Implementing pod disruption budgets

By properly managing your Kubernetes resources, you can ensure optimal performance while controlling costs.`
  },
  {
    file: 'github-actions-docker.md',
    content: `---
title: Setting Up GitHub Actions for Docker
date: 2025-03-21
tags: [github, automation]
---

# Setting Up GitHub Actions for Docker

This guide explains how to set up GitHub Actions workflows for building, testing, and deploying Docker containers.

## Workflow Configuration

We'll cover:
- Creating workflow files
- Setting up Docker build steps
- Configuring secrets for registry access
- Implementing automated tests
- Deploying to various environments

GitHub Actions provides powerful automation capabilities for containerized applications.`
  },
  {
    file: 'container-security.md',
    content: `---
title: Container Security Best Practices
date: 2025-03-15
tags: [security, containers]
---

# Container Security Best Practices

This post explores essential security practices for containerized applications in production environments.

## Key Security Measures

- Scanning for vulnerabilities in container images
- Implementing least privilege principles
- Network segmentation and policy controls
- Runtime security monitoring
- Secrets management

Implementing these security measures will help protect your containerized applications from common threats and vulnerabilities.`
  }
];

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
   * Initialize the post service by loading all posts
   *
   * @returns {Promise<void>}
   */
  async initialize(): Promise<void> {
    if (this.initialized) return;

    try {
      // In a production environment, this would be fetched from an API
      // For now, we're using the mock data defined above
      this.posts = POST_DATA.map(postData => {
        // Extract slug from filename (remove extension)
        const slug = postData.file.replace('.md', '');

        // Parse frontmatter and content
        const { data, content } = matter(postData.content);

        return {
          slug,
          title: data.title,
          date: new Date(data.date),
          tags: data.tags || [],
          content
        };
      });

      // Sort posts by date (newest first)
      this.posts.sort((a, b) => b.date.getTime() - a.date.getTime());
      this.initialized = true;

      // Add logging to track post initialization
      console.log(`PostService initialized with ${this.posts.length} posts:`);
      this.posts.forEach(post => {
        console.log(`- ${post.slug}: "${post.title}" (${post.tags.join(', ')})`);
      });
    } catch (error) {
      console.error('Failed to initialize post service:', error);
      throw error;
    }
  }

  /**
   * Get all posts
   *
   * @returns {Promise<Post[]>} Array of all posts, sorted by date
   */
  async getAllPosts(): Promise<Post[]> {
    await this.initialize();
    return this.posts;
  }

  /**
   * Get recent posts
   *
   * @param {number} count - Number of recent posts to retrieve
   * @returns {Promise<Post[]>} Array of recent posts
   */
  async getRecentPosts(count: number = 5): Promise<Post[]> {
    await this.initialize();
    return this.posts.slice(0, count);
  }

  /**
   * Get all unique tags from posts
   *
   * @returns {Promise<{tag: string, count: number}[]>} Array of tags with post counts
   */
  async getAllTags(): Promise<{tag: string, count: number}[]> {
    await this.initialize();

    const tagCounts: Record<string, number> = {};

    // Count occurrences of each tag
    this.posts.forEach(post => {
      post.tags.forEach(tag => {
        tagCounts[tag] = (tagCounts[tag] || 0) + 1;
      });
    });

    // Convert to array and sort by count (descending)
    return Object.entries(tagCounts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count);
  }

  /**
   * Get posts by tag
   *
   * @param {string} tag - Tag to filter by
   * @returns {Promise<Post[]>} Array of posts with the specified tag
   */
  async getPostsByTag(tag: string): Promise<Post[]> {
    await this.initialize();
    return this.posts.filter(post => post.tags.includes(tag));
  }

  /**
   * Get archive information by month
   *
   * @returns {Promise<{month: string, count: number}[]>} Array of months with post counts
   */
  async getArchiveByMonth(): Promise<{month: string, count: number}[]> {
    await this.initialize();

    const archiveCounts: Record<string, number> = {};

    // Group posts by month
    this.posts.forEach(post => {
      const month = post.date.toLocaleString('en-US', { month: 'long', year: 'numeric' });
      archiveCounts[month] = (archiveCounts[month] || 0) + 1;
    });

    // Convert to array and sort by date (newest first)
    return Object.entries(archiveCounts)
      .map(([month, count]) => ({ month, count }))
      .sort((a, b) => {
        // Parse month string back to date for sorting
        const dateA = new Date(a.month);
        const dateB = new Date(b.month);
        return dateB.getTime() - dateA.getTime();
      });
  }

  /**
   * Get a single post by slug
   *
   * @param {string} slug - Post slug to retrieve
   * @returns {Promise<Post|null>} The post or null if not found
   */
  async getPostBySlug(slug: string): Promise<Post | null> {
    await this.initialize();
    return this.posts.find(post => post.slug === slug) || null;
  }
}

// Export singleton instance
export const postService = new PostService();
