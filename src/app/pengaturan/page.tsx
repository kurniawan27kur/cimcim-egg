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
  const [partners, setPartners] = useState<Partner[]>([]);
  const [loadingPartners, setLoadingPartners] = useState(false);
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

  const fetchPartners = async () => {
    try {
      setLoadingPartners(true);
      const res = await fetch('/api/partners');
      const json = await res.json();
      if (json.success && json.data) {
        setPartners(json.data);
      }
    } catch (err) {
      console.error('Failed to load partners:', err);
    } finally {
      setLoadingPartners(false);
    }
  };

  const checkSheetsStatus = async () => {
    try {
      setTestingSheets(true);
      const res = await fetch('/api/sheets/status');
      const json = await res.json();
      setSheetStatus(json);
      fetchPartners();
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
      fetchPartners();
    } catch (err: any) {
      setInitMessage('Gagal inisialisasi: ' + err.message);
    } finally {
      setInitializingTabs(false);
    }
  };

  useEffect(() => {
    fetchAuditLogs();
    fetchCurrentUser();
    fetchPartners();
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
          <div className="bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
            <div className="flex items-center justify-between flex-wrap gap-3">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                  <FileSpreadsheet className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-900">Integrasi Google Spreadsheet API</h2>
                  <p className="text-xs text-slate-500">
                    Sumber data cloud utama (Tersinkronisasi otomatis dengan Google Sheets)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2 flex-wrap">
                <button
                  onClick={checkSheetsStatus}
                  disabled={testingSheets}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-xl transition-colors flex items-center gap-1.5 cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${testingSheets ? 'animate-spin' : ''}`} />
                  <span>Cek Koneksi & Sync</span>
                </button>
                <button
                  onClick={initializeSheetTabs}
                  disabled={initializingTabs}
                  className="px-3.5 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
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
                        Mode Lokal Aktif. Hubungkan Google Spreadsheet Anda dengan mengisi kredensial pada konfigurasi sistem.
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
          </div>

          {/* Partner Accounts & Security */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
            {/* Mitra Info - Realtime from Sheet 'Mitra' */}
            <div className="lg:col-span-7 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <div className="flex items-center justify-between">
                <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-5 h-5 text-orange-600" />
                  <span>Akun Mitra Terdaftar (Data Sheet: Mitra)</span>
                </h2>
                <button
                  onClick={fetchPartners}
                  disabled={loadingPartners}
                  className="text-xs text-orange-600 hover:text-orange-700 font-semibold flex items-center gap-1 cursor-pointer"
                >
                  <RefreshCw className={`w-3 h-3 ${loadingPartners ? 'animate-spin' : ''}`} />
                  <span>Sync Mitra</span>
                </button>
              </div>

              <div className="space-y-3">
                {partners.map((partner, idx) => (
                  <div
                    key={partner.id || idx}
                    className="p-3.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-3 min-w-0">
                      <div
                        className="w-10 h-10 rounded-full flex items-center justify-center text-white font-bold text-sm shrink-0 shadow-xs"
                        style={{ backgroundColor: partner.avatarColor || (idx === 0 ? '#D9531E' : '#0284C7') }}
                      >
                        {partner.name?.charAt(0) || 'M'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <p className="font-bold text-slate-900">{partner.name}</p>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase">
                            {partner.role || (idx === 0 ? 'OWNER' : 'PARTNER')}
                          </span>
                          <span className="px-1.5 py-0.5 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                            {partner.sharePercent || 50}% Bagi Hasil
                          </span>
                        </div>
                        <p className="text-slate-500 truncate mt-0.5">{partner.email}</p>
                        {partner.phone && (
                          <p className="text-[11px] text-slate-400 mt-0.5">Telp: {partner.phone}</p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-2 self-start sm:self-center shrink-0 flex-wrap">
                      {partner.password && (
                        <div className="bg-white px-2.5 py-1 rounded-lg border border-slate-200 text-slate-700 font-mono text-[11px]">
                          Pass: <strong className="text-slate-900">{partner.password}</strong>
                        </div>
                      )}
                      <div className="bg-white px-2.5 py-1 rounded-lg border border-orange-200 text-orange-700 font-mono font-bold text-[11px]">
                        PIN: {partner.pin || '123456'}
                      </div>
                    </div>
                  </div>
                ))}

                {partners.length === 0 && !loadingPartners && (
                  <p className="text-xs text-slate-400 text-center py-4">Belum ada akun mitra yang terbaca dari sheet.</p>
                )}
              </div>
            </div>

            {/* Security Rules */}
            <div className="lg:col-span-5 bg-white rounded-2xl p-5 sm:p-6 border border-slate-200/80 shadow-2xs space-y-4">
              <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-600" />
                <span>Standar Keamanan & Kepatuhan PRD</span>
              </h2>

              <ul className="space-y-2.5 text-xs text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Autentikasi & PIN Approval tersinkronisasi dinamis dari tab Google Sheets <strong>Mitra</strong></span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Kredensial Google Service Account tersimpan aman di server tanpa bocor ke client</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Persetujuan digital dua mitra (Dual-Approval) untuk penguncian laporan bulanan</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span>Pemisahan modal awal dari pendapatan penjualan operasional peternakan</span>
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
