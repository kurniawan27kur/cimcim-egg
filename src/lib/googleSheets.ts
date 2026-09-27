import { google } from 'googleapis';

const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

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
    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const existingSheetTitles = spreadsheet.data.sheets?.map((s) => s.properties?.title) || [];

    const sheetsToCreate: string[] = [];
    for (const title of Object.keys(SHEET_SCHEMAS)) {
      if (!existingSheetTitles.includes(title)) {
        sheetsToCreate.push(title);
      }
    }

    if (sheetsToCreate.length > 0) {
      const requests = sheetsToCreate.map((title) => ({
        addSheet: {
          properties: { title },
        },
      }));
      await sheets.spreadsheets.batchUpdate({
        spreadsheetId,
        requestBody: { requests },
      });
    }

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

    return { success: true, message: `Berhasil menginisialisasi ${Object.keys(SHEET_SCHEMAS).length} tab pada Google Spreadsheet.` };
  } catch (error: any) {
    return { success: false, message: error?.message || 'Error saat inisialisasi tab spreadsheet.' };
  }
}

/**
 * Read all rows from a Google Sheet tab
 */
export async function readSheetRows(tabName: keyof typeof SHEET_SCHEMAS): Promise<any[][] | null> {
  const client = getGoogleSheetsClient();
  if (!client) return null;

  try {
    const { sheets, spreadsheetId } = client;
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: `${tabName}!A2:Z`,
    });
    return response.data.values || [];
  } catch (err: any) {
    // Return null if sheet not found or disabled
    return null;
  }
}

/**
 * Append row to a Google Sheet tab
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

/**
 * Delete a row by record ID (column A)
 */
export async function deleteSheetRowById(tabName: keyof typeof SHEET_SCHEMAS, id: string): Promise<boolean> {
  const client = getGoogleSheetsClient();
  if (!client) return false;

  try {
    const { sheets, spreadsheetId } = client;
    const rows = await readSheetRows(tabName);
    if (!rows) return false;

    const rowIndex = rows.findIndex((row) => row[0] === id);
    if (rowIndex === -1) return false;

    const spreadsheet = await sheets.spreadsheets.get({ spreadsheetId });
    const sheetObj = spreadsheet.data.sheets?.find((s) => s.properties?.title === tabName);
    const sheetId = sheetObj?.properties?.sheetId;

    if (sheetId === undefined) return false;

    // Row index in sheet starts at 1 (header is row 0, first data is row 1)
    await sheets.spreadsheets.batchUpdate({
      spreadsheetId,
      requestBody: {
        requests: [
          {
            deleteDimension: {
              range: {
                sheetId,
                dimension: 'ROWS',
                startIndex: rowIndex + 1,
                endIndex: rowIndex + 2,
              },
            },
          },
        ],
      },
    });
    return true;
  } catch (err) {
    console.error(`Error deleting row from ${tabName}:`, err);
    return false;
  }
}
