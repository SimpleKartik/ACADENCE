'use client';

import StudentLibraryView from '@/components/library/StudentLibraryView';

export default function StudentLibraryPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Library</h1>
        <p className="text-gray-600">Manage your issued books and track due dates</p>
      </div>

      <StudentLibraryView />
    </div>
  );
}
