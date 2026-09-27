# 🐔 CimCim Egg - Sistem Manajemen Usaha Ternak Ayam Petelur & Bagi Hasil

Aplikasi web manajemen usaha peternakan ayam petelur (*layer poultry farm*) dan sistem pembagian hasil (*profit sharing*) transparan 50:50 untuk dua mitra, dibangun dengan **Next.js 16 + TypeScript**, **Tailwind CSS**, dan integrasi **Google Sheets API**.

---

## 📸 Antarmuka & Referensi Visual

Desain aplikasi dibangun mengikuti referensi visual dashboard **CimCim Egg**:
* **Palet Warna & Brand**: *Warm Terracotta Orange* (`#D9531E`), *Forest Green & Teal* (`#173B35`, `#287A68`, `#059669`), *Soft Off-White Surface* (`#F8F9FA`).
* **Sidebar & Navigasi**: Logo khas CimCim Egg (*"Fresh Eggs, Better Days"*), item menu bergradien aktif, kartu profil pengguna dengan avatar owner, dan tombol logout.
* **4 KPI Cards Utama**: Total Penjualan, Total Pengeluaran, Laba Bersih, dan Bagi Hasil (Masing-masing 50%).
* **Grafik Pemasukan & Pengeluaran**: Visualisasi multi-axis batang dan garis laba bersih bulanan (Recharts).
* **Skema Bagi Hasil Transparan**: Diagram alur `[Total Penjualan] - [Total Pengeluaran] = [Laba Bersih]`, bercabang ke Mitra 1 (50%) dan Mitra 2 (50%).
* **Widget Pendukung**: Produksi Telur (progress bar target), Stok Barang (status badge *Aman*, *Cukup*, *Kritis*), dan Modal & Investasi.
* **Responsif**: Mendukung layar desktop, tablet, dan smartphone dengan *mobile drawer* dan *bottom navigation bar*.

---

## 🔑 Akun Mitra Terdaftar (Skema 50:50)

Sesuai aturan PRD, pendaftaran publik dimatikan dan akses dibatasi untuk dua mitra:

| Nama Mitra | Email | Peran | Porsi Bagi Hasil | Default Password | Default PIN Digital |
| :--- | :--- | :--- | :---: | :--- | :---: |
| **Kurniawan** | `kurniawan@cimcim.com` | Owner / Mitra A | 50% | `password123` | `123456` |
| **Santoso** | `santoso@cimcim.com` | Partner / Mitra B | 50% | `password123` | `654321` |

---

## 🚀 Fitur Utama

1. **Dashboard Eksekutif**:
   * Ringkasan performa finansial real-time, grafik tren bulanan, 5 penjualan & 5 pengeluaran terbaru, status stok, dan ringkasan bagi hasil.
2. **Pencatatan Penjualan Telur (`/penjualan`)**:
   * Pencatatan kuantitas (butir/kg/tray), harga satuan, diskon, status pembayaran (Lunas / Piutang), filter pelanggan, dan ekspor data CSV.
3. **Pencatatan Pengeluaran & Biaya (`/pengeluaran`)**:
   * Kategori lengkap: Pakan, Kesehatan & Vitamin, Operasional (Listrik & Air), Peralatan, Perawatan, Kemasan.
   * **Kepatuhan PRD**: Klasifikasi jelas antara *Biaya Operasional* (mengurangi laba bulan berjalan) vs *Aset/Modal* (tercatat sebagai inventaris).
4. **Inventaris & Manajemen Stok (`/inventaris`)**:
   * Pelacakan persediaan pakan, vitamin, sekam, dan obat-obatan.
   * Peringatan otomatis stok minimum (*Aman*, *Cukup*, *Kritis*) dan modal penyesuaian stok (*Stock Adjustment*).
5. **Ayam & Produksi Telur (`/produksi`)**:
   * Pemantauan populasi ayam hidup, pencatatan telur utuh vs telur retak, perhitungan *Hen-Day Laying Rate %*, konsumsi pakan harian, dan mortalitas.
6. **Modal & Investasi (`/modal`)**:
   * Pencatatan kontribusi modal awal dan aset (Ayam layer, Kandang semi-closed, Peralatan, Tempat pakan).
   * Modal awal dipisahkan dari pendapatan penjualan dan tidak dihitung sebagai laba usaha.
7. **Bagi Hasil & Penutupan Bulanan (`/bagi-hasil`)**:
   * Formula perhitungan: `Pendapatan Usaha - Biaya Operasional Disepakati = Laba Bersih Dibagikan`.
   * **Dual-Partner Digital Approval**: Laporan memerlukan verifikasi PIN digital dari Kurniawan DAN Santoso.
   * **Penguncian Laporan (Locked)**: Setelah kedua mitra menyetujui, laporan dikunci permanen untuk menjaga integritas data.
8. **Laporan & Ekspor Resmi (`/laporan`)**:
   * Laporan Laba Rugi (P&L), Laporan Arus Kas (*Cash Flow*), dan Laporan Ekuitas.
   * Pembuat dokumen PDF resmi (*printable statement*) dengan tanda tangan digital kedua mitra via `jspdf` & `jspdf-autotable`.
9. **Pengaturan & Audit Log (`/pengaturan`)**:
   * Pemeriksaan status koneksi Google Sheets API, inisialisasi skema tab sheet, dan log audit seluruh aktivitas sistem.

---

## 📊 Integrasi Google Sheets API

Sistem menggunakan arsitektur *hybrid data engine*:
1. **Cloud Production**: Backend mengakses Google Spreadsheet via Google Sheets API (menggunakan Service Account).
2. **Zero-Frontend Leak**: Kredensial dan token hanya diproses di server-side API routes Next.js.
3. **Struktur Tab Otomatis**: Fitur inisialisasi satu-klik membuat seluruh tab (`Mitra`, `Penjualan`, `Pengeluaran`, `Modal`, `Inventaris`, `Produksi`, `LaporanBulanan`, `AuditLog`) beserta header kolom standar.

### Konfigurasi Environment Variables (Vercel / `.env.local`):

```bash
# Email Service Account Google Cloud
GOOGLE_SERVICE_ACCOUNT_EMAIL="cimcim-sync@your-project.iam.gserviceaccount.com"

# Private Key Google Service Account (termasuk tag BEGIN dan END)
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvgIBADANBgkqhkiG9w0BAQEFAASCBKgwggSkAgEAAoIBAQD...\n-----END PRIVATE KEY-----\n"

# Spreadsheet ID dari URL Google Sheets
GOOGLE_SHEET_ID="1A2B3C4D5E6F7G8H9I0J_your_spreadsheet_id"
```

---

## 💻 Menjalankan Proyek Secara Lokal

1. **Clone repository & Install dependencies**:
   ```bash
   npm install
   ```

2. **Jalankan Development Server**:
   ```bash
   npm run dev
   ```
   Buka [http://localhost:3000](http://localhost:3000) pada browser Anda.

3. **Build & Validasi Produksi**:
   ```bash
   npm run build
   ```

---

## 🛡️ Keamanan & Kepatuhan

* **Autentikasi Server-Side**: Session cookie HTTP-only dengan perlindungan CSRF.
* **Security Headers**: Dilengkapi CSP, X-Frame-Options, X-Content-Type-Options, dan Referrer-Policy.
* **Audit Trail**: Setiap input, perubahan stok, dan persetujuan laporan dicatat dengan timestamp dan nama aktor.
