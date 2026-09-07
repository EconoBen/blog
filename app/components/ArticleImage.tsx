import 'server-only';

import Image from 'next/image';
import path from 'node:path';
import sharp from 'sharp';
import type { CSSProperties } from 'react';

type Dimensions = { width: number; height: number };
const dimensions = new Map<string, Promise<Dimensions | null>>();
const publicDirectory = path.resolve(process.cwd(), 'public');

async function localDimensions(src: string): Promise<Dimensions | null> {
  if (!src.startsWith('/') || src.startsWith('//')) return null;
  if (!dimensions.has(src)) {
    dimensions.set(src, (async () => {
      try {
        const pathname = decodeURIComponent(new URL(src, 'https://econoben.dev').pathname);
        const filename = path.resolve(publicDirectory, `.${pathname}`);
        if (!filename.startsWith(`${publicDirectory}${path.sep}`)) return null;
        const metadata = await sharp(filename).metadata();
        if (!metadata.width || !metadata.height) return null;
        const rotated = metadata.orientation && metadata.orientation >= 5;
        return { width: rotated ? metadata.height : metadata.width, height: rotated ? metadata.width : metadata.height };
      } catch {
        // Preserve remote, unavailable, or unusual legacy media as ordinary images.
        return null;
      }
    })());
  }
  return dimensions.get(src)!;
}

/** Local originals stay intact; the image service delivers the size readers need. */
export async function ArticleImage({ src, alt = '', title, className = 'blog-image', eager = false, sizes = '(max-width: 767px) calc(100vw - 40px), 796px', style, width, height }: {
  src: string; alt?: string; title?: string; className?: string; eager?: boolean; sizes?: string;
  style?: CSSProperties; width?: number | string; height?: number | string;
}) {
  const size = await localDimensions(src);
  const shared = { alt, title, className, loading: eager ? 'eager' as const : 'lazy' as const, decoding: 'async' as const, style: { maxWidth: '100%', height: 'auto', ...style } };
  if (!size) return <img src={src} width={width} height={height} {...shared} />;
  return <Image src={src} width={size.width} height={size.height} sizes={sizes} fetchPriority={eager ? 'high' : undefined} {...shared} />;
}
