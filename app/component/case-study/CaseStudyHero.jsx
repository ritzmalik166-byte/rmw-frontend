"use client";

import React, { useLayoutEffect, useRef } from "react";
import gsap from "gsap";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300"],
  style: ["italic"],
  display: "swap",
});

const goldColor = "#FFD188";
const circleSpotlightDuration = 15;

const headingStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 500,
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const Reveal = ({ children, className = "", group = "headline", clipYOnly = false }) => (
  <span
    className={`block ${clipYOnly ? "overflow-x-visible overflow-y-hidden" : "overflow-hidden"} ${className}`}
  >
    <span data-cs-reveal={group} className="block w-full will-change-transform">
      {children}
    </span>
  </span>
);

const headlineRowClass =
  "inline-flex max-w-full flex-wrap items-center justify-center gap-x-[clamp(20px,6vw,140px)] gap-y-2";
const headlineRowClassWide =
  "inline-flex max-w-full flex-wrap items-center justify-center gap-x-[clamp(18px,5.5vw,180px)] gap-y-2";

const subtextRowClass =
  "inline-flex max-w-full flex-wrap items-center justify-center gap-x-[clamp(12px,2.5vw,48px)] gap-y-2";

// const subtextLines = [
//   ["Fuelled by a magnetic culture of hustle and heart,", "backed by the belief that"],
//   ["great ideas change the world."],
// ];

const CaseStudyHero = () => {
  const heroRef = useRef(null);
  const headlineRef = useRef(null);
  const headlineWrapRef = useRef(null);
  const headlineSpotlightWrapRef = useRef(null);
  const headlineGoldRef = useRef(null);
  const logoRef = useRef(null);

  useLayoutEffect(() => {
    const hero = heroRef.current;
    const headline = headlineRef.current;
    const headlineWrap = headlineWrapRef.current;
    if (!hero) return;

    const fitHeadline = () => {
      if (!headline || !headlineWrap) return;

      headline.style.transform = "none";
      const rows = headline.querySelectorAll("[data-headline-primary] [data-headline-row]");
      let needed = 0;
      rows.forEach((row) => {
        needed = Math.max(needed, row.scrollWidth, row.getBoundingClientRect().width);
      });

      const sectionStyles = window.getComputedStyle(hero);
      const horizontalPadding =
        parseFloat(sectionStyles.paddingLeft) + parseFloat(sectionStyles.paddingRight);
      const available = Math.min(window.innerWidth, headlineWrap.clientWidth) - horizontalPadding - 16;
      const scale = needed > 0 && available > 0 ? Math.min(1, available / needed) : 1;
      headline.style.transform = scale < 1 ? `scale(${scale})` : "none";
      headline.style.transformOrigin = "top center";
    };

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

      const mask = "radial-gradient(circle 0px at -9999px -9999px, transparent 100%, transparent 100%)";
      gold.style.maskImage = mask;
      gold.style.webkitMaskImage = mask;
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
        const mask = `radial-gradient(circle ${radius}px at ${x}px ${y}px, #000 98%, transparent 100%)`;
        gold.style.maskImage = mask;
        gold.style.webkitMaskImage = mask;
      };

      const speed = wrap.offsetWidth / circleSpotlightDuration;
      let maskVisible = true;
      const proxy = {
        x: rowWaypoints[0].start.x,
        y: rowWaypoints[0].start.y,
      };

      const showMask = () => {
        maskVisible = true;
        setMaskAt(proxy.x, proxy.y);
      };

      const hideMask = () => {
        maskVisible = false;
        hideHeadlineGold();
      };

      const tl = gsap.timeline({
        repeat: -1,
        onUpdate: () => {
          if (maskVisible) setMaskAt(proxy.x, proxy.y);
        },
      });

      rowWaypoints.forEach((row, rowIndex) => {
        if (rowIndex > 0) {
          tl.call(hideMask);
          tl.set(proxy, { x: row.start.x, y: row.start.y });
          tl.call(showMask);
        } else {
          tl.set(proxy, { x: row.start.x, y: row.start.y });
          tl.call(showMask);
        }

        const dist = Math.hypot(row.end.x - row.start.x, row.end.y - row.start.y);
        if (!dist) return;

        tl.to(proxy, {
          x: row.end.x,
          y: row.end.y,
          duration: dist / speed,
          ease: "none",
        });
      });

      tl.call(hideMask);
      tl.set(proxy, { x: rowWaypoints[0].start.x, y: rowWaypoints[0].start.y });

      spotlightTween = tl;
      spotlightStarted = true;
    };

    const ctx = gsap.context(() => {
      const headlineItems = gsap.utils.toArray("[data-cs-reveal='headline']", hero);
      const subItems = gsap.utils.toArray("[data-cs-reveal='sub']", hero);
      const fallItems = [...headlineItems, ...subItems];

      const getFallDistance = () => -(window.innerHeight * 0.35);
      const fallFrom = getFallDistance();

      gsap.set(fallItems, {
        y: fallFrom,
        opacity: 0,
        force3D: true,
      });

      if (logoRef.current) {
        gsap.set(logoRef.current, {
          opacity: 0,
          scale: 0.9,
          y: fallFrom,
          rotation: -12.441,
          transformOrigin: "50% 50%",
          force3D: true,
        });
      }

      let entrancePlayed = false;

      const playEntrance = () => {
        if (entrancePlayed) return;
        entrancePlayed = true;

        const tl = gsap.timeline({
          onComplete: () => {
            fitHeadline();
            startHeadlineSpotlight();
          },
        });

        if (logoRef.current) {
          tl.to(
            logoRef.current,
            {
              y: 0,
              opacity: 1,
              scale: 1,
              rotation: -12.441,
              duration: 2,
              ease: "power3.out",
              force3D: true,
            },
            0,
          );
        }

        headlineItems.forEach((item, index) => {
          tl.to(
            item,
            {
              y: 0,
              opacity: 1,
              duration: 2,
              ease: "power3.out",
              force3D: true,
            },
            index === 0 ? 0 : "-=1.65",
          );
        });

        subItems.forEach((item, index) => {
          tl.to(
            item,
            {
              y: 0,
              opacity: 1,
              duration: 2,
              ease: "power3.out",
              force3D: true,
            },
            index === 0 ? "-=1.55" : "-=1.65",
          );
        });
      };

      const onHeaderComplete = () => playEntrance();
      window.addEventListener("header-reveal-complete", onHeaderComplete);

      // Show text immediately - don't wait for full header finish
      requestAnimationFrame(() => playEntrance());

      fitHeadline();
      hideHeadlineGold();
      const onResize = () => {
        fitHeadline();
        if (spotlightStarted) startHeadlineSpotlight();
      };
      window.addEventListener("resize", onResize);
      window.addEventListener("load", fitHeadline);
      document.fonts?.ready?.then(() => requestAnimationFrame(fitHeadline));

      const resizeObserver =
        typeof ResizeObserver !== "undefined"
          ? new ResizeObserver(() => {
              fitHeadline();
              if (spotlightStarted) startHeadlineSpotlight();
            })
          : null;
      if (headlineWrap) resizeObserver?.observe(headlineWrap);

      return () => {
        window.removeEventListener("header-reveal-complete", onHeaderComplete);
        window.removeEventListener("resize", onResize);
        window.removeEventListener("load", fitHeadline);
        spotlightTween?.kill();
        resizeObserver?.disconnect();
      };
    }, hero);

    return () => ctx.revert();
  }, []);

  return (
    <section
      ref={heroRef}
      className="relative flex flex-col overflow-x-clip bg-[#0D1334] px-4 py-10 pt-6 sm:px-6 sm:py-12 md:px-10 md:py-14 lg:px-12 lg:py-16"
    >
      {/* <div className="pointer-events-none absolute bottom-6 left-1/2 z-[1] -translate-x-1/2 md:bottom-10 lg:bottom-12">
        <div
          ref={logoRef}
          aria-hidden
          style={{
            width: 282.186,
            height: 339,
            background: "rgba(255, 255, 255, 0.20)",
            WebkitMaskImage: "url(/logo/r-logo-new2.png)",
            maskImage: "url(/logo/r-logo-new2.png)",
            WebkitMaskSize: "contain",
            maskSize: "contain",
            WebkitMaskRepeat: "no-repeat",
            maskRepeat: "no-repeat",
            WebkitMaskPosition: "center",
            maskPosition: "center",
            transform: "rotate(-12.441deg)",
          }}
        />
      </div> */}

      <div className="relative z-10 mx-auto flex w-full max-w-[1200px] flex-1 flex-col items-center justify-center text-center">
        <div ref={headlineWrapRef} className="relative w-full overflow-x-visible px-1">
          <h1
            ref={headlineRef}
            style={headingStyle}
            className="m-0 mx-auto w-full max-w-full text-center text-[26px] leading-[0.95] md:text-[58px] lg:text-[84px] xl:text-[110px]"
          >
            <div ref={headlineSpotlightWrapRef} className="relative w-full overflow-x-visible">
              <div data-headline-primary className="relative z-[1]">
                <Reveal clipYOnly className="w-full">
                  <span className="flex w-full justify-center overflow-x-visible">
                    <span data-headline-row className={headlineRowClass}>
                      <span data-headline-word>A</span>
                      <span data-headline-word>HOME</span>
                      <span data-headline-word>FOR</span>
                    </span>
                  </span>
                </Reveal>
                <Reveal clipYOnly className="mt-1 w-full md:mt-8">
                  <span className="flex w-full justify-center overflow-x-visible">
                    <span data-headline-row className={headlineRowClassWide}>
                      <span data-headline-word>CURIOUS</span>
                      <span data-headline-word>MINDS</span>
                    </span>
                  </span>
                </Reveal>
              </div>
              <div
                ref={headlineGoldRef}
                className="pointer-events-none absolute inset-0 z-[2] text-center"
                style={{ ...headingStyle, color: goldColor }}
                aria-hidden
              >
                <div className="w-full">
                  <span className="flex w-full justify-center overflow-x-visible">
                    <span data-headline-row className={headlineRowClass}>
                      <span>A</span>
                      <span>HOME</span>
                      <span>FOR</span>
                    </span>
                  </span>
                </div>
                <div className="mt-1 w-full md:mt-8">
                  <span className="flex w-full justify-center overflow-x-visible">
                    <span data-headline-row className={headlineRowClassWide}>
                      <span>CURIOUS</span>
                      <span>MINDS</span>
                    </span>
                  </span>
                </div>
              </div>
            </div>
          </h1>
        </div>

        {/* <div className={`${montserrat.className} relative z-40 mt-8 max-w-[1000px] md:mt-0 lg:mt-0 xl:mt-5`}>
          {subtextLines.map((phrases, index) => (
            <Reveal key={phrases.join("-")} group="sub" clipYOnly className={index > 0 ? "mt-1" : ""}>
              <p className="m-0 text-[14px] font-[300] italic leading-[20px] text-white md:text-[20px] md:leading-[28px] lg:text-[28px] lg:leading-[36px]">
                <span className="flex w-full justify-center overflow-x-visible">
                  <span className={subtextRowClass}>
                    {phrases.map((phrase) => (
                      <span key={phrase}>{phrase}</span>
                    ))}
                  </span>
                </span>
              </p>
            </Reveal>
          ))}
        </div> */}
      </div>
    </section>
  );
};

export default CaseStudyHero;
