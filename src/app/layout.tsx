import type { Metadata } from "next";
import { Playfair_Display, Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from "next-intl";
import { getLocale, getMessages } from "next-intl/server";
import "./globals.css";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
  weight: ["500", "600", "700"],
});

const jakarta = Plus_Jakarta_Sans({
  variable: "--font-jakarta",
  subsets: ["latin"],
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Digiwangsa — Premium Website & Application Development",
    template: "%s — Digiwangsa",
  },
  description:
    "Digiwangsa builds premium websites and applications with a Javanese soul and world-class standards — for creators, MSMEs, and enterprise brands.",
  keywords: [
    "jasa pembuatan website",
    "jasa pembuatan aplikasi",
    "web developer Indonesia",
    "landing page",
    "company profile",
    "Digiwangsa",
  ],
  authors: [{ name: "Digiwangsa" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Digiwangsa",
    title: "Digiwangsa — Premium Website & Application Development",
    description:
      "Premium websites and applications crafted with a Javanese soul and world-class standards.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title: "Digiwangsa — Premium Website & Application Development",
    description:
      "Premium websites and applications crafted with a Javanese soul and world-class standards.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const locale = await getLocale();
  const messages = await getMessages();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Digiwangsa",
    url: siteUrl,
    logo: `${siteUrl}/asset/digiwangsa.png`,
    description:
      "Premium website and application development with a Javanese soul and world-class standards.",
    slogan: "Digital. Traditional. Solution.",
    areaServed: "Worldwide",
    knowsLanguage: ["id", "en", "jv"],
  };

  return (
    <html
      lang={locale}
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-base text-cream">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
