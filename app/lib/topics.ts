/** Only spelling, case, plural and equivalent topic labels are combined. */
const aliases: Record<string, string> = {
  llm: 'LLMs',
  llms: 'LLMs',
  'large language model': 'LLMs',
  'large language models': 'LLMs',
  agents: 'AI Agents',
  'ai agents': 'AI Agents',
  career: 'Career',
  'career journeys': 'Career',
  'year in review': 'Year in Review',
  'machine learning': 'Machine Learning',
  teaching: 'Teaching',
  economics: 'Economics',
};

export function canonicalTopic(topic: string): string {
  const trimmed = topic.trim();
  return aliases[trimmed.toLowerCase()] ?? trimmed;
}

/** Tolerate both decoded parameters and encoded legacy topic links. */
export function topicFromRoute(value: string): string {
  try { return canonicalTopic(decodeURIComponent(value)); }
  catch { return canonicalTopic(value); }
}

export function topicKey(topic: string): string {
  return canonicalTopic(topic).toLowerCase();
}

export function normalizeTopics(topics: readonly string[]): string[] {
  const seen = new Set<string>();
  return topics.map(canonicalTopic).filter(topic => {
    const key = topicKey(topic);
    if (!key || seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function countTopics(posts: readonly { tags: readonly string[] }[]): Array<{ tag: string; count: number }> {
  const counts = new Map<string, { tag: string; count: number }>();
  for (const post of posts) {
    for (const tag of normalizeTopics(post.tags)) {
      const key = topicKey(tag);
      const entry = counts.get(key);
      if (entry) entry.count += 1;
      else counts.set(key, { tag, count: 1 });
    }
  }
  return [...counts.values()].sort((left, right) => right.count - left.count || left.tag.localeCompare(right.tag));
}

const descriptions: Record<string, string> = {
  llms: 'Language models in practice: private deployments, developer tools, research, and the systems built around them.',
  ai: 'Applied AI, its effects on work, and the engineering decisions involved in putting it to use.',
  'ai agents': 'How agents use tools, work with memory, and carry out tasks across software systems.',
  'machine learning': 'Practical model development, infrastructure, and a career spent working with data.',
  'year in review': 'Annual reflections on work, writing, learning, and life outside the code.',
  'developer tooling': 'Tools and working practices that make software development clearer and more effective.',
  economics: 'Research and observations on productivity, work, and the economics of technology.',
  career: 'Personal accounts of learning, changing direction, and building a technical career.',
};

export function topicDescription(topic: string): string {
  return descriptions[topicKey(topic)] ?? `Articles about ${canonicalTopic(topic)}, from practical work to personal reflections.`;
}
