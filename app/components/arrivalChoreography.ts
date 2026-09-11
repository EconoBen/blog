import { ARRIVAL_BEATS as B } from './arrivalTimeline';
import { flightDeployment } from './arrivalFlightRig';
export type ArrivalViewport = { width: number; height: number };
export type ArrivalTarget = { x: number; y: number; width: number };
export const unit = (value: number) => Math.max(0, Math.min(1, value));
export const between = (time: number, start: number, end: number) => unit((time - start) / (end - start));
export const smooth = (value: number) => { const p = unit(value); return p * p * (3 - 2 * p); };
export const smoother = (value: number) => { const p=unit(value);return p*p*p*(p*(p*6-15)+10); };
export const mix = (a: number, b: number, p: number) => a + (b - a) * p;
const bezier = (a: number, b: number, c: number, d: number, p: number) => (1-p)**3*a + 3*(1-p)**2*p*b + 3*(1-p)*p*p*c + p**3*d;

/** All coordinates share the visible-time clock, including the feather and wingbeats. */
export function arrivalPose(time: number, view: ArrivalViewport, target: ArrivalTarget) {
  const { width: vw, height: vh } = view;
  const size = Math.min(vw * .98, vh * .77, 840);
  const lift = between(time, B.liftStart, B.launchEnd-180);
  const crouch = Math.sin(Math.PI * between(time, 3220, B.liftStart)) ** 2;
  const crossing = between(time, B.firstPassStart, B.firstPassEnd);
  const secondCrossing = between(time, B.secondPassStart, B.secondPassEnd);
  const returning = between(time, B.secondPassEnd, B.waterContact);
  // Let the feather follow the departing bird into view, rather than spending
  // the first half-second of its beat accelerating above the viewport.
  const featherRelease = B.featherStart - 220;
  const feather = between(time, featherRelease, B.featherContact);
  const featherFall = feather + feather * feather * (1 - feather);
  const featherSway = Math.sin(feather * Math.PI * 3.5) * Math.sin(feather * Math.PI);
  const compactLandscape = vh < 520 && vw > vh;
  const bookWidth = Math.min(550, vw - (compactLandscape ? 192 : 48));
  // Reserve the publication's actual responsive height plus rounding clearance.
  const bookHeight = compactLandscape ? 162 : vw <= 350 ? 212 : vw <= 480 ? 206 : 227;
  const bookY = Math.min(vh * .65, vh - bookHeight / 2 - 24);
  // Reserve the complete feather envelope, its shallow flight arc and the
  // publication below it. Short landscape moves Skip beside the smaller card.
  const bookTop = bookY - bookHeight / 2;
  const topClearance = compactLandscape ? 12 : 80;
  const arcClearance = Math.min(vh * .025, 20);
  const crossingSize = Math.min(vw * .64, vh * .52, 650,
    Math.max(40, (bookTop - topClearance - 24 - arcClearance) / 1.18));
  const secondSize = crossingSize * .82;
  const firstY = bookTop - 24 - crossingSize * .4;
  const secondY = firstY - Math.min(vh * .04, 26, crossingSize * .12);
  const returnSize = mix(secondSize, target.width, smoother(returning));
  const secondArc = Math.min(vh*.018,14);
  const passDuration = B.secondPassEnd-B.secondPassStart;
  const bankDuration = B.waterContact-B.secondPassEnd;
  // A cubic's first control point is one third of duration × entry velocity.
  // Match the outgoing pass in both axes, then approach contact at zero speed.
  const bankEntryX = vw+secondSize*1.2;
  const bankControlX = bankEntryX+(vw+secondSize*2.4)/passDuration*bankDuration/3;
  const bankControlY = secondY+Math.PI*secondArc/passDuration*bankDuration/3;
  const bankRotate = bezier(4,4+7/passDuration*400/3,-14,-14,between(time,B.secondPassEnd,B.secondPassEnd+400));
  const forward = smoother(between(time, 3200, 3920)) * Math.min(vw*.04,40);
  const heroY = vh * .63 + Math.sin(time / 800) * 1.4 + crouch * 15 - Math.pow(lift, 1.7) * (vh+size*.65);
  const heroSize = size * (1 - lift * .2);
  const crossX=mix(-crossingSize*1.2, vw+crossingSize*1.2, crossing);
  const secondX=mix(-secondSize*1.2, vw+secondSize*1.2, secondCrossing);
  const bookArrival = between(time, B.bookArrivalStart, B.bookSettled);
  const bookArrivalSway = bookArrival === 1 ? 0 : Math.sin(bookArrival*Math.PI);
  const bookEase = 1 - (1-bookArrival)**3;
  const bookDeparture = smoother(between(time, B.bookDepart, B.secondPassEnd));
  const settledBookX = vw * .5;
  const bookX = mix(
    mix(-bookWidth*.7, settledBookX, bookEase),
    vw+bookWidth*.7,
    bookDeparture,
  );
  const contact=between(time,B.waterContact,B.landEnd);
  return {
    surface: {size},
    hero: {
      x: vw * .5 + forward,
      y: heroY,
      size: heroSize,
      rotate: -Math.sin(Math.PI*between(time,3250,B.launchEnd))*10,
      awake: smoother(between(time, 500, 1900)),
      wings: flightDeployment(time),
      flight: smoother(between(time, 3200, 4150)),
      immersion: 1,
      reflectionOpacity: (1 - smooth(between(time, B.liftStart-60, B.liftClear))) * .16,
    },
    feather: {
      x: feather === 1 ? vw * .54 : mix(vw * .48 - Math.min(vw * .06, 24), vw * .54, feather) + featherSway * Math.min(vw * .09, 105),
      y: feather === 1 ? vh * .63 : mix(Math.min(vh * .12, 92), vh * .63, featherFall),
      rotate: -35 + featherSway * 45 + feather * 114,
      scale: mix(.9, .42, feather),
      tilt: Math.sin(feather*Math.PI*3)*42,
      opacity: between(time,featherRelease,featherRelease+150)*(1-smoother(between(time,B.featherContact+120,B.rippleEnd-100))),
    },
    crossing: {
      x: crossX,
      y: firstY - Math.sin(crossing * Math.PI) * Math.min(vh*.025,20),
      size: crossingSize,
      rotate: -5 + crossing * 8,
      opacity: time>=B.firstPassStart&&time<B.firstPassEnd?1:0,
    },
    secondCrossing: {
      x: secondX,
      y: secondY - Math.sin(secondCrossing*Math.PI)*secondArc,
      size: secondSize,
      rotate: -3 + secondCrossing * 7,
      opacity: time>=B.secondPassStart&&time<B.secondPassEnd?1:0,
    },
    book: {
      x: bookX,
      y: bookY + bookArrivalSway*(1-bookArrival)*14 - Math.sin(bookDeparture*Math.PI)*12,
      width: bookWidth,
      height: bookHeight,
      rotate: -6*(1-bookArrival)**2 + bookArrivalSway*1.4 + bookDeparture*6,
      opacity: time>=B.bookArrivalStart&&time<B.secondPassEnd?1:0,
    },
    reveal: smoother(between(time,B.bookDepart,B.revealEnd)),
    returning: {
      x: bezier(bankEntryX,bankControlX,target.x,target.x,returning),
      y: bezier(secondY,bankControlY,target.y,target.y,returning)+Math.sin(contact*Math.PI)*3*(1-contact),
      size: returnSize,
      rotate: mix(bankRotate,0,smoother(between(time,B.waterContact-720,B.waterContact))),
      // One closing envelope across viewports keeps late rotation from reopening
      // a folded wing, and clears the water before the final gliding approach.
      wings: 1-smoother(between(time,B.waterContact-720,B.waterContact-160)),
      opacity: time<B.landEnd?1:0,
      upright: smoother(between(time,B.waterContact-1050,B.waterContact-80)),
      immersion: mix(1,850/1024,smoother(between(time,B.waterContact-70,B.landEnd))),
    },
    resident: time>=B.landEnd?1:0,
    landingRipple: between(time,B.waterContact,B.duration),
  };
}
