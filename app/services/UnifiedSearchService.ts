import { postService } from '../../services/PostService';
import { gistItems } from '../../config/workshopGists';

export interface SearchResult {
  type: 'post' | 'talk' | 'publication' | 'code-ai';
  title: string;
  description?: string;
  url: string;
  date?: Date;
  tags?: string[];
  category?: string;
  authors?: string[];
}

interface Talk {
  title: string;
  event: string;
  date: string;
  location: string;
  type: string;
  description?: string;
  url?: string;
  presenters?: string[];
  slides?: string;
  video?: string;
  audio?: string;
  tags?: string[];
}

interface Publication {
  title: string;
  authors: string[];
  year: number;
  type: string;
  journal?: string;
  conference?: string;
  publisher?: string;
  pages?: string;
  doi?: string;
  url?: string;
  abstract?: string;
  tags?: string[];
}

// Sample talks data - in a real app, this would come from a database or JSON file
const talks: Talk[] = [
  {
    title: "AI and Machine Learning in Economics",
    event: "Economic Research Conference 2024",
    date: "2024-06-15",
    location: "Virtual",
    type: "conference",
    description: "Exploring the applications of AI in economic modeling and forecasting",
    tags: ["AI", "economics", "machine learning"],
  },
  // Add more talks as needed
];

// Sample publications data - in a real app, this would come from a database or JSON file
const publications: Publication[] = [
  {
    title: "Machine Learning Applications in Economic Forecasting",
    authors: ["Benjamin Labaschin", "Co-Author"],
    year: 2024,
    type: "journal",
    journal: "Journal of Economic Technology",
    tags: ["machine learning", "economics", "forecasting"],
  },
  // Add more publications as needed
];

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

    // Search talks
    talks.forEach(talk => {
      if (
        talk.title.toLowerCase().includes(searchTerm) ||
        talk.event.toLowerCase().includes(searchTerm) ||
        talk.description?.toLowerCase().includes(searchTerm) ||
        talk.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          type: 'talk',
          title: talk.title,
          description: `${talk.event} - ${talk.location}`,
          url: `/talks#${talk.title.toLowerCase().replace(/\s+/g, '-')}`,
          date: new Date(talk.date),
          tags: talk.tags,
        });
      }
    });

    // Search publications
    publications.forEach(pub => {
      if (
        pub.title.toLowerCase().includes(searchTerm) ||
        pub.authors.some(author => author.toLowerCase().includes(searchTerm)) ||
        pub.abstract?.toLowerCase().includes(searchTerm) ||
        pub.tags?.some(tag => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          type: 'publication',
          title: pub.title,
          description: `${pub.year} - ${pub.journal || pub.conference || pub.publisher}`,
          url: `/publications#${pub.title.toLowerCase().replace(/\s+/g, '-')}`,
          tags: pub.tags,
          authors: pub.authors,
        });
      }
    });

    // Search Code & Tools (workshop) items
    gistItems.forEach((item: any) => {
      if (
        item.title.toLowerCase().includes(searchTerm) ||
        item.description.toLowerCase().includes(searchTerm) ||
        item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          type: 'code-ai',
          title: item.title,
          description: item.description,
          url: `/code-ai/${item.slug}`,
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

    // Get suggestions from gist items
    gistItems.forEach((item: any) => {
      if (item.title.toLowerCase().includes(searchTerm)) {
        suggestions.add(item.title);
      }
    });

    // Convert to array and return top 5 suggestions
    return Array.from(suggestions).slice(0, 5);
  }
}

export const unifiedSearchService = new UnifiedSearchService();