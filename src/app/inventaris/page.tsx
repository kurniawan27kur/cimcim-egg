'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import AdjustStockModal from '@/components/modals/AdjustStockModal';
import { InventoryItem, Partner } from '@/types';
import { formatIDR, formatNumber } from '@/lib/utils';
import {
  Package,
  Plus,
  Edit,
  AlertTriangle,
  CheckCircle,
  Clock,
  Loader2,
} from 'lucide-react';

export default function InventarisPage() {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);

  // Selected item for stock adjustment
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [isAdjustOpen, setIsAdjustOpen] = useState(false);

  // Add Item state
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState('PAKAN');
  const [newItemUnit, setNewItemUnit] = useState('karung');
  const [newItemQty, setNewItemQty] = useState(1);
  const [newItemMinQty, setNewItemMinQty] = useState(2);
  const [newItemPrice, setNewItemPrice] = useState(100000);
  const [newItemNotes, setNewItemNotes] = useState('');

  const fetchInventory = async () => {
    try {
      setLoading(true);
      const res = await fetch('/api/inventory');
      const json = await res.json();
      if (json.success && json.data) {
        setItems(json.data);
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
    fetchInventory();
    fetchCurrentUser();
  }, []);

  const handleAddItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName,
          category: newItemCategory,
          unit: newItemUnit,
          currentQuantity: newItemQty,
          minQuantity: newItemMinQty,
          unitPrice: newItemPrice,
          notes: newItemNotes,
        }),
      });
      if (res.ok) {
        setIsAddOpen(false);
        setNewItemName('');
        fetchInventory();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const totalAssetValue = items.reduce((sum, item) => sum + item.currentQuantity * (item.unitPrice || 0), 0);
  const criticalItemsCount = items.filter((i) => i.status === 'Kritis' || i.status === 'Cukup').length;

  const getItemIcon = (name: string) => {
    const lower = name.toLowerCase();
    if (lower.includes('pakan')) return '🥫';
    if (lower.includes('vitamin')) return '🧴';
    if (lower.includes('sekam')) return '🪵';
    if (lower.includes('obat')) return '🧪';
    if (lower.includes('minum') || lower.includes('alat')) return '🪣';
    return '📦';
  };

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      <Sidebar currentUser={currentUser} />

      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          <Header
            title="Inventaris & Stok"
            subtitle="Pemantauan persediaan pakan, vitamin, obat-obatan, dan perlengkapan kandang."
            actionButton={
              <button
                onClick={() => setIsAddOpen(true)}
                className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#D9531E] hover:bg-orange-700 rounded-xl transition-all shadow-xs"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Tambah Barang</span>
              </button>
            }
          />

          {/* Metrics */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-orange-50 border border-orange-100 flex items-center justify-center text-orange-600">
                <Package className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Jenis Barang</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{items.length} Item</h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600">
                <CheckCircle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Total Estimasi Nilai Stok</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{formatIDR(totalAssetValue)}</h3>
              </div>
            </div>

            <div className="bg-white p-4 sm:p-5 rounded-2xl border border-slate-200/80 shadow-2xs flex items-center gap-3.5">
              <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600">
                <AlertTriangle className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-medium text-slate-500">Perhatian / Restock Diperlukan</p>
                <h3 className="text-xl font-bold text-slate-900 tabular-nums mt-0.5">{criticalItemsCount} Item</h3>
              </div>
            </div>
          </div>

          {/* Cards Grid of Items */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs flex flex-col justify-between hover:shadow-xs transition-shadow"
              >
                <div>
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded-2xl bg-slate-100 flex items-center justify-center text-2xl border border-slate-200/50">
                        {getItemIcon(item.name)}
                      </div>
                      <div>
                        <h3 className="font-bold text-base text-slate-900 leading-tight">{item.name}</h3>
                        <p className="text-xs text-slate-500 mt-0.5 capitalize">{item.category.toLowerCase().replace('_', ' ')}</p>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${
                        item.status === 'Aman'
                          ? 'bg-emerald-50 text-emerald-700 border-emerald-100'
                          : item.status === 'Cukup'
                          ? 'bg-amber-50 text-amber-700 border-amber-100'
                          : 'bg-rose-50 text-rose-700 border-rose-100 animate-pulse'
                      }`}
                    >
                      {item.status}
                    </span>
                  </div>

                  <div className="mt-4 pt-3 border-t border-slate-100 space-y-2 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Stok Saat Ini:</span>
                      <span className="font-bold text-slate-900 text-sm tabular-nums">
                        {formatNumber(item.currentQuantity)} {item.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Batas Minimum:</span>
                      <span className="font-medium text-slate-600 tabular-nums">
                        {item.minQuantity} {item.unit}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-slate-500">Estimasi Nilai:</span>
                      <span className="font-semibold text-slate-900 tabular-nums">
                        {formatIDR(item.currentQuantity * item.unitPrice)}
                      </span>
                    </div>
                    {item.notes && (
                      <p className="text-[11px] text-slate-400 italic pt-1 truncate">{item.notes}</p>
                    )}
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-end">
                  <button
                    onClick={() => {
                      setSelectedItem(item);
                      setIsAdjustOpen(true);
                    }}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-orange-600 hover:text-orange-700 hover:bg-orange-50 rounded-xl transition-colors"
                  >
                    <Edit className="w-3.5 h-3.5" />
                    <span>Sesuaikan Stok</span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        </main>
      </div>

      {/* Adjust Stock Modal */}
      <AdjustStockModal
        isOpen={isAdjustOpen}
        item={selectedItem}
        onClose={() => setIsAdjustOpen(false)}
        onSuccess={fetchInventory}
      />

      {/* Add Item Modal */}
      {isAddOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-xs animate-in fade-in">
          <div className="bg-white rounded-3xl w-full max-w-md overflow-hidden shadow-2xl p-6 space-y-4">
            <h3 className="font-bold text-base text-slate-900">Tambah Barang Inventaris</h3>
            <form onSubmit={handleAddItem} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold block mb-1">Nama Barang *</label>
                <input
                  type="text"
                  required
                  value={newItemName}
                  onChange={(e) => setNewItemName(e.target.value)}
                  placeholder="Contoh: Pakan Layer 50kg"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Kategori</label>
                  <select
                    value={newItemCategory}
                    onChange={(e) => setNewItemCategory(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  >
                    <option value="PAKAN">Pakan</option>
                    <option value="VITAMIN_OBAT">Vitamin & Obat</option>
                    <option value="SEKAM">Sekam</option>
                    <option value="PERALATAN">Peralatan</option>
                    <option value="KEMASAN">Kemasan</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold block mb-1">Satuan</label>
                  <input
                    type="text"
                    required
                    value={newItemUnit}
                    onChange={(e) => setNewItemUnit(e.target.value)}
                    placeholder="karung / botol / pcs"
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold block mb-1">Stok Awal</label>
                  <input
                    type="number"
                    min="0"
                    value={newItemQty}
                    onChange={(e) => setNewItemQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
                <div>
                  <label className="font-semibold block mb-1">Batas Minimum</label>
                  <input
                    type="number"
                    min="1"
                    value={newItemMinQty}
                    onChange={(e) => setNewItemMinQty(Number(e.target.value))}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                  />
                </div>
              </div>
              <div>
                <label className="font-semibold block mb-1">Harga Satuan (IDR)</label>
                <input
                  type="number"
                  min="0"
                  step="1000"
                  value={newItemPrice}
                  onChange={(e) => setNewItemPrice(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div>
                <label className="font-semibold block mb-1">Catatan</label>
                <input
                  type="text"
                  value={newItemNotes}
                  onChange={(e) => setNewItemNotes(e.target.value)}
                  placeholder="Keterangan..."
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-2"
                />
              </div>
              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsAddOpen(false)}
                  className="px-4 py-2 font-semibold text-slate-600 hover:bg-slate-100 rounded-xl"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 font-semibold text-white bg-[#D9531E] rounded-xl hover:bg-orange-700"
                >
                  Simpan Barang
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
