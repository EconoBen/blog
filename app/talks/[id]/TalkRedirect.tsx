'use client';

import { useEffect } from 'react';

/**
 * This route exists so that a shared link to a single talk carries that talk's
 * own Open Graph tags. Crawlers read the metadata and stop. People get bounced
 * straight to the talks page, anchored to the right card.
 *
 * The bounce is deliberately client side. An HTTP redirect would be followed by
 * the crawler, which would then read the generic /talks metadata instead, which
 * defeats the point of the route existing at all.
 */
export default function TalkRedirect({ anchor }: { anchor: string }) {
  useEffect(() => {
    window.location.replace(`/talks#${anchor}`);
  }, [anchor]);

  return null;
}
