import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Format number to Indonesian Rupiah currency format
 * Example: 8450000 -> "Rp 8.450.000"
 */
export function formatIDR(amount: number | null | undefined): string {
  if (amount === undefined || amount === null || isNaN(amount)) return 'Rp 0';
  const isNegative = amount < 0;
  const abs = Math.abs(Math.round(amount));
  const formatted = new Intl.NumberFormat('id-ID', {
    style: 'decimal',
    maximumFractionDigits: 0,
  }).format(abs);
  return `${isNegative ? '- Rp ' : 'Rp '}${formatted}`;
}

/**
 * Format standard number with dot thousand separator
 * Example: 2850 -> "2.850"
 */
export function formatNumber(num: number | null | undefined): string {
  if (num === undefined || num === null || isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}

/**
 * Format date into Indonesian readable format
 * Example: "2026-09-28" -> "28 Sep 2026"
 */
export function formatDateID(dateStr: string | null | undefined): string {
  if (!dateStr) return '-';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr;
    const months = [
      'Jan', 'Feb', 'Mar', 'Apr', 'Mei', 'Jun',
      'Jul', 'Agu', 'Sep', 'Okt', 'Nov', 'Des'
    ];
    const d = date.getDate();
    const m = months[date.getMonth()];
    const y = date.getFullYear();
    return `${d} ${m} ${y}`;
  } catch {
    return dateStr;
  }
}

/**
 * Format date & time into Indonesian readable format
 */
export function formatDateTimeID(isoString: string | null | undefined): string {
  if (!isoString) return '-';
  try {
    const date = new Date(isoString);
    if (isNaN(date.getTime())) return isoString;
    const dateFormatted = formatDateID(isoString);
    const hours = String(date.getHours()).padStart(2, '0');
    const mins = String(date.getMinutes()).padStart(2, '0');
    return `${dateFormatted}, ${hours}:${mins} WIB`;
  } catch {
    return isoString;
  }
}

/**
 * Generate unique record ID
 */
export function generateId(prefix: string = 'REC'): string {
  const timestamp = Date.now().toString(36).toUpperCase();
  const randomStr = Math.random().toString(36).substring(2, 6).toUpperCase();
  return `${prefix}-${timestamp}-${randomStr}`;
}

/**
 * Calculate Hen-Day laying percentage
 */
export function calculateLayingRate(eggs: number, hens: number): number {
  if (!hens || hens <= 0) return 0;
  return Math.min(100, Math.round((eggs / hens) * 1000) / 10);
}
