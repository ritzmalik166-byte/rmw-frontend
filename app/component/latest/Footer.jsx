"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import Script from "next/script";
import { usePathname } from "next/navigation";
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

const brandTextStyle = {
  fontFamily: sequelFontFamily,
  fontWeight: 420,
  lineHeight: "100%",
  letterSpacing: "0",
  textAlign: "center",
  textTransform: "uppercase",
  color: "#FFFFFF",
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

const serviceTextClassName =
  "text-[10px] leading-snug sm:text-[13px] md:text-[12px] md:leading-[100%] lg:text-[13px] xl:text-[18px]";

const PARTICLE_WHITE = "#FFFFFF";
const TRIANGLE_COLORS = ["#0D1334", "#CD963C", PARTICLE_WHITE];

function seededRandom(seed) {
  const x = Math.sin(seed * 9.123 + seed * 41.77) * 43758.5453;
  return x - Math.floor(x);
}

function TriangleParticleBurst({ burstId, onComplete }) {
  const particles = useMemo(
    () =>
      Array.from({ length: 22 }, (_, i) => {
        const r1 = seededRandom(i + burstId * 3 + 5);
        const r2 = seededRandom(i + burstId * 7 + 23);
        const r3 = seededRandom(i + burstId * 11 + 47);
        const angle = r1 * Math.PI * 2;
        const distance = 28 + r2 * 52;
        return {
          id: i,
          color: TRIANGLE_COLORS[i % 3],
          x: `${Math.cos(angle) * distance}px`,
          y: `${Math.sin(angle) * distance}px`,
          rot: `${Math.floor(r3 * 360)}deg`,
          delay: `${(r2 * 0.06).toFixed(3)}s`,
          duration: `${(0.65 + r1 * 0.45).toFixed(3)}s`,
          size: 5 + Math.floor(r3 * 4),
        };
      }),
    [burstId]
  );

  useEffect(() => {
    const timer = window.setTimeout(onComplete, 950);
    return () => window.clearTimeout(timer);
  }, [burstId, onComplete]);

  return (
    <div className="call-burst-layer pointer-events-none absolute inset-0 overflow-visible" aria-hidden>
      {particles.map((p) => (
        <span
          key={p.id}
          className="call-triangle-particle"
          style={{
            borderLeft: `${p.size}px solid transparent`,
            borderRight: `${p.size}px solid transparent`,
            borderBottom: `${p.size * 1.6}px solid ${p.color}`,
            filter:
              p.color === PARTICLE_WHITE
                ? "drop-shadow(0 0 2px rgba(13,19,52,0.35))"
                : `drop-shadow(0 0 3px ${p.color}88)`,
            ["--call-tri-x"]: p.x,
            ["--call-tri-y"]: p.y,
            ["--call-tri-rot"]: p.rot,
            ["--call-tri-delay"]: p.delay,
            ["--call-tri-duration"]: p.duration,
          }}
        />
      ))}
    </div>
  );
}

function ContactFloat() {
  const [bursts, setBursts] = useState([]);
  const lastBurstRef = useRef(0);

  const triggerBurst = useCallback(() => {
    const now = Date.now();
    if (now - lastBurstRef.current < 350) return;
    lastBurstRef.current = now;
    setBursts((prev) => [...prev, now].slice(-5));
  }, []);

  const removeBurst = useCallback((id) => {
    setBursts((prev) => prev.filter((burstId) => burstId !== id));
  }, []);

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-center gap-3">
      <div className="relative h-14 w-14">
        <a
          href="tel:+917290002168"
          title="Call us"
          aria-label="Call us"
          onMouseEnter={triggerBurst}
          onPointerDown={triggerBurst}
          className="call-float-btn group relative z-[1] flex h-full w-full items-center justify-center overflow-hidden rounded-full bg-[#0E1125] transition-all duration-300 ease-out hover:scale-[1.07] active:scale-[0.96]"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="relative z-[1] h-7 w-7 text-white transition-transform duration-300 group-hover:scale-105"
            aria-hidden="true"
          >
            <path d="M20.01 15.38c-1.23 0-2.42-.2-3.53-.56a.977.977 0 00-1.01.24l-1.57 1.97c-2.83-1.35-5.48-3.9-6.89-6.83l1.95-1.66c.27-.28.35-.67.24-1.02-.37-1.11-.56-2.3-.56-3.53 0-.54-.45-.99-.99-.99H4.19C3.65 3 3 3.24 3 3.99 3 13.28 10.73 21 20.01 21c.71 0 .99-.63.99-1.18v-3.45c0-.54-.45-.99-.99-.99z" />
          </svg>
        </a>
        {bursts.map((id) => (
          <TriangleParticleBurst key={id} burstId={id} onComplete={() => removeBurst(id)} />
        ))}
      </div>
      <a
        href="https://wa.me/917290002168"
        title="Chat on WhatsApp"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        className="flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition-transform hover:scale-105"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className="h-7 w-7 text-white"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.435 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z" />
        </svg>
      </a>
    </div>
  );
}

const servicesRow1 = [
  { title: "DIGITAL MARKETING", href: "/services/digital-marketing" },
  { title: "CREATIVE SERVICES", href: "/services/creative-services" },
  { title: "PRINT ADVERTISING", href: "/services/print-advertising" },
];

const servicesRow2 = [
  { title: "RADIO ADVERTISING", href: "/services/radio-advertising" },
  { title: "CONTENT MARKETING", href: "/services/content-marketing" },
  { title: "WEB DEVELOPMENT", href: "/services/web-designing-and-development" },
];

const servicesRow3 = [
  { title: "CELEBRITY ENDORSEMENTS", href: "/services/celebrity-endorsements" },
  { title: "INFLUENCER MARKETING", href: "/services/influencer-marketing-agency-in-india" },
  { title: "3D RENDERING SERVICES", href: "/services/3d-rendering" },
];

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
  { label: "FACEBOOK", href: "https://www.facebook.com/ritzmediaworld/" },
  { label: "INSTAGRAM", href: "https://www.instagram.com/ritzmediaworld/" },
  { label: "LINKEDIN", href: "https://www.linkedin.com/company/ritzmediaworld/" },
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

const clamp = (value, min, max) => Math.max(min, Math.min(max, value));
const lerp = (from, to, t) => from + (to - from) * t;
const isLargeDesktop = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(min-width: 1024px)").matches;

const getTextMetrics = (el) => {
  const range = document.createRange();
  range.selectNodeContents(el);
  const rect = range.getBoundingClientRect();
  return { left: rect.left, width: rect.width };
};

const getBrandGap = () => (window.innerWidth < 768 ? 10 : 16);

const getBrandTargets = (brandWrap, brandRow, ritz, mediaworld) => {
  const prevRitz = ritz.style.transform;
  const prevMw = mediaworld.style.transform;
  ritz.style.transform = "translate3d(0,0,0)";
  mediaworld.style.transform = "translate3d(0,0,0)";

  const centerRect = brandWrap.getBoundingClientRect();
  const centerX = centerRect.left + centerRect.width / 2;
  const gap = getBrandGap();
  const ritzM = getTextMetrics(ritz);
  const mwM = getTextMetrics(mediaworld);
  const groupLeft = centerX - (ritzM.width + gap + mwM.width) / 2;

  const targets = {
    ritzX: groupLeft - ritzM.left,
    mwX: groupLeft + ritzM.width + gap - mwM.left,
  };

  ritz.style.transform = prevRitz;
  mediaworld.style.transform = prevMw;
  return targets;
};

const applyBrandMorph = (ritz, mediaworld, targets, progress) => {
  ritz.style.transform = `translate3d(${targets.ritzX * progress}px, 0, 0)`;
  mediaworld.style.transform = `translate3d(${targets.mwX * progress}px, 0, 0)`;
};

const resetBrandMorph = (ritz, mediaworld) => {
  if (ritz) ritz.style.transform = "";
  if (mediaworld) mediaworld.style.transform = "";
};

const MediaWorldText = () => (
  <span
    className="inline-flex max-w-full shrink-0 items-baseline gap-[4px] whitespace-nowrap !text-[clamp(1.25rem,8vw,1.75rem)] sm:gap-[6px] sm:!text-[32px] md:!text-[44px] lg:gap-2 lg:!text-[56px] xl:!text-[74px]"
    style={brandTextStyle}
  >
    <span>MEDIA</span>
    <span>WORLD</span>
  </span>
);

/**
 * Footer with optional curtain overlay section.
 * Desktop: overlay slides up on scroll, footer sits below in normal flow (always fully visible).
 * Mobile/tablet: overlay stacks above footer.
 * @param {{ section?: import("react").ReactNode }} props
 */
const Footer = ({ section = null }) => {
  const pathname = usePathname();
  const stackRef = useRef(null);
  const stageRef = useRef(null);
  const overlayRef = useRef(null);
  const footerRef = useRef(null);
  const revealLogoRef = useRef(null);
  const brandBannerRef = useRef(null);

  useEffect(() => {
    if (!section) return;

    const stack = stackRef.current;
    const stage = stageRef.current;
    const overlay = overlayRef.current;
    const footer = footerRef.current;
    const logo = revealLogoRef.current;
    if (!stack || !stage || !overlay || !footer) return;

    let revealDistance = 0;
    let stackTop = 0;
    let brandTargets = { ritzX: 0, mwX: 0 };
    let desktop = false;
    let raf = 0;

    const getBrandElements = () => {
      const banner = brandBannerRef.current;
      if (!banner) return null;
      const brandWrap = banner.querySelector("[data-footer-brand-wrap]");
      const brandRow = banner.querySelector("[data-footer-brand-row]");
      const ritz = banner.querySelector("[data-footer-ritz]");
      const mediaworld = banner.querySelector("[data-footer-mediaworld]");
      if (!brandWrap || !brandRow || !ritz || !mediaworld) return null;
      return { brandWrap, brandRow, ritz, mediaworld };
    };

    const measureBrand = () => {
      const brand = getBrandElements();
      if (!brand) return;
      brandTargets = getBrandTargets(
        brand.brandWrap,
        brand.brandRow,
        brand.ritz,
        brand.mediaworld,
      );
    };

    const applyBrand = (progress) => {
      const brand = getBrandElements();
      if (!brand) return;
      applyBrandMorph(brand.ritz, brand.mediaworld, brandTargets, progress);
    };

    const resetStyles = () => {
      overlay.style.transform = "";
      overlay.style.pointerEvents = "";
      overlay.style.visibility = "";
      overlay.style.display = "";
      footer.style.transform = "";
      footer.style.pointerEvents = "";
      footer.scrollTop = 0;
      stack.style.height = "";
      if (logo) {
        logo.style.transform = "";
        logo.style.opacity = "";
      }
      const brand = getBrandElements();
      if (brand) resetBrandMorph(brand.ritz, brand.mediaworld);
    };

    const measure = () => {
      desktop = isLargeDesktop();
      if (!desktop) {
        resetStyles();
        return;
      }
      revealDistance = stage.offsetHeight || window.innerHeight;
      stack.style.height = `${revealDistance * 2}px`;
      stackTop = stack.getBoundingClientRect().top + window.scrollY;
      measureBrand();
    };

    const getProgress = () => {
      stackTop = stack.getBoundingClientRect().top + window.scrollY;
      return clamp((window.scrollY - stackTop) / revealDistance, 0, 1);
    };

    const apply = () => {
      raf = 0;
      if (!desktop) return;

      const progress = getProgress();
      overlay.style.transform = `translate3d(0, ${-progress * revealDistance}px, 0)`;
      applyBrand(progress);

      const footerInteractive = progress >= 0.85;
      overlay.style.pointerEvents = footerInteractive ? "none" : "auto";
      footer.style.pointerEvents = footerInteractive ? "auto" : "none";

      if (logo) {
        const scale = lerp(0.4, 1, progress);
        const y = lerp(160, 0, progress);
        const rotation = lerp(-12, 0, progress);
        logo.style.transform = `translate3d(0, ${y}px, 0) scale(${scale}) rotate(${rotation}deg)`;
        logo.style.opacity = String(lerp(0.05, 0.5, progress));
      }
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      apply();
    };

    measure();
    apply();

    const resizeObserver =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => {
          measure();
          apply();
        })
        : null;

    resizeObserver?.observe(stack);
    resizeObserver?.observe(stage);

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    window.addEventListener("rmw:footer-refresh", onResize);
    const settleTimer = window.setTimeout(onResize, 600);
    const lateSettleTimer = window.setTimeout(onResize, 1200);

    return () => {
      resizeObserver?.disconnect();
      window.clearTimeout(settleTimer);
      window.clearTimeout(lateSettleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.removeEventListener("rmw:footer-refresh", onResize);
      if (raf) cancelAnimationFrame(raf);
      resetStyles();
    };
  }, [section, pathname]);

  useEffect(() => {
    if (section) return;

    const banner = brandBannerRef.current;
    if (!banner) return;

    const brandWrap = banner.querySelector("[data-footer-brand-wrap]");
    const brandRow = banner.querySelector("[data-footer-brand-row]");
    const ritz = banner.querySelector("[data-footer-ritz]");
    const mediaworld = banner.querySelector("[data-footer-mediaworld]");
    if (!brandWrap || !brandRow || !ritz || !mediaworld) return;

    let targets = { ritzX: 0, mwX: 0 };
    let desktop = false;
    let raf = 0;

    const measure = () => {
      desktop = isLargeDesktop();
      if (!desktop) {
        resetBrandMorph(ritz, mediaworld);
        return;
      }
      targets = getBrandTargets(brandWrap, brandRow, ritz, mediaworld);
    };

    const apply = () => {
      raf = 0;
      if (!desktop) return;
      const vh = window.innerHeight;
      const top = banner.getBoundingClientRect().top;
      const progress = clamp((0.9 * vh - top) / (0.55 * vh), 0, 1);
      applyBrandMorph(ritz, mediaworld, targets, progress);
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(apply);
    };
    const onResize = () => {
      measure();
      apply();
    };

    measure();
    apply();

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onResize);
    window.addEventListener("load", onResize);
    window.addEventListener("rmw:footer-refresh", onResize);
    const settleTimer = window.setTimeout(onResize, 600);

    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
      window.removeEventListener("load", onResize);
      window.removeEventListener("rmw:footer-refresh", onResize);
      if (raf) cancelAnimationFrame(raf);
      resetBrandMorph(ritz, mediaworld);
    };
  }, [section, pathname]);

  const footerClassName =
    "relative box-border w-full max-w-full overflow-x-clip bg-[#0E1125] px-4 pb-3 pt-5 sm:px-6 sm:pt-6 md:px-10 md:pb-3 md:pt-8 lg:px-8 lg:pb-3 lg:pt-5 xl:px-12 xl:pt-6";

  const footerPanel = (
    <div
      data-footer-panel
      className="relative flex w-full flex-col lg:min-h-full lg:justify-between lg:py-2"
    >
      <div className="relative z-[2] mx-auto w-full max-w-[1500px]">
        <div className="grid grid-cols-1 gap-6 sm:gap-5 md:grid-cols-3 md:gap-6 lg:gap-5 xl:gap-8">
          <div className="flex flex-col items-center gap-2.5 md:items-start md:gap-4">
            <span
              style={connectLabelStyle}
              className="!text-[14px] sm:!text-[16px] md:!text-[18px]"
            >
              Connect
            </span>

            <nav className="flex flex-col items-center gap-2 md:items-start md:gap-3">
              {connectLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  title={link.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={linkStyle}
                  className="!text-[14px] transition-opacity hover:opacity-70 sm:!text-[16px] md:!text-[18px]"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          <nav className="flex flex-col items-center gap-2.5 sm:gap-3 md:gap-4 lg:gap-5">
            {mainNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                title={link.label}
                target="_blank"
                rel="noopener noreferrer"
                style={navLinkStyle}
                className="!text-[22px] transition-opacity hover:opacity-70 sm:!text-[26px] md:!text-[32px] lg:!text-[34px] xl:!text-[40px]"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex flex-col items-center gap-4 text-center">
            <div className="flex flex-col items-center">
              <span
                style={connectLabelStyle}
                className="!text-[14px] sm:!text-[16px] md:!text-[18px]"
              >
                Email
              </span>
              <a
                href="mailto:info@ritzmediaworld.com"
                title="Email Ritz Media World"
                target="_blank"
                rel="noopener noreferrer"
                style={contactTextStyle}
                className="mt-1.5 block break-all !text-[13px] !leading-5 transition-opacity hover:opacity-70 sm:mt-2 sm:break-normal sm:!text-[16px] sm:!leading-[22px] md:!text-[18px]"
              >
                info@ritzmediaworld.com
              </a>
            </div>

            <div className="flex flex-col items-center">
              <span
                style={connectLabelStyle}
                className="!text-[14px] sm:!text-[16px] md:!text-[18px]"
              >
                Phone No.
              </span>
              <p
                style={contactTextStyle}
                className="mt-1.5 flex flex-col items-center gap-1 !text-[13px] !leading-5 sm:mt-2 sm:block sm:!text-[16px] sm:!leading-[22px] md:!text-[18px]"
              >
                <a
                  href="tel:+919220516777"
                  title="+91 9220516777"
                  className="transition-opacity hover:opacity-70"
                >
                  +91 9220516777
                </a>
                <span className="hidden sm:inline"> | </span>
                <a
                  href="tel:+917290002168"
                  title="+91 7290002168"
                  className="transition-opacity hover:opacity-70"
                >
                  +91 7290002168
                </a>
              </p>
            </div>
            <div className="mt-3 flex justify-center md:mt-4">
              <a
                href="https://www.google.com/preferences/source?q=ritzmediaworld.com"
                title="Add Ritz Media World as a preferred source on Google"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Add Ritz Media World as a preferred source on Google"
                className="google-source-btn inline-flex w-fit max-w-[200px] items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[11px] font-semibold leading-[1.15] text-[#171717] shadow-[0_4px_14px_rgba(0,0,0,0.12)] transition-transform duration-300 hover:scale-[1.02] sm:max-w-[220px] sm:gap-2 sm:px-3.5 sm:py-2 sm:text-[12px] md:text-[13px]"
              >
                <img
                  src="/google-logo.png"
                  alt="Google"
                  title="Google"
                  width={24}
                  height={24}
                  className="h-5 w-5 shrink-0 object-contain sm:h-6 sm:w-6"
                />
                <span className="text-left">
                  Add as a preferred
                  <br />
                  source on Google
                </span>
              </a>
            </div>
          </div>
        </div>

        <div className="mx-auto mt-5 w-full max-w-[340px] border border-white/10 bg-white/[0.02] p-2.5 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.04)] backdrop-blur-sm sm:w-fit sm:max-w-full md:mt-6 md:p-3 lg:mt-5">
          <div className="flex flex-wrap items-center justify-center gap-x-3 gap-y-3 sm:gap-4 md:gap-6 lg:gap-8">
            {partnerLogos.map((logo) => (
              <img
                key={logo.src}
                src={logo.src}
                alt={logo.alt}
                title={logo.title}
                width={90}
                height={55}
                className="h-[22px] w-[64px] shrink-0 object-contain sm:h-[26px] sm:w-[77px]"
              />
            ))}
          </div>
        </div>
      </div>

      <div
        ref={brandBannerRef}
        className="relative z-[2] mt-5 w-full border-y border-[#FFFFFF1A] py-3 md:mt-6 md:py-4 lg:mt-0 lg:py-4"
      >
        <div
          data-footer-brand-wrap
          className="relative mx-auto flex w-full max-w-[1500px] flex-col items-center gap-3 overflow-x-clip px-2 sm:gap-2 sm:px-6 md:gap-3 md:px-8 lg:px-10 xl:px-12"
        >
          <div className="relative z-[1] mx-auto flex w-full max-w-[1320px] flex-col items-center justify-center gap-1.5 px-1 text-center sm:gap-2 sm:px-2 md:px-6">
            {/* Mobile / tablet: 2 per row, centered */}
            <div
              data-footer-services
              style={serviceTextStyle}
              className={`${serviceTextClassName} grid w-full max-w-[420px] grid-cols-2 items-center justify-items-center gap-x-3 gap-y-2 md:hidden`}
            >
              {[...servicesRow1, ...servicesRow2, ...servicesRow3].map(
                (service, index, arr) => (
                  <Link
                    key={service.href}
                    href={service.href}
                    title={service.title}
                    rel="noopener noreferrer"
                    className={`px-1 text-center transition-colors hover:text-white${index === arr.length - 1 && arr.length % 2 === 1
                      ? " col-span-2"
                      : ""
                      }`}
                  >
                    {service.title}
                  </Link>
                ),
              )}
            </div>

            {/* Desktop: 3-column rows with bullets */}
            {[servicesRow1, servicesRow2, servicesRow3].map((row, rowIndex) => (
              <div
                key={rowIndex}
                data-footer-services
                style={serviceTextStyle}
                className={`${serviceTextClassName} hidden w-full max-w-[1100px] grid-cols-[auto_1fr_auto_1fr_auto_1fr] items-center gap-x-[10px] md:grid`}
              >
                {row.map((service) => (
                  <React.Fragment key={service.href}>
                    <span aria-hidden className="text-left">
                      •
                    </span>
                    <Link
                      href={service.href}
                      title={service.title}
                      rel="noopener noreferrer"
                      className="min-w-0 text-left transition-colors hover:text-white"
                    >
                      {service.title}
                    </Link>
                  </React.Fragment>
                ))}
              </div>
            ))}
          </div>

          <div
            data-footer-brand-row
            className="relative z-[2] mx-auto flex w-full max-w-[1320px] flex-col items-center justify-center gap-0 px-1 text-center sm:flex-row sm:flex-wrap sm:items-baseline sm:gap-x-2 sm:gap-y-1 sm:px-2 md:gap-x-3 md:px-6 lg:flex-nowrap lg:justify-between lg:gap-2"
          >
            <span
              data-footer-ritz
              style={brandTextStyle}
              className="inline-block max-w-full shrink-0 !text-[clamp(1.25rem,8vw,1.75rem)] sm:!text-[32px] md:!text-[40px] lg:will-change-transform lg:!text-[56px] xl:!text-[74px]"
            >
              RITZ
            </span>

            <div
              data-footer-mediaworld
              className="max-w-full shrink-0 lg:will-change-transform"
            >
              <MediaWorldText />
            </div>
          </div>
        </div>
      </div>

      <div className="relative z-[2] mx-auto max-w-[1500px] px-2">
        <p
          className="mt-4 mb-0 pb-2 text-center !text-[11px] !leading-snug sm:!text-[13px] md:mt-5 md:pb-2 md:!text-[16px] lg:mt-0 lg:!text-[18px]"
          style={copyrightTextStyle}
        >
          © 2026 Ritz Media World. All rights reserved.
        </p>
      </div>
    </div>
  );

  const footerInner = (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-1/2 z-0 -translate-x-1/2 -translate-y-1/2 select-none"
      >
        <img
          ref={revealLogoRef}
          src="/logo/r-logo-new.png"
          alt="Ritz Media World"
          title="Ritz Media World"
          width={1048}
          height={1259}
          className="h-[160px] w-auto max-w-none object-contain will-change-transform sm:h-[180px] md:h-[220px] lg:h-[220px] xl:h-[280px] 2xl:h-[360px]"
          style={{
            filter: "brightness(3.2) contrast(1.05)",
            opacity: section ? 0.05 : 0.5,
          }}
        />
      </div>
      {footerPanel}
    </>
  );

  if (!section) {
    return (
      <>
        <footer className={footerClassName}>{footerInner}</footer>
        <ContactFloat />
        <ClarityScript />
      </>
    );
  }

  return (
    <>
      <div
        key={pathname}
        ref={stackRef}
        className="relative w-full max-w-full overflow-x-clip"
      >
        <div
          ref={stageRef}
          className="relative flex flex-col bg-[#0E1125] lg:sticky lg:top-0 lg:h-screen lg:overflow-hidden"
        >
          <footer
            ref={footerRef}
            className={`${footerClassName} relative z-[1] order-2 lg:absolute lg:inset-0 lg:overflow-x-clip lg:overflow-y-auto`}
          >
            {footerInner}
          </footer>

          <div
            ref={overlayRef}
            className="relative z-[10] order-1 w-full will-change-transform lg:absolute lg:inset-0 lg:h-full"
          >
            {section}
          </div>
        </div>
      </div>
      <ContactFloat />
      <ClarityScript />
    </>
  );
};

const ClarityScript = () => (
  <Script id="microsoft-clarity" strategy="afterInteractive">
    {`(function(c,l,a,r,i,t,y){
        c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
        t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
        y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
    })(window, document, "clarity", "script", "yuw3enkgmk");`}
  </Script>
);

export default Footer;