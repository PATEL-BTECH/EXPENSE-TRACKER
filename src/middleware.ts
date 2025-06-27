import { NextRequest, NextResponse } from 'next/server';

// Function to get client IP address
function getClientIP(request: NextRequest): string {
  // Check various headers for the real IP
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  const cfConnectingIP = request.headers.get('cf-connecting-ip');

  if (forwarded) {
    // x-forwarded-for can contain multiple IPs, get the first one
    return forwarded.split(',')[0].trim();
  }

  if (realIP) {
    return realIP;
  }

  if (cfConnectingIP) {
    return cfConnectingIP;
  }

  // Fallback to unknown IP in Edge Runtime
  return 'unknown';
}

// Function to log visitor information (Edge Runtime compatible)
async function logVisitor(ip: string, userAgent: string, url: string, timestamp: string) {
  // Log to console for immediate visibility
  console.log(`🌐 Visitor: ${ip} | ${userAgent.substring(0, 50)}... | ${url}`);

  // In Edge Runtime, we can't write to files directly
  // Instead, we'll send the log data to an API endpoint
  try {
    // Only log in development or if we have a specific header
    if (process.env.NODE_ENV === 'development') {
      // We'll handle file logging in the API route instead
      await fetch(`${process.env.NEXTAUTH_URL || 'http://localhost:3000'}/api/log-visitor`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          timestamp,
          ip,
          userAgent,
          url,
          country: 'Unknown',
          city: 'Unknown'
        }),
      }).catch(() => {
        // Silently fail if logging API is not available
      });
    }
  } catch (error) {
    // Silently fail in Edge Runtime
  }
}

export function middleware(request: NextRequest) {
  // Skip logging for static files and API routes that don't need tracking
  const { pathname } = request.nextUrl;
  
  // Skip these paths
  if (
    pathname.startsWith('/_next/') ||
    pathname.startsWith('/api/') ||
    pathname.includes('.') // Skip files with extensions (images, css, js, etc.)
  ) {
    return NextResponse.next();
  }

  // Get visitor information
  const ip = getClientIP(request);
  const userAgent = request.headers.get('user-agent') || 'Unknown';
  const url = request.nextUrl.pathname + request.nextUrl.search;
  const timestamp = new Date().toISOString();

  // Log the visitor (async, don't wait)
  try {
    logVisitor(ip, userAgent, url, timestamp).catch(() => {
      // Silently ignore logging errors
    });
  } catch (error) {
    // Silently ignore middleware errors
    console.error('Middleware logging error:', error);
  }

  // Continue with the request
  return NextResponse.next();
}

// Configure which paths the middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
