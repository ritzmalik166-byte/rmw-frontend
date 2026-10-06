"use client";

import NextLink from "next/link";
import { useEffect, useState } from "react";
import { hasInteracted, onFirstInteraction } from "@/lib/onFirstInteraction";

/**
 * Drop-in `next/link` that holds viewport prefetching until the visitor first
 * interacts, so other routes' JS chunks stay off the initial page load.
 */
export default function InteractionPrefetchLink({ prefetch, ...props }) {
  const [ready, setReady] = useState(hasInteracted);

  useEffect(() => {
    if (ready) return;
    return onFirstInteraction(() => setReady(true));
  }, [ready]);

  return <NextLink {...props} prefetch={ready ? prefetch : false} />;
}
