import { NextResponse } from 'next/server';
import { getAuditLogs } from '@/lib/dataStore';

export async function GET() {
  try {
    const logs = await getAuditLogs();
    return NextResponse.json({ success: true, data: logs });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
