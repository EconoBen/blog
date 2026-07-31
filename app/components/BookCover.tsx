import Image from 'next/image';
import { AGENT_MEMORY } from '../book/bookData';

interface BookCoverProps {
  className?: string;
  eager?: boolean;
  size?: 'hero' | 'compact';
}

export function BookCover({
  className = '',
  eager = false,
  size = 'hero',
}: BookCoverProps) {
  return (
    <figure
      className={`book-cover book-cover--${size} ${className}`.trim()}
    >
      <div className="book-cover__crop">
        <Image
          src={AGENT_MEMORY.coverSrc}
          alt={AGENT_MEMORY.coverAlt}
          width={1080}
          height={1350}
          priority={eager}
          sizes={
            size === 'hero'
              ? '(max-width: 767px) 82vw, (max-width: 1100px) 44vw, 390px'
              : '(max-width: 767px) 34vw, 180px'
          }
          className="book-cover__source"
        />
      </div>
    </figure>
  );
}
