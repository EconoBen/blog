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
      {/* ── Hero ── */}
      <section className="mx-auto max-w-[1440px] px-5 pb-6 pt-14 md:px-8 md:pb-8 md:pt-20">
        <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Recorded sessions</p>
        <h1 className="mt-4 max-w-3xl font-headline text-4xl font-black tracking-tight text-on-surface md:text-5xl">
          Talks
        </h1>
        <p className="mt-4 max-w-2xl font-body text-lg leading-relaxed text-on-surface">
          Recorded talks, podcasts, and livestreams with inline playback, transcripts, and direct source links
        </p>
      </section>

      {/* ── Talks content ── */}
      <section className="border-t border-outline-variant/20 pt-4 pb-12 md:pt-5 md:pb-16">
        <TalksClient />
      </section>
    </EditorialPageFrame>
  );
}
