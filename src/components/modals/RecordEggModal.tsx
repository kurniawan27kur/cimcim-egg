'use client';

import React, { useState } from 'react';
import { X, Egg, Loader2 } from 'lucide-react';
import { formatNumber } from '@/lib/utils';

interface RecordEggModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function RecordEggModal({ isOpen, onClose, onSuccess }: RecordEggModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [totalHens, setTotalHens] = useState<number>(0);
  const [eggsGood, setEggsGood] = useState<number>(0);
  const [eggsBroken, setEggsBroken] = useState<number>(0);
  const [feedConsumptionKg, setFeedConsumptionKg] = useState<number>(0);
  const [mortalityCount, setMortalityCount] = useState<number>(0);
  const [notes, setNotes] = useState('');

  if (!isOpen) return null;

  const totalEggs = Number(eggsGood) + Number(eggsBroken);
  const layingRate = totalHens > 0 ? Math.round((totalEggs / totalHens) * 1000) / 10 : 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/production', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          totalHens,
          eggsGood,
          eggsBroken,
          feedConsumptionKg,
          mortalityCount,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan data produksi telur');
      }

      onSuccess();
      onClose();
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in duration-150">
      <div className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl border border-slate-100 animate-in zoom-in-95 duration-150">
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-amber-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
              <span className="text-lg">🥚</span>
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Catat Panen Telur Harian</h3>
              <p className="text-xs text-slate-500">Monitoring produksi dan kesehatan ternak</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal Panen *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Populasi Ayam Hidup *</label>
              <input
                type="number"
                min="1"
                value={totalHens || ''}
                onChange={(e) => setTotalHens(e.target.value === '' ? 0 : Number(e.target.value))}
                required
                placeholder="0"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telur Utuh / Bagus (butir) *</label>
              <input
                type="number"
                min="0"
                value={eggsGood || ''}
                onChange={(e) => setEggsGood(e.target.value === '' ? 0 : Number(e.target.value))}
                required
                placeholder="0"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Telur Retak / Rusak (butir)</label>
              <input
                type="number"
                min="0"
                value={eggsBroken || ''}
                onChange={(e) => setEggsBroken(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="0"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pakan Habis (Kg)</label>
              <input
                type="number"
                min="0"
                step="0.5"
                value={feedConsumptionKg || ''}
                onChange={(e) => setFeedConsumptionKg(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="0"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kematian Ayam (ekor)</label>
              <input
                type="number"
                min="0"
                value={mortalityCount || ''}
                onChange={(e) => setMortalityCount(e.target.value === '' ? 0 : Number(e.target.value))}
                placeholder="0"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Kondisi cuaca, nafsu makan, perlakuan vitamin..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
            />
          </div>

          {/* Quick Metrics Summary */}
          <div className="p-3.5 bg-amber-50/70 rounded-2xl border border-amber-200/70 grid grid-cols-2 gap-3">
            <div>
              <span className="text-[11px] font-medium text-slate-500">Total Telur Dipanen:</span>
              <p className="text-base font-bold text-slate-900 tabular-nums">{formatNumber(totalEggs)} butir</p>
            </div>
            <div>
              <span className="text-[11px] font-medium text-slate-500">Hen-Day Laying Rate:</span>
              <p className="text-base font-bold text-amber-700 tabular-nums">{layingRate}%</p>
            </div>
          </div>

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
              className="px-5 py-2.5 text-xs font-semibold text-white bg-amber-600 hover:bg-amber-700 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Produksi</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
