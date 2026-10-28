"use client";

import { useState, useMemo } from "react";
import { Scale } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

import { hesaplaFazlaMesai, MEVZUAT_2026 } from "@/lib/mevzuatKurallari";

export default function FazlaMesaiCalculator() {
  const [brutMaas, setBrutMaas] = useState<number>(35000);
  const [haftalikMesaiSaati, setHaftalikMesaiSaati] = useState<number>(6);
  const [tatilGunSayisi, setTatilGunSayisi] = useState<number>(2);

  const calculation = useMemo(() => {
    return hesaplaFazlaMesai(brutMaas, haftalikMesaiSaati, tatilGunSayisi);
  }, [brutMaas, haftalikMesaiSaati, tatilGunSayisi]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Normal Saat Ücreti (Brüt/225)",
        value: `${calculation.normalSaatUcreti.toFixed(2)} TL/saat`,
      },
      {
        label: "Fazla Mesai Saat Ücreti (%50 Zamlı)",
        value: `${calculation.saatlikFazlaMesai.toFixed(2)} TL/saat`,
        hint: `Aylık ~${calculation.aylikToplamMesaiSaati.toFixed(1)} saat mesai`,
      },
      {
        label: "Brüt Fazla Mesai Alacağı",
        value: `${calculation.brutFazlaMesai.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      },
      {
        label: `Resmi Tatil Günlük Ücreti (${tatilGunSayisi} Gün)`,
        value: `${calculation.brutTatilUcreti.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        hint: "UBGT 1 tam yevmiye ilave",
      },
      {
        label: "Toplam Gelir Vergisi Kesintisi (%15)",
        value: `-${(calculation.mesaiGelirVergisi + calculation.tatilGelirVergisi).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isDeduction: true,
      },
      {
        label: "Toplam Damga Vergisi Kesintisi (‰7,59)",
        value: `-${(calculation.mesaiDamgaVergisi + calculation.tatilDamgaVergisi).toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isDeduction: true,
      },
      {
        label: "Net Fazla Mesai + Tatil Alacağı",
        value: `${calculation.toplamNet.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation, tatilGunSayisi]);

  const summaryText = `Brüt: ${calculation.brut} TL | Saatlik Zamlı Mesai: ${calculation.saatlikFazlaMesai.toFixed(2)} TL | Net Mesai: ${calculation.netFazlaMesai.toFixed(2)} TL | Net Tatil: ${calculation.netTatilUcreti.toFixed(2)} TL | Toplam Net Alacak: ${calculation.toplamNet.toFixed(2)} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <span>4857 Sayılı İş Kanunu Madde 41 ve 47</span>
          <span className="text-slate-300">·</span>
          <span>Haftalık 45 Saati Aşan Çalışmalar</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Fazla Mesai ve Tatil Ücreti Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Aylık brüt maaş üzerinden 1 saatlik fazla mesai (%50 zamlı) ve UBGT resmi tatil çalışmalarının net yasal karşılığını hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Scale className="w-4 h-4 text-blue-600" />
              Mesai ve Tatil Parametreleri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              4857 SK md. 41
            </span>
          </div>

          {/* Aylık Brüt Maaş */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Aylık Brüt Temel Maaş (TL) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Normal saat ücreti = Brüt / 225</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="500"
                value={brutMaas || ""}
                onChange={(e) => setBrutMaas(Number(e.target.value))}
                placeholder="Örn: 35000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL
              </span>
            </div>
          </div>

          {/* Haftalık Fazla Mesai Saati */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Haftalık Ortalama Fazla Mesai (Saat)
              </label>
              <span className="text-[10px] text-blue-600 font-semibold">%50 Zamlı Ücret</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="60"
                step="1"
                value={haftalikMesaiSaati || ""}
                onChange={(e) => setHaftalikMesaiSaati(Number(e.target.value))}
                placeholder="Örn: 6"
                className="w-full h-11 pl-3.5 pr-16 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                Saat/Hafta
              </span>
            </div>
            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[2, 4, 6, 8, 12].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setHaftalikMesaiSaati(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    haftalikMesaiSaati === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val} Saat
                </button>
              ))}
            </div>
          </div>

          {/* Çalışılan Resmi Tatil / UBGT Gün Sayısı */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Çalışılan Resmi ve Dini Tatil Gün Sayısı (UBGT)
              </label>
              <span className="text-[10px] text-slate-400">1 tam ilave yevmiye</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                max="30"
                step="1"
                value={tatilGunSayisi || ""}
                onChange={(e) => setTatilGunSayisi(Number(e.target.value))}
                placeholder="Örn: 2"
                className="w-full h-11 pl-3.5 pr-16 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                Gün
              </span>
            </div>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="Mesai ve Tatil Alacağı Fişi"
            badge="4857 İş Kanunu"
            primaryMetric={{
              label: "Net Ele Geçecek Fazla Çalışma Alacağı",
              amount: calculation.toplamNet.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              currency: "TL",
              subtext: `Net Mesai: ${calculation.netFazlaMesai.toFixed(2)} TL + Net Tatil: ${calculation.netTatilUcreti.toFixed(2)} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Fazla mesai ücretinden %15 gelir vergisi ve ‰7,59 damga vergisi yasal olarak kesilir."
          />

          <ConsultationForm
            toolName="Fazla Mesai ve Ücret Alacakları"
            calculationSummary={summaryText}
            title="Ödenmeyen Mesailer İçin Arabuluculuk Desteği"
            description="İşverenin fazla mesai veya resmi tatil ücretlerini bordroda göstermemesi veya eksik ödemesi durumunda arabulucu ve iş hukuku avukatlarımızdan destek alın."
            legalReference="İş Kanunu & Ücret Alacakları"
          />
        </div>
      </div>
    </div>
  );
}
