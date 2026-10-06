import Link from "@/components/InteractionPrefetchLink";

const headingStyle = {
  fontFamily: '"League Spartan", sans-serif',
  fontWeight: 700,
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const bodyStyle = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 400,
  fontStyle: "italic",
  fontSize: "22px",
  lineHeight: "30px",
  letterSpacing: "0",
  color: "#FFFFFF",
};

const aboutButtonTextStyle = {
  fontFamily: "Montserrat, sans-serif",
  fontWeight: 700,
  fontSize: "16px",
  lineHeight: "100%",
  letterSpacing: "0",
  textTransform: "capitalize",
};

const Section2Hero = () => {
  return (
    <div className="grid grid-cols-1 justify-items-center md:grid-cols-[1fr_auto] md:items-start md:justify-items-stretch md:gap-x-6">
      <h1
        className="m-0 min-w-0 w-full text-center text-[28px] md:col-start-1 md:row-start-1 md:text-left md:text-[30px] lg:text-[48px]"
        style={headingStyle}
      >
        Creative Advertising, Branding & Digital <br className="md:hidden lg:block"/> Marketing Agency in India
      </h1>

      <p
        className="m-0 mt-5 w-full text-center md:col-span-2 md:row-start-2 md:text-left xl:max-w-[1150px] lg:max-w-[800px] md:max-w-[800px]"
        style={bodyStyle}
      >
       18 years of transforming brands through creativity, strategy & innovation
      </p>

      <Link
        href="/contact"
        title="Contact Us"
        target="_blank"
        rel="noopener noreferrer"
        className="group relative mt-5 flex shrink-0 cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-white py-2.5 pl-5 pr-2 shadow-[0_6px_24px_rgba(0,0,0,0.22)] md:col-start-2 md:row-start-1 md:mt-0 md:justify-self-end md:gap-2.5 md:py-2 md:pl-6 md:pr-2"
      >
        <span
          aria-hidden
          className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#1D1D1B] transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
        />
        <span
          className="relative z-10 text-[#1D1D1B] transition-colors duration-300 group-hover:text-white"
          style={aboutButtonTextStyle}
        >
         Contact Us
        </span>
        <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#1D1D1B] text-white transition-[background-color,color,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:bg-white group-hover:text-[#1D1D1B] md:h-9 md:w-9">
          <i
            className="ri-arrow-right-up-line text-[14px] md:text-[16px]"
            aria-hidden
          />
        </span>
      </Link>
    </div>
  );
};

export default Section2Hero;