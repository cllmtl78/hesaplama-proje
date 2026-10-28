"use client";

import { useState, useMemo } from "react";
import { Calendar, AlertCircle, Briefcase } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";
import { hesaplaKidemIhbar, MEVZUAT_2026 } from "@/lib/mevzuatKurallari";

const KIDEM_TAVANI = MEVZUAT_2026.KIDEM_TAVANI; // 2026 Resmi Kıdem Tavanı (TL)

export default function KidemIhbarCalculator() {
  const today = new Date();
  const threeYearsAgo = new Date(today);
  threeYearsAgo.setFullYear(today.getFullYear() - 3);

  const formatDate = (d: Date) => d.toISOString().split("T")[0];

  const [startDate, setStartDate] = useState(formatDate(threeYearsAgo));
  const [endDate, setEndDate] = useState(formatDate(today));
  const [grossSalary, setGrossSalary] = useState<number>(35000);
  const [additionalBenefits, setAdditionalBenefits] = useState<number>(0);

  const calculation = useMemo(() => {
    return hesaplaKidemIhbar(startDate, endDate, grossSalary, additionalBenefits);
  }, [startDate, endDate, grossSalary, additionalBenefits]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    if (!calculation) return [];
    return [
      {
        label: "Hizmet Süresi",
        value: `${calculation.years} Yıl ${calculation.months} Ay ${calculation.days} Gün (${calculation.totalDays} Gün)`,
      },
      {
        label: "Giydirilmiş Brüt Maaş",
        value: `${calculation.monthlyGross.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`,
        hint: calculation.isCapped ? "Kıdem tavanı uygulandı" : undefined,
      },
      {
        label: "Brüt Kıdem Tazminatı",
        value: calculation.eligibleForKidem
          ? `${calculation.brutKidem.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`
          : "0,00 TL (1 yılı doldurmadı)",
      },
      {
        label: "Kıdem Damga Vergisi (‰7,59)",
        value: `-${calculation.kidemDamgaVergisi.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`,
        isDeduction: true,
      },
      {
        label: "Net Kıdem Tazminatı",
        value: `${calculation.netKidem.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`,
        isHighlight: true,
      },
      {
        label: `Brüt İhbar Tazminatı (${calculation.noticeWeeks} Hafta)`,
        value: `${calculation.brutIhbar.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`,
      },
      {
        label: "İhbar Gelir Vergisi (%15)",
        value: `-${calculation.ihbarGelirVergisi.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`,
        isDeduction: true,
      },
      {
        label: "İhbar Damga Vergisi (‰7,59)",
        value: `-${calculation.ihbarDamgaVergisi.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`,
        isDeduction: true,
      },
      {
        label: "Net İhbar Tazminatı",
        value: `${calculation.netIhbar.toLocaleString("tr-TR", { minimumFractionDigits: 2 })} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation]);

  const summaryText = calculation
    ? `Hizmet: ${calculation.years}y ${calculation.months}a ${calculation.days}g | Giydirilmiş Brüt: ${calculation.monthlyGross.toLocaleString("tr-TR")} TL | Net Kıdem: ${calculation.netKidem.toLocaleString("tr-TR")} TL | Net İhbar: ${calculation.netIhbar.toLocaleString("tr-TR")} TL | Toplam Net: ${calculation.totalNet.toLocaleString("tr-TR")} TL`
    : "";

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <span>1475 & 4857 Sayılı İş Kanunu</span>
          <span className="text-slate-300">·</span>
          <span>2026/Q1 Kıdem Tavanı: 46.000 TL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Kıdem ve İhbar Tazminatı Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          İşe başlama ve ayrılma tarihlerine göre gün, ay ve yıl bazında tam sürenizi, yasal kıdem tavanını ve resmi kesintiler sonrası net hakedişinizi hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile-First 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (60% on desktop) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Calendar className="w-4 h-4 text-blue-600" />
              Çalışma ve Ücret Parametreleri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              Yasal Formül
            </span>
          </div>

          {/* Tarih Seçiciler */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                İşe Başlama Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              />
            </div>

            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                İşten Ayrılma Tarihi <span className="text-red-500">*</span>
              </label>
              <input
                type="date"
                required
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              />
            </div>
          </div>

          {/* Aylık Brüt Temel Ücret */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Aylık Brüt Temel Ücret <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Bordro brüt tutarı</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="500"
                value={grossSalary || ""}
                onChange={(e) => setGrossSalary(Number(e.target.value))}
                placeholder="Örn: 35000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[26005, 35000, 46000, 60000, 85000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setGrossSalary(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    grossSalary === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val.toLocaleString("tr-TR")} TL
                </button>
              ))}
            </div>
          </div>

          {/* Düzenli Yan Haklar */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Düzenli Yan Haklar (Yol, Yemek, İkramiye vb.)
              </label>
              <span className="text-[10px] text-slate-400">Aylık brüt karşılık</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="250"
                value={additionalBenefits || ""}
                onChange={(e) => setAdditionalBenefits(Number(e.target.value))}
                placeholder="0"
                className="w-full h-11 pl-3.5 pr-16 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL/Ay
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-1">
              Süreklilik arz eden ayni ve nakdi yan haklar brüt maaşa eklenerek &quot;giydirilmiş brüt ücret&quot; bulunur.
            </p>
          </div>

          {/* Yasal Tavan ve Bilgilendirme Kutusu */}
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs text-slate-700 space-y-1">
            <div className="flex items-center justify-between font-semibold text-blue-900">
              <span className="flex items-center gap-1.5">
                <Briefcase className="w-3.5 h-3.5 text-blue-600" />
                2026 Kıdem Tazminatı Tavanı:
              </span>
              <span className="font-mono text-sm font-bold text-blue-700">
                {KIDEM_TAVANI.toLocaleString("tr-TR")} TL
              </span>
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Maaşınız bu tavanı aşsa dahi, kıdem tazminatı hesabında kanunen azami 46.000 TL tavan dikkate alınır. Damga vergisi kesintisi (‰7,59) dışında herhangi bir gelir vergisi veya SGK kesintisi yapılmaz.
            </p>
          </div>

          {/* Uyarılar */}
          {calculation && !calculation.eligibleForKidem && (
            <div className="p-3.5 rounded-xl bg-amber-50 border border-amber-200 text-xs flex items-start gap-2.5">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div className="text-amber-900">
                <span className="font-bold">1 Yılı Doldurmadığı İçin Kıdem Tazminatı Doğmaz:</span>
                <p className="text-[11px] mt-0.5 text-amber-800 leading-relaxed">
                  Toplam çalışma süreniz {calculation.totalDays} gün ({calculation.months} ay {calculation.days} gün) olup, kanunen en az 365 gün hizmet zorunludur. Ancak ihbar tazminatı hakkınız saklıdır.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40% on desktop) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          {calculation ? (
            <>
              {/* Modern Stripe-Style Receipt Card */}
              <FintechReceiptCard
                title="Tazminat Hesaplama Fişi"
                badge="4857 Sayılı Kanun"
                primaryMetric={{
                  label: "Toplam Net Ele Geçecek Tutar",
                  amount: calculation.totalNet.toLocaleString("tr-TR", {
                    minimumFractionDigits: 2,
                    maximumFractionDigits: 2,
                  }),
                  currency: "TL",
                  subtext: `Net Kıdem: ${calculation.netKidem.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL + Net İhbar: ${calculation.netIhbar.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`,
                }}
                items={receiptItems}
                copyText={summaryText}
                legalNote="1475 SK m.14 ve 4857 SK m.17 uyarınca resmi damga vergisi düşülerek hesaplanmıştır."
              />

              {/* Consultation Card Right Underneath Receipt */}
              <ConsultationForm
                toolName="Kıdem ve İhbar Tazminatı"
                calculationSummary={summaryText}
                title="Tazminatınız Eksik mi Hesaplandı?"
                description="İşten çıkarılma, haklı fesih, arabuluculuk ve kıdem alacağı uyuşmazlıklarında uzman iş hukuku kadromuzdan ücretsiz ön inceleme talep edin."
                legalReference="İş Hukuku & Arabuluculuk"
              />
            </>
          ) : (
            <div className="bg-white rounded-2xl border border-slate-200/90 p-6 text-center text-xs text-slate-500 shadow-xs">
              Lütfen geçerli bir işe başlama ve işten ayrılma tarihi seçiniz.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
