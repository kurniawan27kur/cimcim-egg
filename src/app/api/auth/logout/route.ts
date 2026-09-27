import { NextResponse } from 'next/server';
import { AUTH_COOKIE_NAME, getCurrentUser } from '@/lib/auth';
import { addAuditLog } from '@/lib/dataStore';

export async function POST() {
  const user = await getCurrentUser();
  if (user) {
    addAuditLog(user.name, 'USER_LOGOUT', 'AUTH', user.id, `Mitra ${user.name} keluar dari sistem.`);
  }

  const response = NextResponse.json({ success: true, message: 'Berhasil keluar.' });
  response.cookies.delete(AUTH_COOKIE_NAME);
  return response;
}
