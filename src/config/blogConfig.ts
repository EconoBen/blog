/**
 * Blog Configuration
 * Central place to manage global blog settings and content
 */

/**
 * Interface for a tech badge in the hero section
 */
interface TechBadge {
  /** Emoji or icon for the tech */
  icon: string;
  /** Name of the technology */
  name: string;
}

/**
 * Interface for hero section configuration
 */
interface HeroConfig {
  /** Array of title lines to be displayed with animation */
  titleLines: string[];
  /** Subtitle text */
  subtitle: string;
  /** Array of tech badges */
  techBadges: TechBadge[];
}

/**
 * Interface for overall blog configuration
 */
interface BlogConfig {
  /** Site title */
  siteTitle: string;
  /** Site description */
  siteDescription: string;
  /** Author name */
  author: string;
  /** Author email */
  email: string;
  /** Hero section configuration */
  hero: HeroConfig;
  /** Social media links */
  socialLinks: {
    github?: string;
    twitter?: string;
    linkedin?: string;
    bluesky?: string;
    email?: string;
  };
}

/**
 * Blog configuration object
 */
export const blogConfig: BlogConfig = {
  siteTitle: "Ben's Tech Blog",
  siteDescription: "Thoughts and tutorials on modern development practices",
  author: "Ben Labaschin",
  email: "benjaminlabaschindev@gmail.com",

  hero: {
    titleLines: [
      "Demystifying",
      "Modern Tech"
    ],
    subtitle: "Deep dives into containerization, cloud infrastructure, and DevOps practices",
    techBadges: [
      {
        icon: "🐳",
        name: "Docker"
      },
      {
        icon: "☸️",
        name: "Kubernetes"
      },
      {
        icon: "☁️",
        name: "Cloud"
      },
      {
        icon: "🔄",
        name: "CI/CD"
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
