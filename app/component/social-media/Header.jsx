import React from "react"

function Header({ title }) {
  return (
    <div className="w-full h-auto relative">
        <img
          src="/social-media/creative_nav2.jpg"
          alt="header"
          title="Ritz Media World"
          className="w-full h-[100px] sm:h-[120px] md:h-[140px] lg:h-[161px] object-cover"
        />
        <h1 className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-[90%] px-3 text-center text-lg sm:text-xl md:text-2xl lg:text-[40px] font-[700] text-black leading-tight">
         {title ? title : "Web Design Portfolio"}
        </h1>
    </div>
  )
}

export default Header