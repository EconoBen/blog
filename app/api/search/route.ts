import { NextResponse } from 'next/server';
import { postService } from '@/services/PostService';
import { unifiedSearchService } from '@/app/services/UnifiedSearchService';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim() || '';

  if (!query) {
    return NextResponse.json(
      { results: [], posts: [] },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const [results, matchingPosts] = await Promise.all([
      unifiedSearchService.search(query),
      postService.searchPosts(query),
    ]);
    return NextResponse.json(
      {
        results,
        posts: matchingPosts.slice(0, 5),
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  } catch (error) {
    console.error('Search error:', error);
    const posts = await postService.searchPosts(query);
    return NextResponse.json(
      {
        results: posts.map((post) => ({
          type: 'post' as const,
          title: post.title,
          description: post.summary,
          url: `/posts/${post.slug}`,
          date: post.date,
          tags: post.tags,
        })),
        posts,
      },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
