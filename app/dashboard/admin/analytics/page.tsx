'use client';

import AdminAnalyticsDashboard from '@/components/admin/AdminAnalyticsDashboard';

export default function AdminAnalyticsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Analytics Dashboard</h1>
        <p className="text-gray-600">Platform-wide statistics and insights</p>
      </div>

      <AdminAnalyticsDashboard />
    </div>
  );
}
