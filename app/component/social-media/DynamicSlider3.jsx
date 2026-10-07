"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import gsap from "gsap";

const SLIDES = [
  { src: "/social-media/creative2.avif", label: "Condominium" },
  { src: "/social-media/creative2.avif", label: "Allied Health Clinic" },
  { src: "/social-media/creative2.avif", label: "Childcare Centre" },
  { src: "/social-media/creative2.avif", label: "Cosmetic Injector" },
  { src: "/social-media/creative2.avif", label: "Haircare Products" },
  { src: "/social-media/creative2.avif", label: "Beauty Studio" },
  { src: "/social-media/creative2.avif", label: "Dental Practice" },
  { src: "/social-media/creative2.avif", label: "Boutique Hotel" },
  { src: "/social-media/creative2.avif", label: "Fitness Brand" },
  { src: "/social-media/creative2.avif", label: "Fashion Label" },
];

const GAP_PX = 10;
const SPEED = 45;
const SLIDE_STEP_DURATION = 0.4;
const MD_BREAKPOINT = 768;
const SWIPE_THRESHOLD = 40;

const isVideoUrl = (url) =>
  typeof url === "string" && /\.(mp4|webm|ogg|mov)(\?|#|$)/i.test(url);

const getVisibleCount = (width) => {
  // Below md: always 1 full card so slides never cut mid-frame.
  if (width < MD_BREAKPOINT) return 1;
  if (width < 900) return 2;
  if (width < 1200) return 3;
  if (width < 1600) return 4;
  return 5;
};

const normalizeSlides = (images) => {
  if (!Array.isArray(images) || images.length === 0) return SLIDES;

  return images.map((item, index) => {
    if (typeof item === "string") {
      const video = isVideoUrl(item) ? item : null;
      return {
        src: item,
        fullSrc: item,
        video,
        label: SLIDES[index]?.label ?? `Slide ${index + 1}`,
      };
    }

    const videoSrc = item.video || item.videoSrc || null;
    const src = item.src || videoSrc || "";
    const video =
      videoSrc ||
      (isVideoUrl(src) ? src : null) ||
      (isVideoUrl(item.href) ? item.href : null);

    return {
      src,
      fullSrc: item.fullSrc || src,
      video,
      label: item.label ?? SLIDES[index]?.label ?? `Slide ${index + 1}`,
      href: video ? null : item.href || item.link || null,
      poster: item.poster || null,
    };
  });
};

function useLightboxLock(open, onClose) {
  useEffect(() => {
    if (!open) return undefined;

    const onKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [open, onClose]);
}

function ScrollableImageLightbox({ image, onClose }) {
  useLightboxLock(Boolean(image), onClose);

  if (!image) return null;

  return (
    <div
      className="fixed inset-0 z-[100] overflow-y-auto overscroll-contain bg-black/80"
      onClick={onClose}
      role="dialog"
      aria-modal="true"
      aria-label={image.label || "Full image preview"}
    >
      <button
        type="button"
        onClick={onClose}
        className="fixed right-4 top-4 z-[101] flex h-10 w-10 items-center justify-center border-0 bg-black/40 text-3xl leading-none text-white backdrop-blur-sm"
        aria-label="Close"
      >
        ×
      </button>

      <div
        className="mx-auto flex min-h-full w-full max-w-[920px] items-start justify-center px-3 py-10 sm:px-6"
        onClick={(e) => e.stopPropagation()}
      >
        <img
          src={image.fullSrc || image.src}
          alt={image.label || ""}
          className="block h-auto w-full shadow-[0_20px_60px_rgba(0,0,0,0.45)]"
          draggable={false}
        />
      </div>
    </div>
  );
}

function DynamicSlider3({ heading, images, enableLightbox = false, }) {
  const containerRef = useRef(null);
  const trackRef = useRef(null);
  const tweenRef = useRef(null);
  const loopWidthRef = useRef(0);
  const directionRef = useRef(-1);
  const cardWidthRef = useRef(0);
  const isHoveringRef = useRef(false);
  const isNudgingRef = useRef(false);
  const isLightboxOpenRef = useRef(false);
  const isMobileRef = useRef(false);
  const touchStartRef = useRef({ x: 0, y: 0, active: false });
  const [activeSoundVideo, setActiveSoundVideo] = useState(null);

  const [metrics, setMetrics] = useState({
    cardWidth: 0,
    visibleCount: 4,
    isMobile: false,
  });
  const [direction, setDirection] = useState(-1);
  const [lightboxImage, setLightboxImage] = useState(null);

  const baseSlides = normalizeSlides(images);
  const loopSlides = [...baseSlides, ...baseSlides];

  const syncMetrics = useCallback(() => {
    const width = containerRef.current?.clientWidth || 0;
    const viewportWidth = window.innerWidth;
    const isMobile = viewportWidth < MD_BREAKPOINT;
    const visibleCount = getVisibleCount(viewportWidth);
    const cardWidth =
      visibleCount > 0
        ? Math.floor((width - GAP_PX * (visibleCount - 1)) / visibleCount)
        : Math.floor(width);
    isMobileRef.current = isMobile;
    cardWidthRef.current = cardWidth;
    setMetrics({ cardWidth, visibleCount, isMobile });
    return { cardWidth, visibleCount, isMobile };
  }, []);

 
  const startMarquee = useCallback(() => {
    const track = trackRef.current;
    const loopWidth = loopWidthRef.current;
    // Mobile uses one-card snap only - no continuous marquee (avoids cut cards).
    if (
      !track ||
      loopWidth <= 0 ||
      isHoveringRef.current ||
      isMobileRef.current
    ) {
      return;
    }

    tweenRef.current?.kill();
    isNudgingRef.current = false;

    const wrap = gsap.utils.wrap(-loopWidth, 0);
    const currentX = Number(gsap.getProperty(track, "x")) || 0;
    gsap.set(track, { x: wrap(currentX) });

    const dir = directionRef.current;
    tweenRef.current = gsap.to(track, {
      x: dir < 0 ? `-=${loopWidth}` : `+=${loopWidth}`,
      duration: loopWidth / SPEED,
      ease: "none",
      repeat: -1,
      force3D: true,
      modifiers: {
        x: (v) => `${wrap(parseFloat(v))}px`,
      },
    });
  }, []);

  const slideByCard = useCallback(
    (dir) => {
      const track = trackRef.current;
      const loopWidth = loopWidthRef.current;
      const step = cardWidthRef.current + GAP_PX;
      if (!track || loopWidth <= 0 || step <= 0 || isNudgingRef.current) return;

      directionRef.current = dir;
      setDirection(dir);
      tweenRef.current?.kill();
      isNudgingRef.current = true;

      const wrap = gsap.utils.wrap(-loopWidth, 0);
      const rawX = wrap(Number(gsap.getProperty(track, "x")) || 0);
      // Snap to the nearest full-card position so the frame never lands cut.
      const snappedX = wrap(Math.round(rawX / step) * step);
      const nextX = snappedX + dir * step;

      tweenRef.current = gsap.to(track, {
        x: nextX,
        duration: SLIDE_STEP_DURATION,
        ease: "power2.out",
        force3D: true,
        overwrite: "auto",
        onComplete: () => {
          gsap.set(track, { x: wrap(nextX) });
          isNudgingRef.current = false;
          if (!isHoveringRef.current && !isMobileRef.current) startMarquee();
        },
      });
    },
    [startMarquee],
  );

  useLayoutEffect(() => {
    syncMetrics();
    const onResize = () => syncMetrics();
    window.addEventListener("resize", onResize);
    return () => window.removeEventListener("resize", onResize);
  }, [syncMetrics]);

  useLayoutEffect(() => {
    const track = trackRef.current;
    if (!track || metrics.cardWidth <= 0) return;

    const loopWidth = baseSlides.length * (metrics.cardWidth + GAP_PX);
    loopWidthRef.current = loopWidth;

    gsap.set(track, { x: 0, force3D: true });
    if (metrics.isMobile) {
      tweenRef.current?.kill();
    } else {
      startMarquee();
    }

    return () => {
      tweenRef.current?.kill();
    };
  }, [metrics.cardWidth, metrics.isMobile, baseSlides.length, startMarquee]);

  // Touch swipe: one full card per swipe on mobile.
  useEffect(() => {
    const container = containerRef.current;
    if (!container || !metrics.isMobile) return undefined;

    const onTouchStart = (e) => {
      const touch = e.touches[0];
      if (!touch) return;
      touchStartRef.current = {
        x: touch.clientX,
        y: touch.clientY,
        active: true,
      };
    };

    const onTouchEnd = (e) => {
      if (!touchStartRef.current.active) return;
      touchStartRef.current.active = false;

      const touch = e.changedTouches[0];
      if (!touch) return;

      const dx = touch.clientX - touchStartRef.current.x;
      const dy = touch.clientY - touchStartRef.current.y;
      if (Math.abs(dx) < SWIPE_THRESHOLD || Math.abs(dx) < Math.abs(dy)) return;

      // Swipe left = next card, swipe right = previous card.
      slideByCard(dx < 0 ? -1 : 1);
    };

    container.addEventListener("touchstart", onTouchStart, { passive: true });
    container.addEventListener("touchend", onTouchEnd, { passive: true });

    return () => {
      container.removeEventListener("touchstart", onTouchStart);
      container.removeEventListener("touchend", onTouchEnd);
    };
  }, [metrics.isMobile, slideByCard]);

  const pauseMarquee = () => {
    isHoveringRef.current = true;
    if (isMobileRef.current) return;
    if (!isNudgingRef.current) tweenRef.current?.pause();
  };

  const resumeMarquee = () => {
    isHoveringRef.current = false;
    if (
      isMobileRef.current ||
      isLightboxOpenRef.current ||
      isNudgingRef.current
    ) {
      return;
    }
    if (tweenRef.current?.paused()) tweenRef.current.resume();
    else startMarquee();
  };

  const openLightbox = (slide) => {
    if (!enableLightbox || (!slide?.fullSrc && !slide?.src)) return;
    isLightboxOpenRef.current = true;
    setLightboxImage(slide);
    pauseMarquee();
  };

  const closeLightbox = () => {
    isLightboxOpenRef.current = false;
    setLightboxImage(null);
    resumeMarquee();
  };

  const cardHeight =
    metrics.cardWidth > 0 ? Math.round(metrics.cardWidth * (510 / 408)) : 510;

  return (
    <section className="relative flex w-full flex-col gap-8 bg-[#ffffff] py-12 pb-4">
      <div className="flex w-full items-center justify-center text-center">
        <h3 className="text-[25px] font-[500] lg:text-[35px]">{heading}</h3>
      </div>

      <div
        ref={containerRef}
        className="relative w-full overflow-hidden"
        onMouseEnter={pauseMarquee}
        onMouseLeave={resumeMarquee}
      >
        <div
          ref={trackRef}
          className="flex w-max will-change-transform [backface-visibility:hidden]"
          style={{ gap: `${GAP_PX}px` }}
        >
          {loopSlides.map((slide, index) => {
            const originalIndex = index % baseSlides.length;
            const videoKey = `${originalIndex}-${slide.label}-${slide.video}`;
            const isMuted = activeSoundVideo !== videoKey;

            const cardStyle = {
              width: metrics.cardWidth || "100%",
              height: cardHeight,
            };
            const isInteractive = Boolean(slide.href) || enableLightbox;
            const mediaClass = `pointer-events-none h-full w-full select-none object-cover${
              isInteractive
                ? " transition-transform duration-500 ease-out group-hover:scale-[1.03]"
                : ""
            }`;
            const img = slide.video ? (
              <>
                <video
                  src={slide.video}
                  poster={slide.poster || undefined}
                  className={mediaClass}
                  muted={isMuted}
                  autoPlay
                  loop
                  playsInline
                  preload="auto"
                  draggable={false}
                />
                <button
                  type="button"
                  onClick={() => {
                    setActiveSoundVideo((current) =>
                      current === videoKey ? null : videoKey
                    );
                  }}
                  className={`absolute top-2 right-2 z-10 flex h-8 w-8 items-center justify-center rounded-full ${activeSoundVideo === videoKey ? "bg-[#007A0B]" : "bg-white/80"} text-[#1a1a1a] shadow-sm backdrop-blur-sm transition hover:bg-[#007A0B] cursor-pointer`}
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={activeSoundVideo === videoKey ? "#ffffff" : "currentColor"}
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="h-4 w-4"
                    aria-hidden="true"
                  >
                    {/* Megaphone body */}
                    <path d="M4 10.5v3a1.5 1.5 0 0 0 1.5 1.5H7l9.5 4V5L7 9H5.5A1.5 1.5 0 0 0 4 10.5Z" />

                    {/* Handle */}
                    <path d="M7 15l1.4 4.1a1.5 1.5 0 0 0 1.42 1.02H11" />

                    {/* Sound waves */}
                    <path d="M19 8.5a5.5 5.5 0 0 1 0 7" />
                    <path d="M21.5 6.5a9 9 0 0 1 0 11" />
                  </svg>
                </button>
              </>
            ) : (
              <img
                src={slide.src}
                alt={slide.label}
                title={`Ritz Media World - ${slide.label}`}
                className={mediaClass}
                draggable={false}
                loading={index < 5 ? "eager" : "lazy"}
              />
            );

            const playOverlay = (
              <span
                className="pointer-events-none absolute inset-0 z-[15] flex items-center justify-center bg-black/10 transition-all duration-500 ease-out group-hover:bg-black/25"
                aria-hidden="true"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out group-hover:scale-110 md:h-16 md:w-16">
                  <i
                    className="ri-play-fill translate-x-[1px] text-[28px] md:text-[32px]"
                    aria-hidden
                  />
                </span>
              </span>
            );

            if (slide.video) {
              return (
                <div
                  key={`${slide.label}-${index}`}
                  className="relative shrink-0 overflow-hidden bg-[#EFEDE8] [backface-visibility:hidden] [transform:translateZ(0)]"
                  style={cardStyle}
                  aria-label={slide.label}
                >
                  {img}
                </div>
              );
            }

            if (slide.href) {
              return (
                <a
                  key={`${slide.label}-${index}`}
                  href={slide.href}
                  title={`Watch ${slide.label}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group relative shrink-0 overflow-hidden bg-[#EFEDE8] [backface-visibility:hidden] [transform:translateZ(0)]"
                  style={cardStyle}
                  aria-label={`Watch ${slide.label}`}
                >
                  {img}
                  {playOverlay}
                </a>
              );
            }

            if (!enableLightbox) {
              return (
                <div
                  key={`${slide.label}-${index}`}
                  className="relative shrink-0 overflow-hidden bg-[#EFEDE8] [backface-visibility:hidden] [transform:translateZ(0)]"
                  style={cardStyle}
                >
                  {img}
                </div>
              );
            }

            return (
              <button
                key={`${slide.label}-${index}`}
                type="button"
                onClick={() => openLightbox(slide)}
                className="group relative shrink-0 cursor-pointer overflow-hidden border-0 bg-[#EFEDE8] p-0 text-left [backface-visibility:hidden] [transform:translateZ(0)]"
                style={cardStyle}
                aria-label={`View full ${slide.label}`}
              >
                {img}
                <span
                  className="pointer-events-none absolute inset-0 bg-black/0 transition-colors duration-300 group-hover:bg-black/25"
                  aria-hidden="true"
                />
                <span
                  className="pointer-events-none absolute bottom-3 right-3 z-10 flex h-9 w-9 items-center justify-center rounded-full bg-white/90 text-[#1a1a1a] shadow-sm backdrop-blur-sm transition duration-300 group-hover:scale-110 group-hover:bg-white"
                  aria-hidden="true"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.75"
                    className="h-4 w-4"
                  >
                    <path d="M15 3h6v6M9 21H3v-6M21 3l-7 7M3 21l7-7" />
                  </svg>
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          aria-label="Slide left"
          aria-pressed={direction === 1}
          onClick={() => slideByCard(1)}
          className="absolute left-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] shadow-sm backdrop-blur-sm transition hover:bg-white sm:left-3 sm:h-11 sm:w-11 md:left-4"
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
          aria-label="Slide right"
          aria-pressed={direction === -1}
          onClick={() => slideByCard(-1)}
          className="absolute right-2 top-1/2 z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full bg-white/80 text-[#1a1a1a] shadow-sm backdrop-blur-sm transition hover:bg-white sm:right-3 sm:h-11 sm:w-11 md:right-4"
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

      {enableLightbox ? (
        <ScrollableImageLightbox
          image={lightboxImage}
          onClose={closeLightbox}
        />
      ) : null}
    </section>
  );
}

export default DynamicSlider3;
