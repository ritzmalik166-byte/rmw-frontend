export const metadata = {
    metadataBase: new URL("https://ritzmediaworld.com/"),
    title: "About Ritz Media World | Award-Winning Delhi NCR Advertising Agency",
    description:
        "Learn how Ritz Media World crafts data-driven brand stories and digital campaigns. Over 18 years of experience turning brands into household names in Delhi NCR.",
    keywords: [
        "Ritz Media World",
        "advertising agency Delhi NCR",
        "creative agency Delhi",
        "full service ad agency Noida",
        "digital marketing agency Delhi NCR",
        "brand storytelling agency India",
        "print radio advertising Delhi NCR",
        "award winning ad agency Delhi",
        "client-centric marketing agency India",
        "advertising & media services Delhi India",
    ],
    authors: [{ name: "Ritz Media World" }],
    publisher: "Ritz Media World",
    alternates: {
        canonical: "https://ritzmediaworld.com/about.html",
    },
    robots: {
        index: true,
        follow: true,
    },
};

export default function AboutLayout({ children }) {
    return (
        <div>
            {children}
        </div>
    )
}