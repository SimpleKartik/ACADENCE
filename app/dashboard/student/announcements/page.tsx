'use client';

import NotificationPanel from '@/components/notifications/NotificationPanel';

export default function StudentAnnouncementsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with important announcements from teachers and administration</p>
      </div>

      {/* Notifications Panel */}
      <NotificationPanel />
    </div>
  );
}
