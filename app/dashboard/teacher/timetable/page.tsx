'use client';

import TimetableEditor from '@/components/timetable/TimetableEditor';

export default function TeacherTimetablePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Timetable Management</h1>
        <p className="text-gray-600">View and update your class schedule</p>
      </div>

      <TimetableEditor />
    </div>
  );
}
