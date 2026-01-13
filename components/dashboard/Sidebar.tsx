'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { UserRole } from '@/lib/types/roles';

interface SidebarItem {
  label: string;
  href: string;
  icon: string;
}

interface SidebarProps {
  role: UserRole;
}

const sidebarItems: Record<UserRole, SidebarItem[]> = {
  student: [
    { label: 'Dashboard Overview', href: '/dashboard/student', icon: '📊' },
    { label: 'Attendance', href: '/dashboard/student/attendance', icon: '📱' },
    { label: 'Timetable', href: '/dashboard/student/timetable', icon: '📅' },
    { label: 'Library', href: '/dashboard/student/library', icon: '📚' },
    { label: 'Messages', href: '/dashboard/student/messages', icon: '💬' },
    { label: 'Announcements', href: '/dashboard/student/announcements', icon: '📢' },
    { label: 'Faculty Availability', href: '/dashboard/student/faculty', icon: '🚪' },
  ],
  teacher: [
    { label: 'Dashboard Overview', href: '/dashboard/teacher', icon: '📊' },
    { label: 'Attendance Management', href: '/dashboard/teacher/attendance', icon: '📱' },
    { label: 'Timetable Management', href: '/dashboard/teacher/timetable', icon: '📅' },
    { label: 'Broadcast Announcements', href: '/dashboard/teacher/broadcast', icon: '📢' },
    { label: 'Student Messages', href: '/dashboard/teacher/messages', icon: '💬' },
    { label: 'Cabin Status', href: '/dashboard/teacher/cabin', icon: '🚪' },
  ],
  admin: [
    { label: 'Dashboard Overview', href: '/dashboard/admin', icon: '📊' },
    { label: 'User Management', href: '/dashboard/admin/users', icon: '👥' },
    { label: 'System Settings', href: '/dashboard/admin/settings', icon: '⚙️' },
  ],
};

export default function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname();
  const items = sidebarItems[role];

  return (
    <aside className="w-64 bg-primary-900 dark:bg-gray-800 text-white min-h-screen fixed left-0 top-0 overflow-y-auto border-r border-primary-800 dark:border-gray-700 transition-colors duration-200">
      <div className="p-6">
        <Link href="/" className="text-2xl font-bold mb-8 block hover:text-primary-200 dark:hover:text-primary-300 transition-colors">
          Acadence
        </Link>
        <nav className="space-y-2">
          {items.map((item) => {
            const isActive = pathname === item.href || (item.href !== `/${role}` && pathname.startsWith(item.href));
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary-700 dark:bg-gray-700 text-white shadow-md'
                    : 'text-gray-300 dark:text-gray-400 hover:bg-primary-800 dark:hover:bg-gray-700 hover:text-white'
                }`}
              >
                <span className="text-xl">{item.icon}</span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>
      </div>
    </aside>
  );
}
