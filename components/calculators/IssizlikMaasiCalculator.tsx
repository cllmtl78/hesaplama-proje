"use client";

import { useState, useMemo } from "react";
import { ShieldCheck, Clock } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";
import { hesaplaIssizlikMaasi, MEVZUAT_2026 } from "@/lib/mevzuatKurallari";

export default function IssizlikMaasiCalculator() {
  const [ortalamaBrut, setOrtalamaBrut] = useState<number>(35000);
  const [primGunKategorisi, setPrimGunKategorisi] = useState<"600" | "900" | "1080">("900");

  const calculation = useMemo(() => {
    return hesaplaIssizlikMaasi(ortalamaBrut, primGunKategorisi);
  }, [ortalamaBrut, primGunKategorisi]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Son 4 Aylık Ortalama Brüt Maaş",
        value: `${calculation.ortalamaBrut.toLocaleString("tr-TR")} TL`,
      },
      {
        label: "Hak Edilen Maaş Alma Süresi",
        value: `${calculation.hakEdilenAy} Ay Kesintisiz`,
        hint: calculation.primMetni,
      },
      {
        label: "Hesaplanan Ham Maaş (%40)",
        value: `${calculation.hamMaas.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      },
      {
        label: "Yasal Taban / Tavan Uygulaması",
        value: `${calculation.uygulananBrutMaas.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        hint: calculation.isCapped
          ? "Tavan sınırı uygulandı (Asgari Ücretin %80'i)"
          : calculation.isFloored
          ? "Taban sınırı uygulandı (Asgari Ücretin %40'ı)"
          : "Yasal sınırlar dahilinde",
      },
      {
        label: "Damga Vergisi Kesintisi (‰7,59)",
        value: `-${calculation.damgaVergisi.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isDeduction: true,
        hint: "Gelir ve SGK vergisi kesilmez",
      },
      {
        label: "Hak Edilen Toplam İşsizlik Ödeneği",
        value: `${calculation.toplamAlinacakMaas.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation]);

  const summaryText = `Ortalama Brüt: ${calculation.ortalamaBrut} TL | Hak Edilen Süre: ${calculation.hakEdilenAy} Ay | Aylık Net Maaş: ${calculation.netAylikMaas.toLocaleString("tr-TR")} TL | Toplam Ödenecek: ${calculation.toplamAlinacakMaas.toLocaleString("tr-TR")} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-blue-600 mb-1">
          <span>4447 Sayılı İşsizlik Sigortası Kanunu</span>
          <span className="text-slate-300">·</span>
          <span>İŞKUR 2026/Q1 Yasal Tavanı</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          İşsizlik Maaşı Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Son 4 aylık prime esas kazanç ortalamanız ve son 3 yıldaki prim ödeme gün sayınıza göre hak edilen süre, aylık net maaş ve toplam işsizlik ödeneğinizi hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Clock className="w-4 h-4 text-blue-600" />
              Sigorta ve Prim Bilgileri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              4447 Sayılı Kanun
            </span>
          </div>

          {/* Son 4 Aylık Ortalama Brüt Ücret */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Son 4 Aylık Brüt Maaş Ortalaması (TL) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">SGK Prime Esas Kazanç</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="500"
                value={ortalamaBrut || ""}
                onChange={(e) => setOrtalamaBrut(Number(e.target.value))}
                placeholder="Örn: 35000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[26005, 35000, 45000, 60000, 80000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setOrtalamaBrut(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    ortalamaBrut === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val.toLocaleString("tr-TR")} TL
                </button>
              ))}
            </div>
          </div>

          {/* Son 3 Yıldaki Prim Ödeme Gün Sayısı */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Son 3 Yıldaki Prim Gün Sayısı
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {[
                { key: "600", label: "600 - 899 Gün", duration: "6 Ay Maaş", desc: "Son 3 yılda en az 600 gün" },
                { key: "900", label: "900 - 1079 Gün", duration: "8 Ay Maaş", desc: "Son 3 yılda en az 900 gün" },
                { key: "1080", label: "1080+ Gün", duration: "10 Ay Maaş", desc: "Son 3 yılda 1080 gün ve üzeri" },
              ].map((tier) => (
                <button
                  key={tier.key}
                  type="button"
                  onClick={() => setPrimGunKategorisi(tier.key as "600" | "900" | "1080")}
                  className={`p-3 rounded-xl border text-left transition-all ${
                    primGunKategorisi === tier.key
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  <div className="text-xs font-bold">{tier.label}</div>
                  <div className={`text-[11px] font-semibold mt-0.5 ${primGunKategorisi === tier.key ? "text-blue-300" : "text-blue-600"}`}>
                    {tier.duration}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Bilgilendirme Kutusu */}
          <div className="p-3.5 bg-blue-50/60 rounded-xl border border-blue-200/60 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-blue-900 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-blue-600" />
              Yasal Başvuru Şartları (4447 SK):
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              İşsizlik maaşı alabilmek için işten ayrılmadan önceki son 120 gün kesintisiz hizmet akdi ve son 3 yılda en az 600 gün prim şarttır. İşten ayrılış tarihinden itibaren <strong>30 gün içinde İŞKUR&apos;a</strong> başvurulmalıdır.
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="İşsizlik Ödeneği Fişi"
            badge="İŞKUR Mevzuatı"
            primaryMetric={{
              label: "Aylık Net İşsizlik Maaşı",
              amount: calculation.netAylikMaas.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              currency: "TL/Ay",
              subtext: `${calculation.hakEdilenAy} Ay Boyunca Toplam: ${calculation.toplamAlinacakMaas.toLocaleString("tr-TR", { maximumFractionDigits: 2 })} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="İşsizlik maaşından yalnızca binde 7,59 damga vergisi kesilir; SGK ve gelir vergisi kesintisi yapılmaz."
          />

          <ConsultationForm
            toolName="İşsizlik Maaşı ve İşe İade"
            calculationSummary={summaryText}
            title="Haksız Fesih ve İşe İade Danışmanlığı"
            description="İşten çıkarılma kodunuzun işsizlik maaşına engel olması (Kod 29/46 vb.), kıdem tazminatı veya işe iade davası süreçleriniz için avukatlarımızdan ücretsiz ön inceleme alın."
            legalReference="İş Hukuku & Fesih İhtilafları"
          />
        </div>
      </div>
    </div>
  );
}
