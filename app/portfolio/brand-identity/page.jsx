import React from "react";
import Header from "@/app/component/social-media/Header";
import Hero from "@/app/component/social-media/Hero"; 
import Section3 from "@/app/component/social-media/Section3";
import Section4 from "@/app/component/social-media/Section4";
import Section5 from "@/app/component/social-media/Section5";
import Section6 from "@/app/component/social-media/Section6";
import Section8 from "@/app/component/social-media/Section8";
import Section10 from "@/app/component/social-media/Section10";
import DynamicSlider from "@/app/component/social-media/DynamicSlider";
import Section2 from "@/app/component/work/portfolio/Section2";
import SeoHeadings from "@/app/component/work/portfolio/SeoHeadings";
/** Webflow Editor's Note Light custom font stack */
const editorsNoteLight =
  "wfont_e6fa52_d03d36fc891b44ea946b083dc8504aac, wf_d03d36fc891b44ea946b083dc, orig_editors_note_light, serif";

const logos_images = [
  "/portfolio-page/logo/logo_i1.jpg",
  "/portfolio-page/logo/logo_i2.jpg",
  "/portfolio-page/logo/logo_i3.jpg",
  "/portfolio-page/logo/logo_i4.jpg",
  "/portfolio-page/logo/logo_i5.jpg",
  "/portfolio-page/logo/logo_i6.jpg",
  "/portfolio-page/logo/logo_i7.jpg",
  "/portfolio-page/logo/logo_i9.jpg",
  "/portfolio-page/logo/logo_i10.jpg",
  "/portfolio-page/logo/logo_i11.jpg",
  "/portfolio-page/logo/logo_i12.jpg",
];
export const metadata = {
  title: "Brand Identity Design Agency in India | Ritz Media World",
  description: "Ritz Media World is a brand identity design agency in India offering logo design, visual identity and complete branding solutions for businesses.",
  alternates: {
    canonical: "https://ritzmediaworld.com/portfolio/brand-identity",
  },
};

function page() {
  return (
    <main style={{ fontFamily: editorsNoteLight }}>
      <Header title="Brand Identity Design Agency" />
      <Hero title="Crafting identities & shaping stories
with Custom Logo Design" />
      <DynamicSlider heading="Brand Identity" images={logos_images}/>
      {/* <Section3 /> */}
      {/* <Section4 /> */}
      {/* <Section5 /> */}
      {/* <Section6 /> */}
      {/* <Section8 /> */}
      <Section2 />
      <Section10 />
      <SeoHeadings />
    </main>
  );
}

export default page;
