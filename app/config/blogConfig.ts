interface TechBadge {
  icon: string;
  name: string;
}

interface HeroConfig {
  titleLines: string[];
  subtitle: string;
  techBadges: TechBadge[];
}

interface BlogConfig {
  siteTitle: string;
  siteDescription: string;
  author: string;
  email: string;
  hero: HeroConfig;
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    bluesky?: string;
    email?: string;
  };
}

export const blogConfig: BlogConfig = {
  siteTitle: "Economic Notes",
  siteDescription: "Exploring the intersection of economics, technology, and artificial intelligence",
  author: "Benjamin Labaschin",
  email: "benjaminlabaschindev@gmail.com",

  hero: {
    titleLines: [
      "Economic Notes",
      "Tech & AI Insights"
    ],
    subtitle: "Deep dives into economics, machine learning, and modern development practices",
    techBadges: [
      {
        icon: "📊",
        name: "Economics"
      },
      {
        icon: "🤖",
        name: "AI/ML"
      },
      {
        icon: "☁️",
        name: "Cloud"
      },
      {
        icon: "🔄",
        name: "DevOps"
      }
    ]
  },

  socialLinks: {
    github: "https://github.com/econoben",
    linkedin: "https://linkedin.com/in/benjamin-labaschin",
    bluesky: "https://bsky.app/profile/econoben.dev",
    email: "mailto:benjaminlabaschin@gmail.com"
  }
};