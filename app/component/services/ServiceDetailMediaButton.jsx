import React from "react";
import Link from "next/link";

const ServiceDetailMediaButton = ({
  label = "Contact Us",
  href = "/contact",
  className = "",
}) => (
  <div className={`flex justify-center ${className || "mt-8 md:mt-10"}`}>
    <Link
      href={href}
      title={label}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative inline-flex cursor-pointer items-center gap-2 overflow-hidden rounded-full bg-white py-2 pl-5 pr-2 shadow-[0_6px_24px_rgba(0,0,0,0.22)] md:gap-2.5 md:py-2 md:pl-6 md:pr-2"
    >
      <span
        aria-hidden
        className="absolute inset-0 origin-left scale-x-0 rounded-full bg-[#1D1D1B] transition-transform duration-[550ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100"
      />
      <span className="relative z-10 font-league-spartan text-[12px] font-medium uppercase tracking-[0.08em] text-[#1D1D1B] transition-colors duration-300 group-hover:text-white md:text-[14px]">
        {label}
      </span>
      <span className="relative z-10 flex h-8 w-8 items-center justify-center rounded-full bg-[#1D1D1B] text-white transition-[background-color,color,transform] duration-[450ms] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:rotate-45 group-hover:bg-white group-hover:text-[#1D1D1B] md:h-9 md:w-9">
        <i className="ri-arrow-right-up-line text-[14px] md:text-[16px]" aria-hidden />
      </span>
    </Link>
  </div>
);

export default ServiceDetailMediaButton;
