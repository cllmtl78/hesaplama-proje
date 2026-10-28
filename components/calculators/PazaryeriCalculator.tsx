"use client";

import { useState, useMemo } from "react";
import { ShoppingBag } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

const SABIT_HIZMET_BEDELI = 15; // Pazaryeri işlem/hizmet bedeli (TL)

const CATEGORY_PRESETS = [
  { name: "Giyim & Moda", rate: 21 },
  { name: "Elektronik & Bilgisayar", rate: 10 },
  { name: "Kozmetik & Kişisel Bakım", rate: 18 },
  { name: "Ev & Yaşam / Dekorasyon", rate: 17 },
  { name: "Ayakkabı & Çanta", rate: 22 },
  { name: "Oto Aksesuar", rate: 15 },
];

export default function PazaryeriCalculator() {
  const [alisFiyati, setAlisFiyati] = useState<number>(250);
  const [satisFiyati, setSatisFiyati] = useState<number>(650);
  const [komisyonOrani, setKomisyonOrani] = useState<number>(18);
  const [kargoUcreti, setKargoUcreti] = useState<number>(45);

  const calculation = useMemo(() => {
    const satis = satisFiyati || 0;
    const alis = alisFiyati || 0;
    const kargo = kargoUcreti || 0;
    const komisyonYuzde = komisyonOrani || 0;

    const komisyonTutari = satis * (komisyonYuzde / 100);
    const hizmetBedeli = SABIT_HIZMET_BEDELI;
    const toplamPazaryeriKesintisi = komisyonTutari + hizmetBedeli + kargo;
    const netKar = satis - alis - toplamPazaryeriKesintisi;
    const karMarji = satis > 0 ? (netKar / satis) * 100 : 0;
    const netTahsilat = satis - toplamPazaryeriKesintisi;

    return {
      satis,
      alis,
      kargo,
      komisyonYuzde,
      komisyonTutari,
      hizmetBedeli,
      toplamPazaryeriKesintisi,
      netTahsilat,
      netKar,
      karMarji,
    };
  }, [alisFiyati, satisFiyati, komisyonOrani, kargoUcreti]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Ürün Satış Fiyatı (KDV Dahil)",
        value: `${calculation.satis.toLocaleString("tr-TR")} TL`,
      },
      {
        label: `Kategori Komisyonu (%${calculation.komisyonYuzde})`,
        value: `-${calculation.komisyonTutari.toFixed(2)} TL`,
        isDeduction: true,
      },
      {
        label: "Pazaryeri Hizmet / Listeleme Bedeli",
        value: `-${calculation.hizmetBedeli} TL`,
        isDeduction: true,
      },
      {
        label: "Anlaşmalı Kargo Bedeli",
        value: `-${calculation.kargo} TL`,
        isDeduction: true,
      },
      {
        label: "Ürün Alış / Tedarik Maliyeti",
        value: `-${calculation.alis} TL`,
        isDeduction: true,
      },
      {
        label: "Hesabınıza Geçecek Net Tahsilat",
        value: `${calculation.netTahsilat.toFixed(2)} TL`,
      },
      {
        label: "Net Kârınız (Tüm Masraflar Sonrası)",
        value: `${calculation.netKar.toFixed(2)} TL (%${calculation.karMarji.toFixed(1)} Kâr Marjı)`,
        isHighlight: true,
      },
    ];
  }, [calculation]);

  const summaryText = `Satış: ${calculation.satis} TL | Alış: ${calculation.alis} TL | Komisyon: %${calculation.komisyonYuzde} | Net Kâr: ${calculation.netKar.toFixed(2)} TL | Kâr Marjı: %${calculation.karMarji.toFixed(1)}`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-emerald-600 mb-1">
          <span>Trendyol, Hepsiburada, Amazon, Çiçeksepeti</span>
          <span className="text-slate-300">·</span>
          <span>E-Ticaret Kâr & Komisyon Simülasyonu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Pazaryeri Komisyon ve Kâr Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Ürün alış ve satış fiyatı, pazaryeri kategori komisyonu, kargo ve işlem bedellerini hesaplayarak net tahsilat tutarınızı ve reel kâr marjınızı anında görün.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <ShoppingBag className="w-4 h-4 text-emerald-600" />
              Ürün Fiyatı ve Kesinti Parametreleri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              E-Ticaret 2026
            </span>
          </div>

          {/* Fiyat Girdileri */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Ürün Satış Fiyatı (TL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={satisFiyati || ""}
                onChange={(e) => setSatisFiyati(Number(e.target.value))}
                placeholder="Örn: 650"
                className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Ürün Alış / İmalat Maliyeti (TL) <span className="text-red-500">*</span>
              </label>
              <input
                type="number"
                min="0"
                step="10"
                value={alisFiyati || ""}
                onChange={(e) => setAlisFiyati(Number(e.target.value))}
                placeholder="Örn: 250"
                className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors outline-hidden"
              />
            </div>
          </div>

          {/* Kategori Komisyonu */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Pazaryeri Kategori Komisyon Oranı (%) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400 font-mono">%{komisyonOrani}</span>
            </div>
            <input
              type="number"
              min="0"
              max="50"
              step="0.5"
              value={komisyonOrani || ""}
              onChange={(e) => setKomisyonOrani(Number(e.target.value))}
              placeholder="Örn: 18"
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors outline-hidden"
            />

            {/* Kategori Şablon Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {CATEGORY_PRESETS.map((cat) => (
                <button
                  key={cat.name}
                  type="button"
                  onClick={() => setKomisyonOrani(cat.rate)}
                  className={`px-2.5 py-1 text-[11px] rounded-lg border transition-all ${
                    komisyonOrani === cat.rate
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {cat.name} (%{cat.rate})
                </button>
              ))}
            </div>
          </div>

          {/* Kargo Ücreti */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Ortalama Desi Kargo Bedeli (TL)
              </label>
              <span className="text-[10px] text-slate-400">Pazaryeri kargo kesintisi</span>
            </div>
            <input
              type="number"
              min="0"
              step="5"
              value={kargoUcreti || ""}
              onChange={(e) => setKargoUcreti(Number(e.target.value))}
              placeholder="Örn: 45"
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/10 transition-colors outline-hidden"
            />
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="Sipariş Başı Kârlılık Fişi"
            badge="E-Ticaret Net Kâr"
            primaryMetric={{
              label: "Ürün Başına Kalan Net Kâr",
              amount: calculation.netKar.toFixed(2),
              currency: "TL",
              subtext: `Kâr Marjı: %${calculation.karMarji.toFixed(1)} | Net Tahsilat: ${calculation.netTahsilat.toFixed(2)} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Pazaryeri 15 TL sabit hizmet bedeli ve kargo kesintisi hesaba dahil edilmiştir."
          />

          <ConsultationForm
            toolName="E-Ticaret ve Pazaryeri Muhasebesi"
            calculationSummary={summaryText}
            title="E-Ticaret Vergi ve Şirket Danışmanlığı"
            description="Pazaryeri e-arşiv faturalandırma, stopaj kesintileri, KDV beyannameleri ve şirket büyüme stratejileriniz için mali müşavirlik desteği alın."
            legalReference="E-Ticaret & Şirket Muhasebesi"
          />
        </div>
      </div>
    </div>
  );
}
