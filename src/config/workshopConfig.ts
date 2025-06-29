/**
 * Workshop configuration containing code snippets, scripts, and insights
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
  title: 'Workshop',
  subtitle: 'Code snippets, scripts, and insights I\'ve collected over the years. Feel free to use and adapt them for your own projects.',
  
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