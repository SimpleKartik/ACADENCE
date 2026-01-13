import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

// JWT secret - should match backend JWT_SECRET
const JWT_SECRET = process.env.JWT_SECRET || 'your-super-secret-jwt-key-change-this-in-production';

interface JWTPayload {
  userId: string;
  role: 'student' | 'teacher' | 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Verify and decode JWT token
 */
async function verifyToken(token: string): Promise<JWTPayload | null> {
  try {
    const secret = new TextEncoder().encode(JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    
    return {
      userId: payload.userId as string,
      role: payload.role as 'student' | 'teacher' | 'admin',
      iat: payload.iat as number,
      exp: payload.exp as number,
    };
  } catch (error) {
    // Token is invalid or expired
    return null;
  }
}

/**
 * Get token from request (cookie or Authorization header)
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Try cookie first (preferred)
  const cookieToken = request.cookies.get('acadence_token')?.value;
  if (cookieToken) return cookieToken;

  // Try Authorization header
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  return null;
}

/**
 * Get required role from pathname
 */
function getRequiredRole(pathname: string): 'student' | 'teacher' | 'admin' | null {
  if (pathname.startsWith('/dashboard/student')) return 'student';
  if (pathname.startsWith('/dashboard/teacher')) return 'teacher';
  if (pathname.startsWith('/dashboard/admin')) return 'admin';
  return null;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if route requires authentication
  const requiredRole = getRequiredRole(pathname);

  // If not a protected route, allow access
  if (!requiredRole) {
    return NextResponse.next();
  }

  // Get token from request
  const token = getTokenFromRequest(request);

  // No token - redirect to role selection
  if (!token) {
    const url = request.nextUrl.clone();
    url.pathname = '/select-role';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }

  // Verify and decode token
  const payload = await verifyToken(token);

  // Invalid or expired token - redirect to role selection
  if (!payload) {
    const url = request.nextUrl.clone();
    url.pathname = '/select-role';
    url.searchParams.set('redirect', pathname);
    url.searchParams.set('expired', 'true');
    return NextResponse.redirect(url);
  }

  // Check role match
  if (payload.role !== requiredRole) {
    // Role mismatch - redirect to unauthorized page
    const url = request.nextUrl.clone();
    url.pathname = '/unauthorized';
    url.searchParams.set('required', requiredRole);
    url.searchParams.set('actual', payload.role);
    return NextResponse.redirect(url);
  }

  // All checks passed - allow access
  return NextResponse.next();
}

// Configure which routes to run middleware on
export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - api routes
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public files (public folder)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
