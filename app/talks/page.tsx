import type { Metadata } from 'next';
import { EditorialPageFrame } from '../components/EditorialPageFrame';
import { talksConfig } from '../config/talksConfig';
import TalksClient from './TalksClient';

export const metadata: Metadata = {
  title: 'Talks | Ben Labaschin',
  description: 'Recorded talks, podcasts, and livestreams with inline playback, transcripts, and direct source links.',
};

export default function TalksPage() {
  const { talks, subtitle } = talksConfig;
  const sortedTalks = [...talks].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  const featuredTalk = sortedTalks[0];
  const sourceCounts = sortedTalks.reduce(
    (counts, talk) => {
      if (talk.youtubeId) {
        counts.video += 1;
      }

      if (talk.spotifyUrl) {
        counts.audio += 1;
      }

      if (talk.transcriptUrl) {
        counts.transcripts += 1;
      }

      return counts;
    },
    { video: 0, audio: 0, transcripts: 0 }
  );

  return (
    <EditorialPageFrame currentPath="/talks">
      <section className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-8 pb-12 pt-20 lg:grid-cols-12 lg:items-end">
        <div className="lg:col-span-8">
          <span className="mb-6 block font-label text-xs font-bold uppercase tracking-[0.2em] text-secondary">Watch and listen</span>
          <h1 className="max-w-4xl font-headline text-5xl font-black tracking-tighter text-on-surface md:text-7xl">
            Talks
          </h1>
          <p className="mt-6 max-w-3xl font-body text-xl leading-relaxed text-secondary md:text-2xl">
            {subtitle}
          </p>
          <div className="mt-8 flex flex-wrap gap-3">
            <span className="rounded-full bg-surface-container-low px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider text-secondary">
              Inline playback
            </span>
            <span className="rounded-full bg-surface-container-low px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider text-secondary">
              Transcripts
            </span>
            <span className="rounded-full bg-surface-container-low px-5 py-2 font-label text-[11px] font-bold uppercase tracking-wider text-secondary">
              Source links
            </span>
          </div>
        </div>

        <aside className="rounded-2xl bg-surface-container-low p-8 lg:col-span-4">
          <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-secondary">At a glance</p>
          <div className="mt-6 grid gap-4 sm:grid-cols-3 lg:grid-cols-1">
            <div className="rounded-xl bg-surface-container-highest p-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Recordings</p>
              <p className="mt-2 font-headline text-3xl font-bold text-on-surface">{sortedTalks.length}</p>
            </div>
            <div className="rounded-xl bg-surface-container-highest p-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Video sessions</p>
              <p className="mt-2 font-headline text-3xl font-bold text-on-surface">{sourceCounts.video}</p>
            </div>
            <div className="rounded-xl bg-surface-container-highest p-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Audio sessions</p>
              <p className="mt-2 font-headline text-3xl font-bold text-on-surface">{sourceCounts.audio}</p>
            </div>
            <div className="rounded-xl bg-surface-container-highest p-4">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Transcript links</p>
              <p className="mt-2 font-headline text-3xl font-bold text-on-surface">{sourceCounts.transcripts}</p>
            </div>
          </div>
          {featuredTalk && (
            <div className="mt-8 border-t border-outline-variant/30 pt-6">
              <p className="font-label text-[10px] font-bold uppercase tracking-[0.3em] text-primary">Featured talk</p>
              <p className="mt-3 font-headline text-xl font-bold leading-snug text-on-surface">{featuredTalk.title}</p>
              <p className="mt-3 font-body text-base leading-relaxed text-secondary">
                Open the newest session first, then use the filters to jump by topic.
              </p>
            </div>
          )}
        </aside>
      </section>

      <TalksClient />
    </EditorialPageFrame>
  );
}
