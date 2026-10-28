"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { Search, Building2, ArrowRight, ExternalLink } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import sektorlerData from "@/data/sektorler.json";

interface Sektor {
  nace_kodu: string;
  sektor_tanimi: string;
  kisim_adi: string;
  slug: string;
}

const data = sektorlerData as Sektor[];

const POPULAR_SEARCHES = [
  "Yazılım",
  "Pastane",
  "E-Ticaret",
  "Tekstil",
  "Nakliyat",
  "Otomotiv",
  "Danışmanlık",
  "Restoran",
];

export default function KosgebSearchModule() {
  const [query, setQuery] = useState("");
  const [selectedKisim, setSelectedKisim] = useState("all");
  const [selectedSektor, setSelectedSektor] = useState<Sektor | null>(null);

  const categories = useMemo(() => {
    const set = new Set<string>();
    data.forEach((item) => {
      if (item.kisim_adi) set.add(item.kisim_adi);
    });
    return Array.from(set).slice(0, 10);
  }, []);

  const filtered = useMemo(() => {
    let result = data;

    if (selectedKisim !== "all") {
      result = result.filter((item) => item.kisim_adi === selectedKisim);
    }

    if (query.trim()) {
      const q = query.toLowerCase();
      result = result.filter(
        (item) =>
          item.sektor_tanimi.toLowerCase().includes(q) ||
          item.nace_kodu.toLowerCase().includes(q)
      );
    }

    return result.slice(0, 24);
  }, [query, selectedKisim]);

  return (
    <div className="space-y-8">
      {/* Editorial Header */}
      <div className="border-b border-slate-200/80 pb-5">
        <div className="flex items-center gap-2 text-xs font-medium text-slate-500 mb-1.5">
          <span>KOSGEB & KOBİ Teşvikleri</span>
          <span aria-hidden="true">·</span>
          <span>NACE Rev. 2 Sınıflandırması</span>
          <span aria-hidden="true">·</span>
          <span>2026/Q1 Resmî Liste</span>
        </div>
        <h2 className="text-2xl font-semibold tracking-tight text-slate-900">
          KOSGEB Desteklenen Sektörler & NACE Kodu Sorgulama
        </h2>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Vergi levhanızdaki 6 haneli NACE kodunu veya faaliyet alanınızı aratarak KOSGEB Girişimcilik Hibe ve Faizsiz Kredi uygunluğunuzu <strong>2.627 resmi sektör</strong> arasından sorgulayın.
        </p>
      </div>

      {/* Search and Filters Bar */}
      <div className="bg-white rounded-xl border border-slate-200/80 p-5 shadow-xs space-y-4">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="NACE kodu veya sektör adı yazın (örn: 62.01, Yazılım, 10.71, Pastane)..."
              className="w-full h-11 pl-10 pr-4 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 placeholder:text-slate-400 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors outline-none font-sans"
            />
          </div>

          <div className="sm:w-64">
            <select
              value={selectedKisim}
              onChange={(e) => setSelectedKisim(e.target.value)}
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-lg text-sm text-slate-900 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 transition-colors outline-none"
            >
              <option value="all">Tüm Faaliyet Grupları</option>
              {categories.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Quick Search Tag Row */}
        <div className="flex flex-wrap items-center gap-1.5 text-xs text-slate-500 pt-1 border-t border-slate-100">
          <span className="font-medium text-slate-400 mr-1">Örnek Sektörler:</span>
          {POPULAR_SEARCHES.map((tag) => (
            <button
              key={tag}
              type="button"
              onClick={() => setQuery(tag)}
              className="px-2.5 py-1 rounded bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors text-xs font-medium"
            >
              {tag}
            </button>
          ))}
          {query && (
            <button
              type="button"
              onClick={() => {
                setQuery("");
                setSelectedKisim("all");
              }}
              className="text-xs text-slate-700 hover:text-slate-900 underline font-semibold ml-2"
            >
              Filtreyi Temizle
            </button>
          )}
        </div>
      </div>

      {/* Results Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between text-xs text-slate-500 px-1">
          <span>Gösterilen Sonuç: {filtered.length} faaliyet</span>
          <span className="font-mono">Veritabanı: 2.627 Resmi Sektör</span>
        </div>

        {filtered.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-xl border border-slate-200/80 space-y-2">
            <Building2 className="w-8 h-8 text-slate-400 mx-auto" />
            <p className="text-slate-900 font-medium text-sm">Eşleşen KOSGEB sektörü bulunamadı.</p>
            <p className="text-xs text-slate-500 max-w-sm mx-auto">
              NACE kodunun ilk hanelerini veya genel bir kelimeyi (örn: &quot;imalat&quot;, &quot;yazılım&quot;, &quot;ticaret&quot;) deneyebilirsiniz.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filtered.map((item) => (
              <div
                key={item.slug}
                onClick={() => setSelectedSektor(item)}
                className={`p-5 rounded-xl border text-left transition-all duration-150 cursor-pointer bg-white flex flex-col justify-between ${
                  selectedSektor?.slug === item.slug
                    ? "border-slate-900 ring-1 ring-slate-900"
                    : "border-slate-200/80 hover:border-slate-400 shadow-xs"
                }`}
              >
                <div className="space-y-2.5">
                  <div className="flex items-center justify-between gap-2">
                    <span className="font-mono text-xs font-semibold px-2 py-0.5 bg-slate-100 rounded text-slate-800">
                      NACE: {item.nace_kodu}
                    </span>
                    <span className="text-[11px] font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded">
                      Destekleniyor
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-slate-900 line-clamp-2 leading-snug">
                    {item.sektor_tanimi}
                  </h4>

                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {item.kisim_adi}
                  </p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                  <span className="text-slate-400 text-[11px]">2026 Girişimcilik</span>
                  <Link
                    href={`/kosgeb-destekleri/${item.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="inline-flex items-center gap-1 text-slate-900 hover:text-slate-600 font-semibold text-xs"
                  >
                    <span>Sayfayı Aç</span>
                    <ArrowRight className="w-3 h-3" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Selected Sector Ledger Modal / Card */}
      {selectedSektor && (
        <div className="bg-white rounded-xl border border-slate-200/90 p-6 sm:p-7 shadow-xs space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 border-b border-slate-100 pb-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5 text-xs">
                <span className="font-mono font-bold text-slate-900 bg-slate-100 px-2.5 py-0.5 rounded">
                  NACE: {selectedSektor.nace_kodu}
                </span>
                <span className="text-slate-600 bg-slate-100 font-medium px-2 py-0.5 rounded text-[11px]">
                  KOSGEB Destek Kapsamında
                </span>
              </div>
              <h3 className="text-lg font-semibold text-slate-900">
                {selectedSektor.sektor_tanimi}
              </h3>
              <p className="text-xs text-slate-500 mt-0.5">
                {selectedSektor.kisim_adi}
              </p>
            </div>

            <Link
              href={`/kosgeb-destekleri/${selectedSektor.slug}`}
              className="inline-flex items-center gap-1.5 h-9 px-3.5 rounded-lg bg-slate-900 text-white text-xs font-semibold hover:bg-slate-800 transition-all shrink-0"
            >
              <span>Detaylı Sayfayı Gör</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
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
                Uygun
              </div>
            </div>
            <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
              <div className="text-slate-500 text-[11px]">Mevzuat Dönemi</div>
              <div className="text-sm font-semibold text-slate-900 mt-0.5">
                2026/Q1
              </div>
            </div>
          </div>

          <ConsultationForm
            toolName={`KOSGEB Destek Analizi (${selectedSektor.nace_kodu})`}
            naceKodu={selectedSektor.nace_kodu}
            sektorTanimi={selectedSektor.sektor_tanimi}
            calculationSummary={`NACE: ${selectedSektor.nace_kodu} | Sektör: ${selectedSektor.sektor_tanimi} | Kategori: ${selectedSektor.kisim_adi}`}
            subtitle="Bu sektörde şirket kuruluşu, makine teşviki veya KOSGEB hibe başvurusu için dosya uygunluğunuzu uzmanlarımız incelesin."
          />
        </div>
      )}
    </div>
  );
}
