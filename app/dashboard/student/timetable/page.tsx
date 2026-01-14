'use client';

import TimetableView from '@/components/timetable/TimetableView';

export default function StudentTimetablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Timetable</h1>
        <p className="text-gray-600">Your weekly class schedule with live updates</p>
      </div>

      <TimetableView />
    </div>
  );
}
