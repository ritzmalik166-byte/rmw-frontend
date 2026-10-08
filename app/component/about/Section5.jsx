"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import Image from "next/image";
import { League_Spartan, Montserrat } from "next/font/google";

const leagueSpartan = League_Spartan({
  subsets: ["latin"],
  weight: ["600"],
  display: "swap",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const AUTOPLAY_MS = 3000;

const awards = [
  {
    year: "2024",
    image: "/award/awardsecion1.jpeg",
    description: "Danik Jagran गौरव रत्न Award",
  },
  {
    year: "2021",
    image: "/award/awardnew.jpeg",
    description: "ET Excellence Leadership Award",
  },
  {
    year: "2025",
    image: "/award/awardsection3.jpeg",
    description: "ET Young Industry Leaders Award",
  },
  {
    year: "2024",
    image: "/award/awardnew1.jpeg",
    description: "Excellence in Digital Media – Hindustan Times",
  },
  {
    year: "2025",
    image: "/award/awardsecion6.jpeg",
    description: "Best Real Estate Podcast In India - HT Smartcast Podmasters Awards 2025",
  },
  {
    year: "2025",
    image: "/award/awardsecion7.jpeg",
    description: "Most Trusted Advertising Agency in Delhi/NCR – The Economic Times",
  },
  {
    year: "2025",
    image: "/award/awardnew2.jpeg",
    description: "Best Creative Agency (Real Estate) in Delhi/NCR By Big FM",
  },
];

const Section5 = () => {
  const [active, setActive] = useState(Math.floor(awards.length / 2));
  const [dragging, setDragging] = useState(false);
  const dragStart = useRef(null);
  const timerRef = useRef(null);
  const total = awards.length;

  const go = useCallback(
    (dir) => {
      setActive((a) => (a + dir + total) % total);
    },
    [total]
  );

  const resetTimer = useCallback(() => {
    clearInterval(timerRef.current);
    timerRef.current = setInterval(() => go(1), AUTOPLAY_MS);
  }, [go]);

  useEffect(() => {
    timerRef.current = setInterval(() => go(1), AUTOPLAY_MS);
    return () => clearInterval(timerRef.current);
  }, [go]);

  const handleDragStart = (e) => {
    dragStart.current = e.touches ? e.touches[0].clientX : e.clientX;
    setDragging(true);
  };

  const handleDragEnd = (e) => {
    if (!dragging || dragStart.current === null) return;
    const endX = e.changedTouches ? e.changedTouches[0].clientX : e.clientX;
    const delta = endX - dragStart.current;
    if (Math.abs(delta) > 50) {
      go(delta < 0 ? 1 : -1);
      resetTimer();
    }
    setDragging(false);
    dragStart.current = null;
  };

  const getCardStyle = (i) => {
    const diff = (((i - active + total) % total) + total) % total;
    const normalized = diff > total / 2 ? diff - total : diff;

    if (normalized === 0) {
      return {
        transform: "translateX(0%) rotateY(0deg) scale(1)",
        zIndex: 10,
        opacity: 1,
        filter: "brightness(1)",
        pointerEvents: "auto",
      };
    }
    if (normalized === 1 || normalized === -1) {
      const side = normalized > 0 ? 1 : -1;
      return {
        transform: `translateX(${side * 95}%) rotateY(${side * 35}deg) scale(0.72)`,
        zIndex: 5,
        opacity: 1,
        filter: "brightness(0.6)",
        pointerEvents: "auto",
      };
    }
    return {
      transform: "translateX(0%) scale(0.4)",
      zIndex: 1,
      opacity: 0,
      pointerEvents: "none",
    };
  };

  return (
    <>
      <section className="relative overflow-hidden bg-[#0D1334] px-8 py-[35px] md:px-12 md:py-[70px]">
        <div
          className="pointer-events-none absolute left-1/2 top-[35%] h-[420px] w-[420px] -translate-x-1/2 rounded-full opacity-25 blur-[120px]"
          style={{ background: "rgba(31, 39, 90, 0.8)" }}
        />

        <div className="relative mx-auto w-full max-w-[1400px]">
          <h2
            className={`${leagueSpartan.className} m-0 text-center text-[30px] font-semibold uppercase leading-[100%] tracking-[0] text-white md:text-[60px] lg:text-[86px]`}
          >
            HONOURS &amp; RECOGNITION
          </h2>

          <div
            className="relative mx-auto mt-12 w-full max-w-[700px] md:mt-16"
            style={{ perspective: "1200px", height: "420px" }}
          >
            <div
              className="relative h-full w-full"
              style={{
                cursor: dragging ? "grabbing" : "grab",
                transformStyle: "preserve-3d",
              }}
              onMouseDown={handleDragStart}
              onMouseUp={handleDragEnd}
              onMouseLeave={() => {
                setDragging(false);
                dragStart.current = null;
              }}
              onTouchStart={handleDragStart}
              onTouchEnd={handleDragEnd}
            >
              {awards.map((award, i) => {
                const style = getCardStyle(i);
                const isActive = i === active;

                return (
                  <article
                    key={`${award.image}-${i}`}
                    onClick={() => {
                      if (!isActive) {
                        const diff = (((i - active + total) % total) + total) % total;
                        const normalized = diff > total / 2 ? diff - total : diff;
                        go(normalized);
                        resetTimer();
                      }
                    }}
                    className="flex flex-col rounded-[20px] border border-[#1F275A] bg-[#11173D] px-6 pb-8 pt-6 md:px-8"
                    style={{
                      position: "absolute",
                      left: "50%",
                      top: "50%",
                      width: "min(88vw, 320px)",
                      height: "400px",
                      marginLeft: "calc(min(88vw, 320px) / -2)",
                      marginTop: -200,
                      overflow: "hidden",
                      transition:
                        "transform 0.65s cubic-bezier(0.25,0.46,0.45,0.94), opacity 0.65s ease, filter 0.65s ease, box-shadow 0.65s ease",
                      ...style,
                      boxShadow: isActive
                        ? "0 0 60px rgba(31, 39, 90, 0.6), 0 20px 60px rgba(0,0,0,0.5)"
                        : "0 10px 40px rgba(0,0,0,0.45)",
                      cursor: isActive ? "grab" : "pointer",
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <span
                        className={`${montserrat.className} text-[16px] font-medium leading-none text-white md:text-[18px]`}
                      >
                        {award.year}
                      </span>
                      <button
                        type="button"
                        aria-label="View award details"
                        className="flex h-9 w-9 items-center justify-center rounded-full border border-white/30 text-white"
                      >
                        <i className="ri-add-line text-[20px] leading-none" aria-hidden />
                      </button>
                    </div>

                    <div className="relative mx-auto my-auto flex w-full flex-1 items-center justify-center py-4">
                      <Image
                        src={award.image}
                        alt={award.description}
                        title={award.description}
                        width={260}
                        height={260}
                        className="max-h-[200px] w-auto object-contain md:max-h-[220px]"
                      />
                    </div>

                    <p
                      className={`${montserrat.className} m-0 text-center text-[16px] font-medium leading-[28px] tracking-[0] text-white md:text-[18px]`}
                    >
                      {award.description}
                    </p>
                  </article>
                );
              })}
            </div>
          </div>

          <div className="mt-8 flex justify-center gap-2">
            {awards.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to award ${i + 1}`}
                onClick={() => {
                  setActive(i);
                  resetTimer();
                }}
                className="h-2 rounded-full border-0 p-0 transition-all duration-400 ease-out"
                style={{
                  width: i === active ? 28 : 8,
                  background: i === active ? "#ffffff" : "rgba(255,255,255,0.25)",
                }}
              />
            ))}
          </div>
        </div>
      </section>
    </>
  );
};

export default Section5;
