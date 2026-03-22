'use client';

import { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneLight } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { workshopConfig, type WorkshopItem } from '../config/workshopConfig';
import {
  formatCodeToolsDate,
  getCodeToolsCategoryCounts,
  getCodeToolsFeaturedItems,
  getCodeToolsItemLineCount,
  getCodeToolsItems,
  getCodeToolsLanguageLabel,
  getCodeToolsUrl,
  normalizeCodeToolsLanguage,
} from '../utils/codeTools';

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
  fontSize: '0.88rem',
  lineHeight: '1.7',
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

const controlPanelStyle = {
  display: 'grid',
  gap: '18px',
} as const;

const spotlightCardStyle = {
  display: 'grid',
  gap: '18px',
} as const;

const spotlightSummaryStyle = {
  background: 'rgba(255, 255, 255, 0.56)',
  border: '1px solid rgba(16, 34, 54, 0.08)',
  borderRadius: '18px',
  display: 'grid',
  gap: '12px',
  padding: '18px',
} as const;

function SnippetCodeBlock({
  item,
  onCopy,
  copyLabel,
}: {
  item: WorkshopItem;
  onCopy: () => void;
  copyLabel: string;
}) {
  return (
    <div style={codeBlockStyle}>
      <div
        style={{
          alignItems: 'center',
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          justifyContent: 'space-between',
          padding: '0.85rem 1rem',
        }}
      >
        <div style={{ display: 'grid', gap: '0.18rem' }}>
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
          <button type="button" onClick={onCopy} style={codeActionStyle}>
            {copyLabel}
          </button>
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
  );
}

function CodeToolsSpotlightCard({
  item,
  onCopy,
  copyLabel,
}: {
  item: WorkshopItem;
  onCopy: () => void;
  copyLabel: string;
}) {
  return (
    <article className="editorial-home-card" style={{ ...spotlightCardStyle, minHeight: '0' }}>
      <div style={{ display: 'grid', gap: '18px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', justifyContent: 'space-between', alignItems: 'start' }}>
          <div style={{ maxWidth: '52ch' }}>
            <p className="editorial-home-card-label">Featured utility</p>
            <h3 style={{ margin: '10px 0 10px', fontSize: 'clamp(2rem, 2.8vw, 3rem)', lineHeight: 0.98, maxWidth: '11ch' }}>
              <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
            </h3>
            <p className="editorial-post-summary">{item.description}</p>
          </div>

          <div className="editorial-chip-row" style={{ marginTop: 0, justifyContent: 'flex-end' }}>
            {item.featured && <span className="editorial-chip">Featured</span>}
            {item.filename && <span className="editorial-chip">{item.filename}</span>}
            <span className="editorial-chip">{getCodeToolsLanguageLabel(item.language)}</span>
            <span className="editorial-chip">{getCodeToolsItemLineCount(item)} lines</span>
          </div>
        </div>

        <div className="editorial-two-column" style={{ gap: '16px' }}>
          <div style={spotlightSummaryStyle}>
            <p className="editorial-home-card-label">Why it matters</p>
            {item.writeup ? (
              <div className="item-writeup">
                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
              </div>
            ) : (
              <p className="editorial-post-summary" style={{ marginBottom: 0 }}>
                This item is a direct utility, so the page keeps the code visible and the summary short.
              </p>
            )}
          </div>

          <aside className="editorial-page-aside" style={{ margin: 0 }}>
            <p className="editorial-home-card-label">Quick facts</p>
            <div className="editorial-page-metric-list">
              <div>
                <span className="editorial-page-metric-value">{item.category}</span>
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
            </div>

            <div className="editorial-link-row">
              <Link href={getCodeToolsUrl(item.id)} className="editorial-post-link">
                Open detail page
              </Link>
              {item.gistUrl && (
                <a href={item.gistUrl} target="_blank" rel="noopener noreferrer" className="editorial-post-link">
                  Open source
                </a>
              )}
            </div>
          </aside>
        </div>

        <SnippetCodeBlock item={item} onCopy={onCopy} copyLabel={copyLabel} />
      </div>
    </article>
  );
}

function CodeToolsSupportCard({ item }: { item: WorkshopItem }) {
  return (
    <article className="editorial-home-card" style={{ display: 'grid', gap: '14px', minHeight: '0' }}>
      <div className="editorial-post-meta">
        {item.category && <span>{item.category}</span>}
        {item.date && <span>{formatCodeToolsDate(item.date)}</span>}
        <span>{getCodeToolsLanguageLabel(item.language)}</span>
      </div>

      <h3 style={{ margin: 0, fontSize: '1.4rem', lineHeight: 1.04 }}>
        <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
      </h3>

      <p className="editorial-post-summary">{item.description}</p>

      <div className="editorial-chip-row">
        {item.filename && <span className="editorial-chip">{item.filename}</span>}
        <span className="editorial-chip">{item.tags.length} tags</span>
        <span className="editorial-chip">{getCodeToolsItemLineCount(item)} lines</span>
      </div>

      <Link href={getCodeToolsUrl(item.id)} className="editorial-post-link">
        Open detail page
      </Link>
    </article>
  );
}

function CodeToolsCard({
  item,
  viewMode,
  isExpanded,
  onToggleExpanded,
  onCopy,
  copyLabel,
}: {
  item: WorkshopItem;
  viewMode: 'compact' | 'full';
  isExpanded: boolean;
  onToggleExpanded: () => void;
  onCopy: () => void;
  copyLabel: string;
}) {
  const showCode = viewMode === 'full' || isExpanded;

  return (
    <article className="editorial-home-card" style={{ display: 'grid', gap: '14px' }}>
      <div className="editorial-post-meta">
        {item.category && <span>{item.category}</span>}
        {item.date && <span>{formatCodeToolsDate(item.date)}</span>}
        <span>{getCodeToolsLanguageLabel(item.language)}</span>
        <span>{getCodeToolsItemLineCount(item)} lines</span>
      </div>

      <h3 style={{ margin: 0, fontSize: '1.55rem' }}>
        <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
      </h3>

      <p className="editorial-post-summary">{item.description}</p>

      <div className="editorial-chip-row">
        {item.featured && <span className="editorial-chip">Featured</span>}
        {item.filename && <span className="editorial-chip">{item.filename}</span>}
        {item.tags.slice(0, 4).map((tag) => (
          <span key={tag} className="editorial-chip">
            {tag}
          </span>
        ))}
      </div>

      {item.writeup && showCode && (
        <div
          className="item-writeup"
          style={{
            background: 'rgba(255,255,255,0.45)',
            border: '1px solid rgba(16, 34, 54, 0.08)',
            borderRadius: '18px',
            padding: '1rem 1.05rem',
          }}
        >
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
        </div>
      )}

      {showCode && <SnippetCodeBlock item={item} onCopy={onCopy} copyLabel={copyLabel} />}

      <div className="editorial-home-actions" style={{ marginTop: 0 }}>
        <Link href={getCodeToolsUrl(item.id)} className="editorial-home-button editorial-home-button-secondary">
          Open detail page
        </Link>
        {viewMode === 'compact' && (
          <button type="button" onClick={onToggleExpanded} className="editorial-home-button editorial-home-button-primary">
            {isExpanded ? 'Hide preview' : 'Show preview'}
          </button>
        )}
      </div>
    </article>
  );
}

export default function CodeAIPage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [viewMode, setViewMode] = useState<'compact' | 'full'>('compact');
  const [copyStates, setCopyStates] = useState<Record<string, string>>({});

  const { title, subtitle, categories } = workshopConfig;
  const allItems = getCodeToolsItems();
  const categoryCounts = getCodeToolsCategoryCounts(allItems);
  const featuredItems = getCodeToolsFeaturedItems(allItems);
  const latestItem = allItems[0];
  const activeCategoryCount = categories.filter(
    (category) => category.id !== 'all' && (categoryCounts[category.id] ?? 0) > 0,
  ).length;

  const filteredItems = allItems.filter((item: WorkshopItem) => {
    const query = searchQuery.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const matchesSearch =
      query === '' ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(query));

    return matchesCategory && matchesSearch;
  });

  const selectedCategoryLabel = categories.find((category) => category.id === selectedCategory)?.label ?? 'All';
  const spotlightItem = filteredItems.find((item) => item.featured) ?? filteredItems[0] ?? featuredItems[0] ?? latestItem;
  const supportingSpotlightItems = filteredItems.filter((item) => item.id !== spotlightItem?.id).slice(0, 3);

  const groupedItems = filteredItems.reduce<Record<string, WorkshopItem[]>>((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {});

  const toggleExpanded = (itemId: string) => {
    const nextExpanded = new Set(expandedItems);
    if (nextExpanded.has(itemId)) {
      nextExpanded.delete(itemId);
    } else {
      nextExpanded.add(itemId);
    }
    setExpandedItems(nextExpanded);
  };

  const copyToClipboard = (content: string, itemId: string) => {
    navigator.clipboard.writeText(content);
    setCopyStates((prev) => ({ ...prev, [itemId]: 'Copied' }));
    window.setTimeout(() => {
      setCopyStates((prev) => ({ ...prev, [itemId]: 'Copy' }));
    }, 2000);
  };

  return (
    <EditorialPageFrame currentPath="/code-ai" pageClassName="editorial-book-page">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Code &amp; Tools</p>
          <h1 className="editorial-page-title">{title}</h1>
          <p className="editorial-page-copy">{subtitle}</p>
          <p className="editorial-post-summary" style={{ marginTop: '14px', maxWidth: '58ch' }}>
            Search by title, tag, or category. Switch between compact and full views depending on whether you want the index or the code canvas.
          </p>

          <div className="editorial-home-actions">
            <Link href="#code-tools-index" className="editorial-home-button editorial-home-button-primary">
              Browse the index
            </Link>
            <Link href="/search" className="editorial-home-button editorial-home-button-secondary">
              Search the site
            </Link>
          </div>

          <div className="editorial-chip-row">
            <span className="editorial-chip">{allItems.length} snippets</span>
            <span className="editorial-chip">{activeCategoryCount} active categories</span>
            <span className="editorial-chip">{featuredItems.length} featured</span>
            <span className="editorial-chip">
              {latestItem
                ? formatCodeToolsDate(latestItem.date, { month: 'short', day: 'numeric', year: 'numeric' })
                : 'No latest item'}
            </span>
          </div>
        </div>

        <aside className="editorial-page-aside" style={{ display: 'grid', gap: '16px' }}>
          <p className="editorial-home-card-label">Current spotlight</p>
          {spotlightItem ? (
            <>
              <h2 style={{ margin: 0, fontSize: '2rem', lineHeight: 1.02 }}>
                <Link href={getCodeToolsUrl(spotlightItem.id)}>{spotlightItem.title}</Link>
              </h2>
              <p className="editorial-post-summary">{spotlightItem.description}</p>
              <div className="editorial-page-metric-list">
                <div>
                  <span className="editorial-page-metric-value">{getCodeToolsLanguageLabel(spotlightItem.language)}</span>
                  <span className="editorial-page-metric-label">language</span>
                </div>
                <div>
                  <span className="editorial-page-metric-value">{spotlightItem.category}</span>
                  <span className="editorial-page-metric-label">category</span>
                </div>
                <div>
                  <span className="editorial-page-metric-value">{getCodeToolsItemLineCount(spotlightItem)}</span>
                  <span className="editorial-page-metric-label">lines</span>
                </div>
              </div>
              <div className="editorial-link-row">
                <Link href={getCodeToolsUrl(spotlightItem.id)} className="editorial-post-link">
                  Open spotlight
                </Link>
                {spotlightItem.gistUrl && (
                  <a href={spotlightItem.gistUrl} target="_blank" rel="noopener noreferrer" className="editorial-post-link">
                    Open source
                  </a>
                )}
              </div>
            </>
          ) : (
            <p className="editorial-post-summary">No items are available for the current filter.</p>
          )}
        </aside>
      </section>

      <section className="editorial-list-section" id="code-tools-index">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Browse</p>
          <h2 className="editorial-page-section-title">Filter the catalog, then switch between a compact index and a full code view.</h2>
        </div>

        <div className="editorial-home-card" style={controlPanelStyle}>
          <div className="search-input-container" role="search" aria-label="Code and Tools search">
            <input
              type="text"
              placeholder="Search snippets, tags, filenames, or descriptions..."
              value={searchQuery}
              onChange={(event) => setSearchQuery(event.target.value)}
              className="search-input-large"
            />
          </div>

          <div>
            <p className="editorial-home-card-label" style={{ marginBottom: '10px' }}>
              Categories
            </p>
            <div className="editorial-chip-row" style={{ marginTop: 0 }}>
              {categories.map((category) => {
                const count = category.id === 'all' ? allItems.length : categoryCounts[category.id] ?? 0;
                const active = selectedCategory === category.id;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => setSelectedCategory(category.id)}
                    className="editorial-chip"
                    style={{
                      background: active ? 'rgba(33, 78, 230, 0.14)' : 'rgba(33, 78, 230, 0.08)',
                      borderColor: active ? 'rgba(33, 78, 230, 0.2)' : 'rgba(33, 78, 230, 0.08)',
                      color: 'var(--editorial-blue)',
                      fontWeight: active ? 700 : 600,
                    }}
                    aria-pressed={active}
                  >
                    <span>{category.icon}</span>
                    <span>{category.label}</span>
                    <span>({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          <div>
            <p className="editorial-home-card-label" style={{ marginBottom: '10px' }}>
              View mode
            </p>
            <div className="editorial-chip-row" style={{ marginTop: 0 }}>
              <button
                type="button"
                className="editorial-chip"
                style={{
                  background: viewMode === 'compact' ? 'rgba(16, 34, 54, 0.92)' : 'rgba(255,255,255,0.55)',
                  color: viewMode === 'compact' ? '#fff' : 'var(--editorial-ink)',
                  borderColor: 'rgba(16, 34, 54, 0.08)',
                }}
                onClick={() => setViewMode('compact')}
                aria-pressed={viewMode === 'compact'}
              >
                Compact
              </button>
              <button
                type="button"
                className="editorial-chip"
                style={{
                  background: viewMode === 'full' ? 'rgba(16, 34, 54, 0.92)' : 'rgba(255,255,255,0.55)',
                  color: viewMode === 'full' ? '#fff' : 'var(--editorial-ink)',
                  borderColor: 'rgba(16, 34, 54, 0.08)',
                }}
                onClick={() => setViewMode('full')}
                aria-pressed={viewMode === 'full'}
              >
                Full
              </button>
            </div>
          </div>

          <p className="editorial-post-summary" style={{ marginTop: '2px' }}>
            Showing <strong>{filteredItems.length}</strong> of <strong>{allItems.length}</strong> items in <strong>{selectedCategoryLabel}</strong>
            {searchQuery ? <> for <strong>“{searchQuery}”</strong></> : null}
          </p>
        </div>
      </section>

      {spotlightItem && supportingSpotlightItems.length > 0 && (
        <section className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Featured</p>
            <h2 className="editorial-page-section-title">One utility gets the full treatment. The others stay close behind it.</h2>
          </div>

          <div className="editorial-two-column" style={{ alignItems: 'start' }}>
            <CodeToolsSpotlightCard
              item={spotlightItem}
              onCopy={() => copyToClipboard(spotlightItem.content, spotlightItem.id)}
              copyLabel={copyStates[spotlightItem.id] || 'Copy'}
            />

            <div style={{ display: 'grid', gap: '18px' }}>
              {supportingSpotlightItems.map((item) => (
                <CodeToolsSupportCard key={item.id} item={item} />
              ))}
            </div>
          </div>
        </section>
      )}

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Catalog</p>
          <h2 className="editorial-page-section-title">Browse the collection by category.</h2>
        </div>

        {viewMode === 'compact' ? (
          <div style={{ display: 'grid', gap: '18px' }}>
            {categories
              .filter((category) => category.id !== 'all' && (groupedItems[category.id]?.length ?? 0) > 0)
              .map((category) => {
                const categoryItems = groupedItems[category.id] ?? [];

                return (
                  <section key={category.id} className="editorial-home-card" style={{ display: 'grid', gap: '16px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.55rem' }}>
                      {category.icon} {category.label}
                      <span
                        style={{
                          marginLeft: '0.5rem',
                          color: 'var(--editorial-slate)',
                          fontFamily: 'IBM Plex Mono, Roboto Mono, monospace',
                          fontSize: '0.72rem',
                          letterSpacing: '0.08em',
                          textTransform: 'uppercase',
                        }}
                      >
                        ({categoryItems.length})
                      </span>
                    </h3>

                    <div style={{ display: 'grid', gap: '16px' }}>
                      {categoryItems.map((item) => {
                        const isExpanded = expandedItems.has(item.id);

                        return (
                          <CodeToolsCard
                            key={item.id}
                            item={item}
                            viewMode="compact"
                            isExpanded={isExpanded}
                            onToggleExpanded={() => toggleExpanded(item.id)}
                            onCopy={() => copyToClipboard(item.content, item.id)}
                            copyLabel={copyStates[item.id] || 'Copy'}
                          />
                        );
                      })}
                    </div>
                  </section>
                );
              })}
          </div>
        ) : (
          <div className="editorial-post-grid">
            {filteredItems.map((item) => (
              <CodeToolsCard
                key={item.id}
                item={item}
                viewMode="full"
                isExpanded
                onToggleExpanded={() => undefined}
                onCopy={() => copyToClipboard(item.content, item.id)}
                copyLabel={copyStates[item.id] || 'Copy'}
              />
            ))}
          </div>
        )}

        {filteredItems.length === 0 && (
          <div className="editorial-home-card" style={{ marginTop: '20px' }}>
            <p className="editorial-home-card-label">No matches</p>
            <p className="editorial-post-summary" style={{ marginTop: '10px' }}>
              No snippets match the current filter. Try a different category, clear the search, or switch to full view to browse the whole collection.
            </p>
          </div>
        )}
      </section>
    </EditorialPageFrame>
  );
}
