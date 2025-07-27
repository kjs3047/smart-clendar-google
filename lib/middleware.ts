import { NextRequest, NextResponse } from 'next/server';
import { getSessionFromRequest, getUserFromSession } from './auth';

export interface AuthenticatedRequest extends NextRequest {
  userId: string;
}

export async function withAuth(
  request: NextRequest,
  handler: (req: AuthenticatedRequest) => Promise<NextResponse>
): Promise<NextResponse> {
  const sessionData = getSessionFromRequest(request);
  
  if (!sessionData?.userId) {
    return NextResponse.json({ message: 'Authentication required' }, { status: 401 });
  }

  const user = await getUserFromSession(sessionData);
  if (!user) {
    return NextResponse.json({ message: 'User not found' }, { status: 401 });
  }

  // Add userId to request object
  const authenticatedRequest = request as AuthenticatedRequest;
  authenticatedRequest.userId = user.id;

  return handler(authenticatedRequest);
}