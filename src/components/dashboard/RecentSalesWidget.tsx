'use client';

import React from 'react';
import Link from 'next/link';
import { SaleItem } from '@/types';
import { formatIDR, formatDateID, formatNumber } from '@/lib/utils';

interface RecentSalesWidgetProps {
  sales: SaleItem[];
}

export default function RecentSalesWidget({ sales = [] }: RecentSalesWidgetProps) {
  const displaySales = sales.slice(0, 5);

  return (
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-base font-bold text-slate-900">Penjualan Terbaru</h2>
        <Link
          href="/penjualan"
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
              <th className="py-2.5 font-medium text-center">Jumlah</th>
              <th className="py-2.5 font-medium text-right">Harga Satuan</th>
              <th className="py-2.5 font-medium text-right">Total</th>
              <th className="py-2.5 font-medium text-right pr-1">Keterangan</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-50">
            {displaySales.map((sale) => (
              <tr key={sale.id} className="hover:bg-slate-50/80 transition-colors">
                <td className="py-2.5 font-medium text-slate-600">{formatDateID(sale.date)}</td>
                <td className="py-2.5 text-slate-800 font-medium text-center tabular-nums">
                  {formatNumber(sale.quantity)}
                </td>
                <td className="py-2.5 text-slate-600 text-right tabular-nums font-medium">
                  {formatIDR(sale.unitPrice)}
                </td>
                <td className="py-2.5 font-bold text-slate-900 text-right tabular-nums">
                  {formatIDR(sale.totalAmount)}
                </td>
                <td className="py-2.5 text-slate-500 text-right pr-1 font-normal truncate max-w-[120px]">
                  {sale.customerName}
                </td>
              </tr>
            ))}

            {displaySales.length === 0 && (
              <tr>
                <td colSpan={5} className="py-6 text-center text-slate-400">
                  Belum ada transaksi penjualan terbaru.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
