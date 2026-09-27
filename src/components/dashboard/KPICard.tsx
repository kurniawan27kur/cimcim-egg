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
    <div className="bg-white rounded-2xl p-5 border border-slate-200/80 shadow-2xs hover:shadow-xs transition-shadow">
      <div className="flex items-start gap-3.5">
        <div
          className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 border ${style.bgColor} ${style.borderColor}`}
        >
          <Icon className={`w-5 h-5 ${style.iconColor}`} />
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-slate-500 truncate">{title}</p>
          
          <div className="flex items-baseline gap-2 mt-1 flex-wrap">
            <h3 className="text-xl sm:text-2xl font-bold text-slate-900 tracking-tight tabular-nums">
              {formatIDR(value)}
            </h3>

            {growthPercent !== undefined && (
              <span
                className={`inline-flex items-center gap-0.5 px-1.5 py-0.5 rounded-full text-[11px] font-semibold ${
                  type === 'expenses'
                    ? 'bg-rose-50 text-rose-600'
                    : 'bg-emerald-50 text-emerald-700'
                }`}
              >
                <ArrowUpRight className="w-3 h-3" />
                {growthPercent}%
              </span>
            )}
          </div>

          <p className="text-[11px] text-slate-400 mt-1 font-normal truncate">
            {subtitle || 'dari bulan lalu'}
          </p>
        </div>
      </div>
    </div>
  );
}
