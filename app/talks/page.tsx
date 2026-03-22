import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { talksConfig } from '../config/talksConfig';

export const metadata: Metadata = {
  title: 'Talks | Ben Labaschin',
  description: 'Conference talks, podcasts, and recorded appearances on AI systems, memory, and engineering.',
};

const formatDate = (dateStr: string) =>
  new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(new Date(dateStr));

export default function TalksPage() {
  const talks = [...talksConfig.talks].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );
  const latestTalk = talks[0];

  return (
    <EditorialPageFrame currentPath="/talks">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Speaking</p>
          <h1 className="editorial-page-title">Talks</h1>
          <p className="editorial-page-copy">
            Talks, podcast conversations, and community appearances on memory systems, AI engineering, and the realities of production workflows.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">Podcasts</span>
            <span className="editorial-chip">Conferences</span>
            <span className="editorial-chip">Streams</span>
            <span className="editorial-chip">Transcripts</span>
          </div>
        </div>
        <aside className="editorial-page-aside">
          <p className="editorial-home-card-label">At a glance</p>
          <div className="editorial-page-metric-list">
            <div>
              <span className="editorial-page-metric-value">{talks.length}</span>
              <span className="editorial-page-metric-label">recorded appearances</span>
            </div>
            <div>
              <span className="editorial-page-metric-value">{latestTalk ? formatDate(latestTalk.date) : 'n/a'}</span>
              <span className="editorial-page-metric-label">latest appearance</span>
            </div>
          </div>
          <p className="editorial-post-summary">
            Newest entries appear first, with watch, listen, and read links preserved where they exist.
          </p>
        </aside>
      </section>

      <section className="editorial-home-proof-strip" aria-label="Talks summary">
        <span>MLOps Community</span>
        <span>/</span>
        <span>ODSC West</span>
        <span>/</span>
        <span>Normconf</span>
        <span>/</span>
        <span>podcasts and streams</span>
      </section>

      <section className="editorial-list-section">
        <div className="editorial-list-heading">
          <p className="editorial-home-section-label">Appearances</p>
          <h2 className="editorial-page-section-title">Selected talks and recordings, organized newest first.</h2>
        </div>
        <div className="editorial-talk-grid">
          {talks.map((talk) => {
            const primaryUrl = talk.spotifyUrl
              ? talk.spotifyUrl
              : talk.youtubeId
                ? `https://www.youtube.com/watch?v=${talk.youtubeId}`
                : undefined;

            return (
              <article key={talk.id} className="editorial-talk-card">
                <div className="editorial-post-meta">
                  <span>{talk.event}</span>
                  <span>{formatDate(talk.date)}</span>
                </div>
                <h3>{talk.title}</h3>
                <p className="editorial-post-summary">{talk.description}</p>
                <div className="editorial-chip-row">
                  {talk.topics.slice(0, 4).map((topic) => (
                    <span key={topic} className="editorial-chip">
                      {topic}
                    </span>
                  ))}
                </div>
                <div className="editorial-link-row">
                  {primaryUrl && (
                    <a
                      href={primaryUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-post-link"
                    >
                      {talk.spotifyUrl ? 'Listen to recording' : 'Watch recording'}
                    </a>
                  )}
                  {talk.transcriptUrl && (
                    <a
                      href={talk.transcriptUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="editorial-post-link"
                    >
                      Read transcript
                    </a>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      </section>
    </EditorialPageFrame>
  );
}
