'use client';

import { useState } from 'react';
import { broadcastNotification } from '@/lib/services/notificationService';

export default function BroadcastForm() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [receiverRole, setReceiverRole] = useState<'student' | 'teacher' | 'all'>('student');
  const [isImportant, setIsImportant] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess(false);

    if (!title.trim()) {
      setError('Title is required');
      return;
    }

    if (!message.trim()) {
      setError('Message is required');
      return;
    }

    setIsLoading(true);

    try {
      await broadcastNotification({
        title: title.trim(),
        message: message.trim(),
        receiverRole,
        isImportant,
      });

      setSuccess(true);
      // Reset form
      setTitle('');
      setMessage('');
      setReceiverRole('student');
      setIsImportant(false);

      // Clear success message after 5 seconds
      setTimeout(() => {
        setSuccess(false);
      }, 5000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to broadcast notification');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="bg-background-light p-6 rounded-lg border border-gray-200">
      <div className="mb-4">
        <h2 className="text-xl font-semibold text-primary-900 mb-2">Broadcast Announcement</h2>
        <p className="text-gray-600">Send notifications to students or teachers</p>
      </div>

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          ✓ Notification broadcasted successfully! {isImportant && 'Email notifications have been sent.'}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
            Title <span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Enter announcement title"
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            disabled={isLoading}
            maxLength={200}
          />
          <p className="text-xs text-gray-500 mt-1">{title.length}/200 characters</p>
        </div>

        <div>
          <label htmlFor="message" className="block text-sm font-medium text-gray-700 mb-2">
            Message <span className="text-red-500">*</span>
          </label>
          <textarea
            id="message"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Enter announcement message"
            rows={6}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none resize-none"
            disabled={isLoading}
            maxLength={2000}
          />
          <p className="text-xs text-gray-500 mt-1">{message.length}/2000 characters</p>
        </div>

        <div>
          <label htmlFor="receiverRole" className="block text-sm font-medium text-gray-700 mb-2">
            Send To <span className="text-red-500">*</span>
          </label>
          <select
            id="receiverRole"
            value={receiverRole}
            onChange={(e) => setReceiverRole(e.target.value as 'student' | 'teacher' | 'all')}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            disabled={isLoading}
          >
            <option value="student">All Students</option>
            <option value="teacher">All Teachers</option>
            <option value="all">Everyone (Students & Teachers)</option>
          </select>
        </div>

        <div className="flex items-center">
          <input
            type="checkbox"
            id="isImportant"
            checked={isImportant}
            onChange={(e) => setIsImportant(e.target.checked)}
            className="w-4 h-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
            disabled={isLoading}
          />
          <label htmlFor="isImportant" className="ml-2 text-sm text-gray-700">
            Mark as Important (will send email notifications)
          </label>
        </div>

        <button
          type="submit"
          disabled={isLoading || !title.trim() || !message.trim()}
          className="w-full bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Broadcasting...' : 'Broadcast Notification'}
        </button>
      </form>
    </div>
  );
}
