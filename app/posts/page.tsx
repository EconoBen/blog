import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { postService } from '../services/PostService';
import { PostsList } from './PostsList';

export const metadata: Metadata = {
  title: 'Posts | ECONOBEN.DEV',
  description: 'Essays, reports, and field notes on AI systems, developer tooling, and applied economics.',
};

type Posts = Awaited<ReturnType<typeof postService.getAllPosts>>;
type Post = Posts[number];

const countTags = (posts: Posts) => {
  const counts = new Map<string, { tag: string; count: number; samplePosts: Post[] }>();
  posts.forEach((post) => {
    post.tags.forEach((tag) => {
      const existing = counts.get(tag) ?? { tag, count: 0, samplePosts: [] };
      existing.count += 1;
      if (existing.samplePosts.length < 2 && !existing.samplePosts.some((s) => s.slug === post.slug)) {
        existing.samplePosts.push(post);
      }
      counts.set(tag, existing);
    });
  });
  return Array.from(counts.values()).sort((a, b) => b.count - a.count);
};

export default async function PostsPage() {
  const posts = await postService.getAllPosts();
  const topTags = countTags(posts).slice(0, 4);

  // Serialize dates for client component
  const serializedPosts = posts.map((p) => ({
    ...p,
    date: p.date.toISOString(),
  }));

  return (
    <EditorialPageFrame currentPath="/posts">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1440px] px-8 pb-6 pt-14 md:pb-8 md:pt-20">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Reading archive</p>
        <h1 className="mt-4 max-w-3xl font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
          Posts
        </h1>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-on-surface">
          Essays, reports, and field notes on AI systems, developer tooling, and applied economics
        </p>
      </section>

      {/* ── Posts list with view toggle ── */}
      <section className="border-t border-outline-variant/20 pt-4 pb-12 md:pt-5 md:pb-16">
        <div className="mx-auto max-w-[1440px] px-8">
          <PostsList posts={serializedPosts as any} latestSlug={posts[0]?.slug} />
        </div>
      </section>

      {/* ── Topics ── */}
      <section className="border-t border-outline-variant/20 py-12 md:py-16">
        <div className="mx-auto max-w-[1440px] px-8">
          <p className="mb-8 font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Recurring topics</p>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
            {topTags.map(({ tag, count, samplePosts }) => (
              <article key={tag} className="group overflow-hidden sticky-note p-6 transition-transform duration-300 hover:-translate-y-1">
                <div className="space-y-4">
                  <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{count} posts</p>
                  <h3 className="font-headline text-xl font-bold text-on-surface transition-colors group-hover:text-primary">
                    <Link href={`/tags/${encodeURIComponent(tag)}`}>{tag}</Link>
                  </h3>
                  {samplePosts[0]?.summary && (
                    <p className="line-clamp-3 font-body text-sm leading-relaxed text-on-surface">{samplePosts[0].summary}</p>
                  )}
                  <Link href={`/tags/${encodeURIComponent(tag)}`} className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
                    View all
                  </Link>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
