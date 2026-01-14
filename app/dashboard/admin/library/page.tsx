'use client';

import AdminLibraryView from '@/components/library/AdminLibraryView';

export default function AdminLibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Library Management</h1>
        <p className="text-gray-600">Manage books, issue/return books, and track inventory</p>
      </div>

      <AdminLibraryView />
    </div>
  );
}
