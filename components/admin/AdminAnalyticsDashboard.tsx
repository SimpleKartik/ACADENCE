'use client';

import { useEffect, useState } from 'react';
import {
  getOverview,
  getAttendanceStats,
  getLibraryStats,
  getSystemActivity,
  OverviewStats,
  AttendanceStats,
  LibraryStats,
  SystemActivity,
} from '@/lib/services/adminService';
import StatCard from './StatCard';
import SimpleBarChart from './SimpleBarChart';
import SimplePieChart from './SimplePieChart';

export default function AdminAnalyticsDashboard() {
  const [overview, setOverview] = useState<OverviewStats | null>(null);
  const [attendanceStats, setAttendanceStats] = useState<AttendanceStats | null>(null);
  const [libraryStats, setLibraryStats] = useState<LibraryStats | null>(null);
  const [systemActivity, setSystemActivity] = useState<SystemActivity | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadAllData();
  }, []);

  const loadAllData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [overviewRes, attendanceRes, libraryRes, activityRes] = await Promise.all([
        getOverview(),
        getAttendanceStats(),
        getLibraryStats(),
        getSystemActivity(10),
      ]);

      setOverview(overviewRes.data);
      setAttendanceStats(attendanceRes.data);
      setLibraryStats(libraryRes.data);
      setSystemActivity(activityRes.data);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load analytics data');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string): string => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-32 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
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
      {/* Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Students"
          value={overview?.totalStudents || 0}
          icon="👥"
          color="blue"
        />
        <StatCard
          title="Total Teachers"
          value={overview?.totalTeachers || 0}
          icon="👨‍🏫"
          color="green"
        />
        <StatCard
          title="Active Users (7 days)"
          value={overview?.totalActiveUsers || 0}
          icon="🟢"
          color="purple"
          subtitle={`Out of ${(overview?.totalStudents || 0) + (overview?.totalTeachers || 0) + (overview?.totalAdmins || 0)} total users`}
        />
        <StatCard
          title="Library Overdue"
          value={libraryStats?.overdueBooksCount || 0}
          icon="⚠️"
          color="red"
        />
      </div>

      {/* Additional Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <StatCard
          title="Notifications Sent"
          value={overview?.totalNotificationsSent || 0}
          icon="📢"
          color="blue"
        />
        <StatCard
          title="Average Attendance"
          value={`${attendanceStats?.averageAttendance.toFixed(1) || 0}%`}
          icon="📊"
          color={attendanceStats && attendanceStats.averageAttendance >= 75 ? 'green' : 'yellow'}
        />
        <StatCard
          title="Students Below 75%"
          value={attendanceStats?.studentsBelow75 || 0}
          icon="📉"
          color="red"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Attendance Distribution */}
        <SimpleBarChart
          title="Subject-wise Attendance"
          data={
            attendanceStats?.subjectWiseSummary.map((s) => ({
              label: s.subject,
              value: s.percentage,
              color: s.percentage >= 75 ? '#10b981' : s.percentage >= 50 ? '#f59e0b' : '#ef4444',
            })) || []
          }
          maxValue={100}
        />

        {/* Library Stats */}
        <SimplePieChart
          title="Library Status"
          data={[
            {
              label: 'Issued',
              value: (libraryStats?.issuedBooksCount || 0) - (libraryStats?.overdueBooksCount || 0),
              color: '#3b82f6',
            },
            {
              label: 'Overdue',
              value: libraryStats?.overdueBooksCount || 0,
              color: '#ef4444',
            },
            {
              label: 'Available',
              value: (libraryStats?.totalBooks || 0) - (libraryStats?.issuedBooksCount || 0),
              color: '#10b981',
            },
          ]}
        />
      </div>

      {/* User Role Distribution */}
      <SimplePieChart
        title="User Role Distribution"
        data={[
          {
            label: 'Students',
            value: overview?.totalStudents || 0,
            color: '#3b82f6',
          },
          {
            label: 'Teachers',
            value: overview?.totalTeachers || 0,
            color: '#10b981',
          },
          {
            label: 'Admins',
            value: overview?.totalAdmins || 0,
            color: '#8b5cf6',
          },
        ]}
      />

      {/* Tables Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Students with Low Attendance */}
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">
            Students Below 75% Attendance
          </h3>
          {attendanceStats?.studentsBelow75Details.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No students below 75% attendance</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Roll No.
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Attendance
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {attendanceStats?.studentsBelow75Details.map((student, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-sm">{student.name}</td>
                      <td className="py-2 px-3 text-sm text-gray-600">{student.rollNumber}</td>
                      <td className="py-2 px-3 text-sm">
                        <span
                          className={`font-semibold ${
                            student.attendancePercentage >= 50
                              ? 'text-yellow-600'
                              : 'text-red-600'
                          }`}
                        >
                          {student.attendancePercentage.toFixed(1)}%
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Library Defaulters */}
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Top Library Defaulters</h3>
          {libraryStats?.topDefaulters.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No defaulters</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Name
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Roll No.
                    </th>
                    <th className="text-left py-2 px-3 text-sm font-semibold text-gray-700">
                      Overdue
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {libraryStats?.topDefaulters.map((defaulter, index) => (
                    <tr key={index} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-2 px-3 text-sm">{defaulter.name}</td>
                      <td className="py-2 px-3 text-sm text-gray-600">{defaulter.rollNumber}</td>
                      <td className="py-2 px-3 text-sm">
                        <span className="font-semibold text-red-600">
                          {defaulter.overdueCount} book{defaulter.overdueCount !== 1 ? 's' : ''}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Recent Broadcasts</h3>
        {systemActivity?.recentBroadcasts.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No recent broadcasts</p>
        ) : (
          <div className="space-y-3">
            {systemActivity?.recentBroadcasts.map((broadcast, index) => (
              <div
                key={index}
                className="p-4 bg-white rounded-lg border border-gray-200 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h4 className="font-semibold text-primary-900">{broadcast.title}</h4>
                      {broadcast.isImportant && (
                        <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                          Important
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{broadcast.message}</p>
                    <div className="flex items-center space-x-4 text-xs text-gray-500">
                      <span>To: {broadcast.receiverRole}</span>
                      {broadcast.sender && (
                        <span>From: {broadcast.sender.name}</span>
                      )}
                      <span>{formatDateTime(broadcast.createdAt)}</span>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
