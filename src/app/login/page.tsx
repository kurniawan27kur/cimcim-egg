'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Lock, Mail, KeyRound, Loader2, ShieldCheck, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('kurniawan@cimcim.com');
  const [password, setPassword] = useState('password123');
  const [pin, setPin] = useState('123456');
  const [authMode, setAuthMode] = useState<'password' | 'pin'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e?: React.FormEvent, customPartnerId?: string) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload: any = customPartnerId
        ? { partnerId: customPartnerId, password: 'password123' }
        : authMode === 'password'
        ? { email, password }
        : { email, pin };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login gagal.');
      }

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4 sm:p-6">
      <div className="w-full max-w-md space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-orange-100 text-orange-600 shadow-sm border border-orange-200">
            <svg className="w-8 h-8 fill-current text-[#D9531E]" viewBox="0 0 24 24">
              <path d="M12 2C8.5 2 6 5.5 6 9.5c0 2.2.8 4.2 2.2 5.6C7.5 16.5 6 18 6 20h12c0-2-1.5-3.5-2.2-4.9 1.4-1.4 2.2-3.4 2.2-5.6C18 5.5 15.5 2 12 2zm0 2.5c2.5 0 4 2.5 4 5s-1.5 5-4 5-4-2.5-4-5 1.5-5 4-5z" />
            </svg>
          </div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">CimCim Egg</h1>
          <p className="text-xs text-slate-500 font-medium">
            Sistem Manajemen Ternak Ayam Petelur & Bagi Hasil
          </p>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-lg space-y-5">
          <div className="border-b border-slate-100 pb-3 flex items-center justify-between">
            <h2 className="text-base font-bold text-slate-900">Masuk Akun Mitra</h2>
            <div className="flex items-center gap-1 bg-slate-100 p-0.5 rounded-lg text-xs font-semibold">
              <button
                type="button"
                onClick={() => setAuthMode('password')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  authMode === 'password' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => setAuthMode('pin')}
                className={`px-2.5 py-1 rounded-md transition-colors ${
                  authMode === 'pin' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-500'
                }`}
              >
                PIN
              </button>
            </div>
          </div>

          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <form onSubmit={(e) => handleLogin(e)} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">Email Mitra *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="kurniawan@cimcim.com"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                />
              </div>
            </div>

            {authMode === 'password' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kata Sandi *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1">6-Digit PIN Otorisasi *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="123456"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl pl-9 pr-3 py-2.5 text-slate-900 font-mono tracking-widest text-center focus:outline-none focus:ring-2 focus:ring-orange-500/20"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 bg-[#D9531E] hover:bg-orange-700 text-white font-bold rounded-xl transition-all shadow-sm flex items-center justify-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-4 h-4 animate-spin" />}
              <span>Masuk Sekarang</span>
            </button>
          </form>

          {/* Quick Demo Access Switcher */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <p className="text-[11px] text-slate-400 font-semibold text-center uppercase tracking-wider">
              Akses Cepat Mitra (Demo)
            </p>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => {
                  setEmail('kurniawan@cimcim.com');
                  setPassword('password123');
                  handleLogin(undefined, 'partner-1');
                }}
                className="p-2.5 rounded-xl border border-orange-200 bg-orange-50/50 hover:bg-orange-100 text-left transition-colors"
              >
                <p className="font-bold text-slate-900 text-xs">Kurniawan</p>
                <p className="text-[10px] text-orange-700">Mitra A (50%)</p>
              </button>

              <button
                type="button"
                onClick={() => {
                  setEmail('santoso@cimcim.com');
                  setPassword('password123');
                  handleLogin(undefined, 'partner-2');
                }}
                className="p-2.5 rounded-xl border border-sky-200 bg-sky-50/50 hover:bg-sky-100 text-left transition-colors"
              >
                <p className="font-bold text-slate-900 text-xs">Santoso</p>
                <p className="text-[10px] text-sky-700">Mitra B (50%)</p>
              </button>
            </div>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Sesi Terenkripsi & Sesuai Aturan Kemitraan PRD</span>
        </div>
      </div>
    </div>
  );
}
