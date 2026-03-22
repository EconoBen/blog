import Link from 'next/link';
import { Metadata } from 'next';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { getSiteUrl } from '../../utils/siteUrl';
import {
  formatCodeToolsDate,
  getCodeToolsCategoryMeta,
  getCodeToolsItemById,
  getCodeToolsItemLineCount,
  getCodeToolsLanguageLabel,
  getCodeToolsRelatedItems,
  getCodeToolsStaticParams,
  getCodeToolsUrl,
  normalizeCodeToolsLanguage,
} from '../../utils/codeTools';

export async function generateStaticParams() {
  return getCodeToolsStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getCodeToolsItemById(id);

  if (!item) {
    return {
      title: 'Not Found | Economic Notes',
    };
  }

  const canonicalUrl = `${getSiteUrl()}${getCodeToolsUrl(id)}`;

  return {
    title: `${item.title} | Code & Tools | Economic Notes`,
    description: item.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      title: item.title,
      description: item.description,
      type: 'article',
      url: canonicalUrl,
      publishedTime: item.date ? new Date(item.date).toISOString() : undefined,
      tags: item.tags,
    },
  };
}

export default async function CodeAIDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const item = getCodeToolsItemById(id);

  if (!item) {
    notFound();
  }

  const categoryConfig = getCodeToolsCategoryMeta(item.category);
  const relatedItems = getCodeToolsRelatedItems(item, 3);
  const lineCount = getCodeToolsItemLineCount(item);
  const dateLabel = item.date ? formatCodeToolsDate(item.date, { year: 'numeric', month: 'long', day: 'numeric' }) : 'No date';

  return (
    <article
      className="code-ai-detail"
      style={{
        display: 'grid',
        gap: '1.5rem',
        maxWidth: '1120px',
        margin: '0 auto',
      }}
    >
      <div className="code-ai-detail-header" style={{ display: 'grid', gap: '1rem' }}>
        <div className="breadcrumb">
          <Link href="/code-ai">← Back to Code & Tools</Link>
        </div>

        <div
          className="code-ai-detail-meta"
          style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem', alignItems: 'center' }}
        >
          <span className="code-ai-detail-category">
            {categoryConfig?.icon} {categoryConfig?.label || item.category}
          </span>
          <time className="code-ai-detail-date">{dateLabel}</time>
          <span className="code-ai-detail-date">{getCodeToolsLanguageLabel(item.language)}</span>
          {item.filename && <span className="code-ai-detail-date">{item.filename}</span>}
          <span className="code-ai-detail-date">{lineCount} lines</span>
        </div>

        <div style={{ maxWidth: '70ch' }}>
          <h1 className="code-ai-detail-title" style={{ marginBottom: '0.5rem' }}>
            {item.title}
          </h1>
          <p className="code-ai-detail-description">{item.description}</p>
        </div>

        <div className="code-ai-detail-tags">
          {item.tags.map((tag) => (
            <span key={tag} className="code-ai-detail-tag">
              {tag}
            </span>
          ))}
        </div>

        <div className="code-ai-detail-actions">
          {item.gistUrl && (
            <a
              href={item.gistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="action-button github-button"
            >
              <svg className="icon" viewBox="0 0 16 16" width="16" height="16" fill="currentColor">
                <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
              </svg>
              View on GitHub
            </a>
          )}
          <Link href="/code-ai" className="action-button">
            Browse all snippets
          </Link>
        </div>
      </div>

      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'minmax(0, 1.6fr) minmax(280px, 0.9fr)',
          gap: '1.25rem',
          alignItems: 'start',
        }}
      >
        <section style={{ display: 'grid', gap: '1rem' }}>
          {item.writeup && (
            <div className="item-writeup" style={{ padding: '1.1rem 1.15rem', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
            </div>
          )}

          <div className="code-block">
            <div className="code-header">
              <div className="code-filename">{getCodeToolsLanguageLabel(item.language)}</div>
              <div className="code-actions">
                <span className="code-action" style={{ pointerEvents: 'none' }}>
                  {lineCount} lines
                </span>
              </div>
            </div>
            <div className="code-container">
              <SyntaxHighlighter
                language={normalizeCodeToolsLanguage(item.language)}
                style={oneDark}
                showLineNumbers
                wrapLines
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  textAlign: 'right',
                  userSelect: 'none',
                  opacity: 0.5,
                }}
                customStyle={{
                  margin: 0,
                  padding: '1rem',
                  fontSize: '0.9rem',
                  lineHeight: '1.7',
                  borderRadius: '0 0 8px 8px',
                  background: '#282c34',
                }}
                codeTagProps={{
                  style: {
                    fontFamily: "'JetBrains Mono', 'Fira Code', 'Consolas', 'Monaco', monospace",
                  },
                }}
              >
                {item.content}
              </SyntaxHighlighter>
            </div>
          </div>
        </section>

        <aside style={{ display: 'grid', gap: '1rem' }}>
          <section style={{ padding: '1rem 1.1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>At a glance</h2>
            <div style={{ display: 'grid', gap: '0.7rem' }}>
              <div>
                <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7 }}>Category</div>
                <div style={{ marginTop: '0.2rem' }}>{categoryConfig?.label || item.category}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7 }}>Language</div>
                <div style={{ marginTop: '0.2rem' }}>{getCodeToolsLanguageLabel(item.language)}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7 }}>Source</div>
                <div style={{ marginTop: '0.2rem' }}>{item.filename || 'Inline snippet'}</div>
              </div>
              <div>
                <div style={{ fontSize: '0.76rem', textTransform: 'uppercase', letterSpacing: '0.12em', opacity: 0.7 }}>Tags</div>
                <div style={{ marginTop: '0.2rem' }}>{item.tags.length}</div>
              </div>
            </div>
          </section>

          {relatedItems.length > 0 && (
            <section style={{ padding: '1rem 1.1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>Related snippets</h2>
              <div style={{ display: 'grid', gap: '0.75rem' }}>
                {relatedItems.map((relatedItem) => (
                  <article key={relatedItem.id} style={{ paddingBottom: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <h3 style={{ margin: 0, fontSize: '0.98rem' }}>
                      <Link href={getCodeToolsUrl(relatedItem.id)}>{relatedItem.title}</Link>
                    </h3>
                    <p style={{ margin: '0.35rem 0 0', opacity: 0.78 }}>{relatedItem.description}</p>
                  </article>
                ))}
              </div>
            </section>
          )}

          <section style={{ padding: '1rem 1.1rem', borderRadius: '16px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <h2 style={{ marginTop: 0, marginBottom: '0.75rem', fontSize: '1rem' }}>Collection note</h2>
            <p style={{ margin: 0, opacity: 0.82 }}>
              This snippet lives in the Code & Tools library alongside the rest of the collection, so the route structure stays stable even as the presentation gets more editorial.
            </p>
          </section>
        </aside>
      </div>
    </article>
  );
}
