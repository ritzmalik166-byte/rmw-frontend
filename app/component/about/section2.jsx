"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Montserrat } from "next/font/google";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  display: "swap",
});
const deliverImages = [
  "/Deliver/growth.jpeg",
  "/Deliver/slidernew2.jpeg",
  "/Deliver/legacy.jpeg",
];

const headingStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#333333",
  textAlign: "center",
};

const sideCardLabelStyle = {
  fontWeight: 500,
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const StaggeredLabel = ({ lines, style, indentEm = 1.1, className = "" }) => (
  <div style={style} className={`m-0 ${className}`}>
    {lines.map((line, index) => (
      <span
        key={index}
        // className="block whitespace-nowrap"
        // style={{ paddingLeft: index === 0 ? 0 : `${index * indentEm}em` }}
      >
        {line}
      </span>
    ))}
  </div>
);

const cardLabelStyle = {
  fontWeight: 370,
  fontSize: "56px",
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const standOutStyle = {
  fontWeight: 600,
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const caseStudyStyle = {
  fontWeight: 600,
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF99",
};

const caseStudyLabelStyle = {
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const StandOutText = ({ parts }) => (
  <p style={standOutStyle} className="m-0 whitespace-nowrap text-[32px] leading-[34px] md:text-[32px] md:leading-[34px] lg:text-[32px] lg:leading-[34px] xl:text-[56px] xl:leading-[60px]">
    <span style={{ display: "block" }}>
      {parts[0]}
      {parts[1] != null && (
        <>
          <br />
          <span style={{ display: "block", paddingLeft: "1.1em" }}>{parts[1]}</span>
        </>
      )}
    </span>
    {parts[2] != null && <span style={{ display: "block" }}>{parts[2]}</span>}
  </p>
);

const deliverCards = [
  { label: "Growth", parts: ["gr", "ow", "th"] },
  { label: "influence", parts: ["infl", "ue", "nce"], showCaseStudy: true },
  { label: "legacy", parts: ["leg", "ac", "y"] },
];

const CaseStudyBlock = () => (
  <div className="flex flex-col items-start lg:gap-4 md:gap-2">
    {/* <p style={caseStudyStyle} className="m-0 text-left text-[14px] leading-[18px] md:text-[14px] md:leading-[18px] lg:text-[14px] lg:leading-[18px] xl:text-[24px] xl:leading-[30px]">
      How Toblerone
      <br />
      Supercharged Brand
      <br />
      Recall By <span style={{ color: "#FFFFFF" }}>29%</span>
    </p> */}
    <div className="flex cursor-pointer items-center gap-3">
      {/* <span style={caseStudyLabelStyle} className="m-0 text-[14px] md:text-[14px] lg:text-[14px] xl:text-[18px]">
        Case Study
      </span>
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#F5A623]">
        <span className="ml-0.5 block h-0 w-0 border-y-[6px] border-l-[10px] border-y-transparent border-l-white" />
      </span> */}
    </div>
  </div>
);

const getDesktopCardFlex = (index, hoveredIndex, activeIndex) => {
  if (hoveredIndex !== null) {
    if (index === hoveredIndex) {
      return { flexGrow: 2.2, flexShrink: 1, flexBasis: 0, maxWidth: "none", minWidth: 0 };
    }
    return { flexGrow: 0.85, flexShrink: 1, flexBasis: 0, maxWidth: "none", minWidth: 0 };
  }
  if (index === activeIndex) {
    return { flexGrow: 2, flexShrink: 1, flexBasis: 0, maxWidth: "none", minWidth: 0 };
  }
  return { flexGrow: 0, flexShrink: 0, flexBasis: "22%", maxWidth: "282px", minWidth: 0 };
};

const CardContent = ({ card, isActive, cardIndex }) => (
  <div className="relative w-full">
    <div
      className={`origin-bottom-left transition-all duration-300 ease-out ${
        isActive
          ? "pointer-events-none absolute bottom-0 left-0 opacity-0 translate-y-3"
          : "opacity-100 translate-y-0"
      }`}
    >
      <StaggeredLabel
        lines={[card.label]}
        style={sideCardLabelStyle}
        className="text-[18px] md:text-[18px] lg:text-[18px] xl:text-[28px]"
      />
    </div>

    {isActive && (
      <div className="w-full pl-5 max-md:pl-9 md:pl-3 lg:pl-5 xl:pl-7">
        {card.showCaseStudy ? (
          <div className="flex w-full flex-col items-start gap-4 max-md:gap-6 md:flex-row md:items-end md:justify-between md:gap-6">
            <div key={`text-${cardIndex}`} className="deliver-card-text-enter">
              <StandOutText parts={card.parts} />
            </div>
            <div key={`case-${cardIndex}`} className="deliver-card-case-enter">
              <CaseStudyBlock />
            </div>
          </div>
        ) : (
          <div key={`text-${cardIndex}`} className="deliver-card-text-enter">
            <StandOutText parts={card.parts} />
          </div>
        )}
      </div>
    )}
  </div>
);

const DeliverCard = ({ imageSrc, isActive, cardIndex, hoveredIndex, activeIndex, onMouseEnter, onClick, children }) => (
  <div
    onMouseEnter={onMouseEnter}
    onClick={onClick}
    style={getDesktopCardFlex(cardIndex, hoveredIndex, activeIndex)}
    className={`deliver-card relative w-full min-w-0 cursor-pointer overflow-hidden rounded-[10px] ${
      isActive ? "deliver-card-active-mobile" : "deliver-card-inactive-mobile"
    } max-md:w-full md:h-[380px] md:min-w-0 md:rounded-none lg:h-[420px] lg:rounded-[16px] xl:h-[640px]`}
  >
    <Image
      src={imageSrc}
      alt="Ritz Media World Logo"
      title="Ritz Media World Logo"
      width={878}
      height={768}
      className="absolute inset-0 h-full w-full object-cover object-center max-md:rounded-[10px]"
      sizes="(min-width: 1280px) 40vw, 100vw"
    />
    <div className="absolute inset-0 bg-black/15" />
    {children}
  </div>
);

const Section2 = () => {
  const [activeIndex, setActiveIndex] = useState(1);
  const [hoveredIndex, setHoveredIndex] = useState(null);

  return (
    <>
      <style>{`
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-semi-bold-body.woff2") format("woff2");
          font-weight: 300;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-semi-bold-body.woff2") format("woff2");
          font-weight: 320;
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
        @keyframes deliver-text-in {
          from {
            opacity: 0;
            transform: translate(-12px, 36px) scale(0.72);
          }
          to {
            opacity: 1;
            transform: translate(0, 0) scale(1);
          }
        }
        @keyframes deliver-case-in {
          from {
            opacity: 0;
            transform: translate(20px, 48px);
          }
          to {
            opacity: 1;
            transform: translate(0, 0);
          }
        }
        .deliver-card-text-enter {
          transform-origin: left bottom;
          animation: deliver-text-in 0.6s cubic-bezier(0.22, 1, 0.36, 1) forwards;
        }
        .deliver-card-case-enter {
          transform-origin: right bottom;
          animation: deliver-case-in 0.65s cubic-bezier(0.22, 1, 0.36, 1) 0.12s forwards;
          opacity: 0;
        }
        @media (min-width: 768px) {
          .deliver-card {
            transition:
              flex-grow 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              flex-shrink 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              flex-basis 0.55s cubic-bezier(0.22, 1, 0.36, 1),
              max-width 0.55s cubic-bezier(0.22, 1, 0.36, 1);
          }
        }
        @media (max-width: 767px) {
          .deliver-card {
            transition:
              height 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              width 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              margin-left 0.6s cubic-bezier(0.22, 1, 0.36, 1),
              margin-right 0.6s cubic-bezier(0.22, 1, 0.36, 1);
            flex: none !important;
            max-width: none !important;
            flex-grow: unset !important;
            flex-shrink: unset !important;
            flex-basis: auto !important;
            overflow: hidden !important;
            border-radius: 10px !important;
          }
          .deliver-card-inactive-mobile {
            height: 88px;
            width: 100%;
            margin-left: 0;
            margin-right: 0;
          }
          .deliver-card-active-mobile {
            height: calc(100vw * 768 / 878);
            width: calc(100% + 4rem);
            margin-left: -2rem;
            margin-right: -2rem;
          }
        }
      `}</style>

      <section className="bg-[#FAFAFA] pb-[35px] md:pb-[70px]">
        <div className="mx-auto w-full max-w-8xl px-8 md:px-12 md:pt-0 py-[35px]">
          <h2 style={headingStyle} className="m-0 text-[30px] md:text-[48px]">
            What we Deliver
          </h2>

          <div className="mt-5 w-full overflow-hidden md:mt-6 lg:mt-8 xl:mt-14">
            <div
              className="flex w-full flex-col gap-3 md:flex-row md:items-stretch md:gap-4"
              onMouseLeave={() => {
                setHoveredIndex(null);
                setActiveIndex(1);
              }}
            >
              {deliverCards.map((card, index) => (
                <DeliverCard
                  key={card.label}
                  imageSrc={deliverImages[index]}
                  cardIndex={index}
                  hoveredIndex={hoveredIndex}
                  activeIndex={activeIndex}
                  isActive={activeIndex === index}
                  onMouseEnter={() => {
                    setHoveredIndex(index);
                    setActiveIndex(index);
                  }}
                  onClick={() => setActiveIndex(index)}
                >
                  <div
                    className={`${montserrat.className} absolute inset-0 flex flex-col justify-end p-2 md:p-4 lg:p-8 ${
                      activeIndex === index ? "max-md:pl-1 max-md:pr-3" : ""
                    }`}
                  >
                    <CardContent
                      card={card}
                      isActive={activeIndex === index}
                      cardIndex={index}
                    />
                  </div>
                </DeliverCard>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Section2;
