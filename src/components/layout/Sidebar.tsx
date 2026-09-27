'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  Package,
  Activity,
  Wallet,
  Scale,
  FileText,
  Settings,
  LogOut,
  ChevronRight,
  Egg,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Partner } from '@/types';

interface SidebarProps {
  currentUser?: Partner | null;
}

export const NAV_ITEMS = [
  { label: 'Dashboard', href: '/', icon: LayoutDashboard },
  { label: 'Penjualan Telur', href: '/penjualan', icon: ShoppingCart },
  { label: 'Pengeluaran', href: '/pengeluaran', icon: Receipt },
  { label: 'Inventaris', href: '/inventaris', icon: Package },
  { label: 'Ayam & Produksi', href: '/produksi', icon: Activity },
  { label: 'Modal', href: '/modal', icon: Wallet },
  { label: 'Bagi Hasil', href: '/bagi-hasil', icon: Scale },
  { label: 'Laporan', href: '/laporan', icon: FileText },
  { label: 'Pengaturan', href: '/pengaturan', icon: Settings },
];

export default function Sidebar({ currentUser }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/login');
      router.refresh();
    } catch {
      router.push('/login');
    }
  };

  const user = currentUser || {
    id: 'partner-1',
    name: 'Kurniawan',
    role: 'Owner',
    avatarColor: '#D9531E',
  };

  return (
    <aside className="hidden lg:flex flex-col w-64 bg-white border-r border-slate-200 min-h-screen shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-5 flex items-center gap-3 border-b border-slate-100">
        <div className="w-10 h-10 rounded-xl bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100 shadow-sm">
          <svg className="w-6 h-6 fill-current text-orange-500" viewBox="0 0 24 24">
            <path d="M12 2C8.5 2 6 5.5 6 9.5c0 2.2.8 4.2 2.2 5.6C7.5 16.5 6 18 6 20h12c0-2-1.5-3.5-2.2-4.9 1.4-1.4 2.2-3.4 2.2-5.6C18 5.5 15.5 2 12 2zm0 2.5c2.5 0 4 2.5 4 5s-1.5 5-4 5-4-2.5-4-5 1.5-5 4-5z" />
          </svg>
        </div>
        <div>
          <h1 className="font-bold text-lg text-slate-900 leading-tight flex items-center gap-1">
            CimCim Egg
          </h1>
          <p className="text-xs text-slate-500 font-medium">Fresh Eggs, Better Days</p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150',
                isActive
                  ? 'bg-[#D9531E] text-white shadow-sm shadow-orange-950/10'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/70'
              )}
            >
              <Icon className={cn('w-4 h-4 shrink-0', isActive ? 'text-white' : 'text-slate-500')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>

      {/* User Card & Logout */}
      <div className="p-3 border-t border-slate-100 space-y-2">
        <Link
          href="/pengaturan"
          className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100/80 transition-colors border border-slate-100"
        >
          <div className="flex items-center gap-2.5">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center text-white font-semibold text-sm shadow-sm"
              style={{ backgroundColor: user.avatarColor || '#D9531E' }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500 capitalize">{user.role.toLowerCase()}</p>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-400" />
        </Link>

        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-slate-600 hover:text-red-600 hover:bg-red-50 rounded-xl transition-colors"
        >
          <LogOut className="w-4 h-4 text-slate-400 group-hover:text-red-600" />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
