import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { postService } from '../services/PostService';
import { buildPondStudyContent } from './studyContent';
import { PondStudies } from './PondStudies';

export const metadata: Metadata = {
  title: 'Pond studies | ECONOBEN.DEV',
  description: 'Three directions for the grebe and the writing it discovers.',
  robots: { index: false, follow: false },
};

export default async function PondStudiesPage() {
  if (process.env.VERCEL_ENV === 'production') notFound();
  const content = buildPondStudyContent(await postService.getAllPosts());
  return <PondStudies {...content} />;
}
