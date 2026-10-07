import React from "react";
import { notFound } from "next/navigation";
import Header from "../../../common/Header";
import Footer from "../../../component/latest/Footer";
import OverlaySection1 from "../../../component/latest/OverlaySection1";
import SubServiceSections from "../../../component/services/SubServiceSections";
import ServicesHero from "../../../component/services/ServicesHero";
import {
  getAllSubServiceParams,
  getSubServiceBySlug,
  getSubServiceHeroTitle,
  threeDRenderingSubServices,
} from "../../../../data/sub-services";
import { getSubServiceMeta, getSubServicePageData } from "../../../../lib/subServiceApi";

export function generateStaticParams() {
  return getAllSubServiceParams();
}

export async function generateMetadata({ params }) {
  const { slug, subSlug } = await params;
  const subService = getSubServiceBySlug(slug, subSlug);

  if (!subService) {
    return { title: "Service Not Found | Ritz Media World" };
  }

  const meta = await getSubServiceMeta(slug, subSlug);
  const pageUrl = `https://ritzmediaworld.com/services/${slug}/${subSlug}`;

  return {
    title: meta.title,
    description: meta.description,
    keywords: meta.keywords || undefined,
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function SubServicePage({ params }) {
  const { slug, subSlug } = await params;
  const subService = getSubServiceBySlug(slug, subSlug);

  if (!subService) {
    notFound();
  }

  const pageData = await getSubServicePageData(slug, subSlug);
  const heroTitle = getSubServiceHeroTitle(slug, subSlug, pageData.heading);
  const cards =
    slug === "3d-rendering"
      ? threeDRenderingSubServices
          .map((service, index) => {
            const card = service.cards?.[0];
            if (!card) return null;

            return {
              id: `${service.slug}-${index}`,
              title: card.title,
              description: card.description || "",
              image: card.image,
            };
          })
          .filter(Boolean)
      : pageData.cards;

  return (
      <>
      <Header />
      <h1 className="sr-only">{heroTitle}</h1>
      <ServicesHero
        variant="subService"
        lineOne={heroTitle}
        subtext={["Committed to Delivering Top-Quality Services"]}
        subtextItalic={false}
      />
      <SubServiceSections cards={cards} />
      <Footer section={<OverlaySection1 />} />
    </>
  );
}
