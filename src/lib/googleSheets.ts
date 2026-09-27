import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

export interface GoogleSheetsConfig {
  clientEmail?: string;
  privateKey?: string;
  spreadsheetId?: string;
}

export function getGoogleSheetsClient() {
  const clientEmail = process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL;
  let privateKey = process.env.GOOGLE_PRIVATE_KEY;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!clientEmail || !privateKey || !spreadsheetId) {
    return null;
  }

  // Handle formatted newline in private key
  if (privateKey.includes('\\n')) {
    privateKey = privateKey.replace(/\\n/g, '\n');
  }

  try {
    const auth = new google.auth.JWT({
      email: clientEmail,
      key: privateKey,
      scopes: SCOPES,
    });

    const sheets = google.sheets({ version: 'v4', auth });
    return { sheets, spreadsheetId };
  } catch (error) {
    console.error('Failed to initialize Google Sheets client:', error);
    return null;
  }
}

export const SHEET_SCHEMAS = {
  Mitra: ['id', 'name', 'email', 'role', 'sharePercent', 'phone', 'status', 'updatedAt'],
  Penjualan: ['id', 'date', 'customerName', 'productType', 'quantity', 'unit', 'unitPrice', 'discount', 'totalAmount', 'paidAmount', 'paymentStatus', 'paymentMethod', 'notes', 'createdAt'],
  Pengeluaran: ['id', 'date', 'category', 'vendor', 'itemName', 'quantity', 'unit', 'unitPrice', 'totalAmount', 'assetClassification', 'payerPartnerId', 'paymentMethod', 'paymentStatus', 'notes', 'createdAt'],
  Modal: ['id', 'partnerId', 'partnerName', 'type', 'category', 'itemName', 'quantity', 'unit', 'amount', 'date', 'paymentMethod', 'notes', 'createdAt'],
  Inventaris: ['id', 'name', 'category', 'unit', 'currentQuantity', 'minQuantity', 'unitPrice', 'status', 'updatedAt'],
  Produksi: ['id', 'date', 'totalHens', 'eggsGood', 'eggsBroken', 'totalEggs', 'feedConsumptionKg', 'mortalityCount', 'notes', 'recordedBy', 'createdAt'],
  LaporanBulanan: ['id', 'period', 'year', 'month', 'revenueTotal', 'expenseTotal', 'netOperatingProfit', 'reservesAmount', 'distributableProfit', 'partner1Share', 'partner2Share', 'partner1Approved', 'partner1ApprovedAt', 'partner2Approved', 'partner2ApprovedAt', 'status', 'lockedAt', 'updatedAt'],
  AuditLog: ['id', 'timestamp', 'actorName', 'action', 'entityType', 'entityId', 'details'],
};

/**
 * Initialize all necessary tabs and headers in the connected Google Sheet
 */
export async function initializeSheetTabs(): Promise<{ success: boolean; message: string }> {
  const client = getGoogleSheetsClient();
  if (!client) {
    return { success: false, message: 'Google Sheets credentials are not configured in environment variables.' };
  }

  const { sheets, spreadsheetId } = client;

  try {
    // 1. Get existing sheets
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheetTitles = spreadsheet.data.sheets?.map(s => s.properties?.title) || [];

    const sheetsToCreate: string[] = [];
    for (const title of Object.keys(SHEET_SCHEMAS)) {
      if (!existingSheetTitles.includes(title)) {
        sheetsToCreate.push(title);
      }
    }

    // 2. Add missing sheets
    if (sheetsToCreate.length > 0) {
      const requests = sheetsToCreate.map(title => ({
        addSheet: {
          properties: { title },
        },
      }));
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests },
      });
    }

    // 3. Set headers for each sheet
    for (const [title, headers] of Object.entries(SHEET_SCHEMAS)) {
      await sheets.spreadsheets.values.update({
        spreadsheetId,
        range: `${title}!A1:${String.fromCharCode(64 + headers.length)}1`,
        valueInputOption: 'RAW',
        requestBody: {
          values: [headers],
        },
      });
    }

    return { success: true, message: `Successfully initialized ${Object.keys(SHEET_SCHEMAS).length} sheet tabs.` };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Error initializing spreadsheet tabs.' };
  }
}

/**
 * Append row to a Google Sheet
 */
export async function appendSheetRow(tabName: keyof typeof SHEET_SCHEMAS, rowValues: any[]): Promise<boolean> {
  const client = getGoogleSheetsClient();
  if (!client) return false;

  try {
    const { sheets, spreadsheetId } = client;
    await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: `${tabName}!A:A`,
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [rowValues],
      },
    });
    return true;
  } catch (err) {
    console.error(`Error appending row to ${tabName}:`, err);
    return false;
  }
}
