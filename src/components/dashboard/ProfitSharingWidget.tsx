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
  totalSales = 8450000,
  totalExpenses = 5320000,
  netProfit = 3130000,
  partnerShare = 1565000,
  monthName = 'September 2026',
}: ProfitSharingWidgetProps) {
  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">
          Skema Bagi Hasil Bulan {monthName}
        </h2>
        <Link
          href="/bagi-hasil"
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline flex items-center gap-1"
        >
          <span>Persetujuan & Rincian</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Flow Calculation Bar */}
      <div className="bg-slate-50/70 border border-slate-200/70 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Total Penjualan */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-orange-100/70 border border-orange-200/60 flex items-center justify-center text-orange-600 shrink-0">
            <ShoppingBag className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Penjualan</p>
            <p className="text-sm font-bold text-slate-900 tabular-nums">{formatIDR(totalSales)}</p>
          </div>
        </div>

        {/* Minus Sign */}
        <div className="w-6 h-6 rounded-full bg-slate-200/80 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
          −
        </div>

        {/* Total Pengeluaran */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-rose-100/70 border border-rose-200/60 flex items-center justify-center text-rose-600 shrink-0">
            <Receipt className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Total Pengeluaran</p>
            <p className="text-sm font-bold text-slate-900 tabular-nums">{formatIDR(totalExpenses)}</p>
          </div>
        </div>

        {/* Equals Sign */}
        <div className="w-6 h-6 rounded-full bg-slate-200/80 flex items-center justify-center font-bold text-slate-600 text-xs shrink-0">
          =
        </div>

        {/* Laba Bersih */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <div className="w-9 h-9 rounded-xl bg-emerald-100/70 border border-emerald-200/60 flex items-center justify-center text-emerald-600 shrink-0">
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div>
            <p className="text-[11px] font-medium text-slate-500">Laba Bersih</p>
            <p className="text-sm font-bold text-slate-900 tabular-nums">{formatIDR(netProfit)}</p>
          </div>
        </div>
      </div>

      {/* Branching Distribution Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-4">
        {/* Partner 1 */}
        <div className="bg-[#FFF5EB] border border-orange-200/70 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-orange-100 border border-orange-200 flex items-center justify-center text-[#D9531E] shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-600">Partner 1 (Kurniawan)</p>
            <p className="text-base sm:text-lg font-bold text-slate-900 tabular-nums mt-0.5">
              {formatIDR(partnerShare)}
            </p>
            <p className="text-xs font-bold text-orange-600 mt-0.5">50%</p>
          </div>
        </div>

        {/* Partner 2 */}
        <div className="bg-[#F0F9FF] border border-sky-200/70 rounded-2xl p-4 flex items-center gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-sky-100 border border-sky-200 flex items-center justify-center text-sky-600 shrink-0">
            <User className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-slate-600">Partner 2 (Santoso)</p>
            <p className="text-base sm:text-lg font-bold text-slate-900 tabular-nums mt-0.5">
              {formatIDR(partnerShare)}
            </p>
            <p className="text-xs font-bold text-sky-600 mt-0.5">50%</p>
          </div>
        </div>
      </div>
    </div>
  );
}
