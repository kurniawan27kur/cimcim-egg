'use client';

import React from 'react';
import Link from 'next/link';
import { Wallet } from 'lucide-react';
import { CapitalContribution } from '@/types';
import { formatIDR, formatDateID, formatNumber } from '@/lib/utils';

interface CapitalInvestWidgetProps {
  investments: CapitalContribution[];
}

export default function CapitalInvestWidget({ investments = [] }: CapitalInvestWidgetProps) {
  const displayItems = investments.slice(0, 4);

  const getCategoryBadge = (category: string) => {
    if (category.toLowerCase().includes('modal')) {
      return 'bg-purple-50 text-purple-700 border-purple-100';
    }
    return 'bg-emerald-50 text-emerald-700 border-emerald-100';
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/60">
            <Wallet className="w-4 h-4 text-orange-500" />
          </div>
          <h2 className="text-base font-bold text-slate-900">Modal & Investasi</h2>
        </div>

        <Link
          href="/modal"
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto -mx-5 px-5">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="text-slate-400 font-semibold border-b border-slate-100 pb-2">
              <th className="py-2.5 font-medium">Tanggal</th>
              <th className="py-2.5 font-medium">Kategori</th>
              <th className="py-2.5 font-medium">Nama Barang</th>
              <th className="py-2.5 font-medium text-center">Jumlah</th>
              <th className="py-2.5 font-medium text-right pr-1">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displayItems.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 font-medium text-slate-600">{formatDateID(inv.date)}</td>
                <td className="py-2.5">
                  <span
                    className={`inline-block px-2 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryBadge(
                      inv.category
                    )}`}
                  >
                    {inv.category}
                  </span>
                </td>
                <td className="py-2.5 font-medium text-slate-800 truncate max-w-[130px]">
                  {inv.itemName}
                </td>
                <td className="py-2.5 text-slate-600 text-center font-medium tabular-nums">
                  {inv.quantity ? `${formatNumber(inv.quantity)} ${inv.unit || ''}` : '-'}
                </td>
                <td className="py-2.5 font-bold text-slate-900 text-right pr-1 tabular-nums">
                  {formatIDR(inv.amount)}
                </td>
              </tr>
            ))}

            {displayItems.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  Belum ada data modal & investasi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
