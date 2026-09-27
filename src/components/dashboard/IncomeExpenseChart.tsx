'use client';

import React, { useState } from 'react';
import {
  ComposedChart,
  Bar,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { formatIDR } from '@/lib/utils';
import { ChevronDown } from 'lucide-react';

interface ChartProps {
  data: Array<{
    month: string;
    fullMonth?: string;
    sales: number;
    expenses: number;
    netProfit: number;
  }>;
}

export default function IncomeExpenseChart({ data }: ChartProps) {
  const [year, setYear] = useState('2026');

  const formatYAxis = (value: number) => {
    if (value === 0) return 'Rp 0';
    return `Rp ${(value / 1000000).toFixed(0)}jt`;
  };

  const CustomTooltip = ({ active, payload, label }: any) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-white/95 backdrop-blur border border-slate-200 p-3 rounded-xl shadow-lg text-xs space-y-1.5 min-w-[150px]">
          <p className="font-semibold text-slate-800 border-b border-slate-100 pb-1">{label} 2026</p>
          <div className="flex items-center justify-between text-orange-600">
            <span>Penjualan:</span>
            <span className="font-bold tabular-nums">{formatIDR(payload[0]?.value)}</span>
          </div>
          <div className="flex items-center justify-between text-amber-600">
            <span>Pengeluaran:</span>
            <span className="font-bold tabular-nums">{formatIDR(payload[1]?.value)}</span>
          </div>
          <div className="flex items-center justify-between text-teal-600 pt-1 border-t border-slate-100 font-semibold">
            <span>Laba Bersih:</span>
            <span className="font-bold tabular-nums">{formatIDR(payload[2]?.value)}</span>
          </div>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
      {/* Header & Filter */}
      <div className="flex items-center justify-between gap-2 mb-4 flex-wrap">
        <div>
          <h2 className="text-base font-bold text-slate-900">Grafik Pemasukan & Pengeluaran</h2>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <select
              value={year}
              onChange={(e) => setYear(e.target.value)}
              className="appearance-none bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-700 text-xs font-semibold rounded-lg pl-2.5 pr-6 py-1.5 focus:outline-none cursor-pointer"
            >
              <option value="2026">Tahun 2026</option>
              <option value="2025">Tahun 2025</option>
            </select>
            <ChevronDown className="w-3 h-3 text-slate-400 absolute right-2 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </div>

      {/* Custom Legend matching UI */}
      <div className="flex items-center justify-end gap-4 text-xs font-medium mb-3 text-slate-600 flex-wrap">
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#EA580C]" />
          <span>Penjualan</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#FED7AA]" />
          <span>Pengeluaran</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded-full bg-[#0D9488]" />
          <span>Laba Bersih</span>
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-[240px] sm:h-[270px]">
        <ResponsiveContainer width="100%" height="100%">
          <ComposedChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#F1F5F9" />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={{ stroke: '#E2E8F0' }}
              tick={{ fill: '#64748B', fontSize: 11 }}
            />
            <YAxis
              tickLine={false}
              axisLine={false}
              tickFormatter={formatYAxis}
              tick={{ fill: '#94A3B8', fontSize: 11 }}
              domain={[0, 12000000]}
              ticks={[0, 3000000, 6000000, 9000000, 12000000]}
            />
            <Tooltip content={<CustomTooltip />} />
            {/* Sales Bar */}
            <Bar dataKey="sales" name="Penjualan" fill="#EA580C" radius={[4, 4, 0, 0]} maxBarSize={16} />
            {/* Expenses Bar */}
            <Bar dataKey="expenses" name="Pengeluaran" fill="#FED7AA" radius={[4, 4, 0, 0]} maxBarSize={16} />
            {/* Net Profit Line */}
            <Line
              type="monotone"
              dataKey="netProfit"
              name="Laba Bersih"
              stroke="#0D9488"
              strokeWidth={2.5}
              dot={{ fill: '#0D9488', r: 3.5, strokeWidth: 1, stroke: '#FFFFFF' }}
              activeDot={{ r: 5 }}
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
