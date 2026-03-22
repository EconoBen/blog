import { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { EditorialPageFrame } from '../../components/EditorialPageFrame';
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

const codeBlockStyle = {
  background: 'rgba(246, 242, 233, 0.94)',
  border: '1px solid rgba(16, 34, 54, 0.08)',
  borderRadius: '18px',
  boxShadow: '0 16px 32px rgba(24, 36, 49, 0.08)',
  overflow: 'hidden',
} as const;

const syntaxStyle = {
  margin: 0,
  padding: '1rem',
  fontSize: '0.9rem',
  lineHeight: '1.72',
  background: 'transparent',
} as const;

const codeActionStyle = {
  alignItems: 'center',
  background: 'rgba(255, 255, 255, 0.72)',
  border: '1px solid rgba(16, 34, 54, 0.08)',
  borderRadius: '999px',
  color: 'var(--editorial-ink)',
  cursor: 'pointer',
  display: 'inline-flex',
  fontFamily: 'Inter, var(--font-body)',
  fontSize: '0.82rem',
  fontWeight: 700,
  gap: '0.35rem',
  justifyContent: 'center',
  minHeight: '34px',
  padding: '0 12px',
  textDecoration: 'none',
} as const;

export async function generateStaticParams() {
  return getCodeToolsStaticParams();
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const item = getCodeToolsItemById(id);

  if (!item) {
    return {
      title: 'Not Found | Code & Tools',
    };
  }

  const canonicalUrl = `${getSiteUrl()}${getCodeToolsUrl(id)}`;

  return {
    title: `${item.title} | Code & Tools | Ben Labaschin`,
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
    <EditorialPageFrame currentPath="/code-ai" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Code & tools</p>
          <h1 className="editorial-page-title">{item.title}</h1>
          <p className="editorial-page-copy">{item.description}</p>
          <p className="editorial-post-summary" style={{ marginTop: '14px', maxWidth: '58ch' }}>
            The detail view keeps the writeup and code together, so the route behaves like the rest of the editorial site instead of a separate utility app.
          </p>

          <div className="editorial-home-actions">
            <Link href="/code-ai" className="editorial-home-button editorial-home-button-secondary">
              Back to Code & Tools
            </Link>
            {item.gistUrl && (
              <a href={item.gistUrl} target="_blank" rel="noopener noreferrer" className="editorial-home-button editorial-home-button-primary">
                View on GitHub
              </a>
            )}
          </div>

          <div className="editorial-chip-row">
            <span className="editorial-chip">{categoryConfig?.label || item.category}</span>
            <span className="editorial-chip">{dateLabel}</span>
            <span className="editorial-chip">{getCodeToolsLanguageLabel(item.language)}</span>
            {item.filename && <span className="editorial-chip">{item.filename}</span>}
            <span className="editorial-chip">{lineCount} lines</span>
          </div>
        </div>

        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">At a glance</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{categoryConfig?.label || item.category}</span>
              <span className="editorial-page-metric-label">category</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{getCodeToolsLanguageLabel(item.language)}</span>
              <span className="editorial-page-metric-label">language</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{item.filename || 'Inline snippet'}</span>
              <span className="editorial-page-metric-label">source</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{item.tags.length}</span>
              <span className="editorial-page-metric-label">tags</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="editorial-home-proof-strip" aria-label="Code & Tools context">
        <span>{categoryConfig?.label || item.category}</span>
        <span>/</span>
        <span>{dateLabel}</span>
        <span>/</span>
        <span>{lineCount} lines</span>
        <span>/</span>
        <span>{item.tags.length} tags</span>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-two-column">
          <section style={{ display: 'grid', gap: '18px' }}>
            {item.writeup && (
              <div className="editorial-post-card" style={{ background: 'rgba(255, 255, 255, 0.58)' }}>
                <p className="editorial-home-card-label">Writeup</p>
                <div className="item-writeup" style={{ marginTop: '12px' }}>
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                </div>
              </div>
            )}

            <div style={codeBlockStyle}>
              <div style={{ alignItems: 'center', display: 'flex', flexWrap: 'wrap', gap: '0.75rem', justifyContent: 'space-between', padding: '0.85rem 1rem' }}>
                <div style={{ display: 'grid', gap: '0.18rem' }}>
                  <div style={{ color: 'var(--editorial-ink)', fontFamily: 'IBM Plex Mono, Roboto Mono, monospace', fontSize: '0.78rem', fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase' }}>
                    {getCodeToolsLanguageLabel(item.language)}
                  </div>
                  <div style={{ color: 'var(--editorial-slate)', fontFamily: 'Inter, var(--font-body)', fontSize: '0.88rem' }}>
                    {item.filename || 'Inline snippet'}
                  </div>
                </div>

                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', justifyContent: 'flex-end' }}>
                  {item.gistUrl && (
                    <a href={item.gistUrl} target="_blank" rel="noopener noreferrer" style={codeActionStyle}>
                      Gist
                    </a>
                  )}
                  <span style={{ ...codeActionStyle, cursor: 'default' }}>{lineCount} lines</span>
                </div>
              </div>

              <SyntaxHighlighter
                language={normalizeCodeToolsLanguage(item.language)}
                style={oneLight}
                showLineNumbers
                wrapLines
                lineNumberStyle={{
                  minWidth: '3em',
                  paddingRight: '1em',
                  textAlign: 'right',
                  userSelect: 'none',
                  opacity: 0.45,
                }}
                customStyle={syntaxStyle}
                codeTagProps={{
                  style: {
                    fontFamily: "'IBM Plex Mono', 'Roboto Mono', 'Consolas', 'Monaco', monospace",
                  },
                }}
              >
                {item.content}
              </SyntaxHighlighter>
            </div>
          </section>

          <aside style={{ display: 'grid', gap: '18px' }}>
            <section className="editorial-page-aside">
              <p className="editorial-home-card-label">Collection note</p>
              <p className="editorial-post-summary" style={{ marginTop: '10px' }}>
                This snippet stays in the editorial index alongside the rest of the collection, which keeps the browsing model stable as the presentation changes.
              </p>
            </section>

            {relatedItems.length > 0 && (
              <section className="editorial-page-aside">
                <p className="editorial-home-card-label">Related snippets</p>
                <div style={{ display: 'grid', gap: '14px', marginTop: '12px' }}>
                  {relatedItems.map((relatedItem) => (
                    <article key={relatedItem.id} style={{ paddingBottom: '14px', borderBottom: '1px solid rgba(16, 34, 54, 0.08)' }}>
                      <h3 style={{ margin: 0, color: 'var(--editorial-ink)', fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1.2rem', letterSpacing: '-0.04em' }}>
                        <Link href={getCodeToolsUrl(relatedItem.id)}>{relatedItem.title}</Link>
                      </h3>
                      <p className="editorial-post-summary" style={{ marginTop: '8px' }}>
                        {relatedItem.description}
                      </p>
                    </article>
                  ))}
                </div>
              </section>
            )}

            <section className="editorial-page-aside">
              <p className="editorial-home-card-label">Tags</p>
              <div className="editorial-chip-row" style={{ marginTop: '12px' }}>
                {item.tags.map((tag) => (
                  <span key={tag} className="editorial-chip">
                    {tag}
                  </span>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </section>
    </EditorialPageFrame>
  );
}
