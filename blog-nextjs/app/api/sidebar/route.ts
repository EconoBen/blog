import { NextResponse } from 'next/server';
import { postService } from '@/services/PostService';

export async function GET() {
  try {
    const [recentPosts, tags, archives] = await Promise.all([
      postService.getRecentPosts(4),
      postService.getAllTags(),
      postService.getArchiveByMonth()
    ]);

    return NextResponse.json({
      recentPosts,
      tags,
      archives
    });
  } catch (error) {
    console.error('Failed to load sidebar data:', error);
    return NextResponse.json(
      { error: 'Failed to load sidebar data' },
      { status: 500 }
    );
  }
}