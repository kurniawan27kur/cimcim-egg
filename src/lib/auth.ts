import { Partner, UserRole } from '@/types';
import { cookies } from 'next/headers';
import { readSheetRows } from './googleSheets';

export const DEFAULT_PARTNERS: Partner[] = [
  {
    id: 'partner-1',
    name: 'Kurniawan',
    email: 'mrsin178@gmail.com',
    role: 'OWNER',
    sharePercent: 50,
    avatarColor: '#D9531E',
    phone: '081234567890',
    pin: '123456',
    status: 'ACTIVE',
    password: 'password123',
  },
  {
    id: 'partner-2',
    name: 'Santoso',
    email: 'santoso@cimcim.com',
    role: 'PARTNER',
    sharePercent: 50,
    avatarColor: '#0284C7',
    phone: '081298765432',
    pin: '654321',
    status: 'ACTIVE',
    password: 'password123',
  },
];

export const PARTNERS_DB = DEFAULT_PARTNERS;

export const AUTH_COOKIE_NAME = 'cimcim_auth_session';

export interface SessionData {
  userId: string;
  name: string;
  email: string;
  role: string;
  sharePercent: number;
  loginAt: string;
}

/**
 * Fetch all partners from Google Sheet 'Mitra' tab with fallback to default partners
 */
export async function getAllPartners(): Promise<Partner[]> {
  try {
    const sheetRows = await readSheetRows('Mitra');
    if (sheetRows && sheetRows.length > 0) {
      return sheetRows.map((row, idx) => ({
        id: row[0] || `partner-${idx + 1}`,
        name: row[1] || `Mitra ${idx + 1}`,
        email: (row[2] || '').trim(),
        role: ((row[3] || '').toUpperCase() as UserRole) || (idx === 0 ? 'OWNER' : 'PARTNER'),
        sharePercent: Number(row[4]) || 50,
        avatarColor: row[5] || (idx === 0 ? '#D9531E' : '#0284C7'),
        phone: row[6] || '',
        pin: String(row[7] || '123456').trim(),
        status: ((row[8] || 'ACTIVE').toUpperCase() as 'ACTIVE' | 'INACTIVE'),
        password: String(row[9] || 'password123').trim(),
      }));
    }
  } catch (err) {
    console.error('Failed to load partners from Google Sheet:', err);
  }
  return DEFAULT_PARTNERS;
}

/**
 * Encodes session data to a base64 string
 */
export function encodeSession(data: SessionData): string {
  const jsonStr = JSON.stringify(data);
  return Buffer.from(jsonStr).toString('base64url');
}

/**
 * Decodes session data from base64 string
 */
export function decodeSession(token: string): SessionData | null {
  try {
    const jsonStr = Buffer.from(token, 'base64url').toString('utf-8');
    return JSON.parse(jsonStr) as SessionData;
  } catch {
    return null;
  }
}

/**
 * Get current authenticated user from server cookies & dynamic partner list
 */
export async function getCurrentUser(): Promise<Partner | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = decodeSession(token);
    if (!session) return null;

    const partners = await getAllPartners();
    const partner = partners.find(
      (p) => p.id === session.userId || p.email.toLowerCase() === session.email.toLowerCase()
    );
    return partner || null;
  } catch {
    return null;
  }
}

/**
 * Validate PIN for digital approval
 */
export async function verifyPartnerPin(partnerId: string, inputPin: string): Promise<boolean> {
  const partners = await getAllPartners();
  const partner = partners.find((p) => p.id === partnerId);
  if (!partner) return false;
  return partner.pin === inputPin.trim();
}
