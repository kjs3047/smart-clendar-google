import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getUserFromSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const sessionData = getSessionFromRequest(request);
  
  if (!sessionData?.userId) {
    return NextResponse.json({ message: 'Not authenticated' }, { status: 401 });
  }

  const user = await getUserFromSession(sessionData);
  
  if (user) {
    return NextResponse.json({ 
      name: user.name, 
      avatarUrl: user.avatarUrl 
    });
  } else {
    // Clear invalid session
    const response = NextResponse.json({ message: 'User not found' }, { status: 401 });
    response.cookies.set('session', '', {
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
    return response;
  }
}