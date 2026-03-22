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
  const featuredPublications = sortedPublications.filter((publication) => publication.featured);
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
            Browse the work directly. Featured items appear first, then the full list stays grouped by year so the page still works like an index.
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
            Start with the featured publications, then jump by year. Each entry keeps its source link, PDF, or DOI if one exists.
          </p>
          <div className="editorial-link-row">
            <a href="#featured-publications" className="editorial-post-link">
              Featured work
            </a>
            <a href={`#publication-year-${publicationYears[0]}`} className="editorial-post-link">
              Start with {publicationYears[0]}
            </a>
          </div>
        </aside>
      </section>

      {featuredPublications.length > 0 && (
        <section id="featured-publications" className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Featured publications</p>
            <h2 className="editorial-page-section-title">The most useful items, shown with the cover when there is one.</h2>
          </div>
          <div className="editorial-publication-grid">
            {featuredPublications.map((publication) => (
              <PublicationSpotlight key={publication.id} publication={publication} />
            ))}
          </div>
        </section>
      )}

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
    return 'Read online';
  }

  if (publication.pdfUrl) {
    return 'Open PDF';
  }

  if (publication.doi) {
    return 'View DOI record';
  }

  return undefined;
}

function PublicationActions({ publication }: { publication: Publication }) {
  const actionHref = getPublicationHref(publication);
  const actionLabel = getPublicationActionLabel(publication);

  if (!actionHref || !actionLabel) {
    return null;
  }

  return (
    <div className="editorial-link-row">
      <a href={actionHref} target="_blank" rel="noopener noreferrer" className="editorial-post-link">
        {actionLabel}
      </a>
    </div>
  );
}

function PublicationSpotlight({
  publication,
}: {
  publication: Publication;
}) {
  return (
    <article className="editorial-publication-card is-featured">
      {publication.coverImage ? (
        <div className="editorial-publication-cover">
          <img src={publication.coverImage} alt={publication.title} />
        </div>
      ) : null}

      <div>
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

        <PublicationActions publication={publication} />
      </div>
    </article>
  );
}

function PublicationEntry({
  publication,
}: {
  publication: Publication;
}) {
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

      <PublicationActions publication={publication} />
    </article>
  );
}
