import type { BookChapter } from './bookData';

type ReleasePart = {
  chapters: readonly Pick<BookChapter, 'status'>[];
};

export function bookReleaseSummary(parts: readonly ReleasePart[]): string {
  const liveCount = parts.reduce(
    (count, part) => count + part.chapters.filter(chapter => chapter.status === 'live').length,
    0,
  );

  if (liveCount === 0) return 'No chapters available yet.';
  return `${liveCount} ${liveCount === 1 ? 'chapter' : 'chapters'} available now.`;
}
