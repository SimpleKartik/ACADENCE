'use client';

import CabinStatusList from '@/components/cabin/CabinStatusList';

export default function StudentFacultyPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Faculty Availability</h1>
        <p className="text-gray-600">Check faculty cabin status before visiting</p>
      </div>

      <CabinStatusList />
    </div>
  );
}
