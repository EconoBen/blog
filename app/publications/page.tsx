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
  return (
    <EditorialPageFrame currentPath="/publications">
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-6 pt-14 md:px-8 md:pb-8 md:pt-20">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Publications</p>
        <h1 className="mt-4 max-w-3xl font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
          Books, reports, and papers
        </h1>
      </section>

      {/* ── All publications in a flat grid ── */}
      <section className="border-t border-outline-variant/20 pt-4 pb-12 md:pt-5 md:pb-16">
        <div className="mx-auto max-w-[1440px] px-5 md:px-8">
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {sorted.map((pub) => (
              <BookCard key={pub.id} publication={pub} />
            ))}
          </div>
        </div>
      </section>
    </EditorialPageFrame>
  );
}

/* ── Book-style card ── */
function BookCard({ publication }: { publication: Publication }) {
  const href = getHref(publication);

  return (
    <article
      id={publication.id}
      className="group flex h-full flex-col overflow-hidden sticky-note transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Book cover area */}
      <div className="relative flex items-center justify-center bg-surface-container-low p-4 md:p-6">
        {/* Spine accent */}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-primary/20" />
        {publication.coverImage ? (
          <img
            src={publication.coverImage}
            alt={publication.title}
            className="aspect-[3/4] h-40 w-auto rounded object-cover shadow-[4px_4px_0_rgba(29,28,22,0.06)] transition-transform duration-700 group-hover:scale-105 md:h-48"
          />
        ) : (
          <div className="flex aspect-[3/4] h-40 items-center justify-center rounded bg-[linear-gradient(135deg,_#1d1c16,_#32302a)] p-4 shadow-[4px_4px_0_rgba(29,28,22,0.06)] md:h-48">
            <div className="space-y-2 text-center">
              <p className="font-label text-[8px] font-bold uppercase tracking-[0.3em] text-[#dce5ff]">{getType(publication)}</p>
              <p className="font-headline text-sm font-bold leading-tight text-[#fef9ef]">{publication.title}</p>
              <p className="font-label text-[8px] uppercase tracking-widest text-[#999]">{publication.authors.split(',')[0]}</p>
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="flex flex-1 flex-col space-y-3 p-4 md:p-6">
        <div className="space-y-1">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{getType(publication)}</p>
          <h3 className="font-headline text-lg font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
            {publication.title}
          </h3>
        </div>
        <p className="font-label text-[10px] font-bold uppercase tracking-widest text-on-surface">{publication.authors}</p>
        {publication.venue && <p className="font-label text-[10px] uppercase tracking-widest text-on-surface">{publication.venue}</p>}
        <time className="font-label text-[10px] uppercase tracking-widest text-on-surface">{fmtDate(publication.date)}</time>

        {publication.abstract && (
          <p className="line-clamp-3 font-body text-sm leading-relaxed text-on-surface">{publication.abstract}</p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {publication.topics.slice(0, 3).map((t) => (
            <span key={t} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-on-surface">{t}</span>
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
const shortDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' });

function fmtDate(date: string) {
  return shortDateFormatter.format(new Date(date));
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
