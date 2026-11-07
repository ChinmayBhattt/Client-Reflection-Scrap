import type { Metadata, Viewport } from "next";
import { Montserrat } from "next/font/google";
import "./globals.css";
import { SITE_CONFIG } from "@/lib/site-config";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import { FloatingWhatsApp } from "@/components/floating-whatsapp";
import { MobileCallBar } from "@/components/mobile-call-bar";
import { Toaster } from "@/components/ui/sonner";

const montserrat = Montserrat({
  subsets: ["latin"],
  variable: "--font-montserrat",
  display: "swap",
  weight: ["300", "400", "500", "600", "700", "800"],
});

export const viewport: Viewport = {
  themeColor: "#3B8BC4",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export const metadata: Metadata = {
  metadataBase: new URL(SITE_CONFIG.url),
  title: {
    default: `${SITE_CONFIG.name} | Doorstep Scrap Collection & Recycling Mumbai`,
    template: `%s | ${SITE_CONFIG.name}`,
  },
  description: SITE_CONFIG.description,
  keywords: [
    "Scrap trading Mumbai",
    "Doorstep scrap collection Mumbai",
    "Reflection Scrap Solutions LLP",
    "MIDC Andheri East scrap dealer",
    "Kabadiwala Mumbai online",
    "Metal scrap rates Mumbai",
    "E-waste recycling Mumbai",
    "Industrial scrap buyer",
    "Iron copper brass scrap rate",
    "Scrap weighing at home",
  ],
  authors: [{ name: SITE_CONFIG.name, url: SITE_CONFIG.url }],
  creator: SITE_CONFIG.name,
  publisher: SITE_CONFIG.name,
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  icons: {
    icon: [
      { url: "/favicon.ico" },
      { url: "/favicon.png", type: "image/png" },
    ],
    apple: [{ url: "/apple-touch-icon.png" }],
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    url: SITE_CONFIG.url,
    siteName: SITE_CONFIG.name,
    title: `${SITE_CONFIG.name} | Scrap Collection & Trading Mumbai`,
    description: SITE_CONFIG.description,
    images: [
      {
        url: "/logo.png",
        width: 800,
        height: 800,
        alt: `${SITE_CONFIG.name} Logo`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONFIG.name,
    description: SITE_CONFIG.description,
    images: ["/logo.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  // LocalBusiness Structured Data JSON-LD
  const localBusinessJsonLd = {
    "@context": "https://schema.org",
    "@type": "RecyclingCenter",
    "@id": `${SITE_CONFIG.url}#organization`,
    name: SITE_CONFIG.name,
    legalName: SITE_CONFIG.name,
    identifier: SITE_CONFIG.llpin,
    image: `${SITE_CONFIG.url}/logo.png`,
    logo: `${SITE_CONFIG.url}/logo.png`,
    description: SITE_CONFIG.description,
    url: SITE_CONFIG.url,
    telephone: SITE_CONFIG.contact.phone,
    email: SITE_CONFIG.contact.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: SITE_CONFIG.address.street,
      addressLocality: SITE_CONFIG.address.city,
      addressRegion: SITE_CONFIG.address.state,
      postalCode: SITE_CONFIG.address.pincode,
      addressCountry: "IN",
    },
    geo: {
      "@type": "GeoCoordinates",
      latitude: SITE_CONFIG.address.geo.latitude,
      longitude: SITE_CONFIG.address.geo.longitude,
    },
    openingHoursSpecification: [
      {
        "@type": "OpeningHoursSpecification",
        dayOfWeek: [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday",
          "Sunday",
        ],
        opens: SITE_CONFIG.operatingHours.opens,
        closes: SITE_CONFIG.operatingHours.closes,
      },
    ],
    priceRange: "₹₹",
    areaServed: {
      "@type": "AdministrativeArea",
      name: "Mumbai",
    },
    paymentAccepted: ["Cash", "UPI"],
  };

  return (
    <html lang="en" className={montserrat.variable}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify(localBusinessJsonLd),
          }}
        />
      </head>
      <body className="font-sans min-h-screen flex flex-col bg-brand-bg text-brand-dark selection:bg-brand-blue selection:text-white">
        <Navbar />
        <main className="flex-1">{children}</main>
        <Footer />
        <FloatingWhatsApp />
        <MobileCallBar />
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
