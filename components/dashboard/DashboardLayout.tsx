'use client';

import { ReactNode, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import { UserRole } from '@/lib/types/roles';
import LogoBackground from '@/components/LogoBackground';

interface DashboardLayoutProps {
  children: ReactNode;
  requiredRole: UserRole;
}

export default function DashboardLayout({ children, requiredRole }: DashboardLayoutProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    // Don't redirect while loading
    if (isLoading) {
      return;
    }

    if (!isAuthenticated) {
      router.push('/select-role');
      return;
    }

    if (user && user.role !== requiredRole) {
      // Redirect to correct role dashboard
      router.push(`/dashboard/${user.role}`);
    }
  }, [isAuthenticated, user, requiredRole, router, isLoading]);

  // Show loading state while checking authentication
  if (isLoading || !isAuthenticated || !user || user.role !== requiredRole) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background dark:bg-gray-900 transition-colors duration-200">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700 dark:border-primary-400 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-gray-900 relative overflow-hidden transition-colors duration-200">
      <LogoBackground opacity={3} />
      <Sidebar role={user.role} />
      <div className="ml-64 relative z-10">
        <TopBar />
        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
