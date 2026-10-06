"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { onFirstInteraction } from "@/lib/onFirstInteraction";

let gsapBundle = null;
let gsapBundlePromise = null;

function loadGsap() {
  if (gsapBundle) return Promise.resolve(gsapBundle);
  if (!gsapBundlePromise) {
    gsapBundlePromise = Promise.all([
      import("gsap"),
      import("gsap/ScrollTrigger"),
    ]).then(([gsapModule, scrollTriggerModule]) => {
      const gsap = gsapModule.default;
      const { ScrollTrigger } = scrollTriggerModule;
      gsap.registerPlugin(ScrollTrigger);
      if (typeof window !== "undefined") {
        window.__gsapScrollTrigger = true;
      }
      gsapBundle = { gsap, ScrollTrigger };
      return gsapBundle;
    });
  }
  return gsapBundlePromise;
}

const titleStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
};

const splitTitleParts = (title) => {
  const words = title.trim().split(/\s+/);
  if (words.length > 1) {
    const half = Math.ceil(words.length / 2);
    return [words.slice(0, half).join(" "), words.slice(half).join(" ")];
  }
  const mid = Math.ceil(title.length / 2);
  return [title.slice(0, mid), title.slice(mid)];
};

const IMAGE_CLIP_WIDTH = "min(300px, 26vw)";
const ROW_CLIP_MASK = `linear-gradient(to right, #000 0, #000 calc(50% - min(150px, 13vw) - 14px), transparent calc(50% - min(150px, 13vw) + 14px), transparent calc(50% + min(150px, 13vw) - 14px), #000 calc(50% + min(150px, 13vw) + 14px), #000 100%)`;
const IMAGE_TEXT_MASK = `linear-gradient(to right, transparent 0, transparent calc(50% - min(150px, 13vw) - 14px), #000 calc(50% - min(150px, 13vw) + 14px), #000 calc(50% + min(150px, 13vw) - 14px), transparent calc(50% + min(150px, 13vw) + 14px), transparent 100%)`;
const imageOverlayTextStyle = {
  color: "transparent",
  WebkitTextStroke: "0.5px gray",
  backgroundSize: `${IMAGE_CLIP_WIDTH} auto`,
  backgroundPosition: "center center",
  backgroundAttachment: "fixed",
  WebkitBackgroundClip: "text",
  backgroundClip: "text",
};

const linkRowClass =
  "inline-flex items-baseline justify-center gap-4 md:gap-6 lg:gap-10";

const services = [
  { title: "GULSHAN", slug: "gulshan", image: "/home/gulshan_optim.webp", xlShift: 0 },
  { title: "VEDVAN", slug: "vedvan", image: "/home/vedvan.webp", xlShift: 100 },
  { title: "EXOTICA", slug: "exotica", image: "/home/exotica.webp", xlShift: -200 },
  { title: "SPLENDOR ONYX", slug: "splendor-onyx", image: "/home/onyx.png", xlShift: 100 },
  { title: "LUMORA", slug: "lumora", image: "/home/lumora_optim.webp", xlShift: -200 },
  { title: "SANSKAR", slug: "sanskar", image: "/home/SANSKAR.webp", xlShift: 200 },
  { title: "VVIP MADHUBAN", slug: "vvip-madhuban", image: "/home/vvip.webp", xlShift: -100 },
  { title: "GHD", slug: "ghd", image: "/home/GHD.webp", xlShift: 200 },
  { title: "MANSHA GROUP", slug: "mansha-group", image: "/home/mansha.webp", xlShift: -100 },
  { title: "EON FAIRFOX", slug: "eon-fairfox", image: "/home/FAIRFOX.webp", xlShift: 200, shiftClass: " md:-translate-x-[100px] lg:translate-x-[200px] xl:translate-x-[200px]" },
];

const shiftClassByValue = {
  0: "",
  100: " md:translate-x-[100px] lg:translate-x-[100px] xl:translate-x-[100px]",
  "-100": " md:-translate-x-[100px] lg:-translate-x-[100px] xl:-translate-x-[100px]",
  200: " md:translate-x-[200px] lg:translate-x-[200px] xl:translate-x-[200px]",
  "-200": " md:-translate-x-[200px] lg:-translate-x-[200px] xl:-translate-x-[200px]",
  400: " md:translate-x-[400px] lg:translate-x-[400px] xl:translate-x-[400px]",
  "-400": " md:-translate-x-[400px] lg:-translate-x-[400px] xl:-translate-x-[400px]",
};

/* -------------------------------------------------------------------------- */
/* List <-> Grid toggle                                                        */
/* -------------------------------------------------------------------------- */

const ViewToggle = ({ viewMode, onChange, onGridHover }) => {
  const baseBtn =
    "inline-flex h-8 cursor-pointer items-center gap-2 text-sm leading-none md:text-base font-bold uppercase tracking-[0.08em] transition-colors duration-200";
  const toggleFont = { fontFamily: '"League Spartan", sans-serif' };
  const iconClass = "block h-4 w-4 shrink-0";

  return (
    <div className="relative z-40 flex items-center gap-5 md:gap-6">
      <button
        type="button"
        onClick={() => onChange("list")}
        style={toggleFont}
        className={`${baseBtn} ${
          viewMode === "list" ? "text-black" : "text-black/35 hover:text-black/60"
        }`}
        aria-pressed={viewMode === "list"}
      >
        <svg
          className={iconClass}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <line x1="0" y1="3" x2="16" y2="3" stroke="currentColor" strokeWidth="1.4" />
          <line x1="0" y1="8" x2="16" y2="8" stroke="currentColor" strokeWidth="1.4" />
          <line x1="0" y1="13" x2="16" y2="13" stroke="currentColor" strokeWidth="1.4" />
        </svg>
        <span className="leading-none">List</span>
      </button>

      <button
        type="button"
        onClick={() => onChange("grid")}
        onMouseEnter={() => onGridHover?.(true)}
        onMouseLeave={() => onGridHover?.(false)}
        onFocus={() => onGridHover?.(true)}
        onBlur={() => onGridHover?.(false)}
        style={toggleFont}
        className={`${baseBtn} ${
          viewMode === "grid" ? "text-black" : "text-black/35 hover:text-black/60"
        }`}
        aria-pressed={viewMode === "grid"}
      >
        <svg
          className={iconClass}
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden="true"
        >
          <rect x="1" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" />
          <rect x="9.5" y="1" width="5.5" height="5.5" rx="1" fill="currentColor" />
          <rect x="1" y="9.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
          <rect x="9.5" y="9.5" width="5.5" height="5.5" rx="1" fill="currentColor" />
        </svg>
        <span className="leading-none">Grid</span>
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Grid (horizontal slider) mode                                              */
/* -------------------------------------------------------------------------- */

const AUTO_SCROLL_SPEED = 0.85; // px per frame - continuous marquee speed

const GridSlider = ({ cardRefs, loadMedia = false }) => {
  const trackRef = useRef(null);
  const containerRef = useRef(null);
  const isDragging = useRef(false);
  const startX = useRef(0); // pointer x at grab
  const startScroll = useRef(0); // scrollLeft at grab
  const target = useRef(0); // where we want to be
  const current = useRef(0); // where we actually are (eased)
  const vel = useRef(0); // scrollLeft delta / frame (fling)
  const pointerVel = useRef(0); // pointer px/ms (last move)
  const lastX = useRef(0);
  const lastT = useRef(0);
  const rafId = useRef(0);
  const running = useRef(false);
  const autoPaused = useRef(false);
  const resumeTimer = useRef(0);
  const loopWidthRef = useRef(0);
  const inViewRef = useRef(true);

  const loopItems = [...services, ...services];

  const getLoopWidth = useCallback(() => {
    if (loopWidthRef.current > 0) return loopWidthRef.current;
    const track = trackRef.current;
    if (!track) return 0;
    const cards = track.querySelectorAll("a");
    if (cards.length < services.length * 2) return 0;
    const width = cards[services.length].offsetLeft - cards[0].offsetLeft;
    loopWidthRef.current = width;
    return width;
  }, []);

  const wrapPosition = useCallback(
    (value) => {
      const loopWidth = getLoopWidth();
      if (loopWidth <= 0) return value;
      let next = value;
      while (next >= loopWidth) next -= loopWidth;
      while (next < 0) next += loopWidth;
      return next;
    },
    [getLoopWidth],
  );

  // Continuous auto-scroll + drag / fling / button targets in one rAF loop.
  const tick = useCallback(() => {
    const track = trackRef.current;
    if (!track) {
      running.current = false;
      return;
    }

    if (!inViewRef.current && !isDragging.current) {
      running.current = false;
      return;
    }

    if (isDragging.current) {
      current.current += (target.current - current.current) * 0.16;
    } else if (Math.abs(vel.current) > 0.05) {
      current.current += vel.current;
      vel.current *= 0.95;
      target.current = current.current;
    } else if (!autoPaused.current) {
      current.current += AUTO_SCROLL_SPEED;
      target.current = current.current;
    } else {
      current.current += (target.current - current.current) * 0.12;
    }

    const wrapped = wrapPosition(current.current);
    if (wrapped !== current.current) {
      const delta = current.current - wrapped;
      current.current = wrapped;
      target.current -= delta;
    }

    track.scrollLeft = current.current;

    const settled =
      autoPaused.current &&
      !isDragging.current &&
      Math.abs(vel.current) < 0.05 &&
      Math.abs(target.current - current.current) < 0.4;

    if (settled) {
      running.current = false;
      return;
    }
    rafId.current = requestAnimationFrame(tick);
  }, [wrapPosition]);

  const ensureRAF = useCallback(() => {
    if (running.current) return;
    running.current = true;
    rafId.current = requestAnimationFrame(tick);
  }, [tick]);

  const getCardStep = useCallback(() => {
    const track = trackRef.current;
    if (!track) return 320;
    const card = track.querySelector("a");
    if (!card) return Math.round(track.clientWidth * 0.6);
    const styles = window.getComputedStyle(track);
    const gap = parseFloat(styles.columnGap || styles.gap) || 16;
    return card.getBoundingClientRect().width + gap;
  }, []);

  const scrollByDir = useCallback(
    (dir) => {
      const track = trackRef.current;
      if (!track) return;

      isDragging.current = false;
      vel.current = 0;
      if (!running.current) current.current = track.scrollLeft;

      target.current = current.current + dir * getCardStep();
      ensureRAF();
    },
    [ensureRAF, getCardStep],
  );

  const pauseAuto = useCallback(
    (ms = 5000) => {
      autoPaused.current = true;
      window.clearTimeout(resumeTimer.current);
      resumeTimer.current = window.setTimeout(() => {
        autoPaused.current = false;
        ensureRAF();
      }, ms);
    },
    [ensureRAF],
  );

  useLayoutEffect(() => {
    const container = containerRef.current;
    const onResize = () => {
      loopWidthRef.current = 0;
    };
    window.addEventListener("resize", onResize);

    let viewObserver;
    if (container) {
      viewObserver = new IntersectionObserver(
        ([entry]) => {
          inViewRef.current = entry.isIntersecting;
          if (entry.isIntersecting) ensureRAF();
        },
        { rootMargin: "120px 0px" }
      );
      viewObserver.observe(container);
    }

    return () => {
      cancelAnimationFrame(rafId.current);
      running.current = false;
      window.clearTimeout(resumeTimer.current);
      window.removeEventListener("resize", onResize);
      viewObserver?.disconnect();
    };
  }, [ensureRAF]);

  const onPointerDown = (e) => {
    if (e.pointerType && e.pointerType !== "mouse") return; // let touch scroll natively
    const track = trackRef.current;
    if (!track) return;
    pauseAuto();
    isDragging.current = true;
    startX.current = e.clientX;
    startScroll.current = track.scrollLeft;
    current.current = track.scrollLeft;
    target.current = track.scrollLeft;
    vel.current = 0;
    pointerVel.current = 0;
    lastX.current = e.clientX;
    lastT.current = performance.now();
    track.setPointerCapture?.(e.pointerId);
    track.style.cursor = "grabbing";
    ensureRAF();
  };

  const onPointerMove = (e) => {
    if (!isDragging.current) return;
    const now = performance.now();
    const dt = now - lastT.current || 16;
    // Smooth the pointer velocity (rolling blend) so a flick hands off a
    // stable, jitter-free speed to the glide.
    const inst = (e.clientX - lastX.current) / dt;
    pointerVel.current = pointerVel.current * 0.6 + inst * 0.4;
    lastX.current = e.clientX;
    lastT.current = now;
    target.current = startScroll.current - (e.clientX - startX.current);
    ensureRAF();
  };

  const endDrag = (e) => {
    if (!isDragging.current) return;
    isDragging.current = false;
    const track = trackRef.current;
    if (track) {
      track.style.cursor = "grab";
      track.releasePointerCapture?.(e.pointerId);
    }
    // Hand the pointer velocity to the fling (px/ms -> px/frame, inverted
    // because dragging right scrolls content left). Boosted a touch and
    // capped so a flick travels far but never runaway-fast.
    const flung = -pointerVel.current * 18;
    vel.current = Math.max(-90, Math.min(90, flung));
    ensureRAF();
  };

  const navBtnClass =
    "absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] shadow-sm backdrop-blur-sm transition hover:bg-white sm:h-11 sm:w-11";

  return (
    <div
      ref={containerRef}
      className="relative z-30 w-full"
      onMouseEnter={() => {
        autoPaused.current = true;
        window.clearTimeout(resumeTimer.current);
      }}
      onMouseLeave={() => {
        pauseAuto(800);
      }}
    >
      <div
        ref={trackRef}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={(e) => isDragging.current && endDrag(e)}
        className="flex w-full cursor-grab items-center gap-4 overflow-x-auto px-[calc(50%-150px)] pb-2 [-ms-overflow-style:none] [scroll-behavior:auto] [scroll-snap-type:x_proximity] [scrollbar-width:none] [touch-action:pan-y] md:gap-6 md:px-0 md:[scroll-snap-type:none] [&::-webkit-scrollbar]:hidden"
      >
        {loopItems.map((service, index) => {
          const [topPart, bottomPart] = splitTitleParts(service.title);
          const isOriginal = index < services.length;
          return (
            <Link
              key={`${service.slug}-${index}`}
              href={`/services/${service.slug}`}
              title={service.title}
              target="_blank"
              rel="noopener noreferrer"
              ref={(node) => {
                if (isOriginal) cardRefs.current[index] = node;
              }}
              className="group relative shrink-0 [scroll-snap-align:center] w-[min(300px,80vw)] md:h-[74vh] md:w-auto"
              draggable={false}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5 md:h-full md:w-auto">
                {loadMedia ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    title={service.title}
                    fill
                    sizes="(max-width: 768px) 80vw, 300px"
                    quality={75}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="pointer-events-none object-cover transition-transform duration-700 ease-out group-hover:scale-[1.06]"
                  />
                ) : null}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />

                <div
                  className="pointer-events-none absolute inset-x-4 bottom-8 flex flex-col text-white/40 transition-colors duration-500 group-hover:text-white/70 md:inset-x-6 md:bottom-10"
                  style={{
                    ...titleStyle,
                    fontFamily: '"League Spartan", sans-serif',
                    fontSize: "clamp(40px, 8vw, 104px)",
                    lineHeight: "0.82",
                    letterSpacing: "0.02em",
                    WebkitTextStroke: "1px rgba(255,255,255,0.25)",
                  }}
                >
                  <span className="block [word-break:break-all] transition-transform duration-500 ease-out group-hover:-translate-y-4">
                    {topPart}
                  </span>
                  <span className="block [word-break:break-all] transition-transform duration-500 ease-out group-hover:translate-y-4">
                    {bottomPart}
                  </span>
                </div>
              </div>
            </Link>
          );
        })}
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        className={`${navBtnClass} left-2 sm:left-3 md:left-4`}
        onClick={() => {
          pauseAuto();
          scrollByDir(-1);
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className={`${navBtnClass} right-2 sm:right-3 md:right-4`}
        onClick={() => {
          pauseAuto();
          scrollByDir(1);
        }}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */
/* Mobile image slider (list mode) - GSAP transform for smooth 60fps motion  */
/* -------------------------------------------------------------------------- */

const MOBILE_GAP = 12;
const MOBILE_AUTO_INTERVAL = 3200;
const MOBILE_SLIDE_DURATION = 0.55;

const MobileImageSlider = ({ loadMedia = false, gsapActive = false }) => {
  const viewportRef = useRef(null);
  const trackRef = useRef(null);
  const gsapRef = useRef(null);
  const xRef = useRef(0);
  const stepRef = useRef(0);
  const loopWidthRef = useRef(0);
  const tweenRef = useRef(null);
  const autoTimer = useRef(0);
  const dragging = useRef(false);
  const dragStartX = useRef(0);
  const dragStartOffset = useRef(0);
  const dragMoved = useRef(false);
  const [cardWidth, setCardWidth] = useState(0);

  const loopItems = [...services, ...services];

  const wrapX = useCallback((value) => {
    const loopWidth = loopWidthRef.current;
    if (loopWidth <= 0) return value;
    let x = value;
    while (x <= -loopWidth) x += loopWidth;
    while (x > 0) x -= loopWidth;
    return x;
  }, []);

  const applyX = useCallback(
    (value) => {
      const track = trackRef.current;
      if (!track) return;
      const x = wrapX(value);
      xRef.current = x;
      const gsap = gsapRef.current;
      if (gsap) {
        gsap.set(track, { x, force3D: true });
      } else {
        track.style.transform = `translate3d(${x}px, 0, 0)`;
      }
    },
    [wrapX],
  );

  const measure = useCallback(() => {
    const viewport = viewportRef.current;
    if (!viewport) return;
    const width = viewport.clientWidth;
    const step = width + MOBILE_GAP;
    stepRef.current = step;
    loopWidthRef.current = services.length * step;
    setCardWidth(width);
    applyX(xRef.current);
  }, [applyX]);

  const killTween = useCallback(() => {
    tweenRef.current?.kill();
    tweenRef.current = null;
  }, []);

  const slideTo = useCallback(
    (targetX) => {
      const track = trackRef.current;
      const gsap = gsapRef.current;
      if (!track || !gsap) return;

      killTween();
      const from = xRef.current;
      let to = targetX;
      const loopWidth = loopWidthRef.current;
      if (loopWidth > 0) {
        while (to - from > loopWidth / 2) to -= loopWidth;
        while (to - from < -loopWidth / 2) to += loopWidth;
      }

      tweenRef.current = gsap.fromTo(
        track,
        { x: from },
        {
          x: to,
          duration: MOBILE_SLIDE_DURATION,
          ease: "power3.out",
          force3D: true,
          overwrite: "auto",
          onUpdate: () => {
            xRef.current = Number(gsap.getProperty(track, "x")) || 0;
          },
          onComplete: () => {
            applyX(to);
            tweenRef.current = null;
          },
        },
      );
    },
    [applyX, killTween],
  );

  const goBy = useCallback(
    (dir) => {
      const step = stepRef.current;
      if (step <= 0) return;
      const currentIndex = Math.round(-xRef.current / step);
      slideTo(-(currentIndex + dir) * step);
    },
    [slideTo],
  );

  const snapNearest = useCallback(() => {
    const step = stepRef.current;
    if (step <= 0) return;
    const index = Math.round(-xRef.current / step);
    slideTo(-index * step);
  }, [slideTo]);

  const stopAuto = useCallback(() => {
    window.clearInterval(autoTimer.current);
    autoTimer.current = 0;
  }, []);

  const startAuto = useCallback(() => {
    stopAuto();
    autoTimer.current = window.setInterval(() => {
      if (dragging.current || tweenRef.current) return;
      goBy(1);
    }, MOBILE_AUTO_INTERVAL);
  }, [goBy, stopAuto]);

  useLayoutEffect(() => {
    if (!gsapActive) return;
    if (window.matchMedia("(min-width: 768px)").matches) return;

    let cancelled = false;

    loadGsap().then(({ gsap }) => {
      if (cancelled) return;
      gsapRef.current = gsap;
      measure();
      startAuto();
    });

    const onResize = () => measure();
    window.addEventListener("resize", onResize);
    return () => {
      cancelled = true;
      window.removeEventListener("resize", onResize);
      stopAuto();
      killTween();
    };
  }, [gsapActive, measure, startAuto, stopAuto, killTween]);

  const onPointerDown = (e) => {
    if (e.pointerType === "mouse" && e.button !== 0) return;
    const track = trackRef.current;
    if (!track) return;

    killTween();
    stopAuto();
    dragging.current = true;
    dragMoved.current = false;
    dragStartX.current = e.clientX;
    dragStartOffset.current = xRef.current;
    track.setPointerCapture?.(e.pointerId);
  };

  const onPointerMove = (e) => {
    if (!dragging.current) return;
    const dx = e.clientX - dragStartX.current;
    if (Math.abs(dx) > 8) dragMoved.current = true;
    applyX(dragStartOffset.current + dx);
  };

  const onPointerUp = (e) => {
    if (!dragging.current) return;
    dragging.current = false;
    trackRef.current?.releasePointerCapture?.(e.pointerId);

    const step = stepRef.current;
    const dx = e.clientX - dragStartX.current;
    if (step > 0 && Math.abs(dx) > Math.min(56, step * 0.18)) {
      goBy(dx < 0 ? 1 : -1);
    } else {
      snapNearest();
    }
    startAuto();
  };

  const onCardClick = (e) => {
    if (dragMoved.current) {
      e.preventDefault();
      e.stopPropagation();
    }
  };

  const onNav = (dir) => {
    stopAuto();
    goBy(dir);
    startAuto();
  };

  const navBtnClass =
    "absolute top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] shadow-sm backdrop-blur-sm transition hover:bg-white active:scale-95";

  return (
    <div className="relative z-20 mb-8 w-full select-none md:hidden">
      <div
        ref={viewportRef}
        className="relative w-full overflow-hidden touch-pan-y"
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerCancel={onPointerUp}
      >
        <div
          ref={trackRef}
          className="flex w-max will-change-transform [backface-visibility:hidden] [transform:translateZ(0)]"
          style={{ gap: `${MOBILE_GAP}px` }}
        >
          {loopItems.map((service, index) => (
            <Link
              key={`${service.slug}-${index}`}
              href={`/services/${service.slug}`}
              title={service.title}
              data-mobile-card
              draggable={false}
              onClick={onCardClick}
              className="relative shrink-0 [backface-visibility:hidden]"
              style={{
                width: cardWidth || "100%",
                minWidth: cardWidth || "100%",
              }}
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-black/5">
                {loadMedia ? (
                  <Image
                    src={service.image}
                    alt={service.title}
                    title={service.title}
                    fill
                    sizes="100vw"
                    quality={75}
                    draggable={false}
                    loading="lazy"
                    decoding="async"
                    className="pointer-events-none object-cover"
                  />
                ) : null}
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/0 to-black/0" />
                <span
                  className="pointer-events-none absolute inset-x-3 bottom-4 text-[22px] text-white"
                  style={{
                    ...titleStyle,
                    fontFamily: '"League Spartan", sans-serif',
                    fontSize: "clamp(22px, 2.6vw, 40px)",
                  }}
                >
                  {service.title}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </div>

      <button
        type="button"
        aria-label="Previous slide"
        className={`${navBtnClass} left-1`}
        onClick={() => onNav(-1)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M15 6l-6 6 6 6" />
        </svg>
      </button>
      <button
        type="button"
        aria-label="Next slide"
        className={`${navBtnClass} right-1`}
        onClick={() => onNav(1)}
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.75"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M9 6l6 6-6 6" />
        </svg>
      </button>
    </div>
  );
};

/* -------------------------------------------------------------------------- */

const Section4 = () => {
  const [activeSlug, setActiveSlug] = useState(services[0].slug);
  const [viewMode, setViewMode] = useState("list"); // "list" | "grid"
  const [pendingReveal, setPendingReveal] = useState(false);
  const [gridPreview, setGridPreview] = useState(false);
  // grid -> list reveal: hold every row black briefly (so it hands off from
  // the black ghost text), then let the inactive rows fade to transparent on
  // a long, gentle transition instead of snapping.
  const [revealBlack, setRevealBlack] = useState(false);
  const [revealSlow, setRevealSlow] = useState(false);
  // Keep multi‑MB portfolio images off the critical path until near viewport.
  const [shouldLoadMedia, setShouldLoadMedia] = useState(false);
  const [pinReady, setPinReady] = useState(false);
  const sectionRef = useRef(null);
  const pinRef = useRef(null);
  const listRef = useRef(null);
  const itemRefs = useRef([]);
  const textRefs = useRef([]);
  const thumbRefs = useRef([]);
  const gridCardRefs = useRef([]);
  const overlayRef = useRef(null);
  const isAnimatingRef = useRef(false);

  const activeService =
    services.find((service) => service.slug === activeSlug) ?? services[0];

  // The grid-tab hover preview (thumbnails beside each title) only makes sense
  // while we're actually looking at the list.
  const showGridPreview = gridPreview && viewMode === "list";

  const handleGridHover = (enter) => {
    if (viewMode !== "list") return;
    setGridPreview(enter);
  };

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;

    let cancelInteraction = () => {};
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        observer.disconnect();
        setShouldLoadMedia(true);
        // Pin/scrub/slider motion only matters once the visitor scrolls or
        // touches, so keep GSAP off the initial load until then.
        cancelInteraction = onFirstInteraction(() => setPinReady(true));
      },
      { rootMargin: "240px 0px" }
    );
    observer.observe(el);
    return () => {
      observer.disconnect();
      cancelInteraction();
    };
  }, []);

  // Re-measure ScrollTrigger when Section 3 (or any prior sibling) changes height.
  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const refresh = () => {
      if (!window.__gsapScrollTrigger) return;
      import("gsap/ScrollTrigger")
        .then(({ ScrollTrigger }) => ScrollTrigger.refresh())
        .catch(() => {});
    };

    const onLayoutStable = () => refresh();
    window.addEventListener("rmw:layout-stable", onLayoutStable);

    const prevSibling = section.previousElementSibling;
    const resizeObserver =
      typeof ResizeObserver !== "undefined" && prevSibling
        ? new ResizeObserver(() => refresh())
        : null;
    resizeObserver?.observe(prevSibling);

    return () => {
      window.removeEventListener("rmw:layout-stable", onLayoutStable);
      resizeObserver?.disconnect();
    };
  }, []);

  const applyListStartY = useCallback(() => {
    if (typeof window === "undefined" || window.innerWidth < 768) return;
    const pin = pinRef.current;
    const list = listRef.current;
    const first = itemRefs.current[0];
    if (!pin || !list || !first) return;
    loadGsap().then(({ gsap }) => {
      gsap.set(list, {
        y: pin.offsetHeight * 0.3 - (first.offsetTop + first.offsetHeight / 2),
      });
    });
  }, []);

  const runGridToList = () => {
    const overlay = overlayRef.current;

    // Capture grid-card geometry now, before React swaps the DOM to the list.
    const fromData = services.map((service, index) => {
      const card = gridCardRefs.current[index];
      return card ? { rect: card.getBoundingClientRect() } : null;
    });

    const finish = () => {
      setPendingReveal(false);
      isAnimatingRef.current = false;
    };

    loadGsap().then(({ gsap }) => {

    // Phase A - build the card image ghosts on top of the still-visible grid
    // *before* swapping to the list, so the very first painted frame already
    // shows them. (Building them a couple frames later was the blink/blank.)
    const imgGhosts = [];
    if (overlay) {
      overlay.innerHTML = "";
      services.forEach((service, index) => {
        const from = fromData[index];
        if (!from) return;
        const cardRect = from.rect;

        const imgGhost = document.createElement("div");
        Object.assign(imgGhost.style, {
          position: "fixed",
          left: `${cardRect.left}px`,
          top: `${cardRect.top}px`,
          width: `${cardRect.width}px`,
          height: `${cardRect.height}px`,
          overflow: "hidden",
          zIndex: 90,
          pointerEvents: "none",
          transformOrigin: "top left",
          willChange: "transform, width, height, opacity",
          backfaceVisibility: "hidden",
          background: "#f4f3f1",
        });
        const [topPart, bottomPart] = splitTitleParts(service.title);
        imgGhost.innerHTML = `
            <img src="${service.image}" style="width:100%;height:100%;object-fit:cover;display:block" />
            <div class="s4-card-label" style="position:absolute;inset:0">
              <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,0) 55%)"></div>
              <div style="position:absolute;left:24px;right:24px;bottom:40px;display:flex;flex-direction:column;color:rgba(255,255,255,0.4);-webkit-text-stroke:1px rgba(255,255,255,0.25);font-family:'League Spartan',sans-serif;font-weight:600;text-transform:uppercase;font-size:clamp(40px,8vw,104px);line-height:0.82;letter-spacing:0.02em;"><span style="display:block;word-break:break-all;">${topPart}</span><span style="display:block;word-break:break-all;">${bottomPart}</span></div>
            </div>
          `;
        overlay.appendChild(imgGhost);
        imgGhosts[index] = {
          imgGhost,
          label: imgGhost.querySelector(".s4-card-label"),
          cardRect,
        };
      });
    }

    setViewMode("list");
    setPendingReveal(true);
    setGridPreview(false);
    setRevealBlack(true);
    setRevealSlow(true);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!overlay) return finish();

        // Snap the window back to Section 4's top *before* we measure the list
        // and hand off to it. The pinned list ScrollTrigger is (re)created once
        // pendingReveal flips to false; if the scroll isn't exactly at the
        // section top at that moment, ScrollTrigger's first refresh yanks the
        // scroll to align progress 0 -> that yank was the remaining jhatka.
        // Doing it here (list hidden, only the fixed ghosts are visible) is
        // invisible and keeps the ghost -> real-row handoff pixel-accurate.
        const section = sectionRef.current;
        if (
          section &&
          typeof window !== "undefined" &&
          window.innerWidth >= 768
        ) {
          window.scrollTo({ top: section.offsetTop, behavior: "auto" });
        }

        // Position the (still hidden) list at the pinned start offset first, so
        // the destination rects we measure below match where the real rows end
        // up - the ghost text hands off to the real text with no jump.
        applyListStartY();

        const tl = gsap.timeline({
          onComplete: () => {
            // Reveal the real list - it now fades in via the container's
            // opacity transition, so the active preview image glides in
            // instead of popping. Keep the ghosts on top during that fade so
            // the text doesn't flicker, then drop them once the list is fully
            // in (matches the 500ms container transition).
            finish();
            window.setTimeout(() => {
              overlay.innerHTML = "";
              // Release the "all black" hold: inactive rows now ease from
              // black -> transparent over the long transition below.
              setRevealBlack(false);
              window.setTimeout(() => setRevealSlow(false), 900);
            }, 520);
          },
        });

        const makeText = (rect, fontSize, text) => {
          const el = document.createElement("div");
          Object.assign(el.style, {
            position: "fixed",
            left: `${rect.left}px`,
            top: `${rect.top}px`,
            width: `${rect.width}px`,
            height: `${rect.height}px`,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            fontFamily: '"League Spartan", sans-serif',
            fontWeight: "600",
            textTransform: "uppercase",
            color: "#000",
            fontSize,
            lineHeight: "1",
            whiteSpace: "nowrap",
            zIndex: 90,
            pointerEvents: "none",
            willChange: "opacity, transform",
          });
          el.textContent = text;
          overlay.appendChild(el);
          return el;
        };

        let built = false;

        services.forEach((service, index) => {
          const g = imgGhosts[index];
          const link = textRefs.current[index];
          if (!g || !link) return;

          // Measure the real destination row so the ghost text matches its
          // final size + position exactly (this is what was popping before -
          // the old ghost used fixed clamp() sizes smaller than the real text).
          const spans = link.querySelectorAll("span");
          const titleEl = spans[0];
          const titleRect = titleEl?.getBoundingClientRect();
          const titleFS = titleEl ? getComputedStyle(titleEl).fontSize : "48px";

          const { imgGhost, label, cardRect } = g;

          // Small square beside the title where the card image collapses to
          // (mirror of runListToGrid's starting thumb).
          const h = titleRect ? titleRect.height * 0.72 : 80;
          const thumbRect = {
            left: titleRect ? titleRect.right + 24 : cardRect.left,
            top: titleRect ? titleRect.top + titleRect.height / 2 - h / 2 : cardRect.top,
            width: h,
            height: h,
          };

          built = true;

          const titleGhost = titleRect ? makeText(titleRect, titleFS, service.title) : null;
          if (titleGhost) gsap.set(titleGhost, { opacity: 0, y: -12 });

          const move = index * 0.05; // 1) card collapses to thumb
          const labelOut = move; // card label fades as it shrinks
          const imgOut = move + 0.34; // image fades out once small
          const textIn = move + 0.3; // 2) list text drops back in

          if (label)
            tl.to(label, { opacity: 0, duration: 0.3, ease: "power1.in" }, labelOut);

          // GPU transforms (x/y) instead of left/top; width/height still change
          // so the image crops correctly as it shrinks.
          tl.to(
            imgGhost,
            {
              x: thumbRect.left - cardRect.left,
              y: thumbRect.top - cardRect.top,
              width: thumbRect.width,
              height: thumbRect.height,
              duration: 0.72,
              ease: "power3.inOut",
              force3D: true,
              autoRound: false,
            },
            move
          );
          tl.to(imgGhost, { opacity: 0, duration: 0.32, ease: "power1.inOut" }, imgOut);

          if (titleGhost)
            tl.to(titleGhost, { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" }, textIn);
        });

        if (!built) {
          overlay.innerHTML = "";
          finish();
        }
      });
    });
    });
  };

  // Choreographed list -> grid transition:
  //   1) the big list text fades (lifts) away first,
  //   2) the hover thumbnails grow + travel into their grid-card slots,
  //   3) the card label (number + title) fades in once the card has landed.
  const runListToGrid = () => {
    // Capture list geometry *now*, while the hover thumbnails are still on
    // screen (before React swaps the DOM over to the grid).
    const fromData = services.map((service, index) => {
      const link = textRefs.current[index] || itemRefs.current[index]?.querySelector("a");
      if (!link) return null;

      // Only the title label span lives inside the <a>; the active-row image
      // overlay spans are siblings, so this stays limited to the title.
      const spans = link.querySelectorAll("span");
      const titleEl = spans[0];
      const titleRect = titleEl?.getBoundingClientRect();
      const titleFS = titleEl ? getComputedStyle(titleEl).fontSize : "48px";

      const thumb = thumbRefs.current[index];
      let thumbRect = thumb?.getBoundingClientRect();
      // If the preview wasn't hovered (thumb collapsed to 0px), start the image
      // as a small square just to the right of the title so it still animates.
      if (!thumbRect || thumbRect.width < 4) {
        const h = titleRect ? titleRect.height * 0.72 : 80;
        thumbRect = {
          left: titleRect ? titleRect.right + 24 : 0,
          top: titleRect ? titleRect.top + titleRect.height / 2 - h / 2 : 0,
          width: h,
          height: h,
        };
      }

      return { titleRect, titleFS, thumbRect };
    });

    const overlay = overlayRef.current;

    const finish = () => {
      setPendingReveal(false);
      isAnimatingRef.current = false;
    };

    loadGsap().then(({ gsap }) => {
    const makeText = (rect, fontSize, text) => {
      const el = document.createElement("div");
      Object.assign(el.style, {
        position: "fixed",
        left: `${rect.left}px`,
        top: `${rect.top}px`,
        width: `${rect.width}px`,
        height: `${rect.height}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: '"League Spartan", sans-serif',
        fontWeight: "600",
        textTransform: "uppercase",
        color: "#000",
        fontSize,
        lineHeight: "1",
        whiteSpace: "nowrap",
        zIndex: 90,
        pointerEvents: "none",
        willChange: "opacity, transform",
      });
      el.textContent = text;
      overlay.appendChild(el);
      return el;
    };

    // Phase A - build the ghosts over the still-visible list *before* swapping
    // to the grid, so the very first painted frame already shows them (this
    // removes the blank/blink at the moment of the click).
    const ghosts = [];
    if (overlay) {
      overlay.innerHTML = "";
      services.forEach((service, index) => {
        const from = fromData[index];
        if (!from) return;
        const thumbRect = from.thumbRect;

        const titleGhost = from.titleRect
          ? makeText(from.titleRect, from.titleFS, service.title)
          : null;

        const imgGhost = document.createElement("div");
        Object.assign(imgGhost.style, {
          position: "fixed",
          left: `${thumbRect.left}px`,
          top: `${thumbRect.top}px`,
          width: `${thumbRect.width}px`,
          height: `${thumbRect.height}px`,
          overflow: "hidden",
          zIndex: 90,
          pointerEvents: "none",
          transformOrigin: "top left",
          willChange: "transform, width, height",
          backfaceVisibility: "hidden",
          background: "#f4f3f1",
        });
        const [topPart, bottomPart] = splitTitleParts(service.title);
        imgGhost.innerHTML = `
            <img src="${service.image}" style="width:100%;height:100%;object-fit:cover;display:block"  />
            <div class="s4-card-label" style="position:absolute;inset:0;opacity:0">
              <div style="position:absolute;inset:0;background:linear-gradient(to top, rgba(0,0,0,.7), rgba(0,0,0,0) 55%)"></div>
              <div style="position:absolute;left:24px;right:24px;bottom:40px;display:flex;flex-direction:column;color:rgba(255,255,255,0.4);-webkit-text-stroke:1px rgba(255,255,255,0.25);font-family:'League Spartan',sans-serif;font-weight:600;text-transform:uppercase;font-size:clamp(40px,8vw,104px);line-height:0.82;letter-spacing:0.02em;"><span style="display:block;word-break:break-all;">${topPart}</span><span style="display:block;word-break:break-all;">${bottomPart}</span></div>
            </div>
          `;
        overlay.appendChild(imgGhost);
        ghosts[index] = {
          titleGhost,
          imgGhost,
          label: imgGhost.querySelector(".s4-card-label"),
          thumbRect,
        };
      });
    }

    setViewMode("grid");
    setPendingReveal(true);
    setGridPreview(false);

    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        if (!overlay) return finish();
        const cards = gridCardRefs.current;

        // The list view pins Section 4, so by the time the user reaches the
        // last row the window is scrolled far past the section's natural
        // position. Switching to grid removes the pin (and its spacer), which
        // would otherwise drop the viewport onto the sections below. Snap the
        // scroll back to Section 4's top - the pinned list was already sitting
        // at the top of the viewport, so this keeps the transition seamless.
        const section = sectionRef.current;
        if (section) {
          window.scrollTo({ top: section.offsetTop, behavior: "auto" });
        }

        const tl = gsap.timeline({
          onComplete: () => {
            finish();
            requestAnimationFrame(() => {
              overlay.innerHTML = "";
            });
          },
        });

        let built = false;

        services.forEach((service, index) => {
          const g = ghosts[index];
          const card = cards[index];
          if (!g || !card) return;
          const cardRect = card.getBoundingClientRect();
          const { titleGhost, imgGhost, label, thumbRect } = g;
          built = true;

          const textOut = index * 0.03; // 1) list text lifts away
          const move = 0.26 + index * 0.055; // 2) thumbnail -> card
          const labelIn = move + 0.42; // 3) card label fades in

          if (titleGhost)
            tl.to(titleGhost, { opacity: 0, y: -12, duration: 0.32, ease: "power2.in" }, textOut);

          tl.to(
            imgGhost,
            {
              x: cardRect.left - thumbRect.left,
              y: cardRect.top - thumbRect.top,
              width: cardRect.width,
              height: cardRect.height,
              duration: 0.72,
              ease: "power3.inOut",
              force3D: true,
              autoRound: false,
            },
            move
          );

          tl.fromTo(label, { opacity: 0 }, { opacity: 1, duration: 0.4, ease: "power1.out" }, labelIn);
        });

        if (!built) {
          overlay.innerHTML = "";
          finish();
        }
      });
    });
    });
  };

  const handleViewChange = (mode) => {
    if (mode === viewMode || isAnimatingRef.current) return;
    isAnimatingRef.current = true;
    if (mode === "grid") {
      runListToGrid();
    } else {
      setGridPreview(false);
      runGridToList();
    }
  };

  // Pinned scroll-driven list - only active while viewMode === "list".
  useLayoutEffect(() => {
    if (!pinReady) return;
    if (viewMode !== "list") return;

    let frame = 0;
    let cancelled = false;
    let gsapCleanup = () => {};

    const updateActive = () => {
      const viewportCenter = window.innerHeight / 2;
      let closestSlug = services[0].slug;
      let closestDistance = Infinity;

      itemRefs.current.forEach((item, index) => {
        if (!item) return;

        const rect = item.getBoundingClientRect();
        const itemCenter = rect.top + rect.height / 2;
        const distance = Math.abs(itemCenter - viewportCenter);

        if (distance < closestDistance) {
          closestDistance = distance;
          closestSlug = services[index].slug;
        }
      });

      setActiveSlug((current) => (current === closestSlug ? current : closestSlug));
    };

    const onScroll = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(updateActive);
    };

    updateActive();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    // While a morph is in flight the list is hidden and covered by the ghost
    // clones. Setting up the pinned ScrollTrigger here (pin-spacer insertion +
    // full ScrollTrigger.refresh reflow) mid-animation is what caused the lag,
    // so we skip it until the morph has finished (pendingReveal -> false).
    if (!pendingReveal) {
      loadGsap().then(({ gsap, ScrollTrigger }) => {
        if (cancelled) return;

        const section = sectionRef.current;
        const pin = pinRef.current;
        const list = listRef.current;
        const mm = gsap.matchMedia();

        mm.add("(min-width: 768px)", () => {
          if (!section || !pin || !list) return;

          const getStartY = () => {
            const first = itemRefs.current[0];
            if (!first) return 0;

            return pin.offsetHeight * 0.30 - (first.offsetTop + first.offsetHeight / 2);
          };

          const getEndY = () => {
            const items = itemRefs.current.filter(Boolean);
            const last = items[items.length - 1];
            if (!last) return getStartY();

            // Stop when last text sits on the image center
            return pin.offsetHeight * 0.5 - (last.offsetTop + last.offsetHeight / 2);
          };

          const applyStartY = () => {
            gsap.set(list, { y: getStartY() });
          };

          applyStartY();

          const tween = gsap.to(list, {
            y: () => getEndY(),
            ease: "none",
            scrollTrigger: {
              trigger: section,
              start: "top top",
              end: () => `+=${Math.max(Math.abs(getStartY() - getEndY()), window.innerHeight)}`,
              scrub: true,
              pin,
              anticipatePin: 1,
              invalidateOnRefresh: true,
              onRefresh: applyStartY,
            },
          });

          return () => {
            tween.scrollTrigger?.kill();
            tween.kill();
            gsap.set(list, { clearProps: "transform" });
          };
        });

        mm.add("(max-width: 767px)", () => {
          if (!section) return;

          const items = itemRefs.current.filter(Boolean);
          if (!items.length) return;

          const tweens = items.map((item, index) => {
            const dir = index % 2 === 0 ? -1 : 1;
            gsap.set(item, { force3D: true });
            return gsap.fromTo(
              item,
              { x: dir * -8 },
              {
                x: dir * 8,
                ease: "power1.inOut",
                force3D: true,
                scrollTrigger: {
                  trigger: section,
                  start: "top bottom",
                  end: "bottom top",
                  scrub: 1.4,
                  invalidateOnRefresh: true,
                },
              },
            );
          });

          return () => {
            tweens.forEach((tween) => {
              tween.scrollTrigger?.kill();
              tween.kill();
            });
            items.forEach((item) => gsap.set(item, { clearProps: "x" }));
          };
        });

        requestAnimationFrame(() => ScrollTrigger.refresh());

        const onLayoutStable = () => ScrollTrigger.refresh();
        window.addEventListener("rmw:layout-stable", onLayoutStable);

        gsapCleanup = () => {
          window.removeEventListener("rmw:layout-stable", onLayoutStable);
          mm.revert();
        };
      });
    }

    return () => {
      cancelled = true;
      gsapCleanup();
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [viewMode, pendingReveal, pinReady]);

  return (
    <section
      ref={sectionRef}
      data-home-section="section4"
      className={`relative isolate z-[2] bg-white ${
        viewMode === "grid"
          ? "px-0 py-0 md:min-h-[100dvh]"
          : "px-8 py-[35px] md:min-h-[calc(88dvh+12vh)] md:px-12 md:py-[6vh]"
      }`}
    >
      <style>{`
        @media (min-width: 768px) {
          .section4-row-link-active {
            -webkit-mask-image: ${ROW_CLIP_MASK};
            mask-image: ${ROW_CLIP_MASK};
          }
        }
        @media (max-width: 767px) {
          .section4-row-text {
            color: #000000 !important;
          }
        }
      `}</style>

      {/* Fixed-position layer that hosts the transient "ghost" clones used to
          morph list rows into grid cards (and back) - lives outside pinRef so
          it's never affected by the list's pin transform. */}
      <div ref={overlayRef} className="pointer-events-none fixed inset-0 z-[90]" />

      {viewMode === "list" ? (
        <div
          ref={pinRef}
          className={`relative isolate mx-auto flex w-full max-w-8xl flex-col items-center overflow-x-visible overflow-y-visible transition-opacity duration-500 ease-out md:h-[88dvh] md:overflow-hidden ${
            pendingReveal ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          {/* Toggle lives inside the pinned area so it stays anchored to the
              bottom of Section 4 (absolute, not viewport-fixed). */}
          <div className="absolute bottom-4 left-0 z-[60] hidden md:block md:bottom-6">
            <ViewToggle
              viewMode={viewMode}
              onChange={handleViewChange}
              onGridHover={handleGridHover}
            />
          </div>

          <div
            className={`pointer-events-none absolute left-1/2 top-[42%] z-0 hidden -translate-x-1/2 -translate-y-1/2 transition-opacity duration-500 md:block ${
              showGridPreview ? "opacity-0" : "opacity-100"
            }`}
          >
            {shouldLoadMedia ? (
              <Image
                key={activeService.slug}
                src={activeService.image}
                alt={activeService.title}
                title={activeService.title}
                width={300}
                height={400}
                sizes="min(300px, 26vw)"
                quality={75}
                loading="lazy"
                decoding="async"
                className="block h-auto w-[min(300px,26vw)] object-contain shadow-[0_20px_50px_rgba(0,0,0,0.18)]"
              />
            ) : null}
          </div>

          <MobileImageSlider loadMedia={shouldLoadMedia} gsapActive={pinReady} />

          <ul
            ref={listRef}
            className="relative z-[30] m-0 hidden w-full list-none flex-col items-center gap-0 p-0 md:flex md:gap-2 lg:gap-2"
          >
            {services.map((service, index) => {
              const isActive = activeSlug === service.slug;

              return (
                <li
                  key={service.slug}
                  ref={(node) => {
                    itemRefs.current[index] = node;
                  }}
                  className={`relative w-full text-center${
                    service.shiftClass ??
                    shiftClassByValue[String(service.xlShift)] ??
                    ""
                  }`}
                >
                  <div className="relative inline-flex items-baseline justify-center">
                    <span
                      ref={(node) => {
                        textRefs.current[index] = node;
                      }}
                      className={`relative z-10 cursor-default pointer-events-none select-none ${linkRowClass}${
                        isActive && !showGridPreview ? " section4-row-link-active" : ""
                      }`}
                    >
                      <span
                        className="section4-row-text text-[37px] transition-colors duration-300 md:text-[50px] lg:text-[70px] xl:text-[106px]"
                        style={{
                          ...titleStyle,
                          color:
                            isActive || showGridPreview || revealBlack
                              ? "#000000"
                              : "#00000005",
                          transitionDuration: revealSlow ? "800ms" : undefined,
                        }}
                      >
                        {service.title}
                      </span>
                    </span>

                    {/* Thumbnail preview   slides in beside the title when the
                        GRID tab is hovered - a peek at the grid content. */}
                    <span
                      aria-hidden="true"
                      ref={(node) => {
                        thumbRefs.current[index] = node;
                      }}
                      className={`z-10 hidden shrink-0 self-center overflow-hidden shadow-[0_10px_30px_rgba(0,0,0,0.18)] transition-all duration-500 ease-out md:block ${
                        showGridPreview
                          ? "ml-4 w-[64px] opacity-100 lg:ml-6 lg:w-[88px]"
                          : "ml-0 w-0 opacity-0"
                      }`}
                      style={{ transitionDelay: showGridPreview ? `${index * 45}ms` : "0ms" }}
                    >
                      {shouldLoadMedia ? (
                        <Image
                          src={service.image}
                          alt={service.title}
                          title={service.title}
                          width={88}
                          height={88}
                          sizes="88px"
                          quality={75}
                          draggable={false}
                          loading="lazy"
                          decoding="async"
                          className="block h-[64px] w-[64px] object-cover lg:h-[88px] lg:w-[88px]"
                        />
                      ) : null}
                    </span>

                    {isActive && !showGridPreview ? (
                      <div
                        className="pointer-events-none absolute inset-0 z-20 hidden items-baseline justify-center md:flex"
                        style={{
                          maskImage: IMAGE_TEXT_MASK,
                          WebkitMaskImage: IMAGE_TEXT_MASK,
                        }}
                      >
                        <span className={linkRowClass}>
                          <span
                            className="text-[30px] md:text-[50px] lg:text-[70px] xl:text-[106px]"
                            style={{
                              ...titleStyle,
                              ...imageOverlayTextStyle,
                              backgroundImage: shouldLoadMedia
                                ? `url(${service.image})`
                                : undefined,
                            }}
                          >
                            {service.title}
                          </span>
                        </span>
                      </div>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ul>
        </div>
      ) : (
        <div
          className={`relative flex w-full flex-col items-start justify-center gap-8 px-8 py-10 md:h-[100dvh] md:px-12 md:py-0 ${
            pendingReveal ? "pointer-events-none opacity-0" : "opacity-100"
          }`}
        >
          <GridSlider cardRefs={gridCardRefs} loadMedia={shouldLoadMedia} />

          <div className="z-[60] hidden w-full md:flex">
            <ViewToggle
              viewMode={viewMode}
              onChange={handleViewChange}
              onGridHover={handleGridHover}
            />
          </div>
        </div>
      )}
    </section>
  );
};

export default Section4;