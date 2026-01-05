// Vercel Edge Middleware for social media crawler OG tags
// Works with any framework (CRA, etc.)

const CRAWLER_USER_AGENTS = [
  'linkedinbot',
  'twitterbot',
  'facebookexternalhit',
  'slackbot',
  'telegrambot',
  'whatsapp',
  'discordbot',
];

// Post metadata - add new posts here
// coverImage: path to actual image (optional) - if not set, uses generated OG image
const POST_METADATA: Record<string, { title: string; summary: string; date: string; tags: string[]; coverImage?: string }> = {
  'building-dsa-dojo': {
    title: 'Building DSA Dojo: A CLI-Driven Approach to Learning Data Structures and Algorithms',
    summary: "I'm building my own data structures and algorithms course—a CLI-driven, ladder-based system where mastery comes through doing, not watching.",
    date: '2026-01-04',
    tags: ['AI', 'LLMs', 'Developer Tooling', 'Python', 'Teaching'],
    coverImage: '/assets/2026/01/dsa-dojo-curriculum-tree.png',
  },
  '2025-year-in-review': {
    title: '2025: My Year In Review',
    summary: "Reflections on a year of milestones—getting engaged in Florence, publishing with O'Reilly and the AEA, raising a Series A at Workhelix, and overcoming health challenges.",
    date: '2025-12-31',
    tags: ['year in review', 'engagement', 'AI', 'LLMs', 'research'],
    coverImage: '/assets/2026/01/florence_engagement.jpeg',
  },
  '2024-year-in-review': {
    title: '2024: My Year In Review — AI, Archery, and Goals',
    summary: 'Reflections on a year of growth, experimentation, and resilience—covering professional wins, personal pursuits like archery and lifting, and the challenges of navigating health setbacks.',
    date: '2024-12-31',
    tags: ['year in review', 'LLMs', 'archery', 'health'],
    coverImage: '/assets/2025/01/niece_and_I_optimized.jpeg',
  },
};

export const config = {
  matcher: '/posts/:path*',
};

export default function middleware(request: Request) {
  const userAgent = request.headers.get('user-agent')?.toLowerCase() || '';
  const isCrawler = CRAWLER_USER_AGENTS.some(bot => userAgent.includes(bot));

  if (!isCrawler) {
    return;
  }

  const url = new URL(request.url);
  const pathname = url.pathname;

  const postMatch = pathname.match(/^\/posts\/(.+)$/);
  if (!postMatch) {
    return;
  }

  const slug = postMatch[1];
  const meta = POST_METADATA[slug];

  if (!meta) {
    return;
  }

  const baseUrl = 'https://econoben.dev';
  const postUrl = `${baseUrl}/posts/${slug}`;

  // Use cover image if provided, otherwise fall back to generated OG image
  let imageUrl: string;
  if (meta.coverImage) {
    imageUrl = `${baseUrl}${meta.coverImage}`;
  } else {
    const ogImageParams = new URLSearchParams({
      title: meta.title,
      date: meta.date,
      tags: meta.tags.join(','),
      summary: meta.summary,
    });
    imageUrl = `${baseUrl}/api/og?${ogImageParams.toString()}`;
  }

  const html = `<!DOCTYPE html>
<html>
<head>
  <title>${meta.title} - Ben Labaschin</title>
  <meta property="og:type" content="article" />
  <meta property="og:title" content="${meta.title}" />
  <meta property="og:description" content="${meta.summary}" />
  <meta property="og:url" content="${postUrl}" />
  <meta property="og:image" content="${imageUrl}" />
  <meta property="og:site_name" content="Ben Labaschin's Blog" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="${meta.title}" />
  <meta name="twitter:description" content="${meta.summary}" />
  <meta name="twitter:image" content="${imageUrl}" />
</head>
<body>
  <h1>${meta.title}</h1>
  <p>${meta.summary}</p>
  <p><a href="${postUrl}">Read more</a></p>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html' },
  });
}
