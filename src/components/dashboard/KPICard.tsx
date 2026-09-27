'use client';

import React from 'react';
import { ShoppingBag, Receipt, CheckCircle2, Users, ArrowUpRight } from 'lucide-react';
import { formatIDR } from '@/lib/utils';

interface KPICardProps {
  type: 'sales' | 'expenses' | 'profit' | 'sharing';
  title: string;
  value: number;
  growthPercent?: number;
  subtitle?: string;
}

export default function KPICard({
  type,
  title,
  value,
  growthPercent,
  subtitle,
}: KPICardProps) {
  const getIconAndStyle = () => {
    switch (type) {
      case 'sales':
        return {
          icon: ShoppingBag,
          bgColor: 'bg-[#E8F8F5]',
          iconColor: 'text-[#10B981]',
          borderColor: 'border-[#D1FAE5]',
        };
      case 'expenses':
        return {
          icon: Receipt,
          bgColor: 'bg-[#FEE2E2]/60',
          iconColor: 'text-[#EF4444]',
          borderColor: 'border-[#FEE2E2]',
        };
      case 'profit':
        return {
          icon: CheckCircle2,
          bgColor: 'bg-[#E0F2FE]',
          iconColor: 'text-[#0284C7]',
          borderColor: 'border-[#BAE6FD]',
        };
      case 'sharing':
      default:
        return {
          icon: Users,
          bgColor: 'bg-[#FFEDD5]',
          iconColor: 'text-[#EA580C]',
          borderColor: 'border-[#FED7AA]',
        };
    }
  };

  const style = getIconAndStyle();
  const Icon = style.icon;

  return (
    <div className="bg-white rounded-2xl p-3.5 sm:p-4 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-center gap-3">
        <div
          className={`w-9 h-9 sm:w-10 sm:h-10 rounded-xl flex items-center justify-center shrink-0 border ${style.bgColor} ${style.borderColor}`}
        >
          <Icon className={`w-4 h-4 sm:w-5 sm:h-5 ${style.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between gap-1">
            <p className="text-[11px] sm:text-xs font-medium text-slate-500 truncate">{title}</p>
            {growthPercent !== undefined && (
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded-full text-[10px] font-bold shrink-0 ${
                  type === 'expenses'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <ArrowUpRight className="w-2.5 h-2.5" />
                {growthPercent}%
              </span>
            )}
          </div>

          <div className="flex items-baseline justify-between gap-1 mt-0.5">
            <h3 className="text-base sm:text-lg lg:text-xl font-bold text-slate-900 tracking-tight tabular-nums truncate">
              {formatIDR(value)}
            </h3>
          </div>

          <p className="text-[10px] text-slate-400 font-normal truncate mt-0.5">
            {subtitle || 'bulan ini'}
          </p>
        </div>
      </div>
    </div>
  );
}
