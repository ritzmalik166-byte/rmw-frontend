"use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { Montserrat } from "next/font/google";
import ServiceDetailMediaButton from "../services/ServiceDetailMediaButton";

gsap.registerPlugin(ScrollTrigger);

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

const headingStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 600,
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#333333",
};

const buttonStyle = {
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
};

const galleryImages = [
  { src: "/create/first-image.jpeg", width: 547, height: 806 },
  { src: "/create/second-image.jpeg", width: 376, height: 340 },
  { src: "/create/third-image.jpeg", width: 376, height: 340 },
  { src: "/create/fourth-image.jpeg", width: 773, height: 447 },
];

const GalleryImage = ({ src, alt = "", width, height, className = "", fill = false }) => (
  <div
    data-gallery-image
    className={`relative shrink-0 overflow-hidden rounded-[16px] ${className}`}
    style={
      fill
        ? { aspectRatio: `${width} / ${height}` }
        : { width: `${width}px`, height: `${height}px`, maxWidth: "100%" }
    }
  >
    <Image src={src} alt={alt} title={`Ritz Media World - ${alt}`} fill className="object-cover" sizes={fill ? "100vw" : `${width}px`} />
  </div>
);

const Section3 = () => {
  const sectionRef = useRef(null);

  useLayoutEffect(() => {
    const section = sectionRef.current;
    if (!section) return;

    const mobileGallery = section.querySelector("[data-gallery-mobile]");
    const desktopGallery = section.querySelector("[data-gallery-desktop]");
    const isDesktop = window.matchMedia("(min-width: 1024px)").matches;
    const scope = isDesktop ? desktopGallery : mobileGallery;
    const images = scope ? gsap.utils.toArray("[data-gallery-image]", scope) : [];
    if (!images.length) return;

    const ctx = gsap.context(() => {
      gsap.set(images, {
        opacity: 0,
        y: 56,
        scale: 0.96,
      });

      gsap.to(images, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 1,
        ease: "power3.out",
        stagger: 0.14,
        scrollTrigger: {
          trigger: scope,
          start: "top 78%",
          toggleActions: "play none none none",
        },
      });
    }, section);

    return () => ctx.revert();
  }, []);

  return (
    <>
      <style>{`
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-roman-body.woff2") format("woff2");
          font-weight: 310;
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
      `}</style>

      <section ref={sectionRef} className="bg-[#FAFAFA] pb-[35px] md:pb-[70px]">
        <div className="mx-auto w-full max-w-8xl px-8 md:px-12 lg:max-w-[1500px]">
          <h2
            style={headingStyle}
            className="m-0 text-center text-[30px] md:text-[48px] lg:text-[60px] xl:text-[86px]"
          >
            BUILD. BELIEVE. BECOME
          </h2>

          <div data-gallery-mobile className="mt-4 flex flex-col gap-4 md:mt-5 md:gap-5 lg:hidden">
            {galleryImages.map((image) => (
              <GalleryImage
                key={image.src}
                src={image.src}
                width={image.width}
                height={image.height}
                fill
                alt={`Ritz Media World - ${image.alt}`}
                className="w-full"
              />
            ))}
          </div>

          <div data-gallery-desktop className="mt-4 hidden flex-wrap justify-center gap-5 lg:mt-8 lg:flex xl:mt-14">
            <GalleryImage src="/create/first-image.jpeg" width={547} height={806} alt="Ritz Media World - First Image" />

            <div className="flex flex-col gap-5">
              <div className="flex flex-wrap justify-center gap-5">
                <GalleryImage src="/create/second-image.jpeg" width={376} height={340} alt="Ritz Media World - Second Image" />
                <GalleryImage src="/create/third-image.jpeg" width={376} height={340} alt="Ritz Media World - Third Image" />
              </div>
              <GalleryImage src="/create/fourth-image.jpeg" width={773} height={447} alt="Ritz Media World - Fourth Image" />
            </div>
          </div>

          <ServiceDetailMediaButton
            label="Load More Images"
            href="/gallery"
            className="mt-12 md:mt-14"
          />
        </div>
      </section>
    </>
  );
};

export default Section3;
