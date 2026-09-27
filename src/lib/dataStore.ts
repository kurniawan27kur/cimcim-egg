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
import { appendSheetRow } from './googleSheets';

// Initial dataset loaded into memory and ready for persistence
let partners: Partner[] = [...PARTNERS_DB];

let salesData: SaleItem[] = [
  {
    id: 'SALE-202609-001',
    date: '2026-09-28',
    customerName: 'Pelanggan A',
    productType: 'Telur Layer Grade A',
    quantity: 120,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 336000,
    paidAmount: 336000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pelanggan A rutin',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-28T09:30:00Z',
  },
  {
    id: 'SALE-202609-002',
    date: '2026-09-27',
    customerName: 'Pelanggan B',
    productType: 'Telur Layer Grade A',
    quantity: 200,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 560000,
    paidAmount: 560000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TUNAI',
    notes: 'Pelanggan B',
    createdBy: 'Santoso',
    createdAt: '2026-09-27T10:15:00Z',
  },
  {
    id: 'SALE-202609-003',
    date: '2026-09-26',
    customerName: 'Pelanggan C',
    productType: 'Telur Layer Grade A',
    quantity: 180,
    unit: 'butir',
    unitPrice: 2700,
    discount: 0,
    totalAmount: 486000,
    paidAmount: 486000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pelanggan C',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-26T14:00:00Z',
  },
  {
    id: 'SALE-202609-004',
    date: '2026-09-25',
    customerName: 'Pasar Tradisional',
    productType: 'Telur Layer Grade A',
    quantity: 150,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 420000,
    paidAmount: 420000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TUNAI',
    notes: 'Pasar',
    createdBy: 'Santoso',
    createdAt: '2026-09-25T08:20:00Z',
  },
  {
    id: 'SALE-202609-005',
    date: '2026-09-24',
    customerName: 'Pelanggan A',
    productType: 'Telur Layer Grade A',
    quantity: 100,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 280000,
    paidAmount: 280000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pelanggan A',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-24T11:00:00Z',
  },
  {
    id: 'SALE-202609-006',
    date: '2026-09-22',
    customerName: 'Toko Kue Makmur',
    productType: 'Telur Layer Grade A',
    quantity: 300,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 840000,
    paidAmount: 840000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Order rutin mingguan',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-22T10:00:00Z',
  },
  {
    id: 'SALE-202609-007',
    date: '2026-09-20',
    customerName: 'Warung Bu Sri',
    productType: 'Telur Layer Grade A',
    quantity: 250,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 700000,
    paidAmount: 700000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TUNAI',
    notes: 'Langganan warung',
    createdBy: 'Santoso',
    createdAt: '2026-09-20T09:00:00Z',
  },
  {
    id: 'SALE-202609-008',
    date: '2026-09-18',
    customerName: 'Pelanggan B',
    productType: 'Telur Layer Grade A',
    quantity: 220,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 616000,
    paidAmount: 616000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pelanggan B',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-18T13:30:00Z',
  },
  {
    id: 'SALE-202609-009',
    date: '2026-09-15',
    customerName: 'Katering Sejahtera',
    productType: 'Telur Layer Grade A',
    quantity: 400,
    unit: 'butir',
    unitPrice: 2750,
    discount: 0,
    totalAmount: 1100000,
    paidAmount: 1100000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pesanan katering acara',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-15T15:00:00Z',
  },
  {
    id: 'SALE-202609-010',
    date: '2026-09-12',
    customerName: 'Pelanggan C',
    productType: 'Telur Layer Grade A',
    quantity: 250,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 700000,
    paidAmount: 700000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pelanggan C',
    createdBy: 'Santoso',
    createdAt: '2026-09-12T11:30:00Z',
  },
  {
    id: 'SALE-202609-011',
    date: '2026-09-08',
    customerName: 'Pasar Tradisional',
    productType: 'Telur Layer Grade A',
    quantity: 350,
    unit: 'butir',
    unitPrice: 2750,
    discount: 0,
    totalAmount: 962500,
    paidAmount: 962500,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TUNAI',
    notes: 'Pasar',
    createdBy: 'Santoso',
    createdAt: '2026-09-08T08:00:00Z',
  },
  {
    id: 'SALE-202609-012',
    date: '2026-09-05',
    customerName: 'Toko Roti Manis',
    productType: 'Telur Layer Grade A',
    quantity: 300,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 840000,
    paidAmount: 840000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Langganan roti',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-05T14:15:00Z',
  },
  {
    id: 'SALE-202609-013',
    date: '2026-09-02',
    customerName: 'Pelanggan A',
    productType: 'Telur Layer Grade A',
    quantity: 210,
    unit: 'butir',
    unitPrice: 2800,
    discount: 0,
    totalAmount: 588000,
    paidAmount: 588000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pelanggan A',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-02T10:00:00Z',
  },
  {
    id: 'SALE-202609-014',
    date: '2026-09-01',
    customerName: 'Petani Organik Subur',
    productType: 'Pupuk Kotoran Ayam',
    quantity: 25,
    unit: 'karung',
    unitPrice: 20000,
    discount: 0,
    totalAmount: 500000,
    paidAmount: 500000,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TUNAI',
    notes: 'Penjualan kotoran ayam sampingan',
    createdBy: 'Santoso',
    createdAt: '2026-09-01T09:00:00Z',
  },
  {
    id: 'SALE-202609-015',
    date: '2026-09-01',
    customerName: 'Warga Sekitar',
    productType: 'Telur Retak/Pecah Kulit',
    quantity: 35,
    unit: 'butir',
    unitPrice: 2500,
    discount: 0,
    totalAmount: 87500,
    paidAmount: 87500,
    paymentStatus: 'LUNAS',
    paymentMethod: 'TUNAI',
    notes: 'Telur retak harga diskon',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-01T17:00:00Z',
  },
];

let expensesData: ExpenseItem[] = [
  {
    id: 'EXP-202609-001',
    date: '2026-09-27',
    category: 'Pakan',
    vendor: 'PT Charoen Pokphand / Agen Pakan',
    itemName: 'Pakan Layer 50kg',
    quantity: 1,
    unit: 'karung',
    unitPrice: 320000,
    totalAmount: 320000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-1',
    paymentMethod: 'TRANSFER_BANK',
    paymentStatus: 'LUNAS',
    notes: 'Pakan Layer 50kg',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-27T08:00:00Z',
  },
  {
    id: 'EXP-202609-002',
    date: '2026-09-25',
    category: 'Kesehatan',
    vendor: 'Poultry Shop Sehat',
    itemName: 'Vitamin Ayam',
    quantity: 1,
    unit: 'botol',
    unitPrice: 150000,
    totalAmount: 150000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-2',
    paymentMethod: 'TUNAI',
    notes: 'Vitamin Ayam',
    createdBy: 'Santoso',
    createdAt: '2026-09-25T11:00:00Z',
  },
  {
    id: 'EXP-202609-003',
    date: '2026-09-22',
    category: 'Operasional',
    vendor: 'PLN & PDAM',
    itemName: 'Listrik & Air',
    quantity: 1,
    unit: 'bulan',
    unitPrice: 100000,
    totalAmount: 100000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-1',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Listrik & Air',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-22T10:00:00Z',
  },
  {
    id: 'EXP-202609-004',
    date: '2026-09-20',
    category: 'Peralatan',
    vendor: 'Toko Ternak Makmur',
    itemName: 'Tempat Minum',
    quantity: 5,
    unit: 'unit',
    unitPrice: 17000,
    totalAmount: 85000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-2',
    paymentMethod: 'TUNAI',
    notes: 'Tempat Minum',
    createdBy: 'Santoso',
    createdAt: '2026-09-20T14:30:00Z',
  },
  {
    id: 'EXP-202609-005',
    date: '2026-09-18',
    category: 'Perawatan',
    vendor: 'Apotek Ternak Jaya',
    itemName: 'Obat Cacing',
    quantity: 1,
    unit: 'botol',
    unitPrice: 75000,
    totalAmount: 75000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-1',
    paymentMethod: 'TUNAI',
    notes: 'Obat Cacing',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-18T09:15:00Z',
  },
  {
    id: 'EXP-202609-006',
    date: '2026-09-15',
    category: 'Pakan',
    vendor: 'Agen Pakan Sumber Rejeki',
    itemName: 'Pakan Layer 50kg (4 Sak)',
    quantity: 4,
    unit: 'karung',
    unitPrice: 320000,
    totalAmount: 1280000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-2',
    paymentMethod: 'TRANSFER_BANK',
    paymentStatus: 'LUNAS',
    notes: 'Restock pakan mingguan',
    createdBy: 'Santoso',
    createdAt: '2026-09-15T10:00:00Z',
  },
  {
    id: 'EXP-202609-007',
    date: '2026-09-10',
    category: 'Pakan',
    vendor: 'Agen Pakan Sumber Rejeki',
    itemName: 'Pakan Layer 50kg (4 Sak)',
    quantity: 4,
    unit: 'karung',
    unitPrice: 320000,
    totalAmount: 1280000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-1',
    paymentMethod: 'TRANSFER_BANK',
    paymentStatus: 'LUNAS',
    notes: 'Restock pakan mingguan',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-10T09:30:00Z',
  },
  {
    id: 'EXP-202609-008',
    date: '2026-09-05',
    category: 'Pakan',
    vendor: 'Agen Pakan Sumber Rejeki',
    itemName: 'Pakan Layer 50kg (4 Sak)',
    quantity: 4,
    unit: 'karung',
    unitPrice: 320000,
    totalAmount: 1280000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-2',
    paymentMethod: 'TRANSFER_BANK',
    paymentStatus: 'LUNAS',
    notes: 'Restock pakan mingguan',
    createdBy: 'Santoso',
    createdAt: '2026-09-05T10:30:00Z',
  },
  {
    id: 'EXP-202609-009',
    date: '2026-09-04',
    category: 'Kemasan',
    vendor: 'Pabrik Kemasan Telur',
    itemName: 'Tray Karton Telur (150 pcs)',
    quantity: 150,
    unit: 'pcs',
    unitPrice: 2000,
    totalAmount: 300000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-1',
    paymentMethod: 'TRANSFER_BANK',
    paymentStatus: 'LUNAS',
    notes: 'Pembelian tray telur',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-04T13:00:00Z',
  },
  {
    id: 'EXP-202609-010',
    date: '2026-09-02',
    category: 'Operasional',
    vendor: 'BBM & Kurir',
    itemName: 'Transportasi & Antar Telur',
    quantity: 1,
    unit: 'paket',
    unitPrice: 250000,
    totalAmount: 250000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-2',
    paymentMethod: 'TUNAI',
    paymentStatus: 'LUNAS',
    notes: 'Biaya BBM pengiriman',
    createdBy: 'Santoso',
    createdAt: '2026-09-02T16:00:00Z',
  },
  {
    id: 'EXP-202609-011',
    date: '2026-09-01',
    category: 'Kesehatan',
    vendor: 'Poultry Sehat',
    itemName: 'Disinfektan & Sanitasi Kandang',
    quantity: 2,
    unit: 'botol',
    unitPrice: 140000,
    totalAmount: 280000,
    assetClassification: 'OPERASIONAL',
    payerPartnerId: 'partner-1',
    paymentMethod: 'TRANSFER_BANK',
    paymentStatus: 'LUNAS',
    notes: 'Sanitasi bulanan kandang',
    createdBy: 'Kurniawan',
    createdAt: '2026-09-01T08:00:00Z',
  },
];

let inventoryData: InventoryItem[] = [
  {
    id: 'INV-001',
    name: 'Pakan Ayam',
    category: 'PAKAN',
    unit: 'karung',
    currentQuantity: 5,
    minQuantity: 3,
    unitPrice: 320000,
    status: 'Aman',
    lastRestockedDate: '2026-09-27',
    notes: 'Pakan layer masa produksi 50kg',
    updatedAt: '2026-09-27T18:00:00Z',
  },
  {
    id: 'INV-002',
    name: 'Vitamin',
    category: 'VITAMIN_OBAT',
    unit: 'botol',
    currentQuantity: 3,
    minQuantity: 2,
    unitPrice: 150000,
    status: 'Cukup',
    lastRestockedDate: '2026-09-25',
    notes: 'Vitamin perangsang telur & imun',
    updatedAt: '2026-09-25T12:00:00Z',
  },
  {
    id: 'INV-003',
    name: 'Sekam',
    category: 'SEKAM',
    unit: 'karung',
    currentQuantity: 2,
    minQuantity: 2,
    unitPrice: 25000,
    status: 'Cukup',
    lastRestockedDate: '2026-09-10',
    notes: 'Sekam alas kandang dan kotoran',
    updatedAt: '2026-09-20T10:00:00Z',
  },
  {
    id: 'INV-004',
    name: 'Obat-obatan',
    category: 'VITAMIN_OBAT',
    unit: 'item',
    currentQuantity: 6,
    minQuantity: 3,
    unitPrice: 45000,
    status: 'Aman',
    lastRestockedDate: '2026-09-18',
    notes: 'Antibiotik, obat cacing, & antiseptik',
    updatedAt: '2026-09-18T10:00:00Z',
  },
  {
    id: 'INV-005',
    name: 'Tempat Minum Otomatis',
    category: 'PERALATAN',
    unit: 'unit',
    currentQuantity: 15,
    minQuantity: 5,
    unitPrice: 17000,
    status: 'Aman',
    lastRestockedDate: '2026-09-20',
    notes: 'Nipple drinker cadangan',
    updatedAt: '2026-09-20T14:30:00Z',
  },
  {
    id: 'INV-006',
    name: 'Tray Karton Telur',
    category: 'KEMASAN',
    unit: 'pcs',
    currentQuantity: 120,
    minQuantity: 50,
    unitPrice: 2000,
    status: 'Aman',
    lastRestockedDate: '2026-09-04',
    notes: 'Tray isi 30 butir',
    updatedAt: '2026-09-04T13:00:00Z',
  },
];

let capitalInvestmentsData: CapitalContribution[] = [
  {
    id: 'CAP-001',
    partnerId: 'partner-1',
    partnerName: 'Kurniawan & Santoso',
    type: 'MODAL_AWAL',
    category: 'Modal Awal',
    itemName: 'Ayam Layer',
    quantity: 500,
    unit: 'ekor',
    amount: 15000000,
    date: '2026-01-01',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pembelian bibit pullet ayam layer siap bertelur 500 ekor',
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'CAP-002',
    partnerId: 'partner-1',
    partnerName: 'Kurniawan & Santoso',
    type: 'MODAL_AWAL',
    category: 'Modal Awal',
    itemName: 'Kandang',
    quantity: 1,
    unit: 'paket',
    amount: 25000000,
    date: '2026-01-01',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Pembangunan kandang semi closed & instalasi baterai',
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'CAP-003',
    partnerId: 'partner-1',
    partnerName: 'Kurniawan & Santoso',
    type: 'MODAL_AWAL',
    category: 'Modal Awal',
    itemName: 'Peralatan',
    quantity: 1,
    unit: 'paket',
    amount: 5000000,
    date: '2026-01-01',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Instalasi tandon air, pompa, timbangan & blower',
    createdAt: '2026-01-01T08:00:00Z',
  },
  {
    id: 'CAP-004',
    partnerId: 'partner-1',
    partnerName: 'Kas Usaha CimCim',
    type: 'SETORAN_TAMBAHAN',
    category: 'Inventaris',
    itemName: 'Tempat Pakan',
    quantity: 10,
    unit: 'unit',
    amount: 1500000,
    date: '2026-01-05',
    paymentMethod: 'TRANSFER_BANK',
    notes: 'Tempat pakan pipa paralon PVC tebal',
    createdAt: '2026-01-05T09:00:00Z',
  },
];

let dailyProductions: DailyProduction[] = [
  {
    id: 'PROD-202609-28',
    date: '2026-09-28',
    totalHens: 495,
    eggsGood: 96,
    eggsBroken: 2,
    totalEggs: 98,
    feedConsumptionKg: 55,
    mortalityCount: 0,
    notes: 'Kondisi ayam sehat, cuaca cerah',
    recordedBy: 'Kurniawan',
    createdAt: '2026-09-28T17:00:00Z',
  },
  {
    id: 'PROD-202609-27',
    date: '2026-09-27',
    totalHens: 495,
    eggsGood: 94,
    eggsBroken: 1,
    totalEggs: 95,
    feedConsumptionKg: 55,
    mortalityCount: 0,
    notes: 'Produksi stabil',
    recordedBy: 'Santoso',
    createdAt: '2026-09-27T17:00:00Z',
  },
  {
    id: 'PROD-202609-26',
    date: '2026-09-26',
    totalHens: 495,
    eggsGood: 97,
    eggsBroken: 1,
    totalEggs: 98,
    feedConsumptionKg: 56,
    mortalityCount: 0,
    notes: 'Pemberian vitamin',
    recordedBy: 'Kurniawan',
    createdAt: '2026-09-26T17:00:00Z',
  },
];

let monthlyReportsData: MonthlyReport[] = [
  {
    id: 'REP-2026-09',
    period: '2026-09',
    year: 2026,
    month: 9,
    monthName: 'September 2026',
    revenueTotal: 8450000,
    expenseTotal: 5320000,
    netOperatingProfit: 3130000,
    reservesAmount: 0,
    previousLossDeduction: 0,
    distributableProfit: 3130000,
    partner1Share: 1565000,
    partner2Share: 1565000,
    partner1Approved: false,
    partner2Approved: false,
    status: 'DRAFT',
    version: 1,
    notes: 'Laporan operasional bulan September 2026 berjalan lancar.',
    createdAt: '2026-09-27T10:00:00Z',
    updatedAt: '2026-09-27T18:00:00Z',
  },
  {
    id: 'REP-2026-08',
    period: '2026-08',
    year: 2026,
    month: 8,
    monthName: 'Agustus 2026',
    revenueTotal: 9300000,
    expenseTotal: 6200000,
    netOperatingProfit: 3100000,
    reservesAmount: 0,
    previousLossDeduction: 0,
    distributableProfit: 3100000,
    partner1Share: 1550000,
    partner2Share: 1550000,
    partner1Approved: true,
    partner1ApprovedAt: '2026-09-01T10:00:00Z',
    partner1ApprovedBy: 'Kurniawan',
    partner2Approved: true,
    partner2ApprovedAt: '2026-09-01T11:30:00Z',
    partner2ApprovedBy: 'Santoso',
    status: 'LOCKED',
    lockedAt: '2026-09-01T11:30:00Z',
    lockedBy: 'Santoso',
    version: 1,
    notes: 'Laporan Agustus selesai dan telah ditransfer penuh.',
    createdAt: '2026-08-31T20:00:00Z',
    updatedAt: '2026-09-01T11:30:00Z',
  },
];

let auditLogs: AuditLog[] = [
  {
    id: 'LOG-001',
    timestamp: '2026-09-28T09:30:00Z',
    actorId: 'partner-1',
    actorName: 'Kurniawan',
    action: 'CREATE_SALE',
    entityType: 'SALE',
    entityId: 'SALE-202609-001',
    details: 'Input penjualan telur 120 butir (Rp 336.000) ke Pelanggan A',
  },
  {
    id: 'LOG-002',
    timestamp: '2026-09-27T08:00:00Z',
    actorId: 'partner-1',
    actorName: 'Kurniawan',
    action: 'CREATE_EXPENSE',
    entityType: 'EXPENSE',
    entityId: 'EXP-202609-001',
    details: 'Input pengeluaran pakan layer Rp 320.000',
  },
  {
    id: 'LOG-003',
    timestamp: '2026-09-25T11:00:00Z',
    actorId: 'partner-2',
    actorName: 'Santoso',
    action: 'CREATE_EXPENSE',
    entityType: 'EXPENSE',
    entityId: 'EXP-202609-002',
    details: 'Input pembelian vitamin ayam Rp 150.000',
  },
];

let appSettings: AppSettings = {
  businessName: 'CimCim Egg',
  tagline: 'Fresh Eggs, Better Days',
  currency: 'IDR',
  partner1Name: 'Kurniawan',
  partner1Email: 'kurniawan@cimcim.com',
  partner1Share: 50,
  partner2Name: 'Santoso',
  partner2Email: 'santoso@cimcim.com',
  partner2Share: 50,
  googleSheetId: process.env.GOOGLE_SHEET_ID || '',
  googleSheetConnected: Boolean(process.env.GOOGLE_SHEET_ID && process.env.GOOGLE_SERVICE_ACCOUNT_EMAIL),
  lastSyncedAt: new Date().toISOString(),
};

// Data Store Access Functions

export async function getDashboardData(period: string = '2026-09'): Promise<DashboardSummary> {
  const filteredSales = salesData.filter((s) => s.date.startsWith(period));
  const filteredExpenses = expensesData.filter((e) => e.date.startsWith(period));

  const totalSales = filteredSales.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const totalExpenses = filteredExpenses.reduce((acc, curr) => acc + curr.totalAmount, 0);
  const netProfit = totalSales - totalExpenses;
  const profitSharePerPartner = Math.round(netProfit * 0.5);

  const totalEggsThisMonth = 2850; // Total count for the month
  const averageEggsPerDay = 95;
  const eggDailyTarget = 100;

  const monthlyChartData = [
    { month: 'Jan', fullMonth: 'Januari', sales: 6000000, expenses: 4000000, netProfit: 2000000 },
    { month: 'Feb', fullMonth: 'Februari', sales: 7200000, expenses: 4800000, netProfit: 2400000 },
    { month: 'Mar', fullMonth: 'Maret', sales: 7500000, expenses: 4500000, netProfit: 3000000 },
    { month: 'Apr', fullMonth: 'April', sales: 9200000, expenses: 5800000, netProfit: 3400000 },
    { month: 'Mei', fullMonth: 'Mei', sales: 8900000, expenses: 5700000, netProfit: 3200000 },
    { month: 'Jun', fullMonth: 'Juni', sales: 7600000, expenses: 5200000, netProfit: 2400000 },
    { month: 'Jul', fullMonth: 'Juli', sales: 7400000, expenses: 5100000, netProfit: 2300000 },
    { month: 'Agu', fullMonth: 'Agustus', sales: 9300000, expenses: 6200000, netProfit: 3100000 },
    { month: 'Sep', fullMonth: 'September', sales: 8450000, expenses: 5320000, netProfit: 3130000 },
  ];

  let currentReport = monthlyReportsData.find((r) => r.period === period);
  if (!currentReport) {
    currentReport = {
      id: `REP-${period}`,
      period,
      year: parseInt(period.split('-')[0]),
      month: parseInt(period.split('-')[1]),
      monthName: `September 2026`,
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
    monthName: 'September 2026',
    year: 2026,
    totalSales,
    salesGrowthPercent: 12,
    totalExpenses,
    expenseGrowthPercent: 8,
    netProfit,
    netProfitGrowthPercent: 18,
    profitSharePerPartner,
    totalEggsThisMonth,
    eggProductionGrowthPercent: 10,
    averageEggsPerDay,
    eggDailyTarget,
    monthlyChartData,
    recentSales: salesData.slice(0, 5),
    recentExpenses: expensesData.slice(0, 5),
    inventoryStocks: inventoryData,
    capitalInvestments: capitalInvestmentsData,
    currentReport,
  };
}

export async function getAllSales(): Promise<SaleItem[]> {
  return [...salesData];
}

export async function addSale(sale: Omit<SaleItem, 'id' | 'createdAt'>): Promise<SaleItem> {
  const newSale: SaleItem = {
    ...sale,
    id: `SALE-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  salesData.unshift(newSale);

  // Sync to Google Sheet if connected
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
  if (salesData.length < initialLen) {
    addAuditLog(actorName, 'DELETE_SALE', 'SALE', id, `Hapus penjualan id: ${id}`);
    return true;
  }
  return false;
}

export async function getAllExpenses(): Promise<ExpenseItem[]> {
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
    newExpense.paymentStatus,
    newExpense.notes || '',
    newExpense.createdAt,
  ]);

  addAuditLog(newExpense.createdBy, 'CREATE_EXPENSE', 'EXPENSE', newExpense.id, `Tambah pengeluaran: ${newExpense.itemName} (Rp ${newExpense.totalAmount})`);
  return newExpense;
}

export async function deleteExpense(id: string, actorName: string): Promise<boolean> {
  const initialLen = expensesData.length;
  expensesData = expensesData.filter((e) => e.id !== id);
  if (expensesData.length < initialLen) {
    addAuditLog(actorName, 'DELETE_EXPENSE', 'EXPENSE', id, `Hapus pengeluaran id: ${id}`);
    return true;
  }
  return false;
}

export async function getAllInventory(): Promise<InventoryItem[]> {
  return [...inventoryData];
}

export async function updateInventoryStock(id: string, newQuantity: number, actorName: string): Promise<InventoryItem | null> {
  const item = inventoryData.find((i) => i.id === id);
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
  addAuditLog(actorName, 'CREATE_INVENTORY', 'INVENTORY', newItem.id, `Tambah barang baru: ${newItem.name}`);
  return newItem;
}

export async function getAllProductions(): Promise<DailyProduction[]> {
  return [...dailyProductions];
}

export async function addProduction(prod: Omit<DailyProduction, 'id' | 'createdAt'>): Promise<DailyProduction> {
  const newProd: DailyProduction = {
    ...prod,
    id: `PROD-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  dailyProductions.unshift(newProd);
  addAuditLog(newProd.recordedBy, 'RECORD_PRODUCTION', 'PRODUCTION', newProd.id, `Catat produksi ${newProd.date}: ${newProd.totalEggs} butir`);
  return newProd;
}

export async function getAllCapital(): Promise<CapitalContribution[]> {
  return [...capitalInvestmentsData];
}

export async function addCapital(cap: Omit<CapitalContribution, 'id' | 'createdAt'>, actorName: string): Promise<CapitalContribution> {
  const newCap: CapitalContribution = {
    ...cap,
    id: `CAP-${Date.now()}`,
    createdAt: new Date().toISOString(),
  };
  capitalInvestmentsData.unshift(newCap);
  addAuditLog(actorName, 'CREATE_CAPITAL', 'CAPITAL', newCap.id, `Tambah setoran modal/aset ${newCap.itemName} Rp ${newCap.amount}`);
  return newCap;
}

export async function getAllReports(): Promise<MonthlyReport[]> {
  return [...monthlyReportsData];
}

export async function getReportByPeriod(period: string): Promise<MonthlyReport | null> {
  return monthlyReportsData.find((r) => r.period === period) || null;
}

export async function approveMonthlyReport(
  period: string,
  partnerId: string,
  partnerName: string
): Promise<{ success: boolean; report?: MonthlyReport; message: string }> {
  let report = monthlyReportsData.find((r) => r.period === period);
  if (!report) {
    // initialize draft report
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

  // If both approved, lock the report!
  if (report.partner1Approved && report.partner2Approved) {
    report.status = 'LOCKED';
    report.lockedAt = new Date().toISOString();
    report.lockedBy = partnerName;
  } else {
    report.status = 'APPROVED_PARTIAL';
  }

  report.updatedAt = new Date().toISOString();

  addAuditLog(partnerName, 'APPROVE_REPORT', 'REPORT', report.id, `Mitra ${partnerName} menyetujui laporan bulanan ${period}. Status saat ini: ${report.status}`);
  return { success: true, report, message: `Persetujuan berhasil dicatat oleh ${partnerName}.` };
}

export async function getAuditLogs(): Promise<AuditLog[]> {
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
}

export async function getAppSettings(): Promise<AppSettings> {
  return { ...appSettings };
}

export async function updateAppSettings(settings: Partial<AppSettings>): Promise<AppSettings> {
  appSettings = { ...appSettings, ...settings };
  return { ...appSettings };
}
