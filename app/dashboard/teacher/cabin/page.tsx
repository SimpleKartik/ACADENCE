'use client';

import { useState } from 'react';

type CabinStatus = 'available' | 'busy' | 'offline';

export default function TeacherCabinPage() {
  const [status, setStatus] = useState<CabinStatus>('available');

  const statusOptions: { value: CabinStatus; label: string; color: string; icon: string }[] = [
    { value: 'available', label: 'Available', color: 'bg-green-500', icon: '🟢' },
    { value: 'busy', label: 'Busy', color: 'bg-yellow-500', icon: '🟡' },
    { value: 'offline', label: 'Offline', color: 'bg-gray-400', icon: '🔴' },
  ];

  const handleStatusChange = (newStatus: CabinStatus) => {
    setStatus(newStatus);
    // In real app, would update via API
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Cabin Status</h1>
        <p className="text-gray-600">Update your availability status for students</p>
      </div>

      {/* Status Selector */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Current Status</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {statusOptions.map((option) => (
            <button
              key={option.value}
              onClick={() => handleStatusChange(option.value)}
              className={`p-6 rounded-lg border-2 transition-all ${
                status === option.value
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-200 bg-white hover:border-gray-300'
              }`}
            >
              <div className="text-center">
                <div className="text-4xl mb-3">{option.icon}</div>
                <p
                  className={`font-semibold text-lg ${
                    status === option.value ? 'text-primary-900' : 'text-gray-700'
                  }`}
                >
                  {option.label}
                </p>
                {status === option.value && (
                  <p className="text-sm text-primary-700 mt-2">Active</p>
                )}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Status Info */}
      <div className="bg-blue-50 border border-blue-200 p-6 rounded-lg">
        <h3 className="font-semibold text-blue-900 mb-2">Status Information</h3>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>
            <strong>Available:</strong> Students can visit your cabin
          </li>
          <li>
            <strong>Busy:</strong> Currently occupied, students will see busy status
          </li>
          <li>
            <strong>Offline:</strong> Not available, students will see offline status
          </li>
        </ul>
        <p className="text-xs text-blue-700 mt-4">
          💡 Your status is visible to all students in real-time
        </p>
      </div>

      {/* Preview */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Student View Preview</h2>
        <div className="bg-white p-6 rounded-lg border border-gray-200 max-w-md">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="font-semibold text-primary-900">Your Name</h3>
              <p className="text-sm text-gray-600">Your Subject</p>
              <p className="text-xs text-gray-500">Cabin: Your Cabin Number</p>
            </div>
            <div className="flex flex-col items-end">
              <div
                className={`w-4 h-4 rounded-full mb-2 ${
                  statusOptions.find((o) => o.value === status)?.color
                }`}
              ></div>
              <span className="text-xs font-medium text-gray-700">
                {statusOptions.find((o) => o.value === status)?.label}
              </span>
            </div>
          </div>
          {status === 'available' && (
            <button className="w-full bg-primary-700 text-white py-2 rounded-lg font-medium hover:bg-primary-800 transition-colors text-sm">
              Visit Cabin
            </button>
          )}
          {status === 'busy' && (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-medium cursor-not-allowed text-sm"
            >
              Currently Busy
            </button>
          )}
          {status === 'offline' && (
            <button
              disabled
              className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-medium cursor-not-allowed text-sm"
            >
              Offline
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
