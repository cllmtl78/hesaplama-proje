"use client";

import { useState, useMemo, useEffect, useRef } from "react";
import Link from "next/link";
import {
  Briefcase,
  Receipt,
  TrendingUp,
  Building2,
  Search,
  ArrowRight,
  Scale,
  ShieldCheck,
  FileCheck,
  Clock,
  Home,
  Percent,
  Coins,
  Globe,
  Car,
  ShoppingBag,
} from "lucide-react";
import { TOOLS_REGISTRY, CATEGORIES } from "@/data/toolsRegistry";

// Map slugs to icons
const TOOL_ICONS: Record<string, typeof Briefcase> = {
  "kidem-tazminati-hesaplama": Briefcase,
  "issizlik-maasi-hesaplama": Clock,
  "brutten-nete-maas-hesaplama": Coins,
  "fazla-mesai-hesaplama": Scale,
  "kdv-tevkifat-hesaplama": Receipt,
  "gelir-vergisi-hesaplama": TrendingUp,
  "kira-gelir-vergisi-hesaplama": Percent,
  "gumruk-vergisi-hesaplama": Globe,
  "tapu-harci-hesaplama": Home,
  "kira-artisi-hesaplama": FileCheck,
  "kosgeb-destekleri-sorgulama": Building2,
  "pazaryeri-komisyon-hesaplama": ShoppingBag,
  "mtv-hesaplama": Car,
  "arac-deger-kaybi-hesaplama": ShieldCheck,
};

// Energetic and contrasting category color themes
interface CategoryTheme {
  iconBg: string;
  iconText: string;
  iconRing: string;
  hoverBorder: string;
  badgeBg: string;
  badgeText: string;
  badgeBorder: string;
  buttonHover: string;
  tagColor: string;
}

const CATEGORY_THEMES: Record<string, CategoryTheme> = {
  is_hukuku: {
    iconBg: "bg-blue-500/10",
    iconText: "text-blue-600",
    iconRing: "ring-1 ring-blue-500/20",
    hoverBorder: "hover:border-blue-400/70",
    badgeBg: "bg-blue-50",
    badgeText: "text-blue-700",
    badgeBorder: "border-blue-200/70",
    buttonHover: "hover:bg-blue-600",
    tagColor: "text-blue-600 bg-blue-50/50 border-blue-200/50",
  },
  vergi_muhasebe: {
    iconBg: "bg-amber-500/10",
    iconText: "text-amber-600",
    iconRing: "ring-1 ring-amber-500/20",
    hoverBorder: "hover:border-amber-400/70",
    badgeBg: "bg-amber-50",
    badgeText: "text-amber-700",
    badgeBorder: "border-amber-200/70",
    buttonHover: "hover:bg-amber-600",
    tagColor: "text-amber-700 bg-amber-50/50 border-amber-200/50",
  },
  gayrimenkul: {
    iconBg: "bg-rose-500/10",
    iconText: "text-rose-600",
    iconRing: "ring-1 ring-rose-500/20",
    hoverBorder: "hover:border-rose-400/70",
    badgeBg: "bg-rose-50",
    badgeText: "text-rose-700",
    badgeBorder: "border-rose-200/70",
    buttonHover: "hover:bg-rose-600",
    tagColor: "text-rose-600 bg-rose-50/50 border-rose-200/50",
  },
  tesvik_ticaret: {
    iconBg: "bg-emerald-500/10",
    iconText: "text-emerald-600",
    iconRing: "ring-1 ring-emerald-500/20",
    hoverBorder: "hover:border-emerald-400/70",
    badgeBg: "bg-emerald-50",
    badgeText: "text-emerald-700",
    badgeBorder: "border-emerald-200/70",
    buttonHover: "hover:bg-emerald-600",
    tagColor: "text-emerald-700 bg-emerald-50/50 border-emerald-200/50",
  },
  arac_sigorta: {
    iconBg: "bg-indigo-500/10",
    iconText: "text-indigo-600",
    iconRing: "ring-1 ring-indigo-500/20",
    hoverBorder: "hover:border-indigo-400/70",
    badgeBg: "bg-indigo-50",
    badgeText: "text-indigo-700",
    badgeBorder: "border-indigo-200/70",
    buttonHover: "hover:bg-indigo-600",
    tagColor: "text-indigo-600 bg-indigo-50/50 border-indigo-200/50",
  },
};

const DEFAULT_THEME: CategoryTheme = {
  iconBg: "bg-blue-500/10",
  iconText: "text-blue-600",
  iconRing: "ring-1 ring-blue-500/20",
  hoverBorder: "hover:border-blue-400/70",
  badgeBg: "bg-blue-50",
  badgeText: "text-blue-700",
  badgeBorder: "border-blue-200/70",
  buttonHover: "hover:bg-blue-600",
  tagColor: "text-blue-600 bg-blue-50/50 border-blue-200/50",
};

export default function PortalApp() {
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  // Keyboard shortcut listener: Cmd+K or Ctrl+K focuses the search input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        searchInputRef.current?.focus();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  // Filter tools by category and search query
  const filteredTools = useMemo(() => {
    return TOOLS_REGISTRY.filter((tool) => {
      const matchesCategory =
        selectedCategory === "all" || tool.category === selectedCategory;

      if (!searchQuery.trim()) return matchesCategory;

      const q = searchQuery.toLowerCase();
      const matchesSearch =
        tool.title.toLowerCase().includes(q) ||
        tool.description.toLowerCase().includes(q) ||
        tool.categoryLabel.toLowerCase().includes(q) ||
        tool.badge.toLowerCase().includes(q) ||
        tool.keywords.some((k) => k.toLowerCase().includes(q));

      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  return (
    <div className="space-y-8 sm:space-y-12">
      {/* Energetic Hero Section (Raycast / Stripe Style) */}
      <section className="text-center space-y-4 sm:space-y-5 max-w-3xl mx-auto pt-2 sm:pt-6 pb-2">
        {/* Top Pill Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/90 border border-slate-200/80 shadow-xs backdrop-blur-md text-xs font-semibold text-slate-800">
          <span className="flex h-2 w-2 rounded-full bg-blue-600 animate-pulse" />
          <span className="text-blue-700 font-bold">2026/Q1 Güncel Mevzuat</span>
          <span className="text-slate-300">·</span>
          <span className="text-slate-600 font-normal">14 Modüler Hesaplama Aracı</span>
        </div>

        {/* Main Headline with Linear Gradient Accent */}
        <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[1.14]">
          Tüm Resmi ve Finansal Hesaplamalar{" "}
          <span className="bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 bg-clip-text text-transparent">
            Tek Noktada
          </span>
        </h1>

        {/* Subtitle */}
        <p className="text-slate-600 text-xs sm:text-base leading-relaxed max-w-2xl mx-auto font-normal px-2">
          İş hukuku tazminatları, KDV tevkifatı, kümülatif gelir vergisi, tapu masrafları, kira zammı ve KOSGEB teşviklerini yasal formüllerle saniyeler içinde hesaplayın.
        </p>

        {/* Fast Search Input with Command/Ctrl+K Badge and Focus Glow */}
        <div className="pt-2 max-w-xl mx-auto px-2 sm:px-0">
          <div className="relative group">
            <Search className="w-5 h-5 text-slate-400 group-hover:text-blue-500 absolute left-4 top-1/2 -translate-y-1/2 transition-colors pointer-events-none" />
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Hesaplama aracı, kanun maddesi veya anahtar kelime arayın..."
              className="w-full h-12 sm:h-14 pl-12 pr-24 sm:pr-28 bg-white/95 backdrop-blur-md border border-slate-300/80 rounded-2xl text-base sm:text-sm text-slate-900 placeholder:text-slate-400 shadow-sm hover:border-slate-400 focus:border-blue-500 focus:ring-4 focus:ring-blue-500/10 transition-all outline-hidden"
            />

            {/* Right Badge: Clear or Cmd+K Shortcut */}
            {searchQuery ? (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute right-3.5 top-1/2 -translate-y-1/2 text-xs font-semibold text-slate-400 hover:text-slate-700 bg-slate-100 hover:bg-slate-200 px-2.5 py-1 rounded-lg transition-colors"
              >
                Temizle
              </button>
            ) : (
              <div className="absolute right-3.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-2.5 py-1 bg-slate-100/80 border border-slate-200/80 rounded-lg text-[11px] font-mono text-slate-500 font-semibold shadow-2xs pointer-events-none">
                <kbd>⌘</kbd>
                <kbd>K</kbd>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Floating Category Filter Tabs (Zero Hash Anchors) */}
      <div className="flex items-center justify-center px-1">
        <div className="flex flex-wrap items-center justify-center gap-1.5 p-1.5 bg-slate-200/60 backdrop-blur-md rounded-2xl border border-slate-200/80 max-w-full overflow-x-auto shadow-2xs">
          {CATEGORIES.map((cat) => {
            const isSelected = selectedCategory === cat.id;
            const count = TOOLS_REGISTRY.filter((t) => t.category === cat.id).length;

            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-xs font-semibold transition-all shrink-0 flex items-center gap-1.5 ${
                  isSelected
                    ? "bg-white text-slate-900 shadow-sm shadow-slate-200 font-bold"
                    : "text-slate-600 hover:text-slate-900 hover:bg-white/60"
                }`}
              >
                <span>{cat.label}</span>
                {cat.id !== "all" && (
                  <span
                    className={`text-[10px] px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-slate-100 text-slate-700"
                        : "bg-slate-200/80 text-slate-500"
                    }`}
                  >
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Bento Grid with Direct Clean Routes (Link href="/[tool-slug]") */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
        {filteredTools.map((tool) => {
          const IconComp = TOOL_ICONS[tool.slug] || Briefcase;
          const theme = CATEGORY_THEMES[tool.category] || DEFAULT_THEME;

          return (
            <Link
              key={tool.slug}
              href={`/${tool.slug}`}
              className={`bg-white/95 backdrop-blur-sm border border-slate-200/80 rounded-2xl p-4 sm:p-6 shadow-xs hover:-translate-y-1 hover:shadow-xl hover:shadow-slate-200/60 ${theme.hoverBorder} transition-all duration-300 flex flex-col justify-between group relative overflow-hidden`}
            >
              {/* Subtle Top-Right Ambient Gradient Flare */}
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-slate-100/60 via-transparent to-transparent pointer-events-none rounded-tr-2xl" />

              {/* Top Header & Badges */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <span className="text-[11px] font-semibold text-slate-500 tracking-wide uppercase">
                    {tool.categoryLabel}
                  </span>
                  <span
                    className={`text-xs font-semibold px-2.5 py-0.5 rounded-full border ${theme.badgeBg} ${theme.badgeText} ${theme.badgeBorder}`}
                  >
                    {tool.badge}
                  </span>
                </div>

                {/* Icon + Title */}
                <div className="flex items-start gap-3.5 mb-2.5">
                  <div
                    className={`w-10 h-10 sm:w-11 sm:h-11 rounded-xl ${theme.iconBg} ${theme.iconText} ${theme.iconRing} flex items-center justify-center shrink-0 transition-transform duration-200 group-hover:scale-105`}
                  >
                    <IconComp className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-base sm:text-lg font-bold text-slate-900 group-hover:text-blue-600 transition-colors leading-snug">
                      {tool.title}
                    </h2>
                    <div className="text-[11px] text-slate-400 font-medium mt-0.5">
                      {tool.legalBase}
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-xs text-slate-600 line-clamp-2 sm:line-clamp-3 leading-relaxed mb-4">
                  {tool.description}
                </p>

                {/* Keyword Tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {tool.keywords.slice(0, 3).map((kw, i) => (
                    <span
                      key={i}
                      className={`text-[10px] font-medium px-2 py-0.5 rounded-md border ${theme.tagColor}`}
                    >
                      #{kw}
                    </span>
                  ))}
                </div>
              </div>

              {/* Action Button: "Hemen Hesapla ->" Direct Route Link */}
              <div className="pt-3.5 border-t border-slate-100 flex items-center justify-between gap-2">
                <span className="text-xs font-bold text-slate-900 group-hover:text-blue-600 transition-colors">
                  Hesaplayıcıyı Aç
                </span>
                <span
                  className={`inline-flex items-center justify-center gap-1.5 px-3.5 py-2 bg-slate-900 text-white rounded-xl text-xs font-semibold ${theme.buttonHover} transition-all duration-200 shadow-sm shadow-slate-900/10 group-hover:translate-x-0.5`}
                >
                  <span>Hesapla</span>
                  <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform duration-200" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>

      {/* Arama Sonucu Bulunamadı Durumu */}
      {filteredTools.length === 0 && (
        <div className="text-center py-12 sm:py-14 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl space-y-3.5 shadow-sm px-4">
          <Search className="w-10 h-10 text-slate-300 mx-auto" />
          <div className="text-base font-bold text-slate-900">
            Aramanızla eşleşen hesaplama aracı bulunamadı
          </div>
          <p className="text-xs text-slate-500 max-w-sm mx-auto leading-relaxed">
            &quot;{searchQuery}&quot; kriterine uygun araç bulunamadı. Lütfen farklı bir arama yapın veya filtreleri sıfırlayın.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearchQuery("");
              setSelectedCategory("all");
            }}
            className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold bg-slate-900 text-white rounded-xl hover:bg-blue-600 transition-colors shadow-sm"
          >
            Filtreleri Sıfırla
          </button>
        </div>
      )}

      {/* Enterprise Trust & Compliance Bar */}
      <div className="p-4 sm:p-5 bg-white/90 backdrop-blur-md border border-slate-200/80 rounded-2xl shadow-xs text-xs text-slate-600 flex flex-col md:flex-row items-center justify-between gap-3.5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 text-emerald-600 ring-1 ring-emerald-500/20 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-slate-900">
              Resmi Mevzuat ve Yasal Doğruluk Garantisi:
            </span>{" "}
            Tüm formüller Resmî Gazete&apos;de yayımlanan 2026/Q1 vergi dilimleri, kıdem tavanı ve tebliğlerle test edilmiştir.
          </div>
        </div>
        <div className="flex items-center gap-2 shrink-0 text-[11px] font-mono font-medium text-slate-500 flex-wrap">
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg">4857 İş K.</span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg">193 GVK</span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg">3065 KDVK</span>
          <span className="px-2.5 py-1 bg-slate-100 rounded-lg">TBK 344</span>
        </div>
      </div>
    </div>
  );
}
