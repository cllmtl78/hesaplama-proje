import SearchEngine, { Sektor } from "@/components/SearchEngine";
import sektorlerData from "@/data/sektorler.json";

export default function HomePage() {
  const data = sektorlerData as Sektor[];

  return (
    <div className="py-10 md:py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-12">
      {/* Hero Section */}
      <section className="text-center space-y-5 max-w-3xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-semibold tracking-wide">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          2026 Resmî Verileriyle Güncellendi
        </div>

        <h1 className="text-3xl sm:text-5xl font-black text-slate-900 tracking-tight leading-tight">
          2026 KOSGEB Desteklenen Sektörler{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-500">
            Sorgulama Motoru
          </span>
        </h1>

        <p className="text-slate-600 text-base sm:text-lg leading-relaxed">
          Kurmak istediğiniz veya faaliyet gösterdiğiniz işletmenizin NACE koduna göre KOSGEB Girişimcilik Hibe ve Faizsiz Kredi destek kapsamını <strong>2.627 güncel sektör</strong> arasından anında sorgulayın.
        </p>

        {/* Popüler Etiketler */}
        <div className="pt-2 flex flex-wrap justify-center items-center gap-2 text-xs text-slate-500">
          <span className="font-medium text-slate-400">Popüler Aramalar:</span>
          {["Yazılım ve Bilişim", "İmalat Sanayii", "E-Ticaret", "Tekstil", "Danışmanlık"].map((tag) => (
            <span
              key={tag}
              className="bg-slate-200/70 text-slate-700 px-2.5 py-1 rounded-md font-medium"
            >
              #{tag}
            </span>
          ))}
        </div>
      </section>

      {/* Arama Motoru Bileşeni */}
      <section>
        <SearchEngine initialData={data} />
      </section>

      {/* Bilgi Kutuları */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-12 border-t border-slate-200">
        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-lg mb-3">
            1
          </div>
          <h3 className="font-bold text-slate-900 text-base">NACE Kodunu Belirleyin</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Vergi levhanızda veya ticaret sicil kaydınızda yer alan 6 haneli faaliyet kodunuzu yukarıdaki kutudan sorgulayın.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-700 flex items-center justify-center font-bold text-lg mb-3">
            2
          </div>
          <h3 className="font-bold text-slate-900 text-base">Destek Şartlarını İnceleyin</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sektörünüzün İleri Girişimci mi yoksa Geleneksel Girişimci programında mı olduğunu ve üst limitleri öğrenin.
          </p>
        </div>

        <div className="p-6 bg-white rounded-2xl border border-slate-200 shadow-sm space-y-2">
          <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-lg mb-3">
            3
          </div>
          <h3 className="font-bold text-slate-900 text-base">Ücretsiz Uygunluk Analizi</h3>
          <p className="text-xs text-slate-600 leading-relaxed">
            Sektör detay sayfasındaki formu doldurarak teşvik danışmanlarımızdan şirketinize özel hibe raporu talep edin.
          </p>
        </div>
      </section>
    </div>
  );
}
