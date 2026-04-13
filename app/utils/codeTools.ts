import { workshopConfig, type WorkshopItem } from '../config/workshopConfig';
import { gistItems } from '../config/workshopGists';

export type CodeToolsItem = WorkshopItem;

const codeToolsItems: CodeToolsItem[] = [...workshopConfig.items, ...gistItems];

export const codeToolsCategories = workshopConfig.categories;

const languageMap: Record<string, string> = {
  js: 'javascript',
  ts: 'typescript',
  py: 'python',
  rb: 'ruby',
  sh: 'bash',
  shell: 'bash',
  zsh: 'bash',
  yml: 'yaml',
  dockerfile: 'docker',
  text: 'plaintext',
  txt: 'plaintext',
  code: 'plaintext',
  toml: 'toml',
  gitconfig: 'ini',
  ini: 'ini',
  conf: 'ini',
  cfg: 'ini',
};

const displayLanguageNames: Record<string, string> = {
  javascript: 'JavaScript',
  typescript: 'TypeScript',
  python: 'Python',
  bash: 'Bash',
  shell: 'Shell',
  json: 'JSON',
  yaml: 'YAML',
  markdown: 'Markdown',
  css: 'CSS',
  html: 'HTML',
  sql: 'SQL',
  go: 'Go',
  rust: 'Rust',
  java: 'Java',
  csharp: 'C#',
  cpp: 'C++',
  c: 'C',
  ruby: 'Ruby',
  php: 'PHP',
  swift: 'Swift',
  kotlin: 'Kotlin',
  docker: 'Dockerfile',
  plaintext: 'Text',
  toml: 'TOML',
  ini: 'INI',
};

export const normalizeCodeToolsLanguage = (lang?: string): string => {
  if (!lang) {
    return 'plaintext';
  }

  const lowered = lang.toLowerCase();
  return languageMap[lowered] || lowered;
};

export const getCodeToolsLanguageLabel = (lang?: string): string => {
  const normalized = normalizeCodeToolsLanguage(lang);
  return displayLanguageNames[normalized] || normalized.charAt(0).toUpperCase() + normalized.slice(1);
};

export const formatCodeToolsDate = (date: Date | string | undefined, options?: Intl.DateTimeFormatOptions): string => {
  if (!date) {
    return '';
  }

  return new Date(date).toLocaleDateString(
    'en-US',
    options ?? {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    },
  );
};

export const getCodeToolsCategoryMeta = (categoryId: string) => {
  return codeToolsCategories.find((category) => category.id === categoryId);
};

export const getCodeToolsCategoryCounts = (items: CodeToolsItem[] = codeToolsItems): Record<string, number> => {
  return items.reduce<Record<string, number>>((counts, item) => {
    counts[item.category] = (counts[item.category] ?? 0) + 1;
    return counts;
  }, {});
};

export const getCodeToolsFeaturedItems = (items: CodeToolsItem[] = codeToolsItems): CodeToolsItem[] => {
  return [...items]
    .filter((item) => item.featured)
    .sort((a, b) => {
      const dateA = a.date ? new Date(a.date).getTime() : 0;
      const dateB = b.date ? new Date(b.date).getTime() : 0;
      return dateB - dateA;
    });
};

export const getCodeToolsItemLineCount = (item: CodeToolsItem): number => {
  return item.content.split(/\r?\n/).length;
};

export const getCodeToolsRelatedItems = (item: CodeToolsItem, limit = 3): CodeToolsItem[] => {
  const itemTags = new Set(item.tags.map((tag) => tag.toLowerCase()));

  return codeToolsItems
    .filter((candidate) => candidate.id !== item.id)
    .map((candidate) => {
      const sharedTags = candidate.tags.filter((tag) => itemTags.has(tag.toLowerCase())).length;
      const categoryMatch = candidate.category === item.category ? 3 : 0;
      const featuredBonus = candidate.featured ? 1 : 0;
      const recency = candidate.date ? new Date(candidate.date).getTime() : 0;

      return {
        candidate,
        score: sharedTags * 4 + categoryMatch + featuredBonus + recency / 1e15,
      };
    })
    .sort((a, b) => b.score - a.score)
    .slice(0, limit)
    .map(({ candidate }) => candidate);
};

export const getCodeToolsItems = (): CodeToolsItem[] => {
  return [...codeToolsItems].sort((a, b) => {
    const dateA = a.date ? new Date(a.date).getTime() : 0;
    const dateB = b.date ? new Date(b.date).getTime() : 0;
    return dateB - dateA;
  });
};

export const getCodeToolsItemById = (id: string): CodeToolsItem | undefined => {
  return codeToolsItems.find((item) => item.id === id);
};

export const getCodeToolsStaticParams = (): Array<{ id: string }> => {
  return codeToolsItems.map((item) => ({ id: item.id }));
};

export const getCodeToolsLatestDate = (): Date => {
  const latest = codeToolsItems.reduce((currentLatest, item) => {
    const itemDate = item.date ? new Date(item.date) : null;

    if (!itemDate) {
      return currentLatest;
    }

    if (!currentLatest || itemDate.getTime() > currentLatest.getTime()) {
      return itemDate;
    }

    return currentLatest;
  }, null as Date | null);

  return latest ?? new Date();
};

export const getCodeToolsUrl = (id: string): string => {
  return `/code-ai/${encodeURIComponent(id)}`;
};
