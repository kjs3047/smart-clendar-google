import { NextRequest } from 'next/server';
import { OAuth2Client } from 'google-auth-library';
import { prisma } from './db';

const oauth2Client = new OAuth2Client(
  process.env.GOOGLE_CLIENT_ID,
  process.env.GOOGLE_CLIENT_SECRET,
  process.env.GOOGLE_CALLBACK_URL
);

export interface SessionData {
  userId?: string;
  frontendOrigin?: string;
}

export function getSessionFromRequest(request: NextRequest): SessionData | null {
  try {
    const sessionCookie = request.cookies.get('session');
    if (!sessionCookie) return null;
    
    // This is a simplified session parsing - in production you might want to use
    // a more robust session management solution
    const sessionData = JSON.parse(Buffer.from(sessionCookie.value, 'base64').toString());
    return sessionData;
  } catch (error) {
    return null;
  }
}

export function createSessionCookie(sessionData: SessionData): string {
  const sessionString = JSON.stringify(sessionData);
  return Buffer.from(sessionString).toString('base64');
}

export async function getUserFromSession(sessionData: SessionData) {
  if (!sessionData.userId) return null;
  
  try {
    const user = await prisma.user.findUnique({ 
      where: { id: sessionData.userId } 
    });
    return user;
  } catch (error) {
    console.error('Error getting user from session:', error);
    return null;
  }
}

export { oauth2Client };