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
    default:
      "Jasa Bikin Website, Aplikasi & Web App Murah Berkualitas | Digiwangsa",
    template: "%s — Digiwangsa",
  },
  description:
    "Jasa pembuatan website, aplikasi, web app, portal berita, marketplace, dan listing dengan harga termurah untuk budget minim — kualitas dan kecepatan tidak murahan. Mulai Rp 500 ribuan.",
  keywords: [
    "jasa bikin website murah",
    "jasa pembuatan aplikasi murah",
    "jasa bikin web app",
    "jasa bikin website berita",
    "jasa bikin marketplace",
    "jasa bikin website listing",
    "jasa pembuatan website murah berkualitas",
    "jasa bikin aplikasi budget minim",
    "web developer Indonesia murah",
    "Digiwangsa",
  ],
  authors: [{ name: "Digiwangsa" }],
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    siteName: "Digiwangsa",
    title:
      "Jasa Bikin Website, Aplikasi & Web App Murah Berkualitas | Digiwangsa",
    description:
      "Jasa pembuatan website, aplikasi, web app, berita, marketplace, dan listing. Harga termurah untuk budget minim, kualitas & kecepatan tidak murahan. Mulai Rp 500 ribuan.",
    url: siteUrl,
  },
  twitter: {
    card: "summary_large_image",
    title:
      "Jasa Bikin Website, Aplikasi & Web App Murah Berkualitas | Digiwangsa",
    description:
      "Website, aplikasi, web app, berita, marketplace & listing. Harga termurah untuk budget minim, kualitas tidak murahan. Mulai Rp 500 ribuan.",
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
      "Jasa pembuatan website, aplikasi, web app, portal berita, marketplace, dan listing dengan harga terjangkau untuk budget minim — kualitas dan kecepatan tidak murahan.",
    slogan: "Digital. Traditional. Solution.",
    areaServed: "Worldwide",
    knowsLanguage: ["id", "en", "jv"],
  };

  return (
    <html
      lang={locale}
      suppressHydrationWarning
      className={`${playfair.variable} ${jakarta.variable} h-full antialiased`}
    >
      <body className="min-h-full bg-base text-cream">
        <script
          dangerouslySetInnerHTML={{
            __html: `try{if(localStorage.getItem('theme')==='dark')document.documentElement.classList.add('dark')}catch(e){}`,
          }}
        />
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
