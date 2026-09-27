import { NextResponse } from 'next/server';
import { initializeSheetTabs } from '@/lib/googleSheets';
import { getCurrentUser } from '@/lib/auth';
import { addAuditLog } from '@/lib/dataStore';

export async function POST() {
  const user = await getCurrentUser();
  const result = await initializeSheetTabs();

  if (result.success) {
    addAuditLog(
      user?.name || 'Admin',
      'INIT_SHEETS',
      'GOOGLE_SHEETS',
      'ALL_TABS',
      'Inisialisasi seluruh tab dan struktur kolom Google Spreadsheet berhasil.'
    );
  }

  return NextResponse.json(result);
}
