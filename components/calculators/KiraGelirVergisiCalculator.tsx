"use client";

import { useState, useMemo } from "react";
import { Building, Calendar } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

import { hesaplaKiraGelirVergisi, MEVZUAT_2026 } from "@/lib/mevzuatKurallari";

const MESKEN_ISTISNASI_2026 = MEVZUAT_2026.MESKEN_KIRA_ISTISNASI; // 2026 Mesken İstisnası (TL)

export default function KiraGelirVergisiCalculator() {
  const [yillikKira, setYillikKira] = useState<number>(240000);
  const [giderTuru, setGiderTuru] = useState<"goturu" | "gercek">("goturu");
  const [gercekGider, setGercekGider] = useState<number>(25000);

  const calculation = useMemo(() => {
    return hesaplaKiraGelirVergisi(yillikKira, giderTuru, gercekGider);
  }, [yillikKira, giderTuru, gercekGider]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    if (calculation.istisnaKapsamindaMi) {
      return [
        {
          label: "Toplam Yıllık Kira Geliri",
          value: `${calculation.kira.toLocaleString("tr-TR")} TL`,
        },
        {
          label: "2026 Mesken İstisnası Tutarı",
          value: `${MESKEN_ISTISNASI_2026.toLocaleString("tr-TR")} TL`,
          hint: "İstisna sınırının altındadır",
        },
        {
          label: "Yasal Beyanname Yükümlülüğü",
          value: "Beyanname Verilmez",
          hint: "193 GVK md. 21 uyarınca muafiyet",
        },
        {
          label: "Yıllık Toplam Ödenecek Vergi",
          value: "0 TL (İstisna Kapsamında, Beyanname Verilmez)",
          isHighlight: true,
        },
      ];
    }

    return [
      {
        label: "Toplam Yıllık Kira Geliri",
        value: `${calculation.kira.toLocaleString("tr-TR")} TL`,
      },
      {
        label: "2026 Mesken İstisnası",
        value: `-${MESKEN_ISTISNASI_2026.toLocaleString("tr-TR")} TL`,
        isDeduction: true,
      },
      {
        label: giderTuru === "goturu" ? "Götürü Gider İndirimi (%15)" : "Gerçek Gider İndirimi",
        value: `-${Math.round(calculation.indirilecekGider).toLocaleString("tr-TR")} TL`,
        isDeduction: true,
      },
      {
        label: "Vergi Matrahı",
        value: `${Math.round(calculation.vergiMatrahi).toLocaleString("tr-TR")} TL`,
      },
      {
        label: "1. Taksit (Son Gün: 31 Mart)",
        value: `${Math.round(calculation.taksit1).toLocaleString("tr-TR")} TL`,
        hint: "Damga vergisi dahildir",
      },
      {
        label: "2. Taksit (Son Gün: 31 Temmuz)",
        value: `${Math.round(calculation.taksit2).toLocaleString("tr-TR")} TL`,
      },
      {
        label: "Yıllık Toplam Ödenecek Vergi",
        value: `${Math.round(calculation.toplamVergi).toLocaleString("tr-TR")} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation, giderTuru]);

  const summaryText = calculation.istisnaKapsamindaMi
    ? `Yıllık Kira: ${calculation.kira} TL | İstisna Tutarı: 45.000 TL | Sonuç: 0 TL (İstisna Kapsamında, Beyanname Verilmez)`
    : `Yıllık Kira: ${calculation.kira} TL | İstisna: 45.000 TL | Gider Türü: ${giderTuru} | Toplam Vergi: ${Math.round(calculation.toplamVergi)} TL | 1. Taksit: ${Math.round(calculation.taksit1)} TL | 2. Taksit: ${Math.round(calculation.taksit2)} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
          <span>193 Sayılı Gelir Vergisi Kanunu (GMSİ)</span>
          <span className="text-slate-300">·</span>
          <span>2026 Yılı Konut İstisnası: 45.000 TL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Kira Gelir Vergisi (GMSİ) Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Konut kira gelirleriniz için 45.000 TL yasal istisna, %15 götürü veya gerçek gider indirimiyle yıllık vergi tutarını ve Mart/Temmuz taksitlerini hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Building className="w-4 h-4 text-amber-600" />
              Kira Geliri ve Gider Seçimi
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              GMSİ 2026
            </span>
          </div>

          {/* Yıllık Toplam Kira Geliri */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Yıllık Toplam Brüt Kira Geliri (TL) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">12 ayın toplam tahsilatı</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="10000"
                value={yillikKira || ""}
                onChange={(e) => setYillikKira(Number(e.target.value))}
                placeholder="Örn: 240000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL/Yıl
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[120000, 180000, 240000, 360000, 500000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setYillikKira(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    yillikKira === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val.toLocaleString("tr-TR")} TL
                </button>
              ))}
            </div>
          </div>

          {/* Gider Yöntemi Seçimi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Gider İndirim Yöntemi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setGiderTuru("goturu")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  giderTuru === "goturu"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold">Götürü Gider Yöntemi (%15)</div>
                <div className={`text-[11px] mt-0.5 ${giderTuru === "goturu" ? "text-slate-300" : "text-slate-400"}`}>
                  Belge gerektirmez, istisna sonrası tutardan %15 düşülür
                </div>
              </button>

              <button
                type="button"
                onClick={() => setGiderTuru("gercek")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  giderTuru === "gercek"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold">Gerçek Gider Yöntemi</div>
                <div className={`text-[11px] mt-0.5 ${giderTuru === "gercek" ? "text-slate-300" : "text-slate-400"}`}>
                  Kredi faizi, tadilat, sigorta faturaları ibraz edilir
                </div>
              </button>
            </div>
          </div>

          {/* Gerçek Gider Girişi (Opsiyonel) */}
          {giderTuru === "gercek" && (
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Yıllık Belgeli Gerçek Giderler Toplamı (TL)
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="2500"
                  value={gercekGider || ""}
                  onChange={(e) => setGercekGider(Number(e.target.value))}
                  placeholder="Örn: 25000"
                  className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-colors outline-hidden"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                  TL
                </span>
              </div>
            </div>
          )}

          {/* Ödeme Takvimi Hatırlatması */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-amber-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-amber-600" />
              Yıllık Beyanname ve Ödeme Takvimi:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Yıllık kira geliri beyannamesi her yıl <strong>1 - 31 Mart</strong> tarihleri arasında Hazır Beyan Sistemi üzerinden verilir. 1. taksit 31 Mart&apos;a, 2. taksit ise 31 Temmuz&apos;a kadar ödenir.
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="GMSİ Vergi Fişi"
            badge="193 Sayılı Kanun"
            primaryMetric={{
              label: "Yıllık Toplam Ödenecek Vergi",
              amount: calculation.istisnaKapsamindaMi
                ? "0 TL (İstisna Kapsamında, Beyanname Verilmez)"
                : Math.round(calculation.toplamVergi).toLocaleString("tr-TR"),
              currency: calculation.istisnaKapsamindaMi ? "" : "TL",
              subtext: calculation.istisnaKapsamindaMi
                ? "Yıllık kira geliri 45.000 TL yasal istisna altında kaldığı için GMSİ beyannamesi verilmez ve vergi doğmaz."
                : `1. Taksit (Mart): ${Math.round(calculation.taksit1).toLocaleString("tr-TR")} TL + 2. Taksit (Temmuz): ${Math.round(calculation.taksit2).toLocaleString("tr-TR")} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote={
              calculation.istisnaKapsamindaMi
                ? "193 Sayılı GVK Madde 21 uyarınca mesken istisnası haddini aşmayan konut kira gelirleri için beyanname verilmez."
                : "Beyanname damga vergisi (650 TL) 1. takside dahil edilmiştir."
            }
          />

          <ConsultationForm
            toolName="Kira Gelir Vergisi (GMSİ)"
            calculationSummary={summaryText}
            title="Hazır Beyan ve Kira Vergisi Danışmanlığı"
            description="Konut ve işyeri kira gelirinizin Hazır Beyan Sistemine doğru aktarılması, gerçek gider indirimi ve cezasız beyanname süreci için mali müşavir desteği alın."
            legalReference="GMSİ & Vergi Mevzuatı"
          />
        </div>
      </div>
    </div>
  );
}
