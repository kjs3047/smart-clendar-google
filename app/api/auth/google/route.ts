import { NextRequest, NextResponse } from 'next/server';
import { oauth2Client, createSessionCookie, getSessionFromRequest, SessionData } from '@/lib/auth';

export async function GET(request: NextRequest) {
  // Store the frontend's origin from the Referer header to redirect back to it later
  const referer = request.headers.get('referer');
  let sessionData: SessionData = {};
  
  if (referer) {
    try {
      const refererUrl = new URL(referer);
      sessionData.frontendOrigin = refererUrl.origin;
    } catch (e) {
      console.warn('Could not parse Referer URL:', referer);
    }
  }

  const authorizeUrl = oauth2Client.generateAuthUrl({
    access_type: 'offline',
    scope: [
      'https://www.googleapis.com/auth/userinfo.profile',
      'https://www.googleapis.com/auth/userinfo.email'
    ],
    prompt: 'consent',
    redirect_uri: process.env.GOOGLE_CALLBACK_URL,
  });

  const response = NextResponse.redirect(authorizeUrl);
  
  // Set session cookie
  response.cookies.set('session', createSessionCookie(sessionData), {
    maxAge: 30 * 24 * 60 * 60, // 30 days
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return response;
}
