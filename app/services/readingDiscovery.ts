import type { Post } from './PostService';
import { getArticleStructure } from '../lib/articleStructure';
import { normalizeTopics, topicKey } from '../lib/topics';
import { buildPondStudyContent } from '../pond-studies/studyContent';

export interface RelatedReadingItem {
  post: Post;
  reason: string;
  kind: 'reference' | 'shared-topic';
}

/** This legacy article path already has a permanent redirect in next.config.ts. */
const legacySlugs: Record<string, string> = {
  'extending_"GPTs_Are_GPTs"_to_Firms': 'extending-gpts-are-gpts-to-firms',
};

function referencedSlugs(post: Post): Set<string> {
  const slugs = new Set<string>();
  for (const { href } of getArticleStructure(post.content).links) {
    try {
      const url = new URL(href, `https://econoben.dev/posts/${encodeURIComponent(post.slug)}`);
      if (!['econoben.dev', 'www.econoben.dev'].includes(url.hostname) || !['https:', 'http:'].includes(url.protocol)) continue;
      const match = /^\/posts\/([^/]+)\/?$/.exec(url.pathname);
      if (!match) continue;
      const slug = decodeURIComponent(match[1]);
      slugs.add(legacySlugs[slug] ?? slug);
    } catch { /* An invalid legacy link provides no evidence of a connection. */ }
  }
  return slugs;
}

export function relatedReadingFor(post: Post, allPosts: readonly Post[], limit = 3): RelatedReadingItem[] {
  const references = new Map(allPosts.map(item => [item.slug, referencedSlugs(item)]));
  const sourceReferences = references.get(post.slug) ?? referencedSlugs(post);
  const sourceTopics = new Set(normalizeTopics(post.tags).map(topicKey));
  const { connections } = buildPondStudyContent(allPosts);
  const topicFrequency = new Map<string, number>();
  for (const item of allPosts) {
    for (const topic of normalizeTopics(item.tags)) {
      const key = topicKey(topic);
      topicFrequency.set(key, (topicFrequency.get(key) ?? 0) + 1);
    }
  }

  const seen = new Set([post.slug]);
  const candidates: Array<RelatedReadingItem & { score: number }> = [];
  for (const candidate of allPosts) {
    if (seen.has(candidate.slug)) continue;
    seen.add(candidate.slug);
    const cited = sourceReferences.has(candidate.slug);
    const cites = references.get(candidate.slug)?.has(post.slug);
    if (cited || cites) {
      candidates.push({ post: candidate, kind: 'reference', score: cited ? 1000 : 900,
        reason: cited ? 'Cited in this article.' : 'Cites this article.' });
      continue;
    }
    const publication = connections.find(connection => connection.kind === 'explicit-reference' &&
      ((connection.from === post.slug && connection.to === candidate.slug) ||
       (connection.to === post.slug && connection.from === candidate.slug)));
    if (publication) {
      candidates.push({ post: candidate, kind: 'reference', score: 800,
        reason: (publication.from === post.slug ? publication.label : publication.reverseLabel).replace('the selected article', 'this article') });
      continue;
    }
    const shared = normalizeTopics(candidate.tags).filter(topic => sourceTopics.has(topicKey(topic)));
    if (!shared.length) continue;
    shared.sort((left, right) => (topicFrequency.get(topicKey(left)) ?? 0) - (topicFrequency.get(topicKey(right)) ?? 0) || left.localeCompare(right));
    const topics = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(shared);
    candidates.push({ post: candidate, kind: 'shared-topic',
      score: shared.reduce((weight, topic) => weight + 1 / (topicFrequency.get(topicKey(topic)) ?? 1), 0),
      reason: `Both cover ${topics}.` });
  }
  return candidates.sort((left, right) => right.score - left.score || right.post.date.getTime() - left.post.date.getTime() || left.post.slug.localeCompare(right.post.slug))
    .slice(0, Math.max(0, limit)).map(({ score: _score, ...item }) => item);
}
