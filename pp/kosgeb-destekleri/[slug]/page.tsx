import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import LeadForm from "@/components/LeadForm";
import sektorlerData from "@/data/sektorler.json";

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

// 1. Statik Parametrelerin Oluşturulması (2.627 Sayfa SSG)
export async function generateStaticParams() {
  return data.map((item) => ({
    slug: item.slug,
  }));
}

// 2. Dinamik SEO Metadata Üretimi
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const sektor = data.find((item) => item.slug === params.slug);

  if (!sektor) {
    return {
      title: "Sektör Bulunamadı",
      description: "Aradığınız KOSGEB sektörü sistemde bulunamadı.",
    };
  }

  const title = `${sektor.sektor_tanimi} KOSGEB Desteği Var mı? 2026 Şartları`;
  const description = `NACE Kodu: ${sektor.nace_kodu} - ${sektor.sektor_tanimi} KOSGEB hibe ve kredi destekleri kapsamında mıdır? 2026 başvuru şartları, makine desteği ve uygunluk analizi.`;

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

// 3. Sayfa Bileşeni
export default function SektorDetailPage({ params }: PageProps) {
  const sektor = data.find((item) => item.slug === params.slug);

  if (!sektor) {
    notFound();
  }

  // Yapılandırılmış Veri (FAQ Schema)
  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: [
      {
        "@type": "Question",
        name: `${sektor.sektor_tanimi} sektörü KOSGEB destekleri kapsamında mıdır?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Evet, ${sektor.nace_kodu} NACE kodu ile kayıtlı ${sektor.sektor_tanimi} faaliyeti 2026 KOSGEB desteklenen sektörler listesinde yer almaktadır. Girişimcilik destek programlarına başvurabilirsiniz.`,
        },
      },
      {
        "@type": "Question",
        name: `${sektor.nace_kodu} kodu ile şirket kurarken nelere dikkat edilmelidir?`,
        acceptedAnswer: {
          "@type": "Answer",
          text: `Şirket kuruluşundan önce KOSGEB Girişimcilik Eğitimini tamamlamış olmanız ve ana sözleşmenizde ${sektor.nace_kodu} kodunun ana faaliyet olarak tescil edilmiş olması gerekmektedir.`,
        },
      },
    ],
  };

  return (
    <div className="py-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />

      {/* Ekmek Kırıntısı (Breadcrumbs) */}
      <nav className="text-xs text-slate-500 flex items-center gap-2">
        <Link href="/" className="hover:text-emerald-600 transition">
          Ana Sayfa
        </Link>
        <span>/</span>
        <span className="text-slate-400 truncate">{sektor.kisim_adi}</span>
        <span>/</span>
        <span className="text-slate-800 font-semibold">{sektor.nace_kodu}</span>
      </nav>

      {/* Başlık ve Rozet Kartı */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 shadow-sm relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-50 rounded-full blur-3xl -z-10 pointer-events-none" />

        <div className="flex flex-wrap items-center gap-3 mb-6">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-black bg-emerald-600 text-white shadow-sm">
            <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
            KOSGEB Destek Kapsamında
          </span>
          <span className="font-mono text-xs font-bold text-slate-700 bg-slate-100 px-3 py-1.5 rounded-full border border-slate-200">
            NACE Kodu: {sektor.nace_kodu}
          </span>
          <span className="text-xs font-semibold text-slate-500 bg-slate-50 px-3 py-1.5 rounded-full border border-slate-100">
            {sektor.kisim_adi}
          </span>
        </div>

        <h1 className="text-2xl sm:text-4xl font-black text-slate-900 tracking-tight leading-snug">
          {sektor.sektor_tanimi}
        </h1>
        <p className="mt-3 text-sm sm:text-base text-slate-600">
          Bu sektör <strong>2026 KOSGEB Desteklenen Sektörler Listesi</strong>’nde aktif olarak yer almakta olup, yeni kurulan veya mevcut KOBİ ölçeğindeki işletmeler için hibe, faizsiz kredi ve personel teşviklerine uygundur.
        </p>

        {/* Öne Çıkan Göstergeler */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mt-8 pt-8 border-t border-slate-100">
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 font-medium">Hibe Durumu</div>
            <div className="text-sm sm:text-base font-bold text-emerald-700 mt-1">
              Destekleniyor
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 font-medium">Program Türü</div>
            <div className="text-sm sm:text-base font-bold text-slate-800 mt-1">
              Girişimcilik / KOBİ
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 font-medium">Faizsiz Kredi</div>
            <div className="text-sm sm:text-base font-bold text-slate-800 mt-1">
              Uygun
            </div>
          </div>
          <div className="p-3 bg-slate-50 rounded-xl">
            <div className="text-xs text-slate-500 font-medium">Güncelleme</div>
            <div className="text-sm sm:text-base font-bold text-slate-800 mt-1">
              2026 Dönemi
            </div>
          </div>
        </div>
      </section>

      {/* SSS ve Bilgilendirme Alanı */}
      <section className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-10 space-y-6">
        <h2 className="text-xl sm:text-2xl font-black text-slate-900">
          {sektor.sektor_tanimi} İçin Teşvik Alırken Nelere Dikkat Edilmelidir?
        </h2>

        <div className="space-y-4 text-sm text-slate-600 leading-relaxed">
          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-900">1. Şirket Kuruluş Sıralaması</h3>
            <p>
              KOSGEB girişimcilik desteklerinde en sık yapılan hata şirketi KOSGEB Girişimcilik Eğitimi sertifikasını almadan kurmaktır. Destekten faydalanmak istiyorsanız, resmi şirket tescilinden önce online eğitimi tamamlamış olmalısınız.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-900">2. NACE Kodu Uyumu ( {sektor.nace_kodu} )</h3>
            <p>
              Vergi dairesi yoklamasında ve ticaret/esnaf odası tescilinde ana veya tali faaliyet kodu olarak mutlaka <strong>{sektor.nace_kodu}</strong> kodunun yazıldığından emin olun.
            </p>
          </div>

          <div className="p-4 rounded-xl bg-slate-50 border border-slate-100 space-y-1">
            <h3 className="font-bold text-slate-900">3. Makine-Teçhizat ve Donanım Alımları</h3>
            <p>
              Satın alacağınız makine, donanım veya yazılımların faturaları mutlaka şirket adına kesilmeli ve ödemeleri şirket banka hesabından yapılmalıdır. Fatura tarihi KOSGEB onay tarihine uygun olmalıdır.
            </p>
          </div>
        </div>
      </section>

      {/* Lead Magnet Form Alanı */}
      <section>
        <LeadForm
          naceKodu={sektor.nace_kodu}
          sektorTanimi={sektor.sektor_tanimi}
        />
      </section>

      {/* Geri Dön Butonu */}
      <div className="text-center pt-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 hover:text-emerald-700 transition"
        >
          &larr; Diğer Sektörleri ve NACE Kodlarını Sorgula
        </Link>
      </div>
    </div>
  );
}
