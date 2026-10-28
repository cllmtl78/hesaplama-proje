import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import ConsultationForm from "@/components/ConsultationForm";
import sektorlerData from "@/data/sektorler.json";
import { Check, ArrowLeft, Building2 } from "lucide-react";

export interface Sektor {
  nace_kodu: string;
  sektor_tanimi: string;
  kisim_adi: string;
  slug: string;
}

const data = sektorlerData as Sektor[];

interface PageProps {
  params: {
    slug: string;
  };
}

export async function generateStaticParams() {
  return data.map((item) => ({
    slug: item.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sektor = data.find((item) => item.slug === params.slug);

  if (!sektor) {
    return {
      title: "Sektör Bulunamadı",
      description: "Aradığınız KOSGEB sektörü sistemde bulunamadı.",
    };
  }

  const title = `${sektor.sektor_tanimi} KOSGEB Desteği Var mı? 2026 Şartları`;
  const description = `NACE Kodu: ${sektor.nace_kodu} - ${sektor.sektor_tanimi} KOSGEB hibe ve kredi destekleri kapsamında mıdır? 2026 başvuru şartları ve uygunluk analizi.`;

  return {
    title,
    description,
    alternates: {
      canonical: `/kosgeb-destekleri/${sektor.slug}`,
    },
    openGraph: {
      title,
      description,
      type: "article",
      url: `/kosgeb-destekleri/${sektor.slug}`,
    },
  };
}

export default function SektorDetailPage({ params }: PageProps) {
  const sektor = data.find((item) => item.slug === params.slug);

  if (!sektor) {
    notFound();
  }

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${sektor.sektor_tanimi} sektörü KOSGEB destekleri kapsamında mıdır?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Evet, ${sektor.nace_kodu} NACE kodu ile kayıtlı ${sektor.sektor_tanimi} faaliyeti 2026 KOSGEB desteklenen sektörler listesinde yer almaktadır.`,
        },
      },
    ],
  };

  return (
    <div className="py-6 max-w-5xl mx-auto space-y-8">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Breadcrumb Navigation */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-slate-900 transition-colors">
          Ana Sayfa
        </Link>
        <span>/</span>
        <Link href="/#kosgeb" className="hover:text-slate-900 transition-colors">
          KOSGEB NACE Rehberi
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate">{sektor.kisim_adi}</span>
        <span>/</span>
        <span className="text-slate-900 font-semibold font-mono">{sektor.nace_kodu}</span>
      </nav>

      {/* Institutional Hero Card */}
      <section className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-6">
        <div className="flex flex-wrap items-center gap-2.5 text-xs">
          <span className="font-mono font-semibold text-slate-900 bg-slate-100 px-2.5 py-1 rounded">
            NACE: {sektor.nace_kodu}
          </span>
          <span className="text-slate-700 bg-slate-100 font-medium px-2.5 py-1 rounded">
            {sektor.kisim_adi}
          </span>
          <span className="inline-flex items-center gap-1 text-slate-800 font-medium text-[11px] ml-auto">
            <Check className="w-3.5 h-3.5 text-slate-700" />
            2026/Q1 Resmî Destek Kapsamında
          </span>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-slate-900 tracking-tight leading-snug">
            {sektor.sektor_tanimi}
          </h1>
          <p className="mt-2 text-xs sm:text-sm text-slate-600 leading-relaxed max-w-3xl">
            Bu faaliyet alanı <strong>2026 KOSGEB Desteklenen Sektörler Listesi</strong>’nde aktif olarak yer almakta olup, yeni kurulan veya mevcut KOBİ ölçeğindeki işletmeler için hibe, faizsiz kredi ve personel teşviklerine uygundur.
          </p>
        </div>

        {/* Gösterge Kartları */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-6 border-t border-slate-100 text-xs">
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 text-[11px]">Hibe Durumu</div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              Destekleniyor
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 text-[11px]">Program Türü</div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              Girişimcilik / KOBİ
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 text-[11px]">Faizsiz Kredi</div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              Kapsamda
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
            <div className="text-slate-500 text-[11px]">Mevzuat Dönemi</div>
            <div className="text-sm font-semibold text-slate-900 mt-0.5">
              2026/Q1
            </div>
          </div>
        </div>
      </section>

      {/* SSS ve Bilgilendirme Alanı */}
      <section className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-8 shadow-xs space-y-5">
        <h2 className="text-base sm:text-lg font-semibold text-slate-900">
          {sektor.sektor_tanimi} İçin Teşvik Alırken Nelere Dikkat Edilmelidir?
        </h2>

        <div className="space-y-3 text-xs sm:text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-semibold text-slate-900">1. Şirket Kuruluş Sıralaması</h3>
            <p className="text-xs text-slate-600">
              KOSGEB girişimcilik desteklerinde en sık yapılan hata şirketi KOSGEB Girişimcilik Eğitimi sertifikasını almadan kurmaktır. Destekten faydalanmak istiyorsanız, resmi şirket tescilinden önce online eğitimi tamamlamış olmalısınız.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-semibold text-slate-900">2. NACE Kodu Uyumu ( {sektor.nace_kodu} )</h3>
            <p className="text-xs text-slate-600">
              Vergi dairesi yoklamasında ve ticaret/esnaf odası tescilinde ana veya tali faaliyet kodu olarak mutlaka <strong>{sektor.nace_kodu}</strong> kodunun yazıldığından emin olun.
            </p>
          </div>

          <div className="p-4 rounded-lg bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-semibold text-slate-900">3. Makine-Teçhizat ve Donanım Alımları</h3>
            <p className="text-xs text-slate-600">
              Satın alacağınız makine, donanım veya yazılımların faturaları mutlaka şirket adına kesilmeli ve ödemeleri şirket banka hesabından yapılmalıdır. Fatura tarihi KOSGEB onay tarihine uygun olmalıdır.
            </p>
          </div>
        </div>
      </section>

      {/* Consultation Intake */}
      <section>
        <ConsultationForm
          toolName={`KOSGEB Hibe Analizi (${sektor.nace_kodu})`}
          naceKodu={sektor.nace_kodu}
          sektorTanimi={sektor.sektor_tanimi}
          calculationSummary={`NACE: ${sektor.nace_kodu} | Faaliyet: ${sektor.sektor_tanimi} | Kategori: ${sektor.kisim_adi}`}
          subtitle={`${sektor.sektor_tanimi} faaliyeti için alabileceğiniz maksimum hibe ve faizsiz kredi miktarını uzman danışmanlarımız analiz etsin.`}
        />
      </section>

      {/* Return Link */}
      <div className="text-center pt-2">
        <Link
          href="/#kosgeb"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-slate-700 hover:text-slate-900 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Tüm Hesaplayıcılara ve KOSGEB Sektörlerine Dön</span>
        </Link>
      </div>
    </div>
  );
}
