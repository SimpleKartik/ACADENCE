/**
 * JWT utility functions for client-side token handling
 * Note: Full verification happens on the server
 */

export interface JWTPayload {
  userId: string;
  role: 'student' | 'teacher' | 'admin';
  iat?: number;
  exp?: number;
}

/**
 * Decode JWT token without verification (client-side only)
 * For full verification, use server-side API
 */
export function decodeToken(token: string): JWTPayload | null {
  try {
    const base64Url = token.split('.')[1];
    if (!base64Url) return null;

    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const jsonPayload = decodeURIComponent(
      atob(base64)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join('')
    );

    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Token decode error:', error);
    return null;
  }
}

/**
 * Check if token is expired
 */
export function isTokenExpired(token: string): boolean {
  const decoded = decodeToken(token);
  if (!decoded || !decoded.exp) return true;

  const currentTime = Math.floor(Date.now() / 1000);
  return decoded.exp < currentTime;
}

/**
 * Get token from cookie or localStorage
 */
export function getToken(): string | null {
  // Try cookie first (preferred)
  if (typeof document !== 'undefined') {
    const cookies = document.cookie.split(';');
    const tokenCookie = cookies.find((cookie) =>
      cookie.trim().startsWith('acadence_token=')
    );
    if (tokenCookie) {
      return tokenCookie.split('=')[1]?.trim() || null;
    }

    // Fallback to localStorage
    return localStorage.getItem('acadence_token');
  }
  return null;
}
