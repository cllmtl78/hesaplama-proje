import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(
    process.env.NEXT_PUBLIC_SITE_URL || "https://pratikhesap.co"
  ),
  title: {
    default: "PratikHesap.co — İş, Vergi, Teşvik ve Hukuk Hesaplama Portalı",
    template: "%s | PratikHesap.co",
  },
  description:
    "Türkiye'nin güncel yasal ve finansal hesaplama portalı: Kıdem ve İhbar Tazminatı, KDV ve Fatura Tevkifatı, Freelancer Gelir Vergisi ve 2.627 sektörlü KOSGEB NACE sorgulama motoru.",
  keywords: [
    "PratikHesap",
    "kıdem tazminatı hesaplama",
    "ihbar tazminatı hesaplama 2026",
    "KDV tevkifat hesaplama",
    "tevkifat oranları",
    "freelancer vergi hesaplama",
    "genç girişimci istisnası",
    "şahıs şirketi vergi dilimleri",
    "KOSGEB desteklenen sektörler",
    "NACE kodu sorgulama",
  ],
  authors: [{ name: "PratikHesap.co" }],
  creator: "PratikHesap.co",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  openGraph: {
    type: "website",
    locale: "tr_TR",
    url: "/",
    siteName: "PratikHesap.co",
    title: "PratikHesap.co — İş, Vergi, Teşvik ve Hukuk Hesaplama Portalı",
    description:
      "Tüm resmi, mali ve hukuki hesaplamalar tek noktada: Kıdem & İhbar Tazminatı, KDV Tevkifatı, Freelancer Vergi ve KOSGEB NACE sorgulama.",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const gaId = process.env.NEXT_PUBLIC_GA_ID;

  return (
    <html lang="tr" className={inter.variable}>
      <head>
        {gaId && (
          <>
            <Script
              strategy="afterInteractive"
              src={`https://www.googletagmanager.com/gtag/js?id=${gaId}`}
            />
            <Script
              id="google-analytics"
              strategy="afterInteractive"
              dangerouslySetInnerHTML={{
                __html: `
                  window.dataLayer = window.dataLayer || [];
                  function gtag(){dataLayer.push(arguments);}
                  gtag('js', new Date());
                  gtag('config', '${gaId}', {
                    page_path: window.location.pathname,
                  });
                `,
              }}
            />
          </>
        )}
      </head>
      <body className="min-h-screen bg-[#F8FAFC] text-slate-900 antialiased flex flex-col font-sans selection:bg-blue-600 selection:text-white relative overflow-x-hidden">
        {/* Modern Radial Mesh Background + Dot Grid */}
        <div className="fixed inset-0 pointer-events-none z-0">
          <div className="absolute inset-0 bg-dot-pattern opacity-40" />
          <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-[1200px] h-[600px] bg-[radial-gradient(ellipse_80%_80%_at_50%_-20%,rgba(59,130,246,0.14),rgba(99,102,241,0.08),transparent_75%)] blur-2xl" />
          <div className="absolute top-[40%] -left-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(16,185,129,0.06),transparent_70%)] blur-3xl" />
          <div className="absolute top-[55%] -right-32 w-[600px] h-[600px] bg-[radial-gradient(circle,rgba(99,102,241,0.06),transparent_70%)] blur-3xl" />
        </div>

        <Navbar />
        <main className="relative z-10 flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
