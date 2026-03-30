import { NextResponse } from 'next/server';
import { postService } from '@/services/PostService';
import { unifiedSearchService } from '@/app/services/UnifiedSearchService';

export async function GET(request: Request) {
  const url = new URL(request.url);
  const query = url.searchParams.get('q')?.trim() || '';
  const limitParam = url.searchParams.get('limit');
  const limit = limitParam ? Number(limitParam) : undefined;
  const compactResponse = typeof limit === 'number' && Number.isFinite(limit) && limit > 0;

  if (!query) {
    return NextResponse.json(
      { results: [], posts: [] },
      { headers: { 'Cache-Control': 'no-store' } }
    );
  }

  try {
    const results = await unifiedSearchService.search(query, {
      includeCodeTools: !compactResponse,
      includeTagResults: !compactResponse,
      limit: compactResponse ? limit : undefined,
    });
    return NextResponse.json(
      {
        results,
        posts: results.filter((result) => result.type === 'post'),
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
      { status: 500, headers: { 'Cache-Control': 'no-store' } }
    );
  }
}
