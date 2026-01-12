export interface Publication {
  id: string;
  type: 'book' | 'journal' | 'conference' | 'report' | 'workshop' | 'other';
  title: string;
  authors: string;
  venue?: string;
  date: string;
  year: number;
  abstract?: string;
  url?: string;
  pdfUrl?: string;
  coverImage?: string;
  thumbnail?: string;
  doi?: string;
  topics: string[];
  featured?: boolean;
  bibtex?: string;
}

/**
 * Configuration for the Publications page
 */
export const publicationsConfig = {
  /**
   * Page title and description
   */
  title: "Publications, Whitepapers, and Articles",
  subtitle: "An assortment of articles, whitepapers, and books I've written",

  /**
   * Array of publications
   */
  publications: [
    {
      id: "managing-memory-for-ai-agents",
      type: "book" as const,
      title: "Managing Memory for AI Agents",
      authors: "Benjamin Labaschin, Jim Allen Wallace, Andrew Brookins, Manvinder Singh",
      venue: "O'Reilly Media",
      date: "2025-10-01",
      year: 2025,
      abstract: "As AI agents become increasingly essential to daily workflows, a major limitation on their usefulness is their inability to retain and meaningfully recall information across time. This report explores how the industry is transforming agent memory from a technical constraint into a strategic advantage. You'll learn to combine traditional data management with advanced retrieval tools—such as vector databases, semantic caching, importance scoring, and transactive memory systems—to enable agents to remember what matters.",
      url: "https://www.oreilly.com/library/view/managing-memory-for/9798341661257/",
      coverImage: "/posts/oreilly_managing_memory_ai_agents.png",
      thumbnail: "/posts/oreilly_managing_memory_ai_agents.png",
      topics: ["AI", "Agents", "Memory", "LLMs", "Vector Databases", "RAG"],
      featured: true,
      bibtex: `@book{labaschin2025memory,
  title={Managing Memory for AI Agents},
  author={Labaschin, Benjamin and Wallace, Jim Allen and Brookins, Andrew and Singh, Manvinder},
  year={2025},
  publisher={O'Reilly Media}
}`
    },
    {
      id: "extending_gpts_are_gpts_to_firms",
      type: "journal" as const,
      title: "Extending 'GPTs Are GPTs' to Firms",
      authors: "Benjamin Labaschin, Tyna Eloundou, Sam Manning, Pamela Mishkin, and Daniel Rock",
      venue: "American Economic Association: Papers and Proceedings",
      date: "2025-06-02",
      year: 2025,
      abstract: "A new paper on the impact of AI on labor demand at the firm level.",
      url: "https://www.aeaweb.org/articles?id=10.1257/pandp.20251045",
      coverImage: "/posts/thumbnails/extending_gpts.png",
      thumbnail: "/posts/thumbnails/extending_gpts.png",
      doi: "10.1257/pandp.20251045",
      topics: ["AI", "Economics", "Labor", "Productivity", "GPTs"],
      featured: true,
        bibtex: `@article{labaschin2025extending,
  title={Extending 'GPTs Are GPTs' to Firms},
  author={Benjamin Labaschin, Tyna Eloundou, Sam Manning, Pamela Mishkin, and Daniel Rock},
  journal={American Economic Association: Papers and Proceedings},
  year={2025}
}`
    },
    {
      id: "ai-agents-book",
      type: "book" as const,
      title: "What Are AI Agents? When and How to Use LLM Agents",
      authors: "Benjamin Labaschin",
      venue: "O'Reilly Media",
      date: "2023-11-01",
      year: 2023,
      abstract: "This report introduces AI agents, how they differ from large language models, and when to use them effectively. It provides a high-level overview of how AI agents are being applied in various domains, including document retrieval and coding assistance. The report also addresses critical questions about the nature of AI agents and discusses potential issues related to bias, legal considerations, and economic impacts.",
      url: "https://www.oreilly.com/library/view/what-are-ai/9781098159726/",
      coverImage: "/posts/oreilly_what_are_ai_agents.png",
      thumbnail: "/posts/oreilly_what_are_ai_agents.png",
      topics: ["AI", "LLM", "Agents", "Machine Learning"],
      featured: true,
      bibtex: `@book{labaschin2023aiagents,
  title={What Are AI Agents? When and How to Use LLM Agents},
  author={Labaschin, Benjamin},
  year={2023},
  publisher={O'Reilly Media}
}`
    },
    {
      id: "economics-shared-mobility-past",
      type: "report" as const,
      title: "The Economics of Shared Mobility: Past",
      authors: "Benjamin Labaschin",
      venue: "Arity, an Allstate Company",
      date: "2017-10-01",
      year: 2017,
      abstract: "This report explores the historical development and economic fundamentals of shared mobility services, examining how the industry has evolved and the key economic factors that shaped its growth.",
      pdfUrl: "/posts/The Economics of Shared Mobility Past.pdf",
      coverImage: "/posts/thumbnails/The Economics of Shared Mobility Past.png",
      thumbnail: "/posts/thumbnails/The Economics of Shared Mobility Past.png",
      topics: ["Economics", "Shared Mobility", "Transportation", "History"],
      featured: false
    },
    {
      id: "economics-shared-mobility-present-part1",
      type: "report" as const,
      title: "The Economics of Shared Mobility Series: Present Part 1",
      authors: "Benjamin Labaschin",
      venue: "Arity, an Allstate Company",
      date: "2017-11-01",
      year: 2017,
      abstract: "Part 1 of the analysis of current economic models in shared mobility, focusing on market structures, pricing strategies, and operational efficiencies in today's shared mobility landscape.",
      pdfUrl: "/posts/The Economics of Shared Mobility Series Present Part 1.pdf",
      coverImage: "/posts/thumbnails/The Economics of Shared Mobility Series Present Part 1.png",
      thumbnail: "/posts/thumbnails/The Economics of Shared Mobility Series Present Part 1.png",
      topics: ["Economics", "Shared Mobility", "Transportation", "Market Analysis"],
      featured: false
    },
    {
      id: "economics-shared-mobility-present-part2",
      type: "report" as const,
      title: "The Economics of Shared Mobility Series: Present Part 2",
      authors: "Benjamin Labaschin",
      venue: "Arity, an Allstate Company",
      date: "2017-11-20",
      year: 2017,
      abstract: "Part 2 continues the analysis of current shared mobility economics, delving deeper into consumer behavior, regulatory impacts, and competitive dynamics shaping today's market.",
      pdfUrl: "/posts/The Economics of Shared Mobility Present Part 2.pdf",
      coverImage: "/posts/thumbnails/The Economics of Shared Mobility Present Part 2.png",
      thumbnail: "/posts/thumbnails/The Economics of Shared Mobility Present Part 2.png",
      topics: ["Economics", "Shared Mobility", "Transportation", "Regulation"],
      featured: false
    },
    {
      id: "future-report",
      type: "report" as const,
      title: "The Economics of Shared Mobility: The Future of Shared Mobility",
      authors: "Benjamin Labaschin",
      venue: "Arity, an Allstate Company",
      date: "2018-01-15",
      year: 2018,
      abstract: "A forward-looking analysis of the future of shared mobility, exploring emerging technologies, potential business models, and economic implications for urban transportation systems in the coming decades.",
      pdfUrl: "/posts/Future Report.pdf",
      coverImage: "/posts/thumbnails/Future Report.png",
      thumbnail: "/posts/thumbnails/Future Report.png",
      topics: ["Economics", "Shared Mobility", "Transportation", "Future Trends", "Technology"],
      featured: false
    }
  ] as Publication[]
};