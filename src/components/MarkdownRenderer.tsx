import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import CodeBlock from './CodeBlock';

/**
 * Props for the MarkdownRenderer component
 *
 * @interface MarkdownRendererProps
 * @property {string} content - The markdown content to render
 */
interface MarkdownRendererProps {
  content: string;
}

/**
 * MarkdownRenderer component for rendering markdown content with custom components
 *
 * @param {MarkdownRendererProps} props - Component properties
 * @returns {JSX.Element} The rendered MarkdownRenderer component
 */
const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const components = {
    // Override code block rendering
    code({ node, inline, className, children, ...props }: any) {
      const match = /language-(\w+)/.exec(className || '');
      const language = match ? match[1] : '';
      const code = String(children).replace(/\n$/, '');

      if (!inline && (language || code.includes('\n'))) {
        return (
          <CodeBlock
            filename={language || 'code'}
            code={code}
          />
        );
      }

      // For inline code
      return (
        <code className={className} {...props}>
          {children}
        </code>
      );
    },
    // Customize headings with IDs for TOC
    h2: ({ node, children, ...props }: any) => {
      // Generate ID from heading content for TOC linking
      const id = String(children)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

      return <h2 id={id} {...props}>{children}</h2>;
    },
    h3: ({ node, children, ...props }: any) => {
      // Generate ID from heading content for TOC linking
      const id = String(children)
        .toLowerCase()
        .replace(/\s+/g, '-')
        .replace(/[^\w-]/g, '');

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
      remarkPlugins={[remarkGfm]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

export default MarkdownRenderer;
