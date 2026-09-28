'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import AddCapitalModal from '@/components/modals/AddCapitalModal';
import { CapitalContribution, Partner } from '@/types';
import { formatIDR, formatDateID, formatNumber } from '@/lib/utils';
import {
  Wallet,
  Plus,
  User,
  ShieldCheck,
  Building2,
  Coins,
  Loader2,
} from 'lucide-react';

export default function ModalPage() {
  const [capitals, setCapitals] = useState<CapitalContribution[]>([]);
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);
  const [isAddOpen, setIsAddOpen] = useState(false);

  const fetchCapitals = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/capital');
      const json = await res.json();
      if (json.success && json.data) {
        setCapitals(json.data);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPartners = async () => {
    try {
      const res = await fetch('/api/partners');
      const json = await res.json();
      if (json.success && json.data) {
        setPartners(json.data);
      }
    } catch (err) {
      console.error(err);
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
    fetchCapitals();
    fetchPartners();
    fetchCurrentUser();
  }, []);

  const totalCapital = capitals.reduce((sum, c) => sum + c.amount, 0);
  const initialCapital = capitals
    .filter((c) => c.type === 'MODAL_AWAL')
    .reduce((sum, c) => sum + c.amount, 0);

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Header
            title="Modal & Mitra"
            subtitle="Pencatatan modal awal usaha, kontribusi aset, dan kepemilikan bagi hasil mitra."
            actionButton={
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Modal / Aset</span>
              </button>
            }
          />

          {/* Partner Split Banner */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {partners.length > 0 ? (
              partners.map((partner, idx) => {
                const isFirst = idx === 0;
                const borderClass = isFirst ? 'border-orange-200/80' : 'border-sky-200/80';
                const bgBadgeClass = isFirst ? 'bg-orange-100 text-orange-800' : 'bg-sky-100 text-sky-800';
                const textColorClass = isFirst ? 'text-orange-600' : 'text-sky-600';
                const avatarBg = partner.avatarColor || (isFirst ? '#D9531E' : '#0284C7');

                return (
                  <div
                    key={partner.id || idx}
                    className={`bg-white rounded-2xl p-5 border ${borderClass} shadow-2xs flex items-center justify-between`}
                  >
                    <div className="flex items-center gap-3.5">
                      <div
                        className="w-12 h-12 rounded-2xl flex items-center justify-center text-white font-bold text-lg shadow-2xs"
                        style={{ backgroundColor: avatarBg }}
                      >
                        {partner.name ? partner.name.charAt(0).toUpperCase() : `M${idx + 1}`}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-slate-900">{partner.name}</h3>
                          <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${bgBadgeClass}`}>
                            {partner.role || (isFirst ? 'Owner (Mitra 1)' : 'Partner (Mitra 2)')}
                          </span>
                        </div>
                        <p className="text-xs text-slate-500 mt-0.5">{partner.email || 'Email belum terdaftar'}</p>
                        <p className={`text-xs font-semibold ${textColorClass} mt-2`}>
                          Porsi Kepemilikan & Bagi Hasil: {partner.sharePercent || 50}%
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              <div className="col-span-2 p-6 bg-white rounded-2xl border border-slate-200 text-xs text-slate-500 text-center">
                Memuat data mitra...
              </div>
            )}
          </div>

          {/* Capital Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600">
                <Coins className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Akumulasi Modal & Aset</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatIDR(totalCapital)}</h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <Building2 className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Modal Awal Pembentukan</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatIDR(initialCapital)}</h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Status Aturan PRD</p>
                <h3 className="text-sm font-bold text-emerald-700 mt-0.5">Terpisah dari Pendapatan Usaha</h3>
              </div>
            </div>
          </div>

          {/* Capital Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100">
              <h2 className="text-base font-bold text-slate-900">Rincian Pengadaan Modal & Aset Usaha</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4">Kategori</th>
                    <th className="py-3 px-4">Nama Barang / Aset</th>
                    <th className="py-3 px-4 text-center">Jumlah</th>
                    <th className="py-3 px-4 text-right">Nilai / Nominal</th>
                    <th className="py-3 px-4 text-center">Kontributor</th>
                    <th className="py-3 px-4 text-center">Metode</th>
                    <th className="py-3 px-4">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {capitals.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-700">{formatDateID(c.date)}</td>
                      <td className="py-3 px-4">
                        <span className="px-2.5 py-0.5 rounded-md text-[11px] font-semibold bg-purple-50 text-purple-700 border border-purple-200">
                          {c.category}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-slate-900">{c.itemName}</td>
                      <td className="py-3 px-4 text-center font-medium text-slate-700 tabular-nums">
                        {c.quantity ? `${formatNumber(c.quantity)} ${c.unit || ''}` : '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-slate-900 tabular-nums">
                        {formatIDR(c.amount)}
                      </td>
                      <td className="py-3 px-4 text-center text-slate-600 font-medium">{c.partnerName}</td>
                      <td className="py-3 px-4 text-center text-slate-500">{c.paymentMethod}</td>
                      <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{c.notes || '-'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <AddCapitalModal
        isOpen={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSuccess={fetchCapitals}
      />
    </div>
  );
}
