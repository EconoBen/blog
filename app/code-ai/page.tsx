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

function SnippetCodeBlock({ item, onCopy, copyLabel }: { item: WorkshopItem; onCopy: () => void; copyLabel: string }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_16px_32px_rgba(29,28,22,0.06)]">
      <div className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
        <div className="space-y-0.5">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            {getCodeToolsLanguageLabel(item.language)}
          </p>
          <p className="font-body text-sm text-secondary">
            {item.filename || 'Inline snippet'}
          </p>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {item.gistUrl && (
            <a
              href={item.gistUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center rounded-full bg-surface-container-low px-3 py-1.5 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
            >
              Gist
            </a>
          )}
          <button
            type="button"
            onClick={onCopy}
            className="inline-flex items-center justify-center rounded-full bg-surface-container-low px-3 py-1.5 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
          >
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
          customStyle={{
            margin: 0,
            padding: '1rem',
            fontSize: '0.88rem',
            lineHeight: '1.7',
            background: 'transparent',
          }}
          codeTagProps={{
            style: {
              fontFamily: "'IBM Plex Mono', 'Consolas', 'Monaco', monospace",
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
  const categoryLabelById = Object.fromEntries(categories.map((category) => [category.id, category.label]));
  const visibleCategories = categories.filter((category) => (
    category.id === 'all' || (categoryCounts[category.id] ?? 0) > 0
  ));

  const filteredItems = allItems.filter((item: WorkshopItem) => {
    const query = searchQuery.toLowerCase();
    const matchesCategory = selectedCategory === 'all' || item.category === selectedCategory;
    const categoryLabel = categoryLabelById[item.category] ?? item.category;
    const matchesSearch =
      query === '' ||
      item.title.toLowerCase().includes(query) ||
      item.description.toLowerCase().includes(query) ||
      item.tags.some((tag: string) => tag.toLowerCase().includes(query)) ||
      item.filename?.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query) ||
      categoryLabel.toLowerCase().includes(query);

    return matchesCategory && matchesSearch;
  });

  const selectedCategoryLabel = categoryLabelById[selectedCategory] ?? 'All';
  // Featured items are now integrated into the main index
  const selectedCount = filteredItems.length;

  const groupedItems = filteredItems.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }

    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, WorkshopItem[]>);
  const orderedGroupEntries = Object.entries(groupedItems).sort(([, itemsA], [, itemsB]) => {
    const countA = itemsA.length;
    const countB = itemsB.length;

    if (countA !== countB) {
      return countB - countA;
    }

    const latestA = itemsA[0]?.date ? new Date(itemsA[0].date).getTime() : 0;
    const latestB = itemsB[0]?.date ? new Date(itemsB[0].date).getTime() : 0;

    if (latestA !== latestB) {
      return latestB - latestA;
    }

    const labelA = categoryLabelById[itemsA[0]?.category ?? ''] || itemsA[0]?.category || '';
    const labelB = categoryLabelById[itemsB[0]?.category ?? ''] || itemsB[0]?.category || '';
    return labelA.localeCompare(labelB);
  });
  const orderedVisibleCategories = visibleCategories
    .filter((category) => category.id !== 'all')
    .sort((a, b) => {
      const countA = categoryCounts[a.id] ?? 0;
      const countB = categoryCounts[b.id] ?? 0;

      if (countA !== countB) {
        return countB - countA;
      }

      return a.label.localeCompare(b.label);
    });

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
      <section className="mx-auto max-w-[1440px] px-8 pb-14 pt-2">
        {/* Hero */}
        <div className="space-y-5 py-12 md:py-16">
          <div className="max-w-[58rem] space-y-4">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Editorial archive</p>
            <h1 className="font-headline text-[clamp(2.2rem,6vw,5rem)] font-bold tracking-tight text-on-surface">
              {title}
            </h1>
            <p className="max-w-[46rem] font-body text-lg leading-relaxed text-secondary">
              {subtitle}
            </p>
          </div>
        </div>

        {/* Browse and filter — full index */}
        <section className="border-t border-outline-variant/20 pt-6 pb-12 md:pt-8 md:pb-16" id="code-tools-index">
          <div className="space-y-5">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <div className="space-y-1">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Browse and filter</p>
                <h2 className="max-w-[22ch] font-headline text-[clamp(1.3rem,2.5vw,1.8rem)] font-bold tracking-tight text-on-surface">
                  Search by title, tag, filename, or category.
                </h2>
              </div>
              <p className="max-w-[24ch] font-body text-sm leading-relaxed text-secondary">
                The list below is the archive. Use filters only when you need to narrow it.
              </p>
            </div>

            <div className="space-y-3 rounded-2xl border border-outline-variant/15 bg-surface-container-low p-4 shadow-[0_18px_50px_rgba(29,28,22,0.04)]">
              <div role="search" aria-label="Code & Tools search">
                <input
                  type="text"
                  placeholder="Search entries, tags, filenames, or descriptions..."
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  className="w-full rounded-xl border border-outline-variant/15 bg-surface-container-lowest px-4 py-3 font-body text-base text-on-surface placeholder:text-secondary/60 focus:border-primary/30 focus:outline-none focus:ring-2 focus:ring-primary/10"
                />
              </div>

              <div className="flex flex-wrap items-center gap-3">
                <div className="flex flex-wrap gap-2">
                  {orderedVisibleCategories.map((category) => {
                    const count = category.id === 'all' ? allItems.length : categoryCounts[category.id] ?? 0;
                    const active = selectedCategory === category.id;

                    return (
                      <button
                        key={category.id}
                        type="button"
                        onClick={() => setSelectedCategory(category.id)}
                        className={`inline-flex shrink-0 items-center gap-1.5 rounded-full px-3.5 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                          active
                            ? 'bg-surface-container-highest text-on-surface'
                            : 'bg-surface-container-low text-secondary hover:bg-secondary-container hover:text-primary'
                        }`}
                        aria-pressed={active}
                      >
                        <span>{category.icon}</span>
                        <span>{category.label}</span>
                        <span>({count})</span>
                      </button>
                    );
                  })}
                </div>

                <div className="flex items-center gap-2 rounded-full border border-outline-variant/15 bg-surface-container-lowest/80 p-1">
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      viewMode === 'compact'
                        ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                    onClick={() => setViewMode('compact')}
                    aria-pressed={viewMode === 'compact'}
                  >
                    Archive
                  </button>
                  <button
                    type="button"
                    className={`rounded-full px-3 py-2 font-label text-[11px] font-bold uppercase tracking-wider transition-colors ${
                      viewMode === 'full'
                        ? 'bg-surface-container-lowest text-on-surface shadow-sm'
                        : 'text-secondary hover:text-on-surface'
                    }`}
                    onClick={() => setViewMode('full')}
                    aria-pressed={viewMode === 'full'}
                  >
                    Reader
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center justify-between gap-3 py-5">
            <p className="font-body text-sm text-secondary">
              Showing <strong className="text-on-surface">{filteredItems.length}</strong> of <strong className="text-on-surface">{allItems.length}</strong> items in <strong className="text-on-surface">{selectedCategoryLabel}</strong>
              {searchQuery ? <> for <strong className="text-on-surface">&ldquo;{searchQuery}&rdquo;</strong></> : null}
            </p>
          </div>

          {viewMode === 'compact' ? (
            <div className="space-y-8">
              {orderedGroupEntries.map(([category, categoryItems]) => (
                <section
                  key={category}
                  className="rounded-2xl border border-outline-variant/15 bg-surface-container-highest p-5 shadow-[0_18px_50px_rgba(29,28,22,0.04)]"
                >
                  <div className="mb-5 flex flex-wrap items-baseline justify-between gap-4">
                    <h3 className="font-headline text-xl font-bold text-on-surface">
                      {categoryLabelById[category] || category}
                      <span className="ml-2 font-label text-[10px] font-bold uppercase tracking-widest text-secondary">
                        ({categoryItems.length})
                      </span>
                    </h3>
                    <p className="max-w-[28ch] font-body text-sm leading-relaxed text-secondary">
                      Browse the strongest entries in this thread, then open the writeup or source from the detail page.
                    </p>
                  </div>

                  <div className="space-y-4">
                    {categoryItems.map((item) => {
                      const isExpanded = expandedItems.has(item.id);

                      return (
                        <article
                          key={item.id}
                          className="rounded-2xl border border-outline-variant/15 bg-surface-container-low p-5 shadow-[0_18px_50px_rgba(29,28,22,0.04)]"
                        >
                          <div className="space-y-4">
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div className="max-w-[58ch] space-y-2">
                                <div className="flex flex-wrap items-center gap-3">
                                  {item.date && (
                                    <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                                      {formatCodeToolsDate(item.date)}
                                    </span>
                                  )}
                                  <span className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary">
                                    {getCodeToolsLanguageLabel(item.language)}
                                  </span>
                                  <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                                    {getCodeToolsItemLineCount(item)} lines
                                  </span>
                                </div>

                                <h3 className="font-headline text-xl font-bold leading-snug text-on-surface">
                                  <Link href={getCodeToolsUrl(item.id)} className="transition-colors hover:text-primary">
                                    {item.title}
                                  </Link>
                                </h3>
                                <p className="font-body text-base leading-relaxed text-secondary">{item.description}</p>
                              </div>

                              {item.featured && (
                                <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface">
                                  Featured
                                </span>
                              )}
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {item.tags.slice(0, 4).map((tag) => (
                                <span
                                  key={tag}
                                  className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface"
                                >
                                  {tag}
                                </span>
                              ))}
                            </div>

                            <div className="flex flex-wrap gap-3">
                              <Link
                                href={getCodeToolsUrl(item.id)}
                                className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
                              >
                                Open detail page
                              </Link>
                              <button
                                type="button"
                                onClick={() => toggleExpanded(item.id)}
                                className="inline-flex items-center justify-center rounded-lg bg-on-surface px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-surface"
                              >
                                {isExpanded ? 'Hide preview' : 'Show preview'}
                              </button>
                            </div>

                            {isExpanded && (
                              <div className="space-y-4 pt-2">
                                {item.writeup && (
                                  <div className="item-writeup rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5">
                                    <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                                  </div>
                                )}

                                <SnippetCodeBlock
                                  item={item}
                                  onCopy={() => copyToClipboard(item.content, item.id)}
                                  copyLabel={copyStates[item.id] || 'Copy'}
                                />
                              </div>
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
            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
              {filteredItems.map((item) => {
                return (
                  <article
                    key={item.id}
                    className="group rounded-2xl border border-outline-variant/15 bg-surface-container-highest p-6 shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1"
                  >
                    <div className="space-y-4">
                      <div className="flex flex-wrap items-center gap-3">
                        {item.category && (
                          <span className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary">
                            {categoryLabelById[item.category] || item.category}
                          </span>
                        )}
                        {item.date && (
                          <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                            {formatCodeToolsDate(item.date)}
                          </span>
                        )}
                        <span className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary">
                          {getCodeToolsLanguageLabel(item.language)}
                        </span>
                        <span className="font-label text-[10px] uppercase tracking-widest text-secondary">
                          {getCodeToolsItemLineCount(item)} lines
                        </span>
                      </div>

                      <h2 className="font-headline text-2xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
                        <Link href={getCodeToolsUrl(item.id)}>{item.title}</Link>
                      </h2>
                      <p className="font-body text-base leading-relaxed text-secondary">{item.description}</p>

                      <div className="flex flex-wrap gap-2">
                        {item.featured && (
                          <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface">
                            Featured
                          </span>
                        )}
                        {item.filename && (
                          <span className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface">
                            {item.filename}
                          </span>
                        )}
                        {item.tags.slice(0, 4).map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      {item.writeup && (
                        <div className="item-writeup rounded-2xl border border-outline-variant/15 bg-surface-container-lowest p-5">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>{item.writeup}</ReactMarkdown>
                        </div>
                      )}

                      <SnippetCodeBlock
                        item={item}
                        onCopy={() => copyToClipboard(item.content, item.id)}
                        copyLabel={copyStates[item.id] || 'Copy'}
                      />

                      <Link
                        href={getCodeToolsUrl(item.id)}
                        className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
                      >
                        Read detail
                      </Link>
                    </div>
                  </article>
                );
              })}
            </div>
          )}

          {filteredItems.length === 0 && (
            <div className="mt-5 rounded-2xl bg-surface-container-low p-10 text-center">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">No matches</p>
              <p className="mt-3 font-body text-base leading-relaxed text-secondary">
                No snippets match the current filter. Try a different category, clear the search, or switch to Reader mode to browse the whole collection.
              </p>
            </div>
          )}
        </section>
      </section>
    </EditorialPageFrame>
  );
}
