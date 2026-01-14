'use client';

import QRGenerator from '@/components/attendance/QRGenerator';
import TeacherAttendanceAnalytics from '@/components/attendance/TeacherAttendanceAnalytics';

export default function TeacherAttendancePage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Generate QR codes and manage student attendance</p>
      </div>

      {/* QR Generator */}
      <QRGenerator />

      {/* Attendance Analytics */}
      <TeacherAttendanceAnalytics />
    </div>
  );
}
