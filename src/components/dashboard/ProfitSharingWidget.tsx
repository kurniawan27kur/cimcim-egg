'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Receipt, CheckCircle2, User, ArrowRight } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import { MonthlyReport, Partner } from '@/types';

interface ProfitSharingWidgetProps {
  report?: MonthlyReport;
  totalSales?: number;
  totalExpenses?: number;
  netProfit?: number;
  partnerShare?: number;
  monthName?: string;
  partners?: Partner[];
}

export default function ProfitSharingWidget({
  totalSales = 0,
  totalExpenses = 0,
  netProfit = 0,
  partnerShare = 0,
  monthName = 'September 2026',
  partners = [],
}: ProfitSharingWidgetProps) {
  const p1Name = partners[0]?.name || 'Mitra 1';
  const p1Share = partners[0]?.sharePercent ?? 50;
  const p1Avatar = partners[0]?.avatarColor || '#D9531E';

  const p2Name = partners[1]?.name || 'Mitra 2';
  const p2Share = partners[1]?.sharePercent ?? 50;
  const p2Avatar = partners[1]?.avatarColor || '#0284C7';

  const cleanTitle = monthName.includes('2026-09') || monthName.includes('September')
    ? 'September 2026'
    : monthName.replace(/^Periode\s+/i, '').replace(/^Bulan\s+/i, '');

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          Skema Bagi Hasil — {cleanTitle}
        </h2>
        <Link
          href="/bagi-hasil"
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
        >
          <span>Persetujuan</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Flow Calculation Bar */}
      <div className="bg-slate-50/70 border border-slate-200/70 rounded-xl p-2.5 sm:p-3 flex items-center justify-between gap-2 overflow-x-auto">
        {/* Total Penjualan */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-orange-100/70 border border-orange-200/60 flex items-center justify-center text-orange-600 shrink-0">
            <ShoppingBag className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-500">Penjualan</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">{formatIDR(totalSales)}</p>
          </div>
        </div>

        {/* Minus Sign */}
        <div className="w-5 h-5 rounded-full bg-slate-200/80 flex items-center justify-center font-bold text-slate-600 text-[11px] shrink-0">
          −
        </div>

        {/* Total Pengeluaran */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-rose-100/70 border border-rose-200/60 flex items-center justify-center text-rose-600 shrink-0">
            <Receipt className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-500">Pengeluaran</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">{formatIDR(totalExpenses)}</p>
          </div>
        </div>

        {/* Equals Sign */}
        <div className="w-5 h-5 rounded-full bg-slate-200/80 flex items-center justify-center font-bold text-slate-600 text-[11px] shrink-0">
          =
        </div>

        {/* Laba Bersih */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg bg-emerald-100/70 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
          <div>
            <p className="text-[10px] font-medium text-slate-500">Laba Bersih</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums">{formatIDR(netProfit)}</p>
          </div>
        </div>
      </div>

      {/* Branching Distribution Cards */}
      <div className="grid grid-cols-2 gap-3 mt-3">
        {/* Partner 1 */}
        <div className="bg-[#FFF5EB] border border-orange-200/70 rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs"
            style={{ backgroundColor: p1Avatar }}
          >
            {p1Name ? p1Name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-slate-600 truncate">{p1Name} ({p1Share}%)</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums truncate">
              {formatIDR(partnerShare)}
            </p>
          </div>
        </div>

        {/* Partner 2 */}
        <div className="bg-[#F0F9FF] border border-sky-200/70 rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5">
          <div
            className="w-8 h-8 rounded-lg flex items-center justify-center text-white shrink-0 font-bold text-xs"
            style={{ backgroundColor: p2Avatar }}
          >
            {p2Name ? p2Name.charAt(0).toUpperCase() : 'M'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-slate-600 truncate">{p2Name} ({p2Share}%)</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums truncate">
              {formatIDR(partnerShare)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
