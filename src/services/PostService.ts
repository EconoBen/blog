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
 * Mock post data to use in browser environment
 */
const MOCK_POSTS: Post[] = [
  {
    slug: 'optimizing-docker-build-pipelines',
    title: 'Optimizing Docker Build Pipelines for CI/CD',
    date: new Date('2025-04-02'),
    tags: ['docker', 'cicd', 'performance'],
    content: `
After analyzing build times across several projects, I've identified key optimization
strategies that significantly reduce Docker image build times without compromising quality. These approaches
are particularly valuable in CI/CD pipelines where every second of build time impacts developer productivity
and infrastructure costs.

## Layer Caching Strategy

The most impactful improvement comes from proper layer caching. By organizing your \`Dockerfile\` to place rarely changed instructions at the top
and frequently modified code at the bottom, you can maximize cache utilization.

\`\`\`dockerfile
# Place rarely changing instructions at the top
FROM node:16-alpine
WORKDIR /app

# Dependencies change less frequently than code
COPY package*.json ./
RUN npm ci

# Application code changes most frequently - keep at bottom
COPY . .
RUN npm run build
\`\`\`

This ordering ensures that changes to your application code don't invalidate the cached layers for dependency
installation, which is typically the most time-consuming part of the build process.

## Multi-Stage Builds

Multi-stage builds provide another dimension of optimization, separating build dependencies from runtime
requirements. This approach creates smaller, more secure production images by discarding unnecessary build
tools and intermediate files.

\`\`\`dockerfile
# Build stage
FROM node:16-alpine AS build
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

# Production stage
FROM nginx:alpine
COPY --from=build /app/dist /usr/share/nginx/html
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
\`\`\`

In this example, the build tools, node_modules, and source code remain in the build stage, while only the
compiled artifacts are copied to the production image, resulting in a dramatically smaller footprint.

## BuildKit Optimizations

Modern Docker installations include BuildKit, which offers several performance improvements over the legacy builder:

- Concurrent dependency resolution
- More efficient caching with content-addressable storage
- Automatic garbage collection of unused cache
- Build secrets without leaving them in the image layers

Enable BuildKit by setting the \`DOCKER_BUILDKIT=1\` environment variable before your build
commands:

\`\`\`bash
export DOCKER_BUILDKIT=1
docker build -t myapp:latest .
\`\`\`

## CI Integration Tips

When integrating these optimizations into CI systems, consider these additional strategies:

Implement dedicated cache storage solutions to maintain layer caches between builds. Most CI providers offer
options for this:

\`\`\`yaml
jobs:
 build:
 runs-on: ubuntu-latest
 steps:
 - uses: actions/checkout@v3

 - name: Set up Docker Buildx
 uses: docker/setup-buildx-action@v2

 - name: Build and push
 uses: docker/build-push-action@v3
 with:
 context: .
 push: false
 cache-from: type=gha
 cache-to: type=gha,mode=max
\`\`\`

## Conclusion

By implementing these strategies—layer caching optimization, multi-stage builds, BuildKit adoption, and
CI-specific caching—you can achieve significant reductions in Docker build times. In my projects, these
techniques have consistently reduced build times by 40-60%, with some complex applications seeing even greater
improvements.

These optimizations not only speed up your CI/CD pipeline but also reduce resource consumption and
infrastructure costs while improving developer productivity. Remember that the specific impact will vary based
on your application's complexity, but the principles apply universally to Docker-based workflows.
`
  },
  {
    slug: 'react-performance-optimization',
    title: 'Advanced React Performance Optimization Techniques',
    date: new Date('2025-03-15'),
    tags: ['react', 'javascript', 'performance'],
    content: `
# Advanced React Performance Optimization Techniques

React applications can suffer from performance issues as they grow in size and complexity. Here are some advanced techniques to optimize your React applications.

## Memoization with React.memo, useMemo, and useCallback

Using memoization techniques can prevent unnecessary re-renders of components or recalculation of expensive values.

\`\`\`jsx
// Using React.memo to prevent unnecessary re-renders
const MemoizedComponent = React.memo(function MyComponent(props) {
  /* render using props */
});

// Using useMemo to cache expensive calculations
const memoizedValue = useMemo(() => {
  return computeExpensiveValue(a, b);
}, [a, b]);

// Using useCallback to memoize callback functions
const memoizedCallback = useCallback(() => {
  doSomething(a, b);
}, [a, b]);
\`\`\`

## Code Splitting with React.lazy and Suspense

Code splitting allows you to break up your code into smaller chunks which are loaded on demand.

\`\`\`jsx
import React, { Suspense, lazy } from 'react';

// Lazy load a component
const LazyComponent = lazy(() => import('./LazyComponent'));

function MyComponent() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <LazyComponent />
    </Suspense>
  );
}
\`\`\`

## Virtualization for Long Lists

When rendering long lists, virtualization can significantly improve performance by only rendering items currently in view.

\`\`\`jsx
import { FixedSizeList } from 'react-window';

function MyList({ items }) {
  const Row = ({ index, style }) => (
    <div style={style}>
      {items[index]}
    </div>
  );

  return (
    <FixedSizeList
      height={500}
      width={300}
      itemSize={50}
      itemCount={items.length}
    >
      {Row}
    </FixedSizeList>
  );
}
\`\`\`

## Debouncing and Throttling Event Handlers

For handlers attached to frequently firing events like scroll or resize, debouncing or throttling can reduce the number of calls.

\`\`\`jsx
import { useEffect, useState } from 'react';
import { debounce } from 'lodash';

function SearchComponent() {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  // Debounced search function
  const debouncedSearch = debounce(async (term) => {
    const data = await fetchSearchResults(term);
    setResults(data);
  }, 500);

  useEffect(() => {
    if (searchTerm) {
      debouncedSearch(searchTerm);
    }

    // Cleanup
    return () => {
      debouncedSearch.cancel();
    };
  }, [searchTerm, debouncedSearch]);

  return (
    <div>
      <input
        type="text"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        placeholder="Search..."
      />
      {/* Render results */}
    </div>
  );
}
\`\`\`

## Using Web Workers for CPU-Intensive Tasks

Move CPU-intensive operations off the main thread using Web Workers.

\`\`\`jsx
import { useState } from 'react';

function CPUIntensiveComponent() {
  const [result, setResult] = useState(null);

  const startCalculation = () => {
    const worker = new Worker('./calculationWorker.js');

    worker.onmessage = (e) => {
      setResult(e.data);
      worker.terminate();
    };

    worker.postMessage({ data: 'calculation parameters' });
  };

  return (
    <div>
      <button onClick={startCalculation}>Start Calculation</button>
      {result && <div>Result: {result}</div>}
    </div>
  );
}
\`\`\`

By applying these techniques strategically in your React applications, you can achieve significant performance improvements and provide a smoother user experience.
`
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
      // Use mock data instead of file system
      this.posts = MOCK_POSTS;
      this.initialized = true;
      console.log(`Loaded ${this.posts.length} posts from mock data`);
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
