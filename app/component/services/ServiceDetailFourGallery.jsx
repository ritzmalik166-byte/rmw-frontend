"use client";

import React, { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import ServiceDetailMediaButton from "./ServiceDetailMediaButton";

gsap.registerPlugin(ScrollTrigger);

const titleStyle = {
  color: "#333333",
  textAlign: "center",
  fontFamily: '"League Spartan", sans-serif',
  fontStyle: "normal",
  fontWeight: 500,
  textTransform: "uppercase",
};

const bodyStyle = {
  color: "#333333",
  textAlign: "center",
  fontFamily: "Montserrat, sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
};

const headlineBaseStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 600,
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const imageContentHeadingStyle = {
  color: "#333333",
  textAlign: "center",
  fontFamily: '"League Spartan", sans-serif',
  fontStyle: "normal",
  fontWeight: 600,
  textTransform: "uppercase",
};

const imageContentBodyStyle = {
  color: "#333333",
  textAlign: "center",
  fontFamily: "Montserrat, sans-serif",
  fontStyle: "normal",
  fontWeight: 400,
};

function splitHeadlineParts(words) {
  const upper = words.map((word) => word.toUpperCase());

  if (upper.length >= 3) {
    return [upper[0], upper[1], upper.slice(2).join(" ")];
  }

  if (upper.length === 2) {
    return [upper[0], upper[1], null];
  }

  return [upper[0] || "", null, null];
}

function CardHeadline({ words }) {
  const parts = splitHeadlineParts(words);
  const singleLine = words.map((word) => word.toUpperCase()).join(" ");

  return (
    <div
      data-svc-headline
      className="relative w-max max-w-full origin-top-right overflow-visible pt-1"
    >
      <p
        data-svc-headline-compact
        style={headlineBaseStyle}
        className="m-0 whitespace-nowrap text-right text-[clamp(17px,3.8vw,26px)] leading-[1.05] [text-shadow:0_2px_18px_rgba(0,0,0,0.35)]"
      >
        {singleLine}
      </p>

      <p
        data-svc-headline-scattered
        style={headlineBaseStyle}
        aria-hidden
        className="pointer-events-none absolute top-0 right-0 z-30 m-0 flex w-max max-w-[min(92vw,560px)] flex-col items-end gap-y-[0.55em] text-[clamp(40px,8.5vw,56px)] leading-[1.05] opacity-0 [text-shadow:0_2px_18px_rgba(0,0,0,0.35)] lg:gap-y-[0.65em] lg:text-[clamp(48px,7.2vw,72px)] lg:leading-[1.08]"
      >
        <span data-svc-headline-line className="block whitespace-nowrap">
          {parts[0]}
        </span>
        {parts[1] ? (
          <span data-svc-headline-line className="block whitespace-nowrap pr-[1.1em]">
            {parts[1]}
          </span>
        ) : null}
        {parts[2] ? (
          <span data-svc-headline-line className="block whitespace-nowrap">
            {parts[2]}
          </span>
        ) : null}
      </p>
    </div>
  );
}

function GalleryCardMedia({ src, index, activeAudioIndex, onActivateAudio }) {
  const videoRef = useRef(null);
  const isVideo = typeof src === "string" && src.includes(".mp4");
  const isActive = activeAudioIndex === index;
  const [isMuted, setIsMuted] = useState(!isActive);

  useEffect(() => {
    if (!isVideo) return;

    const video = videoRef.current;
    if (!video) return;

    let unlockBound = false;

    const playVideo = () => {
      video.play().catch(() => {});
    };

    const unlockSound = () => {
      if (index !== 0) return;
      onActivateAudio(0);
      video.muted = false;
      video.volume = 1;
      setIsMuted(false);
      playVideo();
    };

    const bindUnlockListeners = () => {
      if (unlockBound || index !== 0) return;
      unlockBound = true;
      ["pointerdown", "click", "touchstart", "keydown"].forEach((eventName) => {
        document.addEventListener(eventName, unlockSound, { once: true, capture: true });
      });
    };

    const startPlayback = async () => {
      video.volume = 1;

      if (index !== 0) {
        video.muted = true;
        setIsMuted(true);
        playVideo();
        return;
      }

      video.muted = false;

      try {
        await video.play();
        setIsMuted(false);
        onActivateAudio(0);
      } catch {
        video.muted = true;
        setIsMuted(true);
        playVideo();
        bindUnlockListeners();
      }
    };

    startPlayback();
    video.addEventListener("loadeddata", playVideo);
    video.addEventListener("canplay", playVideo);

    return () => {
      video.removeEventListener("loadeddata", playVideo);
      video.removeEventListener("canplay", playVideo);
      ["pointerdown", "click", "touchstart", "keydown"].forEach((eventName) => {
        document.removeEventListener(eventName, unlockSound, { capture: true });
      });
    };
  }, [isVideo, src, index, onActivateAudio]);

  useEffect(() => {
    if (!isVideo) return;
    const video = videoRef.current;
    if (!video) return;

    if (isActive) {
      video.muted = false;
      video.volume = 1;
      setIsMuted(false);
      video.play().catch(() => {});
    } else {
      video.muted = true;
      setIsMuted(true);
    }
  }, [isActive, isVideo]);

  const toggleMute = (event) => {
    event.preventDefault();
    event.stopPropagation();
    const video = videoRef.current;
    if (!video) return;

    // Click any sound icon: currently-on mutes, clicked one turns on.
    // Click already-on icon: mute it.
    if (isActive) {
      onActivateAudio(null, true);
      video.muted = true;
      setIsMuted(true);
      return;
    }

    onActivateAudio(index, true);
    video.muted = false;
    video.volume = 1;
    video.play().catch(() => {});
    setIsMuted(false);
  };

  if (!isVideo) {
    return (
      <Image
        data-svc-image
        src={src}
        alt="Ritz Media World"
        title="Ritz Media World"
        fill
        sizes="(min-width: 768px) 50vw, 100vw"
        className="object-cover object-top will-change-transform"
        draggable={false}
      />
    );
  }

  return (
    <>
      <video
        ref={videoRef}
        data-svc-image
        src={src}
        className="absolute inset-0 h-full w-full object-cover object-top will-change-transform"
        autoPlay
        loop
        playsInline
        muted={index !== 0}
      />
      <button
        type="button"
        onClick={toggleMute}
        aria-label={isMuted ? "Unmute video" : "Mute video"}
        className="absolute left-4 top-14 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 md:left-5 md:top-16 md:h-10 md:w-10"
      >
        <i
          className={`text-lg md:text-xl ${isMuted ? "ri-volume-mute-line" : "ri-volume-down-line"}`}
          aria-hidden
        />
      </button>
    </>
  );
}

const ServiceDetailFourGallery = ({ mediaSection }) => {
  const sectionRef = useRef(null);
  const { title, description, gallery, imageContent } = mediaSection;
  const galleryItems = gallery ?? [];
  const [activeAudioIndex, setActiveAudioIndex] = useState(0);
  const userPickedAudioRef = useRef(false);

  const onActivateAudio = useCallback((nextIndex, fromUser = false) => {
    if (fromUser) userPickedAudioRef.current = true;
    setActiveAudioIndex(nextIndex);
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        if (userPickedAudioRef.current) return;
        setActiveAudioIndex(0);
      },
      { threshold: 0.35 }
    );

    observer.observe(section);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const hoverTweens = new Map();
    const canHover = window.matchMedia("(hover: hover) and (pointer: fine)").matches;

    const ctx = gsap.context(() => {
      gsap.utils.toArray("[data-svc-card]", section).forEach((card) => {
        const image = card.querySelector("[data-svc-image]");
        const overlay = card.querySelector("[data-svc-overlay]");
        const bottomScrim = card.querySelector("[data-svc-bottom-scrim]");
        const meta = card.querySelector("[data-svc-meta]");
        const category = card.querySelector("[data-svc-category]");
        const headlineCompact = card.querySelector("[data-svc-headline-compact]");
        const headlineScattered = card.querySelector("[data-svc-headline-scattered]");
        const headlineLines = card.querySelectorAll("[data-svc-headline-line]");
        const headlineWrap = card.querySelector("[data-svc-headline]");
        const topScrim = card.querySelector("[data-svc-top-scrim]");
        const arrow = card.querySelector("[data-svc-arrow]");

        gsap.set(card, { opacity: 0, y: 80, scale: 0.94 });
        gsap.set(meta, { opacity: 0, y: 16 });
        gsap.set(category, { opacity: 0, y: 16 });
        gsap.set(headlineCompact, { opacity: 0, y: -20 });
        gsap.set(headlineScattered, { opacity: 0 });
        gsap.set(headlineLines, { opacity: 0, y: -18 });
        gsap.set(overlay, { opacity: 1 });
        gsap.set(topScrim, { opacity: 0.45 });
        gsap.set(bottomScrim, { opacity: 0.72 });
        gsap.set(arrow, { opacity: 0, scale: 0.6, rotation: -45 });

        gsap
          .timeline({
            scrollTrigger: {
              trigger: card,
              start: "top 90%",
              toggleActions: "play none none reverse",
            },
          })
          .to(card, { opacity: 1, y: 0, scale: 1, duration: 1, ease: "power4.out" })
          .to(meta, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.55")
          .to(headlineCompact, { opacity: 1, y: 0, duration: 0.75, ease: "power4.out" }, "-=0.45")
          .to(category, { opacity: 1, y: 0, duration: 0.55, ease: "power3.out" }, "-=0.5")
          .to(arrow, { opacity: 1, scale: 1, rotation: 0, duration: 0.7, ease: "back.out(1.7)" }, "-=0.35");

        const onEnter = () => {
          if (!canHover) return;

          hoverTweens.get(card)?.kill();
          hoverTweens.set(
            card,
            gsap
              .timeline({ defaults: { ease: "power3.out", overwrite: "auto" } })
              .to(card, { y: -10, duration: 0.55 }, 0)
              .to(image, { scale: 1.08, duration: 0.85 }, 0)
              .to(topScrim, { opacity: 0.5, duration: 0.55 }, 0)
              .to(bottomScrim, { opacity: 0.75, duration: 0.55 }, 0)
              .to(headlineWrap, { y: 12, duration: 0.55 }, 0)
              .to(headlineCompact, { opacity: 0, y: 14, duration: 0.35 }, 0)
              .to(category, { y: -6, duration: 0.55 }, 0)
              .set(headlineScattered, { pointerEvents: "auto" }, 0.1)
              .to(headlineScattered, { opacity: 1, duration: 0.15 }, 0.1)
              .fromTo(
                headlineLines,
                { y: -22, opacity: 0 },
                { y: 0, opacity: 1, duration: 0.55, stagger: 0.06, ease: "power4.out" },
                0.12
              )
              .to(arrow, { scale: 1.08, rotation: 0, duration: 0.45 }, 0)
          );
        };

        const onLeave = () => {
          if (!canHover) return;

          hoverTweens.get(card)?.kill();
          hoverTweens.set(
            card,
            gsap
              .timeline({ defaults: { ease: "power3.out", overwrite: "auto" } })
              .to(card, { y: 0, duration: 0.55 }, 0)
              .to(image, { scale: 1, duration: 0.75 }, 0)
              .to(topScrim, { opacity: 0.45, duration: 0.55 }, 0)
              .to(bottomScrim, { opacity: 0.72, duration: 0.55 }, 0)
              .to(headlineWrap, { y: 0, duration: 0.55 }, 0)
              .to(headlineCompact, { opacity: 1, y: 0, duration: 0.45 }, 0)
              .to(headlineScattered, { opacity: 0, duration: 0.2 }, 0)
              .set(headlineLines, { y: -18, opacity: 0 }, 0)
              .to(category, { y: 0, duration: 0.55 }, 0)
              .to(arrow, { scale: 1, rotation: 0, duration: 0.45 }, 0)
          );
        };

        card.addEventListener("mouseenter", onEnter);
        card.addEventListener("mouseleave", onLeave);
        card._svcHoverCleanup = () => {
          card.removeEventListener("mouseenter", onEnter);
          card.removeEventListener("mouseleave", onLeave);
        };
      });

      gsap.utils.toArray("[data-four-gallery-header-reveal]", section).forEach((item, index) => {
        gsap.from(item, {
          y: 40,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: index * 0.08,
          scrollTrigger: {
            trigger: item,
            start: "top 90%",
            toggleActions: "play none none reverse",
          },
        });
      });

      gsap.utils.toArray("[data-four-gallery-footer-reveal]", section).forEach((item, index) => {
        gsap.from(item, {
          y: 48,
          opacity: 0,
          duration: 0.85,
          ease: "power3.out",
          delay: index * 0.06,
          scrollTrigger: {
            trigger: item,
            start: "top 88%",
            toggleActions: "play none none reverse",
          },
        });
      });
    }, section);

    return () => {
      hoverTweens.forEach((tween) => tween.kill());
      hoverTweens.clear();
      gsap.utils.toArray("[data-svc-card]", section).forEach((card) => card._svcHoverCleanup?.());
      ctx.revert();
    };
  }, []);

  if (!galleryItems.length) return null;

  return (
    <section
      ref={sectionRef}
      className="relative overflow-x-clip bg-[#F5F5F5] px-4 py-[35px] sm:px-6 md:px-8 md:py-[70px] lg:px-12"
    >
      <div className="relative mx-auto w-full max-w-[min(100%,1320px)]">
        {(title || description) ? (
          <div className="mx-auto flex w-full max-w-[900px] flex-col items-center text-center">
            {title ? (
              <h2
                data-four-gallery-header-reveal
                className="m-0 w-full text-center uppercase text-[30px] leading-[38px] sm:text-[42px] sm:leading-[48px] lg:text-[56px] lg:leading-[64px] xl:text-[65px] xl:leading-[74px]"
                style={titleStyle}
              >
                {title}
              </h2>
            ) : null}

            {description ? (
              <p
                data-four-gallery-header-reveal
                className="m-0 mt-5 w-full text-center text-[16px] leading-7 md:mt-6 lg:text-[18px] lg:leading-8 xl:max-w-[760px] xl:text-[20px] xl:leading-[30px]"
                style={bodyStyle}
              >
                {description}
              </p>
            ) : null}
          </div>
        ) : null}

        <div className="mt-12 flex w-full flex-col gap-4 md:mt-16 md:flex-row md:flex-wrap md:content-start md:gap-x-8 md:gap-y-4">
          {galleryItems.map((item, index) => {
            const words = (item.label ?? `Gallery ${index + 1}`).split(/\s+/);
            const CardTag = item.href ? "a" : "div";
            const cardLinkProps = item.href
              ? {
                  href: item.href,
                  target: "_blank",
                  rel: "noopener noreferrer",
                }
              : {};

            return (
              <CardTag
                key={`${item.src}-${index}`}
                data-svc-card
                {...cardLinkProps}
                className={`group relative block w-full overflow-hidden rounded-none bg-[#1D1D1B] shadow-[0_20px_50px_-20px_rgba(0,0,0,0.35)] will-change-transform max-lg:aspect-[69/73] md:w-[calc(50%-1rem)] lg:h-[621px] ${
                  item.href ? "cursor-pointer" : ""
                } ${index % 2 === 1 ? "md:mt-12 lg:mt-12" : ""}`}
              >
                <GalleryCardMedia
                  src={item.src}
                  index={index}
                  activeAudioIndex={activeAudioIndex}
                  onActivateAudio={onActivateAudio}
                />
                {item.href ? (
                  <div
                    className="pointer-events-none absolute inset-0 z-[15] flex items-center justify-center bg-black/0 opacity-0 transition-all duration-500 ease-out group-hover:bg-black/15 group-hover:opacity-100"
                    aria-hidden
                  >
                    <span className="flex h-14 w-14 scale-90 items-center justify-center rounded-full bg-[#FF0000] text-white shadow-[0_10px_30px_rgba(0,0,0,0.45)] transition-transform duration-500 ease-out group-hover:scale-100 md:h-16 md:w-16">
                      <i className="ri-play-fill text-[28px] translate-x-[1px] md:text-[32px]" aria-hidden />
                    </span>
                  </div>
                ) : null}
                <div
                  data-svc-overlay
                  className="pointer-events-none absolute inset-0 bg-gradient-to-b from-black/10 via-transparent to-transparent opacity-0"
                  aria-hidden
                />
                <div
                  data-svc-top-scrim
                  className="pointer-events-none absolute inset-x-0 top-0 h-[48%] bg-gradient-to-b from-black/70 to-transparent opacity-0"
                  aria-hidden
                />
                <div
                  data-svc-bottom-scrim
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-[42%] bg-gradient-to-t from-black/70 to-transparent opacity-0"
                  aria-hidden
                />

                <div className="relative z-10 hidden h-full flex-col overflow-visible p-5 sm:p-6 md:p-7 lg:p-8">
                  <div className="relative z-20 flex shrink-0 items-start justify-between gap-3 overflow-visible">
                    <span
                      data-svc-meta
                      className="text-[10px] font-medium uppercase tracking-[0.16em] text-white/90 [text-shadow:0_1px_14px_rgba(0,0,0,0.55)] sm:text-[11px] sm:tracking-[0.18em] md:text-[12px]"
                      style={{ fontFamily: '"Sequel Sans", sans-serif' }}
                    >
                      No. {String(index + 1).padStart(2, "0")}
                    </span>
                    <div className="pointer-events-none max-w-[min(100%,560px)] select-none overflow-visible">
                      <CardHeadline words={words} />
                    </div>
                  </div>

                  <div className="min-h-[38%] shrink-0 sm:min-h-[42%]" aria-hidden />

                  <div className="relative mt-auto min-h-[88px] sm:min-h-[96px] lg:min-h-[112px]">
                    <span
                      data-svc-category
                      className="absolute bottom-0 left-0 max-w-[calc(100%-3.5rem)] text-[10px] font-medium uppercase tracking-[0.16em] text-white/90 will-change-transform [text-shadow:0_1px_14px_rgba(0,0,0,0.55)] sm:max-w-[calc(100%-4rem)] sm:text-[11px] sm:tracking-[0.18em] md:text-[12px]"
                      style={{ fontFamily: '"Sequel Sans", sans-serif' }}
                    >
                      {item.label ?? "Influencer Marketing"}
                    </span>

                    <span
                      data-svc-arrow
                      className="absolute bottom-0 right-0 flex h-10 w-10 items-center justify-center rounded-full border border-white/30 bg-white/10 backdrop-blur-sm will-change-transform sm:h-11 sm:w-11 md:h-12 md:w-12"
                    >
                      <i className="ri-arrow-right-up-line text-[16px] text-white sm:text-[18px] md:text-[20px]" aria-hidden />
                    </span>
                  </div>
                </div>
              </CardTag>
            );
          })}
        </div>
      </div>

      {imageContent ? (
        <div
          data-four-gallery-footer-block
          className="mx-auto mt-14 flex w-full max-w-full flex-col items-center md:mt-20 xl:max-w-[1135px]"
        >
          <div
            data-four-gallery-divider
            className="mb-10 h-px w-full max-w-[220px] bg-[#0D1334]/20 md:mb-12"
          />

          <div className="flex w-full flex-col items-center px-6 sm:px-10 max-lg:px-0 max-lg:sm:px-4">
            {imageContent.heading ? (
              <h2
                data-four-gallery-footer-reveal
                className="m-0 w-full text-center uppercase text-[24px] leading-[34px] sm:leading-[42px] md:text-[30px] md:leading-[38px] lg:text-[38px] lg:leading-[48px] xl:max-w-[1135px] xl:text-[48px] xl:leading-[57px]"
                style={imageContentHeadingStyle}
              >
                {imageContent.heading}
              </h2>
            ) : null}

            {imageContent.body ? (
              <p
                data-four-gallery-footer-reveal
                className="m-0 mt-5 w-full text-center text-[16px] leading-7 md:mt-6 lg:text-[18px] lg:leading-8 xl:max-w-[986px] xl:text-[20px] xl:leading-[30px]"
                style={imageContentBodyStyle}
              >
                {imageContent.body}
              </p>
            ) : null}

            <div data-four-gallery-footer-reveal className="mt-8 md:mt-0">
              <ServiceDetailMediaButton />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
};

export default ServiceDetailFourGallery;