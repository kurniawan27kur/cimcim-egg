'use client';

import React from 'react';
import Link from 'next/link';
import { ExpenseItem, ExpenseCategory } from '@/types';
import { formatIDR, formatDateID } from '@/lib/utils';

interface RecentExpensesWidgetProps {
  expenses: ExpenseItem[];
}

export default function RecentExpensesWidget({ expenses = [] }: RecentExpensesWidgetProps) {
  const displayExpenses = expenses.slice(0, 3);

  const getCategoryBadge = (category: ExpenseCategory | string) => {
    switch (category) {
      case 'Pakan':
        return 'bg-sky-50 text-sky-700 border-sky-100';
      case 'Kesehatan':
        return 'bg-rose-50 text-rose-700 border-rose-100';
      case 'Operasional':
        return 'bg-purple-50 text-purple-700 border-purple-100';
      case 'Peralatan':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Perawatan':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      default:
        return 'bg-slate-100 text-slate-700 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">Pengeluaran Terbaru</h2>
        <Link
          href="/pengeluaran"
          className="text-xs font-semibold text-orange-600 hover:text-orange-700 hover:underline"
        >
          Lihat Semua
        </Link>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs whitespace-nowrap">
          <thead>
            <tr className="text-slate-400 font-semibold border-b border-slate-100">
              <th className="py-2 font-medium">Tanggal</th>
              <th className="py-2 font-medium">Kategori</th>
              <th className="py-2 font-medium">Barang</th>
              <th className="py-2 font-medium text-right pr-1">Total</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displayExpenses.map((exp) => (
              <tr key={exp.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 font-medium text-slate-600">{formatDateID(exp.date)}</td>
                <td className="py-2">
                  <span
                    className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-semibold border ${getCategoryBadge(
                      exp.category
                    )}`}
                  >
                    {exp.category}
                  </span>
                </td>
                <td className="py-2 font-medium text-slate-800 truncate max-w-[100px]">
                  {exp.itemName}
                </td>
                <td className="py-2 font-bold text-slate-900 text-right pr-1 tabular-nums">
                  {formatIDR(exp.totalAmount)}
                </td>
              </tr>
            ))}

            {displayExpenses.length === 0 && (
              <tr>
                <td colSpan={4} className="py-4 text-center text-slate-400">
                  Belum ada transaksi.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
