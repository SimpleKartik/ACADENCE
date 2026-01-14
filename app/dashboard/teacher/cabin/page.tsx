'use client';

import CabinStatusUpdate from '@/components/cabin/CabinStatusUpdate';

export default function TeacherCabinPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Cabin Status</h1>
        <p className="text-gray-600">Update your availability status for students</p>
      </div>

      <CabinStatusUpdate />
    </div>
  );
}
