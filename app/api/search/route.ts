import { NextRequest, NextResponse } from 'next/server';
import { postService } from '@/services/PostService';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get('q');

  if (!query) {
    return NextResponse.json({ posts: [] });
  }

  try {
    const posts = await postService.searchPosts(query);
    return NextResponse.json({ posts });
  } catch (error) {
    console.error('Search error:', error);
    return NextResponse.json(
      { error: 'Failed to search posts' },
      { status: 500 }
    );
  }
}