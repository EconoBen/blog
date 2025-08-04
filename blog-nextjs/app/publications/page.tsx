import { Metadata } from 'next';
import { publicationsConfig } from '../config/publicationsConfig';

export const metadata: Metadata = {
  title: 'Publications | Economic Notes',
  description: 'Articles, whitepapers, and books on economics, technology, and AI.',
};

export default function PublicationsPage() {
  const { title, subtitle, publications } = publicationsConfig;
  
  // Sort publications by year (newest first)
  const sortedPublications = [...publications].sort((a, b) => b.year - a.year);
  
  // Group by featured status
  const featuredPublications = sortedPublications.filter(pub => pub.featured);
  const otherPublications = sortedPublications.filter(pub => !pub.featured);

  return (
    <div className="publications-page">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      {featuredPublications.length > 0 && (
        <section className="publications-section">
          <h2 className="section-title">Featured Publications</h2>
          <div className="publications-grid">
            {featuredPublications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} featured />
            ))}
          </div>
        </section>
      )}

      {otherPublications.length > 0 && (
        <section className="publications-section">
          <h2 className="section-title">Other Publications</h2>
          <div className="publications-grid">
            {otherPublications.map((pub) => (
              <PublicationCard key={pub.id} publication={pub} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

function PublicationCard({ publication, featured = false }: { 
  publication: any; 
  featured?: boolean;
}) {
  const typeColors: Record<string, string> = {
    book: 'type-badge-book',
    journal: 'type-badge-journal',
    conference: 'type-badge-conference',
    report: 'type-badge-report',
    workshop: 'type-badge-workshop',
    other: 'type-badge-other'
  };

  return (
    <article 
      id={publication.id}
      className={`publication-card ${featured ? 'publication-featured' : ''}`}
    >
      <div className="publication-card-content">
        <div className="publication-header">
          {publication.coverImage && (
            <div className="publication-cover">
              <img 
                src={publication.coverImage} 
                alt={`Cover for ${publication.title}`}
              />
            </div>
          )}
          
          <div className="publication-meta">
            <div className="publication-type-and-date">
              <span className={`publication-type ${typeColors[publication.type]}`}>
                {publication.type}
              </span>
              <span className="publication-date">{publication.year}</span>
            </div>
            
            <h3 className="publication-title">{publication.title}</h3>
            <p className="publication-authors">{publication.authors}</p>
            {publication.venue && (
              <p className="publication-venue">{publication.venue}</p>
            )}
          </div>
        </div>

        {publication.abstract && (
          <div className="publication-body">
            <p className="publication-abstract">{publication.abstract}</p>
          </div>
        )}

        <div className="publication-footer">
          <div className="publication-topics">
            {publication.topics.map((topic: string) => (
              <span key={topic} className="publication-topic-tag">
                {topic}
              </span>
            ))}
          </div>

          <div className="publication-actions">
            {publication.url && (
              <a 
                href={publication.url}
                target="_blank"
                rel="noopener noreferrer"
                className="publication-action-button"
              >
                View →
              </a>
            )}
            {publication.pdfUrl && (
              <a 
                href={publication.pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="publication-action-button pdf-button"
              >
                PDF ↓
              </a>
            )}
            {publication.doi && (
              <a 
                href={`https://doi.org/${publication.doi}`}
                target="_blank"
                rel="noopener noreferrer"
                className="publication-action-button doi-button"
              >
                DOI →
              </a>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}