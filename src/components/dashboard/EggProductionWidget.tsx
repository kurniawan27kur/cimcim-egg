'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface EggProductionWidgetProps {
  totalEggs: number;
  growthPercent: number;
  averagePerDay: number;
  targetPerDay: number;
  onRecordClick?: () => void;
}

export default function EggProductionWidget({
  totalEggs = 0,
  growthPercent = 0,
  averagePerDay = 0,
  targetPerDay = 100,
  onRecordClick,
}: EggProductionWidgetProps) {
  const progressPercent = Math.min(100, Math.round((averagePerDay / targetPerDay) * 100));

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs flex flex-col justify-between">
      {/* Title & Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100/60">
            <span className="text-sm leading-none">🥚</span>
          </div>
          <h2 className="text-sm sm:text-base font-bold text-slate-900">Produksi Telur</h2>
        </div>

        <Link
          href="/produksi"
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
        >
          Rincian
        </Link>
      </div>

      {/* Main KPI */}
      <div className="mt-2.5">
        <p className="text-[11px] font-medium text-slate-500">Jumlah butir bulan ini</p>
        <div className="flex items-baseline gap-2 mt-0.5">
          <h3 className="text-xl sm:text-2xl font-extrabold text-slate-900 tracking-tight tabular-nums">
            {formatNumber(totalEggs)} <span className="text-xs font-medium text-slate-500">butir</span>
          </h3>

          <span className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold bg-emerald-50 text-emerald-700">
            <ArrowUpRight className="w-2.5 h-2.5" />
            {growthPercent}%
          </span>
        </div>
      </div>

      {/* Progress & Target */}
      <div className="mt-3 pt-2.5 border-t border-slate-100">
        <div className="flex items-center justify-between text-xs font-medium text-slate-600 mb-1">
          <span>Rata-rata per hari</span>
          <span className="font-bold text-slate-900 tabular-nums">{averagePerDay} / {targetPerDay} butir</span>
        </div>

        {/* Progress Bar */}
        <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-orange-400 to-[#D9531E] rounded-full transition-all duration-500"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
