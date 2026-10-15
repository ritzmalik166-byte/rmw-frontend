import React from "react";
import { notFound } from "next/navigation";
import Header from "../../common/Header";
import Footer from "../../component/latest/Footer";
import OverlaySection1 from "../../component/latest/OverlaySection1";
import { ServicesHero } from "../../component/services/LazyServiceSections";
import ServiceDetailIntro from "../../component/services/ServiceDetailIntro";
import ServiceDetailCarousel from "../../component/services/ServiceDetailCarousel";
import ServiceDetailMediaSection from "../../component/services/ServiceDetailMediaSection";
import { getServiceBySlug, services } from "../../../data/services";
import { getServiceSeoHeadings } from "../../../data/serviceSeoHeadings";

function ServiceSeoHeadings({ slug }) {
  const seo = getServiceSeoHeadings(slug);
  if (!seo) return null;

  return (
    <div className="sr-only">
      {seo.h1.map((title) => (
        <h1 key={title}>{title}</h1>
      ))}
      {seo.sections.map((section) => (
        <React.Fragment key={section.h2}>
          <h2>{section.h2}</h2>
          {section.h3?.map((title) => (
            <h3 key={`${section.h2}-${title}`}>{title}</h3>
          ))}
        </React.Fragment>
      ))}
    </div>
  );
}

export const dynamic = "force-static";
export const dynamicParams = false;

export function generateStaticParams() {
  return services.map((service) => ({ slug: service.slug }));
}

export async function generateMetadata({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    return { title: "Service Not Found | Ritz Media World" };
  }

  const pageUrl = `https://ritzmediaworld.com/services/${service.slug}`;

  return {
    title: service.metaTitle || `${service.title} | Ritz Media World`,
    description: service.description,
    alternates: {
      canonical: pageUrl,
    },
  };
}

export default async function ServiceDetailPage({ params }) {
  const { slug } = await params;
  const service = getServiceBySlug(slug);

  if (!service) {
    notFound();
  }

  return (
    <>
      <Header />
      <ServiceSeoHeadings slug={service.slug} />
      {!service.intro ? (
        <ServicesHero
          lineOne={service.title}
          singleLine
          subtext={[service.description]}
          subtextItalic={false}
        />
      ) : null}
      {service.intro ? (
        <ServiceDetailIntro intro={service.intro} title={service.title} />
      ) : null}
      {service.carousel ? (
        <ServiceDetailCarousel
          carousel={service.carousel}
          serviceSlug={service.slug}
        />
      ) : null}
      {service.mediaSection ? (
        <ServiceDetailMediaSection mediaSection={service.mediaSection} />
      ) : null}
      <Footer section={<OverlaySection1 />} />
    </>
  );
}
