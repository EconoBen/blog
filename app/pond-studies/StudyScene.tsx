import { useId } from 'react';
import '../styles/grebe-articulation.css';
import { StudyGrebe, STUDY_GREBE_ASPECT } from './StudyGrebe';
import { ArrivalResidentGrebe, ARRIVAL_RESIDENT_ASPECT } from './ArrivalResidentGrebe';

export type StudyDirection = 'dusk' | 'atlas' | 'cutaway' | 'atlas-dusk';

/** Environment geometry is distinct; the bird and world-space waterline are shared. */
export function StudyScene({ direction, arrivalResident = false }: { direction: StudyDirection; arrivalResident?: boolean }) {
  const hybrid=direction==='atlas-dusk';
  const id = `study-${useId().replace(/:/g, '')}`;
  const surface = 263;
  const sceneHeight = direction==='cutaway'?560:440;
  const birdWidth = 268;
  const birdHeight = birdWidth / (arrivalResident ? ARRIVAL_RESIDENT_ASPECT : STUDY_GREBE_ASPECT);
  const Resident = arrivalResident ? ArrivalResidentGrebe : StudyGrebe;
  const bird = (suffix: string) => <Resident id={`${id}-${suffix}`} x={188} y={surface - birdHeight} width={birdWidth} height={birdHeight} carriedNote />;
  return (
    <svg className="study-scene-art" viewBox={`0 0 800 ${sceneHeight}`} preserveAspectRatio="xMidYMid slice" aria-hidden="true">
      <defs>
        <linearGradient id={`${id}-vignette-x`}><stop stopColor="white" stopOpacity="0"/><stop offset=".035" stopColor="white"/><stop offset=".965" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
        <linearGradient id={`${id}-vignette-y`} x2="0" y2="1"><stop stopColor="white" stopOpacity="0"/><stop offset=".035" stopColor="white"/><stop offset=".94" stopColor="white"/><stop offset="1" stopColor="white" stopOpacity="0"/></linearGradient>
        <mask id={`${id}-vignette-mask-x`}><rect width="800" height="440" fill={`url(#${id}-vignette-x)`}/></mask>
        <mask id={`${id}-vignette-mask-y`}><rect width="800" height="440" fill={`url(#${id}-vignette-y)`}/></mask>
        <linearGradient id={`${id}-sky`} x2="0" y2="1"><stop stopColor="#c8c6a9"/><stop offset="1" stopColor="#9dac93"/></linearGradient>
        <linearGradient id={`${id}-water`} x2="0" y2="1"><stop stopColor="#416e61"/><stop offset=".5" stopColor="#24534b"/><stop offset="1" stopColor="#163e3d"/></linearGradient>
        <linearGradient id={`${id}-depth`} x2="0" y2="1"><stop stopColor="#569d91"/><stop offset=".34" stopColor="#246671"/><stop offset="1" stopColor="#103943"/></linearGradient>
        <linearGradient id={`${id}-reflection`} x2="0" y2="1"><stop stopColor="white" stopOpacity=".65"/><stop offset=".72" stopColor="white" stopOpacity="0"/></linearGradient>
        <clipPath id={`${id}-above`}><rect width="800" height={surface}/></clipPath>
        <clipPath id={`${id}-below`}><rect y={surface} width="800" height={sceneHeight-surface}/></clipPath>
        <mask id={`${id}-reflection-mask`}><rect x="100" y={surface} width="500" height="175" fill={`url(#${id}-reflection)`}/></mask>
        <pattern id={`${id}-hatching`} width="7" height="7" patternUnits="userSpaceOnUse" patternTransform="rotate(24)"><path d="M0 0V7" stroke="currentColor" strokeWidth=".5" opacity=".2"/></pattern>
      </defs>

      {hybrid && <>
        <rect width="800" height="440" fill="#f7f2e8"/>
        <g mask={`url(#${id}-vignette-mask-x)`}><image href="/assets/grebes/atlas-dusk-shoreline.webp" width="800" height="440" preserveAspectRatio="xMidYMid slice" mask={`url(#${id}-vignette-mask-y)`}/></g>
        <g fill="none" stroke="#eadfbe" strokeWidth=".9" opacity=".32">
          <path d="M152 293q113-7 216-1m31 0q91 4 149-2M249 323q168 7 299-2M196 350q78-4 143-1m14 0 169-1M311 383q121-5 197 0"/>
        </g>

        <g transform="translate(741 43)" fill="none" stroke="#5b7566" strokeWidth=".8"><path d="M0-16V16M-10 0H10M0-16l-3 6h6Z"/></g>
      </>}

      {direction === 'dusk' && <>
        <rect width="800" height="440" fill={`url(#${id}-sky)`}/>
        <path d="M0 117Q104 94 198 120T395 114T588 127T800 113V187H0Z" fill="#546954"/>
        <path d="M0 148Q111 121 235 142T430 138T633 148T800 128V201H0Z" fill="#344f3c"/>
        <rect y="155" width="800" height="285" fill={`url(#${id}-water)`}/>
        <path d="M0 161Q96 173 195 156M239 159Q309 149 411 161M459 161Q597 174 737 158" stroke="#b4b791" strokeWidth="2" fill="none" opacity=".65"/>
        <g fill="none" stroke="#c8c3a0" opacity=".2">{[185,202,225,294,315,344,370,404].map((y,i)=><path key={y} d={`M${i%2?24:110} ${y}Q${230+i*21} ${y-8} ${660-i*17} ${y+2}`} strokeWidth={i%3?1:2}/>)}</g>
        <g className="study-reeds" fill="none" stroke="#193a2d" strokeWidth="2">
          <path d="M10 440Q55 276 84 181M33 440Q73 296 135 236M72 440Q104 318 113 209M763 440Q725 290 748 174M789 440Q760 316 704 243"/>
          <path d="M68 230Q34 191 53 174M94 292Q128 267 145 269M742 260Q716 230 718 214M766 348Q787 280 793 278"/>
          <path d="M84 181l6-27M113 209l4-30M748 174l2-32" strokeWidth="6" strokeLinecap="round"/>
        </g>
        <path d="M0 423Q111 390 160 440M665 440Q741 395 800 400V440" fill="#213e2e"/>
      </>}

      {direction === 'atlas' && <>
        <rect width="800" height="440" fill="#f0e8d3"/>
        <path d="M-20 127Q103 62 233 88T438 113Q548 73 685 112L819 149V330Q714 392 605 348T374 361Q212 407 102 354L-20 320Z" fill="#d4dfcb"/>
        <g fill="none" stroke="#819877" strokeWidth="1" opacity=".72">
          <path d="M-20 106Q95 40 233 67T438 92Q548 51 685 91L819 128M-20 88Q95 22 233 49T438 74Q548 33 685 73L819 110"/>
          <path d="M-20 345Q96 395 207 386T403 380Q532 350 628 383T819 350M-20 365Q96 415 207 406T403 400Q532 370 628 403T819 370"/>
          <path d="M12 163Q125 114 237 133T450 158Q584 127 740 172M44 195Q162 153 274 181T507 194Q633 165 775 201M32 297Q117 339 239 309T445 299Q608 343 756 303" opacity=".5"/>
        </g>
        <path d="M0 0H800V84Q659 38 546 69T300 34Q151 5 0 72Z" fill={`url(#${id}-hatching)`}/>
        <g stroke="#617654" strokeWidth="1.3" fill="none"><path d="M43 333q8-43 22-60m-12 33-14-14m20 0 21-15M697 113q-6-38-22-51m14 24 20-10m-27-5-16-3"/></g>

        <g transform="translate(733 51)" fill="none" stroke="#48674d"><path d="M0-22V22M-15 0H15M0-22l-4 8h8Z"/><text y="-30" x="-4" fill="#48674d" stroke="none">N</text></g>
      </>}

      {direction === 'cutaway' && <>
        <rect width="800" height={sceneHeight} fill="#e4e6cf"/>
        <path d="M0 94Q157 58 265 82T500 91T800 70V156H0Z" fill="#a2b598"/>
        <path d="M0 130Q182 99 304 121T576 122T800 99V161H0Z" fill="#6f937a"/>
        <path d={`M0 ${surface}Q107 257 219 263T421 262T631 265T800 261V560H0Z`} fill={`url(#${id}-depth)`}/>
        <g fill="#b6ebd0" opacity=".1"><path d="M107 263 0 560H81L185 263Z"/><path d="M306 263 175 560H276L352 263Z"/><path d="M561 263 520 560H641L612 263Z"/></g>
        <path d="M0 550Q97 515 168 538T346 546T560 535T800 549V560H0Z" fill="#9c9a74" opacity=".65"/>
        <g stroke="#83b391" fill="none" opacity=".5"><path d="M68 546Q38 487 80 433M61 499Q82 481 94 478M734 545Q706 478 745 434M728 495Q747 489 756 465"/></g>
        <path d={`M0 ${surface}Q107 257 219 263T421 262T631 265T800 261`} fill="none" stroke="#f0ead0" strokeWidth="3"/>
      </>}

      {direction!=='cutaway'&&<g clipPath={`url(#${id}-below)`} mask={`url(#${id}-reflection-mask)`} className="study-reflection">
        <g transform={`translate(0 ${surface*2+3}) scale(1 -1)`}><g className="study-bird-pointer"><g className="study-bird-motion">{bird('reflection')}</g></g></g>
      </g>}
      {direction==='cutaway'&&<g clipPath={`url(#${id}-below)`} opacity={.52}><g className="study-bird-pointer"><g className="study-bird-motion">{bird('underwater')}</g></g></g>}
      <g className="study-underwater-trail" fill="none" stroke={direction==='atlas'||hybrid?'#486e61':'#c6e2bf'}>
        {[0,1,2,3,4,5].map(i=><circle key={i} cx={265+i*24} cy={312+(i%3)*17} r={3+i%3*2} style={{animationDelay:`${1+i*.15}s`}}/>)}
      </g>
      <g className="study-water-rings" fill="none" stroke={direction==='atlas'||hybrid?'#416e64':'#b8c7a2'} opacity=".68">
        <ellipse cx="321" cy={surface+1} rx="163" ry="13"/><ellipse cx="319" cy={surface+3} rx="190" ry="22" opacity=".55"/>
        <path d={`M106 ${surface+4}Q133 ${surface-7} 159 ${surface-7}M480 ${surface+2}q32 3 45 9`} opacity=".6"/>
      </g>
      <g clipPath={`url(#${id}-above)`}>
        <g className="study-bird-pointer"><g className="study-bird-motion">{bird('main')}</g></g>
      </g>
      <path className="study-near-waterline" d={`M173 ${surface}Q238 ${surface+4} 304 ${surface+3}T465 ${surface}`} fill="none" stroke={direction==='atlas'||hybrid?'#607f6d':'#b9cbb1'} strokeWidth="2"/>
      <g className="study-surface-splash" fill="none" stroke={direction==='atlas'||hybrid?'#557966':'#c4ddbd'} strokeWidth="1.6">
        <path d="M225 261q-13-17-10-23M240 262q-4-27 5-33M255 263q15-18 21-17"/>
      </g>
    </svg>
  );
}
