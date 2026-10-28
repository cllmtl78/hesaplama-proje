"use client";

import { useState } from "react";
import { Copy, Check, Printer, FileText, ShieldCheck } from "lucide-react";

export interface ReceiptItem {
  label: string;
  value: string;
  isDeduction?: boolean;
  isHighlight?: boolean;
  hint?: string;
}

export interface FintechReceiptCardProps {
  title?: string;
  badge?: string;
  primaryMetric: {
    label: string;
    amount: string;
    currency?: string;
    subtext?: string;
  };
  items: ReceiptItem[];
  copyText?: string;
  toolName?: string;
  legalNote?: string;
}

export default function FintechReceiptCard({
  title = "Hesaplama Fişi ve Kesinti Özeti",
  badge = "2026/Q1 Resmi Parametre",
  primaryMetric,
  items,
  copyText,
  legalNote,
}: FintechReceiptCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    const textToCopy =
      copyText ||
      `${title}\n${primaryMetric.label}: ${primaryMetric.amount} ${primaryMetric.currency || "TL"}\n${items
        .map((it) => `${it.label}: ${it.value}`)
        .join("\n")}\nPratikHesap.co`;

    try {
      await navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback
      setCopied(false);
    }
  };

  const handlePrint = () => {
    if (typeof window !== "undefined") {
      window.print();
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 shadow-xs p-4 sm:p-6 space-y-5 transition-all">
      {/* Receipt Top Header */}
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-blue-500/10 text-blue-600 ring-1 ring-blue-500/20 flex items-center justify-center">
            <FileText className="w-3.5 h-3.5" />
          </div>
          <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
            {title}
          </span>
        </div>
        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 border border-emerald-200/80 px-2 py-0.5 rounded-full">
          {badge}
        </span>
      </div>

      {/* Big Highlight Net Total Metric */}
      <div className="p-4 sm:p-5 bg-slate-900 text-white rounded-xl shadow-xs space-y-1">
        <div className="text-[11px] font-medium text-slate-400 uppercase tracking-wider">
          {primaryMetric.label}
        </div>
        <div className="flex items-baseline gap-2 flex-wrap">
          <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white font-mono tabular-nums tracking-tight">
            {primaryMetric.amount}
          </span>
          <span className="text-sm font-semibold text-slate-300 font-mono">
            {primaryMetric.currency || "TL"}
          </span>
        </div>
        {primaryMetric.subtext && (
          <div className="text-[11px] text-slate-400 font-normal pt-1">
            {primaryMetric.subtext}
          </div>
        )}
      </div>

      {/* Dashed Item Breakdown Ledger */}
      <div className="space-y-0 text-xs">
        {items.map((item, idx) => (
          <div
            key={idx}
            className={`py-2.5 flex items-center justify-between border-b border-dashed border-slate-200 gap-2 ${
              item.isHighlight ? "font-semibold text-slate-900 bg-slate-50/60 -mx-2 px-2 rounded" : ""
            }`}
          >
            <div className="text-slate-600 text-xs flex flex-col">
              <span>{item.label}</span>
              {item.hint && (
                <span className="text-[10px] text-slate-400 font-normal">
                  {item.hint}
                </span>
              )}
            </div>
            <div
              className={`font-mono text-xs tabular-nums text-right font-medium ${
                item.isDeduction ? "text-red-600" : "text-slate-900"
              }`}
            >
              {item.value}
            </div>
          </div>
        ))}
      </div>

      {/* Single-Click Action Buttons: Sonucu Kopyala & Yazdır */}
      <div className="pt-2 grid grid-cols-2 gap-2">
        <button
          type="button"
          onClick={handleCopy}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all active:scale-[0.98]"
        >
          {copied ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-600" />
              <span className="text-emerald-700">Kopyalandı!</span>
            </>
          ) : (
            <>
              <Copy className="w-3.5 h-3.5 text-slate-600" />
              <span>Sonucu Kopyala</span>
            </>
          )}
        </button>

        <button
          type="button"
          onClick={handlePrint}
          className="inline-flex items-center justify-center gap-1.5 h-10 px-3 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-semibold transition-all active:scale-[0.98]"
        >
          <Printer className="w-3.5 h-3.5 text-slate-600" />
          <span>Yazdır / PDF</span>
        </button>
      </div>

      {legalNote && (
        <div className="pt-2 text-[10px] text-slate-400 leading-relaxed flex items-start gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
          <span>{legalNote}</span>
        </div>
      )}

      {/* T.C. Resmi Mevzuat & İstisna Uyum Rozeti */}
      <div className="pt-2.5 border-t border-slate-100 flex items-center gap-2 px-3 py-2 rounded-xl bg-blue-50/70 border border-blue-200/60 text-[11px] text-blue-900 leading-snug">
        <ShieldCheck className="w-4 h-4 text-blue-600 shrink-0" />
        <span className="font-medium">
          T.C. Resmi Mevzuatı, yürürlükteki tavan/taban sınırları ve yasal istisnalar dikkate alınarak hesaplanmıştır.
        </span>
      </div>
    </div>
  );
}
