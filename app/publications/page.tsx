import type { Metadata } from 'next';
import Link from 'next/link';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { publicationsConfig, type Publication } from '../config/publicationsConfig';

export const metadata: Metadata = {
  title: 'Publications | ECONOBEN.DEV',
  description: 'Books, reports, and papers from ECONOBEN.DEV, newest first.',
};

export default function PublicationsPage() {
  const { publications } = publicationsConfig;
  const sortedPublications = [...publications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const totalPublications = sortedPublications.length;
  const featuredPublication =
    sortedPublications.find((publication) => publication.featured) ?? sortedPublications[0];
  const archivePublications = featuredPublication
    ? sortedPublications.filter((publication) => publication.id !== featuredPublication.id)
    : sortedPublications;
  const publicationsByYear = archivePublications.reduce<Record<number, Publication[]>>((groups, publication) => {
    if (!groups[publication.year]) {
      groups[publication.year] = [];
    }

    groups[publication.year].push(publication);
    return groups;
  }, {});
  const publicationYears = Object.keys(publicationsByYear)
    .map(Number)
    .sort((a, b) => b - a);

  return (
    <EditorialPageFrame currentPath="/publications">
      <section className="mx-auto max-w-7xl px-8 pb-6 pt-8 md:pt-10">
        <header className="grid gap-8 border-b border-outline-variant/20 pb-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(280px,0.8fr)] lg:items-end">
          <div className="max-w-3xl space-y-4">
            <p className="font-label text-xs font-bold uppercase tracking-[0.3em] text-secondary">
              Published work
            </p>
            <h1 className="font-headline text-5xl font-black tracking-tighter text-on-surface sm:text-6xl">
              Publications.
            </h1>
            <p className="max-w-2xl font-body text-lg leading-relaxed text-secondary">
              Books, reports, and papers arranged newest first, with the featured record leading the archive.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="rounded-full border border-outline-variant/20 bg-surface-container-low/70 px-3 py-2 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                {totalPublications} works
              </span>
              <span className="rounded-full border border-outline-variant/20 bg-surface-container-low/70 px-3 py-2 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                {publicationYears.length} years indexed
              </span>
              <span className="rounded-full border border-outline-variant/20 bg-surface-container-low/70 px-3 py-2 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">
                Featured piece first
              </span>
            </div>
          </div>
          <div className="rounded-2xl border border-outline-variant/15 bg-surface-container-low/80 p-5 shadow-[0_12px_30px_rgba(29,28,22,0.03)]">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">
              Archive map
            </p>
            <p className="mt-2 max-w-md font-body text-sm leading-relaxed text-secondary">
              Jump by year without crowding the first fold. The archive stays navigable while the feature keeps room to breathe.
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              {publicationYears.map((year) => (
                <Link
                  key={year}
                  href={`#publication-year-${year}`}
                  className="rounded-full border border-outline-variant/15 bg-surface-container-highest px-4 py-2 font-label text-[10px] font-bold uppercase tracking-widest text-secondary transition-colors hover:border-secondary-container hover:bg-secondary-container hover:text-primary"
                >
                  {year}
                </Link>
              ))}
            </div>
            <p className="mt-4 font-body text-xs italic text-secondary">
              {totalPublications} publications across {publicationYears.length} years.
            </p>
          </div>
        </header>
      </section>

      {featuredPublication && (
        <section className="mx-auto max-w-7xl px-8 pb-10">
          <article
            id="featured-publication"
            className="overflow-hidden rounded-[1.5rem] border border-outline-variant/15 bg-surface-container-highest shadow-[0_16px_40px_rgba(29,28,22,0.05)]"
          >
            <div className="grid gap-0 lg:grid-cols-[minmax(280px,0.92fr)_minmax(0,1.08fr)] lg:items-stretch">
              <div className="bg-surface-container-low/80 p-5 md:p-7">
                {featuredPublication.coverImage ? (
                  <img
                    src={featuredPublication.coverImage}
                    alt={featuredPublication.title}
                    className="aspect-[4/5] w-full rounded-xl object-cover shadow-lg"
                  />
                ) : (
                  <div className="flex aspect-[4/5] w-full items-center justify-center rounded-xl bg-[linear-gradient(135deg,_#1d1c16,_#32302a)] p-8 text-[#fef9ef]">
                    <div className="max-w-xs space-y-3 text-center">
                      <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary-fixed-dim">Featured</p>
                      <p className="font-headline text-3xl font-bold leading-tight">{featuredPublication.title}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="flex flex-col justify-between p-6 md:p-8">
                <div className="space-y-5">
                  <div className="flex flex-wrap items-center gap-3">
                    <span className="rounded-sm bg-secondary-fixed-dim px-3 py-1 font-label text-[10px] font-bold uppercase tracking-[0.2em] text-on-secondary-fixed-variant">
                      Featured work
                    </span>
                    <span className="font-label text-xs uppercase tracking-widest text-secondary">{formatPublicationDate(featuredPublication.date)}</span>
                  </div>
                  <div className="space-y-4">
                    <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
                      {getPublicationType(featuredPublication)}
                    </p>
                    <h2 className="max-w-2xl font-headline text-3xl font-bold tracking-tight text-on-surface lg:text-4xl">
                      {featuredPublication.title}
                    </h2>
                    <p className="max-w-2xl font-body text-lg leading-relaxed text-secondary">
                      {featuredPublication.abstract}
                    </p>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-2">
                    <MetaCard label="Authors" value={featuredPublication.authors} />
                    <MetaCard label="Venue" value={featuredPublication.venue ?? 'Unspecified'} />
                    <MetaCard label="Year" value={String(featuredPublication.year)} />
                    <MetaCard label="Topics" value={featuredPublication.topics.slice(0, 4).join(', ')} />
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {featuredPublication.topics.slice(0, 6).map((topic) => (
                      <span key={topic} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
                        {topic}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 flex flex-wrap gap-3">
                  {(() => {
                    const href = getPublicationHref(featuredPublication);

                    if (!href) {
                      return null;
                    }

                    return (
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center rounded-lg bg-primary-container px-5 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-primary"
                      >
                        {getPublicationActionLabel(featuredPublication)}
                      </a>
                    );
                  })()}
                  {featuredPublication.bibtex && (
                    <a
                      href={`data:text/plain;charset=utf-8,${encodeURIComponent(featuredPublication.bibtex)}`}
                      download={`${featuredPublication.id}.bib`}
                      className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-5 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-surface"
                    >
                      Download BibTeX
                    </a>
                  )}
                </div>
              </div>
            </div>
          </article>
        </section>
      )}

      {publicationYears.map((year) => {
        const yearPublications = publicationsByYear[year];
        const isSparseYear = yearPublications.length < 3;

        return (
          <section
            key={year}
            className={`mx-auto px-8 pb-16 ${isSparseYear ? 'max-w-5xl' : 'max-w-7xl'}`}
            id={`publication-year-${year}`}
          >
            <div className="mb-8 flex flex-col gap-3 border-t border-outline-variant/20 pt-6 sm:flex-row sm:items-end sm:justify-between">
              <div className="max-w-2xl space-y-2">
                <p className="font-label text-[10px] font-bold uppercase tracking-[0.28em] text-secondary">
                  Archive chapter
                </p>
                <h2 className="font-headline text-2xl font-bold tracking-tight text-on-surface md:text-3xl">
                  Publications from {year}
                </h2>
              </div>
              <p className="font-body text-sm italic text-secondary sm:max-w-xs sm:text-right">
                {yearPublications.length} item{yearPublications.length === 1 ? '' : 's'} in this section
              </p>
            </div>

            <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
              {yearPublications.map((publication) => (
                <PublicationCard key={publication.id} publication={publication} />
              ))}
            </div>
          </section>
        );
      })}
    </EditorialPageFrame>
  );
}

function formatPublicationDate(date: string) {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  }).format(new Date(date));
}

function getPublicationType(publication: Publication) {
  if (publication.venue === "O'Reilly Media") {
    return "O'Reilly report";
  }

  const labels: Record<Publication['type'], string> = {
    book: 'Book',
    journal: 'Journal',
    conference: 'Conference',
    report: 'Report',
    workshop: 'Workshop',
    other: 'Writing',
  };

  return labels[publication.type];
}

function getPublicationHref(publication: Publication) {
  return publication.url || publication.pdfUrl || (publication.doi ? `https://doi.org/${publication.doi}` : undefined);
}

function getPublicationActionLabel(publication: Publication) {
  if (publication.url) {
    return publication.venue === "O'Reilly Media" ? 'Read the report' : 'Read online';
  }

  if (publication.pdfUrl) {
    return 'Open PDF';
  }

  if (publication.doi) {
    return 'View DOI record';
  }

  return 'Open record';
}

function MetaCard({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl bg-surface-container-low p-4">
      <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">{label}</p>
      <p className="mt-2 font-body text-sm leading-relaxed text-on-surface">{value}</p>
    </div>
  );
}

function PublicationCard({
  publication,
}: {
  publication: Publication;
}) {
  const actionHref = getPublicationHref(publication);
  const actionLabel = getPublicationActionLabel(publication);

  return (
    <article
      id={publication.id}
      className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1"
    >
      {publication.coverImage ? (
        <div className="hidden aspect-[4/3] overflow-hidden bg-surface-container-low md:block">
          <img
            src={publication.coverImage}
            alt={publication.title}
            className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ) : (
        <div className="flex aspect-[4/3] items-center justify-center bg-[radial-gradient(circle_at_top_left,_rgba(180,197,255,0.45),_transparent_30%),linear-gradient(135deg,_#1d1c16,_#32302a)] p-8 text-[#fef9ef]">
          <div className="max-w-xs space-y-3 text-center">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary-fixed-dim">Publication</p>
            <h3 className="font-headline text-2xl font-bold leading-tight">{publication.title}</h3>
          </div>
        </div>
      )}

      <div className="flex flex-1 flex-col space-y-4 p-6 md:p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{getPublicationType(publication)}</p>
            <h3 className="mt-2 font-headline text-xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary md:text-2xl">
              {publication.title}
            </h3>
          </div>
          <time className="shrink-0 font-label text-[10px] uppercase tracking-widest text-secondary">
            {formatPublicationDate(publication.date)}
          </time>
        </div>

        <p className="font-body text-sm leading-relaxed text-secondary">{publication.authors}</p>
        {publication.venue && <p className="font-label text-[11px] font-bold uppercase tracking-widest text-secondary">{publication.venue}</p>}
        {publication.abstract && (
          <p className="hidden font-body text-sm leading-relaxed text-on-surface-variant md:block md:text-base">
            {publication.abstract}
          </p>
        )}

        <div className="mt-auto flex flex-wrap gap-2 pt-2">
          {publication.topics.slice(0, 4).map((topic) => (
            <span key={topic} className="rounded-full bg-surface-container-low px-3 py-1 font-label text-[10px] font-bold uppercase tracking-wider text-secondary">
              {topic}
            </span>
          ))}
        </div>

        {actionHref && (
          <a
            href={actionHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center rounded-lg bg-surface-container-low px-4 py-3 font-label text-[11px] font-bold uppercase tracking-widest text-on-surface transition-colors hover:bg-secondary-container hover:text-primary"
          >
            {actionLabel}
          </a>
        )}
      </div>
    </article>
  );
}
