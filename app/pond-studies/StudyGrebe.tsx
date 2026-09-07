/** Two overlapping pieces retain the original engraving while the neck leads a dive. */
export const STUDY_GREBE_ASPECT = 635 / 428;

export function StudyGrebe({id,x=0,y=0,width=360,height=width/STUDY_GREBE_ASPECT,className,carriedNote=false}:{
  id:string;x?:number;y?:number;width?:number;height?:number;className?:string;carriedNote?:boolean;
}) {
  const silhouette=`${id}-silhouette`, neck=`${id}-neck`, body=`${id}-body`;
  const engraving=<image href="/assets/grebes/horned-grebe-engraving.webp" x={0} y={0} width={1200} height={800}/>;
  return (
    <svg x={x} y={y} width={width} height={height} viewBox="340 150 635 428" preserveAspectRatio="xMidYMax meet" overflow="visible" className={className} aria-hidden="true" focusable="false">
      <defs>
        <clipPath id={silhouette} clipPathUnits="userSpaceOnUse"><path d={"M 350 283\n            L 372 275 L 397 266 L 420 253\n            C 432 246 435 231 443 219\n            C 457 201 475 189 496 182\n            C 515 176 535 174 554 173\n            L 569 168 L 582 164 L 591 160 L 600 158\n            L 602 161 L 598 165 L 602 169 L 600 174\n            L 603 179 L 601 183 L 605 186 L 600 190\n            L 602 194 L 600 198 L 605 203 L 601 208\n            L 602 212 L 599 217 L 601 224\n            C 606 244 613 273 604 305\n            C 593 332 582 376 570 406\n            C 565 419 563 433 570 439\n            C 589 434 621 420 653 412\n            C 685 405 727 407 760 411\n            C 797 418 833 432 867 450\n            C 891 461 909 474 923 490\n            L 944 511 L 932 506 L 951 531 L 942 526\n            L 960 551 L 952 548 L 963 563\n            C 949 571 902 574 844 575\n            C 723 580 533 569 444 556\n            C 432 540 435 506 443 480\n            C 452 446 477 411 497 382\n            C 510 360 515 339 509 324\n            C 499 314 484 304 470 299\n            L 446 286 L 430 280 L 414 279\n            L 398 282 L 382 284 L 366 284 Z"}/></clipPath>
        <clipPath id={neck} clipPathUnits="userSpaceOnUse"><path d={"\n            M 350 283\n            L 372 275 L 397 266 L 420 253\n            C 432 246 435 231 443 219\n            C 457 201 475 189 496 182\n            C 515 176 535 174 554 173\n            L 569 168 L 582 164 L 591 160 L 600 158\n            L 602 161 L 598 165 L 602 169 L 600 174\n            L 603 179 L 601 183 L 605 186 L 600 190\n            L 602 194 L 600 198 L 605 203 L 601 208\n            L 602 212 L 599 217 L 601 224\n            C 606 244 613 273 604 305\n            C 593 332 582 376 570 406\n            C 565 419 563 433 570 439\n            C 571 465 583 499 577 523 C 542 535 483 535 437 531 C 435 513 439 494 443 480 C 452 446 477 411 497 382 C 510 360 515 339 509 324 C 499 314 484 304 470 299 L 446 286 L 430 280 L 414 279 L 398 282 L 382 284 L 366 284 Z"}/></clipPath>
        <clipPath id={body} clipPathUnits="userSpaceOnUse"><path d={"M455 456 C493 471 533 475 552 460 C559 452 564 444 570 439 C 589 434 621 420 653 412 C 685 405 727 407 760 411 C 797 418 833 432 867 450 C 891 461 909 474 923 490 L 944 511 L 932 506 L 951 531 L 942 526 L 960 551 L 952 548 L 963 563 C 949 571 902 574 844 575 C 723 580 533 569 444 556 C 432 540 435 506 443 480 C448 465 451 460 455 456 Z"}/></clipPath>
      </defs>
      <g className="grebe-neck-look"><g className="grebe-neck-motion">
        {carriedNote&&<g className="study-carried-slip" transform="translate(294 294) rotate(-8)">
          <path d="M0 0h98v120H0Z" fill="#f5edda" stroke="#9f967b" strokeWidth="2"/>
          <path d="M18 28h62M18 46h62M18 64h42M18 91h53" stroke="#527565" fill="none" strokeWidth="3"/>
        </g>}
        <g clipPath={`url(#${silhouette})`}><g clipPath={`url(#${neck})`}>{engraving}</g></g>
      </g></g>
      <g clipPath={`url(#${silhouette})`}><g clipPath={`url(#${body})`}>{engraving}</g></g>
    </svg>
  );
}
