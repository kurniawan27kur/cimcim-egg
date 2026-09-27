'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import ApproveReportModal from '@/components/modals/ApproveReportModal';
import { MonthlyReport, DashboardSummary, Partner } from '@/types';
import { formatIDR, formatDateTimeID } from '@/lib/utils';
import { generateMonthlyReportPDF } from '@/lib/pdfExport';
import {
  Scale,
  ShieldCheck,
  Lock,
  Unlock,
  CheckCircle2,
  AlertCircle,
  Download,
  Calendar,
  UserCheck,
  Loader2,
} from 'lucide-react';

export default function BagiHasilPage() {
  const [period, setPeriod] = useState('2026-09');
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

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

  const report = data.currentReport;
  const isFullyLocked = report.status === 'LOCKED';

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Header
            title="Bagi Hasil & Penutupan Bulanan"
            subtitle="Kalkulasi laba bersih 50:50, penandatanganan digital dua mitra, dan penguncian laporan."
            currentPeriod={period}
            onPeriodChange={(p) => setPeriod(p)}
            actionButton={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateMonthlyReportPDF(data)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>Cetak PDF Resmi</span>
                </button>

                {!isFullyLocked && (
                  <button
                    onClick={() => setIsApproveOpen(true)}
                    className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-xs"
                  >
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>Tandatangani Persetujuan</span>
                  </button>
                )}
              </div>
            }
          />

          {/* Status Banner */}
          <div
            className={`p-4 sm:p-5 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
              isFullyLocked
                ? 'bg-emerald-50/90 border-emerald-200 text-emerald-900'
                : report.partner1Approved || report.partner2Approved
                ? 'bg-amber-50/90 border-amber-200 text-amber-900'
                : 'bg-slate-100 border-slate-200 text-slate-800'
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`w-10 h-10 rounded-xl flex items-center justify-center text-white ${
                  isFullyLocked ? 'bg-emerald-600' : 'bg-amber-600'
                }`}
              >
                {isFullyLocked ? <Lock className="w-5 h-5" /> : <Unlock className="w-5 h-5" />}
              </div>
              <div>
                <h3 className="font-bold text-sm sm:text-base">
                  Status Laporan: {isFullyLocked ? 'DIKUNCI (LOCKED)' : 'DRAFT PENUTUPAN BULAN'}
                </h3>
                <p className="text-xs opacity-80 mt-0.5">
                  {isFullyLocked
                    ? `Laporan periode ${data.monthName} telah disetujui penuh oleh kedua mitra pada ${formatDateTimeID(
                        report.lockedAt
                      )}.`
                    : 'Menunggu persetujuan digital dari kedua mitra sebelum laporan dikunci permanen.'}
                </p>
              </div>
            </div>

            {isFullyLocked ? (
              <span className="px-3 py-1 rounded-full text-xs font-bold bg-emerald-600 text-white shadow-xs">
                Sah & Terkunci
              </span>
            ) : (
              <button
                onClick={() => setIsApproveOpen(true)}
                className="px-3.5 py-1.5 rounded-xl text-xs font-bold bg-amber-600 text-white hover:bg-amber-700 transition-colors shadow-xs"
              >
                Tandatangani Sekarang
              </button>
            )}
          </div>

          {/* Formula Breakdown Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Scale className="w-5 h-5 text-orange-600" />
              <span>Rumus Perhitungan Laba Bersih & Bagi Hasil</span>
            </h2>

            <div className="space-y-2 text-xs sm:text-sm">
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-600 font-medium">1. Pendapatan Usaha Terealisasi (Total Penjualan):</span>
                <span className="font-bold text-slate-900 tabular-nums">{formatIDR(report.revenueTotal)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-rose-50/50 border border-rose-100">
                <span className="text-rose-700 font-medium">2. Dikurangi: Biaya Operasional yang Disepakati:</span>
                <span className="font-bold text-rose-700 tabular-nums">− {formatIDR(report.expenseTotal)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-700 font-bold">3. Pendapatan Bersih Operasional:</span>
                <span className="font-bold text-slate-900 tabular-nums">{formatIDR(report.netOperatingProfit)}</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-xl bg-slate-50 border border-slate-100">
                <span className="text-slate-500 font-medium">4. Cadangan Kas / Penahanan (Jika Ada):</span>
                <span className="font-medium text-slate-600 tabular-nums">− {formatIDR(report.reservesAmount)}</span>
              </div>
              <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-950 font-bold text-sm sm:text-base">
                <span>5. Laba Bersih yang Dapat Dibagikan (Distributable Profit):</span>
                <span className="tabular-nums text-emerald-700">{formatIDR(report.distributableProfit)}</span>
              </div>
            </div>
          </div>

          {/* Dual Partner Distribution Cards & Signatures */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mitra 1 Signature & Card */}
            <div className="bg-white rounded-2xl p-6 border border-orange-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-orange-100 flex items-center justify-center text-[#D9531E] font-bold">
                    K
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Partner 1 (Kurniawan)</h3>
                    <p className="text-xs text-slate-500">Porsi 50% dari Laba Bersih</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-orange-100 text-orange-800">50%</span>
              </div>

              <div className="p-4 bg-orange-50/70 rounded-xl border border-orange-100">
                <span className="text-xs font-medium text-slate-600">Nominal Pembagian:</span>
                <h4 className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
                  {formatIDR(report.partner1Share)}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-2">Tandatangan Digital Mitra 1:</p>
                {report.partner1Approved ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Disetujui secara digital oleh Kurniawan</p>
                      <p className="text-[10px] text-emerald-600 opacity-90">{formatDateTimeID(report.partner1ApprovedAt)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-500">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Menunggu otorisasi & tanda tangan digital Mitra 1</span>
                  </div>
                )}
              </div>
            </div>

            {/* Mitra 2 Signature & Card */}
            <div className="bg-white rounded-2xl p-6 border border-sky-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-sky-100 flex items-center justify-center text-sky-600 font-bold">
                    S
                  </div>
                  <div>
                    <h3 className="font-bold text-base text-slate-900">Partner 2 (Santoso)</h3>
                    <p className="text-xs text-slate-500">Porsi 50% dari Laba Bersih</p>
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-sky-100 text-sky-800">50%</span>
              </div>

              <div className="p-4 bg-sky-50/70 rounded-xl border border-sky-100">
                <span className="text-xs font-medium text-slate-600">Nominal Pembagian:</span>
                <h4 className="text-2xl font-extrabold text-slate-900 tabular-nums mt-1">
                  {formatIDR(report.partner2Share)}
                </h4>
              </div>

              <div className="pt-2 border-t border-slate-100">
                <p className="text-xs font-semibold text-slate-600 mb-2">Tandatangan Digital Mitra 2:</p>
                {report.partner2Approved ? (
                  <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl flex items-center gap-2.5 text-xs text-emerald-800">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <div>
                      <p className="font-bold">Disetujui secara digital oleh Santoso</p>
                      <p className="text-[10px] text-emerald-600 opacity-90">{formatDateTimeID(report.partner2ApprovedAt)}</p>
                    </div>
                  </div>
                ) : (
                  <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex items-center gap-2.5 text-xs text-slate-500">
                    <AlertCircle className="w-4 h-4 text-amber-500 shrink-0" />
                    <span>Menunggu otorisasi & tanda tangan digital Mitra 2</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>

      <ApproveReportModal
        isOpen={isApproveOpen}
        report={report}
        onClose={() => setIsApproveOpen(false)}
        onSuccess={() => fetchReportData(period)}
      />
    </div>
  );
}
