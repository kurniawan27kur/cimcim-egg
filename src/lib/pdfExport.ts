import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { DashboardSummary, Partner } from '@/types';
import { formatIDR, formatDateID } from './utils';

export function generateMonthlyReportPDF(data: DashboardSummary, partners?: Partner[]) {
  const doc = new jsPDF();

  const p1Name = partners?.[0]?.name || data.currentReport.partner1ApprovedBy || 'Mitra 1';
  const p1Role = partners?.[0]?.role || 'Owner';
  const p1Share = partners?.[0]?.sharePercent ?? 50;

  const p2Name = partners?.[1]?.name || data.currentReport.partner2ApprovedBy || 'Mitra 2';
  const p2Role = partners?.[1]?.role || 'Partner';
  const p2Share = partners?.[1]?.sharePercent ?? 50;

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
  doc.text('CIMCIM FARM', 14, 20);

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
      ['Total Penjualan / Pendapatan', formatIDR(data.totalSales), 'Total transaksi penjualan bulan ini'],
      ['Total Pengeluaran Operasional', formatIDR(data.totalExpenses), 'Pakan, vitamin, operasional, & aset'],
      ['Laba Bersih Operasional', formatIDR(data.netProfit), 'Penjualan − Pengeluaran'],
      ['Cadangan Kas Disepakati', 'Rp 0', 'Sesuai kesepakatan mitra'],
      ['Laba Yang Dapat Dibagikan', formatIDR(data.netProfit), `Dasar pembagian hasil (${p1Share}% : ${p2Share}%)`],
    ],
    theme: 'striped',
    headStyles: { fillColor: [217, 83, 30], textColor: [255, 255, 255] },
    styles: { fontSize: 9 },
  });

  // Profit Sharing Section
  const nextY = (doc as any).lastAutoTable.finalY + 12;
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(13);
  doc.setTextColor(darkTextColor[0], darkTextColor[1], darkTextColor[2]);
  doc.text(`2. Skema Pembagian Hasil (${p1Share}% : ${p2Share}%)`, 14, nextY);

  autoTable(doc, {
    startY: nextY + 4,
    head: [['Mitra', 'Porsi', 'Nominal Pembagian', 'Status Persetujuan']],
    body: [
      [
        `${p1Name} (${p1Role})`,
        `${p1Share}%`,
        formatIDR(data.profitSharePerPartner),
        data.currentReport.partner1Approved ? 'DISETUJUI & TANDATANGAN DIGITAL' : 'DRAFT / BELUM DISETUJUI',
      ],
      [
        `${p2Name} (${p2Role})`,
        `${p2Share}%`,
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

  doc.text(`Persetujuan Mitra 1 (${p1Role}):`, 20, sigY);
  doc.text(data.currentReport.partner1Approved ? '✓ Disetujui Secara Digital' : '(Menunggu Persetujuan)', 20, sigY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(data.currentReport.partner1ApprovedBy || p1Name, 20, sigY + 22);

  doc.setFont('helvetica', 'normal');
  doc.text(`Persetujuan Mitra 2 (${p2Role}):`, 130, sigY);
  doc.text(data.currentReport.partner2Approved ? '✓ Disetujui Secara Digital' : '(Menunggu Persetujuan)', 130, sigY + 14);
  doc.setFont('helvetica', 'bold');
  doc.text(data.currentReport.partner2ApprovedBy || p2Name, 130, sigY + 22);

  // Save PDF
  doc.save(`Laporan_Keuangan_CimCimFarm_${data.period}.pdf`);
}
