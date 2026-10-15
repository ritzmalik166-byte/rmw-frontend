import React from 'react'

const Section3 = () => {
  return (
    <section className="w-full flex justify-center items-center">
     {/* Centered Align Container  */}
     <div className="w-full max-w-[1340px] flex flex-col gap-[40px] max-xl:px-6 max-md:px-4 max-md:gap-[28px]">
        {/* Top Row  */}
        <div className="w-full pb-[45px] border-b-2 border-[#E8E8E8] max-md:pb-[28px]">
          <h3 className="font-[700] text-[38px] uppercase max-xl:text-[32px] max-lg:text-[28px] max-md:text-[24px] max-sm:text-[20px]">
            Landing Pages
          </h3>
        </div>

        {/* Main Body Row  */}
        <div className='w-full grid grid-cols-3 gap-[40px] justify-between max-xl:gap-6 max-lg:grid-cols-2 max-lg:gap-5 max-md:grid-cols-1 max-md:gap-6'>
            {["/work/portfolio/s1/graph_comp.jpg", "/work/portfolio/s1/exotica.jpg", "/work/portfolio/s1/dholera.jpg"].map((img, idx)=>{
                return (
                    <div key={idx} className="w-[433px] h-[1043px] max-xl:w-full max-xl:h-auto max-xl:aspect-[433/1043]">
                        <img src={img} alt="portfolio" className="w-full h-full object-cover" />
                    </div>
                )
            })}
        </div>

     </div>
    </section>
  )
}

export default Section3;