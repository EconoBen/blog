import { MetadataRoute } from 'next';
import { getSiteUrl } from './utils/siteUrl';

export default function robots(): MetadataRoute.Robots {
  const baseUrl = getSiteUrl();
  
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/api/', '/_next/', '/assets/originals/'],
    },
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
