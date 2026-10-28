import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ChevronRight, ArrowLeft, Shield, Sparkles } from "lucide-react";
import { TOOLS_REGISTRY, getToolBySlug } from "@/data/toolsRegistry";

// Import all calculators
import KidemIhbarCalculator from "@/components/calculators/KidemIhbarCalculator";
import IssizlikMaasiCalculator from "@/components/calculators/IssizlikMaasiCalculator";
import BruttenNeteCalculator from "@/components/calculators/BruttenNeteCalculator";
import FazlaMesaiCalculator from "@/components/calculators/FazlaMesaiCalculator";
import KdvTevkifatCalculator from "@/components/calculators/KdvTevkifatCalculator";
import FreelancerTaxCalculator from "@/components/calculators/FreelancerTaxCalculator";
import KiraGelirVergisiCalculator from "@/components/calculators/KiraGelirVergisiCalculator";
import GumrukVergisiCalculator from "@/components/calculators/GumrukVergisiCalculator";
import TapuHarciCalculator from "@/components/calculators/TapuHarciCalculator";
import KiraArtisiCalculator from "@/components/calculators/KiraArtisiCalculator";
import KosgebSearchModule from "@/components/calculators/KosgebSearchModule";
import PazaryeriCalculator from "@/components/calculators/PazaryeriCalculator";
import MtvCalculator from "@/components/calculators/MtvCalculator";
import AracDegerKaybiCalculator from "@/components/calculators/AracDegerKaybiCalculator";

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  const params: Array<{ slug: string }> = [];

  for (const tool of TOOLS_REGISTRY) {
    params.push({ slug: tool.slug });
    if (tool.aliases) {
      for (const alias of tool.aliases) {
        params.push({ slug: alias });
      }
    }
  }

  return params;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    return {
      title: "Hesaplama Aracı Bulunamadı",
      description: "Aradığınız hesaplama aracı sistemde bulunamadı.",
    };
  }

  return {
    title: tool.metaTitle,
    description: tool.metaDescription,
    keywords: tool.keywords,
    openGraph: {
      title: tool.metaTitle,
      description: tool.metaDescription,
      url: `/${tool.slug}`,
      type: "website",
    },
  };
}

export default function CalculatorPage({ params }: PageProps) {
  const tool = getToolBySlug(params.slug);

  if (!tool) {
    notFound();
  }

  // Related tools in the same category or popular
  const relatedTools = TOOLS_REGISTRY.filter(
    (t) => t.slug !== tool.slug && (t.category === tool.category || t.popular)
  ).slice(0, 3);

  // Render matching calculator
  const renderCalculator = () => {
    switch (tool.slug) {
      case "kidem-tazminati-hesaplama":
      case "kidem-ihbar-tazminati":
        return <KidemIhbarCalculator />;
      case "issizlik-maasi-hesaplama":
        return <IssizlikMaasiCalculator />;
      case "brutten-nete-maas-hesaplama":
        return <BruttenNeteCalculator />;
      case "fazla-mesai-hesaplama":
        return <FazlaMesaiCalculator />;
      case "kdv-tevkifat-hesaplama":
        return <KdvTevkifatCalculator />;
      case "gelir-vergisi-hesaplama":
      case "freelancer-gelir-vergisi":
        return <FreelancerTaxCalculator />;
      case "kira-gelir-vergisi-hesaplama":
        return <KiraGelirVergisiCalculator />;
      case "gumruk-vergisi-hesaplama":
        return <GumrukVergisiCalculator />;
      case "tapu-harci-hesaplama":
        return <TapuHarciCalculator />;
      case "kira-artisi-hesaplama":
        return <KiraArtisiCalculator />;
      case "kosgeb-destekleri-sorgulama":
      case "kosgeb-destekleri":
        return <KosgebSearchModule />;
      case "pazaryeri-komisyon-hesaplama":
        return <PazaryeriCalculator />;
      case "mtv-hesaplama":
        return <MtvCalculator />;
      case "arac-deger-kaybi-hesaplama":
        return <AracDegerKaybiCalculator />;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6 sm:space-y-8">
      {/* Top Mobile-First Back Button & Breadcrumbs */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-slate-200/80 pb-3.5">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-bold text-slate-700 bg-white border border-slate-200/90 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200 transition-all shadow-2xs group w-fit"
        >
          <ArrowLeft className="w-4 h-4 text-slate-500 group-hover:-translate-x-1 group-hover:text-blue-600 transition-transform" />
          <span>← Tüm Hesaplayıcılar</span>
        </Link>

        <nav aria-label="Breadcrumb" className="flex items-center gap-1.5 text-xs text-slate-500 flex-wrap">
          <Link
            href="/"
            className="hover:text-blue-600 transition-colors font-medium text-slate-600"
          >
            Ana Sayfa
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-600 font-medium">
            {tool.categoryLabel}
          </span>
          <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
          <span className="text-slate-900 font-bold px-2 py-0.5 rounded-full bg-slate-100 border border-slate-200/80 truncate max-w-[200px] sm:max-w-none">
            {tool.shortTitle}
          </span>
        </nav>
      </div>

      {/* Hesaplama Bileşeni */}
      <div>
        {renderCalculator()}
      </div>

      {/* İlgili ve Diğer Popüler Araçlar Bölümü */}
      {relatedTools.length > 0 && (
        <div className="pt-8 border-t border-slate-200/80">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-blue-600" />
                İlgili ve Diğer Popüler Hesaplama Araçları
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {tool.categoryLabel} kategorisindeki ve en çok kullanılan 2026 resmi hesaplama modülleri.
              </p>
            </div>
            <Link
              href="/"
              className="text-xs font-semibold text-blue-600 hover:text-blue-700 hover:underline hidden sm:inline"
            >
              Tüm 14 Aracı İncele &rarr;
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {relatedTools.map((relTool) => (
              <Link
                key={relTool.slug}
                href={`/${relTool.slug}`}
                className="group p-4 sm:p-5 bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl hover:border-blue-300 hover:-translate-y-1 hover:shadow-lg hover:shadow-slate-200/50 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2.5">
                    <span className="text-[10px] font-semibold text-slate-500 uppercase tracking-wider">
                      {relTool.categoryLabel}
                    </span>
                    <span className="text-xs font-semibold text-blue-700 bg-blue-50 border border-blue-200/60 px-2 py-0.5 rounded-full">
                      {relTool.badge}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 group-hover:text-blue-600 transition-colors line-clamp-1">
                    {relTool.title}
                  </h4>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {relTool.description}
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-semibold text-slate-700 group-hover:text-blue-600">
                  <span className="text-[11px] text-slate-400 flex items-center gap-1 font-normal">
                    <Shield className="w-3 h-3 text-slate-400" />
                    2026 Mevzuatı
                  </span>
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    Hesapla &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
