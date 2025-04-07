import { Publication } from '../types';

/**
 * Configuration for the Publications page
 */
export const publicationsConfig = {
  /**
   * Page title and description
   */
  title: "Publications and Whitepapers",
  subtitle: "Books, journal articles, and peer-reviewed conference papers",

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

  ] as Publication[]
};
