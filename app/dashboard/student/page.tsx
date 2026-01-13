export default function StudentDashboardOverview() {
  // Mock data
  const attendancePercentage = 85;
  const upcomingClasses = [
    { subject: 'Mathematics', time: '10:00 AM', room: 'A-101' },
    { subject: 'Physics', time: '2:00 PM', room: 'B-205' },
  ];
  const pendingLibraryDue = 3;
  const recentAnnouncements = [
    { title: 'Mid-term Exam Schedule', date: '2024-01-15', read: false },
    { title: 'Library Book Return Reminder', date: '2024-01-14', read: true },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Dashboard Overview</h1>
        <p className="text-gray-600">Welcome to your academic dashboard</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Attendance</p>
              <p className="text-3xl font-bold text-primary-900">{attendancePercentage}%</p>
            </div>
            <div className="text-4xl">📱</div>
          </div>
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-primary-700 h-2 rounded-full"
                style={{ width: `${attendancePercentage}%` }}
              ></div>
            </div>
          </div>
        </div>

        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Upcoming Classes</p>
              <p className="text-3xl font-bold text-primary-900">{upcomingClasses.length}</p>
            </div>
            <div className="text-4xl">📅</div>
          </div>
        </div>

        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Library Due</p>
              <p className="text-3xl font-bold text-primary-900">{pendingLibraryDue}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>

        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unread Announcements</p>
              <p className="text-3xl font-bold text-primary-900">
                {recentAnnouncements.filter((a) => !a.read).length}
              </p>
            </div>
            <div className="text-4xl">📢</div>
          </div>
        </div>
      </div>

      {/* Upcoming Classes */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Upcoming Classes Today</h2>
        <div className="space-y-3">
          {upcomingClasses.map((classItem, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-primary-900">{classItem.subject}</p>
                <p className="text-sm text-gray-600">
                  {classItem.time} • Room {classItem.room}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Announcements */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Recent Announcements</h2>
        <div className="space-y-3">
          {recentAnnouncements.map((announcement, index) => (
            <div
              key={index}
              className={`flex items-center justify-between p-4 rounded-lg border ${
                announcement.read
                  ? 'bg-white border-gray-200'
                  : 'bg-primary-50 border-primary-200'
              }`}
            >
              <div>
                <p className="font-semibold text-primary-900">{announcement.title}</p>
                <p className="text-sm text-gray-600">{announcement.date}</p>
              </div>
              {!announcement.read && (
                <span className="px-2 py-1 bg-primary-700 text-white text-xs rounded-full">
                  New
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
