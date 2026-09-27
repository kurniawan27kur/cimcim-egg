'use client';

import React, { useState } from 'react';
import { X, CheckCircle2, ShieldCheck, Loader2, Lock } from 'lucide-react';
import confetti from 'canvas-confetti';
import { MonthlyReport } from '@/types';
import { formatIDR } from '@/lib/utils';

interface ApproveReportModalProps {
  isOpen: boolean;
  report: MonthlyReport | null;
  onClose: () => void;
  onSuccess: () => void;
}

export default function ApproveReportModal({
  isOpen,
  report,
  onClose,
  onSuccess,
}: ApproveReportModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [partnerId, setPartnerId] = useState('partner-1');
  const [pin, setPin] = useState('');

  if (!isOpen || !report) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!pin) {
      setError('Masukkan 6-digit PIN otorisasi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/reports/approve', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          period: report.period,
          partnerId,
          pin,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal memberikan persetujuan');
      }

      // Fire celebratory confetti!
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.6 },
        });
      } catch {}

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'PIN tidak valid atau terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-emerald-50 to-teal-50">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Tandatangan & Persetujuan Laporan</h3>
              <p className="text-xs text-slate-500">Periode {report.monthName || report.period}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          {/* Current Approval Status Banner */}
          <div className="grid grid-cols-2 gap-3">
            <div
              className={`p-3 rounded-2xl border text-xs ${
                report.partner1Approved
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>Mitra 1 (Kurniawan)</span>
                {report.partner1Approved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    Menunggu
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {report.partner1Approved ? '✓ Telah Disetujui' : 'Belum disetujui'}
              </p>
            </div>

            <div
              className={`p-3 rounded-2xl border text-xs ${
                report.partner2Approved
                  ? 'bg-emerald-50/80 border-emerald-200 text-emerald-800'
                  : 'bg-slate-50 border-slate-200 text-slate-600'
              }`}
            >
              <div className="flex items-center justify-between font-semibold">
                <span>Mitra 2 (Santoso)</span>
                {report.partner2Approved ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                ) : (
                  <span className="text-[10px] text-amber-600 bg-amber-50 px-1.5 py-0.5 rounded">
                    Menunggu
                  </span>
                )}
              </div>
              <p className="mt-1 text-[11px] text-slate-500">
                {report.partner2Approved ? '✓ Telah Disetujui' : 'Belum disetujui'}
              </p>
            </div>
          </div>

          {/* Report Financial Summary */}
          <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200/70 text-xs space-y-1.5">
            <div className="flex justify-between text-slate-600">
              <span>Total Penjualan:</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatIDR(report.revenueTotal)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>Total Pengeluaran:</span>
              <span className="font-semibold text-slate-900 tabular-nums">{formatIDR(report.expenseTotal)}</span>
            </div>
            <div className="flex justify-between text-emerald-700 font-bold pt-1 border-t border-slate-200/60">
              <span>Laba Bersih yang Dibagikan:</span>
              <span className="tabular-nums">{formatIDR(report.distributableProfit)}</span>
            </div>
            <div className="flex justify-between text-orange-700 font-bold">
              <span>Porsi Masing-masing Mitra (50%):</span>
              <span className="tabular-nums">{formatIDR(report.partner1Share)}</span>
            </div>
          </div>

          {/* Partner & PIN selector */}
          <div className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                Bertindak Atas Nama Mitra *
              </label>
              <select
                value={partnerId}
                onChange={(e) => setPartnerId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="partner-1" disabled={report.partner1Approved}>
                  Kurniawan (Mitra 1 / Owner) {report.partner1Approved ? '(Sudah TTD)' : ''}
                </option>
                <option value="partner-2" disabled={report.partner2Approved}>
                  Santoso (Mitra 2 / Partner) {report.partner2Approved ? '(Sudah TTD)' : ''}
                </option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">
                PIN Otorisasi Digital Mitra (6 digit) *
              </label>
              <input
                type="password"
                maxLength={6}
                value={pin}
                onChange={(e) => setPin(e.target.value)}
                placeholder="Masukkan PIN (Default: 123456 / 654321)"
                required
                className="w-full text-center tracking-widest font-mono text-base bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-900 focus:outline-none focus:ring-2 focus:ring-emerald-500/20"
              />
              <p className="text-[10px] text-slate-400 mt-1 text-center">
                PIN Mitra 1 default: <span className="font-mono font-bold">123456</span> | PIN Mitra 2: <span className="font-mono font-bold">654321</span>
              </p>
            </div>
          </div>

          <div className="p-3 bg-amber-50/70 border border-amber-200/60 rounded-xl text-[11px] text-amber-800 flex items-start gap-2">
            <Lock className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
            <span>
              Sesuai aturan PRD, setelah kedua mitra menandatangani persetujuan, laporan akan <strong>dikunci permanen</strong> dan tidak dapat diubah tanpa jurnal koreksi.
            </span>
          </div>

          {/* Buttons */}
          <div className="flex items-center justify-end gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-xl transition-colors"
            >
              Batal
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Tandatangani & Setujui</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
