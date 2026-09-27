import { NextResponse } from 'next/server';
import { getAllExpenses, addExpense, deleteExpense } from '@/lib/dataStore';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const expenses = await getAllExpenses();
    return NextResponse.json({ success: true, data: expenses });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      date,
      category,
      vendor,
      itemName,
      quantity = 1,
      unit = 'item',
      unitPrice,
      totalAmount,
      assetClassification = 'OPERASIONAL',
      payerPartnerId = 'partner-1',
      paymentMethod = 'TUNAI',
      paymentStatus = 'LUNAS',
      evidenceUrl,
      notes,
    } = body;

    if (!date || !category || !itemName || (!unitPrice && !totalAmount)) {
      return NextResponse.json(
        { success: false, message: 'Harap lengkapi tanggal, kategori, nama barang/pengeluaran, dan nominal.' },
        { status: 400 }
      );
    }

    const qty = Number(quantity) || 1;
    const price = Number(unitPrice) || Number(totalAmount) / qty;
    const total = Number(totalAmount) || qty * price;

    const newExpense = await addExpense({
      date,
      category,
      vendor: vendor || 'Umum',
      itemName,
      quantity: qty,
      unit,
      unitPrice: price,
      totalAmount: total,
      assetClassification,
      payerPartnerId,
      paymentMethod,
      paymentStatus,
      evidenceUrl,
      notes,
      createdBy: user?.name || 'Kurniawan',
    });

    return NextResponse.json({ success: true, data: newExpense });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  try {
    const user = await getCurrentUser();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ success: false, message: 'ID pengeluaran wajib diisi.' }, { status: 400 });
    }

    const deleted = await deleteExpense(id, user?.name || 'Mitra');
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Transaksi pengeluaran tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Transaksi pengeluaran berhasil dihapus.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
