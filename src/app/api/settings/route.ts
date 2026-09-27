import { NextResponse } from 'next/server';
import { getAppSettings, updateAppSettings, addAuditLog } from '@/lib/dataStore';
import { getCurrentUser } from '@/lib/auth';

export async function GET() {
  try {
    const settings = await getAppSettings();
    return NextResponse.json({ success: true, data: settings });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const user = await getCurrentUser();
    const body = await req.json();

    const updated = await updateAppSettings(body);
    addAuditLog(user?.name || 'Admin', 'UPDATE_SETTINGS', 'SETTINGS', 'APP_CONFIG', 'Perubahan konfigurasi umum sistem disimpan.');

    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}
