import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 204 No Content는 응답 본문이 없어야 함
  const response = new NextResponse(null, { status: 204 });
  
  // Clear session cookie
  response.cookies.set('session', '', {
    maxAge: 0,
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });

  return response;
}