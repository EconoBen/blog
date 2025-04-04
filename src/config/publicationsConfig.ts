import { Publication } from '../types';

/**
 * Configuration for the Publications page
 */
export const publicationsConfig = {
  /**
   * Page title and description
   */
  title: "Publications",
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
    {
      id: "kubernetes-paper",
      type: "journal",
      title: "Efficient Resource Management in Kubernetes Clusters for Machine Learning Workloads",
      authors: "Benjamin Labaschin, Jane Smith, John Doe",
      venue: "Journal of Cloud Computing",
      date: "2023-05-15",
      abstract: "This paper presents a novel approach to resource management in Kubernetes clusters specifically optimized for machine learning workloads. We introduce an adaptive scheduler that dynamically allocates resources based on the computational phases of ML training jobs, resulting in 37% better GPU utilization and 28% faster training times compared to standard schedulers.",
      doi: "10.1234/jcc.2023.123456",
      pdfUrl: "/publications/kubernetes-ml-paper.pdf",
      topics: ["Kubernetes", "Cloud Computing", "Machine Learning", "Resource Management"],
      citations: 12,
      bibtex: `@article{labaschin2023efficient,
  title={Efficient Resource Management in Kubernetes Clusters for Machine Learning Workloads},
  author={Labaschin, Benjamin and Smith, Jane and Doe, John},
  journal={Journal of Cloud Computing},
  volume={8},
  number={2},
  pages={123--145},
  year={2023},
  publisher={Cloud Computing Society}
}`
    },
    {
      id: "microservices-paper",
      type: "conference",
      title: "From Monolith to Microservices: A Case Study in Refactoring Legacy Applications",
      authors: "Benjamin Labaschin, Alice Johnson",
      venue: "International Conference on Software Architecture (ICSA)",
      date: "2022-03-10",
      abstract: "This paper presents a systematic approach to refactoring monolithic applications into microservices architectures. Through a detailed case study of a large-scale enterprise application migration, we identify key patterns and anti-patterns in the refactoring process. Our incremental migration strategy reduced downtime by 95% compared to a complete rewrite approach.",
      url: "https://example.com/icsa2022",
      doi: "10.1145/3456789.1234567",
      pdfUrl: "/publications/microservices-case-study.pdf",
      topics: ["Microservices", "Software Architecture", "Legacy Systems", "Refactoring"],
      citations: 28,
      featured: true,
      bibtex: `@inproceedings{labaschin2022monolith,
  title={From Monolith to Microservices: A Case Study in Refactoring Legacy Applications},
  author={Labaschin, Benjamin and Johnson, Alice},
  booktitle={Proceedings of the International Conference on Software Architecture},
  pages={78--87},
  year={2022},
  organization={IEEE}
}`
    },
    {
      id: "devops-report",
      type: "report",
      title: "The State of DevOps Practices in Machine Learning Projects",
      authors: "Benjamin Labaschin, Technical Working Group",
      venue: "MLOps Foundation",
      date: "2022-11-20",
      abstract: "This industry report examines the current state of DevOps practices in machine learning projects. Based on a survey of 500+ organizations, we identify key challenges in implementing MLOps and provide recommendations for improving deployment pipelines, model versioning, and operational monitoring for ML systems in production.",
      url: "https://example.com/mlops-report-2022",
      pdfUrl: "/publications/mlops-report-2022.pdf",
      topics: ["DevOps", "MLOps", "Machine Learning", "Software Engineering"],
      bibtex: `@techreport{labaschin2022devops,
  title={The State of DevOps Practices in Machine Learning Projects},
  author={Labaschin, Benjamin and {Technical Working Group}},
  year={2022},
  institution={MLOps Foundation}
}`
    }
  ] as Publication[]
};
