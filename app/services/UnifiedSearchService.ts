import { postService } from '../../services/PostService';
import { getCodeToolsItems, getCodeToolsUrl } from '../utils/codeTools';
import { talksConfig } from '../config/talksConfig';
import { publicationsConfig } from '../config/publicationsConfig';

export interface SearchResult {
  type: 'tag' | 'post' | 'talk' | 'publication' | 'code-ai';
  title: string;
  description?: string;
  url: string;
  date?: Date;
  tags?: string[];
  category?: string;
  authors?: string[];
  relatedCount?: number;
}

class UnifiedSearchService {
  async search(query: string): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];

    // Search blog posts
    const posts = await postService.getAllPosts();
    posts.forEach((post: any) => {
      if (
        post.title.toLowerCase().includes(searchTerm) ||
        post.content.toLowerCase().includes(searchTerm) ||
        post.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          type: 'post',
          title: post.title,
          description: post.summary,
          url: `/posts/${post.slug}`,
          date: post.date,
          tags: post.tags,
        });
      }
    });

    // Search talks (from real config data)
    talksConfig.talks.forEach(talk => {
      if (
        talk.title.toLowerCase().includes(searchTerm) ||
        talk.event.toLowerCase().includes(searchTerm) ||
        talk.description?.toLowerCase().includes(searchTerm) ||
        talk.topics?.some(topic => topic.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          type: 'talk',
          title: talk.title,
          description: `${talk.event}`,
          url: `/talks#${talk.id}`,
          date: new Date(talk.date),
          tags: talk.topics,
        });
      }
    });

    // Search publications (from real config data)
    publicationsConfig.publications.forEach(pub => {
      if (
        pub.title.toLowerCase().includes(searchTerm) ||
        pub.authors.toLowerCase().includes(searchTerm) ||
        pub.abstract?.toLowerCase().includes(searchTerm) ||
        pub.topics?.some(topic => topic.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          type: 'publication',
          title: pub.title,
          description: `${pub.year} - ${pub.venue || ''}`,
          url: `/publications#${pub.id}`,
          tags: pub.topics,
          authors: [pub.authors],
        });
      }
    });

    const codeToolsItems = getCodeToolsItems();

    // Search Code & Tools items
    codeToolsItems.forEach((item: any) => {
      if (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          type: 'code-ai',
          title: item.title,
          description: item.description,
          url: getCodeToolsUrl(item.id),
          date: item.date ? new Date(item.date) : undefined,
          tags: item.tags,
          category: item.category,
        });
      }
    });

    // Sort results by relevance and date
    results.sort((a, b) => {
      // Prioritize title matches
      const aInTitle = a.title.toLowerCase().includes(searchTerm);
      const bInTitle = b.title.toLowerCase().includes(searchTerm);
      if (aInTitle && !bInTitle) return -1;
      if (!aInTitle && bInTitle) return 1;

      // Then sort by date (newest first)
      if (a.date && b.date) {
        return b.date.getTime() - a.date.getTime();
      }
      return 0;
    });

    return results;
  }

  async getSuggestions(query: string): Promise<string[]> {
    if (!query || query.trim().length < 2) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const suggestions = new Set<string>();
    const codeToolsItems = getCodeToolsItems();

    // Get suggestions from post titles and tags
    const posts = await postService.getAllPosts();
    posts.forEach((post: any) => {
      if (post.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(post.title);
      }
      post.tags.forEach((tag: string) => {
        if (tag.toLowerCase().includes(searchTerm)) {
          suggestions.add(tag);
        }
      });
    });

    // Get suggestions from code tools items
    codeToolsItems.forEach((item: any) => {
      if (item.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(item.title);
      }
    });

    // Convert to array and return top 5 suggestions
    return Array.from(suggestions).slice(0, 5);
  }
}

export const unifiedSearchService = new UnifiedSearchService();
