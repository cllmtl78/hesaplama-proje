"use client";

import { useState, useMemo } from "react";
import { Car, Calendar } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

type EngineTier = "1300" | "1301_1600" | "1601_1800" | "1801_2000" | "2001_plus";
type AgeTier = "1_3" | "4_6" | "7_11" | "12_15" | "16_plus";

const MTV_TARIFF_POST_2018: Record<EngineTier, Record<AgeTier, number>> = {
  "1300": { "1_3": 4436, "4_6": 3090, "7_11": 1730, "12_15": 1305, "16_plus": 460 },
  "1301_1600": { "1_3": 7728, "4_6": 5796, "7_11": 3360, "12_15": 2378, "16_plus": 916 },
  "1601_1800": { "1_3": 15200, "4_6": 11880, "7_11": 6990, "12_15": 4260, "16_plus": 1650 },
  "1801_2000": { "1_3": 23950, "4_6": 18450, "7_11": 10850, "12_15": 6480, "16_plus": 2540 },
  "2001_plus": { "1_3": 39200, "4_6": 30150, "7_11": 17850, "12_15": 10700, "16_plus": 4180 },
};

const MTV_TARIFF_PRE_2018: Record<EngineTier, Record<AgeTier, number>> = {
  "1300": { "1_3": 3850, "4_6": 2685, "7_11": 1505, "12_15": 1135, "16_plus": 400 },
  "1301_1600": { "1_3": 6720, "4_6": 5040, "7_11": 2920, "12_15": 2068, "16_plus": 796 },
  "1601_1800": { "1_3": 13220, "4_6": 10330, "7_11": 6080, "12_15": 3700, "16_plus": 1435 },
  "1801_2000": { "1_3": 20830, "4_6": 16040, "7_11": 9430, "12_15": 5635, "16_plus": 2210 },
  "2001_plus": { "1_3": 34090, "4_6": 26220, "7_11": 15520, "12_15": 9300, "16_plus": 3635 },
};

export default function MtvCalculator() {
  const [tescilDonemi, setTescilDonemi] = useState<"post2018" | "pre2018">("post2018");
  const [engineTier, setEngineTier] = useState<EngineTier>("1301_1600");
  const [ageTier, setAgeTier] = useState<AgeTier>("1_3");

  const calculation = useMemo(() => {
    const tariffMatrix = tescilDonemi === "post2018" ? MTV_TARIFF_POST_2018 : MTV_TARIFF_PRE_2018;
    const yillikMtv = tariffMatrix[engineTier][ageTier];
    const birinciTaksit = Math.round(yillikMtv / 2);
    const ikinciTaksit = yillikMtv - birinciTaksit;

    return {
      yillikMtv,
      birinciTaksit,
      ikinciTaksit,
    };
  }, [tescilDonemi, engineTier, ageTier]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "İlk Tescil Tarihi",
        value: tescilDonemi === "post2018" ? "01/01/2018 ve Sonrası" : "01/01/2018 Öncesi",
      },
      {
        label: "Motor Hacmi",
        value:
          engineTier === "1300"
            ? "≤ 1300 cc"
            : engineTier === "1301_1600"
            ? "1301 - 1600 cc"
            : engineTier === "1601_1800"
            ? "1601 - 1800 cc"
            : engineTier === "1801_2000"
            ? "1801 - 2000 cc"
            : "2001 cc ve üzeri",
      },
      {
        label: "Araç Yaş Grubu",
        value:
          ageTier === "1_3"
            ? "1 - 3 Yaş"
            : ageTier === "4_6"
            ? "4 - 6 Yaş"
            : ageTier === "7_11"
            ? "7 - 11 Yaş"
            : ageTier === "12_15"
            ? "12 - 15 Yaş"
            : "16+ Yaş",
      },
      {
        label: "1. Taksit Tutarı (Son Gün: 31 Ocak)",
        value: `${calculation.birinciTaksit.toLocaleString("tr-TR")} TL`,
        hint: "İnteraktif Vergi Dairesi / Banka",
      },
      {
        label: "2. Taksit Tutarı (Son Gün: 31 Temmuz)",
        value: `${calculation.ikinciTaksit.toLocaleString("tr-TR")} TL`,
        hint: "İnteraktif Vergi Dairesi / Banka",
      },
      {
        label: "Yıllık Toplam Vergi",
        value: `${calculation.yillikMtv.toLocaleString("tr-TR")} TL`,
        isHighlight: true,
      },
    ];
  }, [tescilDonemi, engineTier, ageTier, calculation]);

  const summaryText = `Tescil: ${tescilDonemi === "post2018" ? "2018 Sonrası" : "2018 Öncesi"} | Hacim: ${engineTier} | Yaş: ${ageTier} | Yıllık MTV: ${calculation.yillikMtv.toLocaleString("tr-TR")} TL | 1. Taksit: ${calculation.birinciTaksit.toLocaleString("tr-TR")} TL | 2. Taksit: ${calculation.ikinciTaksit.toLocaleString("tr-TR")} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>197 Sayılı Motorlu Taşıtlar Vergisi Kanunu</span>
          <span className="text-slate-300">·</span>
          <span>2026 Güncel Yeniden Değerleme Tarifesi</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Motorlu Taşıtlar Vergisi (MTV) Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Aracınızın tescil tarihi, motor hacmi ve yaşına göre 2026 yılı yasal MTV tutarını, Ocak ve Temmuz ayı taksit tutarlarını hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Car className="w-4 h-4 text-indigo-600" />
              Araç Tescil ve Motor Bilgileri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              197 Sayılı Kanun
            </span>
          </div>

          {/* İlk Tescil Tarihi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              İlk Tescil Tarihi
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setTescilDonemi("post2018")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tescilDonemi === "post2018"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold">01/01/2018 ve Sonrası</div>
                <div className={`text-[11px] mt-0.5 ${tescilDonemi === "post2018" ? "text-slate-300" : "text-slate-400"}`}>
                  Taşıt değeri esaslı sistem
                </div>
              </button>

              <button
                type="button"
                onClick={() => setTescilDonemi("pre2018")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  tescilDonemi === "pre2018"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold">01/01/2018 Öncesi</div>
                <div className={`text-[11px] mt-0.5 ${tescilDonemi === "pre2018" ? "text-slate-300" : "text-slate-400"}`}>
                  Klasik yaş ve motor tarifesi
                </div>
              </button>
            </div>
          </div>

          {/* Motor Silindir Hacmi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Motor Silindir Hacmi
            </label>
            <select
              value={engineTier}
              onChange={(e) => setEngineTier(e.target.value as EngineTier)}
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors outline-hidden"
            >
              <option value="1300">1.300 cc ve aşağısı</option>
              <option value="1301_1600">1.301 - 1.600 cc (Standart binek)</option>
              <option value="1601_1800">1.601 - 1.800 cc</option>
              <option value="1801_2000">1.801 - 2.000 cc</option>
              <option value="2001_plus">2.001 cc ve üzeri</option>
            </select>
          </div>

          {/* Araç Yaşı */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Araç Yaş Dilimi
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                { id: "1_3", label: "1-3 Yaş" },
                { id: "4_6", label: "4-6 Yaş" },
                { id: "7_11", label: "7-11 Yaş" },
                { id: "12_15", label: "12-15 Yaş" },
                { id: "16_plus", label: "16+ Yaş" },
              ].map((tier) => (
                <button
                  key={tier.id}
                  type="button"
                  onClick={() => setAgeTier(tier.id as AgeTier)}
                  className={`h-10 text-xs font-semibold rounded-xl border transition-all text-center ${
                    ageTier === tier.id
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Bilgilendirme */}
          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200/60 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-indigo-900 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-indigo-600" />
              Yıllık Ödeme Takvimi:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              MTV yılda 2 eşit taksitte ödenir. 1. taksit için son gün <strong>31 Ocak</strong>, 2. taksit için son gün <strong>31 Temmuz</strong>&apos;dur. Muayene randevusu öncesi borç bulunmaması zorunludur.
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="2026 MTV Tahakkuk Fişi"
            badge="197 Sayılı Kanun"
            primaryMetric={{
              label: "Yıllık Toplam MTV Tutarı",
              amount: calculation.yillikMtv.toLocaleString("tr-TR"),
              currency: "TL/Yıl",
              subtext: `1. Taksit: ${calculation.birinciTaksit.toLocaleString("tr-TR")} TL + 2. Taksit: ${calculation.ikinciTaksit.toLocaleString("tr-TR")} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Zamanında ödenmeyen taksitlere 6183 sayılı kanun uyarınca aylık gecikme zammı işletilir."
          />

          <ConsultationForm
            toolName="Motorlu Taşıtlar Vergisi (MTV)"
            calculationSummary={summaryText}
            title="Kurumsal Filo ve Taşıt Vergi Desteği"
            description="Şirket aktifindeki binek ve ticari araçların MTV, kasko, amortisman ve akaryakıt gider kısıtlaması optimizasyonu için mali müşavirlik desteği alın."
            legalReference="Taşıt & Kurumsal Filo Danışmanlığı"
          />
        </div>
      </div>
    </div>
  );
}
