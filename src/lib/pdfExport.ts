import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DashboardSummary } from '@/types';
import { formatIDR, formatDateID } from './utils';

export function generateMonthlyReportPDF(data: DashboardSummary) {
  const doc = new jsPDF();

  // Primary brand colors
  const primaryColor = [217, 83, 30]; // #D9531E
  const darkTextColor = [30, 41, 59];
  const mutedTextColor = [100, 116, 139];

  // Header Banner
  doc.setFillColor(255, 247, 237); // Light warm orange background
  doc.rect(0, 0, 210, 40, 'F');

  // Title
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(20);
  doc.setTextColor(primaryColor[0], primaryColor[1], primaryColor[2]);
  doc.text('CIMCIM EGG', 14, 20);

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.setTextColor(mutedTextColor[0], mutedTextColor[1], mutedTextColor[2]);
  doc.text('Sistem Manajemen Usaha Ternak Ayam Petelur & Bagi Hasil', 14, 27);
  doc.text(`Periode Laporan: ${data.monthName}`, 14, 34);

  doc.setFontSize(9);
  doc.text(`Dicetak pada: ${formatDateID(new Date().toISOString())}`, 140, 34);

  // Financial Summary Cards Table
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('1. Ringkasan Finansial Bulanan', 14, 50);

  autoTable(doc, {
    startY: 54,
    head: [['Indikator Finansial', 'Nilai (IDR)', 'Keterangan']],
    body: [
      ['Total Penjualan / Pendapatan', formatIDR(data.totalSales), '+12% dari bulan sebelumnya'],
      ['Total Pengeluaran Operasional', formatIDR(data.totalExpenses), 'Pakan, vitamin, listrik, operasional'],
      ['Laba Bersih Operasional', formatIDR(data.netProfit), 'Penjualan - Pengeluaran'],
      ['Cadangan Kas Disepakati', 'Rp 0', 'Sesuai kesepakatan mitra'],
      ['Laba Yang Dapat Dibagikan', formatIDR(data.netProfit), 'Dasar pembagian hasil 50:50'],
    ],
    theme: 'striped',
    headStyles: { fillColor: [217, 83, 30], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
  });

  // Profit Sharing 50:50 Section
  const nextY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('2. Skema Pembagian Hasil (50% : 50%)', 14, nextY);

  autoTable(doc, {
    startY: nextY + 4,
    head: [['Mitra', 'Porsi', 'Nominal Pembagian', 'Status Persetujuan']],
    body: [
      [
        'Partner 1 (Kurniawan)',
        '50%',
        formatIDR(data.profitSharePerPartner),
        data.currentReport.partner1Approved ? 'DISETUJUI & TANDATANGAN DIGITAL' : 'DRAFT / BELUM DISETUJUI',
      ],
      [
        'Partner 2 (Santoso)',
        '50%',
        formatIDR(data.profitSharePerPartner),
        data.currentReport.partner2Approved ? 'DISETUJUI & TANDATANGAN DIGITAL' : 'DRAFT / BELUM DISETUJUI',
      ],
    ],
    theme: 'grid',
    headStyles: { fillColor: [40, 122, 104], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
  });

  // Recent Sales Table
  const salesY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text('3. Rincian Penjualan Utama', 14, salesY);

  autoTable(doc, {
    startY: salesY + 4,
    head: [['Tanggal', 'Pelanggan', 'Kuantitas', 'Harga Satuan', 'Total (IDR)']],
    body: data.recentSales.map((s) => [
      formatDateID(s.date),
      s.customerName,
      `${s.quantity} ${s.unit}`,
      formatIDR(s.unitPrice),
      formatIDR(s.totalAmount),
    ]),
    theme: 'plain',
    headStyles: { fillColor: [240, 240, 240], textColor: [30, 41, 59], fontStyle: 'bold' },
    styles: { fontSize: 8 },
  });

  // Dual Signature Block
  const sigY = (doc as any).lastAutoTable.finalY + 18;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);

  doc.text('Persetujuan Mitra 1 (Owner):', 20, sigY);
  doc.text(data.currentReport.partner1Approved ? '✓ Disetujui Secara Digital' : '(Menunggu Persetujuan)', 20, sigY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Kurniawan', 20, sigY + 22);

  doc.setFont('helvetica', 'normal');
  doc.text('Persetujuan Mitra 2 (Partner):', 130, sigY);
  doc.text(data.currentReport.partner2Approved ? '✓ Disetujui Secara Digital' : '(Menunggu Persetujuan)', 130, sigY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text('Santoso', 130, sigY + 22);

  // Save PDF
  doc.save(`Laporan_Keuangan_CimCimEgg_${data.period}.pdf`);
}
