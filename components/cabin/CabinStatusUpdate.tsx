'use client';

import { useEffect, useState } from 'react';
import { updateCabinStatus, getMyCabinStatus, CabinStatusType, CabinStatus } from '@/lib/services/cabinStatusService';

export default function CabinStatusUpdate() {
  const [status, setStatus] = useState<CabinStatusType>('AVAILABLE');
  const [note, setNote] = useState('');
  const [currentStatus, setCurrentStatus] = useState<CabinStatus | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoadingCurrent, setIsLoadingCurrent] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);

  useEffect(() => {
    loadCurrentStatus();
  }, []);

  const loadCurrentStatus = async () => {
    setIsLoadingCurrent(true);
    try {
      const response = await getMyCabinStatus();
      if (response.data.cabinStatus) {
        setCurrentStatus(response.data.cabinStatus);
        setStatus(response.data.cabinStatus.status);
        setNote(response.data.cabinStatus.note || '');
        setLastUpdated(new Date(response.data.cabinStatus.updatedAt));
      }
    } catch (err: any) {
      console.error('Failed to load current status:', err);
    } finally {
      setIsLoadingCurrent(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (note && note.length > 500) {
      setError('Note cannot exceed 500 characters');
      return;
    }

    setIsLoading(true);

    try {
      const response = await updateCabinStatus({
        status,
        note: note.trim() || undefined,
      });

      setCurrentStatus(response.data.cabinStatus);
      setLastUpdated(new Date(response.data.cabinStatus.updatedAt));
      setSuccess(true);

      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update cabin status');
    } finally {
      setIsLoading(false);
    }
  };

  const statusOptions: Array<{
    value: CabinStatusType;
    label: string;
    icon: string;
    color: string;
    bgColor: string;
  }> = [
    {
      value: 'AVAILABLE',
      label: 'Available',
      icon: '🟢',
      color: 'text-green-700',
      bgColor: 'bg-green-50 border-green-200',
    },
    {
      value: 'BUSY',
      label: 'Busy',
      icon: '🔴',
      color: 'text-red-700',
      bgColor: 'bg-red-50 border-red-200',
    },
    {
      value: 'IN_CLASS',
      label: 'In Class',
      icon: '🟡',
      color: 'text-yellow-700',
      bgColor: 'bg-yellow-50 border-yellow-200',
    },
  ];

  const formatTime = (date: Date | null): string => {
    if (!date) return 'Never';
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
      return date.toLocaleString();
    }
  };

  if (isLoadingCurrent) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-semibold text-primary-900 mb-2">Update Cabin Status</h2>
        <p className="text-gray-600">Update your availability status for students</p>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✓ Cabin status updated successfully!
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Status Selector */}
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Select Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {statusOptions.map((option) => (
              <button
                key={option.value}
                type="button"
                onClick={() => setStatus(option.value)}
                className={`p-6 rounded-lg border-2 transition-all text-left ${
                  status === option.value
                    ? `${option.bgColor} border-primary-500`
                    : 'border-gray-200 bg-white hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3">
                  <span className="text-3xl">{option.icon}</span>
                  <div>
                    <p
                      className={`font-semibold text-lg ${
                        status === option.value ? option.color : 'text-gray-700'
                      }`}
                    >
                      {option.label}
                    </p>
                    {status === option.value && (
                      <p className="text-sm text-primary-700 mt-1">Selected</p>
                    )}
                  </div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Note Input */}
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <label htmlFor="note" className="block text-sm font-medium text-gray-700 mb-2">
            Optional Note
          </label>
          <textarea
            id="note"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="Add an optional note (e.g., 'Available after 3 PM')"
            rows={3}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
            disabled={isLoading}
            maxLength={500}
          />
          <p className="text-xs text-gray-500 mt-1">{note.length}/500 characters</p>
        </div>

        {/* Last Updated */}
        {lastUpdated && (
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <p className="text-sm text-blue-800">
              <strong>Last updated:</strong> {formatTime(lastUpdated)}
            </p>
          </div>
        )}

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading}
          className="w-full bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Updating...' : 'Update Status'}
        </button>
      </form>

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
            <strong>In Class:</strong> Teaching a class, students will see in-class status
          </li>
        </ul>
        <p className="text-xs text-blue-700 mt-4">
          💡 Your status is visible to all students in real-time
        </p>
      </div>
    </div>
  );
}
