'use client';

import type { ComponentProps, MouseEvent } from 'react';
import Link from 'next/link';
import { track } from '@vercel/analytics/react';

export type FunnelEventName =
  | 'homepage_book_click'
  | 'oreilly_read_click'
  | 'oreilly_trial_click';

interface TrackedActionProps extends Omit<ComponentProps<typeof Link>, 'onClick'> {
  eventName: FunnelEventName;
  eventProperties?: Record<string, string | number | boolean | null>;
  onClick?: (event: MouseEvent<HTMLAnchorElement>) => void;
}

export function TrackedAction({
  eventName,
  eventProperties,
  onClick,
  ...linkProps
}: TrackedActionProps) {
  const handleClick = (event: MouseEvent<HTMLAnchorElement>) => {
    try {
      track(eventName, eventProperties);
    } catch {
      // Analytics is best-effort. Navigation remains authoritative.
    }
    onClick?.(event);
  };

  return <Link {...linkProps} onClick={handleClick} />;
}
