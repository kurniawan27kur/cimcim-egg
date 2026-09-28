# 🐔 PRODUCT REQUIREMENTS DOCUMENT (PRD v2.0)
## CimCim Farm — Sistem Manajemen Usaha Ayam Petelur & Bagi Hasil Transparan

---

| Dokumen | Spesifikasi Detail |
| :--- | :--- |
| **Nama Proyek** | CimCim Farm (CimCim Egg Management System) |
| **Tagline** | *"Fresh Eggs, Better Days"* |
| **Versi Dokumen** | **Versi 2.0 (Comprehensive Realized Specification)** |
| **Tanggal Pembaruan**| 28 September 2026 |
| **Status** | Production Ready / Implemented Baseline |
| **Tech Stack** | Next.js 16 (App Router), TypeScript, Tailwind CSS, Google Sheets API v4, jsPDF |
| **Deployment Target**| Vercel Serverless Platform |
| **Skema Kemitraan** | 2 Mitra (Owner: Kurniawan 50%, Partner: Tedy 50%) |

---

## 1. Ringkasan Eksekutif & Identitas Produk

### 1.1 Latar Belakang
CimCim Farm adalah platform web aplikasi internal terintegrasi yang dirancang khusus untuk mengelola operasional peternakan ayam petelur (*layer poultry farm*) dan sistem pembagian hasil (*profit sharing*) 50:50 secara transparan, akurat, dan dapat dipertanggungjawabkan (*audit-ready*).

Aplikasi ini menyatukan pencatatan modal awal & investasi aset, pemantauan populasi dan produksi harian ayam petelur (*Hen-Day Laying Rate*), transaksi penjualan telur & produk sampingan, pengeluaran operasional harian, manajemen persediaan pakan & obat, hingga alur persetujuan digital (*Dual-PIN Digital Approval*) dan penutupan buku bulanan dengan pembuatan dokumen laporan PDF resmi.

### 1.2 Tujuan Utama (Product Goals)
1. **Single Source of Truth**: Menghilangkan pencatatan manual/terpisah dengan menyediakan satu platform terpusat yang otomatis tersinkronisasi ke Google Spreadsheet backend secara aman.
2. **Pemisahan Finansial yang Disiplin**: Memisahkan secara ketat antara Modal Awal/Investasi Aset, Biaya Operasional Rutin, dan Pendapatan Penjualan Telur agar tidak terjadi distorsi perhitungan laba usaha.
3. **Produksi & Produktivitas Ternak Terukur**: Memantau kesehatan dan produktivitas harian ayam petelur melalui metrik rasio telur utuh vs retak, mortalitas, konsumsi pakan harian, dan *Hen-Day Laying Rate %*.
4. **Bagi Hasil Transparan & Anti-Sengketa**: Menerapkan rumus bagi hasil 50:50 yang transparan dengan mekanisme persetujuan digital dua arah (*Dual-Partner Signature via 6-digit PIN*) sebelum laporan dikunci (*LOCKED*).
5. **Keamanan & Kepatuhan Server-Side**: Mengamankan data finansial melalui session token terenkripsi HMAC-SHA256, session guard penutupan tab, API route protection 401, serta jejak audit (*Audit Log Trail*) yang tidak dapat dimanipulasi.

### 1.3 Indikator Keberhasilan (KPI)
| Indikator | Target Kinerja | Metode Pengukuran |
| :--- | :--- | :--- |
| **Akurasi Finansial** | 100% rekonsiliasi antara kas, penjualan, dan pengeluaran | Formula validasi server-side & laporan P&L otomatis |
| **Integritas Bagi Hasil** | 0% selisih pembagian laba 50:50 antar mitra | Verifikasi PIN ganda dan penguncian periode bulanan |
| **Tingkat Keterisian Produksi** | Pencatatan harian panen telur & mortalitas realtime | Modul `/produksi` & tracking Hen-Day Laying Rate |
| **Keandalan Sinkronisasi** | 99.9% uptime sinkronisasi Google Sheets | Arsitektur data store hybrid in-memory + Sheets v4 API |
| **Keamanan Data** | Zero-leak kredensial dan sesi terlindungi | Edge Middleware, HTTP-only Cookie, HMAC sign, Audit Log |

---

## 2. Pengguna, Peran & Hak Akses (User Management)

Sistem menerapkan prinsip **Private Farm System** (Pendaftaran publik dimatikan). Akses hanya diberikan kepada dua mitra pengelola resmi:

```
┌─────────────────────────────────────────────────────────────┐
│                 CimCim Farm Authentication                  │
└──────────────────────────────┬──────────────────────────────┘
                               │
               ┌───────────────┴───────────────┐
               ▼                               ▼
    ┌──────────────────────┐        ┌──────────────────────┐
    │  Mitra A (Owner)     │        │  Mitra B (Partner)   │
    │  Nama: Kurniawan     │        │  Nama: Tedy       │
    │  Email:              │        │  Email:              │
    │  kurniawan@cimcim.com  │        │  teddy@cimcim.com  │
    │  Bagi Hasil: 50%     │        │  Bagi Hasil: 50%     │
    │  PIN Digital: 123456 │        │  PIN Digital: 654321 │
    └──────────────────────┘        └──────────────────────┘
```

### 2.1 Matriks Hak Akses & Peran

| Hak Akses / Fitur | Kurniawan (Owner - 50%) | Tedy (Partner - 50%) | Catatan Khusus |
| :--- | :---: | :---: | :--- |
| **Login & Autentikasi** | ✅ Ya | ✅ Ya | Email, Password, Session Cookie HMAC |
| **Lihat Dashboard Finansial** | ✅ Ya | ✅ Ya | Real-time KPI, Charts, Status Laporan |
| **Input Penjualan & Produk** | ✅ Ya | ✅ Ya | Otomatis catat `createdBy` & Audit Log |
| **Input Pengeluaran & Biaya** | ✅ Ya | ✅ Ya | Klasifikasi Operasional vs Aset Modal |
| **Pencatatan Panen & Produksi** | ✅ Ya | ✅ Ya | Hen-Day Laying Rate, Telur Rusak, Mortalitas |
| **Penyesuaian Stok Inventaris**| ✅ Ya | ✅ Ya | Stock IN, OUT, Opname Adjustment |
| **Input Modal & Investasi** | ✅ Ya | ✅ Ya | Catat setoran per mitra & aset kandang |
| **Tinjau Draf Bagi Hasil** | ✅ Ya | ✅ Ya | Draf nilai sebelum disahkan |
| **Persetujuan Digital (Approval)**| ✅ Ya (PIN 1) | ✅ Ya (PIN 2) | **Wajib kedua mitra** dengan PIN masing-masing |
| **Penguncian Laporan (Locked)**| 🔒 Bersama | 🔒 Bersama | Otomatis terkunci saat 2 mitra telah approve |
| **Cetak / Ekspor PDF Resmi** | ✅ Ya | ✅ Ya | Dilengkapi stempel tanda tangan digital |
| **Inisialisasi Google Sheets**| ✅ Ya | ✅ Ya | Pengaturan sinkronisasi 8 tab sheet |

---

## 3. Arsitektur Teknis & Pola Data

### 3.1 Arsitektur Sistem

```
┌────────────────────────────────────────────────────────────────────────┐
│                        CLIENT LAYER (Browser)                          │
│   Next.js 16 Client Components, Tailwind CSS, Recharts, Lucide Icons   │
│   Session Guard (Tab close listener) & PIN Digital Modal Verification  │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │ HTTP / HTTPS (JSON Payloads)
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                        EDGE MIDDLEWARE LAYER                           │
│   [src/middleware.ts]                                                  │
│   - Session Token Verification (HMAC-SHA256 decode)                    │
│   - Route Protection (/api/* -> 401, Web pages -> /login)              │
│   - Public whitelist: /login, /api/auth/login, /images, /favicon       │
└───────────────────────────────────┬────────────────────────────────────┘
                                    │
                                    ▼
┌────────────────────────────────────────────────────────────────────────┐
│                     SERVER & API ROUTE LAYER (Node.js)                 │
│   [src/app/api/*]                                                      │
│   - /api/auth (Login, Logout, Session, PIN Verify)                     │
│   - /api/dashboard, /api/sales, /api/expenses, /api/production         │
│   - /api/inventory, /api/capital, /api/reports, /api/sheets, /api/audit│
│   - Zero Frontend Leak: Credentials strictly kept on Server            │
└──────────────────┬─────────────────────────────────┬───────────────────┘
                   │                                 │
                   ▼                                 ▼
┌────────────────────────────────────┐ ┌─────────────────────────────────┐
│     IN-MEMORY STATE DATA STORE     │ │   GOOGLE SHEETS API v4 ENGINE   │
│ [src/lib/dataStore.ts]             │ │ [src/lib/googleSheets.ts]       │
│ - Ultra-fast responsive UI read    │ │ - Service Account JWT Auth      │
│ - Real-time filtering & aggregation│ │ - 8 Tab Schema Auto-Init        │
│ - Fallback & active data cache     │ │ - Real-time append, read, delete│
└────────────────────────────────────┘ └─────────────────────────────────┘
```

### 3.2 Definisi Skema Tab Google Sheets (Database Schema)

Sistem menggunakan 8 Tab Spreadsheet standar yang diinisialisasi otomatis via fungsi `initializeSheetTabs()`:

```
Tab 1: Mitra
Headers: ['id', 'name', 'email', 'role', 'sharePercent', 'avatarColor', 'phone', 'pin', 'status', 'pass']

Tab 2: Penjualan
Headers: ['id', 'date', 'customerName', 'productType', 'quantity', 'unit', 'unitPrice', 'discount', 'totalAmount', 'paidAmount', 'paymentStatus', 'paymentMethod', 'notes', 'createdAt']

Tab 3: Pengeluaran
Headers: ['id', 'date', 'category', 'vendor', 'itemName', 'quantity', 'unit', 'unitPrice', 'totalAmount', 'assetClassification', 'payerPartnerId', 'paymentMethod', 'paymentStatus', 'notes', 'createdAt']

Tab 4: Modal
Headers: ['id', 'partnerId', 'partnerName', 'type', 'category', 'itemName', 'quantity', 'unit', 'amount', 'date', 'paymentMethod', 'notes', 'createdAt']

Tab 5: Inventaris
Headers: ['id', 'name', 'category', 'unit', 'currentQuantity', 'minQuantity', 'unitPrice', 'status', 'updatedAt']

Tab 6: Produksi
Headers: ['id', 'date', 'totalHens', 'eggsGood', 'eggsBroken', 'totalEggs', 'feedConsumptionKg', 'mortalityCount', 'notes', 'recordedBy', 'createdAt']

Tab 7: LaporanBulanan
Headers: ['id', 'period', 'year', 'month', 'revenueTotal', 'expenseTotal', 'netOperatingProfit', 'reservesAmount', 'distributableProfit', 'partner1Share', 'partner2Share', 'partner1Approved', 'partner1ApprovedAt', 'partner2Approved', 'partner2ApprovedAt', 'status', 'lockedAt', 'updatedAt']

Tab 8: AuditLog
Headers: ['id', 'timestamp', 'actorName', 'action', 'entityType', 'entityId', 'details']
```

---

## 4. Ruang Lingkup & Spesifikasi Fitur Detail

### 4.1 Modul Login, Keamanan & Session Guard
* **Login Form**: Input email dan password dengan styling brand CimCim Farm.
* **Tamper-Proof Session**: Token sesi di-encode dan di-hash menggunakan SHA-256 HMAC dengan rahasia server (`AUTH_SECRET`).
* **Session Guard (On Tab Close)**: Client script yang mendeteksi event penutupan tab / browser untuk membersihkan kredensial sesi jika pengguna mengakhiri aktivitas.
* **Edge Middleware Interception**: Semua rute `/api/*` dan halaman aplikasi dilindungi secara ketat. Pengguna tanpa cookie valid langsung diarahkan ke `/login` atau menerima response JSON 401 Unauthorized.
* **Brute-Force & Credential Protection**: Tidak ada data sensitif (private key, password, PIN) yang dikirim ke client-side JavaScript.

### 4.2 Modul Dashboard Interaktif & Finansial Real-Time (`/`)
* **4 Kartu KPI Utama**:
  1. *Total Penjualan Bulan Ini* (+ indikator pertumbuhan).
  2. *Total Pengeluaran Operasional Bulan Ini*.
  3. *Laba Bersih Operasional* (`Penjualan - Pengeluaran`).
  4. *Estimasi Bagi Hasil Mitra* (50% dari Laba Bersih per mitra).
* **Grafik Finansial Bulanan**: Grafik batang & garis multi-axis (Recharts) menampilkan histori Penjualan, Pengeluaran, dan Laba Bersih per bulan (Jan - Des).
* **Widget Produksi Telur**: Progress bar capaian target panen harian, rata-rata panen per hari, dan total butir bulan berjalan.
* **Widget Stok Inventaris**: Indikator visual level stok (*Aman* (Hijau), *Cukup* (Kuning), *Kritis* (Merah)).
* **Widget Skema Bagi Hasil Transparan**: Diagram alur interaktif pembagian hasil 50:50 dengan indikator status approval Kurniawan & Tedy.
* **Daftar Transaksi Terbaru**: 5 Penjualan terbaru dan 5 Pengeluaran terbaru dengan tombol aksi cepat.

### 4.3 Modul Produksi Ayam & Panen Telur (`/produksi`)
* **Pencatatan Harian Komprehensif**:
  * Tanggal pencatatan (YYYY-MM-DD).
  * Populasi Ayam Layer Hidup (`totalHens`).
  * Jumlah Telur Utuh/Normal (`eggsGood`) dalam butir.
  * Jumlah Telur Retak/Rusak (`eggsBroken`) dalam butir.
  * Total Panen Telur Otomatis (`totalEggs = eggsGood + eggsBroken`).
  * Konsumsi Pakan Harian (`feedConsumptionKg`) dalam kilogram.
  * Mortalitas Ayam (`mortalityCount`) ayam mati pada hari tersebut.
  * Catatan kondisi kandang / cuaca.
* **Kalkulasi Otomatis Metrik Peternakan**:
  * **Hen-Day Laying Rate (%)**: `(Total Telur / Total Ayam Hidup) × 100%`.
  * **Rasio Kerusakan Telur (%)**: `(Telur Rusak / Total Telur) × 100%`.
  * **Rata-rata Konsumsi Pakan per Ekor**: `(Pakan Kg × 1000) / Total Ayam Hidup` (gram/ekor/hari).
* **Sinkronisasi Otomatis**: Tersimpan di Google Sheets tab `Produksi` dan tercatat pada Audit Log.

### 4.4 Modul Penjualan & Pemasukan (`/penjualan`)
* **Katalog Produk Multi-Tipe**:
  * Telur Layer Grade A (Utuh/Segar)
  * Telur Layer Grade B / Ukuran Sedang
  * Telur Retak / Konsumsi Cepat
  * Ayam Afkir (Layer Afkir)
  * Pupuk Kandang / Kotoran Ayam Olahan
* **Parameter Transaksi**:
  * Tanggal, Nama Pelanggan, Jenis Produk, Kuantitas, Satuan (`butir`, `kg`, `tray`), Harga Satuan, Diskon (IDR), Total Akhir (dihitung otomatis).
  * Status Pembayaran: `LUNAS`, `SEBAGIAN`, `BELUM_BAYAR` (Piutang).
  * Metode Pembayaran: `TUNAI`, `TRANSFER_BANK`, `QRIS`, `LAINNYA`.
* **Fitur Ekspor**: Ekspor data penjualan ke format file CSV dengan satu klik.

### 4.5 Modul Pengeluaran & Klasifikasi Biaya (`/pengeluaran`)
* **Kategori Pengeluaran Standar**:
  * `Pakan` (Konsentrat, Jagung, Dedak)
  * `Kesehatan` (Vitamin, Vaksin, Antibiotik, Disinfektan)
  * `Operasional` (Listrik, Air, Kebersihan, Sekam Kandang)
  * `Peralatan` (Tempat Pakan, Nipple Drinker, Egg Tray, Lampu)
  * `Perawatan` (Renovasi Kandang, Service Pompa Air)
  * `Pembelian Ayam` (Pullet Layer Siap Telur)
  * `Kandang` (Konstruksi / Perluasan Kandang)
  * `Kemasan` (Karton Tray, Plastik, Tali)
  * `Listrik & Air`
  * `Tenaga Kerja` (Upah Harian / Bonus)
  * `Transportasi` (Bensin, Ongkos Angkut)
  * `Lain-lain`
* **Klasifikasi Ketat Aset vs Beban Operasional**:
  * `OPERASIONAL`: Biaya rutin yang langsung mengurangi Laba Bersih periode berjalan.
  * `ASET_MODAL`: Pembelian aset tetap/investasi (misal: pembangunan kandang, pullet baru, peralatan mesin) yang dialokasikan ke modal/inventaris dan tidak memotong laba operasional harian secara sepihak.
  * `PRIBADI`: Penarikan atau beban pribadi mitra.
* **Pelacakan Sumber Dana**: Mencatat apakah dibayar dari `KAS_USAHA`, `Mitra 1 (Kurniawan)`, atau `Mitra 2 (Tedy)`.

### 4.6 Modul Inventaris & Penyesuaian Stok (`/inventaris`)
* **Kategori Inventaris**: `PAKAN`, `VITAMIN_OBAT`, `SEKAM`, `PERALATAN`, `KEMASAN`, `LAINNYA`.
* **Ambang Batas Status Stok 3-Level**:
  * 🟢 **Aman**: Stok saat ini > `minQuantity`.
  * 🟡 **Cukup**: Stok saat ini antara `minQuantity * 0.5` sampai `minQuantity`.
  * 🔴 **Kritis**: Stok saat ini $\le$ `minQuantity * 0.5`.
* **Modal Penyesuaian Stok (Stock Adjustment)**:
  * Modal interaktif untuk mencatat penyesuaian stok masuk (Restock), stok keluar (Pemakaian), atau koreksi fisik (Opname) dengan audit log otomatis.

### 4.7 Modul Modal Awal & Investasi (`/modal`)
* **Pencatatan Kontribusi Modal**:
  * Tipe: `MODAL_AWAL`, `SETORAN_TAMBAHAN`, `PENARIKAN`.
  * Kategori & Nama Barang/Aset: Misal Pullet Layer, Kandang Semi-Closed, Tempat Pakan Otomatis, Genset.
  * Mitra Penyetor: Kurniawan atau Tedy.
  * Nominal Modal (IDR), Tanggal, Metode Pembayaran, dan Catatan.
* **Prinsip Akuntansi Kemitraan**:
  * Modal Awal **bukan merupakan pendapatan/omzet penjualan** dan tidak dimasukkan ke dalam perhitungan laba bersih operasional.
  * Visualisasi rekapitulasi total investasi Kurniawan vs Tedy untuk menjaga transparansi kepemilikan aset.

### 4.8 Modul Bagi Hasil & Penutupan Bulanan (`/bagi-hasil`)
* **Siklus Hidup Laporan Bulanan (State Machine)**:

```
┌─────────────────────────────────────────────────────────────┐
│                      DRAFT STATE                            │
│  - Dihitung otomatis dari agregasi Penjualan & Pengeluaran  │
│  - Menunggu peninjauan kedua mitra                          │
└──────────────┬──────────────────────────────┬───────────────┘
               │                              │
               ▼ (Approve PIN Kurniawan)      ▼ (Approve PIN Tedy)
┌─────────────────────────────────────────────────────────────┐
│                 APPROVED_PARTIAL STATE                      │
│  - Salah satu mitra telah memverifikasi & memasukkan PIN    │
│  - Menunggu persetujuan mitra kedua                         │
└──────────────────────────────┬──────────────────────────────┘
                               │ (Approve PIN Mitra Kedua)
                               ▼
┌─────────────────────────────────────────────────────────────┐
│                     LOCKED STATE 🔒                         │
│  - Disetujui oleh KEDUA MITRA (Kurniawan & Tedy)         │
│  -流通 Tercatat Timestamp & Hash Approval masing-masing         │
│  - Data terkunci PERMANEN (Tidak dapat diedit sepihak)      │
│  - Dokumen PDF Siap Dicetak Resmi                           │
└─────────────────────────────────────────────────────────────┘
```

* **Formula Pembagian Hasil**:
  $$\text{Laba Bersih Operasional} = \sum \text{Penjualan Operasional} - \sum \text{Biaya Operasional Disepakati}$$
  $$\text{Laba Yang Dapat Dibagikan} = \text{Laba Bersih Operasional} - \text{Cadangan Kas Ditahan} - \text{Kompensasi Rugi Lalu}$$
  $$\text{Bagian Mitra 1 (Kurniawan)} = \text{Laba Yang Dapat Dibagikan} \times 50\%$$
  $$\text{Bagian Mitra 2 (Tedy)} = \text{Laba Yang Dapat Dibagikan} \times 50\%$$

* **Verifikasi PIN Digital 6-Digit**:
  * Saat tombol *"Setujui Laporan"* diklik, sistem memunculkan dialog verifikasi PIN digital khusus akun yang sedang login.
  * Verifikasi dieksekusi server-side (`verifyPartnerPin()`).

### 4.9 Modul Laporan Resmi & Ekspor PDF (`/laporan`)
* **Tampilan Laporan Tabular Finansial**:
  * Laporan Laba Rugi (P&L): Rincian omzet telur, jenis produk sampingan, rincian biaya pakan, operasional, dan margin bersih.
  * Laporan Arus Kas (Cash Flow): Arus kas masuk penjualan vs kas keluar operasional vs setoran modal.
  * Ringkasan Ekuitas & Bagi Hasil 50:50.
* **Generator PDF Dokumen Resmi (`jspdf` + `jspdf-autotable`)**:
  * Header Dokumen Resmi CimCim Farm dengan palette Terracotta & Forest Green.
  * Tabel Ringkasan Finansial Bulanan.
  * Tabel Skema Pembagian Hasil 50:50 dan status tanda tangan digital masing-masing mitra.
  * Tabel Rincian Transaksi Penjualan Terbesar.
  * **Blok Dual Digital Signature** (Tanda tangan digital Kurniawan & Tedy dengan status validasi otomatis).
  * Penamaan file otomatis: `Laporan_Keuangan_CimCimFarm_YYYY-MM.pdf`.

### 4.10 Modul Pengaturan & Log Audit (`/pengaturan`)
* **Pengaturan Profil Usaha & Mitra**:
  * Nama Peternakan, Tagline, Mata Uang (IDR).
  * Data identitas mitra (Nama, Email, Porsi Saham 50%, Warna Avatar).
* **Diagnostik & Inisialisasi Google Sheets API**:
  * Indikator status koneksi Google Sheets API (Connected / Disconnected).
  * Menampilkan ID Spreadsheet yang terhubung.
  * Tombol **"Inisialisasi Tab & Skema Google Sheets"**: Membuat ke-8 tab dan header kolom secara otomatis jika sheet baru digunakan.
* **Log Audit Aktivitas (Audit Trail)**:
  * Riwayat pencatatan seluruh event kritis (`CREATE_SALE`, `DELETE_SALE`, `CREATE_EXPENSE`, `UPDATE_STOCK`, `RECORD_PRODUCTION`, `CREATE_CAPITAL`, `APPROVE_REPORT`).
  * Informasi kolom: ID Log, Waktu (WIB), Aktor (Nama Mitra), Aksi, Tipe Entitas, ID Entitas, dan Keterangan Rinci.
  * Pagination 1-halaman yang rapi dan nyaman dibaca.

---

## 5. Model Data & Tipe TypeScript (Data Contracts)

Berikut adalah struktur model data lengkap yang diterapkan pada aplikasi (`src/types/index.ts`):

```typescript
export type UserRole = 'OWNER' | 'PARTNER' | 'ADMIN';

export interface Partner {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  sharePercent: number; // 50
  avatarColor: string;
  phone?: string;
  pin: string; // 6-digit PIN
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
  payerPartnerId: string; // 'partner-1' | 'partner-2' | 'KAS_USAHA'
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
  unit: string;
  currentQuantity: number;
  minQuantity: number;
  unitPrice: number;
  status: StockStatus;
  lastRestockedDate?: string;
  notes?: string;
  updatedAt: string;
}

export interface DailyProduction {
  id: string;
  date: string; // YYYY-MM-DD
  totalHens: number;
  eggsGood: number;
  eggsBroken: number;
  totalEggs: number;
  feedConsumptionKg: number;
  mortalityCount: number;
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
  category: string;
  itemName: string;
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
  period: string; // 'YYYY-MM'
  year: number;
  month: number;
  monthName: string;
  revenueTotal: number;
  expenseTotal: number;
  netOperatingProfit: number;
  reservesAmount: number;
  previousLossDeduction: number;
  distributableProfit: number;
  partner1Share: number; // 50%
  partner2Share: number; // 50%
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
```

---

## 6. Aturan Bisnis & Validasi Perhitungan (Business Logic)

1. **Mata Uang & Format Tanggal**:
   - Mata uang resmi adalah **Indonesian Rupiah (IDR)** diformat dengan tanda pemisah ribuan titik (contoh: `Rp 1.250.000`).
   - Zona waktu acuan operasional adalah **WIB (Asia/Jakarta, UTC+7)**.
2. **Integritas Penjualan & Diskon**:
   - Total Transaksi Penjualan dihitung dari formula:
     $$\text{Total Transaksi} = (\text{Kuantitas} \times \text{Harga Satuan}) - \text{Diskon}$$
   - Nominal diskon tidak boleh melebihi nilai kotor $(\text{Kuantitas} \times \text{Harga Satuan})$.
3. **Pemisahan Modal dan Laba**:
   - Setoran modal awal atau modal tambahan dari Kurniawan maupun Tedy tidak dihitung sebagai pendapatan omzet penjualan.
   - Penarikan modal tidak dihitung sebagai beban operasional peternakan.
4. **Klasifikasi Pembelian Aset/Inventaris**:
   - Pengeluaran berkategori `ASET_MODAL` (misal pembelian indukan ayam, renovasi kandang, blower/exhaust) dikapitalisasi sebagai aset dan tidak memotong laba bersih operasional bulanan secara langsung.
5. **Ketetapan Skema Bagi Hasil 50:50**:
   - Porsi kepemilikan dan hak bagi hasil adalah setara 50% untuk Mitra 1 (Kurniawan) dan 50% untuk Mitra 2 (Tedy).
   - Apabila performa bulanan mengalami defisit/rugi ($\text{Net Profit} < 0$), maka nilai pembagian hasil adalah Rp 0 (tidak ada distribusi laba tunai).
6. **Immutabilitas Periode Terkunci (Locked Report)**:
   - Laporan berstatus `LOCKED` tidak dapat diubah kembali. Jika terdapat kesalahan input data masa lalu, koreksi dilakukan melalui transaksi penyesuaian (*Adjustment Journal*) pada periode berjalan yang tercatat di Audit Log.

---

## 7. Standar Desain UI/UX & Design Direction

### 7.1 Identitas Visual & Palet Warna
* **Warm Terracotta Orange** (`#D9531E`): Warna aksen brand utama, tombol call-to-action, highlight KPI bagi hasil.
* **Forest Green & Teal** (`#173B35`, `#287A68`, `#059669`): Warna kesegaran hasil peternakan, badge status aman, header tabel laporan.
* **Soft Off-White & Cream Surface** (`#F8F9FA`, `#FFF7ED`, `#FFFFFF`): Latar belakang bersih, tenang, tidak silau, dengan kontras tinggi untuk angka finansial.
* **Slate & Dark Charcoal** (`#1E293B`, `#334155`, `#64748B`): Tipografi tajam dan mudah dibaca.

### 7.2 Tipografi & Tata Letak
* **Font**: Sans-serif modern berbobot tinggi (Inter / Geist / Outfit) dengan format tabular angka (*tabular-nums*) untuk memudahkan perbandingan angka rupiah.
* **Navigasi Desktop**: Sidebar elegan di sisi kiri dengan logo maskot CimCim Farm, menu bergradien aktif, profil aktif pengguna, dan tombol logout.
* **Navigasi Mobile**: Bottom Navigation Bar 5-menu utama + Drawer menu lengkap yang responsif pada layar ponsel 360px - 430px tanpa horizontal scroll yang mengganggu.

---

## 8. Panduan Pengujian & Matriks Kriteria Penerimaan (UAT Matrix)

| Modul | Skenario Uji | Kriteria Hasil yang Diharapkan | Status |
| :--- | :--- | :--- | :---: |
| **Auth & Guard** | Akses rute `/penjualan` tanpa cookie sesi | Otomatis di-redirect ke `/login` | ✅ Lolos |
| **Auth & Guard** | Akses `/api/reports` tanpa cookie sesi | Mengembalikan HTTP Status 401 Unauthorized | ✅ Lolos |
| **Auth & Guard** | Login dengan email & password terdaftar | Berhasil masuk, set cookie HMAC terproteksi | ✅ Lolos |
| **Dashboard** | Kalkulasi 4 KPI Cards periode aktif | Menampilkan agregasi data real-time yang akurat | ✅ Lolos |
| **Produksi** | Input panen telur utuh, retak, pakan, mortalitas | Total panen & Hen-day rate terhitung presisi | ✅ Lolos |
| **Penjualan** | Input penjualan telur dengan diskon & piutang | Total amount terhitung benar & status tersimpan | ✅ Lolos |
| **Pengeluaran** | Input biaya pakan vs biaya beli kandang | Klasifikasi Operasional vs Aset terpisah rapi | ✅ Lolos |
| **Inventaris** | Update stok di bawah ambang batas minimum | Status berubah menjadi `Kritis` / `Cukup` | ✅ Lolos |
| **Bagi Hasil** | Approve oleh 1 mitra (misal Kurniawan) | Status berubah menjadi `APPROVED_PARTIAL` | ✅ Lolos |
| **Bagi Hasil** | Approve oleh mitra kedua (Tedy) dengan PIN | Status menjadi `LOCKED` & terkunci permanen | ✅ Lolos |
| **Laporan PDF** | Klik tombol *Cetak PDF Laporan Resmi* | File PDF terunduh dengan kop, tabel, & tanda tangan | ✅ Lolos |
| **Sheets Sync** | Klik *Inisialisasi Tab Google Sheets* | 8 Tab terbuat lengkap dengan header kolom | ✅ Lolos |

---

## 9. Roadmap Masa Depan (Future Enhancements)

1. **WhatsApp Notification Engine**: Pengiriman ringkasan harian panen telur dan pengingat persetujuan laporan bulanan otomatis ke WhatsApp Kurniawan & Tedy via Fonnte/Twilio API.
2. **Pencatatan Multi-Kandang**: Dukungan segregasi pencatatan jika CimCim Farm menambah unit kandang (Kandang A, Kandang B, dsb.).
3. **Pencatatan QRIS Otomatis / Payment Gateway**: Verifikasi pelunasan piutang pelanggan grosir telur melalui webhook payment gateway.
4. **Prediksi Kebutuhan Pakan & FCR Optimizer**: Analisis korelasi antara merek/komposisi pakan terhadap persentase produksi telur harian (*Egg Laying Efficiency*).

---

## 10. Glosarium Istilah Peternakan & Finansial

* **Ayam Layer**: Ayam betina dewasa yang dipelihara khusus untuk menghasilkan telur konsumsi.
* **Hen-Day Laying Rate**: Persentase jumlah butir telur yang dihasilkan dibagi dengan populasi ayam hidup pada hari tersebut.
* **Ayam Afkir**: Ayam petelur yang telah melewati masa puncak produksi ekonomis (biasanya di atas umur 80-90 minggu) untuk dijual sebagai ayam pedaging.
* **Tray Telur**: Tempat wadah meletakkan telur, standar 1 tray = 30 butir telur.
* **FCR (Feed Conversion Ratio)**: Perbandingan jumlah pakan yang dikonsumsi dengan berat/jumlah telur yang dihasilkan.
* **Dual-PIN Digital Approval**: Mekanisme pengesahan dokumen finansial yang mewajibkan input kode keamanan rahasia 6-digit dari kedua belah pihak mitra.
* **Locked Period**: Status buku kas bulanan yang telah difinalisasi dan ditutup sehingga tidak dapat diubah kembali demi menjaga validitas laporan keuangan.

---
*Dokumen ini dibuat dan disahkan sebagai acuan tunggal standar pengembangan dan operasional sistem CimCim Farm.*
