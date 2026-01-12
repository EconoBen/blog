import { Metadata } from 'next';
import TalksClient from './TalksClient';

export const metadata: Metadata = {
  title: 'Talks | Ben Labaschin',
  description: 'Conference talks, presentations, and live streams on tech topics.',
};

export default function TalksPage() {
  return <TalksClient />;
}
