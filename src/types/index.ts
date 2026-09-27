// CimCim Farm Data Types & Interfaces

export type UserRole = 'OWNER' | 'PARTNER' | 'ADMIN';

export interface Partner {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sharePercent: number; // e.g. 50
  avatarColor: string;
  phone?: string;
  pin: string; // 6-digit PIN for confirmation/digital signature
  status: 'ACTIVE' | 'INACTIVE';
  password?: string;
}

export type TransactionType = 'INCOME' | 'EXPENSE' | 'CAPITAL' | 'DISTRIBUTION';
export type PaymentStatus = 'LUNAS' | 'SEBAGIAN' | 'BELUM_BAYAR';
export type PaymentMethod = 'TUNAI' | 'TRANSFER_BANK' | 'QRIS' | 'LAINNYA';

export interface SaleItem {
  id: string;
  transactionId?: string;
  date: string; // YYYY-MM-DD
  customerName: string;
  productType: string; // e.g. 'Telur Layer Grade A', 'Telur Retak', 'Ayam Afkir', 'Kotoran Ayam'
  quantity: number;
  unit: string; // 'butir', 'kg', 'tray'
  unitPrice: number;
  discount: number;
  totalAmount: number;
  paidAmount: number;
  paymentStatus: PaymentStatus;
  paymentMethod: PaymentMethod;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type ExpenseCategory =
  | 'Pakan'
  | 'Kesehatan'
  | 'Operasional'
  | 'Peralatan'
  | 'Perawatan'
  | 'Pembelian Ayam'
  | 'Kandang'
  | 'Kemasan'
  | 'Listrik & Air'
  | 'Tenaga Kerja'
  | 'Transportasi'
  | 'Lain-lain';

export type AssetClassification = 'OPERASIONAL' | 'ASET_MODAL' | 'PRIBADI';

export interface ExpenseItem {
  id: string;
  transactionId?: string;
  date: string; // YYYY-MM-DD
  category: ExpenseCategory;
  vendor: string;
  itemName: string;
  quantity: number;
  unit: string;
  unitPrice: number;
  totalAmount: number;
  assetClassification: AssetClassification;
  payerPartnerId: string; // e.g. 'partner-1' | 'partner-2' | 'KAS_USAHA'
  paymentMethod: PaymentMethod;
  paymentStatus?: PaymentStatus;
  evidenceUrl?: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export type InventoryCategory = 'PAKAN' | 'VITAMIN_OBAT' | 'SEKAM' | 'PERALATAN' | 'KEMASAN' | 'LAINNYA';
export type StockStatus = 'Aman' | 'Cukup' | 'Kritis';

export interface InventoryItem {
  id: string;
  name: string;
  category: InventoryCategory;
  unit: string; // 'karung', 'botol', 'item', 'sak', 'pack'
  currentQuantity: number;
  minQuantity: number;
  unitPrice: number;
  status: StockStatus;
  lastRestockedDate?: string;
  notes?: string;
  updatedAt: string;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  itemName: string;
  type: 'IN' | 'OUT' | 'ADJUSTMENT';
  quantity: number;
  date: string;
  notes?: string;
  createdBy: string;
  createdAt: string;
}

export interface DailyProduction {
  id: string;
  date: string; // YYYY-MM-DD
  totalHens: number; // Jumlah ayam layer hidup
  eggsGood: number; // Telur utuh / normal
  eggsBroken: number; // Telur retak / rusak
  totalEggs: number; // Total telur dipanen
  feedConsumptionKg: number; // Konsumsi pakan (kg)
  mortalityCount: number; // Ayam mati
  notes?: string;
  recordedBy: string;
  createdAt: string;
}

export type CapitalType = 'MODAL_AWAL' | 'SETORAN_TAMBAHAN' | 'PENARIKAN';

export interface CapitalContribution {
  id: string;
  partnerId: string;
  partnerName: string;
  type: CapitalType;
  category: string; // e.g. 'Modal Awal', 'Inventaris', 'Renovasi'
  itemName: string; // e.g. 'Ayam Layer', 'Kandang', 'Peralatan', 'Tempat Pakan'
  quantity?: number;
  unit?: string;
  amount: number;
  date: string; // YYYY-MM-DD
  paymentMethod: PaymentMethod;
  evidenceUrl?: string;
  notes?: string;
  createdAt: string;
}

export type ReportStatus = 'DRAFT' | 'APPROVED_PARTIAL' | 'LOCKED';

export interface MonthlyReport {
  id: string;
  period: string; // 'YYYY-MM', e.g. '2026-09'
  year: number;
  month: number; // 1 - 12
  monthName: string; // 'September 2026'
  
  // Financial breakdown
  revenueTotal: number; // Total Penjualan
  expenseTotal: number; // Total Pengeluaran Operasional
  netOperatingProfit: number; // Laba Bersih Operasional = Revenue - Expense
  reservesAmount: number; // Cadangan kas yang disepakati (default 0)
  previousLossDeduction: number; // Pengurang rugi periode sebelumnya (default 0)
  distributableProfit: number; // Laba yang dapat dibagikan = Net - Reserves - Loss
  
  // 50:50 distribution
  partner1Share: number; // 50%
  partner2Share: number; // 50%
  
  // Dual-partner Digital Approval
  partner1Approved: boolean;
  partner1ApprovedAt?: string;
  partner1ApprovedBy?: string;
  
  partner2Approved: boolean;
  partner2ApprovedAt?: string;
  partner2ApprovedBy?: string;
  
  status: ReportStatus;
  lockedAt?: string;
  lockedBy?: string;
  
  version: number;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ProfitDistributionRecord {
  id: string;
  reportId: string;
  period: string;
  partnerId: string;
  partnerName: string;
  amount: number;
  status: 'PENDING' | 'PAID';
  paidAt?: string;
  paymentMethod?: PaymentMethod;
  notes?: string;
  evidenceUrl?: string;
}

export interface AuditLog {
  id: string;
  timestamp: string;
  actorId: string;
  actorName: string;
  action: string;
  entityType: string;
  entityId?: string;
  details: string;
  ipAddress?: string;
}

export interface DashboardSummary {
  period: string;
  monthName: string;
  year: number;
  
  // KPI Cards
  totalSales: number;
  salesGrowthPercent: number;
  
  totalExpenses: number;
  expenseGrowthPercent: number;
  
  netProfit: number;
  netProfitGrowthPercent: number;
  
  profitSharePerPartner: number;
  
  // Monthly Production KPI
  totalEggsThisMonth: number;
  eggProductionGrowthPercent: number;
  averageEggsPerDay: number;
  eggDailyTarget: number;
  
  // Charts
  monthlyChartData: Array<{
    month: string; // 'Jan', 'Feb', ...
    fullMonth: string;
    sales: number;
    expenses: number;
    netProfit: number;
  }>;
  
  // Recent Tables
  recentSales: SaleItem[];
  recentExpenses: ExpenseItem[];
  
  // Inventory
  inventoryStocks: InventoryItem[];
  
  // Capital & Assets
  capitalInvestments: CapitalContribution[];
  
  // Status of monthly closing
  currentReport: MonthlyReport;
}

export interface AppSettings {
  businessName: string;
  tagline: string;
  currency: string;
  partner1Name: string;
  partner1Email: string;
  partner1Share: number;
  partner2Name: string;
  partner2Email: string;
  partner2Share: number;
  googleSheetId: string;
  googleSheetConnected: boolean;
  lastSyncedAt?: string;
}
