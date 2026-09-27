'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import AddExpenseModal from '@/components/modals/AddExpenseModal';
import { ExpenseItem, Partner, ExpenseCategory } from '@/types';
import { formatIDR, formatDateID, formatNumber } from '@/lib/utils';
import {
  Plus,
  Search,
  Download,
  Trash2,
  Receipt,
  TrendingDown,
  Layers,
  Loader2,
} from 'lucide-react';

export default function PengeluaranPage() {
  const [expenses, setExpenses] = useState<ExpenseItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('ALL');
  const [classFilter, setClassFilter] = useState('ALL');

  const fetchExpenses = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/expenses');
      const json = await res.json();
      if (json.success && json.data) {
        setExpenses(json.data);
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
    fetchExpenses();
    fetchCurrentUser();
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm('Apakah Anda yakin ingin menghapus transaksi pengeluaran ini?')) return;
    try {
      const res = await fetch(`/api/expenses?id=${id}`, { method: 'DELETE' });
      if (res.ok) fetchExpenses();
    } catch (err) {
      console.error(err);
    }
  };

  const exportCSV = () => {
    const headers = ['ID', 'Tanggal', 'Kategori', 'Uraian', 'Vendor', 'Kuantitas', 'Satuan', 'Harga Satuan', 'Total', 'Klasifikasi', 'Pembayar'];
    const rows = filteredExpenses.map((e) => [
      e.id,
      e.date,
      `"${e.category}"`,
      `"${e.itemName}"`,
      `"${e.vendor}"`,
      e.quantity,
      e.unit,
      e.unitPrice,
      e.totalAmount,
      e.assetClassification,
      e.payerPartnerId,
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `pengeluaran_cimcim_${new Date().toISOString().split('T')[0]}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredExpenses = expenses.filter((e) => {
    const matchesSearch =
      e.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.vendor.toLowerCase().includes(searchTerm.toLowerCase()) ||
      e.category.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = categoryFilter === 'ALL' || e.category === categoryFilter;
    const matchesClass = classFilter === 'ALL' || e.assetClassification === classFilter;
    return matchesSearch && matchesCategory && matchesClass;
  });

  const totalOperasional = filteredExpenses
    .filter((e) => e.assetClassification === 'OPERASIONAL')
    .reduce((sum, e) => sum + e.totalAmount, 0);

  const totalAset = filteredExpenses
    .filter((e) => e.assetClassification === 'ASET_MODAL')
    .reduce((sum, e) => sum + e.totalAmount, 0);

  const totalAll = filteredExpenses.reduce((sum, e) => sum + e.totalAmount, 0);

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
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Header
            title="Pengeluaran & Biaya"
            subtitle="Pencatatan biaya pakan, kesehatan ayam, operasional, dan inventaris."
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
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Pengeluaran</span>
                </button>
              </div>
            }
          />

          {/* Quick Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-rose-50 border border-rose-100 flex items-center justify-center text-rose-600">
                <TrendingDown className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Biaya Operasional Rutin</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatIDR(totalOperasional)}</h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Layers className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Pembelian Aset / Modal</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatIDR(totalAset)}</h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center text-slate-600">
                <Receipt className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Semua Pengeluaran</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatIDR(totalAll)}</h3>
              </div>
            </div>
          </div>

          {/* Table & Filter Card */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            {/* Search and Filters */}
            <div className="p-4 border-b border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-3 flex-wrap">
              <div className="relative w-full sm:w-80">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Cari uraian, vendor, kategori..."
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2 text-slate-800 focus:outline-none focus:ring-2 focus:ring-rose-500/20"
                />
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto flex-wrap">
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none"
                >
                  <option value="ALL">Semua Kategori</option>
                  <option value="Pakan">Pakan</option>
                  <option value="Kesehatan">Kesehatan</option>
                  <option value="Operasional">Operasional</option>
                  <option value="Peralatan">Peralatan</option>
                  <option value="Perawatan">Perawatan</option>
                  <option value="Kemasan">Kemasan</option>
                </select>

                <select
                  value={classFilter}
                  onChange={(e) => setClassFilter(e.target.value)}
                  className="text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-700 font-medium focus:outline-none"
                >
                  <option value="ALL">Semua Klasifikasi</option>
                  <option value="OPERASIONAL">Biaya Operasional</option>
                  <option value="ASET_MODAL">Aset / Modal</option>
                </select>
              </div>
            </div>

            {/* Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Nama Barang / Uraian</th>
                    <th className="py-3 px-4">Vendor</th>
                    <th className="py-3 px-4 text-center">Jumlah</th>
                    <th className="py-3 px-4 text-right">Harga Satuan</th>
                    <th className="py-3 px-4 text-right">Total</th>
                    <th className="py-3 px-4 text-center">Klasifikasi</th>
                    <th className="py-3 px-4 text-center">Pembayar</th>
                    <th className="py-3 px-4 text-right">Aksi</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {filteredExpenses.map((exp) => (
                    <tr key={exp.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">{formatDateID(exp.date)}</td>
                      <td className="py-3 px-4">
                        <span className={`inline-block px-2.5 py-0.5 rounded-md text-[11px] font-semibold border ${getCategoryBadge(exp.category)}`}>
                          {exp.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{exp.itemName}</td>
                      <td className="py-3 px-4 text-slate-600">{exp.vendor}</td>
                      <td className="py-3 px-4 text-center font-semibold text-slate-800 tabular-nums">
                        {formatNumber(exp.quantity)} {exp.unit}
                      </td>
                      <td className="py-3 px-4 text-right tabular-nums text-slate-600">{formatIDR(exp.unitPrice)}</td>
                      <td className="py-3 px-4 text-right tabular-nums font-bold text-slate-900">
                        {formatIDR(exp.totalAmount)}
                      </td>
                      <td className="py-3 px-4 text-center">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-semibold ${
                            exp.assetClassification === 'OPERASIONAL'
                              ? 'bg-slate-100 text-slate-700'
                              : 'bg-purple-50 text-purple-700 border border-purple-200'
                          }`}
                        >
                          {exp.assetClassification === 'OPERASIONAL' ? 'Operasional' : 'Aset/Modal'}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-center text-slate-500 font-medium">
                        {exp.payerPartnerId === 'partner-1' ? 'Kurniawan' : exp.payerPartnerId === 'partner-2' ? 'Santoso' : 'Kas Usaha'}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <button
                          onClick={() => handleDelete(exp.id)}
                          className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Hapus Pengeluaran"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}

                  {filteredExpenses.length === 0 && (
                    <tr>
                      <td colSpan={10} className="py-12 text-center text-slate-400">
                        {loading ? 'Memuat data pengeluaran...' : 'Tidak ada transaksi pengeluaran ditemukan.'}
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AddExpenseModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchExpenses}
      />
    </div>
  );
}
