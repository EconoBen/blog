'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
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
    setCopyStates((prev) => ({ ...prev, [itemId]: 'Copied!' }));
    setTimeout(() => {
      setCopyStates((prev) => ({ ...prev, [itemId]: 'Copy' }));
    }, 2000);
  };

  return (
    <div className="code-ai-container">
      <div className="code-ai-header">
        <p style={{ margin: 0, textTransform: 'uppercase', letterSpacing: '0.16em', fontSize: '0.72rem', opacity: 0.72 }}>
          Reference library
        </p>
        <h1>{title}</h1>
        <p className="code-ai-subtitle">{subtitle}</p>

        <div
          style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
            gap: '0.85rem',
            marginTop: '1.25rem',
          }}
        >
          <div style={{ padding: '1rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.7 }}>Snippets</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.35rem' }}>{allItems.length}</div>
          </div>
          <div style={{ padding: '1rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.7 }}>Active categories</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.35rem' }}>{activeCategoryCount}</div>
          </div>
          <div style={{ padding: '1rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.7 }}>Featured</div>
            <div style={{ fontSize: '1.35rem', fontWeight: 700, marginTop: '0.35rem' }}>{featuredItems.length}</div>
          </div>
          <div style={{ padding: '1rem 1.1rem', borderRadius: '14px', background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div style={{ fontSize: '0.72rem', textTransform: 'uppercase', letterSpacing: '0.14em', opacity: 0.7 }}>Latest</div>
            <div style={{ fontSize: '1rem', fontWeight: 700, marginTop: '0.35rem' }}>
              {latestItem ? formatCodeToolsDate(latestItem.date, { month: 'short', day: 'numeric', year: 'numeric' }) : 'No items yet'}
            </div>
          </div>
        </div>
      </div>

      <div className="code-ai-controls">
        <div className="code-ai-search">
          <input
            type="text"
            placeholder="Search snippets..."
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            className="code-ai-search-input"
          />
        </div>

        <div className="code-ai-view-toggle">
          <button
            className={`view-toggle-btn ${viewMode === 'compact' ? 'active' : ''}`}
            onClick={() => setViewMode('compact')}
            title="Compact view"
            type="button"
          >
            ☰
          </button>
          <button
            className={`view-toggle-btn ${viewMode === 'full' ? 'active' : ''}`}
            onClick={() => setViewMode('full')}
            title="Full view"
            type="button"
          >
            ⊞
          </button>
        </div>
      </div>

      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '0.75rem',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '1rem',
        }}
      >
        <div style={{ opacity: 0.84 }}>
          Showing <strong>{filteredItems.length}</strong> of <strong>{allItems.length}</strong> items in <strong>{selectedCategoryLabel}</strong>
          {searchQuery ? <> for <strong>“{searchQuery}”</strong></> : null}
        </div>
        <div style={{ opacity: 0.72 }}>
          Browse the compact list for quick scanning, or open an item to read the note and copy the code.
        </div>
      </div>

      {featuredItems.length > 0 && (
        <section style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: '1rem', marginBottom: '0.75rem' }}>
            <h2 style={{ margin: 0, fontSize: '1.05rem' }}>Featured picks</h2>
            <span style={{ opacity: 0.7, fontSize: '0.92rem' }}>Handpicked snippets that show the collection at its best.</span>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.85rem' }}>
            {featuredItems.slice(0, 3).map((item) => (
              <article key={item.id} style={{ padding: '1rem 1.1rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.08)', background: 'rgba(255,255,255,0.035)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.75rem', alignItems: 'start' }}>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '1rem' }}>
                      <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
                    </h3>
                    <p style={{ margin: '0.45rem 0 0', opacity: 0.8 }}>{item.description}</p>
                  </div>
                  {item.date && (
                    <span className="date-badge" style={{ whiteSpace: 'nowrap' }}>
                      {formatCodeToolsDate(item.date, { month: 'short', day: 'numeric' })}
                    </span>
                  )}
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', marginTop: '0.85rem', opacity: 0.85 }}>
                  <span className="language-badge">{getCodeToolsLanguageLabel(item.language)}</span>
                  <span className="date-badge">{getCodeToolsItemLineCount(item)} lines</span>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <div className="code-ai-layout">
        <aside className="code-ai-sidebar">
          <h3>Categories</h3>
          <nav className="code-ai-nav">
            {categories.map((category) => {
              const count = category.id === 'all' ? allItems.length : categoryCounts[category.id] ?? 0;

              return (
                <button
                  key={category.id}
                  className={`code-ai-nav-item ${selectedCategory === category.id ? 'active' : ''}`}
                  onClick={() => setSelectedCategory(category.id)}
                  type="button"
                >
                  <span className="nav-icon">{category.icon}</span>
                  <span className="nav-label">{category.label}</span>
                  <span className="nav-count">{count}</span>
                </button>
              );
            })}
          </nav>
        </aside>

        <main className="code-ai-main">
          {viewMode === 'compact' ? (
            <div className="code-ai-list">
              {Object.entries(groupedItems)
                .sort(([, itemsA], [, itemsB]) => {
                  const latestA = itemsA[0]?.date ? new Date(itemsA[0].date).getTime() : 0;
                  const latestB = itemsB[0]?.date ? new Date(itemsB[0].date).getTime() : 0;
                  return latestB - latestA;
                })
                .map(([category, categoryItems]) => (
                  <div key={category} className="code-ai-category-group">
                    <h3 className="category-group-title">
                      {categories.find((categoryConfig) => categoryConfig.id === category)?.label || category}
                      <span style={{ marginLeft: '0.5rem', opacity: 0.65, fontSize: '0.9rem' }}>
                        ({categoryItems.length})
                      </span>
                    </h3>
                    {categoryItems.map((item) => (
                      <div key={item.id} className="code-ai-item-compact">
                        <div className="item-header" onClick={() => toggleExpanded(item.id)}>
                          <div className="item-title-row">
                            <span className="expand-icon">
                              {expandedItems.has(item.id) ? '▼' : '▶'}
                            </span>
                            <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                              <Link href={getCodeToolsUrl(item.id)} onClick={(event) => event.stopPropagation()}>
                                {item.title}
                              </Link>
                              {item.featured && (
                                <span className="date-badge" style={{ background: 'rgba(255, 193, 7, 0.18)' }}>
                                  Featured
                                </span>
                              )}
                            </h4>
                            <div className="item-badges">
                              {item.date && (
                                <span className="date-badge">
                                  {formatCodeToolsDate(item.date)}
                                </span>
                              )}
                              <span className={`language-badge ${normalizeCodeToolsLanguage(item.language)}`}>
                                {getCodeToolsLanguageLabel(item.language)}
                              </span>
                              {item.filename && (
                                <span className="date-badge" title="Source filename">
                                  {item.filename}
                                </span>
                              )}
                            </div>
                          </div>
                          <p className="item-description">{item.description}</p>
                        </div>

                        {expandedItems.has(item.id) && (
                          <div className="item-expanded">
                            {item.writeup && (
                              <div className="item-writeup">
                                <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                              </div>
                            )}
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.6rem', margin: '0 0 0.9rem', opacity: 0.9 }}>
                              <Link href={getCodeToolsUrl(item.id)} style={{ textDecoration: 'none', fontWeight: 600 }}>
                                Open detail page
                              </Link>
                              <span>•</span>
                              <span>{getCodeToolsItemLineCount(item)} lines</span>
                              <span>•</span>
                              <span>{item.tags.length} tags</span>
                            </div>
                            <div className="code-block">
                              <div className="code-header">
                                <div className="code-filename">{getCodeToolsLanguageLabel(item.language)}</div>
                                <div className="code-actions">
                                  {item.gistUrl && (
                                    <a
                                      href={item.gistUrl}
                                      target="_blank"
                                      rel="noopener noreferrer"
                                      className="code-action gist-link"
                                      title="View on GitHub"
                                    >
                                      <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                                        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                                      </svg>
                                      Gist
                                    </a>
                                  )}
                                  <button
                                    className="code-action"
                                    onClick={() => copyToClipboard(item.content, item.id)}
                                    type="button"
                                  >
                                    {copyStates[item.id] || 'Copy'}
                                  </button>
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
                                    fontSize: '0.875rem',
                                    lineHeight: '1.6',
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
                            <div className="item-footer">
                              <div className="item-tags">
                                {item.tags.map((tag: string) => (
                                  <span key={tag} className="tag">
                                    #{tag}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                ))}
            </div>
          ) : (
            <div className="code-ai-grid">
              {filteredItems.map((item) => (
                <div key={item.id} className="code-ai-card">
                  <div className="code-ai-card-header">
                    <h3>
                      <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
                    </h3>
                    <div className="code-ai-card-badges">
                      {item.featured && (
                        <span className="code-ai-date" style={{ background: 'rgba(255, 193, 7, 0.18)' }}>
                          Featured
                        </span>
                      )}
                      {item.date && (
                        <span className="code-ai-date">
                          {formatCodeToolsDate(item.date)}
                        </span>
                      )}
                      {item.filename && (
                        <span className="code-ai-date">
                          {item.filename}
                        </span>
                      )}
                    </div>
                  </div>

                  <p className="code-ai-card-description">{item.description}</p>

                  {item.writeup && (
                    <div className="item-writeup">
                      <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                    </div>
                  )}

                  <div className="code-block">
                    <div className="code-header">
                      <div className="code-filename">{getCodeToolsLanguageLabel(item.language)}</div>
                      <div className="code-actions">
                        {item.gistUrl && (
                          <a
                            href={item.gistUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="code-action gist-link"
                            title="View on GitHub"
                          >
                            <svg width="14" height="14" viewBox="0 0 16 16" fill="currentColor">
                              <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
                            </svg>
                            Gist
                          </a>
                        )}
                        <button
                          className="code-action"
                          onClick={() => copyToClipboard(item.content, item.id)}
                          type="button"
                        >
                          {copyStates[item.id] || 'Copy'}
                        </button>
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
                          fontSize: '0.875rem',
                          lineHeight: '1.6',
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

                  <div className="code-ai-card-footer">
                    <div className="code-ai-tags">
                      {item.tags.map((tag: string) => (
                        <span key={tag} className="code-ai-tag">
                          #{tag}
                        </span>
                      ))}
                    </div>
                    <Link href={getCodeToolsUrl(item.id)} className="code-ai-card-link">
                      Read detail
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="code-ai-empty" style={{ padding: '2rem 1.5rem' }}>
              <p style={{ margin: 0, fontSize: '1.05rem' }}>No snippets match the current filter.</p>
              <p style={{ marginTop: '0.5rem', opacity: 0.75 }}>
                Try a different category, clear the search, or switch to full view to browse the whole collection.
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
