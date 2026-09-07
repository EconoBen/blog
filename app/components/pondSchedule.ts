export type PondVisit = {
  id: number; side: 'left' | 'right'; duration: number; height: number;
  size: number; reading: boolean; encounter: boolean; headStart: number;
};

/** Coordinates two shores; meetings wait until existing visitors have left. */
export function startPondVisits(onChange: (visits: PondVisit[]) => void, random = Math.random) {
  const timers = new Set<ReturnType<typeof setTimeout>>();
  const slots: Partial<Record<PondVisit['side'], PondVisit>> = {};
  let id = 0, meetingDue = false, stopped = false;
  const between = (min: number, max: number) => min + random() * (max - min);
  const later = (fn: () => void, ms: number) => {
    const timer = setTimeout(() => { timers.delete(timer); if (!stopped) fn(); }, ms);
    timers.add(timer);
  };
  const publish = () => onChange(Object.values(slots) as PondVisit[]);
  const scheduleMeeting = () => later(() => { meetingDue = true; tryMeeting(); }, between(100, 170) * 1000);
  const tryMeeting = () => {
    if (!meetingDue || slots.left || slots.right) return;
    meetingDue = false;
    for (const side of ['left', 'right'] as const) {
      slots[side] = { id: id++, side, duration: 40, height: 68, size: 138, reading: false, encounter: true, headStart: 0 };
    }
    publish();
    later(() => {
      delete slots.left; delete slots.right; publish();
      later(() => arrive('left'), between(9, 18) * 1000);
      later(() => arrive('right'), between(18, 27) * 1000);
      scheduleMeeting();
    }, 40000);
  };
  const arrive = (side: PondVisit['side'], first = false) => {
    if (slots[side]) return;
    if (meetingDue) { tryMeeting(); return; }
    const duration = between(34, 49);
    // Start the first left swimmer in view, retaining the same crossing speed.
    const headStart = first ? (side === 'left' ? duration / 4 : 4) : 0;
    slots[side] = {
      id: id++, side, duration, headStart, encounter: false,
      height: side === 'left' ? between(62, 80) : between(24, 48),
      size: between(125, 150), reading: side === 'right' && (first || random() < .55),
    };
    publish();
    later(() => {
      delete slots[side]; publish();
      if (meetingDue) tryMeeting();
      else later(() => arrive(side), between(9, 23) * 1000);
    }, (duration - headStart) * 1000);
  };
  arrive('left', true);
  later(() => arrive('right', true), between(2, 4) * 1000);
  scheduleMeeting();
  return () => { stopped = true; timers.forEach(clearTimeout); timers.clear(); };
}
