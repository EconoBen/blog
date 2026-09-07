import Image from 'next/image';
import { AGENT_MEMORY } from '../book/bookData';

/** Composite the exact book cover over the mascot's blank card. */
export function ReadingGrebe() {
  return (
    <span className="pond-sprite pond-sprite--note pond-reading-grebe" aria-hidden="true">
      <span className="pond-reader-cover">
        <Image src={AGENT_MEMORY.coverSrc} alt="" width={1080} height={1350} sizes="48px" />
      </span>
    </span>
  );
}
