export function sharedTopics(left: string[], right: string[]) {
  const rightTopics = new Set(right.map(tag => tag.trim().toLowerCase()));
  const seen = new Set<string>();
  return left.filter(tag => {
    const key = tag.trim().toLowerCase();
    if (!key || seen.has(key) || !rightTopics.has(key)) return false;
    seen.add(key); return true;
  });
}

/** A stable spread of lights with room around every edge for touch targets. */
export function pondPositions(count: number) {
  return Array.from({length: count}, (_, index) => {
    const angle = index * 2.399963;
    const radius = Math.sqrt((index + .6) / Math.max(1, count));
    return { x: 50 + Math.cos(angle) * radius * 37, y: 48 + Math.sin(angle) * radius * 34 };
  });
}

/** Four staggered columns retain generous targets on a narrow phone. */
export function pondMobileLayout(count: number) {
  const rows = Math.ceil(count / 4);
  return {
    height: Math.max(320, rows * 56 + 80),
    positions: Array.from({ length: count }, (_, index) => {
      const row = Math.floor(index / 4);
      return { x: 12.5 + (index % 4) * 25 + (row % 2 ? 2 : 0), y: 44 + row * 56 };
    }),
  };
}
