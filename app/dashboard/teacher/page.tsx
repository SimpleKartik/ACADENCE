'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/lib/auth/AuthContext';

export default function TeacherDashboardOverview() {
  const { user, fetchUser } = useAuth();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadUser = async () => {
      if (!user) {
        await fetchUser();
      }
      setIsLoading(false);
    };
    loadUser();
  }, [user, fetchUser]);

  // Mock data (will be replaced with real API calls later)
  const todayClasses = [
    { time: '10:00 AM', subject: 'Mathematics', room: 'A-101', students: 45 },
    { time: '2:00 PM', subject: 'Advanced Mathematics', room: 'A-102', students: 32 },
  ];
  const pendingMessages = 5;
  const recentAnnouncements = [
    { title: 'Mid-term Exam Schedule', sent: '2024-01-15', recipients: 120 },
    { title: 'Assignment Deadline Reminder', sent: '2024-01-14', recipients: 120 },
  ];

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">
          Welcome back, {user?.name || 'Faculty'}! {user?.email && `(${user.email})`}
        </p>
        {user?.department && (
          <p className="text-sm text-gray-500 mt-1">Department: {user.department}</p>
        )}
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Today's Classes</p>
              <p className="text-3xl font-bold text-primary-900">{todayClasses.length}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Pending Messages</p>
              <p className="text-3xl font-bold text-primary-900">{pendingMessages}</p>
            </div>
            <div className="text-4xl">💬</div>
          </div>
        </div>

        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Announcements Sent</p>
              <p className="text-3xl font-bold text-primary-900">{recentAnnouncements.length}</p>
            </div>
            <div className="text-4xl">📢</div>
          </div>
        </div>
      </div>

      {/* Today's Classes */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Today's Classes</h2>
        <div className="space-y-3">
          {todayClasses.map((classItem, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-primary-900">{classItem.subject}</p>
                <p className="text-sm text-gray-600">
                  {classItem.time} • Room {classItem.room} • {classItem.students} students
                </p>
              </div>
              <button className="px-4 py-2 bg-primary-700 text-white rounded-lg font-medium hover:bg-primary-800 transition-colors">
                Generate QR
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <button className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all text-left">
            <div className="text-2xl mb-2">📱</div>
            <p className="font-semibold text-primary-900">Mark Attendance</p>
            <p className="text-sm text-gray-600">Generate QR for class</p>
          </button>
          <button className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all text-left">
            <div className="text-2xl mb-2">📢</div>
            <p className="font-semibold text-primary-900">Send Announcement</p>
            <p className="text-sm text-gray-600">Broadcast to students</p>
          </button>
          <button className="p-4 bg-white border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all text-left">
            <div className="text-2xl mb-2">💬</div>
            <p className="font-semibold text-primary-900">View Messages</p>
            <p className="text-sm text-gray-600">Check student queries</p>
          </button>
        </div>
      </div>
    </div>
  );
}
