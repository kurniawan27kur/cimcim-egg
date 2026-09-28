'use client';

import React, { useState, useEffect } from 'react';
import { X, Receipt, Loader2 } from 'lucide-react';
import { formatIDR } from '@/lib/utils';
import { ExpenseCategory, AssetClassification, Partner } from '@/types';

interface AddExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export default function AddExpenseModal({ isOpen, onClose, onSuccess }: AddExpenseModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [partners, setPartners] = useState<Partner[]>([]);

  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [category, setCategory] = useState<ExpenseCategory>('Pakan');
  const [itemName, setItemName] = useState('');
  const [vendor, setVendor] = useState('');
  const [quantity, setQuantity] = useState<number>(1);
  const [unit, setUnit] = useState('item');
  const [unitPrice, setUnitPrice] = useState<number>(0);
  const [assetClassification, setAssetClassification] = useState<AssetClassification>('OPERASIONAL');
  const [payerPartnerId, setPayerPartnerId] = useState('partner-1');
  const [paymentMethod, setPaymentMethod] = useState('TRANSFER_BANK');
  const [notes, setNotes] = useState('');

  useEffect(() => {
    if (isOpen) {
      fetch('/api/partners')
        .then((res) => res.json())
        .then((json) => {
          if (json.success && json.data && json.data.length > 0) {
            setPartners(json.data);
            setPayerPartnerId(json.data[0].id);
          }
        })
        .catch(() => {});
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const totalAmount = quantity * unitPrice;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!itemName || !unitPrice || !date) {
      setError('Harap lengkapi tanggal, uraian barang, dan nominal.');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/expenses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          date,
          category,
          itemName,
          vendor,
          quantity,
          unit,
          unitPrice,
          totalAmount,
          assetClassification,
          payerPartnerId,
          paymentMethod,
          notes,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || 'Gagal menyimpan pengeluaran');
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
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-gradient-to-r from-rose-50 to-white">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-rose-100 flex items-center justify-center text-rose-600">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">Catat Pengeluaran</h3>
              <p className="text-xs text-slate-500">Pencatatan biaya operasional atau inventaris</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[80vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs rounded-xl">
              {error}
            </div>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Tanggal *</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Kategori *</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as ExpenseCategory)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="Pakan">Pakan Ayam</option>
                <option value="Kesehatan">Kesehatan & Vitamin</option>
                <option value="Operasional">Operasional Usaha</option>
                <option value="Peralatan">Peralatan</option>
                <option value="Perawatan">Perawatan Kandang</option>
                <option value="Kemasan">Kemasan / Tray</option>
                <option value="Listrik & Air">Listrik & Air</option>
                <option value="Tenaga Kerja">Tenaga Kerja</option>
                <option value="Lain-lain">Lain-lain</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Nama Barang / Uraian *</label>
              <input
                type="text"
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder="Contoh: Pakan Layer 50kg"
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Pemasok / Vendor</label>
              <input
                type="text"
                value={vendor}
                onChange={(e) => setVendor(e.target.value)}
                placeholder="Contoh: Agen Pakan Sumber Rejeki"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Jumlah</label>
              <input
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                required
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Satuan</label>
              <input
                type="text"
                value={unit}
                onChange={(e) => setUnit(e.target.value)}
                placeholder="karung/btl/bln"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Harga Satuan *</label>
              <input
                type="number"
                min="0"
                step="1000"
                value={unitPrice || ''}
                onChange={(e) => setUnitPrice(e.target.value === '' ? 0 : Number(e.target.value))}
                required
                placeholder="0"
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              />
            </div>
          </div>

          {/* Asset Classification according to PRD */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/70 space-y-2">
            <label className="block text-xs font-semibold text-slate-700">Klasifikasi Pembukuan (PRD):</label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="assetClass"
                  checked={assetClassification === 'OPERASIONAL'}
                  onChange={() => setAssetClassification('OPERASIONAL')}
                  className="text-rose-600 focus:ring-rose-500"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Biaya Operasional</span>
                  <span className="text-[10px] text-slate-500">Mengurangi laba bulan ini</span>
                </div>
              </label>
              <label className="flex items-center gap-2 p-2 bg-white border border-slate-200 rounded-xl cursor-pointer">
                <input
                  type="radio"
                  name="assetClass"
                  checked={assetClassification === 'ASET_MODAL'}
                  onChange={() => setAssetClassification('ASET_MODAL')}
                  className="text-purple-600 focus:ring-purple-500"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">Aset / Modal</span>
                  <span className="text-[10px] text-slate-500">Dicatat sebagai aset inventaris</span>
                </div>
              </label>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Penanggung Dana</label>
              <select
                value={payerPartnerId}
                onChange={(e) => setPayerPartnerId(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                {partners.map((p, idx) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.role || `Mitra ${idx + 1}`})
                  </option>
                ))}
                {partners.length === 0 && (
                  <>
                    <option value="partner-1">Mitra 1</option>
                    <option value="partner-2">Mitra 2</option>
                  </>
                )}
                <option value="KAS_USAHA">Kas Usaha Bersama</option>
              </select>
            </div>
            <div>
              <label className="block text-xs font-semibold text-slate-700 mb-1">Metode Bayar</label>
              <select
                value={paymentMethod}
                onChange={(e) => setPaymentMethod(e.target.value)}
                className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
              >
                <option value="TRANSFER_BANK">Transfer Bank</option>
                <option value="TUNAI">Tunai / Cash</option>
                <option value="QRIS">QRIS</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 mb-1">Catatan</label>
            <input
              type="text"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Keterangan tambahan pengeluaran..."
              className="w-full text-xs bg-slate-50 border border-slate-200 rounded-xl px-3 py-2 text-slate-800 focus:outline-none"
            />
          </div>

          {/* Total Calculation Highlight */}
          <div className="p-3.5 bg-rose-50/80 rounded-2xl border border-rose-200/70 flex items-center justify-between">
            <span className="text-xs font-semibold text-slate-700">Total Pengeluaran:</span>
            <span className="text-lg font-bold text-rose-600 tabular-nums">{formatIDR(totalAmount)}</span>
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
              className="px-5 py-2.5 text-xs font-semibold text-white bg-rose-600 hover:bg-rose-700 rounded-xl transition-all shadow-sm flex items-center gap-2 disabled:opacity-50"
            >
              {loading && <Loader2 className="w-3.5 h-3.5 animate-spin" />}
              <span>Simpan Pengeluaran</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
