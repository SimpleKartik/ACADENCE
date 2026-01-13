export default function StudentAttendancePage() {
  // Mock data
  const subjects = [
    { name: 'Mathematics', attended: 38, total: 45, percentage: 84 },
    { name: 'Physics', attended: 32, total: 40, percentage: 80 },
    { name: 'Chemistry', attended: 35, total: 42, percentage: 83 },
    { name: 'Computer Science', attended: 40, total: 45, percentage: 89 },
  ];
  const threshold = 75;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Attendance</h1>
        <p className="text-gray-600">View your attendance records by subject</p>
      </div>

      {/* QR Scan Button */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-primary-900 mb-2">Mark Attendance</h2>
            <p className="text-gray-600">Scan QR code to mark your attendance</p>
          </div>
          <button className="bg-primary-700 text-white px-6 py-3 rounded-lg font-semibold hover:bg-primary-800 transition-colors">
            📱 Scan QR Code
          </button>
        </div>
      </div>

      {/* Subject-wise Attendance */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Subject-wise Attendance</h2>
        <div className="space-y-4">
          {subjects.map((subject, index) => {
            const isLow = subject.percentage < threshold;
            return (
              <div
                key={index}
                className={`p-4 rounded-lg border ${
                  isLow
                    ? 'bg-red-50 border-red-200'
                    : 'bg-white border-gray-200'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-semibold text-primary-900">{subject.name}</h3>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`text-2xl font-bold ${
                        isLow ? 'text-red-700' : 'text-primary-900'
                      }`}
                    >
                      {subject.percentage}%
                    </span>
                    {isLow && (
                      <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                        Low
                      </span>
                    )}
                  </div>
                </div>
                <div className="mb-2">
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className={`h-3 rounded-full ${
                        isLow ? 'bg-red-500' : 'bg-primary-700'
                      }`}
                      style={{ width: `${subject.percentage}%` }}
                    ></div>
                  </div>
                </div>
                <p className="text-sm text-gray-600">
                  Attended: {subject.attended} / Total: {subject.total} classes
                </p>
                {isLow && (
                  <p className="text-sm text-red-700 mt-2 font-medium">
                    ⚠️ Attendance below {threshold}% threshold
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
