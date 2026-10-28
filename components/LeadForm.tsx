"use client";

import { useState } from "react";
import { CheckCircle2, ShieldCheck, Clock, X, Lock } from "lucide-react";

interface LeadFormProps {
  naceKodu: string;
  sektorTanimi: string;
}

export default function LeadForm({ naceKodu, sektorTanimi }: LeadFormProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    phone: "",
    city: "",
    note: "",
  });
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [legalModalType, setLegalModalType] = useState<"aydinlatma" | "acikriza" | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMessage("");

    try {
      const res = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formData,
          naceKodu,
          sektorTanimi,
        }),
      });

      if (!res.ok) {
        throw new Error("Bir sorun oluştu. Lütfen tekrar deneyiniz.");
      }

      setSubmitted(true);
    } catch (err: unknown) {
      const error = err as Error;
      setErrorMessage(error.message || "Talep iletilirken hata meydana geldi.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-8 text-center space-y-3 shadow-xs">
        <div className="w-12 h-12 rounded-full bg-emerald-50 text-emerald-600 ring-1 ring-emerald-500/20 flex items-center justify-center mx-auto">
          <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        </div>
        <h3 className="text-base font-bold text-slate-900">Talebiniz Alındı</h3>
        <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
          <strong>{naceKodu}</strong> ({sektorTanimi}) sektörü için 2026 KOSGEB hibe uygunluk analiz raporunuz hazırlanıyor. Uzmanlarımız en kısa sürede sizinle iletişime geçecektir.
        </p>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-center gap-3 text-[10px] text-slate-400">
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-slate-500" />
            KVKK Korumalı
          </span>
          <span>·</span>
          <span>Mesai Saatleri İçinde Dönüş</span>
        </div>
      </div>
    );
  }

  return (
    <>
      <form
        id="lead-form"
        onSubmit={handleSubmit}
        className="bg-white rounded-2xl border border-slate-200/90 p-5 sm:p-7 shadow-xs space-y-4"
      >
        <div className="border-b border-slate-100 pb-3.5">
          <div className="flex items-center justify-between gap-2 mb-1">
            <span className="text-[10px] font-bold uppercase tracking-wider text-blue-600 bg-blue-50/80 px-2 py-0.5 rounded-full border border-blue-200/50">
              KOSGEB & Hibe Danışmanlığı
            </span>
            <span className="text-[10px] text-slate-400 flex items-center gap-1 font-medium">
              <Clock className="w-3 h-3 text-slate-400" />
              24 Saat İçinde Dönüş
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
            Bu Sektör İçin Hibe Uygunluk Analizi Talep Et
          </h3>
          <p className="text-xs text-slate-600 mt-1 leading-relaxed">
            {sektorTanimi} ({naceKodu}) faaliyeti için alabileceğiniz maksimum hibe ve faizsiz kredi miktarını uzmanlarımız hesaplasın.
          </p>
        </div>

        {errorMessage && (
          <div className="p-2.5 text-xs bg-red-50 border border-red-200 text-red-700 rounded-xl">
            {errorMessage}
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Adınız Soyadınız <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.fullName}
              onChange={(e) =>
                setFormData({ ...formData, fullName: e.target.value })
              }
              placeholder="Örn: Ahmet Yılmaz"
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Telefon Numaranız <span className="text-red-500">*</span>
            </label>
            <input
              type="tel"
              required
              value={formData.phone}
              onChange={(e) =>
                setFormData({ ...formData, phone: e.target.value })
              }
              placeholder="05XX XXX XX XX"
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden font-mono"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Bulunduğunuz İl <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              required
              value={formData.city}
              onChange={(e) =>
                setFormData({ ...formData, city: e.target.value })
              }
              placeholder="Örn: İstanbul, Ankara, Bursa..."
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              Şirket Durumu
            </label>
            <select
              value={formData.note}
              onChange={(e) =>
                setFormData({ ...formData, note: e.target.value })
              }
              className="w-full h-11 px-3.5 bg-white border border-slate-300 rounded-xl text-base sm:text-xs text-slate-900 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10 transition-colors outline-hidden cursor-pointer"
            >
              <option value="">Seçiniz</option>
              <option value="Henüz şirket kurmadım (Yeni Girişim)">Henüz şirket kurmadım</option>
              <option value="Mevcut şirketim var (KOBİ Büyüme)">Mevcut şirketim var</option>
              <option value="Makine / Teçhizat yatırımı planlıyorum">Makine / Teçhizat yatırımı planlıyorum</option>
            </select>
          </div>
        </div>

        {/* Action Button & Checkbox-Free Legal Notice */}
        <div className="pt-2">
          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center gap-2 h-11 px-6 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-xs sm:text-sm tracking-wide shadow-sm transition-all active:scale-[0.99] disabled:opacity-50 cursor-pointer"
          >
            <span>{loading ? "Talebiniz İletiliyor..." : "Uzman Danışman Yönlendirmesi İste →"}</span>
          </button>

          <p className="text-[11px] text-slate-500 leading-relaxed text-center mt-2.5">
            Butona tıklayarak; iletişim ve talep verilerinizin dosyanızın incelenmesi amacıyla anlaşmalı uzmanlara (avukat, mali müşavir, KOSGEB danışmanı) aktarılmasına ilişkin{" "}
            <button
              type="button"
              onClick={() => setLegalModalType("aydinlatma")}
              className="text-slate-700 underline underline-offset-2 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Aydınlatma Metni
            </button>
            &apos;ni okuduğunuzu ve{" "}
            <button
              type="button"
              onClick={() => setLegalModalType("acikriza")}
              className="text-slate-700 underline underline-offset-2 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Açık Rıza
            </button>{" "}
            verdiğinizi kabul etmiş olursunuz.
          </p>
        </div>
      </form>

      {/* Legal Info Modal */}
      {legalModalType && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl max-w-lg w-full p-5 sm:p-6 shadow-2xl border border-slate-200 relative animate-in fade-in zoom-in-95 duration-150">
            <button
              type="button"
              onClick={() => setLegalModalType(null)}
              className="absolute top-4 right-4 p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
                <Lock className="w-4 h-4" />
              </div>
              <h4 className="text-base font-bold text-slate-900">
                {legalModalType === "aydinlatma"
                  ? "KVKK Aydınlatma Metni"
                  : "Açık Rıza ve Veri Aktarımı Beyanı"}
              </h4>
            </div>

            <div className="text-xs text-slate-600 space-y-2.5 max-h-[60vh] overflow-y-auto pr-1 leading-relaxed">
              {legalModalType === "aydinlatma" ? (
                <>
                  <p>
                    6698 sayılı Kişisel Verilerin Korunması Kanunu (&quot;KVKK&quot;) uyarınca; PratikHesap.co web portalı üzerinden ilettiğiniz ad-soyad, telefon numarası, il ve başvuru verileriniz, veri sorumlusu sıfatıyla tarafımızca işlenmektedir.
                  </p>
                  <p>
                    <strong>İşleme Amaçları:</strong> KOSGEB hibe uygunluk analizinin yapılması ve tarafınızla irtibata geçilmesidir.
                  </p>
                  <p>
                    <strong>Veri Aktarımı:</strong> Toplanan verileriniz, yalnızca talebinize konu olan KOSGEB hibe ve teşvik süreçlerinde yetkili anlaşmalı uzmanlara aktarılmaktadır.
                  </p>
                </>
              ) : (
                <>
                  <p>
                    PratikHesap.co üzerinde yer alan form aracılığıyla paylaştığım iletişim verilerimin; KOSGEB danışmanlık hizmeti sunulması amacıyla anlaşmalı uzmanlara aktarılmasına özgür irademle <strong>açık rıza veriyorum</strong>.
                  </p>
                </>
              )}
            </div>

            <div className="mt-5 pt-3 border-t border-slate-100 flex justify-end">
              <button
                type="button"
                onClick={() => setLegalModalType(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold hover:bg-slate-800 transition-colors"
              >
                Anladım ve Kapat
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
