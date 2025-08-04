import { NextResponse } from 'next/server';
import { postService } from '../../services/PostService';

export async function GET() {
  const posts = await postService.getAllPosts();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://econoben.dev';
  
  const rss = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Economic Notes</title>
    <description>Exploring Economics, Technology, and Life</description>
    <link>${siteUrl}</link>
    <atom:link href="${siteUrl}/rss.xml" rel="self" type="application/rss+xml" />
    <language>en-us</language>
    <lastBuildDate>${new Date().toUTCString()}</lastBuildDate>
    <generator>Next.js</generator>
    <managingEditor>benjamin.labaschin@gmail.com (Benjamin Labaschin)</managingEditor>
    <webMaster>benjamin.labaschin@gmail.com (Benjamin Labaschin)</webMaster>
    ${posts.slice(0, 20).map((post: any) => `
    <item>
      <title><![CDATA[${post.title}]]></title>
      <description><![CDATA[${post.summary || post.content.substring(0, 200) + '...'}]]></description>
      <link>${siteUrl}/posts/${post.slug}</link>
      <guid isPermaLink="true">${siteUrl}/posts/${post.slug}</guid>
      <pubDate>${post.date.toUTCString()}</pubDate>
      ${post.tags.map((tag: string) => `<category>${tag}</category>`).join('\n      ')}
      <content:encoded><![CDATA[${post.content}]]></content:encoded>
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