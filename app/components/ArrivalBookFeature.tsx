import type { CSSProperties } from 'react';
import { AGENT_MEMORY, chapters } from '../book/bookData';
import { bookReleaseSummary } from '../book/bookReleaseSummary';
import '../styles/arrival-book-feature.css';

export interface ArrivalBookFeatureProps {
  style?: CSSProperties;
}

/** The parent opening owns this publication's position, movement and visibility. */
export function ArrivalBookFeature({ style }: ArrivalBookFeatureProps) {
  return (
    <figure className="arrival-book-feature" style={style}>
      <div className="arrival-book-feature__cover">
        <img
          src={AGENT_MEMORY.coverSrc}
          alt={AGENT_MEMORY.coverAlt}
          width={1080}
          height={1350}
          loading="eager"
          decoding="async"
          draggable={false}
          className="arrival-book-feature__cover-source"
        />
      </div>
      <figcaption className="arrival-book-feature__details">
        <p className="arrival-book-feature__edition">{AGENT_MEMORY.releaseLabel}</p>
        <h2 className="arrival-book-feature__title">{AGENT_MEMORY.title}</h2>
        <p className="arrival-book-feature__author">{AGENT_MEMORY.author}</p>
        <p className="arrival-book-feature__publisher">{AGENT_MEMORY.publisher}</p>
        <p className="arrival-book-feature__update">{bookReleaseSummary(chapters)}</p>
      </figcaption>
    </figure>
  );
}
