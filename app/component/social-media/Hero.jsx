import React from "react";
import { preload } from "react-dom";

const HERO_IMAGE = "/portfolio-page/creatives/update_home2.jpg";

function Hero({ title, titleAs = "h2" }) {
  const TitleTag = titleAs === "h2" ? "h2" : "p";
  preload(HERO_IMAGE, { as: "image", fetchPriority: "high" });
  return (
    <section
      className="w-full h-[620px] flex justify-center items-center bg-cover bg-center bg-no-repeat bg-fixed"
      style={{ backgroundImage: `url('${HERO_IMAGE}')` }}
    >
      <div className="w-full h-full flex justify-center items-center bg-[#000000a3]">
        <div className="w-full h-full flex justify-center items-center text-center">
          <TitleTag
            className="text-white text-2xl lg:text-[43px] font-[300]"
            dangerouslySetInnerHTML={{
              __html: title
                ? title
                : "Designing experiences & building presence with Website Design",
            }}
          />
        </div>
      </div>
    </section>
  );
}

export default Hero;
