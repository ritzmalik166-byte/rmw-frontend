const API_BASE =
  process.env.API_BASE_URL ||
  process.env.NEXT_PUBLIC_API_BASE_URL ||
  "https://ritzmediaworld.com";

// Build-scoped cache-buster for fetch deduplication during `next build` pre-rendering.
const BUILD_TAG =
  process.env.NEXT_BUILD_ID ||
  process.env.GITHUB_SHA ||
  process.env.VERCEL_GIT_COMMIT_SHA ||
  Date.now().toString();

function withBuildTag(url) {
  return `${url}${url.includes("?") ? "&" : "?"}_b=${BUILD_TAG}`;
}

export function resolveBlogImageUrl(path) {
  if (!path) return "";
  if (path.startsWith("http://") || path.startsWith("https://")) return path;
  const normalized = path.trim();
  if (!normalized) return "";
  if (normalized.includes("/images")) {
    const tail = normalized.split("/images")[1] || "";
    return tail ? `${API_BASE}/api/images${tail}` : "";
  }
  return `${API_BASE}/blogs/${normalized.replace(/^\/+/, "")}`;
}

export function normalizeBlogItem(item) {
  return {
    title: item?.title || item?.blogTitle || "",
    slug: item?.slug || item?.blogSlug || "",
    banner: item?.blog_image || item?.blogBanner || item?.banner || "",
    meta_description: item?.meta_description || item?.mtDesc || "",
    description: item?.description || item?.blogDescription || "",
    meta_keywords: item?.meta_keywords || item?.metaKeywords || "",
    created_at: item?.created_at || item?.createdAt || "",
  };
}

function getBlogTime(blog) {
  const parsed = new Date(blog?.created_at || "").getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

/**
 * Returns the most recent timestamp available on a blog record, preferring
 * an explicit update timestamp over the creation timestamp. Used to decide
 * which of two records (MySQL vs Mongo) for the same slug is actually the
 * fresher one, instead of blindly trusting whichever endpoint answered first.
 */
function getUpdatedTime(blog) {
  const raw =
    blog?.updated_at ||
    blog?.updatedAt ||
    blog?.created_at ||
    blog?.createdAt ||
    "";
  const parsed = new Date(raw).getTime();
  return Number.isNaN(parsed) ? 0 : parsed;
}

export function sortBlogsByDateDesc(blogs) {
  return [...blogs].sort((a, b) => getBlogTime(b) - getBlogTime(a));
}

const MAX_BLOG_PAGES = 60;
const BLOG_PAGE_BATCH_SIZE = 8;
const BLOG_REVALIDATE_SECONDS = 60;
const BLOG_FETCH_OPTIONS = { next: { revalidate: BLOG_REVALIDATE_SECONDS } };
const BLOG_MEMO_TTL_MS = BLOG_REVALIDATE_SECONDS * 1000;

function memoizeAsync(fn, ttlMs = BLOG_MEMO_TTL_MS) {
  let value;
  let expiresAt = 0;
  let inflight = null;

  return () => {
    if (value !== undefined && Date.now() < expiresAt) {
      return Promise.resolve(value);
    }
    if (inflight) return inflight;

    inflight = Promise.resolve()
      .then(() => fn())
      .then((result) => {
        value = result;
        expiresAt = Date.now() + ttlMs;
        return result;
      })
      .finally(() => {
        inflight = null;
      });

    return inflight;
  };
}

/** Paginate until an empty page. Do not stop on partial pages (Mongo ends ~page 11, MySQL starts ~page 12). */
async function fetchRawBlogPages(apiUrlBuilder, fetchOptions = BLOG_FETCH_OPTIONS) {
  const allBlogs = [];

  for (let start = 1; start <= MAX_BLOG_PAGES; start += BLOG_PAGE_BATCH_SIZE) {
    const end = Math.min(start + BLOG_PAGE_BATCH_SIZE - 1, MAX_BLOG_PAGES);
    const batch = await Promise.all(
      Array.from({ length: end - start + 1 }, (_, offset) => {
        const page = start + offset;
        return (async () => {
          try {
            const response = await fetch(apiUrlBuilder(page), fetchOptions);
            if (!response.ok) return { status: "skip" };
            const data = await response.json();
            const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
            if (!blogs.length) return { status: "empty" };
            return { status: "ok", blogs };
          } catch {
            return { status: "skip" };
          }
        })();
      }),
    );

    let hitEmpty = false;
    for (const result of batch) {
      if (result.status === "empty") {
        hitEmpty = true;
        break;
      }
      if (result.status === "ok") {
        allBlogs.push(...result.blogs);
      }
    }
    if (hitEmpty) break;
  }

  return allBlogs;
}

async function fetchAllBlogsFromApiUncached() {
  const rawBlogs = await fetchRawBlogPages(
    (page) => `${API_BASE}/api/get_all_blogs?page=${page}`,
  );
  return sortBlogsByDateDesc(rawBlogs.map(normalizeBlogItem));
}

export const fetchAllBlogsFromApi = memoizeAsync(fetchAllBlogsFromApiUncached);

/**
 * Sidebar/related blogs only need the newest page of listings.
 * Full `fetchAllBlogsFromApi` pagination must not run on every /[slug] render.
 */
async function fetchRecentBlogsFromApiUncached() {
  try {
    const response = await fetch(
      `${API_BASE}/api/get_all_blogs?page=1`,
      BLOG_FETCH_OPTIONS,
    );
    if (!response.ok) return [];
    const data = await response.json();
    const blogs = Array.isArray(data?.blogs) ? data.blogs : [];
    return sortBlogsByDateDesc(blogs.map(normalizeBlogItem));
  } catch (error) {
    console.warn("Recent blogs fetch failed:", error);
    return [];
  }
}

const fetchRecentBlogsFromApi = memoizeAsync(fetchRecentBlogsFromApiUncached);

function slugifyCategoryLink(name) {
  return String(name || "")
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function slugifyTag(keyword) {
  return String(keyword || "")
    .toLowerCase()
    .trim()
    .replace(/['"]/g, "")
    .replace(/,/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function addKeywordsToSet(blog, tagSet) {
  const raw = blog?.meta_keywords || blog?.metaKeywords || "";
  String(raw)
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean)
    .forEach((keyword) => {
      const slug = slugifyTag(keyword);
      if (slug) tagSet.add(slug);
    });
}

/**
 * Tag slug discovery for generateStaticParams.
 *
 * Uses existing `/api/all_blogs` (one request, includes meta_keywords) instead of
 * paginating `/api/get_all_blogs?page=1…N` and instead of getBlogBySlug fan-out.
 *
 * Limitation: `/api/category/case-study` only returns title/blog_image/slug (no
 * keywords), and there is no lightweight case-study keyword API. Case-study-only
 * tags are therefore not prelisted here; they still resolve on demand via
 * dynamicParams + `/api/my-sql/find-blogs-using-key`.
 */
export async function getAllTagSlugs() {
  const tagSet = new Set();

  try {
    const response = await fetch(`${API_BASE}/api/all_blogs`, BLOG_FETCH_OPTIONS);
    if (!response.ok) return [];

    const items = await response.json();
    if (!Array.isArray(items)) return [];

    items.forEach((blog) => addKeywordsToSet(blog, tagSet));
  } catch (error) {
    console.warn("Tag slug discovery via /api/all_blogs failed:", error);
    return [];
  }

  return [...tagSet];
}

export async function getTagSlugsFromCaseStudies() {
  return getAllTagSlugs();
}

export function formatCategoryTitle(slug) {
  return String(slug || "")
    .split("-")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

export function formatTagTitle(slug) {
  return formatCategoryTitle(slug);
}

export async function getCategoryLinks() {
  const categories = await getBlogCategories();
  return categories.map((category) => category.link).filter(Boolean);
}

/** Full category list for server-rendered blog pages (name + link). */
export async function getBlogCategories() {
  try {
    const response = await fetch(
      `${API_BASE}/api/blog/categories`,
      BLOG_FETCH_OPTIONS,
    );
    if (!response.ok) return [];
    const categories = await response.json();
    if (!Array.isArray(categories)) return [];
    return categories
      .map((category) => ({
        id: category.id,
        name: category.name,
        link: slugifyCategoryLink(category.name),
      }))
      .filter((category) => category.name && category.link);
  } catch (error) {
    console.warn("Blog categories fetch failed:", error);
    return [];
  }
}

export async function getCategoryBlogs(categoryLink) {
  if (!categoryLink) return [];

  try {
    const response = await fetch(
      `${API_BASE}/api/category/${categoryLink}`,
      BLOG_FETCH_OPTIONS,
    );
    if (!response.ok) return [];
    const items = await response.json();
    if (!Array.isArray(items)) return [];
    return items.map(normalizeBlogItem);
  } catch (error) {
    console.warn("Category blogs fetch failed:", error);
    return [];
  }
}

/**
 * Returns `[]` only when the API confirms the tag has no blogs, and `null` when
 * the lookup itself failed, so callers never 404 a tag because of an outage.
 */
export async function getBlogsByTagSlug(tagSlug) {
  if (!tagSlug) return [];

  try {
    const response = await fetch(
      `${API_BASE}/api/my-sql/find-blogs-using-key/${encodeURIComponent(tagSlug)}`,
      { next: { revalidate: 3600 } },
    );
    if (response.status === 404) return [];
    if (!response.ok) return null;
    const data = await response.json();
    if (!Array.isArray(data?.blogs)) return null;
    return data.blogs.map(normalizeBlogItem);
  } catch (error) {
    console.warn("Tag blogs fetch failed:", error);
    return null;
  }
}

async function getCaseStudyListUncached() {
  try {
    const response = await fetch(
      `${API_BASE}/api/category/case-study`,
      BLOG_FETCH_OPTIONS,
    );
    if (!response.ok) return [];
    const items = await response.json();
    if (!Array.isArray(items)) return [];
    return items.map(normalizeBlogItem);
  } catch (error) {
    console.warn("Case study list fetch failed:", error);
    return [];
  }
}

export const getCaseStudyList = memoizeAsync(getCaseStudyListUncached);

export async function getCaseStudySidebarData(currentSlug, blog) {
  const [caseStudyList, categories] = await Promise.all([
    getCaseStudyList(),
    fetchSidebarCategories(),
  ]);

  const keywords = String(blog?.meta_keywords || "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const relatedBlogs = caseStudyList
    .filter((item) => item.slug && item.slug !== currentSlug)
    .slice(0, 4);

  return {
    allBlogs: caseStudyList,
    categories,
    keywords,
    relatedBlogs,
  };
}

async function fetchSidebarCategoriesUncached() {
  const categoriesResponse = await fetch(
    `${API_BASE}/api/blog/categories`,
    BLOG_FETCH_OPTIONS,
  ).catch(() => null);

  let categories = [];
  if (categoriesResponse?.ok) {
    const rawCategories = await categoriesResponse.json();
    if (Array.isArray(rawCategories)) {
      categories = await Promise.all(
        rawCategories.map(async (category) => {
          const link = slugifyCategoryLink(category.name);
          let total_blogs = 0;

          try {
            const response = await fetch(
              `${API_BASE}/api/category/${link}`,
              BLOG_FETCH_OPTIONS,
            );
            if (response.ok) {
              const items = await response.json();
              total_blogs = Array.isArray(items) ? items.length : 0;
            }
          } catch {
            total_blogs = 0;
          }

          return {
            id: category.id,
            name: category.name,
            link,
            total_blogs,
          };
        }),
      );
      categories = categories.sort((a, b) => {
        if (b.total_blogs !== a.total_blogs)
          return b.total_blogs - a.total_blogs;
        return a.name.localeCompare(b.name);
      });
    }
  }

  return categories;
}

const fetchSidebarCategories = memoizeAsync(fetchSidebarCategoriesUncached);

export async function getBlogSidebarData(currentSlug, blog) {
  const [recentBlogs, categories] = await Promise.all([
    fetchRecentBlogsFromApi(),
    fetchSidebarCategories(),
  ]);

  const keywords = String(blog?.meta_keywords || "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  // Same selection as before: newest-first list, exclude current, take 4.
  // Page 1 is already date-desc, so related picks match the old full-list result.
  const relatedBlogs = recentBlogs
    .filter((item) => item.slug && item.slug !== currentSlug)
    .slice(0, 4);

  return {
    allBlogs: recentBlogs,
    categories,
    keywords,
    relatedBlogs,
  };
}

export async function isCaseStudySlug(slug) {
  if (!slug) return false;
  const slugs = await getCaseStudySlugs();
  return slugs.includes(slug);
}

export async function getCaseStudySlugs() {
  const items = await getCaseStudyList();
  return items.map((item) => item.slug).filter(Boolean);
}

/** Start shared blog-detail caches while the slug lookup is in flight. */
export function prefetchSlugDetailCaches() {
  void fetchRecentBlogsFromApi().catch(() => {});
  void fetchSidebarCategories().catch(() => {});
  void getCaseStudyList().catch(() => {});
}

const RESERVED_BLOG_SLUGS = new Set([
  "about",
  "blog",
  "contact",
  "services",
  "case-study",
  "tags",
  "category",
]);

/** Slugs with path-invalid chars break static export on Windows (e.g. ":" in folder names). */
function isStaticExportSafeSlug(slug) {
  if (!slug || typeof slug !== "string") return false;
  if (slug.includes("..")) return false;
  return !/[<>:"|?*\\]/.test(slug);
}


export async function getAllBlogSlugs() {
  const slugSet = new Set();

  const rawBlogs = await fetchRawBlogPages(
    (page) => `${API_BASE}/api/get_all_blogs?page=${page}`,
  );
  rawBlogs.forEach((blog) => {
    const slug = blog?.slug || blog?.blogSlug;
    if (slug) slugSet.add(slug);
  });

  const caseSlugs = await getCaseStudySlugs();
  caseSlugs.forEach((slug) => slugSet.add(slug));

  const categoryLinks = await getCategoryLinks();
  await Promise.all(
    categoryLinks.map(async (link) => {
      const blogs = await getCategoryBlogs(link);
      blogs.forEach((blog) => {
        if (blog.slug) slugSet.add(blog.slug);
      });
    }),
  );

  return [...slugSet].filter(
    (slug) => !RESERVED_BLOG_SLUGS.has(slug) && isStaticExportSafeSlug(slug),
  );
}

/**
 * Escape plain text before injecting it into generated HTML headings.
 */
function escapeHtmlText(s) {
  return String(s)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

/**
 * Resolve the HTML body shown on blog detail pages.
 *
 * Mongo/admin blogs store the live editor HTML in `blogBody[].metaDescription`.
 * Admin updates only write that array - they do not refresh the top-level
 * `blogDescription` field - so preferring `blogDescription` alone leaves the
 * live site on stale content (missing interlinks / wording changes).
 * Fall back to description/blogDescription for MySQL-era records.
 */
function getRichDescription(blog) {
  if (Array.isArray(blog?.blogBody) && blog.blogBody.length > 0) {
    const blogTitle = typeof blog?.blogTitle === "string" ? blog.blogTitle : blog?.title || "";
    return blog.blogBody
      .map((page) => {
        const metaTitle = page?.metaTitle ?? "";
        const hideTitle =
          Boolean(metaTitle) &&
          Boolean(blogTitle) &&
          blogTitle.includes(metaTitle);
        const heading = hideTitle ? "" : metaTitle ? `<h2>${escapeHtmlText(metaTitle)}</h2>` : "";
        return heading + (page?.metaDescription ?? "");
      })
      .join("");
  }

  return blog?.description || blog?.blogDescription || "";
}

function normalizeBlogDetail(blog, slug) {
  if (!blog) return null;

  return {
    ...blog,
    title: blog.title || blog.blogTitle || "",
    slug: blog.slug || blog.blogSlug || slug || "",
    description: getRichDescription(blog),
    blog_image: blog.blog_image || blog.blogBanner || blog.banner || "",
    banner: blog.banner || blog.blogBanner || blog.blog_image || "",
    meta_title: blog.meta_title || blog.metaTitle || "",
    meta_description: blog.meta_description || blog.mtDesc || "",
    meta_keywords: blog.meta_keywords || blog.metaKeywords || "",
    created_at: blog.created_at || blog.createdAt || "",
    updated_at: blog.updated_at || blog.updatedAt || "",
  };
}

/**
 * Fetches the MySQL copy of a blog detail record, if any.
 * Returns null on any failure or "not found" response - never throws -
 * so the caller can safely race this against the Mongo fetch.
 */
async function fetchMysqlBlogDetail(normalized) {
  try {
    const response = await fetch(
      withBuildTag(`${API_BASE}/api/blog/${encodeURIComponent(normalized)}`),
      BLOG_FETCH_OPTIONS,
    );
    if (!response.ok) return null;
    const data = await response.json();
    const blog = normalizeBlogDetail(data?.blog, normalized);
    return blog?.title || blog?.slug ? blog : null;
  } catch (error) {
    console.warn("MySQL blog fetch failed:", error);
    return null;
  }
}

/**
 * Fetches the Mongo copy of a blog detail record, if any.
 * Returns null on any failure or "not found" response - never throws -
 * so the caller can safely race this against the MySQL fetch.
 */
async function fetchMongoBlogDetail(normalized) {
  try {
    const response = await fetch(
      withBuildTag(
        `${API_BASE}/api/ritz_blogs/get-single-blog/${encodeURIComponent(normalized)}`,
      ),
      BLOG_FETCH_OPTIONS,
    );
    if (!response.ok) return null;
    const data = await response.json();
    const blog = normalizeBlogDetail(data?.blog, normalized);
    return blog?.title || blog?.slug ? blog : null;
  } catch (error) {
    console.warn("Mongo blog fetch failed:", error);
    return null;
  }
}

/**
 * Server-side / build-time blog lookup.
 *
 * IMPORTANT: this project has two backends for blog detail records (MySQL
 * and Mongo, mid-migration - see the page-size comment on
 * fetchRawBlogPages). A slug can exist in BOTH systems simultaneously with
 * different content. The previous implementation queried MySQL first and
 * returned immediately on any successful response, without ever checking
 * whether Mongo had a newer version of the same slug. That is the root
 * cause of blog pages being generated with stale content: whichever system
 * responded first (and had a record) won, regardless of which one was
 * actually up to date.
 *
 * Fix: query both sources in parallel and, when both return a record for
 * the slug, keep the one with the more recent updated_at/created_at
 * timestamp instead of "first responder wins".
 */
export async function getBlogBySlug(slug) {
  if (!slug) return null;

  try {
    const normalized = decodeURIComponent(slug).replace(/-+/g, "-");

    const [mysqlBlog, mongoBlog] = await Promise.all([
      fetchMysqlBlogDetail(normalized),
      fetchMongoBlogDetail(normalized),
    ]);

    if (mysqlBlog && mongoBlog) {
      return getUpdatedTime(mongoBlog) >= getUpdatedTime(mysqlBlog)
        ? mongoBlog
        : mysqlBlog;
    }

    return mysqlBlog || mongoBlog || null;
  } catch (error) {
    console.warn("Blog fetch failed:", error);
    return null;
  }
}

/** Same-origin API path - proxied on Vercel (vercel.json) and in dev (next.config rewrites). */
export function getProxiedApiUrl(path) {
  return path.startsWith("/") ? path : `/${path}`;
}

/**
 * Client-side twin of getBlogBySlug. Same dual-backend race fix applies
 * here: query MySQL and Mongo in parallel and pick the fresher record
 * instead of short-circuiting on whichever resolves first.
 */
async function fetchBlogBySlugFromPaths(slug, apiUrl) {
  if (!slug) return null;

  const normalized = decodeURIComponent(slug).replace(/-+/g, "-");

  const fetchMysql = async () => {
    try {
      const response = await fetch(
        apiUrl(`/api/blog/${encodeURIComponent(normalized)}`),
      );
      if (!response.ok) return null;
      const data = await response.json();
      const blog = normalizeBlogDetail(data?.blog, normalized);
      return blog?.title || blog?.slug ? blog : null;
    } catch (error) {
      console.warn("Blog fetch failed (mysql):", error);
      return null;
    }
  };

  const fetchMongo = async () => {
    try {
      const response = await fetch(
        apiUrl(
          `/api/ritz_blogs/get-single-blog/${encodeURIComponent(normalized)}`,
        ),
      );
      if (!response.ok) return null;
      const data = await response.json();
      const blog = normalizeBlogDetail(data?.blog, normalized);
      return blog?.title || blog?.slug ? blog : null;
    } catch (error) {
      console.warn("Blog fetch failed (mongo):", error);
      return null;
    }
  };

  const [mysqlBlog, mongoBlog] = await Promise.all([
    fetchMysql(),
    fetchMongo(),
  ]);

  if (mysqlBlog && mongoBlog) {
    return getUpdatedTime(mongoBlog) >= getUpdatedTime(mysqlBlog)
      ? mongoBlog
      : mysqlBlog;
  }

  return mysqlBlog || mongoBlog || null;
}

export async function fetchBlogBySlugClient(slug) {
  return fetchBlogBySlugFromPaths(slug, getProxiedApiUrl);
}

export async function fetchCategoryBlogsClient(categoryLink) {
  if (!categoryLink) return [];

  try {
    const response = await fetch(
      getProxiedApiUrl(`/api/category/${categoryLink}`),
    );
    if (!response.ok) return [];
    const items = await response.json();
    if (!Array.isArray(items)) return [];
    return items.map(normalizeBlogItem);
  } catch (error) {
    console.warn("Category blogs fetch failed:", error);
    return [];
  }
}

export async function fetchCaseStudySlugsClient() {
  try {
    const response = await fetch(getProxiedApiUrl("/api/category/case-study"));
    if (!response.ok) return [];
    const items = await response.json();
    if (!Array.isArray(items)) return [];
    return items.map((item) => item.slug).filter(Boolean);
  } catch (error) {
    console.warn("Case study slugs fetch failed:", error);
    return [];
  }
}

export async function checkCaseStudySlugClient(slug) {
  if (!slug) return false;
  const slugs = await fetchCaseStudySlugsClient();
  return slugs.includes(slug);
}

export async function fetchAllBlogsClient() {
  const rawBlogs = await fetchRawBlogPages((page) =>
    getProxiedApiUrl(`/api/get_all_blogs?page=${page}`),
  );
  return sortBlogsByDateDesc(rawBlogs.map(normalizeBlogItem));
}

async function fetchSidebarCategoriesClient() {
  try {
    const categoriesResponse = await fetch(
      getProxiedApiUrl("/api/blog/categories"),
    );
    if (!categoriesResponse.ok) return [];

    const rawCategories = await categoriesResponse.json();
    if (!Array.isArray(rawCategories)) return [];

    const categories = await Promise.all(
      rawCategories.map(async (category) => {
        const link = slugifyCategoryLink(category.name);
        let total_blogs = 0;

        try {
          const response = await fetch(
            getProxiedApiUrl(`/api/category/${link}`),
          );
          if (response.ok) {
            const items = await response.json();
            total_blogs = Array.isArray(items) ? items.length : 0;
          }
        } catch {
          total_blogs = 0;
        }

        return {
          id: category.id,
          name: category.name,
          link,
          total_blogs,
        };
      }),
    );

    return categories.sort((a, b) => {
      if (b.total_blogs !== a.total_blogs) return b.total_blogs - a.total_blogs;
      return a.name.localeCompare(b.name);
    });
  } catch (error) {
    console.warn("Sidebar categories fetch failed:", error);
    return [];
  }
}

export async function fetchCaseStudySidebarDataClient(currentSlug, blog) {
  let caseStudyList = [];

  try {
    const response = await fetch(getProxiedApiUrl("/api/category/case-study"));
    if (response.ok) {
      const items = await response.json();
      if (Array.isArray(items)) {
        caseStudyList = items.map(normalizeBlogItem);
      }
    }
  } catch {
    caseStudyList = [];
  }

  const categories = await fetchSidebarCategoriesClient();
  const keywords = String(blog?.meta_keywords || "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const relatedBlogs = caseStudyList
    .filter((item) => item.slug && item.slug !== currentSlug)
    .slice(0, 4);

  return {
    allBlogs: caseStudyList,
    categories,
    keywords,
    relatedBlogs,
  };
}

export async function fetchBlogSidebarDataClient(currentSlug, blog) {
  const allBlogs = await fetchAllBlogsClient();
  const categories = await fetchSidebarCategoriesClient();
  const keywords = String(blog?.meta_keywords || "")
    .split(",")
    .map((keyword) => keyword.trim())
    .filter(Boolean);

  const relatedBlogs = allBlogs
    .filter((item) => item.slug && item.slug !== currentSlug)
    .slice(0, 4);

  return {
    allBlogs,
    categories,
    keywords,
    relatedBlogs,
  };
}