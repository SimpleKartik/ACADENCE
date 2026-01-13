export default function StudentAnnouncementsPage() {
  // Mock data
  const announcements = [
    {
      id: 1,
      title: 'Mid-term Exam Schedule Released',
      content: 'The mid-term examination schedule has been released. Please check the timetable section for details.',
      sender: 'Admin',
      date: '2024-01-15',
      time: '10:00 AM',
      read: false,
      emailSent: true,
    },
    {
      id: 2,
      title: 'Library Book Return Reminder',
      content: 'Please return all overdue books by the end of this week to avoid fines.',
      sender: 'Library Department',
      date: '2024-01-14',
      time: '2:30 PM',
      read: true,
      emailSent: true,
    },
    {
      id: 3,
      title: 'Physics Lab Schedule Change',
      content: 'The Physics lab scheduled for tomorrow has been moved to next week. New time will be announced soon.',
      sender: 'Dr. Johnson',
      date: '2024-01-13',
      time: '9:15 AM',
      read: true,
      emailSent: false,
    },
    {
      id: 4,
      title: 'Student Council Elections',
      content: 'Student council elections will be held next month. Interested candidates can register starting Monday.',
      sender: 'Admin',
      date: '2024-01-12',
      time: '4:00 PM',
      read: false,
      emailSent: true,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Announcements</h1>
        <p className="text-gray-600">Stay updated with important announcements from teachers and administration</p>
      </div>

      {/* Unread Count */}
      <div className="bg-primary-50 border border-primary-200 p-4 rounded-lg">
        <p className="text-primary-900">
          <span className="font-semibold">
            {announcements.filter((a) => !a.read).length} unread
          </span>{' '}
          announcement{announcements.filter((a) => !a.read).length !== 1 ? 's' : ''}
        </p>
      </div>

      {/* Announcements List */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement.id}
            className={`p-6 rounded-lg border ${
              announcement.read
                ? 'bg-background-light border-gray-200'
                : 'bg-primary-50 border-primary-200'
            }`}
          >
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="font-semibold text-primary-900">{announcement.title}</h3>
                  {!announcement.read && (
                    <span className="px-2 py-1 bg-primary-700 text-white text-xs rounded-full">
                      New
                    </span>
                  )}
                </div>
                <p className="text-gray-700 mb-3">{announcement.content}</p>
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <span>From: {announcement.sender}</span>
                  <span>•</span>
                  <span>{announcement.date}</span>
                  <span>•</span>
                  <span>{announcement.time}</span>
                </div>
              </div>
              <div className="ml-4 flex flex-col items-end space-y-2">
                {announcement.emailSent && (
                  <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                    📧 Email Sent
                  </span>
                )}
                <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                  📱 In-App
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
