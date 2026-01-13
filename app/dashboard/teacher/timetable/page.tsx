'use client';

import { useState } from 'react';

export default function TeacherTimetablePage() {
  const [isEditing, setIsEditing] = useState(false);

  // Mock data
  const weeklySchedule = [
    {
      day: 'Monday',
      classes: [
        { time: '10:00 AM', subject: 'Mathematics', room: 'A-101', section: 'Section A' },
        { time: '2:00 PM', subject: 'Advanced Mathematics', room: 'A-102', section: 'Section B' },
      ],
    },
    {
      day: 'Tuesday',
      classes: [
        { time: '11:00 AM', subject: 'Mathematics', room: 'A-101', section: 'Section A' },
      ],
    },
    {
      day: 'Wednesday',
      classes: [
        { time: '10:00 AM', subject: 'Mathematics', room: 'A-101', section: 'Section A' },
        { time: '3:00 PM', subject: 'Advanced Mathematics', room: 'A-102', section: 'Section B' },
      ],
    },
    {
      day: 'Thursday',
      classes: [
        { time: '2:00 PM', subject: 'Advanced Mathematics', room: 'A-102', section: 'Section B' },
      ],
    },
    {
      day: 'Friday',
      classes: [
        { time: '10:00 AM', subject: 'Mathematics', room: 'A-101', section: 'Section A' },
      ],
    },
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-primary-900 mb-2">Timetable Management</h1>
          <p className="text-gray-600">View and update your class schedule</p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
        >
          {isEditing ? 'Save Changes' : 'Edit Timetable'}
        </button>
      </div>

      {/* Today's Schedule */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Today's Schedule</h2>
        <div className="space-y-3">
          {weeklySchedule[0].classes.map((classItem, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-white rounded-lg border border-gray-200"
            >
              <div>
                <p className="font-semibold text-primary-900">{classItem.subject}</p>
                <p className="text-sm text-gray-600">
                  {classItem.time} • Room {classItem.room} • {classItem.section}
                </p>
              </div>
              {isEditing && (
                <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                  Remove
                </button>
              )}
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
                        {classItem.time} • {classItem.room} • {classItem.section}
                      </p>
                    </div>
                    {isEditing && (
                      <button className="text-red-600 hover:text-red-800 text-sm font-medium">
                        Remove
                      </button>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {isEditing && (
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-blue-900 text-sm">
            💡 Changes will be reflected to students in real-time
          </p>
        </div>
      )}
    </div>
  );
}
