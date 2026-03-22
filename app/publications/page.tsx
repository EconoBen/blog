import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { publicationsConfig, type Publication } from '../config/publicationsConfig';

export const metadata: Metadata = {
  title: 'Publications | Ben Labaschin',
  description: 'Books, reports, and papers, newest first.',
};

export default function PublicationsPage() {
  const { publications, subtitle } = publicationsConfig;
  const sortedPublications = [...publications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const featuredPublication =
    sortedPublications.find((publication) => publication.featured) ?? sortedPublications[0];
  const publicationsByYear = sortedPublications.reduce<Record<number, Publication[]>>((groups, publication) => {
    if (!groups[publication.year]) {
      groups[publication.year] = [];
    }

    groups[publication.year].push(publication);
    return groups;
  }, {});
  const publicationYears = Object.keys(publicationsByYear)
    .map(Number)
    .sort((a, b) => b - a);
  const publicationTypeCounts = sortedPublications.reduce<Record<Publication['type'], number>>(
    (counts, publication) => {
      counts[publication.type] += 1;
      return counts;
    },
    {
      book: 0,
      journal: 0,
      conference: 0,
      report: 0,
      workshop: 0,
      other: 0,
    }
  );

  return (
    <EditorialPageFrame currentPath="/publications">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 pb-12 pt-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <span className="mb-6 block font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">
            Archive and research
          </span>
          <h1 className="max-w-4xl font-headline text-5xl font-black tracking-tighter text-on-surface md:text-7xl">
            Publications
          </h1>
          <p className="mt-6 max-w-3xl font-body text-xl leading-relaxed text-secondary md:text-2xl">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-surface-container-low px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider text-secondary">
              Books
            </span>
            <span className="rounded-full bg-surface-container-low px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider text-secondary">
              Papers
            </span>
            <span className="rounded-full bg-surface-container-low px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider text-secondary">
              Reports
            </span>
            <span className="rounded-full bg-surface-container-low px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider text-secondary">
              PDFs and DOI records
            </span>
          </div>
        </div>

        <aside className="rounded-2xl bg-surface-container-low p-8 lg:col-span-4">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Quick access</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
            <div className="rounded-xl bg-surface-container-highest p-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Entries</p>
              <p className="mt-2 font-headline text-3xl font-bold text-on-surface">{publications.length}</p>
            </div>
            <div className="rounded-xl bg-surface-container-highest p-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Books</p>
              <p className="mt-2 font-headline text-3xl font-bold text-on-surface">{publicationTypeCounts.book}</p>
            </div>
          </div>
          <div className="mt-6 space-y-3 border-t border-outline-variant/30 pt-6">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Featured publication</p>
            {featuredPublication && (
              <>
                <p className="font-headline text-xl font-bold leading-snug text-on-surface">{featuredPublication.title}</p>
                <p className="font-body text-sm leading-relaxed text-secondary">{featuredPublication.venue ?? featuredPublication.authors}</p>
              </>
            )}
          </div>
        </aside>
      </section>

      {featuredPublication && (
        <section className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-8 pb-8 lg:grid-cols-12">
          <article className="overflow-hidden rounded-2xl bg-surface-container-highest shadow-[0_24px_60px_rgba(29,28,22,0.06)] lg:col-span-8">
            <div className="grid gap-0 lg:grid-cols-[minmax(0,0.95fr)_minmax(320px,1.05fr)]">
              <div className="bg-surface-container-low p-10">
                {featuredPublication.coverImage ? (
                  <img
                    src={featuredPublication.coverImage}
                    alt={featuredPublication.title}
                    className="aspect-[4/5] w-full rounded-xl object-cover shadow-xl"
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
              <div className="flex flex-col justify-between p-8 lg:p-10">
                <div className="space-y-6">
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
                <div className="mt-8 flex flex-wrap gap-3">
                  {getPublicationHref(featuredPublication) && (
                    <a
                      href={getPublicationHref(featuredPublication)}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center justify-center rounded-lg bg-primary-container px-5 py-3 font-label text-xs font-bold uppercase tracking-widest text-on-primary"
                    >
                      {getPublicationActionLabel(featuredPublication)}
                    </a>
                  )}
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

          <aside className="flex flex-col gap-4 rounded-2xl bg-surface-container-low p-8 lg:col-span-4">
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">Index</p>
            {publicationYears.map((year) => (
              <a
                key={year}
                href={`#publication-year-${year}`}
                className="flex items-center justify-between rounded-xl bg-surface-container-highest px-4 py-3 transition-colors hover:bg-secondary-container hover:text-primary"
              >
                <span className="font-headline text-base font-bold text-on-surface">{year}</span>
                <span className="font-label text-[10px] font-bold uppercase tracking-widest text-secondary">
                  {publicationsByYear[year].length} items
                </span>
              </a>
            ))}
          </aside>
        </section>
      )}

      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 pb-16 lg:grid-cols-12">
        <div className="rounded-2xl bg-surface-container-low p-8 lg:col-span-12">
          <div className="flex flex-wrap items-center gap-4 text-xs font-bold uppercase tracking-widest text-secondary">
            <span>{publications.length} publications</span>
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
            <span>{publicationTypeCounts.book} books</span>
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
            <span>{publicationTypeCounts.journal} journal articles</span>
            <span className="h-1 w-1 rounded-full bg-outline-variant" />
            <span>{publicationTypeCounts.report} reports</span>
          </div>
        </div>
      </section>

      {publicationYears.map((year) => {
        const yearPublications = publicationsByYear[year];

        return (
          <section key={year} className="mx-auto max-w-7xl px-8 pb-16" id={`publication-year-${year}`}>
            <div className="mb-8 grid gap-4 lg:grid-cols-12 lg:items-end">
              <div className="lg:col-span-8">
                <p className="font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">{year}</p>
                <h2 className="mt-3 font-headline text-3xl font-bold tracking-tight text-on-surface">
                  Publications from {year}
                </h2>
              </div>
              <div className="lg:col-span-4 lg:text-right">
                <p className="font-body text-base italic text-secondary">{yearPublications.length} item{yearPublications.length === 1 ? '' : 's'} in this section</p>
              </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 xl:grid-cols-3">
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
    <article className="group flex h-full flex-col overflow-hidden rounded-2xl bg-surface-container-highest shadow-[0_18px_50px_rgba(29,28,22,0.04)] transition-transform duration-300 hover:-translate-y-1">
      {publication.coverImage ? (
        <div className="aspect-[4/3] overflow-hidden bg-surface-container-low">
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

      <div className="flex flex-1 flex-col space-y-4 p-8">
        <div className="flex items-start justify-between gap-4">
          <div>
            <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">{getPublicationType(publication)}</p>
            <h3 className="mt-2 font-headline text-2xl font-bold leading-snug text-on-surface transition-colors group-hover:text-primary">
              {publication.title}
            </h3>
          </div>
          <time className="shrink-0 font-label text-[10px] uppercase tracking-widest text-secondary">
            {formatPublicationDate(publication.date)}
          </time>
        </div>

        <p className="font-body text-sm leading-relaxed text-secondary">{publication.authors}</p>
        {publication.venue && <p className="font-label text-[11px] font-bold uppercase tracking-widest text-secondary">{publication.venue}</p>}
        {publication.abstract && <p className="font-body text-base leading-relaxed text-on-surface-variant">{publication.abstract}</p>}

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
