'use client';

import React from 'react';
import Link from 'next/link';
import { ShoppingBag, Receipt, CheckCircle2, User, ArrowRight } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import { MonthlyReport } from '@/types';

interface ProfitSharingWidgetProps {
  report?: MonthlyReport;
  totalSales?: number;
  totalExpenses?: number;
  netProfit?: number;
  partnerShare?: number;
  monthName?: string;
}

export default function ProfitSharingWidget({
  totalSales = 0,
  totalExpenses = 0,
  netProfit = 0,
  partnerShare = 0,
  monthName = 'Bulan Ini',
}: ProfitSharingWidgetProps) {
  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">
          Skema Bagi Hasil Bulan {monthName}
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
          <div className="w-8 h-8 rounded-lg bg-orange-100 border border-orange-200 flex items-center justify-center text-[#D9531E] shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-slate-600 truncate">Mitra A (50%)</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums truncate">
              {formatIDR(partnerShare)}
            </p>
          </div>
        </div>

        {/* Partner 2 */}
        <div className="bg-[#F0F9FF] border border-sky-200/70 rounded-xl p-2.5 sm:p-3 flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
            <User className="w-4 h-4" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[11px] font-semibold text-slate-600 truncate">Mitra B (50%)</p>
            <p className="text-xs sm:text-sm font-bold text-slate-900 tabular-nums truncate">
              {formatIDR(partnerShare)}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
