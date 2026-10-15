import React from "react";
import { getImageProps } from "next/image";
import { Montserrat } from "next/font/google";
import RevealOnScroll from "./RevealOnScroll";

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["400", "500"],
  display: "swap",
});

const eyebrowStyle = {
  fontFamily: "Montserrat, sans-serif",
  fontSize: "24px",
  fontWeight: 500,
  lineHeight: "normal",
  color: "rgba(51, 51, 51, 0.60)",
};

const bodyTextStyle = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 400,
  color: "#333333",
};

const bannerTitleStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 600,
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const Reveal = ({ children, index = 0, className = "" }) => (
  <span className={`block overflow-hidden py-[2px] ${className}`}>
    <span
      className="block w-full translate-y-[110%] transition-transform duration-[1100ms] ease-[cubic-bezier(0.23,1,0.32,1)] group-data-[revealed=true]:translate-y-0 motion-reduce:translate-y-0 motion-reduce:transition-none"
      style={{ transitionDelay: `${index * 100}ms` }}
    >
      {children}
    </span>
  </span>
);

const bannerImageClassName =
  "block h-full min-h-0 w-full object-cover object-center md:h-auto";

function IntroBannerImage({ image, sizes }) {
  const common = {
    alt: "Ritz Media World",
    title: "Ritz Media World",
    width: image.width,
    height: image.height,
    sizes,
    loading: "eager",
    fetchPriority: "high",
    className: bannerImageClassName,
  };

  const {
    props: { srcSet: desktopSrcSet, ...desktopProps },
  } = getImageProps({ ...common, src: image.src });

  if (!image.mobileSrc) {
    return <img {...desktopProps} srcSet={desktopSrcSet} />;
  }

  const {
    props: { srcSet: mobileSrcSet, ...mobileProps },
  } = getImageProps({ ...common, src: image.mobileSrc });

  return (
    <picture>
      <source media="(min-width: 768px)" srcSet={desktopSrcSet} sizes={sizes} />
      <img {...mobileProps} srcSet={mobileSrcSet} />
    </picture>
  );
}

const normalizeIntroImage = (image) =>
  typeof image === "string"
    ? { src: image, width: 1, height: 1, aspectRatio: "1 / 1" }
    : image;

const ServiceDetailIntro = ({ intro, title }) => {
  if (!intro) return null;

  const introImages = intro.images.map(normalizeIntroImage);
  const bannerSizes =
    introImages.length > 1 ? `(min-width: 640px) ${Math.round(100 / introImages.length)}vw, 100vw` : "100vw";
  const bodyParagraphs = Array.isArray(intro.body) ? intro.body : [intro.body];

  return (
    <section className="m-0 overflow-x-clip bg-[#F1F1F1] pt-0">
      <div className="flex w-full flex-col gap-5 sm:flex-row sm:items-start">
        {introImages.map((image, index) => {
          const bannerLabel = intro.bannerTitle ?? title;
          return (
            <div
              key={`${image.src}-${index}`}
              className="relative h-[550px] w-full min-w-0 overflow-hidden md:h-auto"
            >
              <IntroBannerImage image={image} sizes={bannerSizes} />
              <div
                className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/70 via-black/35 to-black/20"
                aria-hidden
              />
              {bannerLabel ? (
                <div className="absolute inset-0 flex items-center justify-center px-6 sm:px-10">
                  <p
                    className="m-0 text-center text-[32px] leading-[1.05] sm:text-[44px] md:text-[56px] lg:text-[72px] xl:text-[82px]"
                    style={bannerTitleStyle}
                  >
                    {bannerLabel}
                  </p>
                </div>
              ) : null}
            </div>
          );
        })}
      </div>

      <RevealOnScroll
        className={`${montserrat.className} mx-auto flex text-center w-full max-w-[1440px] items-center justify-center px-6 sm:px-10  md:px-[50px] py-[35px] md:py-[70px] `}
      >
        <div className="w-full">
          <Reveal>
            <p className="m-0 self-stretch uppercase" style={eyebrowStyle}>
              {intro.eyebrow}
            </p>
          </Reveal>

          <div className="mt-5 flex flex-col gap-10 md:mt-6 lg:flex-row lg:items-end lg:justify-between lg:gap-12 xl:gap-16">
            <Reveal index={1} className="min-w-0 flex-1 ">
              {bodyParagraphs.map((paragraph, index) => (
                <p
                  key={index}
                  className={`m-0 self-stretch  text-[22px] leading-[34px] sm:text-[28px] sm:leading-[44px] md:text-[22px] md:leading-[35px] xl:text-[36px] lg:text-[26px] xl:leading-[61px] lg:leading-[40px]${index > 0 ? " mt-5 md:mt-6" : ""}`}
                  style={bodyTextStyle}
                  dangerouslySetInnerHTML={{ __html: paragraph }}
                />
              ))}
            </Reveal>
          </div>
        </div>
      </RevealOnScroll>
    </section>
  );
};

export default ServiceDetailIntro;
