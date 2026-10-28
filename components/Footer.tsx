import Link from "next/link";
import { Calculator, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200/80 bg-white pt-12 pb-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-5 gap-8">
          <div className="space-y-3 sm:col-span-2 md:col-span-1">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 to-indigo-600 text-white flex items-center justify-center font-bold text-xs shadow-md shadow-blue-500/20">
                <Calculator className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900 text-base tracking-tight">
                PratikHesap<span className="text-blue-600">.co</span>
              </span>
            </div>
            <p className="text-slate-500 text-xs leading-relaxed">
              Türkiye&apos;nin güncel mevzuat, vergi dilimleri ve resmi SGK parametrelerine uygun hesaplama ve analiz platformu.
            </p>
            <div className="pt-1 text-[11px] text-slate-400 flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>2026/Q1 Güncel Mevzuat</span>
            </div>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              İş & Sosyal Güvenlik
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/kidem-tazminati-hesaplama" className="hover:text-blue-600 transition-colors">
                  Kıdem ve İhbar Tazminatı
                </Link>
              </li>
              <li>
                <Link href="/issizlik-maasi-hesaplama" className="hover:text-blue-600 transition-colors">
                  İşsizlik Maaşı Hesaplama
                </Link>
              </li>
              <li>
                <Link href="/brutten-nete-maas-hesaplama" className="hover:text-blue-600 transition-colors">
                  Brütten Nete Maaş (12 Ay)
                </Link>
              </li>
              <li>
                <Link href="/fazla-mesai-hesaplama" className="hover:text-blue-600 transition-colors">
                  Fazla Mesai ve Tatil Ücreti
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Vergi & Muhasebe
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/kdv-tevkifat-hesaplama" className="hover:text-blue-600 transition-colors">
                  KDV & Tevkifat Ayırıcı
                </Link>
              </li>
              <li>
                <Link href="/gelir-vergisi-hesaplama" className="hover:text-blue-600 transition-colors">
                  Gelir Vergisi (Şahıs Şirketi)
                </Link>
              </li>
              <li>
                <Link href="/kira-gelir-vergisi-hesaplama" className="hover:text-blue-600 transition-colors">
                  Kira Gelir Vergisi (GMSİ)
                </Link>
              </li>
              <li>
                <Link href="/gumruk-vergisi-hesaplama" className="hover:text-blue-600 transition-colors">
                  Yurt Dışı Gümrük Vergisi
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Gayrimenkul & Kira
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/tapu-harci-hesaplama" className="hover:text-blue-600 transition-colors">
                  Tapu Harcı & Döner Sermaye
                </Link>
              </li>
              <li>
                <Link href="/kira-artisi-hesaplama" className="hover:text-blue-600 transition-colors">
                  TÜFE Yasal Kira Artış Oranı
                </Link>
              </li>
              <li>
                <Link href="/kira-gelir-vergisi-hesaplama" className="hover:text-blue-600 transition-colors">
                  Götürü Gider vs Gerçek Gider
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="font-bold text-slate-900 mb-3 uppercase tracking-wider text-[11px]">
              Taşıt & E-Ticaret
            </h4>
            <ul className="space-y-2 text-slate-600">
              <li>
                <Link href="/mtv-hesaplama" className="hover:text-blue-600 transition-colors">
                  Motorlu Taşıtlar Vergisi (MTV)
                </Link>
              </li>
              <li>
                <Link href="/arac-deger-kaybi-hesaplama" className="hover:text-blue-600 transition-colors">
                  Araç Değer Kaybı (Kaza)
                </Link>
              </li>
              <li>
                <Link href="/pazaryeri-komisyon-hesaplama" className="hover:text-blue-600 transition-colors">
                  Pazaryeri Komisyon & Net Kâr
                </Link>
              </li>
              <li>
                <Link href="/kosgeb-destekleri-sorgulama" className="hover:text-blue-600 transition-colors">
                  KOSGEB NACE & Teşvikler
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4 text-slate-400 text-[11px]">
          <div>
            &copy; 2026 PratikHesap.co — Tüm hakları saklıdır. Hesaplamalar resmi mevzuat parametreleriyle genel bilgilendirme amacıyla sunulmaktadır.
          </div>
          <div className="flex items-center gap-4 text-slate-500">
            <span>4857 İş K.</span>
            <span>·</span>
            <span>193 GVK</span>
            <span>·</span>
            <span>3065 KDVK</span>
            <span>·</span>
            <span>TBK 344</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
