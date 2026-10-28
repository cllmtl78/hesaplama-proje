"use client";

import { useState, useMemo } from "react";
import { TrendingUp, Check } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

const VERGI_DILIMLERI = [
  { limit: 158000, rate: 0.15, label: "0 - 158.000 TL: %15" },
  { limit: 380000, rate: 0.20, label: "158.000 - 380.000 TL: %20" },
  { limit: 1400000, rate: 0.27, label: "380.000 - 1.400.000 TL: %27" },
  { limit: 4300000, rate: 0.35, label: "1.400.000 - 4.300.000 TL: %35" },
  { limit: Infinity, rate: 0.40, label: "4.300.000 TL üzeri: %40" },
];

const GENC_GIRISIMCI_ISTISNASI = 230000;
const STANDART_AYLIK_BAGKUR = 6900;

export default function FreelancerTaxCalculator() {
  const [aylikCiro, setAylikCiro] = useState<number>(85000);
  const [aylikGider, setAylikGider] = useState<number>(15000);
  const [bagkurOdeniyor, setBagkurOdeniyor] = useState<boolean>(true);
  const [gencGirisimci, setGencGirisimci] = useState<boolean>(true);

  const calculation = useMemo(() => {
    const ciro = aylikCiro || 0;
    const gider = aylikGider || 0;

    const yillikBrutKazanc = Math.max(0, (ciro - gider) * 12);
    const istisnaTutari = gencGirisimci ? Math.min(yillikBrutKazanc, GENC_GIRISIMCI_ISTISNASI) : 0;
    const vergiMatrahi = Math.max(0, yillikBrutKazanc - istisnaTutari);

    let kalanMatrah = vergiMatrahi;
    let yillikVergi = 0;
    let oncekiLimit = 0;

    for (const dilim of VERGI_DILIMLERI) {
      if (kalanMatrah <= 0) break;
      const dilimAraligi = dilim.limit - oncekiLimit;
      const vergilendirilecekParca = Math.min(kalanMatrah, dilimAraligi);
      yillikVergi += vergilendirilecekParca * dilim.rate;
      kalanMatrah -= vergilendirilecekParca;
      oncekiLimit = dilim.limit;
    }

    const yillikBagkur = bagkurOdeniyor ? (gencGirisimci ? 0 : STANDART_AYLIK_BAGKUR * 12) : 0;
    const yillikNetKazanc = yillikBrutKazanc - yillikVergi - yillikBagkur;
    const aylikNetKazanc = yillikNetKazanc / 12;
    const efektifVergiOrani = yillikBrutKazanc > 0 ? (yillikVergi / yillikBrutKazanc) * 100 : 0;

    return {
      ciro,
      gider,
      yillikBrutKazanc,
      istisnaTutari,
      vergiMatrahi,
      yillikVergi,
      yillikBagkur,
      yillikNetKazanc,
      aylikNetKazanc,
      efektifVergiOrani,
    };
  }, [aylikCiro, aylikGider, bagkurOdeniyor, gencGirisimci]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Yıllık Brüt Kâr (Gelir - Gider)",
        value: `${calculation.yillikBrutKazanc.toLocaleString("tr-TR")} TL`,
      },
      {
        label: "Genç Girişimci Kazanç İstisnası",
        value: gencGirisimci ? `-${calculation.istisnaTutari.toLocaleString("tr-TR")} TL` : "Uygulanmadı",
        isDeduction: gencGirisimci,
        hint: gencGirisimci ? "230.000 TL vergiden muaf" : undefined,
      },
      {
        label: "Vergiye Tabi Matrah",
        value: `${calculation.vergiMatrahi.toLocaleString("tr-TR")} TL`,
        hint: "Dilimlere tabi kümülatif tutar",
      },
      {
        label: "Yıllık Gelir Vergisi Yükü",
        value: `-${Math.round(calculation.yillikVergi).toLocaleString("tr-TR")} TL`,
        isDeduction: true,
        hint: `Efektif oran: %${calculation.efektifVergiOrani.toFixed(1)}`,
      },
      {
        label: "Yıllık Bağ-Kur Primi",
        value: calculation.yillikBagkur > 0 ? `-${calculation.yillikBagkur.toLocaleString("tr-TR")} TL` : "0 TL (Genç Girişimci Teşviki)",
        isDeduction: calculation.yillikBagkur > 0,
      },
      {
        label: "Yıllık Net Ele Geçecek Kazanç",
        value: `${Math.round(calculation.yillikNetKazanc).toLocaleString("tr-TR")} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation, gencGirisimci]);

  const summaryText = `Aylık Ciro: ${aylikCiro} TL | Aylık Gider: ${aylikGider} TL | Genç Girişimci: ${gencGirisimci ? "Evet" : "Hayır"} | Yıllık Vergi: ${Math.round(calculation.yillikVergi)} TL | Aylık Net Kazanç: ${Math.round(calculation.aylikNetKazanc)} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>193 Sayılı Gelir Vergisi Kanunu</span>
          <span className="text-slate-300">·</span>
          <span>Genç Girişimci Kazanç İstisnası: 230.000 TL</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Şahıs Şirketi & Gelir Vergisi Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Aylık ciro ve giderlerinizi girerek 2026 yılı 5 kademeli artan oranlı gelir vergisi dilimlerini, Bağkur primini ve cebinize kalacak aylık net kazancı hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <TrendingUp className="w-4 h-4 text-indigo-600" />
              Gelir, Gider ve Teşvik Parametreleri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              193 GVK 2026
            </span>
          </div>

          {/* Aylık Ortalama Ciro */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Aylık Ortalama Ciro (KDV Hariç) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Faturalandırılan gelir</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="5000"
                value={aylikCiro || ""}
                onChange={(e) => setAylikCiro(Number(e.target.value))}
                placeholder="Örn: 85000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL/Ay
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[40000, 75000, 100000, 150000, 250000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setAylikCiro(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    aylikCiro === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val.toLocaleString("tr-TR")} TL
                </button>
              ))}
            </div>
          </div>

          {/* Aylık İşletme Gideri */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Aylık İşletme Giderleri (Kira, Muhasebe, Yazılım vb.)
              </label>
              <span className="text-[10px] text-slate-400">Vergiden düşülen giderler</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="2500"
                value={aylikGider || ""}
                onChange={(e) => setAylikGider(Number(e.target.value))}
                placeholder="Örn: 15000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL/Ay
              </span>
            </div>
          </div>

          {/* Genç Girişimci Teşviki Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Genç Girişimci Kazanç İstisnasından Yararlanıyor musunuz?
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">
                29 yaşını doldurmamış ve ilk defa şahıs şirketi kuranlara 3 vergilendirme dönemi boyunca 230.000 TL yıllık gelir vergisi muafiyeti ve 1 yıl ücretsiz Bağkur prim teşviki sağlanır.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setGencGirisimci(!gencGirisimci)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                gencGirisimci ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  gencGirisimci ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* Bağkur Durumu Toggle */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Bağ-Kur Primi Hesaba Dahil Edilsin mi?
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Başka bir şirkette 4A SSK&apos;lı çalışanlar şahıs şirketi açtığında Bağ-Kur primi ödemez.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setBagkurOdeniyor(!bagkurOdeniyor)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                bagkurOdeniyor ? "bg-indigo-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  bagkurOdeniyor ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="Vergi ve Nakit Akışı Özeti"
            badge="193 GVK"
            primaryMetric={{
              label: "Aylık Ortalama Net Kazancınız",
              amount: Math.round(calculation.aylikNetKazanc).toLocaleString("tr-TR"),
              currency: "TL/Ay",
              subtext: `Yıllık Cebinize Kalan: ${Math.round(calculation.yillikNetKazanc).toLocaleString("tr-TR")} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Gelir vergisi artan oranlı dilimlere (%15, %20, %27, %35, %40) göre hesaplanmıştır."
          />

          <ConsultationForm
            toolName="Şahıs Şirketi ve Vergi Optimizasyonu"
            calculationSummary={summaryText}
            title="Şirket Kuruluşu ve Mali Müşavirlik Desteği"
            description="Genç girişimci teşviki, şirket kuruluşu, e-fatura entegrasyonu ve aylık vergi beyannameleriniz için uzman mali müşavirlik desteği alın."
            legalReference="Mali Müşavirlik & Şirket Kuruluşu"
          />
        </div>
      </div>
    </div>
  );
}
