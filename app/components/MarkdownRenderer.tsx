'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import remarkMath from 'remark-math';
import rehypeRaw from 'rehype-raw';
import rehypeKatex from 'rehype-katex';
import 'katex/dist/katex.min.css';
import CodeBlock from './CodeBlock';
import TTSPipelineDiagram from './TTSPipelineDiagram';

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
      const kids = React.Children.toArray(children);

      // If any child is our marker span from code(), render the SVG inside a single <pre>
      const hasTtsMarker = kids.some(
        (el) => React.isValidElement(el) && (el as any).type === 'span' && Boolean(((el as any).props || {})['data-tts-diagram'])
      );
      if (hasTtsMarker) {
        return <pre {...props}><TTSPipelineDiagram /></pre>;
      }

      // If react-markdown nested a <pre> inside this <pre>, unwrap it
      if (kids.length === 1 && React.isValidElement(kids[0]) && (kids[0] as any).type === 'pre') {
        const innerChildren = ((kids[0] as any).props || {}).children;
        return <pre {...props}>{innerChildren}</pre>;
      }

      return <pre {...props}>{children}</pre>;
    },
    // Wrap fenced code blocks; ensure single <pre> around TTS diagram to match production// Override code block rendering
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-([\w-]+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      // Handle custom diagrams
      if (!inline && language === 'tts-pipeline-diagram') {
        return <TTSPipelineDiagram />;
      }

      if (!inline && (language || code.includes('\n'))) {
        return <CodeBlock filename={language || 'code'} code={code} />;
      }

      // For inline code
      const { node: _node, ...rest } = props || {};
      return (
        <code className={className} {...rest}>
          {children}
        </code>
      );
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
    // Make external links open in new tab
    a: ({ node, children, ...props }: any) => (
      <a target="_blank" rel="noopener noreferrer" {...props}>{children}</a>
    ),
    // Add image styling
    img: ({ node, ...props }: any) => (
      <img alt={props.alt || ''} className="blog-image" {...props} />
    ),
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