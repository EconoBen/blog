import { Publication } from '../types';

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
      id: "ai-agents-book",
      type: "book",
      title: "What Are AI Agents? When and How to Use LLM Agents",
      authors: "Benjamin Labaschin",
      venue: "O'Reilly Media",
      date: "2023-11-01",
      abstract: "This report introduces AI agents, how they differ from large language models, and when to use them effectively. It provides a high-level overview of how AI agents are being applied in various domains, including document retrieval and coding assistance. The report also addresses critical questions about the nature of AI agents and discusses potential issues related to bias, legal considerations, and economic impacts.",
      url: "https://www.oreilly.com/library/view/what-are-ai/9781098159726/",
      coverImage: "/posts/oreilly_what_are_ai_agents.png",
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
      type: "report",
      title: "The Economics of Shared Mobility: Past",
      authors: "Benjamin Labaschin",
      venue: "Arity, an Allstate Company",
      date: "2017-10-01",
      abstract: "This report explores the historical development and economic fundamentals of shared mobility services, examining how the industry has evolved and the key economic factors that shaped its growth.",
      pdfUrl: "/posts/The Economics of Shared Mobility Past.pdf",
      coverImage: "/posts/thumbnails/The Economics of Shared Mobility Past.png",
      topics: ["Economics", "Shared Mobility", "Transportation", "History"],
      featured: false
    },
    {
      id: "economics-shared-mobility-present-part1",
      type: "report",
      title: "The Economics of Shared Mobility Series: Present Part 1",
      authors: "Benjamin Labaschin",
      venue: "Arity, an Allstate Company",
      date: "2017-11-01",
      abstract: "Part 1 of the analysis of current economic models in shared mobility, focusing on market structures, pricing strategies, and operational efficiencies in today's shared mobility landscape.",
      pdfUrl: "/posts/The Economics of Shared Mobility Series Present Part 1.pdf",
      coverImage: "/posts/thumbnails/The Economics of Shared Mobility Series Present Part 1.png",
      topics: ["Economics", "Shared Mobility", "Transportation", "Market Analysis"],
      featured: false
    },
    {
      id: "economics-shared-mobility-present-part2",
      type: "report",
      title: "The Economics of Shared Mobility Series: Present Part 2",
      authors: "Benjamin Labaschin",
      venue: "Arity, an Allstate Company",
      date: "2017-11-20",
      abstract: "Part 2 continues the analysis of current shared mobility economics, delving deeper into consumer behavior, regulatory impacts, and competitive dynamics shaping today's market.",
      pdfUrl: "/posts/The Economics of Shared Mobility Present Part 2.pdf",
      coverImage: "/posts/thumbnails/The Economics of Shared Mobility Present Part 2.png",
      topics: ["Economics", "Shared Mobility", "Transportation", "Regulation"],
      featured: false
    },
    {
      id: "future-report",
      type: "report",
      title: "The Economics of Shared Mobility: The Future of Shared Mobility",
      authors: "Benjamin Labaschin",
      venue: "Arity, an Allstate Company",
      date: "2017-01-10",
      abstract: "An in-depth analysis of emerging trends and future projections for various industries, with particular focus on technological innovations and their economic implications.",
      pdfUrl: "/posts/Future Report.pdf",
      coverImage: "/posts/thumbnails/Future Report.png",
      topics: ["Future Studies", "Technology", "Economics", "Economic Theory", "Trends"],
      featured: false
    }
  ] as Publication[]
};
