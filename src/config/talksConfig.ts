import { Talk } from '../types';

/**
 * Configuration for the Talks page
 */
export const talksConfig = {
  /**
   * Page title and description
   */
  title: "Conference Talks & Presentations",
  subtitle: "A collection of my conference talks, workshops, and presentations on tech topics.",

  /**
   * Array of talks
   */
  talks: [
    {
      id: "talk-validating-llm-outputs",
      title: "A Normie Approach to Validating LLM Outputs (AI.Science Talk)",
      description: "A practical walkthrough of how to handle messy, stochastic LLM responses—especially from local or quantized models—using cheap and reliable techniques like Pydantic validation and while loops. Includes a demo chatbot built on quantized LLaMA 2 and how to enforce predictable JSON responses from unpredictable models.",
      date: "2023-12-16",
      youtubeId: "xbXEE7pqwMI",
      event: "AI.Science",
      topics: ["AI", "LLM", "Validation", "Pydantic", "Agents", "Open Source", "Prompt Engineering"]
    },
    {
      id: "talk-building-https-model-api-for-cheap",
      title: "Building an HTTPS Model API for Cheap: AWS, Docker, and the Normconf API",
      description: "A candid walkthrough of building a production-grade conference API under time constraints—covering tool choices, trade-offs, and cloud deployment pain points. This talk frames fast API development as a metaphor for time management and argues for using 'Normie' software: tools that do what they say, are worth investing in, and are easy to pick up.",
      date: "2022-12-19",
      youtubeId: "DRGxjfLVrTA",
      event: "Normconf",
      topics: ["AWS", "Docker", "GitHub Actions","FastAPI", "APIs", "DevOps", "Cloud", "Software Engineering"]
    },
    {
      id: "talk-building-with-ai-llms-wharton",
      title: "Building With AI: How I Build Quick POCs with LLMs (Wharton Guest Lecture)",
      description: "A practical, high-energy lecture on building a workforce optimization platform from scratch using public datasets, synthetic org data, and large language models. The talk blends AI, economics, and personal career advice, showing how LLMs can supercharge idea validation and simulation—even without real data. A call to action for students to build, iterate, and grow through creation.",
      date: "2024-04-17",
      youtubeId: "SnvaIFlZ3gI",
      event: "Wharton Guest Lecture",
      topics: [
        "LLMs",
        "Generative AI",
        "GenAi",
        "Embeddings",
        "Optimization",
        "Synthetic Data",
        "Workforce Planning",
        "Python",
        "FastAPI",
        "Careers",
      ]
    }
  ] as Talk[]
};
