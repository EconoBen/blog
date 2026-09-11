/** Shared contact times keep the bird, camera and water on one visible clock. */
export const ARRIVAL_BEATS = {
  wakeEnd: 2200, shakeEnd: 3250, launchEnd: 5300,
  featherStart: 5300, featherEnd: 7750, featherContact: 7750,
  rippleEnd: 8500, firstPassStart: 8500, firstPassEnd: 9700,
  bookArrivalStart: 8740, bookSettled: 10000,
  secondPassStart: 13300, bookDepart: 13750, secondPassEnd: 14600,
  revealEnd: 14800, landEnd: 16650,
  liftStart: 3700, liftClear: 4100, waterContact: 16400,
  duration: 17600,
} as const;
export const ARRIVAL_DURATION_MS = ARRIVAL_BEATS.duration;

export type ArrivalPhase =
  | 'wake'
  | 'shake'
  | 'launch'
  | 'feather'
  | 'ripple'
  | 'introduce'
  | 'book'
  | 'collect'
  | 'land'
  | 'settle'
  | 'done';

/** The composition uses one clock so every layer pauses and resumes together. */
export function getArrivalPhase(elapsedMs: number): ArrivalPhase {
  const elapsed = Number.isNaN(elapsedMs) ? 0 : Math.max(0, elapsedMs);
  if (elapsed < ARRIVAL_BEATS.wakeEnd) return 'wake';
  if (elapsed < ARRIVAL_BEATS.shakeEnd) return 'shake';
  if (elapsed < ARRIVAL_BEATS.launchEnd) return 'launch';
  if (elapsed < ARRIVAL_BEATS.featherEnd) return 'feather';
  if (elapsed < ARRIVAL_BEATS.rippleEnd) return 'ripple';
  if (elapsed < ARRIVAL_BEATS.bookSettled) return 'introduce';
  if (elapsed < ARRIVAL_BEATS.secondPassStart) return 'book';
  if (elapsed < ARRIVAL_BEATS.secondPassEnd) return 'collect';
  if (elapsed < ARRIVAL_BEATS.landEnd) return 'land';
  if (elapsed < ARRIVAL_DURATION_MS) return 'settle';
  return 'done';
}
