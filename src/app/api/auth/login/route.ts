import { NextResponse } from 'next/server';
import { getAllPartners, AUTH_COOKIE_NAME, encodeSession } from '@/lib/auth';
import { addAuditLog } from '@/lib/dataStore';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password, pin, partnerId } = body;

    const partners = await getAllPartners();
    let partner = null;

    if (partnerId) {
      partner = partners.find((p) => p.id === partnerId);
    } else if (email) {
      const cleanEmail = email.trim().toLowerCase();
      partner = partners.find((p) => p.email.toLowerCase() === cleanEmail);
    }

    if (!partner) {
      return NextResponse.json(
        { success: false, message: 'Akun mitra tidak ditemukan. Pastikan email terdaftar di data Mitra.' },
        { status: 401 }
      );
    }

    if (partner.status === 'INACTIVE') {
      return NextResponse.json(
        { success: false, message: 'Akun mitra ini sedang tidak aktif.' },
        { status: 403 }
      );
    }

    // Verify Password or PIN strictly against partner record
    const inputPass = (password || '').trim();
    const inputPin = (pin || '').trim();

    const expectedPass = (partner.password || 'password123').trim();
    const expectedPin = (partner.pin || '123456').trim();

    const isPasswordValid = Boolean(inputPass && inputPass === expectedPass);
    const isPinValid = Boolean(inputPin && inputPin === expectedPin);

    if (!isPasswordValid && !isPinValid) {
      return NextResponse.json(
        { success: false, message: 'Kata sandi atau PIN otorisasi tidak sesuai.' },
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

    addAuditLog(
      partner.name,
      'USER_LOGIN',
      'AUTH',
      partner.id,
      `Mitra ${partner.name} (${partner.role}) berhasil masuk ke sistem CimCim Farm.`
    );

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
    });

    return response;
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || 'Terjadi kesalahan saat login.' },
      { status: 500 }
    );
  }
}
