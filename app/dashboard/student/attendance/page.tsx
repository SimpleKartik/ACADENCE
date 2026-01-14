'use client';

import QRScanner from '@/components/attendance/QRScanner';
import StudentAttendanceAnalytics from '@/components/attendance/StudentAttendanceAnalytics';

export default function StudentAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Attendance</h1>
        <p className="text-gray-600">Scan QR code to mark attendance and view your records</p>
      </div>

      {/* QR Scanner */}
      <QRScanner />

      {/* Attendance Analytics */}
      <StudentAttendanceAnalytics />
    </div>
  );
}
