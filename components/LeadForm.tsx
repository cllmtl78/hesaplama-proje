"use client";

import { useState } from "react";

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
    } catch (err: any) {
      setErrorMessage(err.message || "Talep iletilirken hata meydana geldi.");
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="bg-emerald-50 border border-emerald-200 rounded-2xl p-8 text-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-emerald-600 text-white flex items-center justify-center mx-auto text-xl font-bold">
          ✓
        </div>
        <h3 className="text-xl font-bold text-slate-900">Talebiniz Alındı!</h3>
        <p className="text-sm text-slate-600 max-w-md mx-auto">
          <strong>{naceKodu}</strong> ({sektorTanimi}) sektörü için 2026 KOSGEB hibe uygunluk analiz raporunuz hazırlanıyor. Uzmanlarımız en kısa sürede sizinle iletişime geçecektir.
        </p>
      </div>
    );
  }

  return (
    <form
      id="lead-form"
      onSubmit={handleSubmit}
      className="bg-white rounded-2xl border border-slate-200 p-6 sm:p-8 shadow-xl shadow-slate-200/50 space-y-4"
    >
      <div className="border-b border-slate-100 pb-4 mb-4">
        <span className="text-xs font-bold uppercase tracking-wider text-emerald-600">
          Ücretsiz Danışmanlık
        </span>
        <h3 className="text-xl font-black text-slate-900 mt-1">
          Bu Sektör İçin Hibe Uygunluk Analizi Talep Et
        </h3>
        <p className="text-xs text-slate-500 mt-1">
          {sektorTanimi} ({naceKodu}) faaliyeti için alabileceğiniz maksimum hibe ve faizsiz kredi miktarını uzmanlarımız hesaplasın.
        </p>
      </div>

      {errorMessage && (
        <div className="p-3 text-xs bg-red-50 border border-red-200 text-red-600 rounded-lg">
          {errorMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Adınız Soyadınız *
          </label>
          <input
            type="text"
            required
            value={formData.fullName}
            onChange={(e) =>
              setFormData({ ...formData, fullName: e.target.value })
            }
            placeholder="Örn: Ahmet Yılmaz"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Telefon Numaranız *
          </label>
          <input
            type="tel"
            required
            value={formData.phone}
            onChange={(e) =>
              setFormData({ ...formData, phone: e.target.value })
            }
            placeholder="05XX XXX XX XX"
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Bulunduğunuz İl *
          </label>
          <input
            type="text"
            required
            value={formData.city}
            onChange={(e) =>
              setFormData({ ...formData, city: e.target.value })
            }
            placeholder="Örn: İstanbul, Ankara, Bursa..."
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-700 mb-1">
            Şirket Durumu
          </label>
          <select
            value={formData.note}
            onChange={(e) =>
              setFormData({ ...formData, note: e.target.value })
            }
            className="w-full px-3.5 py-2.5 rounded-lg border border-slate-300 text-sm bg-white focus:border-emerald-600 focus:ring-1 focus:ring-emerald-600 outline-none transition"
          >
            <option value="">Seçiniz</option>
            <option value="Henüz şirket kurmadım (Yeni Girişim)">Henüz şirket kurmadım</option>
            <option value="Mevcut şirketim var (KOBİ Büyüme)">Mevcut şirketim var</option>
            <option value="Makine / Teçhizat yatırımı planlıyorum">Makine / Teçhizat yatırımı planlıyorum</option>
          </select>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full mt-2 py-3.5 px-6 rounded-xl bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-bold text-sm tracking-wide shadow-md shadow-emerald-600/20 transition disabled:opacity-50"
      >
        {loading ? "Analiz Talebi Gönderiliyor..." : "Ücretsiz Hibe Analizi Talep Et"}
      </button>

      <p className="text-[11px] text-slate-400 text-center">
        Bilgileriniz KVKK standartlarında korunur ve yalnızca analiz bilgilendirmesi amacıyla kullanılır.
      </p>
    </form>
  );
}
