import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import CodeBlock from './CodeBlock';
import TTSPipelineDiagram from './TTSPipelineDiagram';
import { ArticleImage } from './ArticleImage';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Helpers to create stable heading ids that match production
  const toText = (node: React.ReactNode): string => {
    if (typeof node === 'string' || typeof node === 'number') return String(node);
    if (Array.isArray(node as any)) return (node as any[]).map(toText).join('');
    if (React.isValidElement(node)) {
      return toText((node as React.ReactElement<any>).props.children);
    }
    return '';
  };

  const slugify = (value: string): string =>
    value
      .toLowerCase()
      .trim()
      .replace(/\s+/g, '-')
      .replace(/[^\w-]/g, '');

  const components = {
    pre({ node, children, ...props }: any) {
      const codeNode = node?.children?.length === 1 && node.children[0]?.tagName === 'code' ? node.children[0] : null;
      if (!codeNode) return <pre {...props}>{children}</pre>;
      const className = (codeNode.properties?.className ?? []).join(' ');
      const language = /language-([\w-]+)/.exec(className)?.[1] ?? 'text';
      const code = codeNode.children.map((child: { value?: string }) => child.value ?? '').join('').replace(/\n$/, '');
      if (language === 'tts-pipeline-diagram') return <TTSPipelineDiagram />;
      return <CodeBlock filename={language} code={code} />;
    },
    // Demote h1 to h2 for post content parity and add IDs
    h1: ({ node, children, ...props }: any) => {
      const id = slugify(toText(children));
      return <h2 id={id} {...props}>{children}</h2>;
    },
    // Customize headings with IDs for TOC
    h2: ({ node, children, ...props }: any) => {
      const id = slugify(toText(children));
      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ node, children, ...props }: any) => {
      const id = slugify(toText(children));
      return <h3 id={id} {...props}>{children}</h3>;
    },
    a: ({ node, children, href, ...props }: any) => {
      let destination = href;
      let external = false;
      if (/^(?:https?:)?\/\//i.test(href ?? '')) {
        try {
          const url = new URL(href, 'https://econoben.dev');
          external = url.origin !== 'https://econoben.dev';
          if (!external) destination = `${url.pathname}${url.search}${url.hash}`;
        } catch { /* Keep malformed legacy links from breaking the article. */ }
      }
      return <a href={destination} {...props} target={external ? '_blank' : undefined} rel={external ? 'noopener noreferrer' : undefined}>{children}</a>;
    },
    img: ({ node, src, alt, title, width, height, style }: any) => typeof src === 'string'
      ? <ArticleImage src={src} alt={alt || ''} title={title} width={width} height={height} style={style} /> : null,
  };

  return (
    <ReactMarkdown
      remarkPlugins={[remarkGfm, remarkMath]}
      rehypePlugins={[rehypeRaw, rehypeKatex]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
