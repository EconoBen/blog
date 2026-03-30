'use client';

import React, { useState } from 'react';
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

const categoryButtonStyle = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'inline-flex',
  gap: '0.45rem',
  justifyContent: 'center',
  lineHeight: 1,
} as const;

const controlButtonStyle = {
  alignItems: 'center',
  cursor: 'pointer',
  display: 'inline-flex',
  gap: '0.4rem',
  justifyContent: 'center',
  lineHeight: 1,
} as const;

const codeHeaderStyle = {
  alignItems: 'center',
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.75rem',
  justifyContent: 'space-between',
  padding: '0.85rem 1rem',
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

const groupCardStyle = {
  background: 'rgba(255, 255, 255, 0.58)',
  border: '1px solid rgba(16, 34, 54, 0.08)',
  borderRadius: '22px',
  boxShadow: '0 16px 32px rgba(24, 36, 49, 0.08)',
  padding: '22px 24px 24px',
} as const;

const compactCardStyle = {
  background: 'rgba(255, 255, 255, 0.74)',
  border: '1px solid rgba(16, 34, 54, 0.08)',
  borderRadius: '22px',
  boxShadow: '0 16px 32px rgba(24, 36, 49, 0.08)',
  padding: '22px 24px 24px',
} as const;

function SnippetCodeBlock({ item, onCopy, copyLabel }: { item: WorkshopItem; onCopy: () => void; copyLabel: string }) {
  return (
    <div style={codeBlockStyle}>
      <div style={codeHeaderStyle}>
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
          <button type="button" onClick={onCopy} style={codeActionStyle}>
            {copyLabel}
          </button>
        </div>
      </div>

      <div>
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
    </div>
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

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, WorkshopItem[]>);

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
    <EditorialPageFrame currentPath="/code-ai">
      <div className="editorial-home-page">
        <main className="editorial-home-content">
          <section className="editorial-page-hero" style={{ gap: 'clamp(1rem, 2.5vw, 2rem)' }}>
            <div className="editorial-page-hero-copy">
              <p className="editorial-home-kicker">Editorial archive</p>
              <h1 className="editorial-page-title" style={{ fontSize: 'clamp(2.2rem, 6vw, 5rem)' }}>
                {title}
              </h1>
              <p className="editorial-page-copy">{subtitle}</p>
              <p className="editorial-post-summary" style={{ marginTop: '14px', maxWidth: '48ch' }}>
                Browse snippets, configs, and tools as an archive of notes, references, and working code rather than a dashboard of metrics.
              </p>

              <div className="editorial-home-actions" style={{ marginTop: '1rem' }}>
                <Link href="#code-tools-index" className="editorial-home-button editorial-home-button-primary">
                  Browse the index
                </Link>
                <Link href="/search" className="editorial-home-button editorial-home-button-secondary">
                  Search the archive
                </Link>
              </div>
            </div>

            <aside
              className="editorial-page-aside"
              style={{
                padding: 'clamp(0.8rem, 2vw, 1.2rem)',
                background: 'rgba(255, 255, 255, 0.46)',
                boxShadow: 'none',
                alignSelf: 'start',
                maxWidth: '30rem',
              }}
            >
              <p className="editorial-home-card-label">Archive note</p>
              <p className="editorial-post-summary" style={{ marginTop: '10px' }}>
                Entries are arranged like reading notes: title first, then context, then source and
                code, so the page opens as an archive instead of a control panel.
              </p>
            </aside>
          </section>

          <section className="editorial-list-section" id="code-tools-index">
            <div className="editorial-list-heading">
              <p className="editorial-home-section-label">Browse</p>
              <h2 className="editorial-page-section-title">Search by title, tag, or category, then open an entry to keep the writeup and code together.</h2>
            </div>

            <div className="editorial-page-aside" style={{ marginBottom: '20px' }}>
              <div className="search-input-container" role="search" aria-label="Code & Tools search">
                <input
                  type="text"
                  placeholder="Search entries, tags, filenames, or descriptions..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="search-input-large"
                />
              </div>

              <div style={{ display: 'grid', gap: '14px', marginTop: '18px' }}>
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
                            ...categoryButtonStyle,
                            padding: '0.56rem 0.8rem',
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
                    Browse mode
                  </p>
                  <div className="editorial-chip-row" style={{ marginTop: 0 }}>
                    <button
                      type="button"
                      className="editorial-chip"
                      style={{
                        ...controlButtonStyle,
                        padding: '0.56rem 0.8rem',
                        background: viewMode === 'compact' ? 'rgba(16, 34, 54, 0.92)' : 'rgba(255,255,255,0.55)',
                        color: viewMode === 'compact' ? '#fff' : 'var(--editorial-ink)',
                        borderColor: 'rgba(16, 34, 54, 0.08)',
                      }}
                      onClick={() => setViewMode('compact')}
                      aria-pressed={viewMode === 'compact'}
                    >
                      Archive
                    </button>
                    <button
                      type="button"
                      className="editorial-chip"
                      style={{
                        ...controlButtonStyle,
                        padding: '0.56rem 0.8rem',
                        background: viewMode === 'full' ? 'rgba(16, 34, 54, 0.92)' : 'rgba(255,255,255,0.55)',
                        color: viewMode === 'full' ? '#fff' : 'var(--editorial-ink)',
                        borderColor: 'rgba(16, 34, 54, 0.08)',
                      }}
                      onClick={() => setViewMode('full')}
                      aria-pressed={viewMode === 'full'}
                    >
                      Reader
                    </button>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between', gap: '0.75rem', marginBottom: '18px' }}>
              <div className="editorial-post-summary" style={{ margin: 0 }}>
                Showing <strong>{filteredItems.length}</strong> of <strong>{allItems.length}</strong> items in <strong>{selectedCategoryLabel}</strong>
                {searchQuery ? <> for <strong>“{searchQuery}”</strong></> : null}
              </div>
              <div className="editorial-post-summary" style={{ margin: 0 }}>
                Archive mode keeps the index scannable. Reader mode keeps the writeup and code visible.
              </div>
            </div>

            {featuredItems.length > 0 && (
              <section style={{ marginBottom: '28px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', marginBottom: '12px' }}>
                  <h3 style={{ margin: 0, color: 'var(--editorial-ink)', fontFamily: 'Space Grotesk, Inter, sans-serif', fontSize: '1.35rem', letterSpacing: '-0.04em' }}>
                    Featured picks
                  </h3>
                  <span className="editorial-post-summary" style={{ margin: 0 }}>Curated snippets with the strongest editorial value.</span>
                </div>

                <div className="editorial-post-grid">
                  {featuredItems.slice(0, 3).map((item) => (
                    <article key={item.id} className="editorial-post-card" style={{ display: 'grid', gap: '12px' }}>
                      <div className="editorial-post-meta">
                        <span>{getCodeToolsLanguageLabel(item.language)}</span>
                        {item.date && <span>{formatCodeToolsDate(item.date)}</span>}
                        <span>{getCodeToolsItemLineCount(item)} lines</span>
                      </div>

                      <h2 style={{ fontSize: '1.55rem', marginBottom: 0 }}>
                        <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
                      </h2>

                      <p className="editorial-post-summary">{item.description}</p>

                      <div className="editorial-chip-row">
                        <span className="editorial-chip" style={{ background: 'rgba(33, 78, 230, 0.14)' }}>Featured</span>
                        <span className="editorial-chip">{item.filename || 'Inline snippet'}</span>
                        <span className="editorial-chip">{item.tags.length} tags</span>
                      </div>

                      <Link href={getCodeToolsUrl(item.id)} className="editorial-post-link">
                        Open detail page
                      </Link>
                    </article>
                  ))}
                </div>
              </section>
            )}

            {viewMode === 'compact' ? (
              <div style={{ display: 'grid', gap: '18px' }}>
                {Object.entries(groupedItems)
                  .sort(([, itemsA], [, itemsB]) => {
                    const latestA = itemsA[0]?.date ? new Date(itemsA[0].date).getTime() : 0;
                    const latestB = itemsB[0]?.date ? new Date(itemsB[0].date).getTime() : 0;
                    return latestB - latestA;
                  })
                  .map(([category, categoryItems]) => (
                    <section key={category} style={groupCardStyle}>
                      <h3 className="editorial-page-section-title" style={{ fontSize: '1.55rem', marginBottom: '18px', maxWidth: 'none' }}>
                        {categories.find((categoryConfig) => categoryConfig.id === category)?.label || category}
                        <span style={{ marginLeft: '0.5rem', color: 'var(--editorial-slate)', fontFamily: 'IBM Plex Mono, Roboto Mono, monospace', fontSize: '0.72rem', letterSpacing: '0.08em', textTransform: 'uppercase' }}>
                          ({categoryItems.length})
                        </span>
                      </h3>

                      <div style={{ display: 'grid', gap: '16px' }}>
                        {categoryItems.map((item) => {
                          const isExpanded = expandedItems.has(item.id);

                          return (
                            <article key={item.id} style={compactCardStyle}>
                              <div style={{ display: 'grid', gap: '14px' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap', alignItems: 'start' }}>
                                  <div style={{ maxWidth: '58ch' }}>
                                    <div className="editorial-post-meta" style={{ marginBottom: '8px' }}>
                                      {item.date && <span>{formatCodeToolsDate(item.date)}</span>}
                                      <span>{getCodeToolsLanguageLabel(item.language)}</span>
                                      <span>{getCodeToolsItemLineCount(item)} lines</span>
                                    </div>

                                    <h3 style={{ margin: 0, fontSize: '1.4rem' }}>
                                      <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
                                    </h3>
                                    <p className="editorial-post-summary" style={{ marginTop: '10px' }}>{item.description}</p>
                                  </div>

                                  {item.featured && (
                                    <span className="editorial-chip" style={{ background: 'rgba(33, 78, 230, 0.14)' }}>
                                      Featured
                                    </span>
                                  )}
                                </div>

                                <div className="editorial-chip-row" style={{ marginTop: 0 }}>
                                  {item.tags.slice(0, 4).map((tag) => (
                                    <span key={tag} className="editorial-chip">
                                      {tag}
                                    </span>
                                  ))}
                                </div>

                                <div className="editorial-home-actions" style={{ marginTop: 0 }}>
                                  <Link href={getCodeToolsUrl(item.id)} className="editorial-home-button editorial-home-button-secondary">
                                    Open detail page
                                  </Link>
                                  <button
                                    type="button"
                                    onClick={() => toggleExpanded(item.id)}
                                    className="editorial-home-button editorial-home-button-primary"
                                  >
                                    {isExpanded ? 'Hide preview' : 'Show preview'}
                                  </button>
                                </div>

                                {isExpanded && (
                                  <>
                                    {item.writeup && (
                                      <div className="item-writeup" style={{ background: 'rgba(255,255,255,0.45)', borderRadius: '18px', border: '1px solid rgba(16, 34, 54, 0.08)', padding: '1rem 1.05rem' }}>
                                        <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                                      </div>
                                    )}

                                    <SnippetCodeBlock
                                      item={item}
                                      onCopy={() => copyToClipboard(item.content, item.id)}
                                      copyLabel={copyStates[item.id] || 'Copy'}
                                    />
                                  </>
                                )}
                              </div>
                            </article>
                          );
                        })}
                      </div>
                    </section>
                  ))}
              </div>
            ) : (
              <div className="editorial-post-grid">
                {filteredItems.map((item) => {
                  return (
                    <article key={item.id} className="editorial-post-card" style={{ display: 'grid', gap: '16px' }}>
                      <div className="editorial-post-meta">
                        {item.category && (
                          <span>{categories.find((category) => category.id === item.category)?.label || item.category}</span>
                        )}
                        {item.date && <span>{formatCodeToolsDate(item.date)}</span>}
                        <span>{getCodeToolsLanguageLabel(item.language)}</span>
                        <span>{getCodeToolsItemLineCount(item)} lines</span>
                      </div>

                      <h2 style={{ fontSize: '1.55rem', marginBottom: 0 }}>
                        <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
                      </h2>
                      <p className="editorial-post-summary">{item.description}</p>

                      <div className="editorial-chip-row">
                        {item.featured && (
                          <span className="editorial-chip" style={{ background: 'rgba(33, 78, 230, 0.14)' }}>
                            Featured
                          </span>
                        )}
                        {item.filename && <span className="editorial-chip">{item.filename}</span>}
                        {item.tags.slice(0, 4).map((tag) => (
                          <span key={tag} className="editorial-chip">
                            {tag}
                          </span>
                        ))}
                      </div>

                      {item.writeup && (
                        <div className="item-writeup" style={{ background: 'rgba(255,255,255,0.45)', borderRadius: '18px', border: '1px solid rgba(16, 34, 54, 0.08)', padding: '1rem 1.05rem' }}>
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                        </div>
                      )}

                      <SnippetCodeBlock
                        item={item}
                        onCopy={() => copyToClipboard(item.content, item.id)}
                        copyLabel={copyStates[item.id] || 'Copy'}
                      />

                      <Link href={getCodeToolsUrl(item.id)} className="editorial-post-link">
                        Read detail
                      </Link>
                    </article>
                  );
                })}
              </div>
            )}

            {filteredItems.length === 0 && (
              <div className="editorial-page-aside" style={{ marginTop: '20px' }}>
                <p className="editorial-home-card-label">No matches</p>
                <p className="editorial-post-summary" style={{ marginTop: '10px' }}>
                  No snippets match the current filter. Try a different category, clear the search, or switch to Reader mode to browse the whole collection.
                </p>
              </div>
            )}
          </section>
        </main>
      </div>
    </EditorialPageFrame>
  );
}
