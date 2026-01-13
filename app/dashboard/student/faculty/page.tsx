export default function StudentFacultyPage() {
  // Mock data
  const faculty = [
    { id: 1, name: 'Dr. Smith', subject: 'Mathematics', cabin: 'A-201', status: 'available' },
    { id: 2, name: 'Dr. Johnson', subject: 'Physics', cabin: 'B-305', status: 'available' },
    { id: 3, name: 'Dr. Williams', subject: 'Chemistry', cabin: 'C-102', status: 'busy' },
    { id: 4, name: 'Dr. Brown', subject: 'Computer Science', cabin: 'D-405', status: 'available' },
    { id: 5, name: 'Dr. Davis', subject: 'Biology', cabin: 'E-203', status: 'offline' },
    { id: 6, name: 'Dr. Miller', subject: 'English', cabin: 'F-101', status: 'available' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available':
        return 'bg-green-500';
      case 'busy':
        return 'bg-yellow-500';
      case 'offline':
        return 'bg-gray-400';
      default:
        return 'bg-gray-400';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'available':
        return 'Available';
      case 'busy':
        return 'Busy';
      case 'offline':
        return 'Offline';
      default:
        return 'Unknown';
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Faculty Availability</h1>
        <p className="text-gray-600">Check faculty cabin status before visiting</p>
      </div>

      {/* Status Legend */}
      <div className="bg-background-light p-4 rounded-lg border border-gray-200">
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-green-500"></div>
            <span className="text-sm text-gray-700">Available</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-yellow-500"></div>
            <span className="text-sm text-gray-700">Busy</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-400"></div>
            <span className="text-sm text-gray-700">Offline</span>
          </div>
        </div>
      </div>

      {/* Faculty List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {faculty.map((member) => (
          <div
            key={member.id}
            className="bg-background-light p-6 rounded-lg border border-gray-200 hover:shadow-lg transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <h3 className="font-semibold text-primary-900 text-lg mb-1">{member.name}</h3>
                <p className="text-gray-600 mb-2">{member.subject}</p>
                <p className="text-sm text-gray-500">Cabin: {member.cabin}</p>
              </div>
              <div className="flex flex-col items-end">
                <div
                  className={`w-4 h-4 rounded-full ${getStatusColor(member.status)} mb-2`}
                ></div>
                <span
                  className={`text-xs font-medium ${
                    member.status === 'available'
                      ? 'text-green-700'
                      : member.status === 'busy'
                      ? 'text-yellow-700'
                      : 'text-gray-600'
                  }`}
                >
                  {getStatusLabel(member.status)}
                </span>
              </div>
            </div>
            {member.status === 'available' && (
              <button className="w-full bg-primary-700 text-white py-2 rounded-lg font-medium hover:bg-primary-800 transition-colors text-sm">
                Visit Cabin
              </button>
            )}
            {member.status === 'busy' && (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-medium cursor-not-allowed text-sm"
              >
                Currently Busy
              </button>
            )}
            {member.status === 'offline' && (
              <button
                disabled
                className="w-full bg-gray-300 text-gray-600 py-2 rounded-lg font-medium cursor-not-allowed text-sm"
              >
                Offline
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
