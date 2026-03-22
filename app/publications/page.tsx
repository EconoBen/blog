import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { publicationsConfig, type Publication } from '../config/publicationsConfig';

export const metadata: Metadata = {
  title: 'Publications | Ben Labaschin',
  description: 'Books, reports, and papers, newest first.',
};

export default function PublicationsPage() {
  const { publications } = publicationsConfig;
  const sortedPublications = [...publications].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
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
  const latestPublication = sortedPublications[0];
  const summaryItems = [
    publicationTypeCounts.book > 0 ? `${publicationTypeCounts.book} books` : null,
    publicationTypeCounts.journal > 0 ? `${publicationTypeCounts.journal} journal article${publicationTypeCounts.journal > 1 ? 's' : ''}` : null,
    publicationTypeCounts.report > 0 ? `${publicationTypeCounts.report} reports` : null,
    publicationTypeCounts.conference > 0 ? `${publicationTypeCounts.conference} conference paper${publicationTypeCounts.conference > 1 ? 's' : ''}` : null,
    publicationTypeCounts.workshop > 0 ? `${publicationTypeCounts.workshop} workshop paper${publicationTypeCounts.workshop > 1 ? 's' : ''}` : null,
    publicationTypeCounts.other > 0 ? `${publicationTypeCounts.other} other pieces` : null,
  ].filter((item): item is string => Boolean(item));

  return (
    <EditorialPageFrame currentPath="/publications">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Writing</p>
          <h1 className="editorial-page-title">Publications</h1>
          <p className="editorial-page-copy">
            Books, reports, and papers, newest first.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">Books</span>
            <span className="editorial-chip">Papers</span>
            <span className="editorial-chip">Reports</span>
            <span className="editorial-chip">PDFs</span>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Quick access</p>
          <p className="editorial-post-summary">
            Jump by year or open the newest publication directly.
          </p>
          {latestPublication && (
            <a href={getPublicationHref(latestPublication)} target="_blank" rel="noopener noreferrer" className="editorial-post-link">
              Open latest: {latestPublication.title}
            </a>
          )}
          <div className="editorial-chip-row" style={{ marginTop: '16px' }}>
            {publicationYears.map((year) => (
              <a key={year} href={`#publication-year-${year}`} className="editorial-chip" style={{ textDecoration: 'none' }}>
                {year}
              </a>
            ))}
          </div>
          <div style={{ display: 'grid', gap: '10px', marginTop: '18px' }}>
            {sortedPublications.slice(0, 3).map((publication) => (
              <a
                key={publication.id}
                href={`#${publication.id}`}
                className="editorial-post-link"
                style={{ marginTop: 0 }}
              >
                {formatPublicationDate(publication.date)} · {publication.title}
              </a>
            ))}
          </div>
        </aside>
      </section>

      <section className="editorial-home-proof-strip" aria-label="Publications summary">
        <span>{publications.length} publications</span>
        <span>/</span>
        <span>{summaryItems[0] ?? 'books'}</span>
        <span>/</span>
        <span>{summaryItems[1] ?? 'journal articles'}</span>
        <span>/</span>
        <span>{summaryItems[2] ?? 'reports'}</span>
      </section>

      {publicationYears.map((year) => {
        const yearPublications = publicationsByYear[year];

        return (
          <section key={year} className="editorial-list-section" id={`publication-year-${year}`}>
            <div className="editorial-list-heading">
              <p className="editorial-home-section-label">{year}</p>
              <h2 className="editorial-page-section-title">Publications from {year}.</h2>
            </div>
            <div className="editorial-timeline">
              {yearPublications.map((publication) => (
                <PublicationEntry key={publication.id} publication={publication} />
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

  return undefined;
}

function PublicationEntry({
  publication,
}: {
  publication: Publication;
}) {
  const actionHref = getPublicationHref(publication);
  const actionLabel = getPublicationActionLabel(publication);

  return (
    <article id={publication.id} className="editorial-timeline-item">
      <div className="editorial-post-meta">
        <span>{getPublicationType(publication)}</span>
        <span>{formatPublicationDate(publication.date)}</span>
      </div>

      <h3>{publication.title}</h3>
      <p className="editorial-publication-authors">{publication.authors}</p>
      {publication.venue && <p className="editorial-publication-venue">{publication.venue}</p>}
      {publication.abstract && <p className="editorial-post-summary">{publication.abstract}</p>}

      <div className="editorial-chip-row">
        {publication.topics.slice(0, 4).map((topic) => (
          <span key={topic} className="editorial-chip">
            {topic}
          </span>
        ))}
      </div>

      {actionHref && actionLabel && (
        <a href={actionHref} target="_blank" rel="noopener noreferrer" className="editorial-post-link">
          {actionLabel}
        </a>
      )}
    </article>
  );
}
