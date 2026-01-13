'use client';

import { useState } from 'react';

export default function TeacherBroadcastPage() {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [target, setTarget] = useState('all');
  const [inApp, setInApp] = useState(true);
  const [email, setEmail] = useState(false);

  // Mock data
  const sentAnnouncements = [
    {
      id: 1,
      title: 'Mid-term Exam Schedule',
      content: 'The mid-term examination schedule has been released...',
      target: 'All Students',
      date: '2024-01-15',
      inApp: true,
      email: true,
      recipients: 120,
    },
    {
      id: 2,
      title: 'Assignment Deadline Reminder',
      content: 'Please submit your assignments by Friday...',
      target: 'Mathematics Section A',
      date: '2024-01-14',
      inApp: true,
      email: false,
      recipients: 45,
    },
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // In real app, would send to API
    alert('Announcement sent successfully!');
    setTitle('');
    setContent('');
    setTarget('all');
    setInApp(true);
    setEmail(false);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Broadcast Announcements</h1>
        <p className="text-gray-600">Send announcements to students via in-app and email</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Compose Announcement */}
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Compose Announcement</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                Title
              </label>
              <input
                type="text"
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Announcement title"
              />
            </div>

            <div>
              <label htmlFor="content" className="block text-sm font-medium text-gray-700 mb-2">
                Content
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                required
                rows={6}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                placeholder="Announcement content..."
              />
            </div>

            <div>
              <label htmlFor="target" className="block text-sm font-medium text-gray-700 mb-2">
                Target Audience
              </label>
              <select
                id="target"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
              >
                <option value="all">All Students</option>
                <option value="section-a">Mathematics Section A</option>
                <option value="section-b">Advanced Mathematics Section B</option>
              </select>
            </div>

            <div className="space-y-2">
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={inApp}
                  onChange={(e) => setInApp(e.target.checked)}
                  className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Send via In-App Notification</span>
              </label>
              <label className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={email}
                  onChange={(e) => setEmail(e.target.checked)}
                  className="rounded border-gray-300 text-primary-700 focus:ring-primary-500"
                />
                <span className="text-sm text-gray-700">Send via Email</span>
              </label>
            </div>

            <button
              type="submit"
              className="w-full bg-primary-700 text-white py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
            >
              Send Announcement
            </button>
          </form>
        </div>

        {/* Sent Announcements */}
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Sent Announcements</h2>
          <div className="space-y-4">
            {sentAnnouncements.map((announcement) => (
              <div
                key={announcement.id}
                className="p-4 bg-white rounded-lg border border-gray-200"
              >
                <h3 className="font-semibold text-primary-900 mb-2">{announcement.title}</h3>
                <p className="text-sm text-gray-700 mb-3 line-clamp-2">{announcement.content}</p>
                <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
                  <span>To: {announcement.target}</span>
                  <span>{announcement.date}</span>
                </div>
                <div className="flex items-center space-x-2">
                  {announcement.inApp && (
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                      📱 In-App
                    </span>
                  )}
                  {announcement.email && (
                    <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                      📧 Email
                    </span>
                  )}
                  <span className="text-xs text-gray-600">
                    {announcement.recipients} recipients
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
