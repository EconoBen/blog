import { Post, postService } from './PostService';
import { talksConfig } from '../config/talksConfig';
import { publicationsConfig } from '../config/publicationsConfig';
import { ContentType, SearchResult, Talk, Publication } from '../types';

/**
 * Service for unified search across all content types
 */
class UnifiedSearchService {
  /**
   * Search across all content types
   *
   * @param {string} query - Search query
   * @returns {Promise<SearchResult[]>} Combined search results from all sources
   */
  async search(query: string): Promise<SearchResult[]> {
    if (!query.trim()) {
      return [];
    }

    // Normalize the query
    const normalizedQuery = query.toLowerCase().trim();

    // Perform searches in parallel
    const [postResults, talkResults, publicationResults, archiveResults] = await Promise.all([
      this.searchPosts(normalizedQuery),
      this.searchTalks(normalizedQuery),
      this.searchPublications(normalizedQuery),
      this.searchArchives(normalizedQuery)
    ]);

    // Combine and sort results by date (newest first)
    return [...postResults, ...talkResults, ...publicationResults, ...archiveResults]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }

  /**
   * Search blog posts
   *
   * @param {string} normalizedQuery - Normalized search query
   * @returns {Promise<SearchResult[]>} Post search results
   */
  private async searchPosts(normalizedQuery: string): Promise<SearchResult[]> {
    const posts = await postService.searchPosts(normalizedQuery);

    return posts.map(post => this.mapPostToSearchResult(post));
  }

  /**
   * Map a Post to SearchResult format
   *
   * @param {Post} post - Post object
   * @returns {SearchResult} Formatted search result
   */
  private mapPostToSearchResult(post: Post): SearchResult {
    return {
      id: post.slug,
      title: post.title,
      type: 'post' as ContentType,
      date: post.date.toISOString(),
      description: this.getExcerpt(post.content, post.summary),
      url: `/posts/${post.slug}`,
      imageUrl: post.coverImage,
      metadata: {
        tags: post.tags,
        readingTime: this.calculateReadingTime(post.content)
      }
    };
  }

  /**
   * Search talks
   *
   * @param {string} normalizedQuery - Normalized search query
   * @returns {Promise<SearchResult[]>} Talk search results
   */
  private async searchTalks(normalizedQuery: string): Promise<SearchResult[]> {
    const talks = talksConfig.talks.filter(talk => {
      const titleMatch = talk.title.toLowerCase().includes(normalizedQuery);
      const descriptionMatch = talk.description.toLowerCase().includes(normalizedQuery);
      const topicsMatch = talk.topics.some(topic =>
        topic.toLowerCase().includes(normalizedQuery)
      );
      const eventMatch = talk.event.toLowerCase().includes(normalizedQuery);

      return titleMatch || descriptionMatch || topicsMatch || eventMatch;
    });

    return talks.map(talk => this.mapTalkToSearchResult(talk));
  }

  /**
   * Map a Talk to SearchResult format
   *
   * @param {Talk} talk - Talk object
   * @returns {SearchResult} Formatted search result
   */
  private mapTalkToSearchResult(talk: Talk): SearchResult {
    return {
      id: talk.id,
      title: talk.title,
      type: 'talk' as ContentType,
      date: talk.date,
      description: talk.description,
      url: `/talks#${talk.id}`,
      imageUrl: talk.thumbnail || `https://img.youtube.com/vi/${talk.youtubeId}/hqdefault.jpg`,
      metadata: {
        youtubeId: talk.youtubeId,
        event: talk.event,
        topics: talk.topics
      }
    };
  }

  /**
   * Search publications
   *
   * @param {string} normalizedQuery - Normalized search query
   * @returns {Promise<SearchResult[]>} Publication search results
   */
  private async searchPublications(normalizedQuery: string): Promise<SearchResult[]> {
    const publications = publicationsConfig.publications.filter(pub => {
      const titleMatch = pub.title.toLowerCase().includes(normalizedQuery);
      const abstractMatch = pub.abstract.toLowerCase().includes(normalizedQuery);
      const topicsMatch = pub.topics.some(topic =>
        topic.toLowerCase().includes(normalizedQuery)
      );
      const authorMatch = pub.authors.toLowerCase().includes(normalizedQuery);
      const venueMatch = pub.venue.toLowerCase().includes(normalizedQuery);
      const typeMatch = pub.type.toLowerCase().includes(normalizedQuery);

      return titleMatch || abstractMatch || topicsMatch || authorMatch || venueMatch || typeMatch;
    });

    return publications.map(publication => this.mapPublicationToSearchResult(publication));
  }

  /**
   * Map a Publication to SearchResult format
   *
   * @param {Publication} publication - Publication object
   * @returns {SearchResult} Formatted search result
   */
  private mapPublicationToSearchResult(publication: Publication): SearchResult {
    const url = publication.url || publication.pdfUrl || `/publications#${publication.id}`;

    return {
      id: publication.id,
      title: publication.title,
      type: 'publication' as ContentType,
      date: publication.date,
      description: publication.abstract,
      url,
      imageUrl: publication.coverImage,
      metadata: {
        type: publication.type,
        authors: publication.authors,
        venue: publication.venue,
        topics: publication.topics,
        featured: publication.featured || false
      }
    };
  }

  /**
   * Search archive content
   *
   * @param {string} normalizedQuery - Normalized search query
   * @returns {Promise<SearchResult[]>} Archive search results
   */
  private async searchArchives(normalizedQuery: string): Promise<SearchResult[]> {
    // For archives, we'll search through posts but format them as archive entries
    // This is because archives are typically just monthly groupings of posts
    const posts = await postService.searchPosts(normalizedQuery);
    const archiveMonths = new Map<string, Post[]>();

    // Group posts by month
    posts.forEach(post => {
      const monthYear = post.date.toLocaleDateString('en-US', {
        month: 'long',
        year: 'numeric'
      });

      if (!archiveMonths.has(monthYear)) {
        archiveMonths.set(monthYear, []);
      }

      archiveMonths.get(monthYear)?.push(post);
    });

    // Convert to search results
    return Array.from(archiveMonths.entries()).map(([month, posts]) => {
      const encodedMonth = encodeURIComponent(month);
      const oldestPost = posts.reduce((a, b) => (a.date < b.date ? a : b));

      return {
        id: encodedMonth,
        title: `Archive: ${month}`,
        type: 'archive' as ContentType,
        date: oldestPost.date.toISOString(),
        description: `${posts.length} posts from ${month}`,
        url: `/archives/${encodedMonth}`,
        metadata: {
          postCount: posts.length,
          posts: posts.map(p => p.title)
        }
      };
    });
  }

  /**
   * Get excerpt from post content, preferring the summary field if available
   *
   * @param {string} content - Post content
   * @param {string} [summary] - Optional summary from frontmatter
   * @returns {string} Excerpt for display
   */
  private getExcerpt(content: string, summary?: string): string {
    // If a summary is provided in frontmatter, use it
    if (summary && summary.trim()) {
      return summary.length <= 150 ? summary : summary.substring(0, 147) + '...';
    }

    // Fallback to first paragraph if no summary is available
    const firstParagraph = content.split('\n\n')[0];
    if (firstParagraph.length <= 150) {
      return firstParagraph;
    }
    return firstParagraph.substring(0, 147) + '...';
  }

  /**
   * Calculate estimated reading time based on content length
   *
   * @param {string} content - Post content
   * @returns {number} Estimated reading time in minutes
   */
  private calculateReadingTime(content: string): number {
    const wordsPerMinute = 200; // Average reading speed
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  }
}

// Create and export singleton instance
export const unifiedSearchService = new UnifiedSearchService();
