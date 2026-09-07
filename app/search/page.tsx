'use client';

import type { FormEvent } from 'react';
import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import type { SearchResult } from '../services/UnifiedSearchService';
import '../styles/editorial-index.css';

const longDateFormatter = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
});

function formatResultDate(date?: Date | string) {
  if (!date) {
    return null;
  }

  return longDateFormatter.format(new Date(date));
}

const resultTypeOrder: SearchResult['type'][] = ['tag', 'post', 'publication', 'talk', 'code-ai'];

const typeLabels: Record<SearchResult['type'], string> = {
  tag: 'Tags',
  post: 'Posts',
  publication: 'Publications',
  talk: 'Talks',
  'code-ai': 'Code & Tools',
};

const quickQueries = ['memory', 'retrieval', 'economics', 'tooling'];
const starterTips = [
  ['Specific titles', 'Use part of a post or talk title when you know the wording already.'],
  ['Subjects', 'Try themes like memory, retrieval, or economics to widen the result set.'],
  ['People', 'Find conversations, papers, and projects by a contributor’s name.'],
];

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
  const [loading, setLoading] = useState(Boolean(normalizedQuery));
  const [error, setError] = useState(false);
  const [retry, setRetry] = useState(0);
  const [searchQuery, setSearchQuery] = useState(query);

  useEffect(() => {
    setSearchQuery(query);
    setError(false);

    const abortController = new AbortController();

    const performSearch = async (searchTerm: string) => {
      if (!searchTerm.trim()) {
        setResults([]);
        setLoading(false);
        return;
      }

      setLoading(true);
      setResults([]);
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchTerm)}`,
          { signal: abortController.signal },
        );
        if (!response.ok) throw new Error('Search is unavailable');
        const data = await response.json();
        if (!Array.isArray(data.results)) throw new Error('Invalid search response');
        if (!abortController.signal.aborted) {
          setResults(data.results);
        }
      } catch {
        if (!abortController.signal.aborted) {
          setError(true);
          setResults([]);
        }
      } finally {
        if (!abortController.signal.aborted) {
          setLoading(false);
        }
      }
    };

    if (normalizedQuery) {
      void performSearch(normalizedQuery);
      return () => { abortController.abort(); };
    }

    setResults([]);
    setLoading(false);
    return () => { abortController.abort(); };
  }, [query, normalizedQuery, retry]);

  const handleSearch = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const nextQuery = searchQuery.trim();
    if (!nextQuery) {
      router.replace('/search');
      return;
    }

    if (nextQuery === normalizedQuery) setRetry((value) => value + 1);
    router.replace(`/search?q=${encodeURIComponent(nextQuery)}`);
  };

  const groupedResults = groupResultsByType(results);

  return (
    <EditorialPageFrame currentPath="/search" pageClassName="editorial-search-page">
      <div className="mx-auto min-h-screen max-w-7xl px-5 py-10 md:px-8 md:py-20">
        <header className="mb-12 max-w-3xl">
          <div className="mb-4 block font-label text-xs font-bold uppercase tracking-widest text-secondary">
            Search &amp; Discovery
          </div>
          <h1 className="mb-5 font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
            Search the archive.
          </h1>
          <p className="max-w-2xl font-body text-lg leading-relaxed text-on-surface-variant md:text-xl">
            Find an essay, a conversation, or a tool. Search by subject, title, or a phrase you remember.
          </p>

          <form action="/search" className="editorial-search-form group relative mt-7 flex items-stretch gap-3" onSubmit={handleSearch} role="search" aria-label="Site search">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-6">
              <svg
                aria-hidden="true"
                className="h-5 w-5 text-secondary"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.75"
                viewBox="0 0 24 24"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m20 20-3.5-3.5" strokeLinecap="round" />
              </svg>
            </div>
            <input
              className="block min-w-0 flex-1 rounded-lg bg-surface-container-lowest py-5 pl-16 pr-6 font-body text-lg text-on-surface shadow-[0_2px_15px_rgba(0,0,0,0.02)] placeholder:text-secondary focus:outline-none md:py-6 md:text-xl"
              name="q"
              onChange={(event) => setSearchQuery(event.target.value)}
              aria-label="Search site"
              placeholder="Search for a title, topic, or phrase"
              type="search"
              enterKeyHint="search"
              value={searchQuery}
            />
            <button type="submit" className="shrink-0 rounded-lg bg-[#176b69] px-5 font-body text-sm font-semibold text-white">Search</button>
            <div className="absolute bottom-0 left-0 h-0.5 w-full origin-left scale-x-0 bg-primary transition-transform duration-500 group-focus-within:scale-x-100" />
          </form>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <span className="mr-1 self-center font-label text-[10px] uppercase tracking-widest text-secondary">
              Try a topic
            </span>
            {quickQueries.map((term) => (
              <Link
                key={term}
                href={`/search?q=${encodeURIComponent(term)}`}
                className="rounded-full bg-surface-container-low px-4 py-1.5 font-label text-xs font-semibold text-secondary transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container"
              >
                {term}
              </Link>
            ))}
          </div>


        </header>

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="space-y-10 lg:col-span-8" aria-busy={loading}>
            <p className="sr-only" role="status">{loading ? 'Searching' : error ? '' : normalizedQuery ? `${results.length} results for ${normalizedQuery}` : ''}</p>
            {!normalizedQuery ? (
              <section className="sticky-note p-4 md:p-8">
                <h2 className="font-headline text-2xl font-bold text-on-surface">Start with a topic, title fragment, or name.</h2>
                <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
                  Explore AI memory and retrieval, the economics of technology, or the tools behind the work.
                </p>
                <div className="mt-6 grid gap-3 sm:grid-cols-3">
                  {starterTips.map(([label, description]) => (
                    <div key={label} className="sticky-note p-3 md:p-4">
                      <h3 className="font-headline text-sm font-bold uppercase tracking-widest text-secondary">{label}</h3>
                      <p className="mt-3 font-body text-sm leading-relaxed text-on-surface-variant">{description}</p>
                    </div>
                  ))}
                </div>
              </section>
            ) : loading ? (
              <section className="sticky-note p-4 md:p-8">
                <p className="font-headline text-xl font-bold text-on-surface">Searching...</p>
                <p className="mt-3 font-body text-base text-on-surface-variant">
                  Gathering results for &ldquo;{normalizedQuery}&rdquo;.
                </p>
              </section>
            ) : error ? (
              <section className="sticky-note p-4 md:p-8" role="alert">
                <h2 className="font-headline text-2xl font-bold text-on-surface">Search is unavailable.</h2>
                <p className="mt-4 font-body text-base leading-relaxed text-on-surface-variant">
                  Please try again. You can also browse the <Link href="/archive" className="underline underline-offset-4">writing archive</Link>.
                </p>
                <button type="button" onClick={() => setRetry((value) => value + 1)} className="mt-5 rounded-lg bg-[#176b69] px-5 py-3 font-body text-sm font-semibold text-white">Try again</button>
              </section>
            ) : results.length === 0 ? (
              <section className="sticky-note p-4 md:p-8">
                <h2 className="font-headline text-2xl font-bold text-on-surface">No results for &ldquo;{normalizedQuery}&rdquo;.</h2>
                <p className="mt-4 max-w-2xl font-body text-base leading-relaxed text-on-surface-variant md:text-lg">
                  Try a shorter phrase, a different spelling, or one of the topics above.
                </p>
              </section>
            ) : (
              groupedResults.map(({ type, results: typeResults }) => (
                <section key={type}>
                  <div className="mb-6 flex items-end justify-between gap-4 border-b border-outline-variant/10 pb-4">
                    <div>
                      <h2 className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
                        {typeLabels[type]}
                      </h2>
                      <p className="mt-2 text-sm italic text-secondary">
                        {typeResults.length} result{typeResults.length === 1 ? '' : 's'}
                      </p>
                    </div>
                  </div>

                  <div className="space-y-4">
                    {typeResults.map((result) => (
                      <article
                        key={`${result.type}-${result.url}`}
                        className="sticky-note px-5 py-5 md:px-6 md:py-6"
                      >
                        <Link href={result.url} className="block">
                          <div className="flex flex-col gap-3">
                            <div className="flex flex-wrap items-center gap-3">
                              <span className="rounded bg-primary-fixed px-2 py-0.5 font-label text-[10px] font-bold uppercase tracking-widest text-primary">
                                {typeLabels[result.type]}
                              </span>
                              {result.type === 'tag' && typeof result.relatedCount === 'number' ? (
                                <span className="font-label text-xs text-secondary">
                                  {result.relatedCount} site item{result.relatedCount === 1 ? '' : 's'}
                                </span>
                              ) : result.date ? (
                                <time className="font-label text-xs text-secondary">
                                  {formatResultDate(result.date)}
                                </time>
                              ) : null}
                            </div>
                            <h3 className="font-headline text-2xl font-bold tracking-tight text-on-surface transition-colors hover:text-primary">
                              {result.title}
                            </h3>
                            {result.description ? (
                              <p className="max-w-2xl text-base leading-relaxed text-on-surface-variant">
                                {result.description}
                              </p>
                            ) : null}
                            {result.tags && result.tags.length > 0 ? (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {result.tags.slice(0, 4).map((tag) => (
                                  <span
                                    key={`${result.url}-${tag}`}
                                    className="rounded-sm bg-surface px-2 py-1 font-label text-[10px] font-bold uppercase tracking-widest text-secondary"
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

          <aside className="space-y-6 lg:col-span-4 lg:sticky lg:top-32">
            <div className="sticky-note p-4 md:p-8">
              <h2 className="font-headline text-lg font-bold text-on-surface" style={{ marginBottom: '1.25rem' }}>Keep exploring</h2>
              <p className="font-body text-sm leading-relaxed text-on-surface-variant" style={{ marginBottom: '1.25rem' }}>
                Browse by date, follow a topic, or find something useful to build with.
              </p>
              <div className="flex flex-wrap gap-2">
                {[
                  ['Open archive', '/archive'],
                  ['Browse tags', '/tags'],
                  ['Code & tools', '/code-ai'],
                ].map(([label, href]) => (
                  <Link
                    key={label}
                    href={href}
                    className="rounded-full bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-secondary-container hover:text-on-secondary-container"
                  >
                    {label}
                  </Link>
                ))}
              </div>

              <h3 className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary" style={{ marginTop: '2rem', marginBottom: '1rem' }}>
                Suggested queries
              </h3>
              <div className="flex flex-wrap gap-2">
                {quickQueries.concat(['openai', 'python']).map((term) => (
                  <Link
                    key={term}
                    href={`/search?q=${encodeURIComponent(term)}`}
                    className="rounded-full bg-surface-container-low px-3 py-2 font-label text-xs text-on-surface-variant transition-all hover:-translate-y-0.5 hover:bg-surface-container-high"
                  >
                    {term}
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        </div>
      </div>
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
