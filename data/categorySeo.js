/**
 * SEO meta + visually hidden heading hierarchies for `/category/[categorypage]`.
 * Only slugs listed here get custom meta/headings; others keep default behavior.
 */

/** @typedef {{ h2: string, h3?: string[] }} SeoSection */
/** @typedef {{
 *   title: string,
 *   description: string,
 *   keywords?: string[],
 *   h1: string,
 *   sections: SeoSection[],
 * }} CategorySeo */

/** @type {Record<string, CategorySeo>} */
export const categorySeoBySlug = {
  "artist-management-agency": {
    title: "Artist Management Agency | Ritz Media World",
    description:
      "Explore insights, trends, and resources on artist management, talent, events, branding, and entertainment from Ritz Media World.",
    keywords: [
      "Artist Management Agency",
      "Artist Management",
      "Artist Management Company",
      "Talent Management",
      "Celebrity Management",
      "Artist Management Services",
    ],
    h1: "Artist Management Agency",
    sections: [
      { h2: "Artist Management Insights & Updates" },
      { h2: "Latest Artist Management Articles" },
      { h2: "Explore More Entertainment Insights" },
    ],
  },

  "best-ad-agency": {
    title: "Best Ad Agency | Advertising Insights & Trends | Ritz Media World",
    description:
      "Explore advertising insights, trends, and expert tips from Ritz Media World on ad campaigns, branding, digital advertising, and business growth.",
    keywords: [
      "Best Ad Agency",
      "Advertising Agency",
      "Ad Agency",
      "Advertising Company",
      "Digital Advertising Agency",
      "Advertising Agency Delhi NCR",
    ],
    h1: "Best Ad Agency",
    sections: [
      { h2: "Advertising Insights & Trends" },
      { h2: "Latest Advertising Articles" },
      { h2: "Explore More Marketing Insights" },
    ],
  },

  "case-study": {
    title: "Case Studies | Marketing, Branding & Business Insights | Ritz Media World",
    description:
      "Discover real stories, strategies, and results behind successful marketing, branding, and advertising campaigns, with practical insights you can learn from.",
    keywords: [
      "Case Studies",
      "Marketing Case Studies",
      "Branding Case Studies",
      "Advertising Case Studies",
      "Business Case Studies",
      "Digital Marketing Case Studies",
    ],
    h1: "Case Studies",
    sections: [],
  },

  "celebrity-endorsements-agency": {
    title: "Celebrity Endorsement Agency | Ritz Media World",
    description:
      "Explore celebrity endorsement insights, brand collaborations, celebrity marketing campaigns, and promotions from Ritz Media World.",
    keywords: [
      "Celebrity Endorsement Agency",
      "Celebrity Endorsement",
      "Celebrity Marketing",
      "Celebrity Brand Endorsements",
      "Celebrity Collaborations",
      "Celebrity Promotions",
    ],
    h1: "Celebrity Endorsement Agency",
    sections: [
      { h2: "Celebrity Endorsement Insights" },
      { h2: "Latest Celebrity Marketing Articles" },
      { h2: "Explore More Entertainment Insights" },
    ],
  },

  "creative-advertising-agency": {
    title:
      "Creative Advertising Agency | Creative Campaigns & Ideas | Ritz Media World",
    description:
      "Discover creative advertising ideas, campaigns, trends, and insights to see how brands use powerful concepts and storytelling to connect with their audience.",
    keywords: [
      "Creative Advertising Agency",
      "Creative Advertising",
      "Creative Ad Agency",
      "Advertising Campaigns",
      "Creative Advertising Ideas",
      "Advertising Agency",
    ],
    h1: "Creative Advertising Agency",
    sections: [
      { h2: "Creative Advertising Ideas & Insights" },
      { h2: "Latest Advertising Articles" },
      { h2: "Explore More Creative Work" },
    ],
  },

  "digital-marketing-agency": {
    title: "Digital Marketing Agency in India | Ritz Media World",
    description:
      "Grow your business with a digital marketing agency in India offering SEO, social media, content marketing, online advertising and strategies that drive real results.",
    keywords: [
      "digital marketing agency",
      "digital marketing agency in India",
      "digital marketing company",
      "SEO agency",
      "social media marketing agency",
      "digital marketing services",
    ],
    h1: "Digital Marketing Agency",
    sections: [
      {
        h2: "Digital Marketing Services",
        h3: [
          "Search Engine Optimization (SEO)",
          "Social Media Marketing",
          "Content Marketing",
          "Online Advertising",
          "Local SEO",
        ],
      },
      { h2: "Why Choose Ritz Media World?" },
      { h2: "Digital Marketing Agency in Delhi NCR" },
      { h2: "Latest Digital Marketing Insights" },
      { h2: "Frequently Asked Questions" },
    ],
  },

  "web-design-and-development": {
    title: "Web Design & Development | Website Tips & Insights | Ritz Media World",
    description:
      "Explore web design and development tips, trends, and insights from Ritz Media World to create better websites, improve user experience, and grow online.",
    keywords: [
      "Web Design and Development",
      "Web Design",
      "Web Development",
      "Website Design",
      "Website Development",
      "Responsive Web Design",
      "Web Development Agency",
    ],
    h1: "Web Design & Development",
    sections: [
      { h2: "Web Design & Development Insights" },
      { h2: "Latest Articles" },
      { h2: "More Digital Marketing Insights" },
    ],
  },

  "graphic-designing-service": {
    title: "Graphic Designing Service | Ritz Media World",
    description:
      "Explore graphic design ideas, branding trends, logo inspiration, and creative insights from Ritz Media World to build a strong and memorable brand identity.",
    keywords: [
      "Graphic Designing Service",
      "Graphic Design",
      "Graphic Design Services",
      "Logo Design",
      "Brand Identity Design",
      "Creative Design Services",
    ],
    h1: "Graphic Designing Service",
    sections: [
      { h2: "Graphic Design Ideas & Inspiration" },
      { h2: "Latest Graphic Design Articles" },
      { h2: "Explore More Creative Insights" },
    ],
  },

  "print-advertising-agency": {
    title: "Print Advertising Agency | Ritz Media World",
    description:
      "Explore newspaper ads, print advertising, hoardings, ad rates, and media planning insights from Ritz Media World to make smarter advertising decisions.",
    keywords: [
      "Print Advertising Agency",
      "Print Advertising",
      "Newspaper Advertising",
      "Newspaper Ads",
      "Outdoor Advertising",
      "Hoarding Advertising",
    ],
    h1: "Print Advertising Agency",
    sections: [
      { h2: "Print Advertising Tips & Insights" },
      { h2: "Latest Print Advertising Articles" },
      { h2: "Explore More Advertising Insights" },
    ],
  },

  "performance-marketing-agency": {
    title: "Performance Marketing Agency in India | Ritz Media World",
    description:
      "Looking for a performance marketing agency? Ritz Media World helps brands generate leads, sales and measurable growth through data-driven digital campaigns.",
    keywords: [
      "performance marketing agency",
      "performance marketing company",
      "performance marketing agency in India",
      "digital performance marketing",
      "performance marketing services",
      "ROI driven marketing",
    ],
    h1: "Performance Marketing Agency",
    sections: [
      { h2: "Performance Marketing That Delivers Results" },
      {
        h2: "Our Performance Marketing Services",
        h3: ["Google Ads", "Meta Ads", "Lead Generation", "Remarketing"],
      },
      {
        h2: "Our Approach to Performance Marketing",
        h3: ["Strategy", "Campaign Management", "Tracking & Optimization"],
      },
      { h2: "Why Choose Ritz Media World?" },
      { h2: "Frequently Asked Questions" },
      { h2: "Grow Your Business With Performance Marketing" },
    ],
  },

  "fm-radio-advertising": {
    title: "FM Radio Advertising Services | Ritz Media World",
    description:
      "Reach more customers with FM radio advertising by Ritz Media World. Get targeted campaigns, creative radio ads, media planning and competitive rates across India.",
    keywords: [
      "FM Radio Advertising Services",
      "FM Radio Advertising",
      "FM Radio Advertising Agency",
      "FM Radio Advertising Company",
      "FM Radio Advertising Agency in India",
      "FM Radio Advertising Services in India",
    ],
    h1: "FM Radio Advertising", 
    sections: [
      { h2: "FM Radio Advertising in India" },
      {
        h2: "FM Radio Advertising Rates",
        h2: ["Popular FM Radio Channels", "Types of FM Radio Advertising", "How to Book FM Radio Advertising"],
      },
      {
        h2: "Benefits of FM Radio Advertising",
        h2: ["FM Radio Advertising for Different Industries"],
      },
      { h2: "FM Radio Advertising FAQs" },
      { h2: "Frequently Asked Questions" },
      { h2: "Grow Your Business With FM Radio Advertising" },
    ],
  },
};


export function getCategorySeo(slug) {
  return categorySeoBySlug[slug] || null;
}
