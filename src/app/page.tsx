'use client';

import React, { useState, useEffect } from 'react';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import Header from '@/components/layout/Header';
import KPICard from '@/components/dashboard/KPICard';
import IncomeExpenseChart from '@/components/dashboard/IncomeExpenseChart';
import EggProductionWidget from '@/components/dashboard/EggProductionWidget';
import InventoryStockWidget from '@/components/dashboard/InventoryStockWidget';
import RecentSalesWidget from '@/components/dashboard/RecentSalesWidget';
import RecentExpensesWidget from '@/components/dashboard/RecentExpensesWidget';
import ProfitSharingWidget from '@/components/dashboard/ProfitSharingWidget';
import CapitalInvestWidget from '@/components/dashboard/CapitalInvestWidget';
import AddSaleModal from '@/components/modals/AddSaleModal';
import AddExpenseModal from '@/components/modals/AddExpenseModal';
import ApproveReportModal from '@/components/modals/ApproveReportModal';
import { DashboardSummary, Partner } from '@/types';
import { generateMonthlyReportPDF } from '@/lib/pdfExport';
import { Plus, Download, Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const [period, setPeriod] = useState('2026-09');
  const [data, setData] = useState<DashboardSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<Partner | null>(null);

  // Modals
  const [isAddSaleOpen, setIsAddSaleOpen] = useState(false);
  const [isAddExpenseOpen, setIsAddExpenseOpen] = useState(false);
  const [isApproveOpen, setIsApproveOpen] = useState(false);

  const fetchDashboardData = async (selectedPeriod: string) => {
    try {
      setLoading(true);
      const res = await fetch(`/api/dashboard?period=${selectedPeriod}`);
      const json = await res.json();
      if (json.success && json.data) {
        setData(json.data);
      }
    } catch (err) {
      console.error('Failed to fetch dashboard data:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchCurrentUser = async () => {
    try {
      const res = await fetch('/api/auth/me');
      if (res.ok) {
        const json = await res.json();
        if (json.authenticated) {
          setCurrentUser(json.user);
        }
      }
    } catch {}
  };

  useEffect(() => {
    fetchDashboardData(period);
    fetchCurrentUser();
  }, [period]);

  const handlePeriodChange = (newPeriod: string) => {
    setPeriod(newPeriod);
  };

  if (!data && loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8F9FA]">
        <div className="flex flex-col items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-orange-100 flex items-center justify-center text-orange-600 animate-pulse">
            <Loader2 className="w-6 h-6 animate-spin" />
          </div>
          <p className="text-sm font-semibold text-slate-600">Memuat CimCim Egg Dashboard...</p>
        </div>
      </div>
    );
  }

  const d = data!;

  return (
    <div className="min-h-screen flex bg-[#F8F9FA] text-slate-900">
      {/* Sidebar for desktop */}
      <Sidebar currentUser={currentUser} />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 pb-20 lg:pb-8">
        {/* Mobile Header */}
        <MobileNav currentUser={currentUser} />

        <main className="p-4 sm:p-6 lg:p-8 max-w-[1440px] w-full mx-auto space-y-6">
          {/* Header */}
          <Header
            title="Dashboard"
            subtitle="Ringkasan usaha CimCim Egg bulan ini."
            currentPeriod={period}
            onPeriodChange={handlePeriodChange}
            actionButton={
              <div className="flex items-center gap-2">
                <button
                  onClick={() => generateMonthlyReportPDF(d)}
                  className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-xl transition-colors shadow-2xs"
                >
                  <Download className="w-3.5 h-3.5 text-slate-500" />
                  <span>PDF Laporan</span>
                </button>
                <button
                  onClick={() => setIsAddSaleOpen(true)}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-white bg-[#D9531E] hover:bg-orange-700 rounded-xl transition-all shadow-xs"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Penjualan</span>
                </button>
                <button
                  onClick={() => setIsAddExpenseOpen(true)}
                  className="hidden md:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-semibold text-rose-700 bg-rose-50 hover:bg-rose-100 border border-rose-200 rounded-xl transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Catat Biaya</span>
                </button>
              </div>
            }
          />

          {/* Top 4 KPI Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5">
            <KPICard
              type="sales"
              title="Total Penjualan"
              value={d.totalSales}
              growthPercent={d.salesGrowthPercent}
              subtitle="dari bulan lalu"
            />
            <KPICard
              type="expenses"
              title="Total Pengeluaran"
              value={d.totalExpenses}
              growthPercent={d.expenseGrowthPercent}
              subtitle="dari bulan lalu"
            />
            <KPICard
              type="profit"
              title="Laba Bersih"
              value={d.netProfit}
              growthPercent={d.netProfitGrowthPercent}
              subtitle="dari bulan lalu"
            />
            <KPICard
              type="sharing"
              title="Bagi Hasil (Masing-masing)"
              value={d.profitSharePerPartner}
              subtitle="50% : 50% dari laba bersih"
            />
          </div>

          {/* Main 2-Column Section matching Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start">
            {/* Left Main Column (65% width = 8 cols on desktop) */}
            <div className="lg:col-span-8 space-y-5">
              {/* Income & Expense Chart */}
              <IncomeExpenseChart data={d.monthlyChartData} />

              {/* Sub-grid with Recent Sales & Recent Expenses */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <RecentSalesWidget sales={d.recentSales} />
                <RecentExpensesWidget expenses={d.recentExpenses} />
              </div>

              {/* Profit Sharing Flow Widget */}
              <ProfitSharingWidget
                report={d.currentReport}
                totalSales={d.totalSales}
                totalExpenses={d.totalExpenses}
                netProfit={d.netProfit}
                partnerShare={d.profitSharePerPartner}
                monthName={d.monthName}
              />
            </div>

            {/* Right Column (35% width = 4 cols on desktop) */}
            <div className="lg:col-span-4 space-y-5">
              {/* Egg Production Widget */}
              <EggProductionWidget
                totalEggs={d.totalEggsThisMonth}
                growthPercent={d.eggProductionGrowthPercent}
                averagePerDay={d.averageEggsPerDay}
                targetPerDay={d.eggDailyTarget}
              />

              {/* Inventory Stock Widget */}
              <InventoryStockWidget items={d.inventoryStocks} />

              {/* Capital & Investment Widget */}
              <CapitalInvestWidget investments={d.capitalInvestments} />
            </div>
          </div>
        </main>
      </div>

      {/* Modals */}
      <AddSaleModal
        isOpen={isAddSaleOpen}
        onClose={() => setIsAddSaleOpen(false)}
        onSuccess={() => fetchDashboardData(period)}
      />
      <AddExpenseModal
        isOpen={isAddExpenseOpen}
        onClose={() => setIsAddExpenseOpen(false)}
        onSuccess={() => fetchDashboardData(period)}
      />
      <ApproveReportModal
        isOpen={isApproveOpen}
        report={d.currentReport}
        onClose={() => setIsApproveOpen(false)}
        onSuccess={() => fetchDashboardData(period)}
      />
    </div>
  );
}
