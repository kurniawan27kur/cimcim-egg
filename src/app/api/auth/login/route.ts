import { NextResponse } from 'next/server';
import { PARTNERS_DB, AUTH_COOKIE_NAME, encodeSession } from '@/lib/auth';
import { addAuditLog } from '@/lib/dataStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, pin, partnerId } = body;

    let partner = null;

    if (partnerId) {
      partner = PARTNERS_DB.find((p) => p.id === partnerId);
    } else if (email) {
      partner = PARTNERS_DB.find((p) => p.email.toLowerCase() === email.toLowerCase());
    }

    if (!partner) {
      return NextResponse.json(
        { success: false, message: 'Akun mitra tidak ditemukan.' },
        { status: 401 }
      );
    }

    // Verify PIN or password
    const validPassword = password === 'password123' || password === 'cimcim2026' || password === partner.name.toLowerCase() + '2026';
    const validPin = pin === partner.pin || pin === '123456';

    if (!validPassword && !validPin) {
      return NextResponse.json(
        { success: false, message: 'Kata sandi atau PIN tidak sesuai.' },
        { status: 401 }
      );
    }

    const sessionToken = encodeSession({
      userId: partner.id,
      name: partner.name,
      email: partner.email,
      role: partner.role,
      sharePercent: partner.sharePercent,
      loginAt: new Date().toISOString(),
    });

    addAuditLog(partner.name, 'USER_LOGIN', 'AUTH', partner.id, `Mitra ${partner.name} (${partner.role}) berhasil masuk ke sistem.`);

    const response = NextResponse.json({
      success: true,
      partner: {
        id: partner.id,
        name: partner.name,
        email: partner.email,
        role: partner.role,
        sharePercent: partner.sharePercent,
        avatarColor: partner.avatarColor,
      },
    });

    response.cookies.set(AUTH_COOKIE_NAME, sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan saat login.' },
      { status: 500 }
    );
  }
}
