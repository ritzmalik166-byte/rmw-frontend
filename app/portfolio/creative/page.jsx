import React from "react";
import Header from "@/app/component/social-media/Header";
import Hero from "@/app/component/social-media/Hero";
import Section10 from "@/app/component/social-media/Section10";
import DynamicSlider from "@/app/component/social-media/DynamicSlider";
import Section2 from "@/app/component/work/portfolio/Section2";
import SeoHeadings from "../../component/social-media/seoHeadings";
/** Webflow Editor's Note Light custom font stack */

const editorsNoteLight =
  "wfont_e6fa52_d03d36fc891b44ea946b083dc8504aac, wf_d03d36fc891b44ea946b083dc, orig_editors_note_light, serif";
const ooh_images = [
  "/portfolio-page/creatives/ooh_i1_comp.jpg",
  "/portfolio-page/creatives/ooh_i2_comp.jpg",
  "/portfolio-page/creatives/ooh_i3_comp.jpg",
  "/portfolio-page/creatives/ooh_i4_comp.jpg",
  "/portfolio-page/creatives/ooh_i5_comp.jpg",
  "/portfolio-page/creatives/ooh_i6_comp.jpg",
  "/portfolio-page/creatives/ooh_i7_comp.jpg",
  "/portfolio-page/creatives/ooh_i8_comp.jpg",
  "/portfolio-page/creatives/ooh_i9_comp.jpg",
  "/portfolio-page/creatives/ooh_i10_comp.jpg",
  "/portfolio-page/creatives/ooh_i11_comp.jpg",
  "/portfolio-page/creatives/ooh_i12_comp.jpg",
  "/portfolio-page/creatives/ooh_i15_comp.jpg",
  "/portfolio-page/creatives/ooh_i16_comp.jpg",
  "/portfolio-page/creatives/ooh_i17_comp.jpg",
  "/portfolio-page/creatives/ooh_i19_comp.jpg",
  "/portfolio-page/creatives/ooh_i18_comp.jpg",
];

const stationary_images = [
  "/portfolio-page/creatives/stationary_i1_comp.jpg",
  "/portfolio-page/creatives/stationary_i2_comp.jpg",
  "/portfolio-page/creatives/stationary_i3_comp.jpg",
  "/portfolio-page/creatives/stationary_i4_comp.jpg",
  "/portfolio-page/creatives/stationary_i5_comp.jpg",
  "/portfolio-page/creatives/stationary_i6_comp.jpg",
  "/portfolio-page/creatives/stationary_i7_comp.jpg",
  "/portfolio-page/creatives/stationary_i8_comp.jpg",
  "/portfolio-page/creatives/stationary_i9_comp.jpg",
  "/portfolio-page/creatives/stationary_i10_comp.jpg",
  "/portfolio-page/creatives/stationary_i11_comp.jpg",
  "/portfolio-page/creatives/stationary_i12_comp.jpg",
  "/portfolio-page/creatives/stationary_i13_comp.jpg",
  "/portfolio-page/creatives/stationary_i14_comp.jpg",
];

const paper_prints = [
  "/portfolio-page/creatives/paper_prints_i1_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i2_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i3_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i4_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i5_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i6_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i7_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i8_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i9_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i10_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i11_comp.jpg",
  "/portfolio-page/creatives/paper_prints_i12_comp.jpg", 
];

const brochures_adaptations_images = [
  "/portfolio-page/creatives/brochures_adaptations_i1_comp.jpg",
  "/portfolio-page/creatives/brochures_adaptations_i2_comp.jpg",
  "/portfolio-page/creatives/brochures_adaptations_i3_comp.jpg",
  "/portfolio-page/creatives/brochures_adaptations_i4_comp.jpg",
  "/portfolio-page/creatives/brochures_adaptations_i5_comp.jpg",
  "/portfolio-page/creatives/brochures_adaptations_i6_comp.jpg",
];

const social_media_creatives_images = [
  "/portfolio-page/creatives/social_media_creatives_i1_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i2_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i3_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i4_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i5_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i6_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i7_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i8_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i9_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i10_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i11_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i12_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i13_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i14_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i15_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i16_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i17_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i18_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i19_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i20_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i21_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i22_comp.jpg",
  "/portfolio-page/creatives/social_media_creatives_i23_comp.jpg",
];

export const dynamic = "force-static";
export const revalidate = false;

export const metadata = {
  title: 'Creative Design Agency in Noida | Portfolio | Ritz Media World',
  description: 'Explore Ritz Media World’s creative design portfolio featuring branding, graphic design, print, OOH, social media and brochure designs that inspire.',
  alternates: {
    canonical: "https://ritzmediaworld.com/portfolio/creative",
  },
};

function page() {
  return (
    <main style={{ fontFamily: editorsNoteLight }}>
      <Header title="Creative Design Portfolio" />
      <Hero title="Bringing ideas to life & shaping bold brands<br />with Creative Design" />
      {/* <Section2 />  */}
      {/* <Section3 />  */}
      
      <DynamicSlider heading="Stationary Creative" images={stationary_images}/>
      <DynamicSlider heading="OOH Creative" images={ooh_images}/>
      {/* <Section5 /> */}
      <DynamicSlider heading="Print Creative" images={paper_prints}/>
      {/* <Section6 />  */}
      <DynamicSlider heading="Social Media Creative" images={social_media_creatives_images}/>
      {/* <Section8 /> */}
      <DynamicSlider heading="Brochure Creative" images={brochures_adaptations_images}/>
      <Section2 />
      <Section10 />
      <SeoHeadings />
    </main>
  );
}

export default page;
