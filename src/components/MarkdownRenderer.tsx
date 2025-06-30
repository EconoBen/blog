import React, { useEffect, useRef, useState, useMemo } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeRaw from 'rehype-raw';
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

      // Handle mermaid diagrams
      if (!inline && language === 'mermaid') {
        return <MermaidDiagram code={code} />;
      }

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
      rehypePlugins={[rehypeRaw]}
      components={components}
    >
      {content}
    </ReactMarkdown>
  );
};

// Mermaid diagram component with memoization
const MermaidDiagram: React.FC<{ code: string }> = React.memo(({ code }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const svgRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  const [isRendered, setIsRendered] = useState(false);
  
  // Generate stable ID based on code content
  const diagramId = useMemo(() => {
    let hash = 0;
    for (let i = 0; i < code.length; i++) {
      const char = code.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32bit integer
    }
    return `mermaid-${Math.abs(hash)}`;
  }, [code]);

  // Set up intersection observer to only render when visible
  useEffect(() => {
    const element = containerRef.current;
    if (!element) return;
    
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !isRendered) {
            setIsVisible(true);
          }
        });
      },
      { threshold: 0.1 }
    );

    observer.observe(element);
    
    return () => {
      observer.unobserve(element);
    };
  }, [isRendered]);

  // Render diagram when visible
  useEffect(() => {
    if (!isVisible || isRendered || !svgRef.current) return;
    
    let mounted = true;
    
    const renderDiagram = async () => {
      try {
        // Dynamically import mermaid
        const mermaid = await import('mermaid');
        
        if (!mounted) return;
        
        mermaid.default.initialize({
          startOnLoad: false,
          theme: 'default',
          securityLevel: 'loose',
          fontFamily: 'monospace',
          deterministicIds: true
        });
        
        const { svg } = await mermaid.default.render(diagramId, code);
        
        if (mounted && svgRef.current) {
          svgRef.current.innerHTML = svg;
          setIsRendered(true);
        }
      } catch (err) {
        if (mounted) {
          console.error('Mermaid rendering error:', err);
          setError('Failed to render diagram');
        }
      }
    };

    renderDiagram();
    
    return () => {
      mounted = false;
    };
  }, [isVisible, isRendered, code, diagramId]);

  if (error) {
    return (
      <div className="mermaid-diagram-error">
        <p>Error rendering diagram</p>
        <pre>{code}</pre>
      </div>
    );
  }

  return (
    <div className="mermaid-diagram" ref={containerRef}>
      <div ref={svgRef} style={{ minHeight: isRendered ? 'auto' : '200px' }}>
        {!isRendered && (
          <div style={{ textAlign: 'center', color: '#999', paddingTop: '80px' }}>
            Loading diagram...
          </div>
        )}
      </div>
    </div>
  );
});

export default MarkdownRenderer;
