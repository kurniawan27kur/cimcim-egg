'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import RecordEggModal from '@/components/modals/RecordEggModal';
import { DailyProduction, Partner } from '@/types';
import { formatDateID, formatNumber, calculateLayingRate } from '@/lib/utils';
import {
  Activity,
  Plus,
  TrendingUp,
  HeartPulse,
  Scale,
  Loader2,
} from 'lucide-react';

export default function ProduksiPage() {
  const [productions, setProductions] = useState<DailyProduction[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);
  const [isRecordOpen, setIsRecordOpen] = useState(false);

  const fetchProductions = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/production');
      const json = await res.json();
      if (json.success && json.data) {
        setProductions(json.data);
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
    fetchProductions();
    fetchCurrentUser();
  }, []);

  const latest = productions[0] || {
    totalHens: 495,
    totalEggs: 98,
    eggsGood: 96,
    eggsBroken: 2,
    feedConsumptionKg: 55,
    mortalityCount: 0,
  };

  const currentLayingRate = calculateLayingRate(latest.totalEggs, latest.totalHens);

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Header
            title="Ayam & Produksi Telur"
            subtitle="Monitoring harian populasi ayam layer, panen telur utuh vs retak, dan pakan."
            actionButton={
              <button
                onClick={() => setIsRecordOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#D9531E] hover:bg-orange-700 rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Catat Panen Hari Ini</span>
              </button>
            }
          />

          {/* KPI Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600 text-lg">
                🐔
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Populasi Ayam Hidup</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
                  {formatNumber(latest.totalHens)} <span className="text-xs font-normal text-slate-500">ekor</span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <TrendingUp className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Hen-Day Laying Rate</p>
                <h3 className="text-xl font-bold text-emerald-700 tabular-nums mt-0.5">{currentLayingRate}%</h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center text-sky-600 text-lg">
                🥚
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Panen Terakhir</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
                  {formatNumber(latest.totalEggs)} <span className="text-xs font-normal text-slate-500">butir</span>
                </h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <Scale className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Konsumsi Pakan / Hari</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">
                  {latest.feedConsumptionKg} <span className="text-xs font-normal text-slate-500">kg</span>
                </h3>
              </div>
            </div>
          </div>

          {/* Production History Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900">Riwayat Panen & Pemeliharaan</h2>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Tanggal</th>
                    <th className="py-3 px-4 text-center">Populasi Ayam</th>
                    <th className="py-3 px-4 text-center">Telur Bagus</th>
                    <th className="py-3 px-4 text-center">Telur Retak</th>
                    <th className="py-3 px-4 text-center">Total Panen</th>
                    <th className="py-3 px-4 text-center">Laying Rate (%)</th>
                    <th className="py-3 px-4 text-center">Pakan (Kg)</th>
                    <th className="py-3 px-4 text-center">Mortalitas</th>
                    <th className="py-3 px-4">Dicatat Oleh</th>
                    <th className="py-3 px-4">Catatan</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {productions.map((p) => {
                    const rate = calculateLayingRate(p.totalEggs, p.totalHens);
                    return (
                      <tr key={p.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-3 px-4 font-medium text-slate-700">{formatDateID(p.date)}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 tabular-nums">{p.totalHens}</td>
                        <td className="py-3 px-4 text-center font-semibold text-emerald-700 tabular-nums">{p.eggsGood}</td>
                        <td className="py-3 px-4 text-center font-semibold text-rose-600 tabular-nums">{p.eggsBroken}</td>
                        <td className="py-3 px-4 text-center font-bold text-slate-900 tabular-nums">{p.totalEggs}</td>
                        <td className="py-3 px-4 text-center font-bold text-amber-700 tabular-nums">{rate}%</td>
                        <td className="py-3 px-4 text-center text-slate-700 tabular-nums">{p.feedConsumptionKg}</td>
                        <td className="py-3 px-4 text-center tabular-nums">
                          {p.mortalityCount > 0 ? (
                            <span className="text-rose-600 font-bold">{p.mortalityCount} ekor</span>
                          ) : (
                            <span className="text-slate-400">0</span>
                          )}
                        </td>
                        <td className="py-3 px-4 text-slate-600">{p.recordedBy}</td>
                        <td className="py-3 px-4 text-slate-500 max-w-[200px] truncate">{p.notes || '-'}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>

      <RecordEggModal
        isOpen={isRecordOpen}
        onClose={() => setIsRecordOpen(false)}
        onSuccess={fetchProductions}
      />
    </div>
  );
}
