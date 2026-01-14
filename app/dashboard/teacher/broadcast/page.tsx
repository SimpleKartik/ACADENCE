'use client';

import BroadcastForm from '@/components/notifications/BroadcastForm';
import NotificationPanel from '@/components/notifications/NotificationPanel';

export default function TeacherBroadcastPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Broadcast Announcements</h1>
        <p className="text-gray-600">Send announcements to students and teachers via in-app and email notifications</p>
      </div>

      {/* Broadcast Form */}
      <BroadcastForm />

      {/* Sent Notifications */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Your Broadcasts</h2>
        <NotificationPanel />
      </div>
    </div>
  );
}
