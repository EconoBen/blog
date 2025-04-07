import { Talk } from '../types';

/**
 * Configuration for the Talks page
 */
export const talksConfig = {
  /**
   * Page title and description
   */
  title: "Conference Talks, Presentations, and Live Streams",
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
    },
    {
      id: "talk-building-a-rag-model",
      title: "Building a RAG Model",
      description: "A step-by-step walkthrough for self-hosting a private large language model and retrieval-augmented generation (RAG) system using Synology NAS, Tailscale, Caddy, and Ollama. This guide covers setting up a reverse proxy, integrating Twitch stream alerts with Discord, and accessing your AI stack remotely and securely—no cloud costs, no open ports.",
      date: "2024-02-25",
      youtubeId: "tNJg1KJJrTk",
      event: "Twitch Stream",
      topics: [
        "LLMs",
        "RAG",
        "Self-Hosting",
        "Tailscale",
        "Caddy",
        "Synology",
        "Ollama",
        "Docker",
        "DevOps",
        "Discord",
        "Twitch"
      ]
    },
    {
      id: "stream-java-dsa-from-scratch",
      title: "Learning Java Together | Data Structures & Algorithms | Practicing Array Fundamentals (Live Stream)",
      description: "A live coding session exploring the basics of Java programming and core data structures like arrays and matrices, with a focus on problem-solving and self-taught learning. Along the way, Ben breaks down for-loops, memory allocation, static vs dynamic arrays, and walks through solving a real coding challenge: removing even numbers from an array. This is part of a broader initiative to fill in the gaps of a self-taught background and encourage others to do the same.",
      date: "2024-02-19",
      youtubeId: "-9CCDqSwuvA",
      event: "Twitch Stream",
      topics: [
        "Java",
        "Data Structures",
        "Arrays",
        "Memory",
        "Static vs Dynamic",
        "For Loops",
        "Live Coding",
        "CS Fundamentals",
        "Debugging"
      ]
    },
    {
      id: "stream-java-linked-lists-and-cycle-detection",
      title: "Learning Java Together | Data Structures & Algorithms | Linked Lists - Coding Practice |(Live Stream)",
      description: "A deep dive into Java's linked list data structure and the Floyd's Cycle Detection algorithm using fast and slow pointers. A walk-through on how to build a linked list from scratch, exploring how nodes are appended, and debug-traces the creation of head-insertion logic. This stream transitions into a code walkthrough of detecting cycles in a linked list and reflects on debugging strategies, generic types, and practical Java syntax—all through hands-on experimentation and learning.",
      date: "2024-02-26",
      youtubeId: "AvcN5FrvNmk",
      event: "Twitch Stream",
      topics: [
        "Java",
        "Data Structures",
        "Linked Lists",
        "Cycle Detection",
        "Floyd's Algorithm",
        "Debugging",
        "Generics",
        "Live Coding",
        "CS Fundamentals"
  ]
},
    {
      id: "stream-java-array-merge-and-two-sum",
      title: "Learning Java Together | Data Structures & Algorithms | Merging Sorted Arrays and Solving Two Sum in Java (Live Stream)",
      description: "This livestream session explores two classic coding problems in Java: merging two sorted arrays and solving the Two Sum problem. The stream includes detailed walkthroughs of each solution, emphasizes the use of test-driven development, and demonstrates how to manage iteration, edge cases, and debugging in Java. Designed as part of an ongoing effort to practice algorithms and data structures live.",
      date: "2024-02-25",
      youtubeId: "oHpWcOQbpQk",
      event: "Twitch Stream",
      topics: [
        "Java",
        "Algorithms",
        "Merging Arrays",
        "Two Sum",
        "Data Structures",
        "Edge Cases",
        "Test-Driven Development",
        "Debugging",
        "Live Coding"
      ]
    },
    {
      id: "stream-java-linked-list-practice",
      title: "Learning Java Together | Data Structures & Algorithms | Implementing Linked Lists in Java: Fundamentals and Traversal (Live Stream)",
      description: "This session focuses on building a singly linked list in Java from the ground up. Viewers are introduced to defining a `Node` class, constructing linked list elements, implementing the `appendToTail` method, and writing logic to traverse and print the list. The stream explores Java syntax, object-oriented design, and debugging techniques while relating key concepts to Python for context.",
      date: "2024-03-01",
      youtubeId: "xSFrXbl_J6o",
      event: "Twitch Stream",
      topics: [
        "Java",
        "Linked Lists",
        "Singly Linked List",
        "Data Structures",
        "Object-Oriented Programming",
        "Debugging",
        "Cracking the Coding Interview",
        "Live Coding",
        "Learning in Public"
      ]
    }
  ] as Talk[]
};
