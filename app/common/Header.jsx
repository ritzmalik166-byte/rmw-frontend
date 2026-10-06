"use client";

import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "@/components/InteractionPrefetchLink";
import { usePathname } from "next/navigation";
import { navServices as services } from "../../data/navServices";

const portfolioSubLinks = [
  { label: "Brand Identity", href: "/portfolio/brand-identity" },
  { label: "Creative Design", href: "/portfolio/creative" },
  { label: "Website Design", href: "/portfolio/web-design" },
  { label: "Brand Films", href: "/portfolio/brand-films" },
  { label: "Walk-Through Videos", href: "/portfolio/walk-through-videos" },
  {
    label: "Influencer Marketing Videos",
    href: "/portfolio/influencer-marketing-videos",
  },
];

const workLinks = [
  {
    label: "Portfolio",
    href: "/portfolio",
    children: portfolioSubLinks,
  },
  { label: "Case Studies", href: "/case-study" },
];



const navLinks = [
  { label: "Contact Us", href: "/contact" },
];

const linkClass =
  "font-sequel text-base font-[310] uppercase leading-none tracking-normal text-[#FFFFFF]";

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [servicesMenuOpen, setServicesMenuOpen] = useState(false);
  const [workMenuOpen, setWorkMenuOpen] = useState(false);
  const [servicesMenuMounted, setServicesMenuMounted] = useState(false);
  const [workMenuMounted, setWorkMenuMounted] = useState(false);
  const [portfolioSubOpen, setPortfolioSubOpen] = useState(false);
  const [isDesktop, setIsDesktop] = useState(false);
  const [headerHeight, setHeaderHeight] = useState(88);
  const headerRef = useRef(null);
  const headerBarRef = useRef(null);
  const lastScrollY = useRef(0);
  const servicesCloseTimer = useRef(null);
  const workCloseTimer = useRef(null);
  const menuOpenRef = useRef(false);
  const servicesMenuOpenRef = useRef(false);
  const workMenuOpenRef = useRef(false);
  const pathname = usePathname();

  menuOpenRef.current = menuOpen;
  servicesMenuOpenRef.current = servicesMenuOpen;
  workMenuOpenRef.current = workMenuOpen;

  const handleLogoClick = (event) => {
    const isHome = pathname === "/" || window.location.pathname === "/";
    if (!isHome) return;

    event.preventDefault();
    setMenuOpen(false);
    setServicesMenuOpen(false);
    setWorkMenuOpen(false);
    setPortfolioSubOpen(false);
    // Menus lock the body and restore scroll on close, so scroll after that settles
    setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 0);
  };

  const openServicesMenu = () => {
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current);
      servicesCloseTimer.current = null;
    }
    if (workCloseTimer.current) {
      clearTimeout(workCloseTimer.current);
      workCloseTimer.current = null;
    }
    setWorkMenuOpen(false);
    setPortfolioSubOpen(false);
    setServicesMenuMounted(true);
    setServicesMenuOpen(true);
  };

  const closeServicesMenu = () => {
    if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
    servicesCloseTimer.current = setTimeout(() => {
      setServicesMenuOpen(false);
      servicesCloseTimer.current = null;
    }, 200);
  };

  const toggleServicesMenu = () => {
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current);
      servicesCloseTimer.current = null;
    }
    if (workCloseTimer.current) {
      clearTimeout(workCloseTimer.current);
      workCloseTimer.current = null;
    }
    setWorkMenuOpen(false);
    setServicesMenuOpen((open) => {
      const next = !open;
      if (next) setServicesMenuMounted(true);
      return next;
    });
  };

  const openWorkMenu = () => {
    if (workCloseTimer.current) {
      clearTimeout(workCloseTimer.current);
      workCloseTimer.current = null;
    }
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current);
      servicesCloseTimer.current = null;
    }
    setServicesMenuOpen(false);
    setWorkMenuMounted(true);
    setWorkMenuOpen(true);
    setPortfolioSubOpen(true);
  };

  const closeWorkMenu = () => {
    if (workCloseTimer.current) clearTimeout(workCloseTimer.current);
    workCloseTimer.current = setTimeout(() => {
      setWorkMenuOpen(false);
      setPortfolioSubOpen(false);
      workCloseTimer.current = null;
    }, 200);
  };

  const toggleWorkMenu = () => {
    if (workCloseTimer.current) {
      clearTimeout(workCloseTimer.current);
      workCloseTimer.current = null;
    }
    if (servicesCloseTimer.current) {
      clearTimeout(servicesCloseTimer.current);
      servicesCloseTimer.current = null;
    }
    setServicesMenuOpen(false);
    setWorkMenuOpen((open) => {
      const next = !open;
      if (next) setWorkMenuMounted(true);
      setPortfolioSubOpen(next);
      return next;
    });
  };

  const megaMenuOpen = servicesMenuOpen || workMenuOpen;

  useLayoutEffect(() => {
    const items = headerRef.current?.querySelectorAll("[data-header-reveal]");
    const delayMs = 150 + 1050 + Math.max(0, (items?.length ?? 1) - 1) * 80;
    const timer = window.setTimeout(() => {
      window.dispatchEvent(new CustomEvent("header-reveal-complete"));
    }, delayMs);
    return () => window.clearTimeout(timer);
  }, []);

  useLayoutEffect(() => {
    return () => {
      if (servicesCloseTimer.current) clearTimeout(servicesCloseTimer.current);
      if (workCloseTimer.current) clearTimeout(workCloseTimer.current);
    };
  }, []);

  useLayoutEffect(() => {
    const bar = headerBarRef.current;
    if (!bar) return;

    const updateHeight = () => {
      const next = Math.round(bar.getBoundingClientRect().height);
      setHeaderHeight((current) => (current === next ? current : next));
    };

    updateHeight();
    const observer = new ResizeObserver(updateHeight);
    observer.observe(bar);
    return () => observer.disconnect();
  }, []);

  useLayoutEffect(() => {
    // Hover menus only on real desktop pointers; touch/tablet uses click
    const media = window.matchMedia(
      "(min-width: 768px) and (hover: hover) and (pointer: fine)"
    );
    const syncDesktop = () => setIsDesktop(media.matches);

    syncDesktop();
    if (media.addEventListener) {
      media.addEventListener("change", syncDesktop);
      return () => media.removeEventListener("change", syncDesktop);
    }
    media.addListener(syncDesktop);
    return () => media.removeListener(syncDesktop);
  }, []);

  useLayoutEffect(() => {
    if (!megaMenuOpen) return;

    const scrollY = window.scrollY;
    const { body, documentElement } = document;
    const previousOverflow = body.style.overflow;
    const previousPosition = body.style.position;
    const previousTop = body.style.top;
    const previousWidth = body.style.width;
    const previousPaddingRight = body.style.paddingRight;
    const scrollbarGap = window.innerWidth - documentElement.clientWidth;

    body.style.overflow = "hidden";
    body.style.position = "fixed";
    body.style.top = `-${scrollY}px`;
    body.style.width = "100%";
    if (scrollbarGap > 0) {
      body.style.paddingRight = `${scrollbarGap}px`;
    }

    return () => {
      body.style.overflow = previousOverflow;
      body.style.position = previousPosition;
      body.style.top = previousTop;
      body.style.width = previousWidth;
      body.style.paddingRight = previousPaddingRight;
      window.scrollTo(0, scrollY);
    };
  }, [megaMenuOpen]);

  // Show header on scroll up / hide on scroll down - all screen sizes.
  // Toggle classes on the bar directly so scroll does not re-render the header tree.
  useEffect(() => {
    lastScrollY.current = window.scrollY;
    const bar = headerBarRef.current;
    if (!bar) return;

    const setVisible = (visible) => {
      bar.classList.toggle("translate-y-0", visible);
      bar.classList.toggle("-translate-y-full", !visible);
    };

    const onScroll = () => {
      const y = Math.max(0, window.scrollY);
      const delta = y - lastScrollY.current;

      if (
        menuOpenRef.current ||
        servicesMenuOpenRef.current ||
        workMenuOpenRef.current
      ) {
        setVisible(true);
        lastScrollY.current = y;
        return;
      }

      if (y <= 8) {
        setVisible(true);
      } else if (delta > 6) {
        setVisible(false);
      } else if (delta < -6) {
        setVisible(true);
      }

      lastScrollY.current = y;
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    if (!(menuOpen || servicesMenuOpen || workMenuOpen)) return;
    const bar = headerBarRef.current;
    if (!bar) return;
    bar.classList.add("translate-y-0");
    bar.classList.remove("-translate-y-full");
  }, [menuOpen, servicesMenuOpen, workMenuOpen]);

  return (
    <header className="relative z-[100] w-full">
      {/* Reserves layout space so content doesn't jump under the fixed bar */}
      <div
        aria-hidden
        className="w-full"
        style={{
          height: `calc(${headerHeight}px + var(--independence-banner-height, 0px))`,
        }}
      />

      <div
        ref={headerBarRef}
        className="fixed inset-x-0 top-[var(--independence-banner-height,0px)] z-[110] w-full bg-[#0D1334] translate-y-0 transition-transform duration-300 ease-out will-change-transform"
      >
        <div
          ref={headerRef}
          className="mx-auto flex w-full max-w-8xl items-center justify-between px-8 py-5 md:px-12"
        >
        <Link
          href="/"
          title="Ritz Media World"
          target="_blank"
          rel="noopener noreferrer"
          onClick={handleLogoClick}
          className="shrink-0 overflow-hidden"
        >
          <span
            data-header-reveal
            className="inline-block"
            style={{ "--hdr-i": 0 }}
          >
            <Image
              src="/logo/rmw.logo.png"
              alt="Ritz Media World"
              title="Ritz Media World"
              width={180}
              height={72}
              className="h-12 w-auto md:h-14"
              preload
              sizes="180px"
            />
          </span>
        </Link>

        <div className="flex items-center gap-8 text-right md:gap-10">
          <nav className="hidden items-center gap-8 md:flex md:gap-10">
            <Link
              href="/about.html"
              title="About"
              target="_blank"
              rel="noopener noreferrer"
              className={`${linkClass} overflow-hidden`}
            >
              <span
                data-header-reveal
                className="inline-block"
                style={{ "--hdr-i": 1 }}
              >
                ABOUT
              </span>
            </Link>

            <div
              className="relative"
              onMouseEnter={isDesktop ? openServicesMenu : undefined}
              onMouseLeave={isDesktop ? closeServicesMenu : undefined}
            >
              <span
                data-header-reveal
                className="inline-flex items-center gap-1.5 overflow-hidden"
                style={{ "--hdr-i": 2 }}
              >
                <Link
                  href="/services"
                  title="Services"
                  rel="noopener noreferrer"
                  className={linkClass}
                >
                  SERVICES
                </Link>
                <button
                  type="button"
                  aria-label={
                    servicesMenuOpen ? "Close services menu" : "Open services menu"
                  }
                  aria-haspopup="true"
                  aria-expanded={servicesMenuOpen}
                  className={`${linkClass} inline-flex cursor-pointer items-center p-0`}
                  onClick={(event) => {
                    event.preventDefault();
                    toggleServicesMenu();
                  }}
                >
                  <i
                    className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${servicesMenuOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </button>
              </span>
            </div>

            <div
              className="relative"
              onMouseEnter={isDesktop ? openWorkMenu : undefined}
              onMouseLeave={isDesktop ? closeWorkMenu : undefined}
            >
              <button
                type="button"
                className={`${linkClass} overflow-hidden`}
                aria-haspopup="true"
                aria-expanded={workMenuOpen}
                onClick={(event) => {
                  event.preventDefault();
                  toggleWorkMenu();
                }}
              >
                <span
                  data-header-reveal
                  className="inline-flex items-center gap-1.5"
                  style={{ "--hdr-i": 3 }}
                >
                  OUR WORK
                  <i
                    className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${workMenuOpen ? "rotate-180" : ""}`}
                    aria-hidden
                  />
                </span>
              </button>
            </div>

            {navLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                title={link.label}
                target="_blank"
                rel="noopener noreferrer"
                className={`${linkClass} overflow-hidden`}
              >
                <span
                  data-header-reveal
                  className="inline-block"
                  style={{ "--hdr-i": 4 }}
                >
                  {link.label}
                </span>
              </Link>
            ))}
          </nav>

          <button
            type="button"
            aria-label={menuOpen ? "Close menu" : "Open menu"}
            aria-expanded={menuOpen}
            onClick={() => setMenuOpen((open) => !open)}
            className="shrink-0 cursor-pointer overflow-hidden md:hidden"
          >
            <span
              data-header-reveal
              className="inline-block"
              style={{ "--hdr-i": 1 }}
            >
              <Image
                src="/logo/menu.png"
                alt={menuOpen ? "Close menu" : "Open menu"}
                title={menuOpen ? "Close menu" : "Open menu"}
                width={36}
                height={28}
                sizes="36px"
                className="h-5 w-auto md:h-6"
              />
            </span>
          </button>
        </div>
        </div>
      </div>

      <div
        className={`fixed inset-0 z-[60] bg-black/50 transition-opacity duration-300 md:hidden ${
          menuOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
        }`}
        onClick={() => setMenuOpen(false)}
        aria-hidden={!menuOpen}
      />

      <nav
        className={`fixed top-0 right-0 z-[70] flex h-full w-[280px] max-w-[80vw] flex-col gap-8 bg-[#0D1334] px-8 pb-8 pt-24 transition-transform duration-300 ease-out md:hidden ${
          menuOpen ? "translate-x-0" : "translate-x-full"
        }`}
        aria-hidden={!menuOpen}
      >
        <button
          type="button"
          aria-label="Close menu"
          onClick={() => {
            setMenuOpen(false);
            setWorkMenuOpen(false);
          }}
          className="absolute top-8 right-8 flex cursor-pointer items-center justify-center text-white"
        >
          <i className="ri-close-line text-[22px]" aria-hidden />
        </button>
        <Link
          href="/about.html"
          title="About"
          target="_blank"
          rel="noopener noreferrer"
          className={linkClass}
          onClick={() => setMenuOpen(false)}
        >
          ABOUT
        </Link>

        <div className={`${linkClass} flex w-full items-center justify-between gap-3 text-left`}>
          <Link
            href="/services"
            title="Services"
            rel="noopener noreferrer"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            SERVICES
          </Link>
          <button
            type="button"
            aria-label={
              servicesMenuOpen ? "Close services menu" : "Open services menu"
            }
            aria-haspopup="true"
            aria-expanded={servicesMenuOpen}
            className="inline-flex cursor-pointer items-center p-0 text-inherit"
            onClick={() => {
              setMenuOpen(false);
              toggleServicesMenu();
            }}
          >
            <i
              className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${servicesMenuOpen ? "rotate-180" : ""}`}
              aria-hidden
            />
          </button>
        </div>

        <button
          type="button"
          className={`${linkClass} flex w-full items-center justify-between text-left`}
          aria-haspopup="true"
          aria-expanded={workMenuOpen}
          onClick={() => {
            setMenuOpen(false);
            toggleWorkMenu();
          }}
        >
          OUR WORK
          <i
            className={`ri-arrow-down-s-line text-lg transition-transform duration-200 ${workMenuOpen ? "rotate-180" : ""}`}
            aria-hidden
          />
        </button>

        {navLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            title={link.label}
            target="_blank"
            rel="noopener noreferrer"
            className={linkClass}
            onClick={() => setMenuOpen(false)}
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {servicesMenuMounted ? (
      <div
        className={`fixed inset-x-0 bottom-0 z-[105] ${
          servicesMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          top: `calc(${headerHeight}px + var(--independence-banner-height, 0px))`,
        }}
        onMouseEnter={isDesktop ? openServicesMenu : undefined}
        onMouseLeave={isDesktop ? closeServicesMenu : undefined}
        aria-hidden={!servicesMenuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500 ${
            servicesMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`relative flex h-full w-full flex-col overflow-hidden transition-all duration-500 ease-out md:flex-row ${
            servicesMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          <button
            type="button"
            aria-label="Close services menu"
            onClick={() => setServicesMenuOpen(false)}
            className="absolute top-[14px] right-6 z-10 flex h-12 w-12 cursor-pointer items-center justify-center text-[#c99237] transition-transform duration-300 hover:rotate-90 md:right-10 lg:top-[24px] lg:mt-5 xl:top-[0px] xl:mt-5"
          >
            <i className="ri-close-line text-[42px] leading-none" aria-hidden />
          </button>

          <div className="order-2 flex w-full shrink-0 flex-col justify-start px-6 pb-8 pt-6 md:order-1 md:w-[38%] md:justify-between md:px-8 md:py-14 lg:w-[42%] lg:px-14 xl:px-20 xl:py-16">
            <p
              className="m-0 max-w-[420px] text-[24px] leading-[1.15] text-white md:text-[40px] lg:text-[55px] xl:text-[80px]"
              style={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
            >
              We craft brands that{" "}
              <span className="text-[#c99237]">get noticed</span>.
            </p>
            <div className="mt-6 md:mt-0">
              <p
                className="m-0 text-[16px] uppercase tracking-[0.18em] text-white/55"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Explore our services
              </p>
              
              <Link
                href="/services"
                title="View all services"
                rel="noopener noreferrer"
                onClick={() => setServicesMenuOpen(false)}
                className="mt-0 md:mt-3 inline-flex items-center gap-2 font-sequel text-[19px] font-[310] uppercase tracking-normal text-white transition-colors hover:text-[#c99237]"
              >
                View all services
                <i className="ri-arrow-right-up-line text-[21px]" aria-hidden />
              </Link>
            </div>
          </div>

          <nav className="order-1 flex min-w-0 flex-none flex-col items-end justify-start gap-1 overflow-y-auto px-6 pb-4 pt-14 text-right md:order-2 md:flex-1 md:justify-center md:gap-1.5 md:px-8 md:py-14 lg:gap-2 lg:px-14 xl:gap-2.5 xl:px-20">
            {services.map((service, index) => (
              <Link
                key={service.slug}
                href={`/services/${service.slug}`}
                title={service.title}
                rel="noopener noreferrer"
                onClick={() => setServicesMenuOpen(false)}
                style={{
                  transitionDelay: servicesMenuOpen ? `${80 + index * 35}ms` : "0ms",
                  fontFamily: '"League Spartan", sans-serif',
                  fontWeight: 600,
                }}
                className={`block w-full max-w-full text-[22px] uppercase leading-[1.05] tracking-[-0.02em] text-white transition-all duration-500 ease-out hover:text-[#c99237] md:text-[34px] lg:text-[clamp(22px,2.8vw,40px)] xl:text-[46px] ${
                  servicesMenuOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0 md:translate-x-8"
                }`}
              >
                {service.title}
              </Link>
            ))}
          </nav>
        </div>
      </div>
      ) : null}

      {workMenuMounted ? (
      <div
        className={`fixed inset-x-0 bottom-0 z-[105] ${
          workMenuOpen ? "pointer-events-auto" : "pointer-events-none"
        }`}
        style={{
          top: `calc(${headerHeight}px + var(--independence-banner-height, 0px))`,
        }}
        onMouseEnter={isDesktop ? openWorkMenu : undefined}
        onMouseLeave={isDesktop ? closeWorkMenu : undefined}
        aria-hidden={!workMenuOpen}
      >
        <div
          className={`absolute inset-0 bg-black/85 backdrop-blur-md transition-opacity duration-500 ${
            workMenuOpen ? "opacity-100" : "opacity-0"
          }`}
        />

        <div
          className={`relative flex h-full w-full flex-col overflow-hidden transition-all duration-500 ease-out md:flex-row ${
            workMenuOpen ? "translate-y-0 opacity-100" : "-translate-y-3 opacity-0"
          }`}
        >
          <button
            type="button"
            aria-label="Close work menu"
            onClick={() => {
              setWorkMenuOpen(false);
              setPortfolioSubOpen(false);
            }}
            className="absolute top-[14px] right-6 z-10 flex h-12 w-12 cursor-pointer items-center justify-center text-[#c99237] transition-transform duration-300 hover:rotate-90 md:right-10 lg:top-[24px] lg:mt-5 xl:top-[0px] xl:mt-5"
          >
            <i className="ri-close-line text-[42px] leading-none" aria-hidden />
          </button>

          <div className="order-2 flex w-full shrink-0 flex-col justify-start px-6 pb-8 pt-6 md:order-1 md:w-[38%] md:justify-between md:px-8 md:py-14 lg:w-[42%] lg:px-14 xl:px-20 xl:py-16">
            <p
              className="m-0 max-w-[420px] text-[24px] leading-[1.15] text-white md:text-[40px] lg:text-[55px] xl:text-[80px]"
              style={{ fontFamily: '"League Spartan", sans-serif', fontWeight: 600 }}
            >
              We create work that{" "}
              <span className="text-[#c99237]">stands out</span>.
            </p>
            <div className="mt-6 md:mt-0">
              <p
                className="m-0 text-[16px] uppercase tracking-[0.18em] text-white/55"
                style={{ fontFamily: "Montserrat, sans-serif" }}
              >
                Explore our work
              </p>
              <Link
                href="/work/portfolio"
                title="View portfolio"
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => {
              setWorkMenuOpen(false);
              setPortfolioSubOpen(false);
            }}
                className="mt-3 inline-flex items-center gap-2 font-sequel text-[19px] font-[310] uppercase tracking-normal text-white transition-colors hover:text-[#c99237]"
              >
                View portfolio
                <i className="ri-arrow-right-up-line text-[21px]" aria-hidden />
              </Link>
            </div>
          </div>

          <nav className="order-1 flex min-w-0 flex-none flex-col items-end justify-start gap-2 overflow-y-auto px-6 pb-4 pt-14 text-right md:order-2 md:flex-1 md:justify-start md:gap-3 md:px-8 md:pt-14 md:pb-14 lg:gap-4 lg:px-14 xl:gap-5 xl:px-20">
            {workLinks.map((item, index) => (
              <div
                key={item.href}
                className="relative w-full"
                onMouseEnter={() => {
                  if (item.children) setPortfolioSubOpen(true);
                }}
                onMouseLeave={() => {
                  if (item.children) setPortfolioSubOpen(false);
                }}
              >
                <Link
                  href={item.href}
                  title={item.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => {
                    setPortfolioSubOpen(false);
                    setWorkMenuOpen(false);
                  }}
                  style={{
                    transitionDelay: workMenuOpen ? `${80 + index * 35}ms` : "0ms",
                    fontFamily: '"League Spartan", sans-serif',
                    fontWeight: 600,
                  }}
                  className={`flex w-full max-w-full items-center justify-end text-[22px] uppercase leading-[1.05] tracking-[-0.02em] text-white transition-all duration-500 ease-out hover:text-[#c99237] md:text-[34px] lg:text-[clamp(22px,2.8vw,40px)] xl:text-[46px] ${
                    workMenuOpen
                      ? "translate-x-0 opacity-100"
                      : "translate-x-4 opacity-0 md:translate-x-8"
                  }`}
                >
                  <span className="inline-flex items-center gap-2">
                    <span>{item.label}</span>
                    {item.children ? (
                      <i
                        className={`ri-arrow-down-s-line text-[1em] leading-none transition-transform duration-200 ${
                          portfolioSubOpen ? "rotate-180" : ""
                        }`}
                        aria-hidden
                      />
                    ) : null}
                  </span>
                </Link>

                {item.children ? (
                  <div
                    className={`grid w-full transition-[grid-template-rows,margin,opacity] duration-500 ease-out ${
                      portfolioSubOpen
                        ? "mt-3 grid-rows-[1fr] opacity-100 md:mt-4"
                        : "mt-0 grid-rows-[0fr] opacity-0"
                    }`}
                  >
                    <div className="overflow-hidden">
                      <div className="flex w-full flex-col items-end gap-2 md:gap-3">
                        {item.children.map((subItem, subIndex) => (
                          <Link
                            key={subItem.label}
                            href={subItem.href}
                            title={subItem.label}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={() => {
                              setPortfolioSubOpen(false);
                              setWorkMenuOpen(false);
                            }}
                            style={{
                              transitionDelay: portfolioSubOpen
                                ? `${60 + subIndex * 45}ms`
                                : "0ms",
                              fontFamily: '"League Spartan", sans-serif',
                              fontWeight: 500,
                            }}
                            className={`block w-full max-w-full text-[15px] uppercase leading-[1.1] tracking-[-0.01em] text-white/75 transition-all duration-500 ease-out hover:text-[#c99237] md:text-[17px] lg:text-[18px] xl:text-[22px] ${
                              portfolioSubOpen
                                ? "translate-y-0 opacity-100"
                                : "-translate-y-2 opacity-0"
                            }`}
                          >
                            {subItem.label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                ) : null}
              </div>
            ))}
          </nav>
        </div>
      </div>
      ) : null}
    </header>
  );
};

export default Header;
