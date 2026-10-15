"use client";

import { useEffect, useRef } from "react";

/**
 * Muted looping video that only downloads once it nears the viewport and
 * pauses while off-screen, so below-the-fold videos don't decode on load.
 */
export default function LazyVideo({ src, ...props }) {
  const ref = useRef(null);

  useEffect(() => {
    const video = ref.current;
    if (!video) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          if (video.getAttribute("src") !== src) video.setAttribute("src", src);
          video.play().catch(() => {});
        } else {
          video.pause();
        }
      },
      { rootMargin: "300px 0px" }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [src]);

  return <video ref={ref} loop muted playsInline preload="none" {...props} />;
}
