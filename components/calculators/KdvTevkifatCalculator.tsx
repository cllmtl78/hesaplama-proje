"use client";

import { useState, useMemo } from "react";
import { Receipt, Check } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

const TEVKIFAT_OPTIONS = [
  { label: "Tevkifat Yok", pay: 0, desc: "Tüm KDV satıcıya ödenir." },
  { label: "2/10", pay: 2, desc: "Temizlik, çevre ve bahçe bakım hizmetleri." },
  { label: "3/10", pay: 3, desc: "Yapım işleri, mühendislik-mimarlık." },
  { label: "4/10", pay: 4, desc: "Özel güvenlik, etüt, plan-proje." },
  { label: "5/10", pay: 5, desc: "Personel ve servis taşımacılığı, yemek." },
  { label: "7/10", pay: 7, desc: "Fason tekstil ve konfeksiyon işleri." },
  { label: "9/10", pay: 9, desc: "İşgücü temin hizmetleri." },
];

export default function KdvTevkifatCalculator() {
  const [faturaTutari, setFaturaTutari] = useState<number>(50000);
  const [hesaplamaYonu, setHesaplamaYonu] = useState<"haric" | "dahil">("haric");
  const [kdvOrani, setKdvOrani] = useState<number>(20); // %1, %10, %20
  const [tevkifatPay, setTevkifatPay] = useState<number>(5);

  const calculation = useMemo(() => {
    const rawAmount = faturaTutari || 0;
    const rateDecimal = kdvOrani / 100;

    let matrah = 0;
    let toplamKdv = 0;

    if (hesaplamaYonu === "haric") {
      matrah = rawAmount;
      toplamKdv = matrah * rateDecimal;
    } else {
      matrah = rawAmount / (1 + rateDecimal);
      toplamKdv = rawAmount - matrah;
    }

    const tevkifEdilenKdv = tevkifatPay > 0 ? (toplamKdv * tevkifatPay) / 10 : 0;
    const tahsilEdilecekKdv = toplamKdv - tevkifEdilenKdv;
    const tahsilEdilecekTutar = matrah + tahsilEdilecekKdv;

    return {
      matrah,
      toplamKdv,
      tevkifEdilenKdv,
      tahsilEdilecekKdv,
      tahsilEdilecekTutar,
    };
  }, [faturaTutari, hesaplamaYonu, kdvOrani, tevkifatPay]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "KDV Matrahı (Net Tutar)",
        value: `${calculation.matrah.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      },
      {
        label: `Hesaplanan KDV (%${kdvOrani})`,
        value: `${calculation.toplamKdv.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      },
      {
        label: `Tevkif Edilen KDV (${tevkifatPay}/10 Alıcı Payı)`,
        value: `-${calculation.tevkifEdilenKdv.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isDeduction: calculation.tevkifEdilenKdv > 0,
        hint: tevkifatPay > 0 ? "2 No.lu KDV ile alıcı tarafından devlete ödenir" : undefined,
      },
      {
        label: "Tahsil Edilecek KDV (Satıcı Payı)",
        value: `${calculation.tahsilEdilecekKdv.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        hint: "1 No.lu KDV beyannamesinde bildirilir",
      },
      {
        label: "Fatura Genel Toplamı (KDV Dahil)",
        value: `${(calculation.matrah + calculation.toplamKdv).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation, kdvOrani, tevkifatPay]);

  const summaryText = `Matrah: ${calculation.matrah.toLocaleString("tr-TR")} TL | KDV (%${kdvOrani}): ${calculation.toplamKdv.toLocaleString("tr-TR")} TL | Tevkifat (${tevkifatPay}/10): ${calculation.tevkifEdilenKdv.toLocaleString("tr-TR")} TL | Tahsil Edilecek Tutar: ${calculation.tahsilEdilecekTutar.toLocaleString("tr-TR")} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
          <span>3065 Sayılı KDV Kanunu & KDV Genel Uygulama Tebliği</span>
          <span className="text-slate-300">·</span>
          <span>1 & 2 No.lu KDV Beyannamesi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          KDV ve KDV Tevkifatı Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Fatura tutarını KDV dahil veya hariç girerek %1, %10, %20 oranları ve tüm yasal tevkifat paylarına göre alıcı ve satıcı hakedişlerini ayrıştırın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Input Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Receipt className="w-4 h-4 text-amber-600" />
              Fatura ve Tevkifat Parametreleri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              E-Fatura Uyumlu
            </span>
          </div>

          {/* Hesaplama Yönü (Segmented Control) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Hesaplama Yönü
            </label>
            <div className="grid grid-cols-2 gap-2 p-1 bg-slate-100 rounded-xl">
              <button
                type="button"
                onClick={() => setHesaplamaYonu("haric")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  hesaplamaYonu === "haric"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                KDV Hariçten Hesaba (+)
              </button>
              <button
                type="button"
                onClick={() => setHesaplamaYonu("dahil")}
                className={`py-2 text-xs font-semibold rounded-lg transition-all ${
                  hesaplamaYonu === "dahil"
                    ? "bg-white text-slate-900 shadow-xs"
                    : "text-slate-600 hover:text-slate-900"
                }`}
              >
                KDV Dahilden Hesaba (÷)
              </button>
            </div>
          </div>

          {/* Fatura Tutarı */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Fatura Tutarı <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">
                {hesaplamaYonu === "haric" ? "KDV Hariç Matrah" : "KDV Dahil Toplam Bedel"}
              </span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="500"
                value={faturaTutari || ""}
                onChange={(e) => setFaturaTutari(Number(e.target.value))}
                placeholder="Örn: 50000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[10000, 25000, 50000, 100000, 250000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setFaturaTutari(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    faturaTutari === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val.toLocaleString("tr-TR")} TL
                </button>
              ))}
            </div>
          </div>

          {/* KDV Oranı Hapları (%1, %10, %20) */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Uygulanacak KDV Oranı
            </label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { rate: 1, label: "%1 KDV", sub: "Temel gıda, tohum" },
                { rate: 10, label: "%10 KDV", sub: "Tekstil, turizm, ilaç" },
                { rate: 20, label: "%20 KDV", sub: "Genel standart oran" },
              ].map((item) => (
                <button
                  key={item.rate}
                  type="button"
                  onClick={() => setKdvOrani(item.rate)}
                  className={`p-2.5 rounded-xl border text-left transition-all ${
                    kdvOrani === item.rate
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold">{item.label}</div>
                  <div className={`text-[10px] mt-0.5 truncate ${kdvOrani === item.rate ? "text-slate-300" : "text-slate-400"}`}>
                    {item.sub}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Tevkifat Oranı Seçimi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              KDV Tevkifat Oranı (Varsa)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-1.5">
              {TEVKIFAT_OPTIONS.map((opt) => (
                <button
                  key={opt.pay}
                  type="button"
                  onClick={() => setTevkifatPay(opt.pay)}
                  className={`px-3 py-2 rounded-xl border text-xs font-semibold text-center transition-all ${
                    tevkifatPay === opt.pay
                      ? "bg-amber-500 text-white border-amber-500 shadow-xs font-bold"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
            <p className="text-[11px] text-slate-500 mt-1.5">
              {TEVKIFAT_OPTIONS.find((o) => o.pay === tevkifatPay)?.desc}
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="E-Fatura Tevkifat Dökümü"
            badge="3065 KDVK"
            primaryMetric={{
              label: "Satıcının Tahsil Edeceği Tutar",
              amount: calculation.tahsilEdilecekTutar.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              currency: "TL",
              subtext: `Matrah: ${calculation.matrah.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL + Kalan KDV: ${calculation.tahsilEdilecekKdv.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Tevkif edilen tutar, alıcı tarafından 2 No.lu KDV beyannamesiyle doğrudan vergi dairesine ödenir."
          />

          <ConsultationForm
            toolName="KDV Tevkifatı ve E-Fatura"
            calculationSummary={summaryText}
            title="Tevkifatlı Fatura ve Muhasebe Desteği"
            description="Tevkifat oranları, KDV iadesi, 1 ve 2 No.lu KDV beyanname süreçleriniz için uzman mali müşavirlik kadromuzdan danışmanlık talep edin."
            legalReference="KDV & Vergi Mevzuatı"
          />
        </div>
      </div>
    </div>
  );
}
