import React from "react";
import Header from "@/app/component/social-media/Header";
import Hero from "@/app/component/social-media/Hero";
import Section10 from "@/app/component/social-media/Section10";
import DynamicSlider from "@/app/component/social-media/DynamicSlider";
import SeoWalkThroughHeadings from "@/app/component/social-media/SeoWalkThroughHeadings";

import Section2 from "@/app/component/work/portfolio/Section2";


const editorsNoteLight =
  "wfont_e6fa52_d03d36fc891b44ea946b083dc8504aac, wf_d03d36fc891b44ea946b083dc, orig_editors_note_light, serif";

const walkthrough_images = [
  {
    src: "/walkthrough/Walkthrougg-image-1.jpg",
    label: "Walkthrough 1",
    href: "https://youtu.be/LMz36aAXPus",
  },
  {
    src: "/walkthrough/walkthrough-image-2.jpg", // edelistine
    label: "Walkthrough 2",
    href: "https://youtu.be/M6Dm4SiqSsc?si=gXfwXLS4fPmrt0H8",
  },
  {
    src: "/walkthrough/walkthrough-image-3.jpg",
    label: "Walkthrough 3",
    href: "https://www.youtube.com/watch?v=XRYVFJ5u_2g",
  },
  {
    src: "/walkthrough/walkthrough-image-4.jpg",
    label: "Walkthrough 4",
    href: "https://youtu.be/pbXiujM1QjM?si=SnxvG4Pyyzi-f8MU",
  },
  {
    src: "/walkthrough/walkthrought-image-5.jpg",
    label: "Walkthrough 5",
    href: "https://youtu.be/T8GtiRWPvKM?si=6oYUD5l0nEvBeuFT",
  },
  {
    src: "/walkthrough/walk-throught-6.jpg",
    label: "Walkthrough 6",
    href: "https://youtu.be/ukRR5iNZv4I?si=hVwZjvApiZGmJZZr",
  },

  // {
  //   src: "/walkthrough/aik-baar-phir.jpg",
  //   label: "Walkthrough 7",
  //   href: "https://youtu.be/gomdRsSkmz8",
  // },
  {
    src: "/walkthrough/maza-nahi-aaya.jpg",
    label: "Walkthrough 8",
    href: "https://youtu.be/xrhEXyUfBVM",
  },
  {
    src: "/walkthrough/gulshan.jpg",
    label: "Walkthrough 9",
    href: "https://youtu.be/hnG-LjQYP5k",
  },
  {
    src: "/walkthrough/northwind.jpg",
    label: "Walkthrough 10",
    href: "https://youtu.be/TjveWflbrkM",
  },
  {
    src: "/walkthrough/vedvan-nature.jpg",
    label: "Walkthrough 11",
    href: "https://youtu.be/ub6D5lHq6DU",
  },
  
];

export const metadata = {
  title: "Walk-Through Video Production Services | Ritz Media World",
  description:
    "Bring spaces and ideas to life with professional walk-through videos for real estate, interiors and architecture. Explore our video production services.",
  alternates: {
    canonical: "https://ritzmediaworld.com/portfolio/walk-through-videos",
  },
};

function page() {
  return (
    <main style={{ fontFamily: editorsNoteLight }}>
      <Header title="Walk-Through Videos" />
      <Hero
        title="Bringing stories to motion & ideas to screen<br />with AI-Powered Video Creation"
        titleAs="p"
      />
      <DynamicSlider
        heading="Walk-Through Videos"
        images={walkthrough_images}
        headingAs="p"
      />
      <Section2 headingAs="p" />
      <Section10 headingAs="p" />
      <SeoWalkThroughHeadings />
    </main>
  );
}

export default page;
