import { NextRequest, NextResponse } from 'next/server';

/**
 * Admin Auth API — validates passphrase and sets session cookie.
 * 
 * POST /api/admin/auth
 * Body: { passphrase: string }
 * 
 * On success: Sets 'sk_admin_session' cookie and returns { success: true }
 * On failure: Returns 401
 */
export async function POST(request: NextRequest) {
  try {
    const { passphrase } = await request.json();
    const expectedPassphrase = process.env.ADMIN_PASSPHRASE;
    const sessionSecret = process.env.ADMIN_SESSION_SECRET;

    if (!expectedPassphrase || !sessionSecret) {
      console.error('[ADMIN AUTH] Missing ADMIN_PASSPHRASE or ADMIN_SESSION_SECRET env vars');
      return NextResponse.json(
        { error: 'Admin authentication is not configured.' },
        { status: 503 }
      );
    }

    // Constant-time comparison to prevent timing attacks
    if (
      !passphrase ||
      passphrase.length !== expectedPassphrase.length ||
      !timingSafeEqual(passphrase, expectedPassphrase)
    ) {
      return NextResponse.json(
        { error: 'Invalid passphrase.' },
        { status: 401 }
      );
    }

    // Set HTTP-only session cookie (expires in 8 hours)
    const response = NextResponse.json({ success: true });
    response.cookies.set('sk_admin_session', sessionSecret, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 8 * 60 * 60, // 8 hours
      path: '/',
    });

    return response;
  } catch (error: any) {
    console.error('[ADMIN AUTH] Error:', error.message);
    return NextResponse.json(
      { error: 'Authentication failed.' },
      { status: 500 }
    );
  }
}

/**
 * Simple constant-time string comparison to prevent timing attacks.
 * Uses XOR-based comparison so execution time doesn't reveal partial matches.
 */
function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let result = 0;
  for (let i = 0; i < a.length; i++) {
    result |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return result === 0;
}
