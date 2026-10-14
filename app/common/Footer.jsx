  "use client";

import React, { useLayoutEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const sequelFontFamily = '"Sequel Sans", sans-serif';

const connectLabelStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 400,
  fontSize: "18px",
  lineHeight: "100%",
  letterSpacing: "0",
  textAlign: "center",
  color: "#FFFFFF99",
};

const linkStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "100%",
  letterSpacing: "0",
  textAlign: "center",
  textTransform: "uppercase",
  color: "#FFFFFF99",
};

const contactTextStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 500,
  fontSize: "18px",
  lineHeight: "22px",
  letterSpacing: "0",
  textAlign: "center",
  color: "#FFFFFF99",
};

const navLinkStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 500,
  fontSize: "40px",
  lineHeight: "100%",
  letterSpacing: "0",
  textAlign: "center",
  textTransform: "uppercase",
  color: "#FFFFFF99",
};

const serviceTextStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 420,
  lineHeight: "100%",
  letterSpacing: "0",
  textAlign: "center",
  textTransform: "uppercase",
  color: "#FFFFFF99",
};

const serviceTextClassName = "text-[14px] md:text-[12px] lg:text-[13px] xl:text-[18px]";

const brandTextStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 420,
  lineHeight: "100%",
  letterSpacing: "0",
  textAlign: "center",
  textTransform: "uppercase",
  color: "#FFFFFF",
};

const copyrightTextStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 410,
  fontSize: "18px",
  lineHeight: "100%",
  letterSpacing: "0",
  textAlign: "center",
  color: "#FFFFFF66",
};

const connectLinks = [
  { label: "Contact Us", href: "/contact" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/ritzmediaworld/" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/company/ritz-media-world/" },
  { label: "TWITTER", href: "https://twitter.com/ritzmediaworld" },
  { label: "YOUTUBE", href: "https://www.youtube.com/@ritzmediaworld" },
];

const mainNavLinks = [
  { label: "HOME", href: "/" },
  { label: "WORK", href: "/case-study" },
  { label: "ABOUT", href: "/about.html" },
  { label: "BLOGS", href: "/blog" },
  { label: "CAREER", href: "/career" },
];
  
const partnerLogos = [
  {
    src: "/contact/ins.png",
    alt: "Indian Newspaper Society",
    title: "Indian Newspaper Society",
  },
  {
    src: "/contact/meta.png",
    alt: "Meta Business Partner",
    title: "Meta Business Partner",
  },
  {
    src: "/contact/google.png",
    alt: "Google Partner",
    title: "Google Partner",
  },
  {
    src: "/contact/msme.png",
    alt: "MSME",
    title: "MSME",
  },
];

const servicesRow1 = [
  "DIGITAL MARKETING",
  "CONTENT MARKETING",
  "INFLUENCER MARKETING",
];

const servicesRow2 = [
  "WEB DEVELOPMENT",
  "CREATIVE SERVICES",
  "PRINT ADVERTISEMENT",
];

const getTextMetrics = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rect = range.getBoundingClientRect();
  return { left: rect.left, width: rect.width };
};

const getBrandGap = () => {
  const w = window.innerWidth;
  if (w < 768) return 10;
  return 16;
};

const getBrandTargets = (wrap, ritz, mediaworld) => {
  gsap.set(ritz, { x: 0 });
  gsap.set(mediaworld, { x: 0 });
  const wrapRect = wrap.getBoundingClientRect();
  const centerX = wrapRect.left + wrapRect.width / 2;
  const gap = getBrandGap();
  const ritzM = getTextMetrics(ritz);
  const mwM = getTextMetrics(mediaworld);
  const groupLeft = centerX - (ritzM.width + gap + mwM.width) / 2;
  return {
    ritzX: groupLeft - ritzM.left,
    mwX: groupLeft + ritzM.width + gap - mwM.left,
  };
};

const MediaWorldText = () => (
  <span
    data-footer-mediaworld
    className="inline-flex shrink-0 items-baseline gap-[6px] whitespace-nowrap !text-[28px] md:gap-2 md:!text-[74px]"
    style={brandTextStyle}
  >
    <span>MEDIA</span>
    <span>WORLD</span>
  </span>
);

/**
 * @param {{ overlaySection?: import("react").ReactNode | null }} props
 */
const Footer = ({ overlaySection = null }) => {
  const pathname = usePathname();
  const stackRef = useRef(null);
  const overlayRef = useRef(null);
  const footerRef = useRef(null);
  const brandBannerRef = useRef(null);
  const footerRevealLogoRef = useRef(null);

  useLayoutEffect(() => {
    const banner = brandBannerRef.current;
    if (!banner) return;

    const wrap = banner.querySelector("[data-footer-brand-wrap]");
    const ritz = banner.querySelector("[data-footer-ritz]");
    const mediaworld = banner.querySelector("[data-footer-mediaworld]");
    const services = banner.querySelectorAll("[data-footer-services]");

    if (!wrap || !ritz || !mediaworld || !services.length) return;

    const getTargets = () => getBrandTargets(wrap, ritz, mediaworld);

    let onRefreshInit = null;

    const ctx = gsap.context(() => {
      let targets = getTargets();
      gsap.set(services, { opacity: 1 });

      const useStackReveal =
        overlaySection &&
        stackRef.current &&
        footerRef.current &&
        window.matchMedia("(min-width: 768px)").matches;

      if (useStackReveal) return;

      const scrollConfig = {
              trigger: banner,
              start: "top 90%",
              end: "top 35%",
              scrub: true,
              invalidateOnRefresh: true,
            };

      onRefreshInit = () => {
        targets = getTargets();
      };

      ScrollTrigger.addEventListener("refreshInit", onRefreshInit);

      if (window.matchMedia("(min-width: 768px)").matches) {
        gsap
          .timeline({ scrollTrigger: scrollConfig })
          .to(services, { opacity: 0, ease: "none", duration: 1 }, 0)
          .to(ritz, { x: () => targets.ritzX, ease: "none", duration: 1 }, 0)
          .to(mediaworld, { x: () => targets.mwX, ease: "none", duration: 1 }, 0);
      }
    }, banner);

    const refresh = () => ScrollTrigger.refresh();
    requestAnimationFrame(refresh);

    const onResize = () => ScrollTrigger.refresh();
    window.addEventListener("resize", onResize);

    return () => {
      window.removeEventListener("resize", onResize);
      if (onRefreshInit) {
        ScrollTrigger.removeEventListener("refreshInit", onRefreshInit);
      }
      ctx.revert();
    };
  }, [overlaySection, pathname]);

  useLayoutEffect(() => {
    if (!overlaySection || !stackRef.current || !overlayRef.current || !footerRef.current) {
      return;
    }

    const stack = stackRef.current;
    const overlay = overlayRef.current;
    const footer = footerRef.current;

    const syncFooterMetrics = () => {
      const footerHeight = footer.offsetHeight;
      const peek = Math.min(footerHeight, window.innerHeight * 0.42);
      stack.style.setProperty("--footer-h", `${footerHeight}px`);
      stack.style.setProperty("--footer-peek", `${peek}px`);
    };

    syncFooterMetrics();

    if (!window.matchMedia("(min-width: 768px)").matches) {
      window.addEventListener("resize", syncFooterMetrics);
      return () => window.removeEventListener("resize", syncFooterMetrics);
    }

    let onBrandRefreshInit = null;

    const ctx = gsap.context(() => {
      const getRevealDistance = () =>
        Math.max(footer.offsetHeight, overlay.offsetHeight, overlay.scrollHeight);

      gsap.set(overlay, { y: 0, zIndex: 10, force3D: true });
      gsap.set(footer, { zIndex: 1 });

      const banner = brandBannerRef.current;
      const wrap = banner?.querySelector("[data-footer-brand-wrap]");
      const ritz = banner?.querySelector("[data-footer-ritz]");
      const mediaworld = banner?.querySelector("[data-footer-mediaworld]");
      const services = banner?.querySelectorAll("[data-footer-services]");

      const getTargets = () => {
        if (!wrap || !ritz || !mediaworld) return { ritzX: 0, mwX: 0 };
        return getBrandTargets(wrap, ritz, mediaworld);
      };

      let brandTargets = { ritzX: 0, mwX: 0 };

      if (wrap && ritz && mediaworld && services?.length) {
        brandTargets = getTargets();
        gsap.set(services, { opacity: 1 });

        onBrandRefreshInit = () => {
          brandTargets = getTargets();
          syncFooterMetrics();
        };
        ScrollTrigger.addEventListener("refreshInit", onBrandRefreshInit);
      }

      const syncConnectLinkClicks = (progress) => {
        const footerInteractive = progress >= 0.85;

        stack.querySelectorAll(".pin-spacer").forEach((el) => {
          el.style.pointerEvents = "none";
        });

        overlay.style.pointerEvents = footerInteractive ? "none" : "auto";
        footer.style.pointerEvents = footerInteractive ? "auto" : "none";
        overlay.style.zIndex = "10";
        footer.style.zIndex = "1";
      };

      let revealTl = null;

      const syncRevealProgress = (progress) => {
        revealTl?.progress(progress);
        syncConnectLinkClicks(progress);
      };

      revealTl = gsap.timeline({
        scrollTrigger: {
          trigger: stack,
          start: "top top",
          end: () => `+=${getRevealDistance()}`,
          scrub: true,
          pin: overlay,
          pinSpacing: true,
          invalidateOnRefresh: true,
          anticipatePin: 0,
          onEnter: (self) => syncRevealProgress(self.progress),
          onRefresh: () => syncRevealProgress(revealTl?.scrollTrigger?.progress ?? 0),
          onUpdate: (self) => syncConnectLinkClicks(self.progress),
          onLeave: () => syncConnectLinkClicks(1),
          onEnterBack: (self) => syncRevealProgress(self.progress),
          onLeaveBack: () => syncRevealProgress(0),
        },
      });

      syncRevealProgress(0);

      revealTl.to(
        overlay,
        { y: () => -getRevealDistance(), ease: "none", duration: 1, force3D: true },
        0,
      );

      const footerLogo = footerRevealLogoRef.current;
      if (footerLogo) {
        gsap.set(footerLogo, {
          scale: 0.38,
          y: 200,
          opacity: 0.05,
          rotation: -13,
          transformOrigin: "50% 50%",
          force3D: true,
        });

        revealTl.to(
          footerLogo,
          { scale: 1, y: 0, opacity: 0.5, ease: "none", duration: 1 },
          0,
        );
      }

      if (wrap && ritz && mediaworld && services?.length) {
        revealTl
          .to(services, { opacity: 0, ease: "none", duration: 1 }, 0)
          .to(ritz, { x: () => brandTargets.ritzX, ease: "none", duration: 1 }, 0)
          .to(mediaworld, { x: () => brandTargets.mwX, ease: "none", duration: 1 }, 0);
      }
    }, stack);

    const refresh = () => {
      syncFooterMetrics();
      ScrollTrigger.sort();
      ScrollTrigger.refresh();
    };
    requestAnimationFrame(refresh);
    window.addEventListener("load", refresh);
    window.addEventListener("resize", refresh);
    window.addEventListener("rmw:footer-refresh", refresh);
    const refreshTimer = window.setTimeout(refresh, 800);
    const lateRefreshTimer = window.setTimeout(refresh, 2000);

    let resizeRefreshTimer = null;
    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
            window.clearTimeout(resizeRefreshTimer);
            resizeRefreshTimer = window.setTimeout(refresh, 120);
          })
        : null;
    resizeObserver?.observe(footer);
    resizeObserver?.observe(overlay);
    const mainEl = stack.closest("main");
    if (mainEl) resizeObserver?.observe(mainEl);

    return () => {
      window.clearTimeout(refreshTimer);
      window.clearTimeout(lateRefreshTimer);
      window.clearTimeout(resizeRefreshTimer);
      window.removeEventListener("load", refresh);
      window.removeEventListener("resize", refresh);
      window.removeEventListener("rmw:footer-refresh", refresh);
      resizeObserver?.disconnect();
      if (onBrandRefreshInit) {
        ScrollTrigger.removeEventListener("refreshInit", onBrandRefreshInit);
      }
      ctx.revert();
    };
  }, [overlaySection, pathname]);

  const footerClassName =
    "relative w-full max-w-full overflow-x-clip bg-[#0E1125] px-8 pb-8 pt-0 md:px-12 md:pb-4 md:pt-8";

  const footerInner = (
    <>
      <style>{`
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-light-disp.woff2") format("woff2");
          font-weight: 400;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-bold-disp.woff2") format("woff2");
          font-weight: 425;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-semi-bold-disp.woff2") format("woff2");
          font-weight: 420;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-semi-bold-head.woff2") format("woff2");
          font-weight: 370;
          font-style: normal;
          font-display: swap;
        }
        @font-face {
          font-family: "Sequel Sans";
          src: url("/fonts/sequel-sans/sequel-sans-roman-disp.woff2") format("woff2");
          font-weight: 410;
          font-style: normal;
          font-display: swap;
        }
      `}</style>

      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none"
      >
        <img
          ref={footerRevealLogoRef}
          data-footer-reveal-logo
          src="/logo/r-logo-new2.png"
          alt="Ritz Media World"
          title="Ritz Media World"
          className="h-[300px] w-[250px] max-w-none object-contain will-change-transform md:h-[517px] md:w-[431px]"
          style={{
            filter: "brightness(3.2) contrast(1.05)",
            opacity: overlaySection ? 0.05 : 0.5,
          }}
        />
      </div>

      <div className="relative z-[2] mx-auto max-w-[1500px]">
        <div className="grid grid-cols-1 gap-5 md:grid-cols-3 md:gap-8 lg:gap-12">
          <div className="flex flex-col gap-5 md:gap-6">
            <span style={connectLabelStyle} className="mt-8">Connect</span>
            <nav className="relative z-10 flex flex-col gap-3 pointer-events-auto md:gap-4">
              {connectLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  title={link.label}
                  style={linkStyle}
                  className="relative z-10 pointer-events-auto !text-[17px] transition-opacity hover:opacity-70 md:!text-[18px]"
                  {...(link.href.startsWith("http")
                    ? { target: "_blank", rel: "noopener noreferrer" }
                    : {})}
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <nav className="relative flex flex-col items-center gap-4 md:gap-5 xl:gap-7 l4:gap-5">
            {mainNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                title={link.label}
                style={navLinkStyle}
                className="relative z-[1] !text-[30px] transition-opacity hover:opacity-70 md:!text-[40px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-3 text-center md:gap-5">
            <div className="flex flex-col items-center md:mt-15 mt-2">
              <span style={connectLabelStyle}>Email</span>
              <a
                href="mailto:info@ritzmediaworld.com"
                title="Email Ritz Media World"
                style={contactTextStyle}
                className="md:mt-4 mt-2 block transition-opacity hover:opacity-70 "
              >
                info@ritzmediaworld.com
              </a>
            </div>

            <div className="flex flex-col items-center">
              <span style={connectLabelStyle}>Phone No.</span>
              <p style={contactTextStyle} className="mt-4 lg:!text-[17px] xl:!text-[18px]">
                +91 9220516777 | +91 7290002168
              </p>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-4 w-fit max-w-full items-center p-[10px] justify-center border border-white/10 bg-white/[0.02] md:p-[20px] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-sm md:mt-12">
          <div className="flex flex-wrap items-center justify-center gap-3 md:gap-8 lg:gap-10">
            {partnerLogos.map((logo) => (
              <Image
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                title={logo.title}
                width={90}
                height={55}
                className="shrink-0 object-contain"
                style={{ width: "77px", height: "26px" }}
              />
            ))}
          </div>
        </div>
      </div>

      <div
        ref={brandBannerRef}
        className="relative z-[2] mt-4 w-full border-y border-[#FFFFFF1A] py-1 md:mt-12 md:py-8 lg:mt-14"
      >
        <div
          data-footer-brand-wrap
          className="relative mx-auto grid min-h-[130px] w-full max-w-[1500px] grid-cols-1 overflow-hidden px-8 md:min-h-[110px] md:px-12 lg:min-h-[90px]"
        >
          <div className="relative z-[1] col-start-1 row-start-1 flex w-full flex-col items-center justify-center gap-2 self-center py-2 text-center pointer-events-none opacity-25 md:opacity-100">
            {[servicesRow1, servicesRow2].map((row, rowIndex) => (
              <div
                key={rowIndex}
                data-footer-services
                style={serviceTextStyle}
                className={`${serviceTextClassName} grid w-full max-w-[900px] grid-cols-[1fr_auto_1fr_auto_1fr] items-center gap-x-[10px]`}
              >
                {row.map((service, index) => (
                  <React.Fragment key={service}>
                    {index > 0 && <span aria-hidden className="text-center">•</span>}
                    <span className="text-center">{service}</span>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>

          <div className="relative z-[3] col-start-1 row-start-1 flex w-full items-end justify-between gap-2 self-end py-1 md:contents">
            <span
              data-footer-ritz
              style={brandTextStyle}
              className="inline-block shrink-0 !text-[28px] md:col-start-1 md:row-start-1 md:justify-self-start md:self-end md:!text-[74px]"
            >
              RITZ
            </span>

            <div className="shrink-0 md:col-start-1 md:row-start-1 md:justify-self-end md:self-end">
              <MediaWorldText />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[2] mx-auto max-w-[1500px]">
        <p className="mt-5 text-center !text-[13px] md:mt-7 md:!text-[18px]" style={copyrightTextStyle}>
          © 2026 Ritz Media World. All rights reserved.
        </p>
      </div>
    </>
  );

  return (
    <div ref={stackRef} className="relative z-[1] w-full max-w-full overflow-x-clip">
      {overlaySection ? (
        <div className="max-md:flex max-md:flex-col md:grid md:w-full md:max-w-full md:grid-cols-1 md:grid-rows-1 md:overflow-x-clip">
          <footer
            ref={footerRef}
            className={`${footerClassName} relative z-[1] max-md:order-2 w-full md:col-start-1 md:row-start-1 md:sticky md:bottom-0 md:self-end`}
          >
            {footerInner}
          </footer>
          <div
            ref={overlayRef}
            className="relative z-[10] max-md:order-1 min-h-[100dvh] w-full will-change-transform md:col-start-1 md:row-start-1 md:min-h-screen md:self-stretch isolate"
          >
            {overlaySection}
          </div>
        </div>
      ) : (
        <footer className={footerClassName}>{footerInner}</footer>
      )}
    </div>
  );
};

export default Footer;
