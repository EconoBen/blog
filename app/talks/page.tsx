import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import TalksClient from './TalksClient';

export const metadata: Metadata = {
  title: 'Talks | Ben Labaschin',
  description: 'Recorded talks, podcasts, and livestreams with inline playback, transcripts, and direct source links.',
};

export default function TalksPage() {
  return (
    <EditorialPageFrame currentPath="/talks">
      <section className="editorial-page-hero">
        <div className="editorial-page-hero-copy">
          <p className="editorial-home-kicker">Watch and listen</p>
          <h1 className="editorial-page-title">Talks</h1>
          <p className="editorial-page-copy">
            Recorded talks, podcast conversations, and livestreams with inline playback, transcripts when available, and direct links back to the source.
          </p>
          <div className="editorial-chip-row">
            <span className="editorial-chip">Inline playback</span>
            <span className="editorial-chip">Transcripts</span>
            <span className="editorial-chip">Source links</span>
          </div>
        </div>
      </section>

      <TalksClient />
    </EditorialPageFrame>
  );
}
