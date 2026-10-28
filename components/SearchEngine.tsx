'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';

interface Sektor {
  nace_kodu: string;
  sektor_tanimi: string;
  kisim_adi?: string;
  slug: string;
}

export default function SearchEngine({ initialData = [] }: { initialData?: Sektor[] }) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return initialData.slice(0, 20);
    const q = query.toLowerCase();
    return initialData
      .filter(
        (item) =>
          item.sektor_tanimi.toLowerCase().includes(q) ||
          item.nace_kodu.toLowerCase().includes(q)
      )
      .slice(0, 30);
  }, [query, initialData]);

  return (
    <div className="w-full max-w-3xl mx-auto my-8 px-4">
      <div className="relative">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="NACE kodu veya sektör adı yazın (örn: 10.71, Pastane, Yazılım)..."
          className="w-full p-4 pl-5 text-gray-900 border border-gray-300 rounded-xl shadow-sm focus:ring-2 focus:ring-blue-500 focus:outline-none"
        />
      </div>

      <div className="mt-6 space-y-3">
        {filtered.length === 0 ? (
          <p className="text-gray-500 text-center py-4">Eşleşen sektör bulunamadı.</p>
        ) : (
          filtered.map((item) => (
            <Link
              key={item.slug}
              href={`/kosgeb-destekleri/${item.slug}`}
              className="block p-4 bg-white border border-gray-200 rounded-xl hover:border-blue-500 hover:shadow-md transition-all"
            >
              <div className="flex items-center justify-between">
                <div>
                  <span className="inline-block px-2 py-1 text-xs font-semibold text-blue-700 bg-blue-100 rounded">
                    NACE: {item.nace_kodu}
                  </span>
                  <h3 className="text-base font-medium text-gray-800 mt-1">
                    {item.sektor_tanimi}
                  </h3>
                </div>
                <span className="text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1 rounded-full">
                  Destek Kapsamında
                </span>
              </div>
            </Link>
          ))
        )}
      </div>
    </div>
  );
}
