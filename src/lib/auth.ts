import { Partner } from '@/types';
import { cookies } from 'next/headers';

export const PARTNERS_DB: Partner[] = [
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
  },
];

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
 * Get current authenticated user from server cookies
 */
export async function getCurrentUser(): Promise<Partner | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(AUTH_COOKIE_NAME)?.value;
    if (!token) return null;

    const session = decodeSession(token);
    if (!session) return null;

    const partner = PARTNERS_DB.find((p) => p.id === session.userId || p.email === session.email);
    return partner || null;
  } catch {
    return null;
  }
}

/**
 * Validate PIN for digital approval
 */
export function verifyPartnerPin(partnerId: string, inputPin: string): boolean {
  const partner = PARTNERS_DB.find((p) => p.id === partnerId);
  if (!partner) return false;
  return partner.pin === inputPin.trim();
}
