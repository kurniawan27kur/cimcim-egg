'use client';

import React from 'react';
import { Calendar, ChevronDown } from 'lucide-react';

interface HeaderProps {
  title: string;
  subtitle?: string;
  currentPeriod?: string;
  onPeriodChange?: (period: string) => void;
  actionButton?: React.ReactNode;
}

export default function Header({
  title,
  subtitle,
  currentPeriod = '2026-09',
  onPeriodChange,
  actionButton,
}: HeaderProps) {
  const periods = [
    { value: '2026-09', label: 'September 2026' },
    { value: '2026-08', label: 'Agustus 2026' },
    { value: '2026-07', label: 'Juli 2026' },
    { value: '2026-06', label: 'Juni 2026' },
    { value: '2026-05', label: 'Mei 2026' },
  ];

  return (
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 mb-4">
      <div>
        <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">{title}</h1>
        {subtitle && <p className="text-xs text-slate-500">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-2 self-start sm:self-auto flex-wrap">
        {onPeriodChange && (
          <div className="relative inline-block">
            <select
              value={currentPeriod}
              onChange={(e) => onPeriodChange(e.target.value)}
              className="appearance-none bg-white border border-slate-200 hover:border-slate-300 text-slate-700 font-semibold text-xs rounded-xl pl-8 pr-7 py-1.5 shadow-2xs focus:outline-none focus:ring-2 focus:ring-orange-500/20 cursor-pointer"
            >
              {periods.map((p) => (
                <option key={p.value} value={p.value}>
                  {p.label}
                </option>
              ))}
            </select>
            <Calendar className="w-3.5 h-3.5 text-slate-500 absolute left-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        )}

        {actionButton}
      </div>
    </header>
  );
}
