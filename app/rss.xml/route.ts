import { NextResponse } from 'next/server';
import { postService } from '../../services/PostService';
import { getSiteUrl } from '../utils/siteUrl';

const escapeXml = (value: string): string => {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&apos;');
};

const escapeCdata = (value: string): string => {
  return value.replace(/]]>/g, ']]]]><![CDATA[>');
};

export async function GET() {
  const siteUrl = getSiteUrl();
  const posts = await postService.getAllPosts().catch((error) => {
    console.error('RSS generation error:', error);
    return [];
  });
  const latestPostDate = posts[0]?.date ? new Date(posts[0].date) : new Date();
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>${escapeXml('Economic Notes')}</title>
    <description>${escapeXml('Exploring Economics, Technology, and Life')}</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${latestPostDate.toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    <managingEditor>${escapeXml('benjamin.labaschin@gmail.com (Benjamin Labaschin)')}</managingEditor>
    <webMaster>${escapeXml('benjamin.labaschin@gmail.com (Benjamin Labaschin)')}</webMaster>
    ${posts.slice(0, 20).map((post: any) => `
    <item>
      <title><![CDATA[${escapeCdata(post.title)}]]></title>
      <description><![CDATA[${escapeCdata(post.summary || `${post.content.substring(0, 200)}...`)}]]></description>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/posts/${post.slug}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      ${post.tags.map((tag: string) => `<category>${escapeXml(tag)}</category>`).join('\n      ')}
      <content:encoded><![CDATA[${escapeCdata(post.content)}]]></content:encoded>
    </item>`).join('')}
  </channel>
</rss>`;

  return new NextResponse(rss, {
    headers: {
      'Content-Type': 'application/xml',
      'Cache-Control': 'public, max-age=3600, s-maxage=3600',
    },
  });
}
