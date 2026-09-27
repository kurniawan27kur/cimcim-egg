'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  LayoutDashboard,
  ShoppingCart,
  Receipt,
  FileText,
  LogOut,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { NAV_ITEMS } from './Sidebar';
import { Partner } from '@/types';

interface MobileNavProps {
  currentUser?: Partner | null;
}

export default function MobileNav({ currentUser }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const user = currentUser || {
    id: 'partner-1',
    name: 'Kurniawan',
    role: 'Owner',
    avatarColor: '#D9531E',
  };

  const bottomNavItems = [
    { label: 'Dashboard', href: '/', icon: LayoutDashboard },
    { label: 'Penjualan', href: '/penjualan', icon: ShoppingCart },
    { label: 'Pengeluaran', href: '/pengeluaran', icon: Receipt },
    { label: 'Laporan', href: '/laporan', icon: FileText },
  ];

  return (
    <>
      {/* Mobile Top Header */}
      <header className="lg:hidden sticky top-0 z-30 bg-white/95 backdrop-blur border-b border-slate-200 px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <button
            onClick={() => setIsOpen(true)}
            className="p-1.5 -ml-1 text-slate-700 hover:bg-slate-100 rounded-lg focus:outline-none"
            aria-label="Open menu"
          >
            <Menu className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
              <svg className="w-4 h-4 fill-current text-orange-500" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 6 5.5 6 9.5c0 2.2.8 4.2 2.2 5.6C7.5 16.5 6 18 6 20h12c0-2-1.5-3.5-2.2-4.9 1.4-1.4 2.2-3.4 2.2-5.6C18 5.5 15.5 2 12 2zm0 2.5c2.5 0 4 2.5 4 5s-1.5 5-4 5-4-2.5-4-5 1.5-5 4-5z" />
              </svg>
            </div>
            <span className="font-bold text-base text-slate-900">CimCim Egg</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Link
            href="/pengaturan"
            className="w-7 h-7 rounded-full flex items-center justify-center text-white font-bold text-xs"
            style={{ backgroundColor: user.avatarColor || '#D9531E' }}
          >
            {user.name.charAt(0)}
          </Link>
        </div>
      </header>

      {/* Drawer Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-slate-900/50 z-40 lg:hidden backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Mobile Drawer */}
      <div
        className={cn(
          'fixed inset-y-0 left-0 w-4/5 max-w-xs bg-white z-50 lg:hidden flex flex-col shadow-2xl transform transition-transform duration-300 ease-in-out',
          isOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="p-4 flex items-center justify-between border-b border-slate-100">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-600 border border-orange-100">
              <svg className="w-5 h-5 fill-current text-orange-500" viewBox="0 0 24 24">
                <path d="M12 2C8.5 2 6 5.5 6 9.5c0 2.2.8 4.2 2.2 5.6C7.5 16.5 6 18 6 20h12c0-2-1.5-3.5-2.2-4.9 1.4-1.4 2.2-3.4 2.2-5.6C18 5.5 15.5 2 12 2zm0 2.5c2.5 0 4 2.5 4 5s-1.5 5-4 5-4-2.5-4-5 1.5-5 4-5z" />
              </svg>
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 leading-tight">CimCim Egg</h2>
              <p className="text-[11px] text-slate-500">Fresh Eggs, Better Days</p>
            </div>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <nav className="flex-1 p-3 space-y-1 overflow-y-auto">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

            return (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setIsOpen(false)}
                className={cn(
                  'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-[#D9531E] text-white font-semibold shadow-sm'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                )}
              >
                <Icon className={cn('w-4 h-4', isActive ? 'text-white' : 'text-slate-500')} />
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-3 border-t border-slate-100 space-y-2">
          <div className="flex items-center gap-2.5 p-2 rounded-xl bg-slate-50 border border-slate-100">
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-semibold text-xs"
              style={{ backgroundColor: user.avatarColor || '#D9531E' }}
            >
              {user.name.charAt(0)}
            </div>
            <div className="text-left leading-tight">
              <p className="text-sm font-semibold text-slate-900">{user.name}</p>
              <p className="text-xs text-slate-500">{user.role}</p>
            </div>
          </div>
          <button
            onClick={async () => {
              await fetch('/api/auth/logout', { method: 'POST' });
              window.location.href = '/login';
            }}
            className="w-full flex items-center gap-2.5 px-3 py-2 text-sm font-medium text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-4 h-4 text-red-500" />
            <span>Logout</span>
          </button>
        </div>
      </div>

      {/* Mobile Bottom Navigation Bar */}
      <div className="lg:hidden fixed bottom-0 inset-x-0 bg-white border-t border-slate-200 z-30 px-3 py-2 flex items-center justify-around">
        {bottomNavItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== '/' && pathname.startsWith(item.href));

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex flex-col items-center justify-center gap-1 px-3 py-1 rounded-lg text-[11px] font-medium transition-colors',
                isActive ? 'text-[#D9531E] font-semibold' : 'text-slate-500 hover:text-slate-900'
              )}
            >
              <Icon className={cn('w-5 h-5', isActive ? 'text-[#D9531E]' : 'text-slate-400')} />
              <span>{item.label}</span>
            </Link>
          );
        })}
      </div>
    </>
  );
}
