/**
 * Code & AI configuration containing code snippets, ML/AI insights, and productivity tools
 */

export interface WorkshopItem {
  id: string;
  title: string;
  description: string;
  category: string;
  tags: string[];
  language?: string;
  content: string;
  date: Date;
  featured?: boolean;
  gistUrl?: string;
  gistId?: string;
  filename?: string;
}

export const workshopConfig = {
  title: 'Code & AI',
  subtitle: 'Code snippets, ML/AI insights, and productivity tools I\'ve collected. From shell scripts to neural networks - practical solutions for developers and researchers.',
  
  categories: [
    { id: 'all', label: 'All', icon: '🔧' },
    { id: 'data-science', label: 'Data Science', icon: '📊' },
    { id: 'devops', label: 'DevOps', icon: '🚀' },
    { id: 'shell', label: 'Shell', icon: '🐚' },
    { id: 'python', label: 'Python', icon: '🐍' },
    { id: 'git', label: 'Git', icon: '📦' },
    { id: 'productivity', label: 'Productivity', icon: '⚡' },
  ],

  items: [] as WorkshopItem[]
};