import GoogleAnalytics from "./component/common/GoogleAnalytics";
import RouteAnimationReset from "./component/common/RouteAnimationReset";
import { LOADER_SKIP_BOOTSTRAP } from "@/lib/isAutomationLab";
import "./fonts.css";
import "./remixicon.css";
import "./globals.css";

const GA_MEASUREMENT_ID = "G-0YHLN54GF7";

export const metadata = {
  metadataBase: new URL("https://ritzmediaworld.com/"),
  title: "Ritz Media World: Creative + Strategy + Media Agency",
  description:
    "Top advertising agency in Delhi NCR. Ritz media world offer SEO, radio, creative print ads services in Greater Noida. Most trusted digital marketing company.",
  keywords: [
    "Best advertising agency in Delhi NCR",
    "Top Advertising Agency",
    "Advertising Agency in Delhi",
    "Best Advertising Agency in Delhi NCR",
    "Ads Agency in Delhi NCR",
    "Best ad agency in Delhi",
    "Best ad agency in Noida",
    "ad agency in Noida",
    "ad agency in Delhi",
    "ad agency in Delhi NCR",
    "Digital marketing agency",
    "Creative Agency",
    "Branding agency In Delhi",
    "Branding agency In Noida",
    "Branding agency In Delhi NCR",
    "Creative Advertising Agency",
    "Social Media Marketing Agency",
    "Content Marketing Agency",
    "Best Creative Advertising Agency",
    "Best marketing agency in India",
    "Creative service",
    "SEO company in noida",
    "Radio advertising agency",
    "Best ad agency",
    "Digital Marketing company",
    "Digital Marketing company in noida",
    "Digital Marketing company in Delhi",
    "digital marketing and creative agency",
    "Best digital marketing agency in Delhi",
    "Newspaper ad agency",
    "Top Marketing Agency in India",
    "creative digital marketing agency",
    "best seo services in noida",
    "best seo agency in greater noida",
  ],
  authors: [{ name: "Ritz Media World" }],
  publisher: "Ritz Media World",
  alternates: {
    canonical: "https://ritzmediaworld.com/",
  },
  robots: {
    index: true,
    follow: true,
  },
  verification: {
    google: "UJDMaKvPAV5eAGJrDzTOTmxfhqT2OrUPSxwlVnAcgHs",
  },
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      suppressHydrationWarning
      className="h-full antialiased [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
    >
      <head>
        {/* Pre-paint: hide intro loader for labs / returning sessions (SI). */}
        <script
          dangerouslySetInnerHTML={{ __html: LOADER_SKIP_BOOTSTRAP }}
        />
        {/* Preload only LCP-critical faces. Remixicon is below-the-fold chrome. */}
        <link
          rel="preload"
          href="/fonts/google/league-spartan-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
        <link
          rel="preload"
          href="/fonts/google/montserrat-latin-wght-normal.woff2"
          as="font"
          type="font/woff2"
          crossOrigin="anonymous"
        />
      </head>
      <body
        suppressHydrationWarning
        className="min-h-full flex flex-col [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
      >
        <GoogleAnalytics id={GA_MEASUREMENT_ID} />
        <RouteAnimationReset />
        {children}
      </body>
    </html>
  );
}
