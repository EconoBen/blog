const DEFAULT_SITE_URL = 'https://econoben.dev';

export const getSiteUrl = (): string => {
  return (process.env.NEXT_PUBLIC_SITE_URL || DEFAULT_SITE_URL).replace(/\/$/, '');
};

export const getAbsoluteUrl = (path: string): string => {
  return `${getSiteUrl()}${path.startsWith('/') ? path : `/${path}`}`;
};
