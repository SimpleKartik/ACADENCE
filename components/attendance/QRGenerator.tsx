'use client';

import { useState, useEffect, useRef } from 'react';
import { generateQR } from '@/lib/services/attendanceService';

interface QRGeneratorProps {
  onQRGenerated?: (sessionId: string) => void;
}

export default function QRGenerator({ onQRGenerated }: QRGeneratorProps) {
  const [subject, setSubject] = useState('');
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [sessionId, setSessionId] = useState<string | null>(null);
  const [expiresAt, setExpiresAt] = useState<Date | null>(null);
  const [expiresIn, setExpiresIn] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Countdown timer
  useEffect(() => {
    if (expiresIn > 0) {
      intervalRef.current = setInterval(() => {
        setExpiresIn((prev) => {
          if (prev <= 1) {
            if (intervalRef.current) {
              clearInterval(intervalRef.current);
            }
            setQrCode(null);
            setSessionId(null);
            setExpiresAt(null);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [expiresIn]);

  const handleGenerate = async () => {
    if (!subject.trim()) {
      setError('Please enter a subject name');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await generateQR(subject.trim());
      setQrCode(response.data.qrCode);
      setSessionId(response.data.sessionId);
      setExpiresAt(new Date(response.data.expiresAt));
      setExpiresIn(response.data.expiresIn);
      
      if (onQRGenerated) {
        onQRGenerated(response.data.sessionId);
      }
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to generate QR code');
      setQrCode(null);
      setSessionId(null);
      setExpiresAt(null);
      setExpiresIn(0);
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="bg-background-light p-6 rounded-lg border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-xl font-semibold text-primary-900">Generate QR Code</h2>
          <p className="text-gray-600">Create QR code for students to scan</p>
        </div>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      <div className="space-y-4">
        <div>
          <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
            Subject Name
          </label>
          <div className="flex gap-2">
            <input
              type="text"
              id="subject"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="e.g., Mathematics, Physics"
              className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              disabled={isLoading}
            />
            <button
              onClick={handleGenerate}
              disabled={isLoading || !subject.trim()}
              className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Generating...' : qrCode ? 'Regenerate' : 'Generate QR'}
            </button>
          </div>
        </div>

        {qrCode && (
          <div className="mt-6 p-6 bg-white rounded-lg border border-gray-200">
            <div className="text-center">
              <div className="mb-4 flex justify-center">
                <img
                  src={qrCode}
                  alt="QR Code"
                  className="w-64 h-64 border-4 border-gray-200 rounded-lg"
                />
              </div>
              
              {expiresIn > 0 && (
                <div className="mb-2">
                  <p className="text-sm text-gray-600">Expires in:</p>
                  <p className="text-2xl font-bold text-primary-900">
                    {formatTime(expiresIn)}
                  </p>
                </div>
              )}

              {expiresIn === 0 && (
                <div className="mb-2">
                  <p className="text-sm text-red-600 font-medium">QR Code Expired</p>
                  <p className="text-xs text-gray-500">Please generate a new QR code</p>
                </div>
              )}

              <p className="text-xs text-gray-500 mt-2">
                Subject: <span className="font-semibold">{subject}</span>
              </p>
            </div>
          </div>
        )}

        {!qrCode && !isLoading && (
          <div className="text-center py-8 text-gray-500">
            <div className="text-4xl mb-2">📱</div>
            <p>Enter subject name and click "Generate QR" to create a QR code</p>
          </div>
        )}
      </div>
    </div>
  );
}
