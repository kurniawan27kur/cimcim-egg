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
  const [logPage, setLogPage] = useState(1);
  const LOGS_PER_PAGE = 7;

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

  const totalPages = Math.max(1, Math.ceil(logs.length / LOGS_PER_PAGE));
  const currentLogs = logs.slice((logPage - 1) * LOGS_PER_PAGE, logPage * LOGS_PER_PAGE);

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-6">
        <MobileNav currentUser={currentUser} />

        <main className="p-3.5 sm:p-5 max-w-[1440px] w-full mx-auto space-y-3.5">
          <Header
            title="Pengaturan & Integrasi"
            subtitle="Konfigurasi integrasi Google Sheets, sinkronisasi mitra, dan audit aktivitas."
          />

          {/* Top Row: Google Sheets & Partner Accounts */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3.5">
            {/* Google Sheets Integration Card */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-3 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-700 shrink-0">
                      <FileSpreadsheet className="w-5 h-5" />
                    </div>
                    <div>
                      <h2 className="text-sm sm:text-base font-bold text-slate-900">Integrasi Google Sheets API</h2>
                      <p className="text-[11px] text-slate-500">
                        Sumber data cloud utama (Tersinkronisasi otomatis)
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1.5 flex-wrap">
                    <button
                      onClick={checkSheetsStatus}
                      disabled={testingSheets}
                      className="px-2.5 py-1 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
                    >
                      <RefreshCw className={`w-3 h-3 ${testingSheets ? 'animate-spin' : ''}`} />
                      <span>Cek & Sync</span>
                    </button>
                    <button
                      onClick={initializeSheetTabs}
                      disabled={initializingTabs}
                      className="px-3 py-1 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-700 rounded-lg transition-colors flex items-center gap-1 shadow-2xs cursor-pointer"
                    >
                      {initializingTabs && <Loader2 className="w-3 h-3 animate-spin" />}
                      <span>Inisialisasi Tab</span>
                    </button>
                  </div>
                </div>

                {/* Connection Status Details */}
                {sheetStatus && (
                  <div
                    className={`p-3 rounded-xl border text-xs ${
                      sheetStatus.connected
                        ? 'bg-emerald-50/80 border-emerald-200 text-emerald-900'
                        : 'bg-amber-50/80 border-amber-200 text-amber-900'
                    }`}
                  >
                    <div className="flex items-start gap-2">
                      {sheetStatus.connected ? (
                        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                      ) : (
                        <AlertTriangle className="w-3.5 h-3.5 text-amber-600 shrink-0 mt-0.5" />
                      )}
                      <div className="space-y-0.5 text-[11px]">
                        <p className="font-bold">{sheetStatus.message}</p>
                        {sheetStatus.connected ? (
                          <p className="text-emerald-700">
                            Spreadsheet: <strong>{sheetStatus.title}</strong> | Tab: {sheetStatus.sheetTabs?.join(', ')}
                          </p>
                        ) : (
                          <p className="text-amber-800">
                            Mode Lokal Aktif. Hubungkan Google Spreadsheet Anda pada konfigurasi sistem.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {initMessage && (
                  <div className="p-2.5 bg-slate-900 text-white text-[11px] rounded-lg font-mono">
                    {initMessage}
                  </div>
                )}
              </div>
            </div>

            {/* Mitra Info - Realtime from Sheet 'Mitra' */}
            <div className="lg:col-span-6 bg-white rounded-2xl p-4 sm:p-5 border border-slate-200/80 shadow-2xs space-y-2.5 flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <h2 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-2">
                  <Users className="w-4 h-4 text-orange-600" />
                  <span>Akun Mitra Terdaftar (Tab: Mitra)</span>
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

              <div className="space-y-2">
                {partners.map((partner, idx) => (
                  <div
                    key={partner.id || idx}
                    className="p-2.5 rounded-xl border border-slate-200/80 bg-slate-50/60 hover:bg-slate-50 transition-colors flex items-center justify-between gap-2 text-xs"
                  >
                    <div className="flex items-center gap-2.5 min-w-0">
                      <div
                        className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs shrink-0 shadow-xs"
                        style={{ backgroundColor: partner.avatarColor || (idx === 0 ? '#D9531E' : '#0284C7') }}
                      >
                        {partner.name?.charAt(0) || 'M'}
                      </div>
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-slate-900 text-xs">{partner.name}</p>
                          <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-100 text-orange-800 border border-orange-200 uppercase">
                            {partner.role || (idx === 0 ? 'OWNER' : 'PARTNER')}
                          </span>
                          <span className="px-1 py-0.2 rounded text-[10px] font-semibold bg-slate-200 text-slate-700">
                            {partner.sharePercent || 50}%
                          </span>
                        </div>
                        <p className="text-slate-500 truncate text-[11px]">{partner.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0 flex-wrap">
                      {partner.password && (
                        <div className="bg-white px-2 py-0.5 rounded border border-slate-200 text-slate-700 font-mono text-[10px]">
                          Pass: <strong className="text-slate-900">{partner.password}</strong>
                        </div>
                      )}
                      <div className="bg-white px-2 py-0.5 rounded border border-orange-200 text-orange-700 font-mono font-bold text-[10px]">
                        PIN: {partner.pin || '123456'}
                      </div>
                    </div>
                  </div>
                ))}

                {partners.length === 0 && !loadingPartners && (
                  <p className="text-xs text-slate-400 text-center py-2">Belum ada akun mitra yang terbaca dari sheet.</p>
                )}
              </div>
            </div>
          </div>

          {/* Audit Logs Table with Max 7 rows & 3-digit Pagination */}
          <div className="bg-white rounded-2xl border border-slate-200/80 shadow-2xs overflow-hidden flex flex-col justify-between">
            <div>
              <div className="p-3 sm:p-4 border-b border-slate-100 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Shield className="w-4 h-4 text-slate-600" />
                  <h2 className="text-sm sm:text-base font-bold text-slate-900">Log Audit Aktivitas Sistem</h2>
                </div>
                <span className="text-xs text-slate-500 font-medium">{logs.length} catatan total</span>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs whitespace-nowrap">
                  <thead className="bg-slate-50 text-slate-500 uppercase tracking-wider font-semibold border-b border-slate-100">
                    <tr>
                      <th className="py-2.5 px-3.5">Waktu (WIB)</th>
                      <th className="py-2.5 px-3.5">Aktor / Mitra</th>
                      <th className="py-2.5 px-3.5">Aksi</th>
                      <th className="py-2.5 px-3.5">Entitas</th>
                      <th className="py-2.5 px-3.5">Keterangan Aktivitas</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {currentLogs.map((log) => (
                      <tr key={log.id} className="hover:bg-slate-50/70 transition-colors">
                        <td className="py-2 px-3.5 font-medium text-slate-600">{formatDateTimeID(log.timestamp)}</td>
                        <td className="py-2 px-3.5 font-bold text-slate-900">{log.actorName}</td>
                        <td className="py-2 px-3.5 font-mono font-semibold text-orange-600">{log.action}</td>
                        <td className="py-2 px-3.5 text-slate-500">{log.entityType}</td>
                        <td className="py-2 px-3.5 text-slate-700 max-w-md truncate">{log.details}</td>
                      </tr>
                    ))}

                    {currentLogs.length === 0 && (
                      <tr>
                        <td colSpan={5} className="py-6 text-center text-slate-400">
                          Belum ada aktivitas tercatat.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Pagination Footer with 3-digit page numbers */}
            <div className="p-3 border-t border-slate-100 flex items-center justify-between flex-wrap gap-2 text-xs bg-slate-50/50">
              <span className="text-slate-500 text-[11px]">
                Menampilkan {(logPage - 1) * LOGS_PER_PAGE + (currentLogs.length ? 1 : 0)}–{(logPage - 1) * LOGS_PER_PAGE + currentLogs.length} dari {logs.length} data
              </span>

              <div className="flex items-center gap-1.5">
                {/* Previous Button */}
                <button
                  onClick={() => setLogPage((p) => Math.max(1, p - 1))}
                  disabled={logPage === 1}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  &lt;
                </button>

                {/* 3-Digit Page Numbers */}
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((pageNum) => (
                  <button
                    key={pageNum}
                    onClick={() => setLogPage(pageNum)}
                    className={`px-2.5 py-1 rounded-lg text-xs font-mono font-bold transition-all ${
                      logPage === pageNum
                        ? 'bg-[#D9531E] text-white shadow-xs'
                        : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-100'
                    }`}
                  >
                    {String(pageNum).padStart(3, '0')}
                  </button>
                ))}

                {/* Next Button */}
                <button
                  onClick={() => setLogPage((p) => Math.min(totalPages, p + 1))}
                  disabled={logPage === totalPages}
                  className="px-2.5 py-1 rounded-lg border border-slate-200 bg-white font-bold text-slate-700 hover:bg-slate-100 disabled:opacity-30 disabled:pointer-events-none transition-colors"
                >
                  &gt;
                </button>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
