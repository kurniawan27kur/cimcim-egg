'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import AddSaleModal from '@/components/modals/AddSaleModal';
import { SaleItem, Partner } from '@/types';
import { formatIDR, formatDateID, formatNumber } from '@/lib/utils';
import {
  Plus,
  Search,
  Download,
  Trash2,
  ShoppingCart,
  TrendingUp,
  CreditCard,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export default function PenjualanPage() {
  const [sales, setSales] = useState<SaleItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');

  const fetchSales = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/sales');
      const json = await res.json();
      if (json.success && json.data) {
        setSales(json.data);
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
    fetchSales();
    fetchCurrentUser();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi penjualan ini?')) return;
    try {
      const res = await fetch(`/api/sales?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchSales();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Pelanggan', 'Produk', 'Kuantitas', 'Satuan', 'Harga Satuan', 'Diskon', 'Total', 'Status Bayar', 'Metode'];
    const rows = filteredSales.map((s) => [
      s.id,
      s.date,
      `"${s.customerName}"`,
      `"${s.productType}"`,
      s.quantity,
      s.unit,
      s.unitPrice,
      s.discount,
      s.totalAmount,
      s.paymentStatus,
      s.paymentMethod,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `penjualan_cimcim_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredSales = sales.filter((s) => {
    const matchesSearch =
      s.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.productType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || s.paymentStatus === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const totalOmzet = filteredSales.reduce((sum, s) => sum + s.totalAmount, 0);
  const totalEggs = filteredSales
    .filter((s) => s.unit === 'butir' || s.unit === 'tray')
    .reduce((sum, s) => sum + (s.unit === 'tray' ? s.quantity * 30 : s.quantity), 0);
  const totalUnpaid = filteredSales
    .filter((s) => s.paymentStatus === 'BELUM_BAYAR')
    .reduce((sum, s) => sum + s.totalAmount, 0);

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Header
            title="Penjualan Telur"
            subtitle="Pencatatan seluruh transaksi penjualan telur dan hasil usaha."
            actionButton={
              <div className="flex items-center gap-2">
                <button
                  onClick={exportCSV}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Ekspor CSV</span>
                </button>
                <button
                  onClick={() => setIsAddOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#D9531E] hover:bg-orange-700 rounded-xl transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Penjualan</span>
                </button>
              </div>
            }
          />

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Omzet Penjualan</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatIDR(totalOmzet)}</h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                <ShoppingCart className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Telur Terjual</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
                  {formatNumber(totalEggs)} <span className="text-xs font-normal text-slate-500">butir</span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <AlertCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Piutang / Belum Lunas</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatIDR(totalUnpaid)}</h3>
              </div>
            </div>
          </div>

          {/* Table & Filter Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari nama pelanggan, produk, ID..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="w-full sm:w-auto text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none"
                >
                  <option value="ALL">Semua Status Bayar</option>
                  <option value="LUNAS">Lunas</option>
                  <option value="BELUM_BAYAR">Belum Lunas (Piutang)</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Pelanggan</th>
                    <th className="py-3 px-4">Produk</th>
                    <th className="py-3 px-4 text-center">Kuantitas</th>
                    <th className="py-3 px-4 text-right">Harga Satuan</th>
                    <th className="py-3 px-4 text-right">Total Transaksi</th>
                    <th className="py-3 px-4 text-center">Status Bayar</th>
                    <th className="py-3 px-4 text-center">Metode</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredSales.map((sale) => (
                    <tr key={sale.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">{formatDateID(sale.date)}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{sale.customerName}</td>
                      <td className="py-3 px-4 text-slate-600">{sale.productType}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-800 tabular-nums">
                        {formatNumber(sale.quantity)} {sale.unit}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600">{formatIDR(sale.unitPrice)}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900">
                        {formatIDR(sale.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${
                            sale.paymentStatus === 'LUNAS'
                              ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                              : 'bg-amber-50 text-amber-700 border border-amber-200'
                          }`}
                        >
                          {sale.paymentStatus === 'LUNAS' ? 'Lunas' : 'Belum Lunas'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">
                        {sale.paymentMethod === 'TRANSFER_BANK' ? 'Transfer' : sale.paymentMethod}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(sale.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Penjualan"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredSales.length === 0 && (
                    <tr>
                      <td colSpan={9} className="py-12 text-center text-slate-400">
                        {loading ? 'Memuat transaksi...' : 'Tidak ada transaksi penjualan ditemukan.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AddSaleModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchSales}
      />
    </div>
  );
}
