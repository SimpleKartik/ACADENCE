'use client';

import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth/AuthContext';
import ThemeToggle from '@/components/ThemeToggle';
import NotificationBadge from '@/components/notifications/NotificationBadge';

export default function TopBar() {
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = () => {
    logout();
    router.push('/');
  };

  const handleNotificationClick = () => {
    // Navigate to notifications page based on role
    if (user?.role === 'student') {
      router.push('/dashboard/student/announcements');
    } else if (user?.role === 'teacher') {
      router.push('/dashboard/teacher/broadcast');
    }
  };

  return (
    <header className="bg-background-light dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 sticky top-0 z-40 ml-64 transition-colors duration-200">
      <div className="px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-semibold text-primary-900 dark:text-primary-200">
            Welcome back, {user?.name || 'User'}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
            {user?.role} Dashboard
          </p>
        </div>
        <div className="flex items-center space-x-4">
          {(user?.role === 'student' || user?.role === 'teacher') && (
            <NotificationBadge onClick={handleNotificationClick} />
          )}
          <ThemeToggle />
          <button
            onClick={handleLogout}
            className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-primary-800 dark:hover:text-primary-300 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
}
