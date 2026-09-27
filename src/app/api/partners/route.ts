import { NextResponse } from 'next/server';
import { getAllPartners } from '@/lib/auth';

export async function GET() {
  try {
    const partners = await getAllPartners();
    return NextResponse.json({ success: true, data: partners });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
