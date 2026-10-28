"use client";

import { useState, useMemo } from "react";
import { Coins, FileText, Check } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

import { hesaplaBruttenNete12Ay, MEVZUAT_2026 } from "@/lib/mevzuatKurallari";

const ASGARI_UCRET_BRUT_2026 = MEVZUAT_2026.ASGARI_UCRET_BRUT; // 2026 Brüt Asgari Ücret

export default function BruttenNeteCalculator() {
  const [brutMaas, setBrutMaas] = useState<number>(45000);
  const [engellilikDerecesi, setEngellilikDerecesi] = useState<number>(0);

  const monthlyResults = useMemo(() => {
    return hesaplaBruttenNete12Ay(brutMaas, engellilikDerecesi);
  }, [brutMaas, engellilikDerecesi]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Aylık Brüt Maaş",
        value: `${monthlyResults.brut.toLocaleString("tr-TR")} TL`,
      },
      {
        label: "Ocak Ayı Net Ele Geçen (İlk Dilim %15)",
        value: `${Math.round(monthlyResults.ocaNet).toLocaleString("tr-TR")} TL`,
      },
      {
        label: "Aralık Ayı Net Ele Geçen (Üst Dilim Sonrası)",
        value: `${Math.round(monthlyResults.araNet).toLocaleString("tr-TR")} TL`,
        hint: "Kümülatif matrah dilim artışı etkisi",
      },
      {
        label: "12 Aylık Toplam Net Ele Geçen",
        value: `${Math.round(monthlyResults.annualNet).toLocaleString("tr-TR")} TL`,
      },
      {
        label: "12 Aylık Ortalama Net Maaş",
        value: `${Math.round(monthlyResults.avgNet).toLocaleString("tr-TR")} TL/Ay`,
        isHighlight: true,
      },
    ];
  }, [monthlyResults]);

  const summaryText = `Brüt: ${monthlyResults.brut} TL | Ortalama Net: ${Math.round(monthlyResults.avgNet)} TL | Ocak Net: ${Math.round(monthlyResults.ocaNet)} TL | Aralık Net: ${Math.round(monthlyResults.araNet)} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <span>5510 Sayılı Kanun & 193 Sayılı Gelir Vergisi Kanunu</span>
          <span className="text-slate-300">·</span>
          <span>Asgari Ücret Vergi İstisnası Dahil</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Brütten Nete Maaş Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Kümülatif gelir vergisi matrahı, artan oranlı vergi dilimleri (%15 - %40) ve asgari ücret muafiyetiyle Ocak&apos;tan Aralık&apos;a 12 ayın net maaş değişimini hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form + 12-Month Ledger Table (60%) */}
        <div className="lg:col-span-7 space-y-5">
          <div className="bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
                <Coins className="w-4 h-4 text-blue-600" />
                Maaş ve Bordro Parametreleri
              </span>
              <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                2026/Q1
              </span>
            </div>

            {/* Aylık Brüt Maaş */}
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[11px] font-semibold text-slate-700">
                  Aylık Brüt Temel Maaş (TL) <span className="text-red-500">*</span>
                </label>
                <span className="text-[10px] text-slate-400">
                  Taban: {ASGARI_UCRET_BRUT_2026.toLocaleString("tr-TR")} TL
                </span>
              </div>
              <div className="relative">
                <input
                  type="number"
                  min={ASGARI_UCRET_BRUT_2026}
                  step="500"
                  value={brutMaas || ""}
                  onChange={(e) => setBrutMaas(Number(e.target.value))}
                  placeholder="Örn: 45000"
                  className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
                />
                <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                  TL
                </span>
              </div>

              {/* Hızlı Seçim Buton Hapları */}
              <div className="flex flex-wrap gap-1.5 mt-2">
                {[26005, 35000, 45000, 65000, 90000, 120000].map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => setBrutMaas(val)}
                    className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                      brutMaas === val
                        ? "bg-slate-900 text-white border-slate-900 font-semibold"
                        : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    {val.toLocaleString("tr-TR")} TL
                  </button>
                ))}
              </div>
            </div>

            {/* Engellilik Durumu */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-700 mb-1">
                Engellilik Vergi İndirimi
              </label>
              <select
                value={engellilikDerecesi}
                onChange={(e) => setEngellilikDerecesi(Number(e.target.value))}
                className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              >
                <option value={0}>Engellilik İndirimi Yok</option>
                <option value={1}>1. Derece Engelli (8.000 TL Matrah İndirimi)</option>
                <option value={2}>2. Derece Engelli (4.700 TL Matrah İndirimi)</option>
                <option value={3}>3. Derece Engelli (2.000 TL Matrah İndirimi)</option>
              </select>
            </div>
          </div>

          {/* 12 Aylık Döküm Tablosu */}
          <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs overflow-hidden">
            <div className="px-4 py-3 bg-slate-50 border-b border-slate-200/80 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-900 flex items-center gap-1.5 uppercase tracking-wide">
                <FileText className="w-3.5 h-3.5 text-blue-600" />
                12 Aylık Maaş ve Kesinti Değişim Tablosu
              </span>
              <span className="text-[10px] font-mono text-slate-400">2026 Projeksiyonu</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-slate-50/50 border-b border-slate-200 text-slate-600 font-semibold text-[11px]">
                  <tr>
                    <th className="py-2.5 px-3">Ay</th>
                    <th className="py-2.5 px-3">SGK + İşsizlik</th>
                    <th className="py-2.5 px-3">Küm. Matrah</th>
                    <th className="py-2.5 px-3">Ödenen GV</th>
                    <th className="py-2.5 px-3 text-right">Net Ele Geçen</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dashed divide-slate-200 text-slate-700 font-mono text-xs">
                  {monthlyResults.list.map((m) => (
                    <tr key={m.monthIndex} className="hover:bg-blue-50/40 transition-colors">
                      <td className="py-2.5 px-3 font-sans font-semibold text-slate-900">{m.monthName}</td>
                      <td className="py-2.5 px-3 tabular-nums">
                        {Math.round(m.sgkWorker + m.unempWorker).toLocaleString("tr-TR")} TL
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-slate-500">
                        {Math.round(m.cumTaxBase).toLocaleString("tr-TR")} TL
                      </td>
                      <td className="py-2.5 px-3 tabular-nums text-red-600">
                        {Math.round(m.netIncomeTax).toLocaleString("tr-TR")} TL
                      </td>
                      <td className="py-2.5 px-3 text-right font-bold text-slate-900 tabular-nums">
                        {Math.round(m.netSalary).toLocaleString("tr-TR")} TL
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="Yıllık Maaş Bordro Fişi"
            badge="5510 & 193 GVK"
            primaryMetric={{
              label: "Yıllık Ortalama Net Maaş",
              amount: Math.round(monthlyResults.avgNet).toLocaleString("tr-TR"),
              currency: "TL/Ay",
              subtext: `Ocak: ${Math.round(monthlyResults.ocaNet).toLocaleString("tr-TR")} TL → Aralık: ${Math.round(monthlyResults.araNet).toLocaleString("tr-TR")} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Asgari ücrete isabet eden gelir ve damga vergisi istisnası hesaplamaya dahil edilmiştir."
          />

          <ConsultationForm
            toolName="Brütten Nete ve Bordro Danışmanlığı"
            calculationSummary={summaryText}
            title="Bordro Denetimi ve İş Hukuku Desteği"
            description="Bordronuzdaki vergi dilimi kesintileri, fazla mesai, yan haklar ve SGK prim matrahının usule uygunluğu konusunda iş hukuku uzmanlarımızdan destek alın."
            legalReference="İş Hukuku & Ücret Bordrosu"
          />
        </div>
      </div>
    </div>
  );
}
