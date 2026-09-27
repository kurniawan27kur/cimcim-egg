'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import { DashboardSummary, Partner } from '@/types';
import { formatIDR, formatDateID, formatNumber } from '@/lib/utils';
import { generateMonthlyReportPDF } from '@/lib/pdfExport';
import {
  FileText,
  Download,
  Printer,
  TrendingUp,
  Receipt,
  Scale,
  DollarSign,
  Loader2,
} from 'lucide-react';

export default function LaporanPage() {
  const [period, setPeriod] = useState('2026-09');
  const [activeTab, setActiveTab] = useState<'PL' | 'CASHFLOW' | 'CAPITAL'>('PL');
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);

  const fetchReportData = async (selectedPeriod: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?period=${selectedPeriod}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.authenticated) setCurrentUser(json.user);
      }
    } catch {}
  };

  useEffect(() => {
    fetchReportData(period);
    fetchCurrentUser();
  }, [period]);

  if (!data) return null;

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Header
            title="Laporan Keuangan"
            subtitle="Laporan laba rugi, arus kas, rekonsiliasi penjualan, dan transparansi usaha."
            currentPeriod={period}
            onPeriodChange={(p) => setPeriod(p)}
            actionButton={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => window.print()}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
                >
                  <Printer className="w-3.5 h-3.5 text-slate-500" />
                  <span>Print View</span>
                </button>
                <button
                  onClick={() => generateMonthlyReportPDF(data)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#D9531E] hover:bg-orange-700 rounded-xl transition-all shadow-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh PDF Resmi</span>
                </button>
              </div>
            }
          />

          {/* Navigation Tabs */}
          <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
            <button
              onClick={() => setActiveTab('PL')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                activeTab === 'PL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Laporan Laba Rugi (P&L)
            </button>
            <button
              onClick={() => setActiveTab('CASHFLOW')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                activeTab === 'CASHFLOW'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Laporan Arus Kas
            </button>
            <button
              onClick={() => setActiveTab('CAPITAL')}
              className={`px-4 py-2 text-xs font-semibold rounded-xl transition-colors ${
                activeTab === 'CAPITAL'
                  ? 'bg-slate-900 text-white'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              Laporan Modal & Aset
            </button>
          </div>

          {/* Tab 1: P&L Statement */}
          {activeTab === 'PL' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-6">
              <div className="border-b border-slate-100 pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-bold text-slate-900">Laporan Laba / Rugi Usaha</h2>
                  <p className="text-xs text-slate-500">Periode: {data.monthName}</p>
                </div>
                <span className="px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                  Basis Kas Terealisasi
                </span>
              </div>

              {/* Revenue section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">A. Pendapatan Usaha</h3>
                <div className="space-y-2 text-xs sm:text-sm pl-3 border-l-2 border-orange-500">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-700">Penjualan Telur Layer Segar</span>
                    <span className="font-semibold text-slate-900 tabular-nums">Rp 7.862.500</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-700">Penjualan Pupuk Kotoran & Lainnya</span>
                    <span className="font-semibold text-slate-900 tabular-nums">Rp 587.500</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-slate-900 bg-slate-50 px-3 rounded-lg">
                    <span>Total Pendapatan Usaha (Revenue)</span>
                    <span className="tabular-nums text-orange-600">{formatIDR(data.totalSales)}</span>
                  </div>
                </div>
              </div>

              {/* Expenses section */}
              <div className="space-y-3">
                <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">B. Beban Operasional Usaha</h3>
                <div className="space-y-2 text-xs sm:text-sm pl-3 border-l-2 border-rose-500">
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-700">Beban Pakan Ayam Layer</span>
                    <span className="font-semibold text-slate-900 tabular-nums">Rp 4.160.000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-700">Beban Kesehatan, Vitamin & Sanitasi</span>
                    <span className="font-semibold text-slate-900 tabular-nums">Rp 430.000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-700">Beban Kemasan Tray & Transportasi</span>
                    <span className="font-semibold text-slate-900 tabular-nums">Rp 550.000</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-50">
                    <span className="text-slate-700">Beban Listrik, Air & Perawatan</span>
                    <span className="font-semibold text-slate-900 tabular-nums">Rp 180.000</span>
                  </div>
                  <div className="flex justify-between py-2 font-bold text-slate-900 bg-rose-50/70 px-3 rounded-lg text-rose-900">
                    <span>Total Beban Operasional (Expenses)</span>
                    <span className="tabular-nums text-rose-600">{formatIDR(data.totalExpenses)}</span>
                  </div>
                </div>
              </div>

              {/* Net Profit Summary */}
              <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 text-emerald-950 space-y-2">
                <div className="flex justify-between text-base font-extrabold">
                  <span>Laba Bersih Operasional:</span>
                  <span className="tabular-nums text-emerald-700">{formatIDR(data.netProfit)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-800 font-semibold pt-2 border-t border-emerald-200/80">
                  <span>Porsi Mitra 1 - Kurniawan (50%):</span>
                  <span className="tabular-nums">{formatIDR(data.profitSharePerPartner)}</span>
                </div>
                <div className="flex justify-between text-xs text-emerald-800 font-semibold">
                  <span>Porsi Mitra 2 - Santoso (50%):</span>
                  <span className="tabular-nums">{formatIDR(data.profitSharePerPartner)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 2: Cash Flow */}
          {activeTab === 'CASHFLOW' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Laporan Arus Kas (Cash Flow)</h2>
              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                  <span className="text-slate-600">Kas Masuk dari Penjualan:</span>
                  <span className="font-bold text-emerald-600 tabular-nums">+ {formatIDR(data.totalSales)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                  <span className="text-slate-600">Kas Keluar untuk Biaya Operasional:</span>
                  <span className="font-bold text-rose-600 tabular-nums">− {formatIDR(data.totalExpenses)}</span>
                </div>
                <div className="p-3 bg-slate-50 rounded-xl flex justify-between">
                  <span className="text-slate-600">Pengadaan Aset / Inventaris Tambahan:</span>
                  <span className="font-medium text-slate-600 tabular-nums">− Rp 0</span>
                </div>
                <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 flex justify-between font-bold text-emerald-900 text-base">
                  <span>Surplus Kas Periode Ini:</span>
                  <span className="tabular-nums text-emerald-700">{formatIDR(data.netProfit)}</span>
                </div>
              </div>
            </div>
          )}

          {/* Tab 3: Capital */}
          {activeTab === 'CAPITAL' && (
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-lg font-bold text-slate-900">Laporan Ekuitas & Modal Mitra</h2>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead>
                    <tr className="border-b border-slate-100 text-slate-400 font-semibold pb-2">
                      <th className="py-2">Tanggal</th>
                      <th className="py-2">Keterangan Aset</th>
                      <th className="py-2">Jumlah</th>
                      <th className="py-2 text-right">Nilai Modal</th>
                      <th className="py-2 text-center">Kepemilikan</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-50">
                    {data.capitalInvestments.map((inv) => (
                      <tr key={inv.id}>
                        <td className="py-2.5 text-slate-600">{formatDateID(inv.date)}</td>
                        <td className="py-2.5 font-bold text-slate-800">{inv.itemName}</td>
                        <td className="py-2.5 text-slate-600">{inv.quantity} {inv.unit}</td>
                        <td className="py-2.5 font-bold text-slate-900 text-right">{formatIDR(inv.amount)}</td>
                        <td className="py-2.5 text-center font-semibold text-purple-700">50% : 50%</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
