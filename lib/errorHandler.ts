import { NextResponse } from 'next/server';

export interface ErrorContext {
  userId?: string;
  operation?: string;
  data?: Record<string, any>;
  [key: string]: any;
}

export function logApiError(error: unknown, context: ErrorContext = {}) {
  console.error('=== API ERROR ===');
  console.error('Error:', error);
  console.error('Context:', {
    timestamp: new Date().toISOString(),
    name: error instanceof Error ? error.name : 'Unknown',
    message: error instanceof Error ? error.message : 'Unknown error',
    stack: error instanceof Error ? error.stack : 'No stack trace',
    ...context
  });
  console.error('=================');
}

export function createErrorResponse(
  message: string, 
  status: number = 500,
  error?: unknown
) {
  return NextResponse.json({
    message,
    error: error instanceof Error ? error.message : 'Unknown error',
    timestamp: new Date().toISOString()
  }, { status });
}

// 안전한 변수 스코프를 위한 헬퍼
export function safeApiHandler<T>(
  handler: (data: T) => Promise<NextResponse>
) {
  return async (request: Request): Promise<NextResponse> => {
    let requestData: T | null = null;
    try {
      requestData = await request.json();
      return await handler(requestData);
    } catch (error) {
      logApiError(error, { 
        requestData: requestData ? 'parsed' : 'failed_to_parse',
        url: request.url,
        method: request.method
      });
      return createErrorResponse('Internal server error', 500, error);
    }
  };
}