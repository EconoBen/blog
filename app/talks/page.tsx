import { Metadata } from 'next';
import { talksConfig } from '../config/talksConfig';

export const metadata: Metadata = {
  title: 'Talks | Economic Notes',
  description: 'Conference talks, presentations, and live streams on tech topics.',
};

export default function TalksPage() {
  const { title, subtitle, talks } = talksConfig;
  
  // Sort talks by date (newest first)
  const sortedTalks = [...talks].sort((a, b) => 
    new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className="talks-page">
      <div className="page-header">
        <h1 className="page-title">{title}</h1>
        <p className="page-subtitle">{subtitle}</p>
      </div>

      <div className="talks-grid">
        {sortedTalks.map((talk) => (
          <article key={talk.id} className="talk-card">
            {talk.youtubeId && (
              <div className="talk-video">
                <iframe
                  src={`https://www.youtube.com/embed/${talk.youtubeId}`}
                  title={talk.title}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="youtube-embed"
                />
              </div>
            )}
            
            <div className="talk-content">
              <h2 className="talk-title">{talk.title}</h2>
              
              <div className="talk-meta">
                <span className="talk-event">{talk.event}</span>
                <time className="talk-date">
                  {new Date(talk.date).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </time>
              </div>
              
              <p className="talk-description">{talk.description}</p>
              
              <div className="talk-topics">
                {talk.topics.map((topic) => (
                  <span key={topic} className="topic-tag">
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}