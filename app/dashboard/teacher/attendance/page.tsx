'use client';

import { useState } from 'react';

export default function TeacherAttendancePage() {
  const [selectedClass, setSelectedClass] = useState<string | null>(null);
  const [qrGenerated, setQrGenerated] = useState(false);

  // Mock data
  const classes = [
    { id: '1', name: 'Mathematics - Section A', students: 45, date: '2024-01-15' },
    { id: '2', name: 'Advanced Mathematics - Section B', students: 32, date: '2024-01-15' },
    { id: '3', name: 'Mathematics - Section A', students: 45, date: '2024-01-14' },
  ];

  const attendanceRecords = selectedClass
    ? [
        { id: 1, name: 'John Doe', rollNo: 'STU001', status: 'present', time: '10:05 AM' },
        { id: 2, name: 'Jane Smith', rollNo: 'STU002', status: 'present', time: '10:07 AM' },
        { id: 3, name: 'Bob Johnson', rollNo: 'STU003', status: 'absent', time: '-' },
        { id: 4, name: 'Alice Williams', rollNo: 'STU004', status: 'present', time: '10:10 AM' },
        { id: 5, name: 'Charlie Brown', rollNo: 'STU005', status: 'late', time: '10:25 AM' },
      ]
    : [];

  const handleGenerateQR = () => {
    setQrGenerated(true);
    // In real app, would generate QR code via API
  };

  const presentCount = attendanceRecords.filter((r) => r.status === 'present' || r.status === 'late').length;
  const absentCount = attendanceRecords.filter((r) => r.status === 'absent').length;
  const attendancePercentage = attendanceRecords.length
    ? Math.round((presentCount / attendanceRecords.length) * 100)
    : 0;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Attendance Management</h1>
        <p className="text-gray-600">Generate QR codes and manage student attendance</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Class List */}
        <div className="lg:col-span-1 bg-background-light p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Your Classes</h2>
          <div className="space-y-2">
            {classes.map((classItem) => (
              <button
                key={classItem.id}
                onClick={() => {
                  setSelectedClass(classItem.id);
                  setQrGenerated(false);
                }}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedClass === classItem.id
                    ? 'bg-primary-50 border-primary-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <p className="font-semibold text-primary-900">{classItem.name}</p>
                <p className="text-sm text-gray-600">
                  {classItem.students} students • {classItem.date}
                </p>
              </button>
            ))}
          </div>
        </div>

        {/* Attendance Management */}
        <div className="lg:col-span-2 space-y-6">
          {selectedClass ? (
            <>
              {/* QR Generation */}
              <div className="bg-background-light p-6 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-primary-900">Generate QR Code</h2>
                    <p className="text-gray-600">Create QR code for students to scan</p>
                  </div>
                  <button
                    onClick={handleGenerateQR}
                    className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
                  >
                    {qrGenerated ? 'Regenerate QR' : 'Generate QR'}
                  </button>
                </div>
                {qrGenerated && (
                  <div className="mt-4 p-6 bg-white rounded-lg border border-gray-200 text-center">
                    <div className="w-48 h-48 bg-gray-200 rounded-lg mx-auto mb-4 flex items-center justify-center">
                      <span className="text-4xl">📱</span>
                    </div>
                    <p className="text-sm text-gray-600">QR Code displayed on screen</p>
                    <p className="text-xs text-gray-500 mt-2">Valid for 15 minutes</p>
                  </div>
                )}
              </div>

              {/* Attendance Analytics */}
              <div className="bg-background-light p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Attendance Analytics</h2>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-2xl font-bold text-primary-900">{presentCount}</p>
                    <p className="text-sm text-gray-600">Present</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-2xl font-bold text-red-600">{absentCount}</p>
                    <p className="text-sm text-gray-600">Absent</p>
                  </div>
                  <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
                    <p className="text-2xl font-bold text-primary-900">{attendancePercentage}%</p>
                    <p className="text-sm text-gray-600">Attendance</p>
                  </div>
                </div>
                <button className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors">
                  Export Attendance
                </button>
              </div>

              {/* Student List */}
              <div className="bg-background-light p-6 rounded-lg border border-gray-200">
                <h2 className="text-xl font-semibold text-primary-900 mb-4">Student Attendance</h2>
                <div className="space-y-2">
                  {attendanceRecords.map((record) => (
                    <div
                      key={record.id}
                      className={`flex items-center justify-between p-4 rounded-lg border ${
                        record.status === 'present'
                          ? 'bg-green-50 border-green-200'
                          : record.status === 'late'
                          ? 'bg-yellow-50 border-yellow-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-primary-900">{record.name}</p>
                        <p className="text-sm text-gray-600">Roll No: {record.rollNo}</p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            record.status === 'present'
                              ? 'bg-green-200 text-green-800'
                              : record.status === 'late'
                              ? 'bg-yellow-200 text-yellow-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {record.status === 'present'
                            ? 'Present'
                            : record.status === 'late'
                            ? 'Late'
                            : 'Absent'}
                        </span>
                        <p className="text-xs text-gray-600 mt-1">{record.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </>
          ) : (
            <div className="bg-background-light p-12 rounded-lg border border-gray-200 text-center">
              <div className="text-6xl mb-4">📱</div>
              <p className="text-gray-600">Select a class to manage attendance</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
