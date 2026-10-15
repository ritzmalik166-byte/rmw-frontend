"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Sets `data-revealed` once the wrapper scrolls into view and clears it when
 * the wrapper drops back below the viewport, so children can animate with CSS
 * via `group-data-[revealed=true]:` variants.
 */
export default function RevealOnScroll({ className = "", children }) {
  const ref = useRef(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setRevealed(true);
        } else if (entry.boundingClientRect.top > 0) {
          setRevealed(false);
        }
      },
      { rootMargin: "0px 0px -15% 0px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} data-revealed={revealed} className={`group ${className}`}>
      {children}
    </div>
  );
}
