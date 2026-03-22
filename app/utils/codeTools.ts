import { workshopConfig, type WorkshopItem } from '../config/workshopConfig';
import { gistItems } from '../config/workshopGists';

export type CodeToolsItem = WorkshopItem;

const codeToolsItems: CodeToolsItem[] = [...workshopConfig.items, ...gistItems];

export const codeToolsCategories = workshopConfig.categories;

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
