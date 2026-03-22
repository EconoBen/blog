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

  return (
    <EditorialPageFrame currentPath="/publications">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Books, reports, papers</p>
          <h1 className="editorial-page-title">Publications</h1>
          <p className="editorial-page-copy">
            Browse the writing by year, then open the item you need. Reports, papers, and the forthcoming book all live in the same list.
          </p>
          <div className="editorial-chip-row">
            {publicationYears.map((year) => (
              <a key={year} href={`#publication-year-${year}`} className="editorial-chip" style={{ textDecoration: 'none' }}>
                {year}
              </a>
            ))}
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">Browse-first</p>
          <p className="editorial-post-summary">
            Use the year jump links or scan the latest publications below. No summary strip, just the work.
          </p>
          <a href={`#publication-year-${publicationYears[0]}`} className="editorial-post-link">
            Start with {publicationYears[0]}
          </a>
        </aside>
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
        <div className="editorial-link-row">
          <a href={actionHref} target="_blank" rel="noopener noreferrer" className="editorial-post-link">
            {actionLabel}
          </a>
        </div>
      )}
    </article>
  );
}
