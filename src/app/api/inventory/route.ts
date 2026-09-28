import { NextResponse } from 'next/server';
import { getAllInventory, addInventoryItem, updateInventoryStock } from '@/lib/dataStore';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const items = await getAllInventory();
    return NextResponse.json({ success: true, data: items });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const { name, category, unit, currentQuantity, minQuantity, unitPrice, notes } = body;

    if (!name || !category || currentQuantity === undefined || !minQuantity) {
      return NextResponse.json(
        { success: false, message: 'Harap isi nama barang, kategori, jumlah saat ini, dan batas minimum stok.' },
        { status: 400 }
      );
    }

    const qty = Number(currentQuantity);
    const minQty = Number(minQuantity);
    let status: 'Aman' | 'Cukup' | 'Kritis' = 'Aman';
    if (qty <= minQty * 0.5) status = 'Kritis';
    else if (qty <= minQty) status = 'Cukup';

    const newItem = await addInventoryItem(
      {
        name,
        category,
        unit: unit || 'item',
        currentQuantity: qty,
        minQuantity: minQty,
        unitPrice: Number(unitPrice) || 0,
        status,
        notes,
      },
      user?.name || 'Mitra'
    );

    return NextResponse.json({ success: true, data: newItem });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();
    const { id, quantity } = body;

    if (!id || quantity === undefined) {
      return NextResponse.json({ success: false, message: 'ID barang dan jumlah stok baru wajib diisi.' }, { status: 400 });
    }

    const updated = await updateInventoryStock(id, Number(quantity), user?.name || 'Mitra');
    if (!updated) {
      return NextResponse.json({ success: false, message: 'Barang inventaris tidak ditemukan.' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
