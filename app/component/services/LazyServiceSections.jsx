"use client";

import dynamic from "next/dynamic";

// GSAP-heavy sections that only some service pages render. Loading them through
// a client-side dynamic import keeps GSAP out of the bundle for the other pages.
export const ServicesHero = dynamic(() => import("./ServicesHero"));
export const ServiceDetailFourGallery = dynamic(() =>
  import("./ServiceDetailFourGallery")
);
