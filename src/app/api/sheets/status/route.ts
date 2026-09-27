import { NextResponse } from 'next/server';
import { getGoogleSheetsClient } from '@/lib/googleSheets';

export async function GET() {
  const email = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  const sheetId = process.env.GOOGLE_SHEET_ID;
  const hasKey = Boolean(process.env.GOOGLE_PRIVATE_KEY);

  if (!email || !hasKey || !sheetId) {
    return NextResponse.json({
      connected: false,
      configured: false,
      message: 'Kredensial Google Service Account atau Sheet ID belum dikonfigurasi di Environment Variables.',
      details: {
        hasEmail: Boolean(email),
        hasKey,
        hasSheetId: Boolean(sheetId),
      },
    });
  }

  const client = getGoogleSheetsClient();
  if (!client) {
    return NextResponse.json({
      connected: false,
      configured: true,
      message: 'Gagal menginisialisasi Google Auth JWT dengan kunci privat yang diberikan.',
    });
  }

  try {
    const res = await client.sheets.spreadsheets.get({ spreadsheetId: client.spreadsheetId });
    return NextResponse.json({
      connected: true,
      configured: true,
      title: res.data.properties?.title || 'CimCim Farm Spreadsheet',
      sheetCount: res.data.sheets?.length || 0,
      sheetTabs: res.data.sheets?.map((s) => s.properties?.title) || [],
      message: 'Berhasil terhubung ke Google Spreadsheet.',
    });
  } catch (error: any) {
    return NextResponse.json({
      connected: false,
      configured: true,
      message: `Koneksi Google Sheets gagal: ${error?.message || 'Akses ditolak atau Sheet ID salah.'}`,
    });
  }
}
