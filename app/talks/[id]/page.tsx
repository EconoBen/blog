import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { findTalk, getTalkSlug, talksConfig, type Talk } from '../../config/talksConfig';
import { getSiteUrl } from '../../utils/siteUrl';
import TalkRedirect from './TalkRedirect';

/**
 * A metadata-only route. It renders no design of its own: its whole job is to
 * give each talk a shareable URL whose Open Graph tags describe that talk, so a
 * link pasted into LinkedIn or Slack previews properly. Visitors are bounced to
 * /talks#<id>, which is the real page.
 */

const previewImage = (talk: Talk): string =>
  talk.youtubeId
    ? `https://img.youtube.com/vi/${talk.youtubeId}/maxresdefault.jpg`
    : `${getSiteUrl()}/og-image.png`;

export async function generateStaticParams() {
  return talksConfig.talks.map((talk) => ({ id: getTalkSlug(talk) }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const talk = findTalk(id);

  if (!talk) {
    return { title: 'Not Found | Talks | ECONOBEN.DEV' };
  }

  const canonicalUrl = `${getSiteUrl()}/talks/${getTalkSlug(talk)}`;
  const image = previewImage(talk);

  return {
    title: `${talk.title} | Talks | ECONOBEN.DEV`,
    description: talk.description,
    alternates: { canonical: canonicalUrl },
    openGraph: {
      title: `${talk.title} (${talk.event})`,
      description: talk.description,
      type: 'article',
      url: canonicalUrl,
      publishedTime: new Date(talk.date).toISOString(),
      tags: talk.topics,
      images: [{ url: image, width: 1280, height: 720, alt: talk.title }],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${talk.title} (${talk.event})`,
      description: talk.description,
      images: [image],
    },
  };
}

export default async function TalkPermalinkPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const talk = findTalk(id);

  if (!talk) {
    notFound();
  }

  return (
    <>
      <TalkRedirect anchor={talk.id} />
      {/* Only ever seen if JavaScript is off, or in the instant before the bounce. */}
      <noscript>
        <p>
          <Link href={`/talks#${talk.id}`}>{talk.title}</Link>
        </p>
      </noscript>
    </>
  );
}
