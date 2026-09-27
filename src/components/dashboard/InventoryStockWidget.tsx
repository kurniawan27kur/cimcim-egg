'use client';

import React from 'react';
import Link from 'next/link';
import { Package } from 'lucide-react';
import { InventoryItem } from '@/types';

interface InventoryStockWidgetProps {
  items: InventoryItem[];
  onAdjustClick?: (item: InventoryItem) => void;
}

export default function InventoryStockWidget({ items = [] }: InventoryStockWidgetProps) {
  const displayItems = items.slice(0, 3);

  const getItemIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('pakan')) return '🥫';
    if (lower.includes('vitamin')) return '🧴';
    if (lower.includes('sekam')) return '🪵';
    if (lower.includes('obat')) return '🧪';
    return '📦';
  };

  const getStatusBadge = (status: string) => {
    if (status === 'Aman') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-100">
          Aman
        </span>
      );
    }
    if (status === 'Cukup') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-100">
          Cukup
        </span>
      );
    }
    if (status === 'Kritis') {
      return (
        <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-100 animate-pulse">
          Kritis
        </span>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/60">
            <Package className="w-4 h-4 text-orange-500" />
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Stok Barang</h2>
        </div>

        <Link
          href="/inventaris"
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Stock Items List */}
      <div className="space-y-2">
        {displayItems.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between p-1.5 rounded-xl hover:bg-slate-50 transition-colors"
          >
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-slate-100/80 flex items-center justify-center text-sm shrink-0 border border-slate-200/50">
                {getItemIcon(item.name)}
              </div>
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{item.name}</p>
                <p className="text-[11px] text-slate-500 tabular-nums">
                  {item.currentQuantity} {item.unit}
                </p>
              </div>
            </div>

            <div className="shrink-0">{getStatusBadge(item.status)}</div>
          </div>
        ))}

        {displayItems.length === 0 && (
          <p className="text-xs text-slate-400 text-center py-2">Belum ada data stok.</p>
        )}
      </div>
    </div>
  );
}
