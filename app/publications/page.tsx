import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { publicationsConfig, type Publication } from '../config/publicationsConfig';

export const metadata: Metadata = {
  title: 'Publications | ECONOBEN.DEV',
  description: 'Books, reports, and papers — newest first.',
};

export default function PublicationsPage() {
  const { publications } = publicationsConfig;
  const sorted = [...publications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const featured = sorted.find((p) => p.featured) ?? sorted[0];
  const rest = featured ? sorted.filter((p) => p.id !== featured.id) : sorted;
  const byYear = rest.reduce<Record<number, Publication[]>>((acc, pub) => {
    (acc[pub.year] ??= []).push(pub);
    return acc;
  }, {});
  const years = Object.keys(byYear).map(Number).sort((a, b) => b - a);

  return (
    <EditorialPageFrame currentPath="/publications">
      {/* ── Hero: featured publication ── */}
      {featured && (
        <section className="mx-auto max-w-[1440px] px-8 pb-12 pt-14 md:pb-16 md:pt-20">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Featured publication</p>
          <article className="mt-6 overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] lg:grid lg:grid-cols-[minmax(0,0.4fr)_minmax(0,0.6fr)]">
            {/* Book cover */}
            <div className="flex items-center justify-center bg-surface-container-low p-8 md:p-12">
              {featured.coverImage ? (
                <img
                  src={featured.coverImage}
                  alt={featured.title}
                  className="aspect-[3/4] max-h-[420px] w-auto rounded-lg object-cover shadow-[8px_8px_0_rgba(29,28,22,0.08)]"
                />
              ) : (
                <div className="flex aspect-[3/4] w-full max-w-[280px] items-center justify-center rounded-lg bg-[linear-gradient(135deg,_#1d1c16,_#32302a)] p-8 shadow-[8px_8px_0_rgba(29,28,22,0.08)]">
                  <div className="space-y-3 text-center">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-[#dce5ff]">{getType(featured)}</p>
                    <p className="font-headline text-2xl font-bold leading-tight text-[#fef9ef]">{featured.title}</p>
                  </div>
                </div>
              )}
            </div>

            {/* Details */}
            <div className="space-y-5 p-8 md:p-12">
              <div className="space-y-2">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{getType(featured)}</p>
                <h2 className="font-headline text-3xl font-bold leading-snug text-on-surface md:text-4xl">{featured.title}</h2>
              </div>
              <p className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary">{featured.authors}</p>
              {featured.venue && <p className="font-label text-[10px] uppercase tracking-widest text-secondary">{featured.venue}</p>}
              <time className="block font-label text-[10px] uppercase tracking-widest text-secondary">{fmtDate(featured.date)}</time>
              {featured.abstract && (
                <p className="max-w-xl font-body text-lg leading-relaxed text-secondary">{featured.abstract}</p>
              )}
              <div className="flex flex-wrap gap-2">
                {featured.topics.slice(0, 6).map((t) => (
                  <span key={t} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">{t}</span>
                ))}
              </div>
              <div className="flex flex-wrap gap-3 pt-2">
                {getHref(featured) && (
                  <a href={getHref(featured)!} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
                    {getAction(featured)}
                  </a>
                )}
                {featured.bibtex && (
                  <a href={`data:text/plain;charset=utf-8,${encodeURIComponent(featured.bibtex)}`} download={`${featured.id}.bib`} className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
                    BibTeX
                  </a>
                )}
              </div>
            </div>
          </article>
        </section>
      )}

      {/* ── Archive by year ── */}
      {years.map((year) => {
        const pubs = byYear[year];
        return (
          <section key={year} className="border-t border-outline-variant/20 py-12 md:py-16" id={`publication-year-${year}`}>
            <div className="mx-auto max-w-[1440px] px-8">
              <div className="mb-8 flex flex-wrap items-center justify-between gap-4">
                <h2 className="font-headline text-xl font-bold text-on-surface">{year}</h2>
                <p className="font-label text-[10px] uppercase tracking-widest text-secondary">{pubs.length} publication{pubs.length !== 1 ? 's' : ''}</p>
              </div>

              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {pubs.map((pub) => (
                  <BookCard key={pub.id} publication={pub} />
                ))}
              </div>
            </div>
          </section>
        );
      })}
    </EditorialPageFrame>
  );
}

/* ── Book-style card ── */
function BookCard({ publication }: { publication: Publication }) {
  const href = getHref(publication);

  return (
    <article
      id={publication.id}
      className="group flex h-full flex-col overflow-hidden rounded-2xl border border-outline-variant/15 bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Book cover area */}
      <div className="relative flex items-center justify-center bg-surface-container-low p-6">
        {/* Spine accent */}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-primary/20" />
        {publication.coverImage ? (
          <img
            src={publication.coverImage}
            alt={publication.title}
            className="aspect-[3/4] h-48 w-auto rounded object-cover shadow-[4px_4px_0_rgba(29,28,22,0.06)] transition-transform duration-700 group-hover:scale-105"
          />
        ) : (
          <div className="flex aspect-[3/4] h-48 items-center justify-center rounded bg-[linear-gradient(135deg,_#1d1c16,_#32302a)] p-4 shadow-[4px_4px_0_rgba(29,28,22,0.06)]">
            <div className="space-y-2 text-center">
              <p className="font-label text-[8px] font-bold uppercase tracking-[0.3em] text-[#dce5ff]">{getType(publication)}</p>
              <p className="font-headline text-sm font-bold leading-tight text-[#fef9ef]">{publication.title}</p>
              <p className="font-label text-[8px] uppercase tracking-widest text-[#999]">{publication.authors.split(',')[0]}</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-6">
        <div className="space-y-1">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{getType(publication)}</p>
          <h3 className="font-headline text-lg font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
            {publication.title}
          </h3>
        </div>
        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary">{publication.authors}</p>
        {publication.venue && <p className="font-label text-[10px] uppercase tracking-widest text-secondary">{publication.venue}</p>}
        <time className="font-label text-[10px] uppercase tracking-widest text-secondary">{fmtDate(publication.date)}</time>

        {publication.abstract && (
          <p className="line-clamp-3 font-body text-sm leading-relaxed text-secondary">{publication.abstract}</p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {publication.topics.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">{t}</span>
          ))}
        </div>

        {href && (
          <a href={href} target="_blank" rel="noopener noreferrer" className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-2 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-transform hover:-translate-y-1">
            {getAction(publication)}
          </a>
        )}
      </div>
    </article>
  );
}

/* ── Helpers ── */
function fmtDate(date: string) {
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(new Date(date));
}

function getType(pub: Publication) {
  const labels: Record<Publication['type'], string> = { book: 'Book', journal: 'Journal', conference: 'Conference', report: 'Report', workshop: 'Workshop', other: 'Writing' };
  return pub.venue === "O'Reilly Media" ? "O'Reilly Report" : labels[pub.type];
}

function getHref(pub: Publication) {
  return pub.url || pub.pdfUrl || (pub.doi ? `https://doi.org/${pub.doi}` : undefined);
}

function getAction(pub: Publication) {
  if (pub.url) return pub.venue === "O'Reilly Media" ? 'Read report' : 'Read online';
  if (pub.pdfUrl) return 'Open PDF';
  if (pub.doi) return 'View DOI';
  return 'Open';
}
