"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import Section2Hero from "./Section2Hero";
import { isAutomationLab } from "@/lib/isAutomationLab";
import { onFirstInteraction } from "@/lib/onFirstInteraction";

const Section2Background = dynamic(() => import("./Section2Background"));

const Section2 = () => {
  const sectionRef = useRef(null);
  const [shouldMountBackground, setShouldMountBackground] = useState(false);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el || shouldMountBackground) return;

    // Labs: keep Three.js off the critical path so mobile PSI can finish.
    if (isAutomationLab()) return;

    let cancelled = false;
    let idleId = 0;
    let timeoutId = 0;
    let cancelInteraction = () => {};

    // Decorative WebGL background: wait for the first scroll/touch/mouse move
    // so Three.js never competes with the initial load.
    const mountWhenIdle = () => {
      if (cancelled || shouldMountBackground) return;
      const run = () => {
        if (!cancelled) setShouldMountBackground(true);
      };
      cancelInteraction = onFirstInteraction(() => {
        if (cancelled) return;
        if (typeof window.requestIdleCallback === "function") {
          idleId = window.requestIdleCallback(run, { timeout: 1800 });
        } else {
          timeoutId = window.setTimeout(run, 400);
        }
      });
    };

    const afterLoader = (cb) => {
      if (window.__rmwLoaderDone) cb();
      else window.addEventListener("rmw:loader-done", cb, { once: true });
    };

    if (!("IntersectionObserver" in window)) {
      afterLoader(mountWhenIdle);
      return () => {
        cancelled = true;
        cancelInteraction();
        if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
        if (timeoutId) clearTimeout(timeoutId);
        window.removeEventListener("rmw:loader-done", mountWhenIdle);
      };
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        afterLoader(mountWhenIdle);
      },
      { rootMargin: "40px 0px" }
    );
    observer.observe(el);

    return () => {
      cancelled = true;
      cancelInteraction();
      observer.disconnect();
      if (idleId && window.cancelIdleCallback) window.cancelIdleCallback(idleId);
      if (timeoutId) clearTimeout(timeoutId);
      window.removeEventListener("rmw:loader-done", mountWhenIdle);
    };
  }, [shouldMountBackground]);

  return (
    <section
      ref={sectionRef}
      className="relative w-full overflow-hidden px-8 py-[35px] md:px-12 md:py-[70px]"
    >
      <div className="absolute inset-0 z-0 bg-[#0F0E14]" aria-hidden />
      {shouldMountBackground ? <Section2Background /> : null}

      <div className="relative z-10 mx-auto w-full max-w-8xl">
        <Section2Hero />
      </div>
    </section>
  );
};

export default Section2;
