'use client';

import { useEffect, useState } from 'react';
import { getCabinStatuses, TeacherWithStatus } from '@/lib/services/cabinStatusService';

export default function CabinStatusList() {
  const [teachers, setTeachers] = useState<TeacherWithStatus[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadCabinStatuses();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadCabinStatuses, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadCabinStatuses = async () => {
    try {
      const response = await getCabinStatuses();
      setTeachers(response.data.teachers);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load cabin statuses');
    } finally {
      setIsLoading(false);
    }
  };

  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'AVAILABLE':
        return {
          label: 'Available',
          color: 'text-green-700',
          bgColor: 'bg-green-100',
          dotColor: 'bg-green-500',
          buttonClass: 'bg-primary-700 hover:bg-primary-800',
          buttonText: 'Visit Cabin',
        };
      case 'BUSY':
        return {
          label: 'Busy',
          color: 'text-red-700',
          bgColor: 'bg-red-100',
          dotColor: 'bg-red-500',
          buttonClass: 'bg-gray-300 text-gray-600 cursor-not-allowed',
          buttonText: 'Currently Busy',
        };
      case 'IN_CLASS':
        return {
          label: 'In Class',
          color: 'text-yellow-700',
          bgColor: 'bg-yellow-100',
          dotColor: 'bg-yellow-500',
          buttonClass: 'bg-gray-300 text-gray-600 cursor-not-allowed',
          buttonText: 'In Class',
        };
      default:
        return {
          label: 'Offline',
          color: 'text-gray-600',
          bgColor: 'bg-gray-100',
          dotColor: 'bg-gray-400',
          buttonClass: 'bg-gray-300 text-gray-600 cursor-not-allowed',
          buttonText: 'Offline',
        };
    }
  };

  const formatTime = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return 'Just now';
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
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
      {/* Status Legend */}
      <div className="bg-background-light p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap items-center gap-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-red-500"></div>
            <span className="text-sm text-gray-700">Busy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-700">In Class</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span className="text-sm text-gray-700">Offline</span>
          </div>
        </div>
      </div>

      {/* Teachers List */}
      {teachers.length === 0 ? (
        <div className="text-center py-12 text-gray-500">
          <div className="text-4xl mb-2">👨‍🏫</div>
          <p>No faculty members found</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {teachers.map((item) => {
            const statusConfig = getStatusConfig(item.status);
            return (
              <div
                key={item.teacher._id}
                className="bg-background-light p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-semibold text-primary-900 text-lg mb-1">
                      {item.teacher.name}
                    </h3>
                    {item.teacher.department && (
                      <p className="text-gray-600 mb-2">{item.teacher.department}</p>
                    )}
                    <p className="text-sm text-gray-500">{item.teacher.email}</p>
                  </div>
                  <div className="flex flex-col items-end">
                    <div
                      className={`w-4 h-4 rounded-full ${statusConfig.dotColor} mb-2`}
                    ></div>
                    <span
                      className={`text-xs font-medium px-2 py-1 rounded-full ${statusConfig.bgColor} ${statusConfig.color}`}
                    >
                      {statusConfig.label}
                    </span>
                  </div>
                </div>

                {item.note && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
                    <p className="text-sm text-gray-700">{item.note}</p>
                  </div>
                )}

                <div className="mb-4">
                  <p className="text-xs text-gray-500">
                    Updated: {formatTime(item.updatedAt)}
                  </p>
                </div>

                <button
                  disabled={item.status !== 'AVAILABLE'}
                  className={`w-full py-2 rounded-lg font-medium transition-colors text-sm ${statusConfig.buttonClass}`}
                >
                  {statusConfig.buttonText}
                </button>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
