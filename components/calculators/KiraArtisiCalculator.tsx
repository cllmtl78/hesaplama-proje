"use client";

import { useState, useMemo } from "react";
import { Building, TrendingUp } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

export default function KiraArtisiCalculator() {
  const [mevcutKira, setMevcutKira] = useState<number>(20000);
  const [tufeOrani, setTufeOrani] = useState<number>(48.5);

  const calculation = useMemo(() => {
    const kira = mevcutKira || 0;
    const oran = tufeOrani || 0;

    const aylikArtisTutari = kira * (oran / 100);
    const yeniKiraBedeli = kira + aylikArtisTutari;
    const yillikEkstraMaliyet = aylikArtisTutari * 12;
    const yillikToplamKira = yeniKiraBedeli * 12;

    return {
      kira,
      oran,
      aylikArtisTutari,
      yeniKiraBedeli,
      yillikEkstraMaliyet,
      yillikToplamKira,
    };
  }, [mevcutKira, tufeOrani]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Mevcut Aylık Kira Bedeli",
        value: `${calculation.kira.toLocaleString("tr-TR")} TL`,
      },
      {
        label: "Yasal Tavan Artış Oranı (TÜİK 12 Aylık TÜFE)",
        value: `%${calculation.oran}`,
        hint: "TBK 344 uyarınca aşılamaz",
      },
      {
        label: "Aylık Yasal Artış Tutarı",
        value: `+${calculation.aylikArtisTutari.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        hint: "Mevcut kiraya eklenecek aylık fark",
      },
      {
        label: "Yıllık Ek Maliyet Farkı",
        value: `${calculation.yillikEkstraMaliyet.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      },
      {
        label: "Yıllık Toplam Kira Bedeli",
        value: `${calculation.yillikToplamKira.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation]);

  const summaryText = `Mevcut Kira: ${calculation.kira} TL | TÜFE: %${calculation.oran} | Yeni Yasal Kira: ${calculation.yeniKiraBedeli.toLocaleString("tr-TR")} TL | Aylık Artış: ${calculation.aylikArtisTutari.toLocaleString("tr-TR")} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
          <span>6098 Sayılı Türk Borçlar Kanunu Madde 344</span>
          <span className="text-slate-300">·</span>
          <span>TÜİK 12 Aylık TÜFE Ortalaması Tavanı</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          TÜFE Yasal Kira Artış Oranı Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Ev ve iş yeri kira sözleşmelerinde yasal azami artış tavanı olan 12 aylık TÜFE ortalamasına göre yeni kira bedelini ve yıllık ek maliyeti hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Building className="w-4 h-4 text-rose-600" />
              Kira ve Endeks Parametreleri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              TBK 344
            </span>
          </div>

          {/* Mevcut Kira Bedeli */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Mevcut Aylık Kira Bedeli <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Şu an ödenen tutar</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="500"
                value={mevcutKira || ""}
                onChange={(e) => setMevcutKira(Number(e.target.value))}
                placeholder="Örn: 20000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[12000, 18000, 25000, 35000, 50000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setMevcutKira(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    mevcutKira === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val.toLocaleString("tr-TR")} TL
                </button>
              ))}
            </div>
          </div>

          {/* TÜİK 12 Aylık TÜFE Oranı */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                TÜİK 12 Aylık Ortalamalara Göre TÜFE Oranı (%) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-rose-600 font-semibold">Resmi Yasal Tavan</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="0.1"
                value={tufeOrani || ""}
                onChange={(e) => setTufeOrani(Number(e.target.value))}
                placeholder="Örn: 48.5"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                %
              </span>
            </div>
          </div>

          {/* Hukuki Açıklama Kutusu */}
          <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/60 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-rose-900 flex items-center gap-1.5">
              <TrendingUp className="w-3.5 h-3.5 text-rose-600" />
              Yasal Artış Sınırı (TBK m. 344/2):
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Ev sahibi bu oranın üzerinde zam talep edemez. Sözleşmede daha yüksek bir oran yazsa dahi, kanun emredici nitelikte olup TÜİK 12 aylık TÜFE ortalaması tavanı geçerlidir.
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="Kira Artış Fişi"
            badge="TBK 344"
            primaryMetric={{
              label: "Yeni Yasal Tavan Kira Bedeli",
              amount: calculation.yeniKiraBedeli.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              currency: "TL/Ay",
              subtext: `Aylık Net Artış: +${calculation.aylikArtisTutari.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Kira tespit veya tahliye davalarında yasal bilirkişi hesaplama esasıdır."
          />

          <ConsultationForm
            toolName="Kira Hukuku ve Artış Anlaşmazlığı"
            calculationSummary={summaryText}
            title="Kira ve Tahliye İhtilaflarında Hukuki Destek"
            description="Fahiş kira artışı, kira tespit davaları, tahliye taahhütnamesi ve arabuluculuk süreçlerinde uzman gayrimenkul avukatlarımızdan ücretsiz ön inceleme alın."
            legalReference="Kira Hukuku & Arabuluculuk"
          />
        </div>
      </div>
    </div>
  );
}
