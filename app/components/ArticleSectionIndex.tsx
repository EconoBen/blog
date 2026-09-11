import type { ArticleHeading } from '../lib/articleStructure';

export function ArticleSectionIndex({ sections }: { sections: readonly ArticleHeading[] }) {
  if (!sections.length) return null;
  return (
    <details className="article-section-index">
      <summary>In this article <span>{sections.length} sections</span></summary>
      <nav aria-label="Article sections">
        <ol>{sections.map(section => <li key={section.id}>
          <a href={`#${section.id}`}>{section.text}</a>
        </li>)}</ol>
      </nav>
    </details>
  );
}
