import { notFound, permanentRedirect } from "next/navigation";
import { slugifyTag } from "../../lib/caseStudyApi";

export default async function TagsPage({ searchParams }) {
  const { keyword } = await searchParams;
  const slug = slugifyTag(Array.isArray(keyword) ? keyword[0] : keyword);

  if (slug) {
    permanentRedirect(`/tags/${slug}`);
  }

  notFound();
}
