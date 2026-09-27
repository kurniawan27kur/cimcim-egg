import { NextResponse } from 'next/server';
import { getAllSales, addSale, deleteSale } from '@/lib/dataStore';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const sales = await getAllSales();
    return NextResponse.json({ success: true, data: sales });
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
      customerName,
      productType,
      quantity,
      unit,
      unitPrice,
      discount = 0,
      paymentStatus = 'LUNAS',
      paymentMethod = 'TUNAI',
      notes,
    } = body;

    if (!customerName || !quantity || !unitPrice || !date) {
      return NextResponse.json(
        { success: false, message: 'Harap isi semua kolom wajib: tanggal, pelanggan, kuantitas, dan harga satuan.' },
        { status: 400 }
      );
    }

    const qty = Number(quantity);
    const price = Number(unitPrice);
    const disc = Number(discount) || 0;
    const totalAmount = Math.max(0, qty * price - disc);
    const paidAmount = paymentStatus === 'LUNAS' ? totalAmount : (Number(body.paidAmount) || 0);

    const newSale = await addSale({
      date,
      customerName,
      productType: productType || 'Telur Layer Grade A',
      quantity: qty,
      unit: unit || 'butir',
      unitPrice: price,
      discount: disc,
      totalAmount,
      paidAmount,
      paymentStatus,
      paymentMethod,
      notes,
      createdBy: user?.name || 'Kurniawan',
    });

    return NextResponse.json({ success: true, data: newSale });
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
      return NextResponse.json({ success: false, message: 'ID penjualan wajib diisi.' }, { status: 400 });
    }

    const deleted = await deleteSale(id, user?.name || 'Mitra');
    if (!deleted) {
      return NextResponse.json({ success: false, message: 'Transaksi penjualan tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Transaksi penjualan berhasil dihapus.' });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
