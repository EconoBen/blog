import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';

export interface ArticleHeading {
  id: string;
  text: string;
  depth: number;
}

export interface ArticleLink {
  href: string;
  text: string;
}

interface ArticleStructure {
  headings: ArticleHeading[];
  links: ArticleLink[];
}

interface ArticleNode {
  type: string;
  value?: string;
  tagName?: string;
  properties?: Record<string, unknown>;
  children?: ArticleNode[];
}

function visibleText(node: ArticleNode): string {
  if (node.type === 'text') return node.value ?? '';
  if (node.properties?.ariaHidden === 'true' || node.properties?.ariaHidden === true) return '';
  return (node.children ?? []).map(visibleText).join('');
}

/** Keep the existing first heading fragments; disambiguate repeats in document order. */
export function articleStructurePlugin(structure?: ArticleStructure) {
  return (tree: ArticleNode) => {
    const used = new Set<string>();
    const reserveAnchors = (node: ArticleNode) => {
      if (!/^h[1-6]$/.test(node.tagName ?? '') && typeof node.properties?.id === 'string') used.add(node.properties.id);
      for (const child of node.children ?? []) reserveAnchors(child);
    };
    reserveAnchors(tree);
    const walk = (node: ArticleNode) => {
      if (node.type === 'element' && /^h[1-6]$/.test(node.tagName ?? '')) {
        const text = visibleText(node);
        const base = typeof node.properties?.id === 'string' ? node.properties.id :
          text.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^\w-]/g, '') || 'section';
        let id = base;
        for (let suffix = 2; used.has(id); suffix += 1) id = `${base}-${suffix}`;
        used.add(id);
        node.properties = { ...node.properties, id };
        const depth = Math.max(2, Number(node.tagName!.slice(1)));
        if (depth <= 3) structure?.headings.push({ id, text, depth });
      }
      if (node.tagName === 'a' && typeof node.properties?.href === 'string') {
        structure?.links.push({ href: node.properties.href, text: visibleText(node) });
      }
      for (const child of node.children ?? []) walk(child);
    };
    walk(tree);
  };
}

// The same parser and heading transform serve the renderer and the section index.
export const articleRemarkPlugins = [remarkGfm, remarkMath];
export const articleRehypePlugins = [rehypeRaw, rehypeKatex, articleStructurePlugin];

export function getArticleStructure(content: string): ArticleStructure {
  const structure: ArticleStructure = { headings: [], links: [] };
  ReactMarkdown({
    children: content,
    remarkPlugins: articleRemarkPlugins,
    rehypePlugins: [rehypeRaw, rehypeKatex, [articleStructurePlugin, structure]],
  });
  return structure;
}

export function sectionIndexFor(headings: readonly ArticleHeading[], readingTime = 0): ArticleHeading[] {
  if (readingTime < 6) return [];
  const sections = headings.filter(heading => heading.depth === 2 && heading.text.trim());
  return sections.length >= 3 ? sections : [];
}
