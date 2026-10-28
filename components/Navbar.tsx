"use client";

import { useState } from "react";
import Link from "next/link";
import { Calculator, Menu, X, ChevronDown, Sparkles } from "lucide-react";

export const NAV_CATEGORIES = [
  { id: "all", label: "Tüm Araçlar (14)", href: "/" },
  { id: "is_hukuku", label: "İş & SGK", href: "/kidem-tazminati-hesaplama" },
  { id: "vergi_muhasebe", label: "Vergi & Muhasebe", href: "/kdv-tevkifat-hesaplama" },
  { id: "gayrimenkul", label: "Gayrimenkul & Kira", href: "/tapu-harci-hesaplama" },
  { id: "arac_sigorta", label: "Taşıt & Sigorta", href: "/mtv-hesaplama" },
  { id: "tesvik_ticaret", label: "Teşvik & E-Ticaret", href: "/kosgeb-destekleri-sorgulama" },
];

export const POPULAR_TOOLS = [
  { label: "Kıdem & İhbar Tazminatı", href: "/kidem-tazminati-hesaplama", badge: "4857 İş K." },
  { label: "Brütten Nete Maaş (12 Ay)", href: "/brutten-nete-maas-hesaplama", badge: "5510 SSK" },
  { label: "KDV & Tevkifat Ayırıcı", href: "/kdv-tevkifat-hesaplama", badge: "3065 KDVK" },
  { label: "TÜFE Yasal Kira Artış Oranı", href: "/kira-artisi-hesaplama", badge: "TBK 344" },
  { label: "Tapu Harcı & Döner Sermaye", href: "/tapu-harci-hesaplama", badge: "492 Harçlar" },
  { label: "Motorlu Taşıtlar Vergisi (MTV)", href: "/mtv-hesaplama", badge: "197 MTV" },
  { label: "Araç Değer Kaybı (Kaza)", href: "/arac-deger-kaybi-hesaplama", badge: "ZMMS Esasları" },
  { label: "KOSGEB NACE Sorgulama", href: "/kosgeb-destekleri-sorgulama", badge: "2.627 Sektör" },
];

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200/80 bg-white/80 backdrop-blur-xl shadow-[0_2px_15px_-3px_rgba(0,0,0,0.03)] transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        {/* Brand Zone */}
        <div className="flex items-center gap-3">
          <Link
            href="/"
            className="flex items-center gap-2.5 group shrink-0"
          >
            <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-blue-600 via-indigo-600 to-violet-600 text-white flex items-center justify-center font-bold text-sm shadow-md shadow-blue-500/20 group-hover:scale-105 transition-transform duration-200">
              <Calculator className="w-4 h-4 text-white" />
            </div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-slate-900 text-base tracking-tight">
                PratikHesap<span className="text-blue-600 font-semibold">.co</span>
              </span>
              <span className="hidden sm:inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-blue-50 border border-blue-200/60 text-[10px] font-semibold text-blue-700">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                2026 Mevzuatı
              </span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links (No '#' hashes) */}
        <nav className="hidden lg:flex items-center gap-1 text-xs font-medium text-slate-600">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
          >
            Tüm Araçlar (14)
          </Link>
          <Link
            href="/kidem-tazminati-hesaplama"
            className="px-3 py-1.5 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
          >
            İş & SGK
          </Link>
          <Link
            href="/kdv-tevkifat-hesaplama"
            className="px-3 py-1.5 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
          >
            Vergi & Muhasebe
          </Link>
          <Link
            href="/tapu-harci-hesaplama"
            className="px-3 py-1.5 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
          >
            Gayrimenkul
          </Link>
          <Link
            href="/mtv-hesaplama"
            className="px-3 py-1.5 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
          >
            Taşıt & Sigorta
          </Link>
          <Link
            href="/kosgeb-destekleri-sorgulama"
            className="px-3 py-1.5 rounded-full hover:text-blue-600 hover:bg-blue-50/70 transition-colors"
          >
            Teşvik & E-Ticaret
          </Link>

          {/* Hızlı Seçim Dropdown */}
          <div className="relative ml-2">
            <button
              type="button"
              onClick={() => setDropdownOpen(!dropdownOpen)}
              onBlur={() => setTimeout(() => setDropdownOpen(false), 200)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-slate-900 text-white rounded-full text-xs font-semibold hover:bg-blue-600 transition-all shadow-sm shadow-slate-900/10 hover:shadow-blue-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-300" />
              <span>Hızlı Hesapla</span>
              <ChevronDown className="w-3 h-3 text-slate-400 group-hover:text-white" />
            </button>

            {dropdownOpen && (
              <div className="absolute right-0 mt-2 w-64 bg-white/95 backdrop-blur-xl border border-slate-200/90 rounded-2xl shadow-xl p-2 z-50 text-xs space-y-0.5 animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-2 text-[10px] font-bold text-slate-400 uppercase tracking-wider flex items-center justify-between">
                  <span>En Çok Kullanılanlar</span>
                  <span className="text-[10px] text-blue-600 font-semibold">2026/Q1</span>
                </div>
                {POPULAR_TOOLS.map((pt) => (
                  <Link
                    key={pt.href}
                    href={pt.href}
                    className="flex items-center justify-between px-3 py-2 rounded-xl text-slate-700 hover:bg-blue-50/80 hover:text-blue-700 font-medium transition-all group"
                  >
                    <span className="truncate">{pt.label}</span>
                    <span className="text-[10px] font-mono text-slate-400 group-hover:text-blue-600 shrink-0 ml-2">
                      {pt.badge}
                    </span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* Mobile Hamburger Button */}
        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-xl transition"
            aria-label="Menüyü aç"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden border-t border-slate-200 bg-white/95 backdrop-blur-xl px-4 py-4 space-y-4">
          <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400">
            Kategoriler
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {NAV_CATEGORIES.map((cat) => (
              <Link
                key={cat.id}
                href={cat.href}
                onClick={() => setMobileMenuOpen(false)}
                className="px-3.5 py-2.5 rounded-xl bg-slate-50 text-slate-700 font-medium hover:bg-blue-50 hover:text-blue-700 transition-colors"
              >
                {cat.label}
              </Link>
            ))}
          </div>

          <div className="pt-2 border-t border-slate-100">
            <div className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
              Popüler Hesaplayıcılar
            </div>
            <div className="space-y-1">
              {POPULAR_TOOLS.map((tool) => (
                <Link
                  key={tool.href}
                  href={tool.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between px-3 py-2 text-xs font-medium text-slate-700 hover:bg-blue-50 hover:text-blue-700 rounded-lg transition-colors"
                >
                  <span>{tool.label}</span>
                  <span className="text-[10px] text-slate-400">{tool.badge}</span>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
