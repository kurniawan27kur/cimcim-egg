'use client';

import React from 'react';
import Link from 'next/link';
import { SaleItem } from '@/types';
import { formatIDR, formatDateID, formatNumber } from '@/lib/utils';

interface RecentSalesWidgetProps {
  sales: SaleItem[];
}

export default function RecentSalesWidget({ sales = [] }: RecentSalesWidgetProps) {
  const displaySales = sales.slice(0, 3);

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-sm sm:text-base font-bold text-slate-900">Penjualan Terbaru</h2>
        <Link
          href="/penjualan"
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
              <th className="py-2 font-medium text-center">Jml</th>
              <th className="py-2 font-medium text-right">Total</th>
              <th className="py-2 font-medium text-right pr-1">Ket</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displaySales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2 font-medium text-slate-600">{formatDateID(sale.date)}</td>
                <td className="py-2 text-slate-800 font-medium text-center tabular-nums">
                  {formatNumber(sale.quantity)}
                </td>
                <td className="py-2 font-bold text-slate-900 text-right tabular-nums">
                  {formatIDR(sale.totalAmount)}
                </td>
                <td className="py-2 text-slate-500 text-right pr-1 font-normal truncate max-w-[100px]">
                  {sale.customerName}
                </td>
              </tr>
            ))}

            {displaySales.length === 0 && (
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
