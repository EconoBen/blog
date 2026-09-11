import React from 'react';
import ReactMarkdown from 'react-markdown';
import { articleRemarkPlugins, articleRehypePlugins } from '../lib/articleStructure';
import 'katex/dist/katex.min.css';
import CodeBlock from './CodeBlock';
import TTSPipelineDiagram from './TTSPipelineDiagram';
import { ArticleImage } from './ArticleImage';

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
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
    // The shared AST transform assigns unique IDs before React renders headings.
    h1: ({ node, children, ...props }: any) => <h2 {...props}>{children}</h2>,
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
      remarkPlugins={articleRemarkPlugins}
      rehypePlugins={articleRehypePlugins}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
