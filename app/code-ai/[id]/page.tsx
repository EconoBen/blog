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

const codeCanvasStyle = {
  background: 'linear-gradient(180deg, rgba(251, 247, 240, 0.98), rgba(244, 237, 226, 0.96))',
  border: '1px solid rgba(16, 34, 54, 0.08)',
  borderRadius: '24px',
  boxShadow: '0 18px 42px rgba(10, 16, 24, 0.12)',
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

const canvasHeaderStyle = {
  alignItems: 'start',
  borderBottom: '1px solid rgba(16, 34, 54, 0.08)',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  justifyContent: 'space-between',
  padding: '1rem 1.15rem',
} as const;

const panelStackStyle = {
  display: 'grid',
  gap: '18px',
  alignContent: 'start',
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

function RelatedUtilityCard({
  item,
}: {
  item: NonNullable<ReturnType<typeof getCodeToolsItemById>>;
}) {
  return (
    <article style={relatedUtilityStyle}>
      <div className="editorial-post-meta">
        <span>{getCodeToolsLanguageLabel(item.language)}</span>
        <span>{item.category}</span>
      </div>
      <h3
        style={{
          margin: 0,
          color: 'var(--editorial-ink)',
          fontFamily: 'var(--font-heading)',
          fontSize: '1.2rem',
          letterSpacing: '-0.04em',
          lineHeight: 1.06,
        }}
      >
        <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
      </h3>
      <p className="editorial-post-summary" style={{ marginTop: '8px' }}>
        {item.description}
      </p>
    </article>
  );
}

const relatedUtilityStyle = {
  display: 'grid',
  gap: '12px',
  paddingBottom: '14px',
  borderBottom: '1px solid rgba(16, 34, 54, 0.08)',
} as const;

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
          <p className="editorial-home-kicker">Code &amp; Tools</p>
          <h1 className="editorial-page-title">{item.title}</h1>
          <p className="editorial-page-copy">{item.description}</p>
          <p className="editorial-post-summary" style={{ marginTop: '14px', maxWidth: '58ch' }}>
            The writeup stays with the code, so the page reads like part of the site instead of a detached utility view.
          </p>

          <div className="editorial-home-actions">
            <Link href="/code-ai" className="editorial-home-button editorial-home-button-secondary">
              Back to Code &amp; Tools
            </Link>
            {item.gistUrl && (
              <a href={item.gistUrl} target="_blank" rel="noopener noreferrer" className="editorial-home-button editorial-home-button-primary">
                Open source
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

        <aside className="editorial-page-aside" style={{ display: 'grid', gap: '16px' }}>
          <p className="editorial-home-card-label">Metadata</p>
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

      <section className="editorial-list-section">
        <div className="editorial-two-column" style={{ alignItems: 'start' }}>
          <section style={{ display: 'grid', gap: '18px' }}>
            {item.writeup && (
              <article className="editorial-home-card" style={{ display: 'grid', gap: '14px' }}>
                <p className="editorial-home-card-label">Notes</p>
                <div className="item-writeup">
                  <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                </div>
              </article>
            )}

            <article style={codeCanvasStyle}>
              <div style={canvasHeaderStyle}>
                <div style={{ display: 'grid', gap: '0.18rem' }}>
                  <p className="editorial-home-card-label">Code canvas</p>
                  <div
                    style={{
                      color: 'var(--editorial-ink)',
                      fontFamily: 'IBM Plex Mono, Roboto Mono, monospace',
                      fontSize: '0.78rem',
                      fontWeight: 700,
                      letterSpacing: '0.04em',
                      textTransform: 'uppercase',
                    }}
                  >
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
            </article>
          </section>

          <aside style={panelStackStyle}>
            <section className="editorial-page-aside">
              <p className="editorial-home-card-label">How to read it</p>
              <p className="editorial-post-summary" style={{ marginTop: '10px' }}>
                Start with the notes if you want context, then scan the code canvas. The route stays quick to read and easy to return to.
              </p>
              <div className="editorial-link-row">
                <Link href="/code-ai" className="editorial-post-link">
                  Back to the catalog
                </Link>
                <Link href="/search" className="editorial-post-link">
                  Search the site
                </Link>
              </div>
            </section>

            {relatedItems.length > 0 && (
              <section className="editorial-page-aside">
                <p className="editorial-home-card-label">Related utilities</p>
                <div style={{ display: 'grid', gap: '14px', marginTop: '12px' }}>
                  {relatedItems.map((relatedItem) => (
                    <RelatedUtilityCard key={relatedItem.id} item={relatedItem} />
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
