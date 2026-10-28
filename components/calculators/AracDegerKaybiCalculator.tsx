"use client";

import { useState, useMemo } from "react";
import { Car, AlertCircle, Clock } from "lucide-react";
import ConsultationForm from "@/components/ConsultationForm";
import FintechReceiptCard, { ReceiptItem } from "@/components/calculators/FintechReceiptCard";

type HasarBoyutu = "hafif" | "orta" | "agir";

const HASAR_KATSAYILARI: Record<HasarBoyutu, { katsayi: number; label: string; desc: string }> = {
  hafif: {
    katsayi: 0.05,
    label: "Hafif Hasar (%5)",
    desc: "Plastik aksam, basit lokal boya, tampon değişimi veya far",
  },
  orta: {
    katsayi: 0.12,
    label: "Orta Hasar (%12)",
    desc: "Kaporta düzeltme, 1-2 parça sac değişimi (çamurluk, kapı), boya",
  },
  agir: {
    katsayi: 0.20,
    label: "Ağır Hasar (%20)",
    desc: "Şasi, podye, tavan, direk, hava yastığı açılması, motor havuzu",
  },
};

export default function AracDegerKaybiCalculator() {
  const [rayicDeger, setRayicDeger] = useState<number>(850000);
  const [kilometre, setKilometre] = useState<number>(45000);
  const [hasarBoyutu, setHasarBoyutu] = useState<HasarBoyutu>("orta");
  const [kusurOrani, setKusurOrani] = useState<number>(0); // 0, 25, 50, 75, 100

  const calculation = useMemo(() => {
    const rayic = rayicDeger || 0;
    const km = kilometre || 0;

    let kmKatsayisi = 0.40;
    if (km < 15000) {
      kmKatsayisi = 0.95;
    } else if (km <= 30000) {
      kmKatsayisi = 0.90;
    } else if (km <= 60000) {
      kmKatsayisi = 0.82;
    } else if (km <= 100000) {
      kmKatsayisi = 0.72;
    } else if (km <= 150000) {
      kmKatsayisi = 0.58;
    } else {
      kmKatsayisi = 0.40;
    }

    const hasarKatsayisi = HASAR_KATSAYILARI[hasarBoyutu].katsayi;
    const karsiKusurOrani = Math.max(0, 100 - kusurOrani);
    const karsiKusurCarpani = karsiKusurOrani / 100;
    const bazDegerKaybi = rayic * hasarKatsayisi * kmKatsayisi;
    const talepEdilebilirTutar = Math.round(bazDegerKaybi * karsiKusurCarpani);

    return {
      rayic,
      km,
      kmKatsayisi,
      hasarKatsayisi,
      kusurOrani,
      karsiKusurOrani,
      karsiKusurCarpani,
      bazDegerKaybi,
      talepEdilebilirTutar,
    };
  }, [rayicDeger, kilometre, hasarBoyutu, kusurOrani]);

  const receiptItems: ReceiptItem[] = useMemo(() => {
    return [
      {
        label: "Aracın Kaza Anındaki Piyasa Rayiç Değeri",
        value: `${calculation.rayic.toLocaleString("tr-TR")} TL`,
      },
      {
        label: "Hasar Niteliği ve Katsayısı",
        value: HASAR_KATSAYILARI[hasarBoyutu].label,
      },
      {
        label: `Kilometre Çarpanı (${calculation.km.toLocaleString("tr-TR")} km)`,
        value: `${calculation.kmKatsayisi.toFixed(2)}`,
        hint: "Yargıtay kilometre aşınma endeksi",
      },
      {
        label: "Kusursuz Baz Değer Kaybı",
        value: `${Math.round(calculation.bazDegerKaybi).toLocaleString("tr-TR")} TL`,
      },
      {
        label: "Kusur Oranı Dağılımı",
        value: `Siz %${kusurOrani} / Karşı Taraf %${calculation.karsiKusurOrani}`,
        hint: kusurOrani === 100 ? "Tam kusurlu olunduğunda tazminat doğmaz" : "Karşı sigortadan kusur oranında tahsil edilir",
      },
      {
        label: "Karşı Sigortadan Talep Edilebilir Net Tutar",
        value: `${calculation.talepEdilebilirTutar.toLocaleString("tr-TR")} TL`,
        isHighlight: true,
      },
    ];
  }, [calculation, hasarBoyutu, kusurOrani]);

  const summaryText = `Rayiç Değer: ${calculation.rayic.toLocaleString("tr-TR")} TL | Km: ${calculation.km.toLocaleString("tr-TR")} | Hasar: ${HASAR_KATSAYILARI[hasarBoyutu].label} | Kusur: %${kusurOrani} (Karşı Kusur: %${calculation.karsiKusurOrani}) | Talep Edilebilir Tutar: ${calculation.talepEdilebilirTutar.toLocaleString("tr-TR")} TL`;

  return (
    <div className="space-y-6">
      {/* Title Header */}
      <div className="border-b border-slate-200/80 pb-4">
        <div className="flex items-center gap-2 text-xs font-semibold text-indigo-600 mb-1">
          <span>Karayolları ZMMS Genel Şartları & Yargıtay Esasları</span>
          <span className="text-slate-300">·</span>
          <span>Sigorta Tahkim Komisyonu Aktüerya Metodu</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900">
          Araç Değer Kaybı Hesaplama
        </h1>
        <p className="text-xs sm:text-sm text-slate-600 mt-1 max-w-2xl leading-relaxed">
          Trafik kazası sonrası aracınızda oluşan piyasa değer kaybını Yargıtay içtihatları, kilometre çarpanı ve kusur oranına göre aktüeryal olarak hesaplayın.
        </p>
      </div>

      {/* 2-Column Desktop (60% Form / 40% Sticky Receipt) & Mobile 1-Column */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Form (60%) */}
        <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-200/90 p-4 sm:p-6 shadow-xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <span className="text-xs font-bold text-slate-900 flex items-center gap-2 uppercase tracking-wide">
              <Car className="w-4 h-4 text-indigo-600" />
              Araç ve Kaza Parametreleri
            </span>
            <span className="text-[11px] font-mono text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
              ZMMS Esasları
            </span>
          </div>

          {/* Piyasa Rayiç Değeri */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Kaza Anındaki Aracın Piyasa Rayiç Değeri (TL) <span className="text-red-500">*</span>
              </label>
              <span className="text-[10px] text-slate-400">Emsal satış ortalaması</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="50000"
                step="25000"
                value={rayicDeger || ""}
                onChange={(e) => setRayicDeger(Number(e.target.value))}
                placeholder="Örn: 850000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                TL
              </span>
            </div>
          </div>

          {/* Kilometre */}
          <div>
            <div className="flex items-center justify-between mb-1">
              <label className="text-[11px] font-semibold text-slate-700">
                Aracın Kaza Anındaki Kilometresi
              </label>
              <span className="text-[10px] text-slate-400">Yargıtay katsayı aralığı</span>
            </div>
            <div className="relative">
              <input
                type="number"
                min="0"
                step="5000"
                value={kilometre || ""}
                onChange={(e) => setKilometre(Number(e.target.value))}
                placeholder="Örn: 45000"
                className="w-full h-11 pl-3.5 pr-12 bg-white border border-slate-300 rounded-xl text-base sm:text-xs font-mono tabular-nums text-slate-900 placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/10 transition-colors outline-hidden"
              />
              <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-medium text-slate-400 font-mono pointer-events-none">
                KM
              </span>
            </div>

            {/* Hızlı Seçim Buton Hapları */}
            <div className="flex flex-wrap gap-1.5 mt-2">
              {[15000, 30000, 60000, 90000, 120000].map((val) => (
                <button
                  key={val}
                  type="button"
                  onClick={() => setKilometre(val)}
                  className={`px-2.5 py-1 text-[11px] font-mono rounded-lg border transition-all ${
                    kilometre === val
                      ? "bg-slate-900 text-white border-slate-900 font-semibold"
                      : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {val.toLocaleString("tr-TR")} km
                </button>
              ))}
            </div>
          </div>

          {/* Hasar Boyutu Seçimi */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Hasar Boyutu ve Niteliği
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
              {(Object.keys(HASAR_KATSAYILARI) as HasarBoyutu[]).map((key) => {
                const item = HASAR_KATSAYILARI[key];
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setHasarBoyutu(key)}
                    className={`p-3 rounded-xl border text-left transition-all ${
                      hasarBoyutu === key
                        ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <div className="text-xs font-bold">{item.label}</div>
                    <div className={`text-[10px] mt-0.5 leading-snug line-clamp-2 ${hasarBoyutu === key ? "text-slate-300" : "text-slate-400"}`}>
                      {item.desc}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Kusur Oranı */}
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1.5">
              Kazadaki Kusur Oranınız (Kaza Tutanağına Göre)
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-1.5">
              {[
                { val: 0, label: "%0 (Kusursuz)" },
                { val: 25, label: "%25" },
                { val: 50, label: "%50" },
                { val: 75, label: "%75" },
                { val: 100, label: "%100" },
              ].map((tier) => (
                <button
                  key={tier.val}
                  type="button"
                  onClick={() => setKusurOrani(tier.val)}
                  className={`h-10 text-xs font-semibold rounded-xl border transition-all text-center ${
                    kusurOrani === tier.val
                      ? "bg-slate-900 text-white border-slate-900 shadow-xs"
                      : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"
                  }`}
                >
                  {tier.label}
                </button>
              ))}
            </div>
          </div>

          {/* Zamanaşımı Uyarısı */}
          <div className="p-3.5 bg-indigo-50/60 rounded-xl border border-indigo-200/60 text-xs text-slate-700 space-y-1">
            <div className="font-semibold text-indigo-900 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-indigo-600" />
              2 Yıllık Yasal Zamanaşımı Süresi:
            </div>
            <p className="text-[11px] text-slate-600 leading-relaxed">
              Trafik kazası tarihinden itibaren 2 yıl içinde karşı aracın sigorta şirketine başvuru yapılmalıdır. Sigorta şirketlerinin eksik veya ret cevaplarına karşı Sigorta Tahkim Komisyonu nezdinde dava açılabilmektedir.
            </p>
          </div>
        </div>

        {/* Right Column: Sticky Receipt Card & Consultation (40%) */}
        <div className="lg:col-span-5 lg:sticky lg:top-20 space-y-4">
          <FintechReceiptCard
            title="Değer Kaybı Hesaplama Fişi"
            badge="Sigorta Tahkim"
            primaryMetric={{
              label: "Sigortadan Talep Edilebilir Değer Kaybı",
              amount: calculation.talepEdilebilirTutar.toLocaleString("tr-TR"),
              currency: "TL",
              subtext: `Karşı Kusur Oranı: %${calculation.karsiKusurOrani} | Baz Kayıp: ${Math.round(calculation.bazDegerKaybi).toLocaleString("tr-TR")} TL`,
            }}
            items={receiptItems}
            copyText={summaryText}
            legalNote="Emsal parçaların kaza öncesinde hasarsız ve boyasız olması gerekmektedir."
          />

          <ConsultationForm
            toolName="Araç Değer Kaybı ve Sigorta Tahkim"
            calculationSummary={summaryText}
            title="Sigorta Şirketinden Değer Kaybı Tahsili"
            description="Sigorta şirketleri genellikle değer kaybını eksik öder veya reddeder. Sigorta Tahkim Komisyonu üzerinden uzman aktüer ve avukat ile tam tazminat almak için form bırakın."
            legalReference="Sigorta Hukuku & Tahkim"
          />
        </div>
      </div>
    </div>
  );
}
