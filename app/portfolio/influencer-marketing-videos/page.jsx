import React from "react";
import Header from "@/app/component/social-media/Header";
import Hero from "@/app/component/social-media/Hero";
import Section10 from "@/app/component/social-media/Section10";
import DynamicSlider3 from "@/app/component/social-media/DynamicSlider3";
import Section2 from "@/app/component/work/portfolio/Section2";

const editorsNoteLight =
  "wfont_e6fa52_d03d36fc891b44ea946b083dc8504aac, wf_d03d36fc891b44ea946b083dc, orig_editors_note_light, serif";

const influencer_marketing_videos = [
  {
    video: "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%201%20(1).mp4",
    label: "Influencer Marketing Video 1 - Ritz Media World",
  },
  {
    video: "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%202%20(1).mp4",
    label: "Influencer Marketing Video 2 - Ritz Media World",
  },
  {
    video: "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%203%20(1).mp4",
    label: "Influencer Marketing Video 3 - Ritz Media World",
  },
  {
    video: "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%204%20(1).mp4",
    label: "Influencer Marketing Video 4 - Ritz Media World",
  },
  {
    video: "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%2010%20(1).mp4",
    label: "Influencer Marketing Video 5 - Ritz Media World",
  },
  {
    video: "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%209%20(1).mp4",
    label: "Influencer Marketing Video 6 - Ritz Media World",
  },
  {
    video: "https://otherassets.blob.core.windows.net/rmw/644Px%20X%20621Px%20-%207.mp4",
    label: "Influencer Marketing Video 7 - Ritz Media World",
  },
  {
    video: "https://contenaissance.blob.core.windows.net/ct-assets/644Px%20X%20621Px%20-%203%20(1).mp4",
    label: "Influencer Marketing Video 8 - Ritz Media World",
  },
];

export const metadata = {
  title: "Influencer Marketing Videos | Ritz Media World",
  description:
    "Explore Ritz Media World’s influencer marketing videos, blending creative storytelling, real voices and engaging content to make brands stand out.",
  alternates: {
    canonical:
      "https://ritzmediaworld.com/portfolio/influencer-marketing-videos",
  },
};

function page() {
  return (
    <main style={{ fontFamily: editorsNoteLight }}>
      <Header title="Influencer Marketing Videos" />
      <Hero title="Authentic content that naturally integrates your brand into the creator’s voice." />
      <DynamicSlider3 heading="Influencer Marketing Videos" images={influencer_marketing_videos}/>
      <Section2 />
      <Section10 />
      <div
  style={{
    position: "absolute",
    width: "1px",
    height: "1px",
    padding: 0,
    margin: "-1px",
    overflow: "hidden",
    clip: "rect(0, 0, 0, 0)",
    whiteSpace: "nowrap",
    border: 0,
  }}
>
  <h2>Influencer Marketing Videos</h2>
  <h2>Influencer Marketing That Feels Authentic</h2>
  <h2>Our Influencer Marketing Work</h2>
  <h2>Creative Videos That Connect With Audiences</h2>
  <h2>Why Choose Influencer Marketing?</h2>
  <h2>Let’s Create Something People Remember</h2>
</div>
    </main>
  );
}

export default page;
