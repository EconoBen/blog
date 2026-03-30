import { postService } from '../../services/PostService';
import { getCodeToolsItems, getCodeToolsUrl } from '../utils/codeTools';

export interface SearchResult {
  type: 'post' | 'talk' | 'publication' | 'code-ai' | 'tag';
  title: string;
  description?: string;
  url: string;
  date?: Date;
  tags?: string[];
  category?: string;
  authors?: string[];
  relatedCount?: number;
}

interface SearchOptions {
  includeCodeTools?: boolean;
  includeTagResults?: boolean;
  limit?: number;
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

const matchesQuery = (value: string | undefined, searchTerm: string) =>
  Boolean(value && value.toLowerCase().includes(searchTerm));

class UnifiedSearchService {
  async search(query: string, options: SearchOptions = {}): Promise<SearchResult[]> {
    if (!query || query.trim().length === 0) {
      return [];
    }

    const searchTerm = query.toLowerCase().trim();
    const results: SearchResult[] = [];
    const tagStats = new Map<string, { tag: string; count: number; latestDate?: Date }>();
    const includeCodeTools = options.includeCodeTools ?? true;
    const includeTagResults = options.includeTagResults ?? true;

    const registerTag = (tag: string, date?: Date) => {
      const normalizedTag = tag.trim();
      if (!normalizedTag) {
        return;
      }

      const key = normalizedTag.toLowerCase();
      const entry = tagStats.get(key) ?? { tag: normalizedTag, count: 0, latestDate: undefined };
      entry.count += 1;
      if (date && (!entry.latestDate || date > entry.latestDate)) {
        entry.latestDate = date;
      }
      tagStats.set(key, entry);
    };

    // Search blog posts
    const posts = await postService.getAllPosts();
    posts.forEach((post: any) => {
      const postDate = post.date ? new Date(post.date) : undefined;
      post.tags.forEach((tag: string) => registerTag(tag, postDate));

      if (
        matchesQuery(post.title, searchTerm) ||
        matchesQuery(post.summary, searchTerm) ||
        matchesQuery(post.slug, searchTerm) ||
        matchesQuery(post.content, searchTerm) ||
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
    talks.forEach((talk) => {
      const talkDate = new Date(talk.date);
      talk.tags?.forEach((tag) => registerTag(tag, talkDate));

      if (
        matchesQuery(talk.title, searchTerm) ||
        matchesQuery(talk.event, searchTerm) ||
        matchesQuery(talk.description, searchTerm) ||
        matchesQuery(talk.location, searchTerm) ||
        matchesQuery(talk.type, searchTerm) ||
        talk.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
      ) {
        results.push({
          type: 'talk',
          title: talk.title,
          description: `${talk.event} - ${talk.location}`,
          url: `/talks#${talk.title.toLowerCase().replace(/\s+/g, '-')}`,
          date: talkDate,
          tags: talk.tags,
        });
      }
    });

    // Search publications
    publications.forEach((pub) => {
      const publicationDate = new Date(`${pub.year}-01-01`);
      pub.tags?.forEach((tag) => registerTag(tag, publicationDate));

      if (
        matchesQuery(pub.title, searchTerm) ||
        matchesQuery(pub.journal, searchTerm) ||
        matchesQuery(pub.conference, searchTerm) ||
        matchesQuery(pub.publisher, searchTerm) ||
        matchesQuery(pub.abstract, searchTerm) ||
        matchesQuery(String(pub.year), searchTerm) ||
        pub.authors.some((author) => author.toLowerCase().includes(searchTerm)) ||
        pub.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
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

    const codeToolsItems = getCodeToolsItems();

    // Search Code & Tools items
    if (includeCodeTools) {
      codeToolsItems.forEach((item: any) => {
        const itemDate = item.date ? new Date(item.date) : undefined;
        item.tags?.forEach((tag: string) => registerTag(tag, itemDate));

        if (
          matchesQuery(item.title, searchTerm) ||
          matchesQuery(item.description, searchTerm) ||
          matchesQuery(item.category, searchTerm) ||
          item.tags.some((tag: string) => tag.toLowerCase().includes(searchTerm))
        ) {
          results.push({
            type: 'code-ai',
            title: item.title,
            description: item.description,
            url: getCodeToolsUrl(item.id),
            date: itemDate,
            tags: item.tags,
            category: item.category,
          });
        }
      });
    }

    if (includeTagResults) {
      tagStats.forEach((entry) => {
        if (!matchesQuery(entry.tag, searchTerm)) {
          return;
        }

        results.push({
          type: 'tag',
          title: entry.tag,
          description: `Used in ${entry.count} item${entry.count === 1 ? '' : 's'} across the site.`,
          url: `/tags/${encodeURIComponent(entry.tag)}`,
          date: entry.latestDate,
          tags: [entry.tag],
          relatedCount: entry.count,
        });
      });
    }

    // Sort results by relevance and date
    const typePriority: Record<SearchResult['type'], number> = {
      tag: 0,
      post: 1,
      publication: 2,
      talk: 3,
      'code-ai': 4,
    };

    const getMatchScore = (result: SearchResult) => {
      let score = 0;

      if (result.title.toLowerCase() === searchTerm) {
        score += 120;
      } else if (result.title.toLowerCase().includes(searchTerm)) {
        score += 80;
      }

      if (result.description?.toLowerCase().includes(searchTerm)) {
        score += 20;
      }

      if (result.category?.toLowerCase().includes(searchTerm)) {
        score += 15;
      }

      if (result.authors?.some((author) => author.toLowerCase().includes(searchTerm))) {
        score += 15;
      }

      if (result.tags?.some((tag) => tag.toLowerCase() === searchTerm)) {
        score += 25;
      } else if (result.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))) {
        score += 10;
      }

      if (result.type === 'tag') {
        score += 30;
      }

      return score;
    };

    results.sort((a, b) => {
      const scoreDelta = getMatchScore(b) - getMatchScore(a);
      if (scoreDelta !== 0) {
        return scoreDelta;
      }

      if (a.date && b.date) {
        return b.date.getTime() - a.date.getTime();
      }

      if (a.date && !b.date) {
        return -1;
      }

      if (!a.date && b.date) {
        return 1;
      }

      const typeDelta = typePriority[a.type] - typePriority[b.type];
      if (typeDelta !== 0) {
        return typeDelta;
      }

      return a.title.localeCompare(b.title);
    });

    return typeof options.limit === 'number' ? results.slice(0, options.limit) : results;
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
      item.tags?.forEach((tag: string) => {
        if (tag.toLowerCase().includes(searchTerm)) {
          suggestions.add(tag);
        }
      });
    });

    // Convert to array and return top 5 suggestions
    return Array.from(suggestions).slice(0, 5);
  }
}

export const unifiedSearchService = new UnifiedSearchService();
