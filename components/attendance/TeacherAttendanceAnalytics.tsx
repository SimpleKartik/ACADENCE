'use client';

import { useEffect, useState } from 'react';
import { getClassAttendance, ClassAttendanceRecord, ClassAttendanceSummary } from '@/lib/services/attendanceService';

export default function TeacherAttendanceAnalytics() {
  const [summary, setSummary] = useState<ClassAttendanceSummary | null>(null);
  const [attendance, setAttendance] = useState<ClassAttendanceRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [subjectFilter, setSubjectFilter] = useState('');
  const [dateFilter, setDateFilter] = useState('');

  useEffect(() => {
    loadAttendance();
  }, [subjectFilter, dateFilter]);

  const loadAttendance = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getClassAttendance(
        subjectFilter || undefined,
        dateFilter || undefined
      );
      setSummary(response.data.summary);
      setAttendance(response.data.attendance);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load attendance data');
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <div className="bg-background-light p-4 rounded-lg border border-gray-200">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <label htmlFor="subjectFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Subject
            </label>
            <input
              type="text"
              id="subjectFilter"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              placeholder="e.g., Mathematics"
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div>
            <label htmlFor="dateFilter" className="block text-sm font-medium text-gray-700 mb-1">
              Filter by Date
            </label>
            <input
              type="date"
              id="dateFilter"
              value={dateFilter}
              onChange={(e) => setDateFilter(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          <div className="flex items-end">
            <button
              onClick={() => {
                setSubjectFilter('');
                setDateFilter('');
              }}
              className="w-full bg-gray-200 text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-300 transition-colors"
            >
              Clear Filters
            </button>
          </div>
        </div>
      </div>

      {/* Summary */}
      {summary && (
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Attendance Summary</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-3xl font-bold text-primary-900">{summary.totalStudents}</p>
              <p className="text-sm text-gray-600 mt-1">Total Students</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-3xl font-bold text-green-600">{summary.presentCount}</p>
              <p className="text-sm text-gray-600 mt-1">Present</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-3xl font-bold text-red-600">{summary.absentCount}</p>
              <p className="text-sm text-gray-600 mt-1">Absent</p>
            </div>
          </div>
        </div>
      )}

      {/* Attendance Records */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Attendance Records</h2>
        {attendance.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No attendance records found</p>
          </div>
        ) : (
          <div className="space-y-6">
            {attendance.map((record, index) => (
              <div key={index} className="bg-white p-4 rounded-lg border border-gray-200">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold text-primary-900">{record.subject}</h3>
                    <p className="text-sm text-gray-600">
                      Date: {new Date(record.date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm text-gray-600">
                      <span className="text-green-600 font-semibold">{record.presentCount}</span> Present
                      {' / '}
                      <span className="text-red-600 font-semibold">{record.absentCount}</span> Absent
                    </p>
                  </div>
                </div>
                <div className="space-y-2">
                  {record.students.map((item, studentIndex) => (
                    <div
                      key={studentIndex}
                      className={`flex items-center justify-between p-3 rounded-lg border ${
                        item.status === 'present'
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div>
                        <p className="font-semibold text-primary-900">
                          {item.student?.name || 'Unknown'}
                        </p>
                        <p className="text-sm text-gray-600">
                          {item.student?.rollNumber && `Roll: ${item.student.rollNumber}`}
                          {item.student?.email && ` • ${item.student.email}`}
                        </p>
                      </div>
                      <div className="text-right">
                        <span
                          className={`px-3 py-1 rounded-full text-sm font-medium ${
                            item.status === 'present'
                              ? 'bg-green-200 text-green-800'
                              : 'bg-red-200 text-red-800'
                          }`}
                        >
                          {item.status === 'present' ? 'Present' : 'Absent'}
                        </span>
                        {item.status === 'present' && (
                          <p className="text-xs text-gray-600 mt-1">
                            {new Date(item.timestamp).toLocaleTimeString()}
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
