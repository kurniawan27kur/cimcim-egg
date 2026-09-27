'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Lock, Mail, KeyRound, Loader2, ShieldCheck, Eye, EyeOff, Sparkles } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [pin, setPin] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [authMode, setAuthMode] = useState<'password' | 'pin'>('password');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setError('Harap masukkan alamat email.');
      return;
    }

    if (authMode === 'password' && !password) {
      setError('Harap masukkan kata sandi.');
      return;
    }

    if (authMode === 'pin' && !pin) {
      setError('Harap masukkan 6-digit PIN otorisasi.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const payload = authMode === 'password'
        ? { email: email.trim(), password }
        : { email: email.trim(), pin: pin.trim() };

      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Login gagal. Periksa kembali email dan kata sandi Anda.');
      }

      // Mark current browser tab as authenticated session
      try {
        sessionStorage.setItem('cimcim_tab_active', '1');
      } catch {}

      router.push('/');
      router.refresh();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan sistem.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] flex flex-col justify-center items-center p-4 sm:p-6 selection:bg-orange-100 selection:text-orange-900">
      <div className="w-full max-w-[420px] space-y-6">
        
        {/* Mascot Header */}
        <div className="flex flex-col items-center text-center">
          <div className="relative group">
            {/* Ambient Glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-amber-400/30 to-orange-500/30 rounded-full blur-lg opacity-70 group-hover:opacity-100 transition duration-500" />
            
            {/* Mascot Avatar */}
            <div className="relative w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden bg-gradient-to-b from-amber-50 to-orange-100/60 p-1 border-2 border-orange-200/80 shadow-md flex items-center justify-center">
              <Image
                src="/images/mascot.jpg"
                alt="CimCim Farm Mascot"
                width={120}
                height={120}
                className="w-full h-full object-cover rounded-full hover:scale-105 transition-transform duration-300"
                priority
              />
            </div>

            <div className="absolute -bottom-1 -right-1 bg-white p-1 rounded-full shadow-xs border border-orange-100 text-xs">
              🌾
            </div>
          </div>

          {/* Stylized Brand Name */}
          <div className="mt-3.5 flex flex-col items-center">
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight bg-gradient-to-r from-[#D9531E] via-amber-600 to-orange-700 bg-clip-text text-transparent drop-shadow-xs">
              CimCim Farm
            </h1>
            <div className="w-8 h-1 bg-gradient-to-r from-[#D9531E] to-amber-400 rounded-full mt-1 opacity-80" />
          </div>
        </div>

        {/* Login Card */}
        <div className="bg-white rounded-3xl p-6 sm:p-8 border border-slate-200/80 shadow-xl shadow-slate-200/40 space-y-5">
          
          {/* Header & Auth Mode Tabs */}
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div>
              <h2 className="text-sm font-bold text-slate-900">Masuk Akun Mitra</h2>
              <p className="text-[11px] text-slate-400">Silakan otentikasi untuk melanjutkan</p>
            </div>

            <div className="flex items-center bg-slate-100/90 p-1 rounded-xl text-xs font-semibold">
              <button
                type="button"
                onClick={() => {
                  setAuthMode('password');
                  setError('');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  authMode === 'password'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                Password
              </button>
              <button
                type="button"
                onClick={() => {
                  setAuthMode('pin');
                  setError('');
                }}
                className={`px-3 py-1.5 rounded-lg transition-all ${
                  authMode === 'pin'
                    ? 'bg-white text-slate-900 shadow-2xs font-bold'
                    : 'text-slate-500 hover:text-slate-800'
                }`}
              >
                PIN
              </button>
            </div>
          </div>

          {/* Error Alert */}
          {error && (
            <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs rounded-2xl flex items-start gap-2.5 animate-in fade-in duration-200">
              <div className="w-1.5 h-1.5 rounded-full bg-rose-600 mt-1.5 shrink-0" />
              <span className="leading-relaxed">{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1.5">Email Terdaftar *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@email.com"
                  className="w-full bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-medium"
                />
              </div>
            </div>

            {authMode === 'password' ? (
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">Kata Sandi *</label>
                <div className="relative">
                  <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Masukkan kata sandi..."
                    className="w-full bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-10 py-2.5 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-medium"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1 rounded-md"
                    title={showPassword ? 'Sembunyikan' : 'Tampilkan'}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>
            ) : (
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">6-Digit PIN Otorisasi *</label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    maxLength={6}
                    required
                    value={pin}
                    onChange={(e) => setPin(e.target.value)}
                    placeholder="••••••"
                    className="w-full bg-slate-50/70 hover:bg-slate-50 border border-slate-200 rounded-xl pl-10 pr-3.5 py-2.5 text-slate-900 placeholder:text-slate-300 font-mono tracking-widest text-center text-sm focus:outline-none focus:ring-2 focus:ring-orange-500/20 focus:border-orange-500 focus:bg-white transition-all font-bold"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 bg-[#D9531E] hover:bg-orange-700 active:scale-[0.99] text-white font-bold rounded-xl transition-all shadow-md shadow-orange-600/20 flex items-center justify-center gap-2 disabled:opacity-50 mt-2 cursor-pointer"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Memverifikasi Akun...</span>
                </>
              ) : (
                <span>Masuk ke Dashboard</span>
              )}
            </button>
          </form>

          {/* Info note */}
          <div className="pt-3 border-t border-slate-100 text-center">
            <p className="text-[11px] text-slate-400">
              Akun dikelola terpusat melalui lembar kerja Google Sheets <span className="font-semibold text-slate-600">Mitra</span>.
            </p>
          </div>
        </div>

        {/* Security badge footer */}
        <div className="flex flex-col items-center justify-center gap-1 text-[11px] text-slate-400">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
            <span>Sesi Terenkripsi Aman & Otomatis Tersinkron</span>
          </div>
          <p>© 2026 CimCim Farm. All rights reserved.</p>
        </div>

      </div>
    </div>
  );
}
