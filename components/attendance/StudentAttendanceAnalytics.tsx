'use client';

import { useEffect, useState } from 'react';
import { getMyAttendance, AttendanceOverview, SubjectWiseAttendance } from '@/lib/services/attendanceService';

export default function StudentAttendanceAnalytics() {
  const [overview, setOverview] = useState<AttendanceOverview | null>(null);
  const [subjectWise, setSubjectWise] = useState<SubjectWiseAttendance[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const threshold = 75;

  useEffect(() => {
    loadAttendance();
  }, []);

  const loadAttendance = async () => {
    setIsLoading(true);
    setError('');

    try {
      const response = await getMyAttendance();
      setOverview(response.data.overview);
      setSubjectWise(response.data.subjectWise);
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
      {/* Overview Card */}
      {overview && (
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Overall Attendance</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-3xl font-bold text-primary-900">{overview.totalClasses}</p>
              <p className="text-sm text-gray-600 mt-1">Total Classes</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p className="text-3xl font-bold text-green-600">{overview.attendedClasses}</p>
              <p className="text-sm text-gray-600 mt-1">Attended</p>
            </div>
            <div className="text-center p-4 bg-white rounded-lg border border-gray-200">
              <p
                className={`text-3xl font-bold ${
                  overview.attendancePercentage >= threshold
                    ? 'text-primary-900'
                    : 'text-red-600'
                }`}
              >
                {overview.attendancePercentage}%
              </p>
              <p className="text-sm text-gray-600 mt-1">Attendance</p>
            </div>
          </div>
        </div>
      )}

      {/* Subject-wise Attendance */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Subject-wise Attendance</h2>
        {subjectWise.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <p>No attendance records found</p>
          </div>
        ) : (
          <div className="space-y-4">
            {subjectWise.map((subject, index) => {
              const isLow = subject.attendancePercentage < threshold;
              return (
                <div
                  key={index}
                  className={`p-4 rounded-lg border ${
                    isLow
                      ? 'bg-red-50 border-red-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-semibold text-primary-900">{subject.subject}</h3>
                    <div className="flex items-center space-x-2">
                      <span
                        className={`text-2xl font-bold ${
                          isLow ? 'text-red-700' : 'text-primary-900'
                        }`}
                      >
                        {subject.attendancePercentage}%
                      </span>
                      {isLow && (
                        <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                          Low
                        </span>
                      )}
                    </div>
                  </div>
                  <div className="mb-2">
                    <div className="w-full bg-gray-200 rounded-full h-3">
                      <div
                        className={`h-3 rounded-full transition-all ${
                          isLow ? 'bg-red-500' : 'bg-primary-700'
                        }`}
                        style={{ width: `${subject.attendancePercentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <p className="text-sm text-gray-600">
                    Attended: {subject.attendedClasses} / Total: {subject.totalClasses} classes
                  </p>
                  {isLow && (
                    <p className="text-sm text-red-700 mt-2 font-medium">
                      ⚠️ Attendance below {threshold}% threshold
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
