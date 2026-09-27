'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import { AuditLog, Partner } from '@/types';
import { formatDateTimeID } from '@/lib/utils';
import {
  Settings,
  Database,
  Shield,
  FileSpreadsheet,
  CheckCircle2,
  AlertTriangle,
  RefreshCw,
  Users,
  Lock,
  Loader2,
  Terminal,
} from 'lucide-react';

export default function PengaturanPage() {
  const [logs, setLogs] = useState<AuditLog[]>([]);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);
  const [sheetStatus, setSheetStatus] = useState<any>(null);
  const [testingSheets, setTestingSheets] = useState(false);
  const [initializingTabs, setInitializingTabs] = useState(false);
  const [initMessage, setInitMessage] = useState('');

  const fetchAuditLogs = async () => {
    try {
      const res = await fetch('/api/audit-logs');
      const json = await res.json();
      if (json.success && json.data) setLogs(json.data);
    } catch {}
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

  const checkSheetsStatus = async () => {
    try {
      setTestingSheets(true);
      const res = await fetch('/api/sheets/status');
      const json = await res.json();
      setSheetStatus(json);
    } catch (err: any) {
      setSheetStatus({ connected: false, message: 'Gagal menghubungi server.' });
    } finally {
      setTestingSheets(false);
    }
  };

  const initializeSheetTabs = async () => {
    try {
      setInitializingTabs(true);
      setInitMessage('');
      const res = await fetch('/api/sheets/init', { method: 'POST' });
      const json = await res.json();
      setInitMessage(json.message);
      checkSheetsStatus();
    } catch (err: any) {
      setInitMessage('Gagal inisialisasi: ' + err.message);
    } finally {
      setInitializingTabs(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    fetchCurrentUser();
    checkSheetsStatus();
  }, []);

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Header
            title="Pengaturan & Integrasi"
            subtitle="Konfigurasi integrasi Google Sheets, profil mitra, keamanan, dan audit log."
          />

          {/* Google Sheets Integration Card */}
          <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Integrasi Google Spreadsheet API</h2>
                  <p className="text-xs text-slate-500">
                    Sumber data cloud utama sesuai spesifikasi PRD (Server-side API)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={checkSheetsStatus}
                  disabled={testingSheets}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingSheets ? 'animate-spin' : ''}`} />
                  <span>Cek Koneksi</span>
                </button>
                <button
                  onClick={initializeSheetTabs}
                  disabled={initializingTabs}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs"
                >
                  {initializingTabs && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
                  <span>Inisialisasi Tab & Skema Sheet</span>
                </button>
              </div>
            </div>

            {/* Connection Status Details */}
            {sheetStatus && (
              <div
                className={`p-4 rounded-xl border text-xs ${
                  sheetStatus.connected
                    ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                    : 'bg-amber-50/80 border-amber-200 text-amber-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {sheetStatus.connected ? (
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  )}
                  <div className="space-y-1">
                    <p className="font-bold">{sheetStatus.message}</p>
                    {sheetStatus.connected ? (
                      <p className="text-emerald-700">
                        Spreadsheet: <strong>{sheetStatus.title}</strong> | Tab Aktif: {sheetStatus.sheetTabs?.join(', ')}
                      </p>
                    ) : (
                      <p className="text-amber-800">
                        Mode Lokal/Mock Aktif (Transaksional Tetap Berfungsi Penuh). Untuk menyambungkan ke Google Spreadsheet live di Vercel, cukup tambahkan <code>GOOGLE_SERVICE_ACCOUNT_EMAIL</code>, <code>GOOGLE_PRIVATE_KEY</code>, dan <code>GOOGLE_SHEET_ID</code> pada Environment Variables.
                      </p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {initMessage && (
              <div className="p-3 bg-slate-900 text-white text-xs rounded-xl font-mono">
                {initMessage}
              </div>
            )}

            {/* Environment Variables Reference Guide */}
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-xs space-y-2">
              <p className="font-bold text-slate-800 flex items-center gap-1.5">
                <Terminal className="w-4 h-4 text-slate-600" />
                <span>Format Environment Variables Vercel / .env.local:</span>
              </p>
              <pre className="p-3 bg-slate-900 text-emerald-400 rounded-lg overflow-x-auto text-[11px] font-mono leading-relaxed">
{`GOOGLE_SERVICE_ACCOUNT_EMAIL=cimcim-sync@your-project.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\\n...\\n-----END PRIVATE KEY-----\\n"
GOOGLE_SHEET_ID=1A2B3C4D5E6F7G8H9I0J_your_spreadsheet_id`}
              </pre>
            </div>
          </div>

          {/* Partner Accounts & Security */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Mitra Info */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-orange-600" />
                <span>Akun Mitra Terdaftar (Skema 50:50)</span>
              </h2>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-orange-50/60 rounded-xl border border-orange-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Kurniawan (Owner / Mitra A)</p>
                    <p className="text-slate-500">kurniawan@cimcim.com</p>
                  </div>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-orange-200 text-orange-700 font-bold">
                    PIN: 123456
                  </span>
                </div>

                <div className="p-3 bg-sky-50/60 rounded-xl border border-sky-100 flex items-center justify-between">
                  <div>
                    <p className="font-bold text-slate-900">Santoso (Partner / Mitra B)</p>
                    <p className="text-slate-500">santoso@cimcim.com</p>
                  </div>
                  <span className="font-mono bg-white px-2 py-1 rounded border border-sky-200 text-sky-700 font-bold">
                    PIN: 654321
                  </span>
                </div>
              </div>
            </div>

            {/* Security Rules */}
            <div className="bg-white rounded-2xl p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span>Standar Keamanan & Kepatuhan PRD</span>
              </h2>

              <ul className="space-y-2 text-xs text-slate-600">
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Otorisasi Server-Side pada seluruh endpoint API</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Kredensial Google Sheets tersimpan aman di server</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Persetujuan digital dua mitra untuk penguncian laporan</span>
                </li>
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>Pemisahan modal awal dari pendapatan penjualan</span>
                </li>
              </ul>
            </div>
          </div>

          {/* Audit Logs Table */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden">
            <div className="p-4 border-b border-slate-100 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Shield className="w-4 h-4 text-slate-600" />
                <h2 className="text-base font-bold text-slate-900">Log Audit Aktivitas Sistem</h2>
              </div>
              <span className="text-xs text-slate-500">{logs.length} catatan aktivitas</span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs whitespace-nowrap">
                <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                  <tr>
                    <th className="py-3 px-4">Waktu (WIB)</th>
                    <th className="py-3 px-4">Aktor / Mitra</th>
                    <th className="py-3 px-4">Aksi</th>
                    <th className="py-3 px-4">Entitas</th>
                    <th className="py-3 px-4">Keterangan Aktivitas</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {logs.map((log) => (
                    <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                      <td className="py-3 px-4 font-medium text-slate-600">{formatDateTimeID(log.timestamp)}</td>
                      <td className="py-3 px-4 font-bold text-slate-900">{log.actorName}</td>
                      <td className="py-3 px-4 font-mono font-semibold text-orange-600">{log.action}</td>
                      <td className="py-3 px-4 text-slate-500">{log.entityType}</td>
                      <td className="py-3 px-4 text-slate-700 max-w-md truncate">{log.details}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
