import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import TalksClient from './TalksClient';

export const metadata: Metadata = {
  title: 'Talks | ECONOBEN.DEV',
  description: 'Recorded talks, podcasts, and livestreams with inline playback, transcripts, and direct source links.',
};

export default function TalksPage() {
  return (
    <EditorialPageFrame currentPath="/talks">
      <TalksClient />
    </EditorialPageFrame>
  );
}
