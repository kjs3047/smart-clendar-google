import { NextRequest, NextResponse } from 'next/server';
import { oauth2Client, createSessionCookie, getSessionFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/db';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const code = searchParams.get('code');
  
  // Get session data to determine redirect URL
  const sessionData = getSessionFromRequest(request) || {};
  const redirectUrl = sessionData.frontendOrigin || process.env.FRONTEND_URL || 'http://localhost:3000';

  if (!code) {
    return NextResponse.redirect(`${redirectUrl}?error=auth_failed&message=Missing_authorization_code`);
  }

  try {
    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    const ticket = await oauth2Client.verifyIdToken({
      idToken: tokens.id_token!,
      audience: process.env.GOOGLE_CLIENT_ID,
    });

    const payload = ticket.getPayload();
    if (!payload || !payload.sub || !payload.email || !payload.name) {
      return NextResponse.redirect(`${redirectUrl}?error=auth_failed&message=Failed_to_get_user_profile`);
    }

    const user = await prisma.user.upsert({
      where: { googleId: payload.sub },
      update: {
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.picture,
      },
      create: {
        id: payload.sub,
        googleId: payload.sub,
        email: payload.email,
        name: payload.name,
        avatarUrl: payload.picture,
      },
    });

    // Update session with user ID
    sessionData.userId = user.id;

    const response = NextResponse.redirect(redirectUrl);
    response.cookies.set('session', createSessionCookie(sessionData), {
      maxAge: 30 * 24 * 60 * 60, // 30 days
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });

    return response;
  } catch (error) {
    console.error('Google Auth Callback Error:', error);
    return NextResponse.redirect(`${redirectUrl}?error=auth_failed`);
  }
}