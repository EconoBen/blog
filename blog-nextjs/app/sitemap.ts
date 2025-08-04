import { MetadataRoute } from 'next';
import { postService } from '../services/PostService';
import { gistItems } from '../config/workshopGists';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://economicsnotes.com';
  
  // Get all posts
  const posts = await postService.getAllPosts();
  
  // Static pages
  const staticPages: MetadataRoute.Sitemap = [
    {
      url: baseUrl,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/posts`,
      lastModified: new Date(),
      changeFrequency: 'daily',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/code-ai`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/tags`,
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/archive`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/talks`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.6,
    },
    {
      url: `${baseUrl}/about`,
      lastModified: new Date(),
      changeFrequency: 'monthly',
      priority: 0.5,
    },
  ];

  // Blog post pages
  const postPages: MetadataRoute.Sitemap = posts.map((post: any) => ({
    url: `${baseUrl}/posts/${post.slug}`,
    lastModified: post.date,
    changeFrequency: 'monthly',
    priority: 0.7,
  }));

  // Code & AI (workshop) pages
  const codeAiPages: MetadataRoute.Sitemap = gistItems.map((item: any) => ({
    url: `${baseUrl}/code-ai/${item.slug}`,
    lastModified: item.date ? new Date(item.date) : new Date(),
    changeFrequency: 'monthly',
    priority: 0.6,
  }));

  // Get all unique tags
  const allTags = await postService.getAllTags();
  const tagPages: MetadataRoute.Sitemap = allTags.map(({ tag }: any) => ({
    url: `${baseUrl}/tags/${encodeURIComponent(tag)}`,
    lastModified: new Date(),
    changeFrequency: 'weekly',
    priority: 0.5,
  }));

  return [...staticPages, ...postPages, ...codeAiPages, ...tagPages];
}