import React from "react";
import Image from "next/image";
import localFont from "next/font/local";
import Section1Row2 from "./Section1Row2";

const playfair = localFont({
  src: "../../../../public/fonts/google/playfair-display-latin-wght-normal.woff2",
  weight: "400 500",
  style: "normal",
  display: "swap",
});

const Section1 = () => {
  return (
    <section className="w-full">
      {/* Full-bleed banner - left/right edge touch */}
      <div className="relative w-full overflow-hidden">
        <div className="grid w-full grid-cols-2">
          <div className="relative w-full overflow-hidden xl:h-[664px]">
            <Image
              src="/portfolio/profolio-banner-1.jpg"
              alt="Ritz Media World"
              title="Ritz Media World"
              width={1200}
              height={1600}
              priority
              className="block h-auto w-full object-cover object-center xl:absolute xl:inset-0 xl:h-full"
              sizes="50vw"
            />
          </div>
          <div className="relative w-full overflow-hidden xl:h-[664px]">
            <Image
              src="/portfolio/profolio-banner-2.jpg"
              alt="Ritz Media World"
              title="Ritz Media World"
              width={1200}
              height={1600}
              priority
              className="block h-auto w-full object-cover object-center xl:absolute xl:inset-0 xl:h-full"
              sizes="50vw"
            />
          </div>
        </div>

        <p
          className={`${playfair.className} pointer-events-none absolute left-1/2 top-1/2 z-10 m-0 w-[min(92%,520px)] -translate-x-1/2 -translate-y-1/2 text-center text-[22px] font-normal leading-[1.25] tracking-[-0.01em] text-black sm:text-[22px] md:text-[22px] lg:text-[25px] xl:text-[35px]`}
        >
          Our work speaks for itself
        </p>
      </div>

      <div className="w-full">
        <Section1Row2 />
      </div>
    </section>
  );
};

export default Section1;
