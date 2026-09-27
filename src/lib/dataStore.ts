import {
  SaleItem,
  ExpenseItem,
  InventoryItem,
  DailyProduction,
  CapitalContribution,
  MonthlyReport,
  AuditLog,
  DashboardSummary,
  AppSettings,
  Partner,
} from '@/types';
import { PARTNERS_DB } from './auth';
import { appendSheetRow, readSheetRows, deleteSheetRowById } from './googleSheets';

// Real clean in-memory state (Starts empty for manual user input)
let salesData: SaleItem[] = [];
let expensesData: ExpenseItem[] = [];
let inventoryData: InventoryItem[] = [];
let capitalInvestmentsData: CapitalContribution[] = [];
let dailyProductions: DailyProduction[] = [];
let monthlyReportsData: MonthlyReport[] = [];
let auditLogs: AuditLog[] = [];

let appSettings: AppSettings = {
  businessName: 'CimCim Egg',
  tagline: 'Fresh Eggs, Better Days',
  currency: 'IDR',
  partner1Name: 'Kurniawan',
  partner1Email: 'mrsin178@gmail.com',
  partner1Share: 50,
  partner2Name: 'Santoso',
  partner2Email: 'santoso@cimcim.com',
  partner2Share: 50,
  googleSheetId: process.env.GOOGLE_SHEET_ID || '',
  googleSheetConnected: Boolean(process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
  lastSyncedAt: new Date().toISOString(),
};

// ==========================================
// SYNC & FETCH FUNCTIONS
// ==========================================

export async function getAllSales(): Promise<SaleItem[]> {
  // Try reading from Google Sheets if available
  const sheetRows = await readSheetRows('Penjualan');
  if (sheetRows && sheetRows.length > 0) {
    const syncedSales: SaleItem[] = sheetRows.map((row) => ({
      id: row[0] || `SALE-${Date.now()}`,
      date: row[1] || '',
      customerName: row[2] || '',
      productType: row[3] || 'Telur Layer Grade A',
      quantity: Number(row[4]) || 0,
      unit: row[5] || 'butir',
      unitPrice: Number(row[6]) || 0,
      discount: Number(row[7]) || 0,
      totalAmount: Number(row[8]) || 0,
      paidAmount: Number(row[9]) || 0,
      paymentStatus: (row[10] as any) || 'LUNAS',
      paymentMethod: (row[11] as any) || 'TUNAI',
      notes: row[12] || '',
      createdBy: 'Mitra',
      createdAt: row[13] || new Date().toISOString(),
    }));
    salesData = syncedSales;
  }
  return [...salesData];
}

export async function addSale(sale: Omit<SaleItem, 'id' | 'createdAt'>): Promise<SaleItem> {
  const newSale: SaleItem = {
    ...sale,
    id: `SALE-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  salesData.unshift(newSale);

  // Sync to Google Sheets
  await appendSheetRow('Penjualan', [
    newSale.id,
    newSale.date,
    newSale.customerName,
    newSale.productType,
    newSale.quantity,
    newSale.unit,
    newSale.unitPrice,
    newSale.discount,
    newSale.totalAmount,
    newSale.paidAmount,
    newSale.paymentStatus,
    newSale.paymentMethod,
    newSale.notes || '',
    newSale.createdAt,
  ]);

  addAuditLog(newSale.createdBy, 'CREATE_SALE', 'SALE', newSale.id, `Tambah penjualan: ${newSale.quantity} ${newSale.unit} ke ${newSale.customerName} (Rp ${newSale.totalAmount})`);
  return newSale;
}

export async function deleteSale(id: string, actorName: string): Promise<boolean> {
  const initialLen = salesData.length;
  salesData = salesData.filter((s) => s.id !== id);
  await deleteSheetRowById('Penjualan', id);
  addAuditLog(actorName, 'DELETE_SALE', 'SALE', id, `Hapus penjualan ID: ${id}`);
  return salesData.length < initialLen || true;
}

export async function getAllExpenses(): Promise<ExpenseItem[]> {
  const sheetRows = await readSheetRows('Pengeluaran');
  if (sheetRows && sheetRows.length > 0) {
    const syncedExpenses: ExpenseItem[] = sheetRows.map((row) => ({
      id: row[0] || `EXP-${Date.now()}`,
      date: row[1] || '',
      category: (row[2] as any) || 'Operasional',
      vendor: row[3] || '',
      itemName: row[4] || '',
      quantity: Number(row[5]) || 1,
      unit: row[6] || 'item',
      unitPrice: Number(row[7]) || 0,
      totalAmount: Number(row[8]) || 0,
      assetClassification: (row[9] as any) || 'OPERASIONAL',
      payerPartnerId: row[10] || 'partner-1',
      paymentMethod: (row[11] as any) || 'TUNAI',
      paymentStatus: (row[12] as any) || 'LUNAS',
      notes: row[13] || '',
      createdBy: 'Mitra',
      createdAt: row[14] || new Date().toISOString(),
    }));
    expensesData = syncedExpenses;
  }
  return [...expensesData];
}

export async function addExpense(expense: Omit<ExpenseItem, 'id' | 'createdAt'>): Promise<ExpenseItem> {
  const newExpense: ExpenseItem = {
    ...expense,
    id: `EXP-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  expensesData.unshift(newExpense);

  await appendSheetRow('Pengeluaran', [
    newExpense.id,
    newExpense.date,
    newExpense.category,
    newExpense.vendor,
    newExpense.itemName,
    newExpense.quantity,
    newExpense.unit,
    newExpense.unitPrice,
    newExpense.totalAmount,
    newExpense.assetClassification,
    newExpense.payerPartnerId,
    newExpense.paymentMethod,
    newExpense.paymentStatus || 'LUNAS',
    newExpense.notes || '',
    newExpense.createdAt,
  ]);

  addAuditLog(newExpense.createdBy, 'CREATE_EXPENSE', 'EXPENSE', newExpense.id, `Tambah pengeluaran: ${newExpense.itemName} (Rp ${newExpense.totalAmount})`);
  return newExpense;
}

export async function deleteExpense(id: string, actorName: string): Promise<boolean> {
  const initialLen = expensesData.length;
  expensesData = expensesData.filter((e) => e.id !== id);
  await deleteSheetRowById('Pengeluaran', id);
  addAuditLog(actorName, 'DELETE_EXPENSE', 'EXPENSE', id, `Hapus pengeluaran ID: ${id}`);
  return expensesData.length < initialLen || true;
}

export async function getAllInventory(): Promise<InventoryItem[]> {
  const sheetRows = await readSheetRows('Inventaris');
  if (sheetRows && sheetRows.length > 0) {
    const syncedInv: InventoryItem[] = sheetRows.map((row) => ({
      id: row[0] || `INV-${Date.now()}`,
      name: row[1] || '',
      category: (row[2] as any) || 'PAKAN',
      unit: row[3] || 'item',
      currentQuantity: Number(row[4]) || 0,
      minQuantity: Number(row[5]) || 0,
      unitPrice: Number(row[6]) || 0,
      status: (row[7] as any) || 'Aman',
      updatedAt: row[8] || new Date().toISOString(),
    }));
    inventoryData = syncedInv;
  }
  return [...inventoryData];
}

export async function updateInventoryStock(id: string, newQuantity: number, actorName: string): Promise<InventoryItem | null> {
  let item = inventoryData.find((i) => i.id === id);
  if (!item) return null;

  item.currentQuantity = newQuantity;
  if (item.currentQuantity <= item.minQuantity * 0.5) {
    item.status = 'Kritis';
  } else if (item.currentQuantity <= item.minQuantity) {
    item.status = 'Cukup';
  } else {
    item.status = 'Aman';
  }
  item.updatedAt = new Date().toISOString();

  addAuditLog(actorName, 'UPDATE_STOCK', 'INVENTORY', id, `Perbarui stok ${item.name} menjadi ${newQuantity} ${item.unit}`);
  return item;
}

export async function addInventoryItem(item: Omit<InventoryItem, 'id' | 'updatedAt'>, actorName: string): Promise<InventoryItem> {
  const newItem: InventoryItem = {
    ...item,
    id: `INV-${Date.now()}`,
    updatedAt: new Date().toISOString(),
  };
  inventoryData.push(newItem);

  await appendSheetRow('Inventaris', [
    newItem.id,
    newItem.name,
    newItem.category,
    newItem.unit,
    newItem.currentQuantity,
    newItem.minQuantity,
    newItem.unitPrice,
    newItem.status,
    newItem.updatedAt,
  ]);

  addAuditLog(actorName, 'CREATE_INVENTORY', 'INVENTORY', newItem.id, `Tambah barang baru: ${newItem.name}`);
  return newItem;
}

export async function getAllProductions(): Promise<DailyProduction[]> {
  const sheetRows = await readSheetRows('Produksi');
  if (sheetRows && sheetRows.length > 0) {
    const syncedProd: DailyProduction[] = sheetRows.map((row) => ({
      id: row[0] || `PROD-${Date.now()}`,
      date: row[1] || '',
      totalHens: Number(row[2]) || 0,
      eggsGood: Number(row[3]) || 0,
      eggsBroken: Number(row[4]) || 0,
      totalEggs: Number(row[5]) || 0,
      feedConsumptionKg: Number(row[6]) || 0,
      mortalityCount: Number(row[7]) || 0,
      notes: row[8] || '',
      recordedBy: row[9] || 'Mitra',
      createdAt: row[10] || new Date().toISOString(),
    }));
    dailyProductions = syncedProd;
  }
  return [...dailyProductions];
}

export async function addProduction(prod: Omit<DailyProduction, 'id' | 'createdAt'>): Promise<DailyProduction> {
  const newProd: DailyProduction = {
    ...prod,
    id: `PROD-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  dailyProductions.unshift(newProd);

  await appendSheetRow('Produksi', [
    newProd.id,
    newProd.date,
    newProd.totalHens,
    newProd.eggsGood,
    newProd.eggsBroken,
    newProd.totalEggs,
    newProd.feedConsumptionKg,
    newProd.mortalityCount,
    newProd.notes || '',
    newProd.recordedBy,
    newProd.createdAt,
  ]);

  addAuditLog(newProd.recordedBy, 'RECORD_PRODUCTION', 'PRODUCTION', newProd.id, `Catat produksi ${newProd.date}: ${newProd.totalEggs} butir`);
  return newProd;
}

export async function getAllCapital(): Promise<CapitalContribution[]> {
  const sheetRows = await readSheetRows('Modal');
  if (sheetRows && sheetRows.length > 0) {
    const syncedCap: CapitalContribution[] = sheetRows.map((row) => ({
      id: row[0] || `CAP-${Date.now()}`,
      partnerId: row[1] || 'partner-1',
      partnerName: row[2] || 'Mitra',
      type: (row[3] as any) || 'MODAL_AWAL',
      category: row[4] || 'Modal Awal',
      itemName: row[5] || '',
      quantity: Number(row[6]) || 1,
      unit: row[7] || '',
      amount: Number(row[8]) || 0,
      date: row[9] || '',
      paymentMethod: (row[10] as any) || 'TRANSFER_BANK',
      notes: row[11] || '',
      createdAt: row[12] || new Date().toISOString(),
    }));
    capitalInvestmentsData = syncedCap;
  }
  return [...capitalInvestmentsData];
}

export async function addCapital(cap: Omit<CapitalContribution, 'id' | 'createdAt'>, actorName: string): Promise<CapitalContribution> {
  const newCap: CapitalContribution = {
    ...cap,
    id: `CAP-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  capitalInvestmentsData.unshift(newCap);

  await appendSheetRow('Modal', [
    newCap.id,
    newCap.partnerId,
    newCap.partnerName,
    newCap.type,
    newCap.category,
    newCap.itemName,
    newCap.quantity || 1,
    newCap.unit || '',
    newCap.amount,
    newCap.date,
    newCap.paymentMethod,
    newCap.notes || '',
    newCap.createdAt,
  ]);

  addAuditLog(actorName, 'CREATE_CAPITAL', 'CAPITAL', newCap.id, `Tambah setoran modal ${newCap.itemName} Rp ${newCap.amount}`);
  return newCap;
}

export async function getDashboardData(period: string = '2026-09'): Promise<DashboardSummary> {
  const sales = await getAllSales();
  const expenses = await getAllExpenses();
  const inventory = await getAllInventory();
  const capitals = await getAllCapital();
  const productions = await getAllProductions();

  const filteredSales = sales.filter((s) => s.date.startsWith(period));
  const filteredExpenses = expenses.filter((e) => e.date.startsWith(period));
  const filteredProd = productions.filter((p) => p.date.startsWith(period));

  const totalSales = filteredSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const netProfit = totalSales - totalExpenses;
  const profitSharePerPartner = Math.round(netProfit * 0.5);

  const totalEggsThisMonth = filteredProd.reduce((acc, curr) => acc + curr.totalEggs, 0);
  const averageEggsPerDay = filteredProd.length > 0 ? Math.round(totalEggsThisMonth / filteredProd.length) : 0;
  const eggDailyTarget = 100;

  // Monthly chart data from real transactions
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun', 'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'];
  const fullMonths = ['Januari', 'Februari', 'Maret', 'April', 'Mei', 'Juni', 'Juli', 'Agustus', 'September', 'Oktober', 'November', 'Desember'];
  const currentYear = period.split('-')[0] || '2026';
  const monthlyChartData = months.map((m, idx) => {
    const mStr = `${currentYear}-${String(idx + 1).padStart(2, '0')}`;
    const mSales = sales.filter((s) => s.date.startsWith(mStr)).reduce((a, b) => a + b.totalAmount, 0);
    const mExp = expenses.filter((e) => e.date.startsWith(mStr)).reduce((a, b) => a + b.totalAmount, 0);
    return {
      month: m,
      fullMonth: fullMonths[idx],
      sales: mSales,
      expenses: mExp,
      netProfit: mSales - mExp,
    };
  });

  let currentReport = monthlyReportsData.find((r) => r.period === period);
  if (!currentReport) {
    currentReport = {
      id: `REP-${period}`,
      period,
      year: parseInt(period.split('-')[0]) || 2026,
      month: parseInt(period.split('-')[1]) || 9,
      monthName: `Periode ${period}`,
      revenueTotal: totalSales,
      expenseTotal: totalExpenses,
      netOperatingProfit: netProfit,
      reservesAmount: 0,
      previousLossDeduction: 0,
      distributableProfit: netProfit,
      partner1Share: profitSharePerPartner,
      partner2Share: profitSharePerPartner,
      partner1Approved: false,
      partner2Approved: false,
      status: 'DRAFT',
      version: 1,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  return {
    period,
    monthName: `Periode ${period}`,
    year: parseInt(currentYear) || 2026,
    totalSales,
    salesGrowthPercent: 0,
    totalExpenses,
    expenseGrowthPercent: 0,
    netProfit,
    netProfitGrowthPercent: 0,
    profitSharePerPartner,
    totalEggsThisMonth,
    eggProductionGrowthPercent: 0,
    averageEggsPerDay,
    eggDailyTarget,
    monthlyChartData,
    recentSales: sales.slice(0, 5),
    recentExpenses: expenses.slice(0, 5),
    inventoryStocks: inventory,
    capitalInvestments: capitals,
    currentReport,
  };
}

export async function getAllReports(): Promise<MonthlyReport[]> {
  return [...monthlyReportsData];
}

export async function getReportByPeriod(period: string): Promise<MonthlyReport | null> {
  const existing = monthlyReportsData.find((r) => r.period === period);
  if (existing) return existing;
  const summary = await getDashboardData(period);
  return summary.currentReport;
}

export async function approveMonthlyReport(
  period: string,
  partnerId: string,
  partnerName: string
): Promise<{ success: boolean; report?: MonthlyReport; message: string }> {
  let report = monthlyReportsData.find((r) => r.period === period);
  if (!report) {
    const summary = await getDashboardData(period);
    report = summary.currentReport;
    monthlyReportsData.push(report);
  }

  if (report.status === 'LOCKED') {
    return { success: false, message: 'Laporan periode ini sudah dikunci.' };
  }

  if (partnerId === 'partner-1') {
    report.partner1Approved = true;
    report.partner1ApprovedAt = new Date().toISOString();
    report.partner1ApprovedBy = partnerName;
  } else if (partnerId === 'partner-2') {
    report.partner2Approved = true;
    report.partner2ApprovedAt = new Date().toISOString();
    report.partner2ApprovedBy = partnerName;
  }

  if (report.partner1Approved && report.partner2Approved) {
    report.status = 'LOCKED';
    report.lockedAt = new Date().toISOString();
    report.lockedBy = partnerName;
  } else {
    report.status = 'APPROVED_PARTIAL';
  }

  report.updatedAt = new Date().toISOString();

  addAuditLog(partnerName, 'APPROVE_REPORT', 'REPORT', report.id, `Mitra ${partnerName} menyetujui laporan bulanan ${period}. Status: ${report.status}`);
  return { success: true, report, message: `Persetujuan berhasil dicatat oleh ${partnerName}.` };
}

export async function getAuditLogs(): Promise<AuditLog[]> {
  const sheetRows = await readSheetRows('AuditLog');
  if (sheetRows && sheetRows.length > 0) {
    const syncedLogs: AuditLog[] = sheetRows.map((row) => ({
      id: row[0] || `LOG-${Date.now()}`,
      timestamp: row[1] || new Date().toISOString(),
      actorId: row[2] || 'Mitra',
      actorName: row[2] || 'Mitra',
      action: row[3] || '',
      entityType: row[4] || '',
      entityId: row[5] || '',
      details: row[6] || '',
    }));
    auditLogs = syncedLogs;
  }
  return [...auditLogs];
}

export function addAuditLog(actorName: string, action: string, entityType: string, entityId: string, details: string) {
  const log: AuditLog = {
    id: `LOG-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    timestamp: new Date().toISOString(),
    actorId: actorName,
    actorName,
    action,
    entityType,
    entityId,
    details,
  };
  auditLogs.unshift(log);

  appendSheetRow('AuditLog', [
    log.id,
    log.timestamp,
    log.actorName,
    log.action,
    log.entityType,
    log.entityId || '',
    log.details,
  ]);
}

export async function getAppSettings(): Promise<AppSettings> {
  return { ...appSettings };
}

export async function updateAppSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  appSettings = { ...appSettings, ...settings };
  return { ...appSettings };
}
