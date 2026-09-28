import { NextResponse } from 'next/server';
import { getAllCapital, addCapital } from '@/lib/dataStore';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const data = await getAllCapital();
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const {
      partnerId,
      partnerName,
      type = 'MODAL_AWAL',
      category = 'Modal Awal',
      itemName,
      quantity = 1,
      unit = 'paket',
      amount,
      date,
      paymentMethod = 'TRANSFER_BANK',
      notes,
    } = body;

    if (!itemName || !amount || !date) {
      return NextResponse.json(
        { success: false, message: 'Harap isi nama modal/aset, nominal, dan tanggal.' },
        { status: 400 }
      );
    }

    const newCap = await addCapital(
      {
        partnerId: partnerId || user?.id || 'partner-1',
        partnerName: partnerName || user?.name || 'Mitra',
        type,
        category,
        itemName,
        quantity: Number(quantity) || 1,
        unit,
        amount: Number(amount),
        date,
        paymentMethod,
        notes,
      },
      user?.name || 'Mitra'
    );

    return NextResponse.json({ success: true, data: newCap });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
