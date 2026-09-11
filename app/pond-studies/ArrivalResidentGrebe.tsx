import { ARRIVAL_BODY_OUTLINE } from '../components/arrivalRig';

export const ARRIVAL_RESIDENT_ASPECT = 1190 / 800;

// The source faces right, so the neck's local angles reverse inside the mirror.
// An inner 0-origin SVG keeps these pivots in the engraving's own coordinates.
const articulation = `
.arrival-resident-engraving .grebe-neck-look,
.arrival-resident-engraving .grebe-neck-motion { transform-origin:1080px 620px; }
.arrival-resident-engraving .grebe-neck-look { rotate:calc(-1 * var(--grebe-neck-look,0deg)); }
:is(.field-pond,.study-world).is-diving .arrival-resident-engraving .grebe-neck-motion { animation-name:arrival-resident-neck-dive; }
@keyframes arrival-resident-neck-dive {
  0% { transform:rotate(0); }
  8% { transform:rotate(-3deg); animation-timing-function:cubic-bezier(.4,0,.6,1); }
  19% { transform:rotate(10deg); }
  29%,39% { transform:rotate(14deg); }
  49% { transform:rotate(8deg); animation-timing-function:cubic-bezier(.35,0,.4,1); }
  56% { transform:rotate(0); }
  72% { transform:rotate(-2deg); }
  86% { transform:rotate(1deg); }
  100% { transform:rotate(0); }
}
@media(prefers-reduced-motion:reduce) {
  .arrival-resident-engraving .grebe-neck-look { rotate:0deg; }
}
`;

/** The arrival and homepage resident share one engraving, silhouette and water contact. */
export function ArrivalResidentGrebe({ id, x = 0, y = 0, width = 360, height = width / ARRIVAL_RESIDENT_ASPECT, className, carriedNote = false }: {
  id: string; x?: number; y?: number; width?: number; height?: number; className?: string; carriedNote?: boolean;
}) {
  const silhouette = `${id}-silhouette`, neck = `${id}-neck`, body = `${id}-body`, overlap = `${id}-neck-overlap`;
  const engraving = <image href="/assets/grebes/arrival/engraving-plate-v2.webp" x={0} y={0} width={1536} height={1024} />;
  return (
    <svg x={x} y={y} width={width} height={height} viewBox="185.44029850746267 50 1190 800" preserveAspectRatio="xMidYMax meet" overflow="visible" className={`arrival-resident-engraving${className ? ` ${className}` : ''}`} aria-hidden="true" focusable="false">
      <style>{articulation}</style>
      <defs>
        <clipPath id={silhouette} clipPathUnits="userSpaceOnUse"><path d={ARRIVAL_BODY_OUTLINE} /></clipPath>
        <clipPath id={body} clipPathUnits="userSpaceOnUse"><path d="M0 0H850V420Q945 438 1015 505H1536V1024H0Z" /></clipPath>
        <linearGradient id={overlap} gradientUnits="userSpaceOnUse" x1="0" y1="560" x2="0" y2="660"><stop stopColor="white" /><stop offset="1" stopColor="black" /></linearGradient>
        <mask id={neck} maskUnits="userSpaceOnUse" x="0" y="0" width="1536" height="1024">
          <path d="M850 0H1536V680H980L975 530L935 420H850Z" fill={`url(#${overlap})`} />
        </mask>
      </defs>
      <svg x={0} y={0} width={1536} height={1024} viewBox="0 0 1536 1024" overflow="visible">
        <g transform="translate(1536 0) scale(-1 1)">
          <g clipPath={`url(#${silhouette})`}><g clipPath={`url(#${body})`}>{engraving}</g></g>
          <g className="grebe-neck-look"><g className="grebe-neck-motion">
            {carriedNote && <g className="study-carried-slip" transform="translate(1300 320) rotate(8) scale(1.85)">
              <path d="M0 0h98v120H0Z" fill="#f5edda" stroke="#9f967b" strokeWidth="2" />
              <path d="M18 28h62M18 46h62M18 64h42M18 91h53" stroke="#527565" fill="none" strokeWidth="3" />
            </g>}
            <g clipPath={`url(#${silhouette})`}><g mask={`url(#${neck})`}>{engraving}</g></g>
          </g></g>
        </g>
      </svg>
    </svg>
  );
}
