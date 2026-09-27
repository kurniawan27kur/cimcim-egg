import { NextResponse } from 'next/server';
import { getDashboardData } from '@/lib/dataStore';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const period = searchParams.get('period') || '2026-09';

    const data = await getDashboardData(period);
    return NextResponse.json({ success: true, data });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Gagal memuat data dashboard' },
      { status: 500 }
    );
  }
}
