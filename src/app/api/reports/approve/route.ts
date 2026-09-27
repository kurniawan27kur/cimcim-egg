import { NextResponse } from 'next/server';
import { approveMonthlyReport } from '@/lib/dataStore';
import { verifyPartnerPin, PARTNERS_DB } from '@/lib/auth';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { period, partnerId, pin } = body;

    if (!period || !partnerId || !pin) {
      return NextResponse.json(
        { success: false, message: 'Periode, ID Mitra, dan PIN Otorisasi wajib diisi.' },
        { status: 400 }
      );
    }

    const partner = PARTNERS_DB.find((p) => p.id === partnerId);
    if (!partner) {
      return NextResponse.json({ success: false, message: 'Mitra tidak ditemukan.' }, { status: 404 });
    }

    const isValidPin = verifyPartnerPin(partnerId, pin);
    if (!isValidPin) {
      return NextResponse.json(
        { success: false, message: 'PIN otorisasi digital salah. Silakan coba lagi.' },
        { status: 401 }
      );
    }

    const result = await approveMonthlyReport(period, partner.id, partner.name);
    return NextResponse.json(result);
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
