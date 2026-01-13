export default function StudentTimetablePage() {
  // Mock timetable data
  const weeklySchedule = [
    {
      day: 'Monday',
      classes: [
        { time: '9:00 AM', subject: 'Mathematics', room: 'A-101', teacher: 'Dr. Smith' },
        { time: '11:00 AM', subject: 'Physics', room: 'B-205', teacher: 'Dr. Johnson' },
        { time: '2:00 PM', subject: 'Chemistry', room: 'C-301', teacher: 'Dr. Williams' },
      ],
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '10:00 AM', subject: 'Computer Science', room: 'D-102', teacher: 'Dr. Brown' },
        { time: '1:00 PM', subject: 'Mathematics', room: 'A-101', teacher: 'Dr. Smith' },
      ],
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '9:00 AM', subject: 'Physics', room: 'B-205', teacher: 'Dr. Johnson' },
        { time: '11:00 AM', subject: 'Chemistry', room: 'C-301', teacher: 'Dr. Williams' },
        { time: '3:00 PM', subject: 'Computer Science', room: 'D-102', teacher: 'Dr. Brown' },
      ],
    },
    {
      day: 'Thursday',
      classes: [
        { time: '10:00 AM', subject: 'Mathematics', room: 'A-101', teacher: 'Dr. Smith' },
        { time: '2:00 PM', subject: 'Physics', room: 'B-205', teacher: 'Dr. Johnson' },
      ],
    },
    {
      day: 'Friday',
      classes: [
        { time: '9:00 AM', subject: 'Chemistry', room: 'C-301', teacher: 'Dr. Williams' },
        { time: '11:00 AM', subject: 'Computer Science', room: 'D-102', teacher: 'Dr. Brown' },
      ],
    },
  ];

  const currentTime = new Date();
  const currentHour = currentTime.getHours();
  const currentMinute = currentTime.getMinutes();
  const currentTimeString = `${currentHour}:${currentMinute.toString().padStart(2, '0')}`;

  const isCurrentClass = (time: string) => {
    // Simple comparison - in real app, would be more sophisticated
    return false; // Placeholder
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Timetable</h1>
        <p className="text-gray-600">Your weekly class schedule with live updates</p>
      </div>

      {/* Today's Schedule */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {weeklySchedule[0].classes.map((classItem, index) => (
            <div
              key={index}
              className={`p-4 rounded-lg border ${
                isCurrentClass(classItem.time)
                  ? 'bg-primary-50 border-primary-300'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-primary-900">{classItem.subject}</p>
                  <p className="text-sm text-gray-600">
                    {classItem.time} • Room {classItem.room} • {classItem.teacher}
                  </p>
                </div>
                {isCurrentClass(classItem.time) && (
                  <span className="px-3 py-1 bg-primary-700 text-white text-sm rounded-full">
                    Current
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Weekly Schedule */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Weekly Schedule</h2>
        <div className="space-y-4">
          {weeklySchedule.map((day, dayIndex) => (
            <div key={dayIndex} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
              <h3 className="font-semibold text-primary-900 mb-3">{day.day}</h3>
              <div className="space-y-2 ml-4">
                {day.classes.map((classItem, classIndex) => (
                  <div
                    key={classIndex}
                    className="flex items-center justify-between p-3 bg-white rounded-lg border border-gray-200"
                  >
                    <div>
                      <p className="font-medium text-primary-900">{classItem.subject}</p>
                      <p className="text-sm text-gray-600">
                        {classItem.time} • {classItem.room} • {classItem.teacher}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
