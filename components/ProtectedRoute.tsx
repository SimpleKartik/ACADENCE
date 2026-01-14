'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import { UserRole } from '@/lib/types/roles';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  redirectTo?: string;
}

/**
 * ProtectedRoute Component
 * Checks JWT presence in localStorage
 * Redirects unauthenticated users to /login
 * Optionally checks for specific role
 */
export default function ProtectedRoute({
  children,
  requiredRole,
  redirectTo = '/select-role',
}: ProtectedRouteProps) {
  const { isAuthenticated, user, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isLoading) {
      // If not authenticated, redirect to login
      if (!isAuthenticated) {
        router.push(redirectTo);
        return;
      }

      // If role is required and user doesn't have it, redirect to their dashboard
      if (requiredRole && user && user.role !== requiredRole) {
        router.push(`/dashboard/${user.role}`);
        return;
      }
    }
  }, [isAuthenticated, user, requiredRole, isLoading, router, redirectTo]);

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, don't render children (redirect will happen)
  if (!isAuthenticated) {
    return null;
  }

  // If role is required and user doesn't have it, don't render children
  if (requiredRole && user && user.role !== requiredRole) {
    return null;
  }

  return <>{children}</>;
}
