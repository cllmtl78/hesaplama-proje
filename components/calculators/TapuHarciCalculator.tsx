"use client";

import { useState, useMemo } from "react";
import { Home } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

const SABIT_DONER_SERMAYE_2026 = 2500; // 2026 Döner Sermaye ve Hizmet Bedeli

export default function TapuHarciCalculator() {
  const [satisBedeli, setSatisBedeli] = useState<number>(3500000);
  const [odemeDagitimi, setOdemeDagitimi] = useState<"standart" | "alici">("standart");

  const calculation = useMemo(() => {
    const bedel = satisBedeli || 0;

    let aliciHarci = 0;
    let saticiHarci = 0;

    if (odemeDagitimi === "standart") {
      aliciHarci = bedel * 0.02; // %2
      saticiHarci = bedel * 0.02; // %2
    } else {
      aliciHarci = bedel * 0.04; // %4
      saticiHarci = 0;
    }

    const donerSermaye = SABIT_DONER_SERMAYE_2026;
    const aliciToplamOdeyecek = aliciHarci + donerSermaye;
    const saticiToplamOdeyecek = saticiHarci;
    const toplamTapuMasrafi = aliciHarci + saticiHarci + donerSermaye;

    return {
      bedel,
      aliciHarci,
      saticiHarci,
      donerSermaye,
      aliciToplamOdeyecek,
      saticiToplamOdeyecek,
      toplamTapuMasrafi,
    };
  }, [satisBedeli, odemeDagitimi]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Beyan Edilen Gayrimenkul Satış Bedeli",
        value: `${calculation.bedel.toLocaleString("tr-TR")} TL`,
      },
      {
        label: odemeDagitimi === "standart" ? "Alıcı Tapu Harcı Payı (%2)" : "Alıcı Tapu Harcı (%4 - Tümü)",
        value: `${calculation.aliciHarci.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      },
      {
        label: odemeDagitimi === "standart" ? "Satıcı Tapu Harcı Payı (%2)" : "Satıcı Harcı (Anlaşmalı 0 TL)",
        value: `${calculation.saticiHarci.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      },
      {
        label: "Döner Sermaye ve Hizmet Bedeli (2026)",
        value: `${calculation.donerSermaye.toLocaleString("tr-TR")} TL`,
        hint: "Tapu dairesine yatırılan maktu ücret",
      },
      {
        label: "Alıcının Toplam Ödeyeceği Tutar",
        value: `${calculation.aliciToplamOdeyecek.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation, odemeDagitimi]);

  const summaryText = `Satış Bedeli: ${calculation.bedel.toLocaleString("tr-TR")} TL | Dağılım: ${odemeDagitimi === "standart" ? "Yasal (%2 + %2)" : "Tümü Alıcı (%4)"} | Alıcı: ${calculation.aliciHarci.toLocaleString("tr-TR")} TL | Satıcı: ${calculation.saticiHarci.toLocaleString("tr-TR")} TL | Toplam Masraf: ${calculation.toplamTapuMasrafi.toLocaleString("tr-TR")} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-rose-600 mb-1">
          <span>492 Sayılı Harçlar Kanunu (4 Sayılı Tarife)</span>
          <span className="text-slate-300">·</span>
          <span>2026/Q1 Yasal Harç Oranları</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Tapu Harcı ve Döner Sermaye Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Gayrimenkul alım-satımında beyan edilen satış bedeli üzerinden alıcı ve satıcı için yasal tapu harcını ve 2026 döner sermaye bedelini hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Home className="w-4 h-4 text-rose-600" />
              Gayrimenkul Satış ve Harç Bilgileri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              492 Sayılı Kanun
            </span>
          </div>

          {/* Satış Bedeli */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Gayrimenkul Satış Bedeli (TL) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Belediye rayiç bedelinden az olamaz</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="50000"
                value={satisBedeli || ""}
                onChange={(e) => setSatisBedeli(Number(e.target.value))}
                placeholder="Örn: 3500000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[1500000, 2500000, 4000000, 6000000, 10000000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setSatisBedeli(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    satisBedeli === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {(val / 1000000).toFixed(1)} Milyon TL
                </button>
              ))}
            </div>
          </div>

          {/* Ödeme Dağılımı Seçimi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Harç Ödeme Dağılımı (Taraflar Arası Anlaşma)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setOdemeDagitimi("standart")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  odemeDagitimi === "standart"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold">Yasal Standart (%2 + %2)</div>
                <div className={`text-[11px] mt-0.5 ${odemeDagitimi === "standart" ? "text-slate-300" : "text-slate-400"}`}>
                  Alıcı %2, Satıcı %2 eşit öder
                </div>
              </button>

              <button
                type="button"
                onClick={() => setOdemeDagitimi("alici")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  odemeDagitimi === "alici"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold">Tümü Alıcı (%4)</div>
                <div className={`text-[11px] mt-0.5 ${odemeDagitimi === "alici" ? "text-slate-300" : "text-slate-400"}`}>
                  Piyasa teamülü, tüm masraf alıcıda
                </div>
              </button>
            </div>
          </div>

          {/* Bilgilendirme Kutusu */}
          <div className="p-3.5 bg-rose-50/60 rounded-xl border border-rose-200/60 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-rose-900">
              Belediye Rayiç Bedeli Uyarısı:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Tapu devrinde gösterilen satış bedeli, ilgili belediyeden alınan emlak vergisi değerinden (rayiç bedel) düşük olamaz. Gerçek bedelin altında beyan yapılması durumunda Gelir İdaresi Başkanlığı cezalı tarhiyat uygulayabilir.
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="Tapu Masrafları Fişi"
            badge="492 Sayılı Harçlar"
            primaryMetric={{
              label: "Toplam Tapu Masrafı (Harç + Döner Sermaye)",
              amount: calculation.toplamTapuMasrafi.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              currency: "TL",
              subtext: `Alıcı Payı: ${calculation.aliciToplamOdeyecek.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL | Satıcı Payı: ${calculation.saticiToplamOdeyecek.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Döner sermaye bedeli her tapu müdürlüğünde yöresel katsayılara göre cüzi farklılık gösterebilir."
          />

          <ConsultationForm
            toolName="Tapu ve Gayrimenkul Hukuku"
            calculationSummary={summaryText}
            title="Gayrimenkul Alım-Satım Hukuki Danışmanlığı"
            description="Tapu devri, ipotek tesisi, gayrimenkul değerleme tespiti ve sözleşme denetimi süreçlerinde uzman avukatlarımızdan destek alın."
            legalReference="Gayrimenkul Hukuku"
          />
        </div>
      </div>
    </div>
  );
}
