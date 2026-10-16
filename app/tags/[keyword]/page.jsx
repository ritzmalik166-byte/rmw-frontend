import { cache } from "react";
import { notFound } from "next/navigation";
import Header from "../../common/Header";
import Footer from "../../component/latest/Footer";
import OverlaySection1 from "../../component/latest/OverlaySection1";
import { TagsKeywordPage } from "../../component/case-study/TagsQueryPage";
import {
  formatTagTitle,
  getAllTagSlugs,
  getBlogsByTagSlug,
} from "../../../lib/caseStudyApi";

export const revalidate = 3600;

const getTagBlogs = cache(getBlogsByTagSlug);

const hasNoBlogs = (blogs) => Array.isArray(blogs) && blogs.length === 0;

export async function generateStaticParams() {
  const tags = await getAllTagSlugs();
  return tags.map((keyword) => ({ keyword }));
}

export async function generateMetadata({ params }) {
  const { keyword } = await params;
  const title = formatTagTitle(keyword);
  const pageUrl = `https://ritzmediaworld.com/tags/${keyword}`;

  if (hasNoBlogs(await getTagBlogs(keyword))) {
    return {
      title: `${title} | Ritz Media World`,
      robots: { index: false, follow: false },
    };
  }

  return {
    title: `${title} | Ritz Media World`,
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function TagsKeywordRoutePage({ params }) {
  const { keyword } = await params;
  const blogs = await getTagBlogs(keyword);

  if (hasNoBlogs(blogs)) {
    notFound();
  }

  return (
    <>
      <Header />
      <main>
        <TagsKeywordPage keyword={keyword} initialBlogs={blogs ?? undefined} />
      </main>
      <Footer section={<OverlaySection1 />} />
    </>
  );
}
