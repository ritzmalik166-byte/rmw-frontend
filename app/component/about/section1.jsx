"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Montserrat } from "next/font/google";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300"],
  style: ["italic"],
  display: "swap",
});

const mixtaPro = "font-['MixtaPro']";
const sequelFontFamily = '"Sequel Sans"';
const goldColor = "#FFD188";
const circleSpotlightDuration = 15;

const headingStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 500,
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const headlineRowClass =
  "flex w-full min-w-max items-center justify-between gap-[6px] md:w-full md:min-w-0 md:gap-[40px] lg:gap-[48px] xl:gap-[120px] [&_[data-headline-word]]:shrink-0 md:[&_[data-headline-word]]:shrink";

const headlineRowClassDistinction =
  "flex w-full min-w-max items-center justify-between gap-[6px] md:w-full md:min-w-0 md:gap-[30px] lg:gap-[48px] xl:gap-[120px] [&_[data-headline-word]]:shrink-0 md:[&_[data-headline-word]]:shrink";

const headlineRowClassAWorld =
  "flex w-full min-w-max items-center justify-start gap-[10px] md:w-full md:min-w-0 md:justify-between md:gap-[30px] lg:gap-[48px] xl:gap-[120px] [&_[data-headline-word]]:shrink-0 md:[&_[data-headline-word]]:shrink";

const headlineRowClassMobileCenter =
  "flex w-full min-w-max items-center justify-center gap-[6px] [&_[data-headline-word]]:shrink-0";

const disruptionStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 365,
  fontSize: "94px",
  lineHeight: "71px",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#1D1D1B",
};

const disruptionWordStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 600,
  fontSize: "180px",
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#333333",
};

const mobileDisruptionWordStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 600,
  fontSize: "72px",
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#333333",
};

const subHeadingStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 500,
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#333333",
};

const Reveal = ({ children, className = "", clipYOnly = false, group = "headline" }) => (
  <span
    className={`block ${clipYOnly ? "overflow-x-visible overflow-y-hidden" : "overflow-hidden"} ${className}`}
  >
    <span data-about-reveal={group} className="block w-full">
      {children}
    </span>
  </span>
);

const Letter = ({ children, from }) => (
  <span className="inline-block shrink-0 overflow-hidden align-bottom">
    <span data-letter-reveal={from} className="inline-block">
      {children}
    </span>
  </span>
);

const VIDEO_SCROLL_SCRUB = 2.8;
const LETTER_REVEAL_VIDEO_START = 0.5;
const LETTER_REVEAL_VIDEO_END = 0.98;
const LETTER_REVEAL_ORDER = [2, 3, 1, 4, 0, 5, 7, 8, 6, 9];
const LETTER_REVEAL_STAGGER = 0.8;
const LETTER_REVEAL_DURATION = 0.48;
const LETTER_REVEAL_EASE = "power3.out";
const HERO_ENTRANCE_EASE = "power3.out";
const VIDEO_SNAP_DURATION = 1.1;
const VIDEO_SNAP_EASE = "power3.inOut";
const TEXT_REVEAL_DURATION = 1.5;
const FILM_REVEAL_DURATION = 1.35;

const VideoMuteButton = ({ isMuted, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isMuted ? "Unmute video" : "Mute video"}
    className="pointer-events-auto absolute right-4 top-5 z-30 flex h-9 w-9 cursor-pointer items-center justify-center rounded-full bg-black/45 text-white backdrop-blur-sm transition-colors hover:bg-black/65 md:right-6 md:h-10 md:w-10"
  >
    <i
      className={`text-lg md:text-xl ${isMuted ? "ri-volume-mute-line" : "ri-volume-down-line"}`}
      aria-hidden
    />
  </button>
);

const Section1 = () => {
  const [isMuted, setIsMuted] = useState(false);
  const isMutedRef = useRef(false);
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const headlineSpotlightWrapRef = useRef(null);
  const headlineGoldRef = useRef(null);
  const disruptionRef = useRef(null);
  const filmRef = useRef(null);
  const heroSectionRef = useRef(null);
  const heroTextRef = useRef(null);
  const videoFloatRef = useRef(null);
  const videoSlotRef = useRef(null);
  const logoFloatRef = useRef(null);
  const videoEntranceRef = useRef(0);
  const videoRevealStartedRef = useRef(false);
  const videoBoundsRef = useRef(null);
  const videoSettledRef = useRef(false);
  const isVideoSnappingRef = useRef(false);

  const isMobileViewport = () =>
    typeof window !== "undefined" && window.matchMedia("(max-width: 767px)").matches;

  const getStartSize = () => {
    const video = videoFloatRef.current?.querySelector("video");
    const contentWidth = heroTextRef.current?.clientWidth ?? Math.min(1408, window.innerWidth - (window.innerWidth >= 768 ? 96 : 64));
    const width = Math.min(1044, contentWidth);
    let height = width * (9 / 16);

    if (video?.videoWidth && video?.videoHeight) {
      height = width * (video.videoHeight / video.videoWidth);
    }

    return { width, height };
  };

  const getContentCenterX = () => {
    const container = heroRef.current;
    const textCol = heroTextRef.current;
    if (!container) return window.innerWidth / 2;
    if (!textCol) return container.offsetWidth / 2;

    const containerRect = container.getBoundingClientRect();
    const textRect = textCol.getBoundingClientRect();
    return textRect.left + textRect.width / 2 - containerRect.left;
  };

  const measureFinalSlotEnd = () => {
    const container = heroRef.current;
    const slot = videoSlotRef.current;
    if (!container || !slot) return null;

    const wordEls = container.querySelectorAll("[data-about-reveal='disruption-word']");
    const saved = [...wordEls].map((el) => gsap.getProperty(el, "yPercent"));
    wordEls.forEach((el) => gsap.set(el, { yPercent: 0 }));

    const cRect = container.getBoundingClientRect();
    const sRect = slot.getBoundingClientRect();
    const endHeight = sRect.height;
    const endWidth = sRect.width;
    const end = {
      x: sRect.left + sRect.width / 2 - cRect.left,
      y: sRect.top + sRect.height / 2 - cRect.top - 20,
      width: endWidth,
      height: endHeight,
      clipTop: 0,
    };

    wordEls.forEach((el, i) => gsap.set(el, { yPercent: saved[i] ?? -110 }));
    return end;
  };

  const getVideoTextGap = () => {
    const w = window.innerWidth;
    if (w >= 1280) return 100;
    if (w >= 1024) return 104;
    if (w >= 768) return 78;
    return 108;
  };

  const getVideoStartCenterY = (startSize) => {
    const container = heroRef.current;
    const heroSection = heroSectionRef.current;
    if (!container || !heroSection) return null;

    const subEl = heroSection.querySelector("[data-about-reveal='sub']");
    if (!subEl) return null;

    const containerRect = container.getBoundingClientRect();
    const subRect = subEl.getBoundingClientRect();
    const subBottom = subRect.bottom - containerRect.top;

    return subBottom + getVideoTextGap() + startSize.height / 2;
  };

  const getVideoStartYOffset = () => {
    const w = window.innerWidth;
    if (w >= 1280 && w < 1536) return 150;
    if (w >= 1024 && w < 1280) return 355;
    if (w >= 768 && w < 1024) return 150;
    return 350;
  };

  const getLogoVideoTopOffset = () => {
    const w = window.innerWidth;
    if (w >= 1280 && w < 1536) return 10;
    if (w >= 1024 && w < 1280) return 20;
    if (w >= 768) return 30;
    return 0;
  };

  const getLogoRestPosition = () => {
    const heroSection = heroSectionRef.current;
    const bounds = computeVideoBounds();
    if (!heroSection || !bounds) return null;

    const w = window.innerWidth;
    const sectionBottom = heroSection.offsetTop + heroSection.offsetHeight;

    if (w >= 1280 && w < 1536) {
      return {
        top: sectionBottom,
        yPercent: -100,
        alignEnd: true,
      };
    }

    if (w >= 768) {
      const videoTop = bounds.start.y - bounds.start.height / 2;
      return {
        top: videoTop + getLogoVideoTopOffset(),
        yPercent: 0,
        alignEnd: false,
      };
    }

    return {
      top: sectionBottom,
      yPercent: -100,
      alignEnd: true,
    };
  };

  const syncVideoBounds = (lockStart = false, lockEnd = false) => {
    const container = heroRef.current;
    const heroSection = heroSectionRef.current;
    if (!container || !heroSection) return null;

    const startSize = getStartSize();
    const sectionBottom = heroSection.offsetTop + heroSection.offsetHeight;
    const measuredEnd = measureFinalSlotEnd();
    if (!measuredEnd) return null;

    const nextStart =
      lockStart && videoBoundsRef.current?.start
        ? videoBoundsRef.current.start
        : {
            x: getContentCenterX(),
            y:
              getVideoStartCenterY(startSize) ??
              sectionBottom - startSize.height / 2 + getVideoStartYOffset(),
            width: startSize.width,
            height: startSize.height,
            clipTop: 0,
          };

    const nextEnd =
      lockEnd && videoBoundsRef.current?.end
        ? videoBoundsRef.current.end
        : measuredEnd;

    videoBoundsRef.current = {
      start: nextStart,
      end: nextEnd,
    };

    return videoBoundsRef.current;
  };

  const getVideoBounds = () => videoBoundsRef.current ?? syncVideoBounds();

  const computeVideoBounds = () => getVideoBounds();

  const applyLogoPosition = (entranceProgress, scrollProgress = 0) => {
    if (isMobileViewport()) return;

    const logoFloat = logoFloatRef.current;
    const heroSection = heroSectionRef.current;
    const container = heroRef.current;
    if (!logoFloat || !heroSection || !container) return;

    const entrance = gsap.utils.clamp(0, 1, entranceProgress ?? videoEntranceRef.current);
    const scrollT = gsap.utils.clamp(0, 1, scrollProgress);
    const logoHeight = 200;
    const logoRest = getLogoRestPosition();
    if (!logoRest) return;
    const logoInner = logoFloat.querySelector("[data-logo-inner]");

    gsap.set(logoFloat, {
      position: "absolute",
      left: container.offsetWidth / 2,
      right: "auto",
      top: logoRest.top,
      xPercent: -50,
      yPercent: logoRest.yPercent,
      width: container.offsetWidth,
      height: logoHeight,
      zIndex: scrollT > 0 ? 55 : 35,
      borderRadius: 0,
      visibility: videoRevealStartedRef.current ? "visible" : "hidden",
      opacity: entrance,
    });

    if (logoInner) {
      gsap.set(logoInner, {
        top: logoRest.alignEnd ? "auto" : 0,
        bottom: logoRest.alignEnd ? 0 : "auto",
        left: 0,
        right: 0,
        height: "100%",
        alignItems: logoRest.alignEnd ? "flex-end" : "flex-start",
        justifyContent: "center",
      });
    }

    const logoImg = logoFloat.querySelector("[data-logo-inner] img");
    if (logoImg) {
      gsap.set(logoImg, {
        clearProps: "width,height,maxWidth,objectPosition",
        objectPosition: logoRest.alignEnd ? "bottom" : "top",
      });
    }
  };

  const applyHeroTextScroll = (scrollProgress) => {
    if (isMobileViewport()) return;

    const heroText = heroTextRef.current;
    const heroSection = heroSectionRef.current;
    if (!heroText || !heroSection) return;

    const t = gsap.utils.clamp(0, 1, scrollProgress);
    gsap.set(heroText, {
      y: -t * heroSection.offsetHeight * 0.38,
      opacity: gsap.utils.interpolate(1, 0.15, t),
    });
  };

  const getDisruptionBlock = () => {
    const root = disruptionRef.current;
    if (!root) return null;
    return isMobileViewport()
      ? root.querySelector("[data-disruption-mobile]")
      : root.querySelector("[data-disruption-desktop]");
  };

  const getDisruptionLetters = () => {
    const block = getDisruptionBlock();
    return block ? gsap.utils.toArray("[data-letter-reveal]", block) : [];
  };

  const getDisruptionWordItems = () => {
    const block = getDisruptionBlock();
    return block ? gsap.utils.toArray("[data-about-reveal='disruption-word']", block) : [];
  };

  const mapVideoProgressToLetterReveal = (scrollProgress) =>
    gsap.utils.clamp(
      0,
      1,
      gsap.utils.mapRange(LETTER_REVEAL_VIDEO_START, LETTER_REVEAL_VIDEO_END, 0, 1, scrollProgress)
    );

  const applyFilmSectionReveal = (progress) => {
    if (isMobileViewport()) return;

    const hero = heroRef.current;
    if (!hero) return;

    const introItems = gsap.utils.toArray("[data-about-reveal='intro']", hero);
    const disruptionItems = gsap.utils.toArray("[data-about-reveal='disruption']", hero);
    const t = gsap.utils.clamp(0, 1, progress);

    introItems.forEach((item, index) => {
      const start = index * 0.08;
      const end = start + 0.68;
      const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(start, end, 0, 1, t));
      const eased = gsap.parseEase(LETTER_REVEAL_EASE)(p);
      gsap.set(item, { yPercent: gsap.utils.interpolate(110, 0, eased) });
    });

    disruptionItems.forEach((item, index) => {
      const start = 0.12 + index * 0.08;
      const end = start + 0.68;
      const p = gsap.utils.clamp(0, 1, gsap.utils.mapRange(start, end, 0, 1, t));
      const eased = gsap.parseEase(LETTER_REVEAL_EASE)(p);
      gsap.set(item, { yPercent: gsap.utils.interpolate(110, 0, eased) });
    });
  };

  const applyCreativityLetterReveal = (letterProgress) => {
    // Mobile has its own film reveal timeline - scrubbing here hides letters again.
    if (isMobileViewport()) return;

    const letters = getDisruptionLetters();
    const wordItems = getDisruptionWordItems();
    if (!letters.length) return;

    const t = gsap.utils.clamp(0, 1, letterProgress);
    const revealOrder =
      letters.length === LETTER_REVEAL_ORDER.length
        ? LETTER_REVEAL_ORDER
        : letters.map((_, index) => index);

    revealOrder.forEach((letterIndex, orderIndex) => {
      const letter = letters[letterIndex];
      if (!letter) return;

      const from = letter.getAttribute("data-letter-reveal");
      const startOffset = from === "left" ? 105 : -105;
      const letterStart = (orderIndex / revealOrder.length) * LETTER_REVEAL_STAGGER;
      const letterEnd = letterStart + LETTER_REVEAL_DURATION;
      const progress = gsap.utils.clamp(
        0,
        1,
        gsap.utils.mapRange(letterStart, letterEnd, 0, 1, t)
      );
      const eased = gsap.parseEase(LETTER_REVEAL_EASE)(progress);

      gsap.set(letter, {
        x: `${gsap.utils.interpolate(startOffset, 0, eased)}%`,
      });
    });

    wordItems.forEach((item, index) => {
      const opacityStart = Math.max(0, (index / Math.max(wordItems.length, 1)) * 0.12);
      const opacity = gsap.utils.clamp(
        0,
        1,
        gsap.utils.mapRange(opacityStart, opacityStart + 0.08, 0, 1, t)
      );
      gsap.set(item, { opacity: t > 0.02 ? Math.max(opacity, 0.01) : 0 });
    });
  };

  const syncLogoWithScroll = (scrollProgress = 0) => {
    applyLogoPosition(
      videoEntranceRef.current >= 1 ? 1 : videoEntranceRef.current,
      scrollProgress
    );
  };

  const applyVideoProgress = (progress, entranceProgress) => {
    if (isMobileViewport()) return;

    const floater = videoFloatRef.current;
    const bounds = computeVideoBounds();
    if (!floater || !bounds) return;

    const t = gsap.utils.clamp(0, 1, progress);
    const entrance = gsap.utils.clamp(0, 1, entranceProgress ?? videoEntranceRef.current);
    const { start, end } = bounds;
    const clipTop = gsap.utils.interpolate(start.clipTop, end.clipTop, t);

    const targetWidth = gsap.utils.interpolate(start.width, end.width, t);
    const targetHeight = gsap.utils.interpolate(start.height, end.height, t);
    const minScale = 0.18;
    const width =
      progress > 0 || entrance >= 1
        ? targetWidth
        : gsap.utils.interpolate(start.width * minScale, start.width, entrance);
    const height =
      progress > 0 || entrance >= 1
        ? targetHeight
        : gsap.utils.interpolate(start.height * minScale, start.height, entrance);

    gsap.set(floater, {
      visibility: videoRevealStartedRef.current ? "visible" : "hidden",
      left: gsap.utils.interpolate(start.x, end.x, t),
      top: gsap.utils.interpolate(start.y, end.y, t),
      width,
      height,
      zIndex: progress > 0 ? 50 : 30,
      clipPath: clipTop > 0 ? `inset(${clipTop}% 0% 0% 0%)` : "none",
      borderRadius: progress > 0 ? gsap.utils.interpolate(24, 20, t) : gsap.utils.interpolate(0, 10, entrance),
      force3D: true,
    });

    const video = floater.querySelector("video");
    if (video) {
      gsap.set(video, { clearProps: "scale,height" });
    }
  };

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const headline = headlineRef.current;
    const disruption = disruptionRef.current;
    const film = filmRef.current;
    if (!hero) return;

    const fitHeadline = () => {
      const parent = headline?.parentElement;
      const textCol = heroTextRef.current;
      if (!headline || !parent) return;

      headline.style.transform = "none";
      headline.style.marginLeft = "0";
      headline.style.maxWidth = "none";

      const primaryLayer = headline.querySelector("[data-headline-primary]");
      const rows = primaryLayer
        ? primaryLayer.querySelectorAll("[data-headline-row]")
        : headline.querySelectorAll("[data-headline-row]");

      // Mobile: grow/shrink font so longest row fills width (CSS px bumps then show).
      if (isMobileViewport()) {
        headline.style.width = "100%";
        headline.style.fontSize = "";
        headline.style.transform = "none";

        // Measure at stylesheet size first
        headline.style.width = "max-content";
        let needed = 0;
        rows.forEach((row) => {
          if (!row.getClientRects().length) return;
          needed = Math.max(needed, row.scrollWidth, row.getBoundingClientRect().width);
        });
        const available = (textCol?.clientWidth ?? parent.clientWidth) - 2;
        if (needed > 0 && available > 0) {
          const basePx = parseFloat(window.getComputedStyle(headline).fontSize) || 48;
          // Fill the row width; cap so it stays readable
          const nextPx = Math.min(62, Math.max(36, basePx * (available / needed) - 10));
          headline.style.fontSize = `${nextPx}px`;
          headline.style.lineHeight = `${Math.round(nextPx * 1.05)}px`;
        }
        headline.style.width = "100%";
        headline.style.transformOrigin = "top left";
        return;
      }

      headline.style.fontSize = "";
      headline.style.lineHeight = "";
      headline.style.width = "max-content";

      let needed = 0;
      rows.forEach((row) => {
        if (!row.getClientRects().length) return;
        needed = Math.max(needed, row.scrollWidth, row.getBoundingClientRect().width);
      });
      const available = (textCol?.clientWidth ?? parent.clientWidth) - 2;
      const scale = needed > 0 ? Math.min(1, available / needed) : 1;
      if (scale < 1) {
        headline.style.width = `${100 / scale}%`;
        headline.style.transform = `scale(${scale})`;
      } else {
        headline.style.width = "100%";
        headline.style.transform = "none";
      }
      headline.style.transformOrigin = "top left";
    };

    const fitDisruption = () => {
      if (!disruption || isMobileViewport()) return;

      const parent = disruption.parentElement;
      disruption.style.transform = "none";
      const rows = disruption.querySelectorAll("[data-headline-row]");
      let needed = 0;
      rows.forEach((row) => {
        needed = Math.max(needed, row.scrollWidth, row.getBoundingClientRect().width);
      });
      const buffer = 48;
      const available = (parent?.clientWidth ?? window.innerWidth) - buffer;
      const scale = needed > 0 ? Math.min(1, available / needed) : 1;
      disruption.style.transform = scale < 1 ? `scale(${scale})` : "none";
      disruption.style.transformOrigin = "center top";
    };

    const fitAll = () => {
      fitHeadline();
      fitDisruption();
    };

    let onHeaderComplete = null;
    let heroEntranceFallback = null;
    let metadataVideo = null;
    let onVideoMetadata = null;
    let heroVideoST = null;
    let snapTween = null;
    let filmEnterTl = null;
    let textRevealTween = null;
    const videoScroll = { p: 0 };

    let spotlightTween = null;
    let spotlightStarted = false;

    const getCircleRadius = () => {
      const width = window.innerWidth;
      if (width >= 1280) return 55;
      if (width >= 1024) return 45;
      if (width >= 768) return 35;
      return 22;
    };

    const getSpotlightRowWaypoints = () => {
      const wrap = headlineSpotlightWrapRef.current;
      if (!wrap) return null;

      const whiteLayer = wrap.firstElementChild;
      if (!whiteLayer) return null;

      const rows = whiteLayer.querySelectorAll("[data-headline-row]");
      if (!rows.length) return null;

      const wrapRect = wrap.getBoundingClientRect();
      const circleRadius = getCircleRadius();

      return [...rows]
        .filter((row) => row.getClientRects().length > 0)
        .map((row) => {
          const words = [...row.querySelectorAll("[data-headline-word]")];
          if (!words.length) return null;

          const firstRect = words[0].getBoundingClientRect();
          const lastRect = words[words.length - 1].getBoundingClientRect();
          const startX = firstRect.left - wrapRect.left + circleRadius;
          const endX = lastRect.left - wrapRect.left + lastRect.width - circleRadius;

          return {
            start: {
              x: startX,
              y: firstRect.top - wrapRect.top + firstRect.height * 0.5,
            },
            end: {
              x: Math.max(startX, endX),
              y: lastRect.top - wrapRect.top + lastRect.height * 0.5,
            },
          };
        })
        .filter(Boolean);
    };

    const hideHeadlineGold = () => {
      const gold = headlineGoldRef.current;
      if (!gold) return;

      const mask = "radial-gradient(circle 0px at -9999px -9999px, #000 0%, transparent 0%)";
      gold.style.maskImage = mask;
      gold.style.webkitMaskImage = mask;
      gold.style.opacity = "0";
    };

    const startHeadlineSpotlight = () => {
      const wrap = headlineSpotlightWrapRef.current;
      const gold = headlineGoldRef.current;
      if (!wrap || !gold) return;

      const rowWaypoints = getSpotlightRowWaypoints();
      if (!rowWaypoints?.length) return;

      spotlightTween?.kill();
      spotlightTween = null;

      const setMaskAt = (x, y) => {
        const radius = getCircleRadius();
        const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, #000 0%, #000 72%, transparent 100%)`;
        gold.style.maskImage = mask;
        gold.style.webkitMaskImage = mask;
        gold.style.opacity = "1";
      };

      const speed = Math.max(wrap.offsetWidth, 1) / circleSpotlightDuration;
      const proxy = {
        x: rowWaypoints[0].start.x,
        y: rowWaypoints[0].start.y,
      };

      hideHeadlineGold();

      const tl = gsap.timeline({
        repeat: -1,
        onUpdate: () => {
          setMaskAt(proxy.x, proxy.y);
        },
      });

      // One continuous circle path across every row (no full-text flash between lines)
      rowWaypoints.forEach((row, rowIndex) => {
        if (rowIndex === 0) {
          tl.set(proxy, { x: row.start.x, y: row.start.y });
        } else {
          tl.to(proxy, {
            x: row.start.x,
            y: row.start.y,
            duration: 0.28,
            ease: "none",
          });
        }

        const dist = Math.hypot(row.end.x - row.start.x, row.end.y - row.start.y);
        if (dist > 1) {
          tl.to(proxy, {
            x: row.end.x,
            y: row.end.y,
            duration: dist / speed,
            ease: "none",
          });
        }
      });

      tl.call(hideHeadlineGold);
      tl.set(proxy, { x: rowWaypoints[0].start.x, y: rowWaypoints[0].start.y });
      tl.to({}, { duration: 0.35 });

      spotlightTween = tl;
      spotlightStarted = true;
    };

    const ctx = gsap.context(() => {
      const headlineItems = gsap.utils.toArray("[data-about-reveal='headline']", hero);
      const subItems = gsap.utils.toArray("[data-about-reveal='sub']", hero);
      const logoEl = hero.querySelector("[data-about-hero-logo]");
      const introItems = gsap.utils.toArray("[data-about-reveal='intro']", hero);
      const disruptionItems = gsap.utils.toArray("[data-about-reveal='disruption']", hero);
      const disruptionWordItems = gsap.utils.toArray("[data-about-reveal='disruption-word']", hero);

      gsap.set(headlineItems, { yPercent: -110 });
      gsap.set(subItems, { yPercent: -110, opacity: 0 });
      if (logoEl) gsap.set(logoEl, { clipPath: "inset(0% 0% 0% 0%)" });
      gsap.set(introItems, { yPercent: 110 });
      gsap.set(disruptionItems, { yPercent: 110 });
      gsap.set(disruptionWordItems, { yPercent: 0, opacity: 0 });

      const desktopBlock = disruptionRef.current?.querySelector("[data-disruption-desktop]");
      const mobileBlock = disruptionRef.current?.querySelector("[data-disruption-mobile]");
      [desktopBlock, mobileBlock].forEach((block) => {
        if (!block) return;
        gsap.set(block.querySelectorAll("[data-letter-reveal='left']"), { x: "105%" });
        gsap.set(block.querySelectorAll("[data-letter-reveal='right']"), { x: "-105%" });
      });

      const mobileLetters = mobileBlock
        ? gsap.utils.toArray("[data-letter-reveal]", mobileBlock)
        : [];
      const mobileWordItems = mobileBlock
        ? gsap.utils.toArray("[data-about-reveal='disruption-word']", mobileBlock)
        : [];

      const playHeroEntrance = () => {
        if (playHeroEntrance.played) return;
        playHeroEntrance.played = true;

        const entrance = { value: 0 };
        const mobile = isMobileViewport();
        // Animate only visible nodes so hidden desktop/mobile duplicates don't stall the timeline.
        const headlines = (
          headlineItems.filter((el) => el.getClientRects().length > 0).length
            ? headlineItems.filter((el) => el.getClientRects().length > 0)
            : headlineItems
        );
        const subs = (
          subItems.filter((el) => el.getClientRects().length > 0).length
            ? subItems.filter((el) => el.getClientRects().length > 0)
            : subItems
        );

        if (!mobile) {
          videoEntranceRef.current = 0;
          videoRevealStartedRef.current = true;
          applyVideoProgress(0, 0);
        }

        const tl = gsap.timeline({
          onComplete: () => {
            if (!mobile) {
              videoEntranceRef.current = 1;
              syncVideoBounds(true);
              applyVideoProgress(0, 1);
              applyLogoPosition(1);
            } else {
              // Keep mobile hero text visible after entrance (no leftover yPercent clip).
              gsap.set(headlines, { yPercent: 0 });
              gsap.set(subs, { yPercent: 0, opacity: 1 });
            }
            fitAll();
          },
        });

        headlines.forEach((item, index) => {
          tl.to(
            item,
            {
              yPercent: 0,
              duration: mobile ? 1.15 : 2.15,
              ease: HERO_ENTRANCE_EASE,
              onComplete:
                index === headlines.length - 1
                  ? () => {
                      fitAll();
                      startHeadlineSpotlight();
                    }
                  : undefined,
            },
            index === 0 ? 0 : mobile ? "-=0.9" : "-=1.7"
          );
        });

        subs.forEach((item, index) => {
          tl.to(
            item,
            {
              yPercent: 0,
              opacity: 1,
              duration: mobile ? 0.85 : 1.55,
              ease: HERO_ENTRANCE_EASE,
            },
            index === 0 ? (mobile ? "-=0.5" : "-=1.15") : mobile ? "-=0.65" : "-=1.2"
          );
        });

        if (!mobile && logoEl) {
          tl.set(logoEl, { visibility: "visible" }, 0);
        }

        if (!mobile) {
          tl.to(
            entrance,
            {
              value: 1,
              duration: 2.15,
              ease: HERO_ENTRANCE_EASE,
              onUpdate: () => {
                videoEntranceRef.current = entrance.value;
                applyVideoProgress(0, entrance.value);
                applyLogoPosition(entrance.value);
              },
            },
            0
          );
        }
      };

      onHeaderComplete = () => {
        if (heroEntranceFallback) {
          window.clearTimeout(heroEntranceFallback);
          heroEntranceFallback = null;
        }
        playHeroEntrance();
      };
      window.addEventListener("header-reveal-complete", onHeaderComplete);
      // Mobile: if header event was missed, still reveal text so content isn't stuck hidden.
      heroEntranceFallback = window.setTimeout(() => {
        heroEntranceFallback = null;
        const stillHidden = headlineItems.some(
          (el) => Number(gsap.getProperty(el, "yPercent")) < -50
        );
        if (stillHidden) playHeroEntrance();
      }, 1600);

      if (film && isMobileViewport() && (introItems.length || disruptionItems.length)) {
        const filmTl = gsap.timeline({
          scrollTrigger: {
            trigger: film,
            start: "top 92%",
            toggleActions: "play none none none",
            once: true,
          },
        });

        introItems.forEach((item) => {
          filmTl.to(item, { yPercent: 0, duration: FILM_REVEAL_DURATION, ease: LETTER_REVEAL_EASE }, 0);
        });

        disruptionItems.forEach((item) => {
          filmTl.to(item, { yPercent: 0, duration: FILM_REVEAL_DURATION, ease: LETTER_REVEAL_EASE }, ">-0.2");
        });

        if (mobileLetters.length && mobileWordItems.length) {
          filmTl.to(mobileWordItems, { opacity: 1, duration: 0.01 }, "<");
          filmTl.to(
            mobileLetters,
            { x: "0%", duration: 0.75, ease: LETTER_REVEAL_EASE, stagger: 0.08 },
            "<"
          );
        }

        filmTl.eventCallback("onComplete", () => {
          gsap.set(introItems, { yPercent: 0 });
          gsap.set(disruptionItems, { yPercent: 0 });
          if (mobileWordItems.length) gsap.set(mobileWordItems, { opacity: 1 });
          if (mobileLetters.length) gsap.set(mobileLetters, { x: "0%" });
          fitAll();
        });
      }

      if (film && !isMobileViewport()) {
        filmEnterTl = gsap.timeline({ paused: true });

        introItems.forEach((item) => {
          filmEnterTl.to(item, { yPercent: 0, duration: FILM_REVEAL_DURATION, ease: LETTER_REVEAL_EASE }, 0);
        });

        disruptionItems.forEach((item) => {
          filmEnterTl.to(item, { yPercent: 0, duration: FILM_REVEAL_DURATION, ease: LETTER_REVEAL_EASE }, ">-0.2");
        });

        filmEnterTl.eventCallback("onComplete", fitAll);
      }

      const floater = videoFloatRef.current;
      const slot = videoSlotRef.current;
      const heroSection = heroSectionRef.current;
      const videoEl = floater?.querySelector("video");

      const refreshVideoLayout = () => {
        syncVideoBounds(videoEntranceRef.current >= 1);
        const scrollProgress =
          ScrollTrigger.getAll().find((st) => st.vars?.endTrigger === slot)?.progress ?? 0;
        applyVideoProgress(scrollProgress, videoEntranceRef.current);
        applyHeroTextScroll(scrollProgress);
        if (videoSettledRef.current || scrollProgress >= 0.99) {
          applyCreativityLetterReveal(mapVideoProgressToLetterReveal(scrollProgress));
        }
        applyLogoPosition(1, scrollProgress);
      };

      if (floater && slot && heroSection && !isMobileViewport()) {
        gsap.set(floater, {
          position: "absolute",
          xPercent: -50,
          yPercent: -50,
          zIndex: 30,
          borderRadius: "7px",
          overflow: "hidden",
        });

        videoEntranceRef.current = 0;
        videoRevealStartedRef.current = false;
        syncVideoBounds();
        applyVideoProgress(0, 0);
        applyLogoPosition(0);

        const videoTl = gsap.timeline({
          scrollTrigger: {
            trigger: heroSection,
            start: "top top",
            endTrigger: slot,
            end: "top 38%",
            scrub: VIDEO_SCROLL_SCRUB,
            invalidateOnRefresh: true,
            onRefresh: () => {
              syncVideoBounds(
                videoEntranceRef.current >= 1 || videoSettledRef.current,
                videoSettledRef.current
              );
            },
          },
        });

        heroVideoST = videoTl.scrollTrigger;

        videoTl.to(videoScroll, {
          p: 1,
          ease: "none",
          onUpdate: () => {
            if (isVideoSnappingRef.current || videoSettledRef.current) return;
            applyVideoProgress(videoScroll.p, 1);
            applyHeroTextScroll(videoScroll.p);
            // Text reveal starts only after video has reached its slot.
            if (videoScroll.p >= 0.99) {
              applyCreativityLetterReveal(mapVideoProgressToLetterReveal(videoScroll.p));
            }
            syncLogoWithScroll(videoScroll.p);
          },
        });

        if (videoEl) {
          onVideoMetadata = refreshVideoLayout;
          metadataVideo = videoEl;
          videoEl.addEventListener("loadedmetadata", onVideoMetadata);
        }

        requestAnimationFrame(() => {
          applyVideoProgress(0, videoEntranceRef.current);
          ScrollTrigger.refresh();
        });
      }

      // Desktop only - mobile snap was resetting film text to hidden (yPercent 110 / opacity 0).
      if (heroSection && film && !isMobileViewport()) {
        let isSnapping = false;
        let snapArmed = true;

        const playTextAfterVideoSettles = () => {
          filmEnterTl?.play(0);

          textRevealTween?.kill();
          const proxy = { t: 0 };
          applyCreativityLetterReveal(0);
          textRevealTween = gsap.to(proxy, {
            t: 1,
            duration: TEXT_REVEAL_DURATION,
            ease: "power2.out",
            onUpdate: () => applyCreativityLetterReveal(proxy.t),
          });
        };

        const settleVideoAtSlot = () => {
          if (isMobileViewport()) return;
          videoSettledRef.current = true;
          videoScroll.p = 1;
          videoEntranceRef.current = 1;
          videoRevealStartedRef.current = true;
          syncVideoBounds(true, true);
          applyVideoProgress(1, 1);
          applyHeroTextScroll(1);
          syncLogoWithScroll(1);
          if (heroVideoST) {
            heroVideoST.animation?.progress(1);
          }
          playTextAfterVideoSettles();
        };

        const applyScrollLinkedVideo = (progress) => {
          if (isMobileViewport()) return;
          const t = gsap.utils.clamp(0, 1, progress);
          videoScroll.p = t;
          videoEntranceRef.current = 1;
          videoRevealStartedRef.current = true;
          applyVideoProgress(t, 1);
          applyHeroTextScroll(t);
          syncLogoWithScroll(t);
        };

        const snapToFilmSection = () => {
          if (isSnapping || !snapArmed || !film) return;

          isSnapping = true;
          isVideoSnappingRef.current = true;
          snapArmed = false;
          videoSettledRef.current = false;
          snapTween?.kill();
          textRevealTween?.kill();
          filmEnterTl?.pause(0);
          applyCreativityLetterReveal(0);

          // Fresh end bounds once, then keep them for the whole travel.
          syncVideoBounds(true, false);

          const fromY = window.scrollY || window.pageYOffset || 0;
          const toY = Math.max(
            0,
            (window.scrollY || window.pageYOffset || 0) + film.getBoundingClientRect().top
          );
          const distance = Math.max(toY - fromY, 1);
          const proxy = { y: fromY };

          applyScrollLinkedVideo(0);

          snapTween = gsap.to(proxy, {
            y: toY,
            duration: VIDEO_SNAP_DURATION,
            ease: VIDEO_SNAP_EASE,
            overwrite: true,
            onUpdate: () => {
              window.scrollTo(0, proxy.y);
              applyScrollLinkedVideo((proxy.y - fromY) / distance);
            },
            onComplete: () => {
              window.scrollTo(0, toY);
              settleVideoAtSlot();
              fitAll();
              isSnapping = false;
              isVideoSnappingRef.current = false;
              snapTween = null;
            },
          });
        };

        ScrollTrigger.create({
          id: "about-snap-to-film",
          trigger: heroSection,
          start: "top top",
          endTrigger: film,
          end: "top top",
          onUpdate: (self) => {
            if (self.direction === -1 && self.progress < 0.04) {
              snapArmed = true;
              videoSettledRef.current = false;
              isVideoSnappingRef.current = false;
              textRevealTween?.kill();
              filmEnterTl?.pause(0);
              gsap.set(introItems, { yPercent: 110 });
              gsap.set(disruptionItems, { yPercent: 110 });
              applyCreativityLetterReveal(0);
              return;
            }

            if (self.direction === 1 && self.progress > 0.015 && self.progress < 0.92) {
              snapToFilmSection();
            }
          },
        });
      }
    }, hero);

    const onResize = () => {
      fitAll();
      // Mobile: don't re-run desktop video/letter scrub (it can re-hide revealed text).
      if (isMobileViewport()) {
        ScrollTrigger.refresh();
        return;
      }
      syncVideoBounds(
        videoEntranceRef.current >= 1 || videoSettledRef.current,
        videoSettledRef.current
      );
      if (videoSettledRef.current) {
        applyVideoProgress(1, 1);
        applyHeroTextScroll(1);
        applyCreativityLetterReveal(1);
        applyLogoPosition(1, 1);
      } else {
        const scrollProgress =
          ScrollTrigger.getAll().find((st) => st.vars?.endTrigger === videoSlotRef.current)
            ?.progress ?? 0;
        applyVideoProgress(scrollProgress, videoEntranceRef.current);
        applyHeroTextScroll(scrollProgress);
        applyCreativityLetterReveal(mapVideoProgressToLetterReveal(scrollProgress));
        applyLogoPosition(1, scrollProgress);
      }
      if (spotlightStarted) startHeadlineSpotlight();
      ScrollTrigger.refresh();
    };

    hideHeadlineGold();
    fitAll();
    syncVideoBounds();
    requestAnimationFrame(() => {
      fitAll();
      syncVideoBounds();
    });
    window.addEventListener("resize", onResize);

    const resizeObserver =
      typeof ResizeObserver !== "undefined" &&
      new ResizeObserver(() => {
        fitAll();
      });

    if (headline?.parentElement && resizeObserver) {
      resizeObserver.observe(headline.parentElement);
    }
    if (disruption?.parentElement && resizeObserver) {
      resizeObserver.observe(disruption.parentElement);
    }

    return () => {
      if (heroEntranceFallback) window.clearTimeout(heroEntranceFallback);
      snapTween?.kill();
      textRevealTween?.kill();
      filmEnterTl?.kill();
      spotlightTween?.kill();
      if (metadataVideo && onVideoMetadata) {
        metadataVideo.removeEventListener("loadedmetadata", onVideoMetadata);
      }
      window.removeEventListener("resize", onResize);
      window.removeEventListener("header-reveal-complete", onHeaderComplete);
      resizeObserver?.disconnect();
      ctx.revert();
    };
  }, []);

  useEffect(() => {
    const getAllVideos = () => {
      const videos = Array.from(heroRef.current?.querySelectorAll("video") ?? []);
      const floatVideo = videoFloatRef.current?.querySelector("video");
      if (floatVideo && !videos.includes(floatVideo)) {
        videos.push(floatVideo);
      }
      return videos;
    };

    /** Only one video may carry audio - avoids double voice from duplicate <video> nodes. */
    const getAudioVideo = () => {
      const isMdUp = window.matchMedia("(min-width: 768px)").matches;
      const floatVideo = videoFloatRef.current?.querySelector("video");

      if (isMdUp) {
        return floatVideo ?? null;
      }

      // Mobile: hero video first (in hero section), not the creativity slot duplicate
      const heroSectionVideo = heroSectionRef.current?.querySelector("video");
      return heroSectionVideo ?? null;
    };

    const syncAudioRouting = (forceMuted = isMutedRef.current) => {
      const audioVideo = getAudioVideo();
      getAllVideos().forEach((video) => {
        const shouldPlaySound = !forceMuted && video === audioVideo;
        video.muted = !shouldPlaySound;
        if (shouldPlaySound) {
          video.volume = 1;
        }
        video.play().catch(() => {});
      });
    };

    const playHandlers = new Map();
    let unlockBound = false;

    const unlockSound = () => {
      if (isMutedRef.current) return;
      syncAudioRouting(false);
    };

    const bindUnlockListeners = () => {
      if (unlockBound || isMutedRef.current) return;
      unlockBound = true;
      const events = ["pointerdown", "click", "touchstart", "keydown"];
      events.forEach((eventName) => {
        document.addEventListener(eventName, unlockSound, { once: true, capture: true });
      });
    };

    const ensureAutoplay = async (video) => {
      const playVideo = () => {
        video.play().catch(() => {});
      };

      const audioVideo = getAudioVideo();
      const isAudioSource = video === audioVideo;

      video.volume = 1;
      // Non-audio duplicates must stay muted so voice never stacks.
      video.muted = !isAudioSource || isMutedRef.current;

      if (!isAudioSource) {
        playVideo();
        video.addEventListener("loadeddata", playVideo);
        video.addEventListener("canplay", playVideo);
        playHandlers.set(video, playVideo);
        return;
      }

      try {
        video.muted = false;
        await video.play();
      } catch {
        video.muted = true;
        playVideo();
        bindUnlockListeners();
      }

      video.addEventListener("loadeddata", playVideo);
      video.addEventListener("canplay", playVideo);
      playHandlers.set(video, playVideo);
    };

    getAllVideos().forEach((video) => {
      ensureAutoplay(video);
    });

    const onViewportChange = () => {
      syncAudioRouting(isMutedRef.current);
    };
    const mdMql = window.matchMedia("(min-width: 768px)");
    mdMql.addEventListener?.("change", onViewportChange);
    mdMql.addListener?.(onViewportChange);

    return () => {
      playHandlers.forEach((playVideo, video) => {
        video.removeEventListener("loadeddata", playVideo);
        video.removeEventListener("canplay", playVideo);
      });
      ["pointerdown", "click", "touchstart", "keydown"].forEach((eventName) => {
        document.removeEventListener(eventName, unlockSound, { capture: true });
      });
      mdMql.removeEventListener?.("change", onViewportChange);
      mdMql.removeListener?.(onViewportChange);
    };
  }, []);

  const toggleMute = () => {
    const nextMuted = !isMuted;
    const getAllVideos = () => {
      const videos = Array.from(heroRef.current?.querySelectorAll("video") ?? []);
      const floatVideo = videoFloatRef.current?.querySelector("video");
      if (floatVideo && !videos.includes(floatVideo)) {
        videos.push(floatVideo);
      }
      return videos;
    };

    const isMdUp = window.matchMedia("(min-width: 768px)").matches;
    const floatVideo = videoFloatRef.current?.querySelector("video");
    const audioVideo = isMdUp
      ? floatVideo
      : heroSectionRef.current?.querySelector("video");

    getAllVideos().forEach((video) => {
      const shouldPlaySound = !nextMuted && video === audioVideo;
      video.muted = !shouldPlaySound;
      if (shouldPlaySound) {
        video.volume = 1;
        video.play().catch(() => {});
      }
    });
    isMutedRef.current = nextMuted;
    setIsMuted(nextMuted);
  };

  return (
    <>
      <style>{`
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-medium-head.woff2") format("woff2");
          font-weight: 365;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-semi-bold-head.woff2") format("woff2");
          font-weight: 370;
          font-style: normal;
          font-display: swap;
        }
        @keyframes watchNowPulse {
          0%,
          100% {
            box-shadow: 0 8px 30px rgba(0, 0, 0, 0.25), 0 0 0 0 rgba(255, 255, 255, 0.45);
          }
          50% {
            box-shadow: 0 10px 34px rgba(0, 0, 0, 0.28), 0 0 0 10px rgba(255, 255, 255, 0);
          }
        }
        .watch-now-btn {
          animation: watchNowPulse 2.4s ease-in-out infinite;
        }
        .video-modal-backdrop {
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .video-modal-backdrop.is-visible {
          opacity: 1;
        }
        .video-modal-panel {
          transform: scale(0.35);
          opacity: 0;
          transition:
            transform 0.55s cubic-bezier(0.22, 1, 0.36, 1),
            opacity 0.4s ease;
        }
        .video-modal-panel.is-visible {
          transform: scale(1)
          opacity: 1;
        }
      `}</style>

      <div ref={heroRef} className="relative overflow-x-hidden">
      <section
        ref={heroSectionRef}
        className="relative flex min-h-[calc(100dvh-4.5rem)] flex-col overflow-x-hidden bg-[#0D1334] pt-35px pb-[60px] md:min-h-[85vh] lg:min-h-[94vh] xl:min-h-[93vh] md:pt-[30px] md:pb-[48px] xl:pb-[40px]"
      >
        <div
          ref={heroTextRef}
          className="relative z-40 mx-auto flex w-full max-w-8xl flex-col items-start px-8 text-left md:px-12"
        >
          <div className="relative w-full overflow-x-hidden">
            <h1
              ref={headlineRef}
              style={headingStyle}
              className="m-0 w-full max-w-full text-left text-[57px] leading-[60px] sm:text-[61px] sm:leading-[64px] md:text-[56px] md:leading-[58px] lg:text-[72px] lg:leading-[72px] xl:text-[94px] xl:leading-[94px]"
            >
              <div ref={headlineSpotlightWrapRef} className="relative w-full overflow-x-hidden">
                <div data-headline-primary className="relative z-[1]">
                  {/* Mobile line breaks */}
                  <div className="md:hidden">
                    <Reveal className="w-full overflow-x-visible overflow-y-hidden py-[2px]" clipYOnly>
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span data-headline-word>18</span>
                          <span data-headline-word>Years</span>
                          <span data-headline-word>of</span>
                        </span>
                      </span>
                    </Reveal>
                    <Reveal className="mt-[4px] w-full overflow-x-visible overflow-y-hidden py-[2px]" clipYOnly>
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClassMobileCenter}>
                          <span data-headline-word>Creating</span>
                        </span>
                      </span>
                    </Reveal>
                    <Reveal className="mt-[4px] w-full overflow-x-visible overflow-y-hidden py-[2px]" clipYOnly>
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span data-headline-word>Distinction</span>
                          <span data-headline-word>in</span>
                        </span>
                      </span>
                    </Reveal>
                    <Reveal className="mt-[4px] w-full overflow-x-visible overflow-y-hidden py-[2px]" clipYOnly>
                      <span className="flex w-full">
                        <span
                          data-headline-row
                          className={headlineRowClassAWorld}
                          style={{ gap: "18px", columnGap: "18px" }}
                        >
                          <span data-headline-word>a</span>
                          <span data-headline-word className="shrink-0">World</span>
                          <span data-headline-word>Full</span>
                        </span>
                      </span>
                    </Reveal>
                    <Reveal className="mt-[4px] w-full overflow-x-visible overflow-y-hidden py-[2px]" clipYOnly>
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span data-headline-word>of</span>
                          <span data-headline-word>Sameness</span>
                        </span>
                      </span>
                    </Reveal>
                  </div>

                  {/* Desktop - unchanged */}
                  <div className="hidden md:block">
                    <Reveal className="w-full overflow-hidden py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span data-headline-word>18</span>
                          <span data-headline-word>Years</span>
                          <span data-headline-word>of</span>
                          <span data-headline-word>Creating</span>
                        </span>
                      </span>
                    </Reveal>
                    <Reveal className="mt-[4px] w-full overflow-hidden py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClassDistinction}>
                          <span data-headline-word>Distinction</span>
                          <span data-headline-word>in</span>
                          <span data-headline-word>a</span>
                          <span data-headline-word className="shrink-0">World</span>
                        </span>
                      </span>
                    </Reveal>
                    <Reveal className="mt-[4px] w-full overflow-hidden py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span data-headline-word>Full</span>
                          <span data-headline-word>of</span>
                          <span data-headline-word>Sameness</span>
                        </span>
                      </span>
                    </Reveal>
                  </div>
                </div>
                <div
                  ref={headlineGoldRef}
                  className="pointer-events-none absolute inset-0 z-[2] overflow-hidden text-left"
                  style={{
                    ...headingStyle,
                    color: goldColor,
                    opacity: 0,
                    WebkitMaskImage:
                      "radial-gradient(circle 0px at -9999px -9999px, #000 0%, transparent 0%)",
                    maskImage:
                      "radial-gradient(circle 0px at -9999px -9999px, #000 0%, transparent 0%)",
                  }}
                  aria-hidden
                >
                  <div className="md:hidden">
                    <div className="w-full py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span>18</span>
                          <span>Years</span>
                          <span>of</span>
                        </span>
                      </span>
                    </div>
                    <div className="mt-[4px] w-full py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClassMobileCenter}>
                          <span>Creating</span>
                        </span>
                      </span>
                    </div>
                    <div className="mt-[4px] w-full py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span>Distinction</span>
                          <span>in</span>
                        </span>
                      </span>
                    </div>
                    <div className="mt-[4px] w-full py-[2px]">
                      <span className="flex w-full">
                        <span
                          data-headline-row
                          className={headlineRowClassAWorld}
                          style={{ gap: "18px", columnGap: "18px" }}
                        >
                          <span>a</span>
                          <span className="shrink-0">World</span>
                          <span>Full</span>
                        </span>
                      </span>
                    </div>
                    <div className="mt-[4px] w-full py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span>of</span>
                          <span>Sameness</span>
                        </span>
                      </span>
                    </div>
                  </div>
                  <div className="hidden md:block">
                    <div className="w-full py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span>18</span>
                          <span>Years</span>
                          <span>of</span>
                          <span>Creating</span>
                        </span>
                      </span>
                    </div>
                    <div className="mt-[4px] w-full py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClassDistinction}>
                          <span>Distinction</span>
                          <span>in</span>
                          <span>a</span>
                          <span className="shrink-0">World</span>
                        </span>
                      </span>
                    </div>
                    <div className="mt-[4px] w-full py-[2px]">
                      <span className="flex w-full">
                        <span data-headline-row className={headlineRowClass}>
                          <span>Full</span>
                          <span>of</span>
                          <span>Sameness</span>
                        </span>
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </h1>
          </div>

          <div className={`${montserrat.className} relative z-40 mx-auto mt-8 w-full max-w-[1000px] text-center md:mt-5 lg:mt-5 xl:mt-5`}>
            <Reveal group="sub">
              <p className="m-0 text-[20px] font-[300] italic leading-[25px] text-white md:text-[18px] md:leading-[20px] lg:text-[22px] xl:text-[28px] lg:leading-[36px]">
              Built on hustle. Driven by heart. Powered by ideas 
              </p>
            </Reveal>
            {/* <Reveal group="sub" className="mt-1">
              <p className="m-0 text-[20px] font-[300] italic leading-[25px] text-white md:text-[18px] md:leading-[20px] lg:text-[22px] xl:text-[28px] lg:leading-[36px]">
                by the belief that great ideas change the world
              </p>
            </Reveal> */}

            <div className="relative mt-14 w-full md:hidden"> 
              <video
                autoPlay
                loop
                muted
                playsInline
                className="block h-auto w-full"
                src="/about/video-about.mp4"
              />
              <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
                <img
                  src="/logo/r-rmw-transparent.png"
                  alt="Ritz Media World Logo"
                  title="Ritz Media World Logo"
                  className="block h-auto w-auto max-w-[60%] object-contain"
                  style={{
                    maxHeight: "calc(60vw * 1259 / 1048 - 160px)",
                    filter: "brightness(3.2) contrast(1.05)",
                    opacity: 0.4,
                  }}
                />
              </div>
              <VideoMuteButton isMuted={isMuted} onToggle={toggleMute} />
            </div>
          </div>
        </div>
      </section>

      <div
        ref={videoFloatRef}
        className="pointer-events-none absolute z-30 hidden max-w-[1044px] overflow-hidden rounded-[24px] bg-black shadow-[0_24px_60px_rgba(0,0,0,0.35)] will-change-[left,top,width,height] md:block"
        style={{ visibility: "hidden", width: "1044px" }}
      >
        <video
          autoPlay
          loop
          muted
          playsInline
          className="block h-full w-full origin-center object-cover"
          src="/about/video-about.mp4"
        />
        <VideoMuteButton isMuted={isMuted} onToggle={toggleMute} />
      </div>
      <div
        ref={logoFloatRef}
        data-about-hero-logo
        className="pointer-events-none absolute z-[35] hidden overflow-hidden md:block"
        style={{ visibility: "hidden" }}
      >
        <div data-logo-inner className="absolute inset-x-0 bottom-0 flex h-full items-end justify-center">
          <img
            src="/logo/r-rmw-transparent.png"
            alt="Ritz Media World Logo"
            title="Ritz Media World Logo"
            className="block h-full w-auto max-w-[85%] object-contain object-bottom"
            style={{
              filter: "brightness(3.2) contrast(1.05)",
              opacity: 0.4,
            }}
          />
        </div>
      </div>

      <section id="intro" ref={filmRef} className="relative overflow-x-hidden bg-[#FAFAFA] px-8 pb-0 pt-[35px] md:px-12 md:pb-0 md:pt-[70px] lg:py-16 lg:pt-20">
        <img
          src="/logo/r-logo-side.png"
          alt="Ritz Media World Logo"
          title="Ritz Media World Logo"
          aria-hidden
          className="pointer-events-none absolute -left-0 top-[50%] z-0 hidden h-[min(440px,50vh)] w-auto -translate-y-1/2 object-contain object-left lg:block lg:h-[min(360px,35vh)] xl:h-[min(520px,55vh)]"
        />
        <div className="relative z-10 mx-auto w-full max-w-[1400px]">
          {/* <Reveal className="absolute left-0 top-0 z-10">
            <img
              src="/about/ritz-logo.png"
              alt="Ritz Media World"
              className="h-[72px] w-auto object-contain md:h-[96px] lg:h-[110px]"
            />
          </Reveal> */}

          <div className="flex flex-col items-center text-center">
            <div className={`${montserrat.className} max-w-[850px]`}>
              <Reveal group="intro">
                <p className="m-0 text-[16px] font-[300] italic leading-[22px] text-[#1D1D1B] md:text-[22px] md:leading-[30px] lg:text-[36px] xl:text-[30px] lg:leading-[40px]">
                A leading independent agency network
                </p>
              </Reveal>
              <Reveal group="intro" className="mt-1">
                <p className="m-0 text-[16px] font-[300] italic leading-[22px] text-[#1D1D1B] md:text-[22px] md:leading-[30px] lg:text-[36px] xl:text-[30px] lg:leading-[40px]">
             
                </p>
              </Reveal>
            </div>

            <Reveal group="disruption" className="mt-6 md:mt-12 lg:mt-14 xl:mt-5">
              <p style={subHeadingStyle} className="m-0 max-md:leading-normal text-[25px] md:text-[48px] xl:text-[48px]">
              We Drive Growth Through
              </p>
            </Reveal>
          </div>
        </div>

        <div className="relative z-10 mt-8 flex w-full justify-center md:mt-10 lg:mt-12 xl:mt-5">
          <div ref={disruptionRef} className="flex w-full flex-col items-center text-center">
            <div data-disruption-mobile className="flex w-full flex-col items-center md:hidden">
              <Reveal group="disruption-word" clipYOnly className="overflow-x-visible">
                <span className="flex justify-center overflow-x-visible">
                  <span
                    data-headline-row
                    style={mobileDisruptionWordStyle}
                    className="inline-flex items-center justify-center gap-[14px]"
                  >
                    <Letter from="left">c</Letter>
                    <Letter from="left">R</Letter>
                    <Letter from="left">E</Letter>
                  </span>
                </span>
              </Reveal>

              <div className="relative my-4 w-full">
                <video
                  autoPlay
                  loop
                  muted
                  playsInline
                  className="block h-auto w-full"
                  src="/about/video-about.mp4"
                />
                <VideoMuteButton isMuted={isMuted} onToggle={toggleMute} />
              </div>

              <Reveal group="disruption-word" clipYOnly className="overflow-x-visible">
                <span className="flex justify-center overflow-x-visible">
                  <span
                    data-headline-row
                    style={mobileDisruptionWordStyle}
                    className="inline-flex items-center justify-center gap-[14px]"
                  >
                    <Letter from="right">A</Letter>
                    <Letter from="right">T</Letter>
                    <Letter from="right">I</Letter>
                  </span>
                </span>
              </Reveal>

              <Reveal group="disruption-word" clipYOnly className="mt-1 overflow-x-visible">
                <span className="flex justify-center overflow-x-visible">
                  <span
                    data-headline-row
                    style={mobileDisruptionWordStyle}
                    className="inline-flex items-center justify-center gap-[14px]"
                  >
                    <Letter from="left">V</Letter>
                    <Letter from="left">I</Letter>
                    <Letter from="right">T</Letter>
                    <Letter from="right">Y</Letter>
                  </span>
                </span>
              </Reveal>
            </div>

            <div data-disruption-desktop className="hidden w-full flex-col items-center md:flex">
            <Reveal group="disruption-word" clipYOnly className="overflow-x-visible">
              <span className="flex justify-center overflow-x-visible">
                <span
                  data-headline-row
                  style={disruptionWordStyle}
                  className="inline-flex items-center justify-center gap-[20px]"
                >
                  <Letter from="left">c</Letter>
                  <Letter from="left">R</Letter>
                  <Letter from="left">E</Letter>
                  <span className="inline-flex shrink-0 items-center ">
                    <span
                      ref={videoSlotRef}
                      aria-hidden
                      className="block h-[130px] w-[250px] opacity-0"
                    />
                  </span>
                  <Letter from="right">A</Letter>
                  <Letter from="right">T</Letter>
                  <Letter from="right">I</Letter>
                </span>
              </span>
            </Reveal>

            <Reveal group="disruption-word" clipYOnly className="mt-1 overflow-x-visible md:mt-2">
              <span className="flex justify-center overflow-x-visible">
                <span
                  data-headline-row
                  style={disruptionWordStyle}
                  className="inline-flex items-center justify-center gap-[20px]"
                >
                  <Letter from="left">V</Letter>
                  <Letter from="left">I</Letter>
                  <Letter from="right">T</Letter>
                  <Letter from="right">Y</Letter>
                </span>
              </span>
            </Reveal>
            </div>
          </div>
        </div>
      </section>
      </div>
    </>
  );
};

export default Section1;
