import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'CimCim Egg - Sistem Manajemen Usaha Ayam Petelur & Bagi Hasil',
  description:
    'Aplikasi manajemen usaha ternak ayam petelur, pencatatan produksi telur, pembukuan pengeluaran harian, dan pembagian hasil 50:50 dua mitra transparan.',
  icons: {
    icon: '/favicon.ico',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full antialiased bg-[#F8F9FA]">
      <body className="min-h-full flex flex-col font-sans selection:bg-orange-100 selection:text-orange-900">
        {children}
      </body>
    </html>
  );
}
