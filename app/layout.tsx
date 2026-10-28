import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import Link from "next/link";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "https://kosgeb-sorgulama.vercel.app"),
  title: {
    default: "2026 KOSGEB Desteklenen Sektörler ve NACE Sorgulama Motoru",
    template: "%s | KOSGEB Destekleri 2026",
  },
  description:
    "2026 yılı güncel KOSGEB desteklenen sektörler listesi ve NACE kodu sorgulama motoru. Şirketinizin hibe ve kredi uygunluğunu anında öğrenin.",
  keywords: [
    "KOSGEB",
    "KOSGEB desteklenen sektörler",
    "NACE kodu sorgulama",
    "KOSGEB hibe",
    "girişimcilik desteği 2026",
    "şirket kuruluşu teşvik",
  ],
  authors: [{ name: "KOSGEB Rehberi" }],
  creator: "KOSGEB Rehberi",
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
    siteName: "KOSGEB NACE Sorgulama Motoru",
    title: "2026 KOSGEB Desteklenen Sektörler ve NACE Sorgulama Motoru",
    description:
      "Tüm NACE kodları için 2026 KOSGEB hibe ve kredi destek uygunluk sorgulama aracı.",
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
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased flex flex-col font-sans">
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/90 backdrop-blur-md">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
            <Link href="/" className="flex items-center gap-2 group">
              <span className="w-9 h-9 rounded-lg bg-emerald-600 text-white flex items-center justify-center font-bold text-lg shadow-sm group-hover:bg-emerald-700 transition">
                K
              </span>
              <div className="flex flex-col">
                <span className="font-extrabold text-slate-900 leading-tight tracking-tight">
                  KOSGEB Sektörler
                </span>
                <span className="text-[10px] uppercase font-semibold text-emerald-600 tracking-wider">
                  2026 Güncel Rehber
                </span>
              </div>
            </Link>
            <nav className="flex items-center gap-4 text-sm font-medium">
              <Link
                href="/"
                className="text-slate-600 hover:text-emerald-600 transition"
              >
                Sorgulama Motoru
              </Link>
              <a
                href="#lead-form"
                className="hidden sm:inline-flex px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-semibold hover:bg-emerald-700 transition shadow-sm shadow-emerald-500/20"
              >
                Hibe Analizi Al
              </a>
            </nav>
          </div>
        </header>

        <main className="flex-1">{children}</main>

        <footer className="border-t border-slate-200 bg-white py-8 text-center text-xs text-slate-500">
          <div className="max-w-7xl mx-auto px-4 space-y-2">
            <p>
              © 2026 KOSGEB NACE Teşvik ve Hibe Sorgulama Portalı. Tüm hakları saklıdır.
            </p>
            <p className="text-slate-400">
              Bu platform resmi KOSGEB sitesi olmayıp, kamuya açık NACE ve teşvik verilerini derleyen bilgilendirme aracıdır.
            </p>
          </div>
        </footer>
      </body>
    </html>
  );
}
