import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { publicationsConfig, type Publication } from '../config/publicationsConfig';

export const metadata: Metadata = {
  title: 'Publications | Ben Labaschin',
  description: "Reports, research, and long-form publications that anchor the site's technical and economic writing.",
};

export default function PublicationsPage() {
  const { publications } = publicationsConfig;
  const sortedPublications = [...publications].sort((a, b) => b.year - a.year);
  const featuredPublications = sortedPublications.filter((pub) => pub.featured);
  const otherPublications = sortedPublications.filter((pub) => !pub.featured);
  const latestPublication = sortedPublications[0];

  return (
    <EditorialPageFrame currentPath="/publications">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Public record</p>
          <h1 className="editorial-page-title">Publications</h1>
          <p className="editorial-page-copy">
            The technical record behind the site: O&apos;Reilly work, formal research, and longer-form pieces that ground the essays and talks.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">O&apos;Reilly</span>
            <span className="editorial-chip">Research</span>
            <span className="editorial-chip">Reports</span>
            <span className="editorial-chip">Long-form writing</span>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">What&apos;s here</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{publications.length}</span>
              <span className="editorial-page-metric-label">major publications</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{latestPublication?.year ?? 'n/a'}</span>
              <span className="editorial-page-metric-label">latest release year</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{featuredPublications.length}</span>
              <span className="editorial-page-metric-label">featured entries</span>
            </div>
          </div>
          <p className="editorial-post-summary">
            Featured work appears first so the most important pieces are easy to find before you dig into the archive.
          </p>
          {latestPublication && (
            <a href={getPublicationHref(latestPublication)} target="_blank" rel="noopener noreferrer" className="editorial-post-link">
              Open the latest publication
            </a>
          )}
        </aside>
      </section>

      <section className="editorial-home-proof-strip" aria-label="Publications summary">
        <span>{publications.length} publications</span>
        <span>/</span>
        <span>technical reports</span>
        <span>/</span>
        <span>formal research</span>
        <span>/</span>
        <span>long-form writing</span>
      </section>

      {featuredPublications.length > 0 && (
        <section className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Featured</p>
            <h2 className="editorial-page-section-title">The work that best frames the site&apos;s technical point of view.</h2>
          </div>
          <div className="editorial-timeline">
            {featuredPublications.map((pub) => (
              <PublicationEntry key={pub.id} publication={pub} featured />
            ))}
          </div>
        </section>
      )}

      {otherPublications.length > 0 && (
        <section className="editorial-list-section">
          <div className="editorial-list-heading">
            <p className="editorial-home-section-label">Archive</p>
            <h2 className="editorial-page-section-title">Background reports and earlier writing, kept for completeness.</h2>
          </div>
          <div className="editorial-timeline">
            {otherPublications.map((pub) => (
              <PublicationEntry key={pub.id} publication={pub} />
            ))}
          </div>
        </section>
      )}
    </EditorialPageFrame>
  );
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
  featured = false,
}: {
  publication: Publication;
  featured?: boolean;
}) {
  const actionHref = getPublicationHref(publication);
  const actionLabel = getPublicationActionLabel(publication);

  return (
    <article id={publication.id} className={`editorial-timeline-item ${featured ? 'is-featured' : ''}`}>
      {featured && publication.coverImage && (
        <div className="editorial-publication-cover">
          <img src={publication.coverImage} alt={`Cover for ${publication.title}`} />
        </div>
      )}
      <div className="editorial-post-meta">
        <span>{getPublicationType(publication)}</span>
        <span>{publication.year}</span>
        {featured && <span>Featured</span>}
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
