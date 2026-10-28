"use client";

import { useState, useMemo } from "react";
import { Globe, AlertCircle } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

const SABIT_GUMRUK_SUNUM = 45; // Gümrük Sunum Ücreti (TL)
const SABIT_DAMGA_PULU = 15; // Damga Vergisi Pulu (TL)

export default function GumrukVergisiCalculator() {
  const [urunFiyati, setUrunFiyati] = useState<number>(1500);
  const [ulkeGrubu, setUlkeGrubu] = useState<"ab" | "diger">("diger");
  const [otvVar, setOtvVar] = useState<boolean>(false);

  const calculation = useMemo(() => {
    const fiyat = urunFiyati || 0;

    const gumrukOrani = ulkeGrubu === "ab" ? 0.30 : 0.60;
    const gumrukVergisi = fiyat * gumrukOrani;
    const otvOrani = otvVar ? 0.20 : 0;
    const otvTutari = otvVar ? (fiyat + gumrukVergisi) * otvOrani : 0;
    const sabitMasraflar = SABIT_GUMRUK_SUNUM + SABIT_DAMGA_PULU;
    const kapidaOdenecekVergi = gumrukVergisi + otvTutari + sabitMasraflar;
    const toplamMaliyet = fiyat + kapidaOdenecekVergi;

    return {
      fiyat,
      gumrukOrani: gumrukOrani * 100,
      gumrukVergisi,
      otvVar,
      otvTutari,
      sabitMasraflar,
      kapidaOdenecekVergi,
      toplamMaliyet,
    };
  }, [urunFiyati, ulkeGrubu, otvVar]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Sipariş / Ürün Tutarı",
        value: `${calculation.fiyat.toLocaleString("tr-TR")} TL`,
      },
      {
        label: `Gümrük Vergisi (${ulkeGrubu === "ab" ? "AB %30" : "Diğer Ülke %60"})`,
        value: `+${calculation.gumrukVergisi.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
      },
      {
        label: "ÖTV Farkı (IV Sayılı Liste %20)",
        value: otvVar ? `+${calculation.otvTutari.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL` : "0,00 TL (Kapsam dışı)",
      },
      {
        label: "Gümrük Sunum Ücreti",
        value: `${SABIT_GUMRUK_SUNUM} TL`,
      },
      {
        label: "Damga Pulu",
        value: `${SABIT_DAMGA_PULU} TL`,
      },
      {
        label: "Kapıda/PTT'ye Ödenecek Toplam Vergi",
        value: `${calculation.kapidaOdenecekVergi.toLocaleString("tr-TR", { minimumFractionDigits: 2, maximumFractionDigits: 2 })} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation, ulkeGrubu, otvVar]);

  const summaryText = `Ürün: ${calculation.fiyat} TL | Menşei: ${ulkeGrubu === "ab" ? "AB %30" : "Diğer %60"} | ÖTV: ${otvVar ? "Var (%20)" : "Yok"} | Kapıda Ödenecek Vergi: ${calculation.kapidaOdenecekVergi.toFixed(2)} TL | Toplam Maliyet: ${calculation.toplamMaliyet.toFixed(2)} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-amber-600 mb-1">
          <span>4458 Sayılı Gümrük Kanunu & Posta/Hızlı Kargo Kararnamesi</span>
          <span className="text-slate-300">·</span>
          <span>30 Euro Bireysel Muafiyet Sınırı</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Yurt Dışı & Gümrük Vergisi Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Temu, Amazon, AliExpress siparişleriniz için 30€ sınır kontrolü, AB %30 ve diğer ülkeler için %60 gümrük vergisi, ÖTV ve maktu gümrük sunum ücretlerini hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Globe className="w-4 h-4 text-amber-600" />
              Sipariş ve Menşei Parametreleri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              4458 SK
            </span>
          </div>

          {/* Ürün Fiyatı */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Sipariş / Ürün Tutarı (TL Karşılığı) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Kargo hariç ürün bedeli</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="100"
                value={urunFiyati || ""}
                onChange={(e) => setUrunFiyati(Number(e.target.value))}
                placeholder="Örn: 1500"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-amber-500 focus:ring-2 focus:ring-amber-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[500, 1000, 1500, 2000, 3000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setUrunFiyati(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    urunFiyati === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val.toLocaleString("tr-TR")} TL
                </button>
              ))}
            </div>
          </div>

          {/* Gönderici Ülke Menşei */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Gönderici Ülke Grubu
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setUlkeGrubu("ab")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  ulkeGrubu === "ab"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold">Avrupa Birliği (%30 Vergi)</div>
                <div className={`text-[11px] mt-0.5 ${ulkeGrubu === "ab" ? "text-slate-300" : "text-slate-400"}`}>
                  Doğrudan AB üyesi ülkelerden gelen kargolar
                </div>
              </button>

              <button
                type="button"
                onClick={() => setUlkeGrubu("diger")}
                className={`p-3 rounded-xl border text-left transition-all ${
                  ulkeGrubu === "diger"
                    ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                    : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                }`}
              >
                <div className="text-xs font-bold">Diğer Ülkeler (%60 Vergi)</div>
                <div className={`text-[11px] mt-0.5 ${ulkeGrubu === "diger" ? "text-slate-300" : "text-slate-400"}`}>
                  Çin (Temu, AliExpress), ABD, İngiltere vb.
                </div>
              </button>
            </div>
          </div>

          {/* ÖTV Durumu */}
          <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between gap-3">
            <div>
              <div className="text-xs font-bold text-slate-900">
                Ürün ÖTV (IV Sayılı Liste) Kapsamında mı?
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Bluetooth kulaklık, hoparlör, konsol, parfüm vb. ürünlerde ilave %20 ÖTV tahsil edilir.
              </p>
            </div>
            <button
              type="button"
              onClick={() => setOtvVar(!otvVar)}
              className={`w-12 h-6 rounded-full transition-colors relative shrink-0 ${
                otvVar ? "bg-amber-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`block w-4 h-4 rounded-full bg-white transition-transform ${
                  otvVar ? "translate-x-7" : "translate-x-1"
                }`}
              />
            </button>
          </div>

          {/* 30 Euro Sınır Uyarısı */}
          <div className="p-3.5 bg-amber-50/60 rounded-xl border border-amber-200/60 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-amber-900 flex items-center gap-1.5">
              <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
              30 Euro Bireysel Alışveriş Tavanı:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Kargo hariç bedeli 30 Euro&apos;yu aşan siparişler bireysel basitleştirilmiş gümrükleme kapsamından çıkarak ticari ithalat rejimine tabi tutulur ve gümrük müşaviri gerektirir.
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="Gümrük ve Teslimat Fişi"
            badge="4458 Gümrük K."
            primaryMetric={{
              label: "Toplam Sipariş Maliyeti",
              amount: calculation.toplamMaliyet.toLocaleString("tr-TR", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }),
              currency: "TL",
              subtext: `Ürün: ${calculation.fiyat} TL + Gümrük/ÖTV: ${calculation.kapidaOdenecekVergi.toFixed(2)} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Maktu gümrük sunum ücreti (45 TL) ve damga vergisi (15 TL) PTT / kargo firması tarafından teslimatta tahsil edilir."
          />

          <ConsultationForm
            toolName="Gümrük ve E-İthalat Danışmanlığı"
            calculationSummary={summaryText}
            title="Gümrüğe Takılan Kargolar İçin Destek"
            description="30 Euro sınırını aşan, ticari numune sayılan veya gümrük antreposunda bekleyen gönderileriniz için gümrük müşavirliği desteği alın."
            legalReference="Gümrük Mevzuatı & İthalat"
          />
        </div>
      </div>
    </div>
  );
}
