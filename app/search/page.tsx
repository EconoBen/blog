'use client';

import type { FormEvent } from 'react';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import type { SearchResult } from '../services/UnifiedSearchService';

function formatResultDate(date?: Date | string) {
  if (!date) {
    return null;
  }

  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  }).format(new Date(date));
}

const resultTypeOrder: SearchResult['type'][] = ['post', 'publication', 'talk', 'code-ai'];

const typeLabels: Record<SearchResult['type'], string> = {
  post: 'Posts',
  publication: 'Publications',
  talk: 'Talks',
  'code-ai': 'Code & Tools',
};

const quickQueries = ['memory', 'retrieval', 'economics', 'tooling'];

function groupResultsByType(results: SearchResult[]) {
  const groups = new Map<SearchResult['type'], SearchResult[]>();

  results.forEach((result) => {
    const typeResults = groups.get(result.type) ?? [];
    typeResults.push(result);
    groups.set(result.type, typeResults);
  });

  return resultTypeOrder
    .filter((type) => groups.has(type))
    .map((type) => ({
      type,
      results: groups.get(type) ?? [],
    }));
}

function SearchContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get('q') || '';
  const normalizedQuery = query.trim();

  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setSearchQuery(query);

    const performSearch = async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setResults([]);
        return;
      }

      setLoading(true);
      try {
        const response = await fetch(`/api/search?q=${encodeURIComponent(searchTerm)}`);
        const data = await response.json();
        setResults(data.results || []);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      } finally {
        setLoading(false);
      }
    };

    if (query) {
      void performSearch(query);
      return;
    }

    setResults([]);
  }, [query]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextQuery = searchQuery.trim();
    if (!nextQuery) {
      router.replace('/search');
      return;
    }

    router.replace(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  const groupedResults = groupResultsByType(results);

  return (
    <EditorialPageFrame currentPath="/search">
      <main className="mx-auto min-h-screen max-w-7xl px-8 py-16">
        <header className="mb-16 max-w-3xl">
          <div className="mb-4 block font-label text-xs font-bold uppercase tracking-widest text-secondary">
            Search &amp; Discovery
          </div>
          <h1 className="mb-8 font-headline text-5xl font-black tracking-tighter text-on-surface">
            Search the archives.
          </h1>

          <form action="/search" className="group relative" onSubmit={handleSearch} role="search" aria-label="Site search">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
              <span className="material-symbols-outlined text-secondary" aria-hidden="true">search</span>
            </div>
            <input
              autoFocus
              className="block w-full rounded-xl bg-surface-container-lowest py-6 pl-16 pr-6 font-body text-xl text-on-surface shadow-[0_2px_15px_rgba(0,0,0,0.02)] placeholder:text-secondary focus:outline-none"
              name="q"
              onChange={(event) => setSearchQuery(event.target.value)}
              placeholder="Search for posts, talks, publications, or tools..."
              type="text"
              value={searchQuery}
            />
            <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-500 group-focus-within:scale-x-100" />
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <span className="mr-2 self-center font-label text-[10px] uppercase tracking-widest text-secondary">
              Quick Queries:
            </span>
            {quickQueries.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-surface-container-low px-4 py-1.5 font-label text-xs font-semibold text-secondary transition-colors hover:bg-secondary-container hover:text-on-secondary-container"
              >
                {term}
              </Link>
            ))}
          </div>
        </header>

        <div className="grid grid-cols-1 gap-16 md:grid-cols-12">
          <div className="space-y-12 md:col-span-8">
            {!normalizedQuery ? (
              <section className="rounded-xl bg-surface-container-highest p-10">
                <h2 className="mb-4 font-headline text-2xl font-bold text-on-surface">Start with a topic or title.</h2>
                <p className="mb-6 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                  Search across posts, talks, publications, and code notes without leaving the editorial surface.
                </p>
                <div className="flex flex-wrap gap-3">
                  {quickQueries.concat(['forecasting', 'llm']).map((term) => (
                    <Link
                      key={term}
                      href={`/search?q=${encodeURIComponent(term)}`}
                      className="rounded-full bg-surface px-4 py-2 font-label text-xs font-bold uppercase tracking-widest text-secondary transition-colors hover:bg-surface-container-low hover:text-on-surface"
                    >
                      {term}
                    </Link>
                  ))}
                </div>
              </section>
            ) : loading ? (
              <section className="rounded-xl bg-surface-container-highest p-10">
                <p className="font-headline text-xl font-bold text-on-surface">Searching…</p>
                <p className="mt-3 font-body text-base text-on-surface-variant">
                  Gathering results for “{normalizedQuery}”.
                </p>
              </section>
            ) : results.length === 0 ? (
              <section className="rounded-xl bg-surface-container-highest p-10">
                <h2 className="font-headline text-2xl font-bold text-on-surface">No results for “{normalizedQuery}”.</h2>
                <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant">
                  Try a broader phrase, a specific title fragment, or one of the suggested topics in the sidebar.
                </p>
              </section>
            ) : (
              groupedResults.map(({ type, results: typeResults }) => (
                <section key={type}>
                  <div className="mb-8 flex items-center justify-between">
                    <h2 className="flex items-center gap-2 font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                      <span className="h-px w-8 bg-outline-variant" />
                      {typeLabels[type]}
                    </h2>
                    <span className="text-xs italic text-secondary">
                      Showing {typeResults.length} result{typeResults.length === 1 ? '' : 's'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {typeResults.map((result) => (
                      <article
                        key={`${result.type}-${result.url}`}
                        className="-mx-8 rounded-xl p-8 transition-all duration-300 hover:bg-surface-container-low"
                      >
                        <Link href={result.url} className="block">
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="rounded bg-primary-fixed px-2 py-0.5 font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                                {result.type}
                              </span>
                              {result.date ? (
                                <time className="font-label text-xs text-secondary">
                                  {formatResultDate(result.date)}
                                </time>
                              ) : null}
                            </div>
                            <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface transition-colors hover:text-primary">
                              {result.title}
                            </h3>
                            {result.description ? (
                              <p className="max-w-2xl text-lg leading-relaxed text-on-surface-variant">
                                {result.description}
                              </p>
                            ) : null}
                            {result.tags && result.tags.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {result.tags.slice(0, 4).map((tag) => (
                                  <span
                                    key={`${result.url}-${tag}`}
                                    className="rounded-sm bg-surface-container-highest px-2 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary"
                                  >
                                    {tag}
                                  </span>
                                ))}
                              </div>
                            ) : null}
                          </div>
                        </Link>
                      </article>
                    ))}
                  </div>
                </section>
              ))
            )}
          </div>

          <aside className="space-y-12 md:col-span-4">
            <div className="rounded-xl bg-surface-container-low p-8">
              <h2 className="mb-6 font-headline text-lg font-bold">Search Status</h2>
              <div className="space-y-4">
                {[
                  ['Query', normalizedQuery || 'None'],
                  ['Results', loading ? '…' : `${results.length}`],
                  ['Sections', `${groupedResults.length}`],
                ].map(([label, value]) => (
                  <div key={label} className="flex items-center justify-between border-b border-outline-variant/20 pb-3">
                    <span className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</span>
                    <span className="font-headline text-base font-bold text-on-surface">{value}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-xl bg-surface p-8">
              <h2 className="mb-4 font-headline text-lg font-bold">Try searching for</h2>
              <div className="flex flex-wrap gap-2">
                {quickQueries.concat(['openai', 'python']).map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-md bg-surface-container-low px-3 py-2 font-label text-xs text-on-surface-variant transition-colors hover:bg-surface-container-high"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>

            <div className="rounded-xl border border-outline-variant/20 bg-surface p-8">
              <h2 className="mb-4 font-headline text-lg font-bold">Browse instead</h2>
              <div className="flex flex-col gap-3">
                <Link href="/archive" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Open archive
                </Link>
                <Link href="/tags" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Browse tags
                </Link>
                <Link href="/code-ai" className="font-label text-xs font-bold uppercase tracking-widest text-primary">
                  Code &amp; tools
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </main>
    </EditorialPageFrame>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="loading">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
