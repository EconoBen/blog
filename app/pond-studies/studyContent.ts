/** Metadata shared by all three art studies; article bodies stay on the server. */
export interface StudyPost {
  slug: string;
  title: string;
  date: Date | string;
  tags: readonly string[];
  content: string;
  readingTime?: number;
}

export interface StudyEssay {
  slug: string;
  title: string;
  shortTitle: string;
  summary: string;
  href: string;
  date: string;
  tags: string[];
  readingTime?: number;
}

interface ConnectionBase {
  id: string;
  from: string;
  to: string;
  label: string;
  reverseLabel: string;
}

export type StudyConnection = ConnectionBase & (
  | {
      kind: 'shared-topic';
      evidence: {
        type: 'shared-tags';
        topics: string[];
        sourceSlugs: [string, string];
      };
    }
  | {
      kind: 'explicit-reference';
      evidence: {
        type: 'shared-publication-reference';
        sourceSlug: string;
        targetSlug: string;
        href: string;
        resourceTitle: string;
        excerpt: string;
        targetExcerpt: string;
      };
    }
);

// A fixed set makes differences between studies about presentation, not content.
// Summaries describe the dated essays without repeating outdated release counts.
const selections = [
  {
    slug: 'agent-memory-is-in-early-release',
    shortTitle: 'Agent Memory',
    summary: 'The engineering questions behind Agent Memory, and how reader feedback can shape a working technical book.',
  },
  {
    slug: 'publishing_for_oreilly',
    shortTitle: 'Becoming an O’Reilly author',
    summary: 'From borrowing technical books at the library to writing an O’Reilly report: a personal account of learning and persistence.',
  },
  {
    slug: 'what_are_ai_agents_an_introduction',
    shortTitle: 'What are AI agents?',
    summary: 'An introduction to the O’Reilly report on AI agents, the language models behind them, and where they can be useful.',
  },
  {
    slug: 'into-the-hopper-podcast-spec-driven-development',
    shortTitle: 'Planning with coding agents',
    summary: 'A conversation with Tim Hopper about spec-driven development, coding agents, and becoming a more deliberate planner.',
  },
  {
    slug: 'building-dsa-dojo',
    shortTitle: 'Building DSA Dojo',
    summary: 'A terminal-based curriculum of small coding exercises, built around learning data structures and algorithms by doing.',
  },
  {
    slug: 'host-your-own-private-llm-access-it-from-anywhere',
    shortTitle: 'A private LLM and RAG',
    summary: 'A practical guide to running a private language model with Synology, Ollama, Caddy, and Tailscale, accessible away from home.',
  },
  {
    slug: 'extending-gpts-are-gpts-to-firms',
    shortTitle: 'AI exposure across firms',
    summary: 'What workforce data from 7,894 firms reveals about exposure to AI, and the gap between measured exposure and reported adoption.',
  },
] as const;

const normalizeTopic = (topic: string) => topic.trim().toLowerCase();

function sharedTags(left: readonly string[], right: readonly string[]) {
  const matches = new Set(right.map(normalizeTopic));
  const seen = new Set<string>();
  return left.filter(topic => {
    const key = normalizeTopic(topic);
    if (!key || seen.has(key) || !matches.has(key)) return false;
    seen.add(key);
    return true;
  }).map(topic => topic.trim());
}

export function buildPondStudyContent(posts: readonly StudyPost[]): {
  essays: StudyEssay[];
  connections: StudyConnection[];
} {
  const bySlug = new Map(posts.map(post => [post.slug, post]));
  const essays: StudyEssay[] = [];
  for (const selection of selections) {
    const post = bySlug.get(selection.slug);
    if (!post) continue;
    const date = typeof post.date === 'string' ? new Date(post.date) : post.date;
    if (!Number.isFinite(date.getTime())) continue;
    essays.push({
      slug: post.slug,
      title: post.title,
      shortTitle: selection.shortTitle,
      summary: selection.summary,
      href: `/posts/${encodeURIComponent(post.slug)}`,
      date: date.toISOString(),
      tags: [...post.tags],
      readingTime: post.readingTime,
    });
  }

  const connections: StudyConnection[] = [];
  for (let fromIndex = 0; fromIndex < essays.length; fromIndex += 1) {
    const from = essays[fromIndex];
    for (const to of essays.slice(fromIndex + 1)) {
      const topics = sharedTags(from.tags, to.tags);
      if (!topics.length) continue;
      const label = `Both cover ${new Intl.ListFormat('en', { style: 'long', type: 'conjunction' }).format(topics)}.`;
      connections.push({
        id: `topic:${from.slug}:${to.slug}`,
        from: from.slug,
        to: to.slug,
        kind: 'shared-topic',
        label,
        reverseLabel: label,
        evidence: { type: 'shared-tags', topics, sourceSlugs: [from.slug, to.slug] },
      });
    }
  }

  // This is a reference to an external report, not a claim that one essay cites
  // the other. Both source passages must still exist before exposing the link.
  const referenceFrom = 'agent-memory-is-in-early-release';
  const referenceTo = 'what_are_ai_agents_an_introduction';
  const href = 'https://www.oreilly.com/library/view/what-are-ai/9781098159726/';
  const excerpt = `That work became [*What Are AI Agents?*](${href})`;
  const targetExcerpt = `you can find it [here](${href})`;
  if (
    essays.some(essay => essay.slug === referenceFrom) &&
    essays.some(essay => essay.slug === referenceTo) &&
    bySlug.get(referenceFrom)?.content.includes(excerpt) &&
    bySlug.get(referenceTo)?.content.includes(targetExcerpt)
  ) {
    connections.push({
      id: `reference:${referenceFrom}:${referenceTo}`,
      from: referenceFrom,
      to: referenceTo,
      kind: 'explicit-reference',
      label: 'Introduces the report “What Are AI Agents?” cited in the selected article.',
      reverseLabel: 'Cites the report “What Are AI Agents?” introduced in the selected article.',
      evidence: {
        type: 'shared-publication-reference',
        sourceSlug: referenceFrom,
        targetSlug: referenceTo,
        href,
        resourceTitle: 'What Are AI Agents? When and How to Use LLM Agents',
        excerpt,
        targetExcerpt,
      },
    });
  }
  return { essays, connections };
}

/** Return the label appropriate for reading outward from the selected essay. */
export function connectionsFor(
  essaySlug: string,
  essays: readonly StudyEssay[],
  connections: readonly StudyConnection[],
): Array<{ essay: StudyEssay; connection: StudyConnection; label: string }> {
  if (!essays.some(essay => essay.slug === essaySlug)) return [];
  const bySlug = new Map(essays.map(essay => [essay.slug, essay]));
  const order = new Map(essays.map((essay, index) => [essay.slug, index]));
  const strength = (connection: StudyConnection) => connection.kind === 'explicit-reference' ? 100 : connection.evidence.topics.length;
  const neighbors = connections
    .filter(connection => connection.from === essaySlug || connection.to === essaySlug)
    .flatMap(connection => {
      const forward = connection.from === essaySlug;
      const essay = bySlug.get(forward ? connection.to : connection.from);
      return essay && essay.slug !== essaySlug ? [{ essay, connection, label: forward ? connection.label : connection.reverseLabel }] : [];
    })
    .sort((left, right) => strength(right.connection) - strength(left.connection) || order.get(left.essay.slug)! - order.get(right.essay.slug)!);
  const seen = new Set<string>();
  return neighbors.filter(({ essay }) => {
    if (seen.has(essay.slug)) return false;
    seen.add(essay.slug);
    return true;
  });
}
