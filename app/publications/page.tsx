import type { Metadata } from 'next';
import Link from 'next/link';
import { BookCover } from '../components/BookCover';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { publicationsConfig, type Publication } from '../config/publicationsConfig';
import '../styles/editorial-index.css';

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
      className="group scroll-mt-36 flex h-full flex-col overflow-hidden sticky-note transition-transform duration-300 hover:-translate-y-1"
    >
      {/* Book cover area */}
      <div className="publication-cover-area relative flex items-center justify-center bg-surface-container-low">
        {/* Spine accent */}
        <div className="absolute inset-y-0 left-0 w-1.5 bg-primary/20" />
        {publication.id === 'agent-memory' ? (
          <BookCover size="compact" />
        ) : publication.coverImage ? (
          <img
            src={publication.coverImage}
            loading="lazy"
            alt={publication.title}
            className="rounded shadow-[4px_4px_0_rgba(29,28,22,0.06)]"
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
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{getType(publication)}{publication.releaseLabel ? ` · ${publication.releaseLabel}` : ''}</p>
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
          href.startsWith('/') && !href.endsWith('.pdf') ? (
            <Link href={href} className="mt-3 inline-flex w-fit py-2 font-body text-sm font-semibold text-primary underline underline-offset-4">Explore the book</Link>
          ) : (
            <a href={href} target="_blank" rel="noopener noreferrer" className="mt-3 inline-flex w-fit py-2 font-body text-sm font-semibold text-primary underline underline-offset-4">
              {getAction(publication)}
            </a>
          )
        )}
      </div>
    </article>
  );
}

/* ── Helpers ── */
const shortDateFormatter = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' });

function fmtDate(date: string) {
  return shortDateFormatter.format(new Date(date));
}

function getType(pub: Publication) {
  const labels: Record<Publication['type'], string> = { book: 'Book', journal: 'Journal', conference: 'Conference', report: 'Report', workshop: 'Workshop', other: 'Writing' };
  return labels[pub.type];
}

function getHref(pub: Publication) {
  return pub.url || pub.pdfUrl || (pub.doi ? `https://doi.org/${pub.doi}` : undefined);
}

function getAction(pub: Publication) {
  if (pub.url) return pub.type === 'report' ? 'Read report' : 'Read online';
  if (pub.pdfUrl) return 'Open PDF';
  if (pub.doi) return 'View DOI';
  return 'Open';
}
