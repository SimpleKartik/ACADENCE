'use client';

import { useState } from 'react';
import { markAttendance } from '@/lib/services/attendanceService';

export default function QRScanner() {
  const [sessionId, setSessionId] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);
  const [attendanceData, setAttendanceData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);
    setAttendanceData(null);

    if (!sessionId.trim()) {
      setError('Please enter or scan a QR code');
      return;
    }

    setIsLoading(true);

    try {
      const response = await markAttendance(sessionId.trim());
      setSuccess(true);
      setAttendanceData(response.data.attendance);
      setSessionId(''); // Clear input on success
      
      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
        setAttendanceData(null);
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to mark attendance');
      setSuccess(false);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-primary-900 mb-2">Mark Attendance</h2>
        <p className="text-gray-600">Scan QR code or enter session ID to mark your attendance</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          <p className="font-semibold">✓ Attendance marked successfully!</p>
          {attendanceData && (
            <div className="mt-2 text-xs">
              <p>Subject: {attendanceData.subject}</p>
              <p>Time: {new Date(attendanceData.timestamp).toLocaleString()}</p>
            </div>
          )}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="sessionId" className="block text-sm font-medium text-gray-700 mb-2">
            QR Code / Session ID
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="sessionId"
              value={sessionId}
              onChange={(e) => setSessionId(e.target.value)}
              placeholder="Enter session ID from QR code"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading || !sessionId.trim()}
              className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Marking...' : 'Mark Attendance'}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            Tip: Scan the QR code displayed by your teacher or manually enter the session ID
          </p>
        </div>
      </form>

      <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
        <p className="text-sm text-blue-800">
          <strong>Note:</strong> You can only mark attendance once per subject per day. If you've already marked attendance, you'll see an error message.
        </p>
      </div>
    </div>
  );
}
