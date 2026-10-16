/**
 * Public marketing/static App Router paths (no dynamic segments).
 * Keep in sync with app route pages in new-RMW-2.
 */
const STATIC_PAGE_PATHS = [
  "/",
  "/about.html",
  "/blog",
  "/career",
  "/contact",
  "/gallery",
  "/case-study",
  "/services",
  "/services/digital-marketing",
  "/services/influencer-marketing-agency-in-india",
  "/services/celebrity-endorsements",
  "/services/web-designing-and-development",
  "/services/content-marketing",
  "/services/radio-advertising",
  "/services/print-advertising",
  "/services/creative-services",
  "/portfolio",
  "/portfolio/web-design",
  "/portfolio/brand-identity",
  "/portfolio/creative",
  "/portfolio/brand-films",
  "/work/portfolio",
  "/work/portfolio/brand-identity",
  "/work/portfolio/websites-and-landing-pages",
  "/work/portfolio/creatives-and-ai-videos",
];

function normalizeStaticPath(p) {
  if (typeof p !== "string") return null;
  let path = p.trim();
  if (!path || path === "/") return "/";
  path = path.replace(/\/+$/, "");
  if (!path.startsWith("/")) path = `/${path}`;
  return path;
}

/** @returns {string[]} deduplicated paths with leading slash */
function getStaticPagePaths() {
  const out = new Map();
  for (const raw of STATIC_PAGE_PATHS) {
    const n = normalizeStaticPath(raw);
    if (n) out.set(n, true);
  }
  return Array.from(out.keys());
}

module.exports = {
  STATIC_PAGE_PATHS,
  getStaticPagePaths,
};
