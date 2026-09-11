'use client';

// The isolated flight study and opening use the same prepared character.
export {AnatomicalBird as ArrivalBird, ANATOMICAL_ART as ARRIVAL_ART} from './AnatomicalBird';

export function ArrivalFeather() {
  return <svg viewBox="0 0 90 170" fill="none" aria-hidden="true">
    <path d="M48 147C22 123 15 96 27 58 36 31 55 13 67 5 78 40 80 74 67 110 61 127 53 140 48 147Z" fill="#e4dfd4" stroke="#494a42" strokeWidth="1" />
    <path d="M48 147C24 125 17 93 28 60 36 32 55 13 67 5 52 45 45 100 48 147Z" fill="#777b73" />
    <path d="M48 169C43 150 46 118 50 87S60 30 67 5" stroke="#494a42" strokeWidth="1.8" />
    {Array.from({ length: 26 }, (_, i) => {
      const y = 27 + i * 4.35;
      const center = 48 + Math.pow((144 - y) / 137, 2) * 19;
      const span = Math.sin((y - 5) / 145 * Math.PI) * 24;
      return <g key={i} stroke={i % 3 ? '#494e47' : '#f7f2e8'} strokeWidth={i % 3 ? '.7' : '1'} opacity=".9">
        <path d={`M${center} ${y + 5}Q${center - span * .6} ${y - 2} ${center - span} ${y - 12}`} />
        <path d={`M${center} ${y + 5}Q${center + span * .6} ${y - 4} ${center + span * .8} ${y - 13}`} />
      </g>;
    })}
  </svg>;
}
