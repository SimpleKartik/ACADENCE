'use client';

import { useEffect, useState } from 'react';
import { getStudentTimetable, TimetableSlot, DayType } from '@/lib/services/timetableService';

export default function TimetableView() {
  const [timetable, setTimetable] = useState<{ [key in DayType]: TimetableSlot[] }>({
    Monday: [],
    Tuesday: [],
    Wednesday: [],
    Thursday: [],
    Friday: [],
    Saturday: [],
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedDay, setSelectedDay] = useState<DayType | null>(null);

  const days: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadTimetable();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadTimetable, 30000);
    return () => clearInterval(interval);
  }, []);

  // Set selected day to today on mount
  useEffect(() => {
    const today = new Date().getDay();
    const dayMap: { [key: number]: DayType } = {
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };
    if (dayMap[today]) {
      setSelectedDay(dayMap[today]);
    } else {
      setSelectedDay('Monday');
    }
  }, []);

  const loadTimetable = async () => {
    try {
      const response = await getStudentTimetable();
      setTimetable(response.data.timetable);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load timetable');
    } finally {
      setIsLoading(false);
    }
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const isCurrentClass = (slot: TimetableSlot): boolean => {
    const now = new Date();
    const currentDay = now.getDay();
    const dayMap: { [key: number]: DayType } = {
      1: 'Monday',
      2: 'Tuesday',
      3: 'Wednesday',
      4: 'Thursday',
      5: 'Friday',
      6: 'Saturday',
    };

    if (dayMap[currentDay] !== slot.day) {
      return false;
    }

    const [startHours, startMinutes] = slot.startTime.split(':').map(Number);
    const [endHours, endMinutes] = slot.endTime.split(':').map(Number);
    const currentHours = now.getHours();
    const currentMins = now.getMinutes();

    const startTotal = startHours * 60 + startMinutes;
    const endTotal = endHours * 60 + endMinutes;
    const currentTotal = currentHours * 60 + currentMins;

    return currentTotal >= startTotal && currentTotal <= endTotal;
  };

  const getSubjectColor = (subject: string) => {
    const colors = [
      'bg-blue-100 text-blue-800 border-blue-200',
      'bg-green-100 text-green-800 border-green-200',
      'bg-purple-100 text-purple-800 border-purple-200',
      'bg-yellow-100 text-yellow-800 border-yellow-200',
      'bg-pink-100 text-pink-800 border-pink-200',
      'bg-indigo-100 text-indigo-800 border-indigo-200',
    ];
    const index = subject.charCodeAt(0) % colors.length;
    return colors[index];
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-20 bg-gray-200 rounded-lg"></div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
        {error}
      </div>
    );
  }

  const todaySlots = selectedDay ? timetable[selectedDay] : [];

  return (
    <div className="space-y-6">
      {/* Day Tabs */}
      <div className="bg-background-light p-4 rounded-lg border border-gray-200">
        <div className="flex flex-wrap gap-2">
          {days.map((day) => {
            const daySlots = timetable[day];
            const isToday = selectedDay === day;
            return (
              <button
                key={day}
                onClick={() => setSelectedDay(day)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  isToday
                    ? 'bg-primary-700 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-200'
                }`}
              >
                {day}
                {daySlots.length > 0 && (
                  <span className={`ml-2 text-xs ${isToday ? 'text-white' : 'text-gray-500'}`}>
                    ({daySlots.length})
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Today's Schedule */}
      {selectedDay && (
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">
            {selectedDay}'s Schedule
          </h3>
          {todaySlots.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📅</div>
              <p>No classes scheduled for {selectedDay}</p>
            </div>
          ) : (
            <div className="space-y-3">
              {todaySlots.map((slot) => {
                const isCurrent = isCurrentClass(slot);
                return (
                  <div
                    key={slot._id}
                    className={`p-4 rounded-lg border ${
                      isCurrent
                        ? 'bg-primary-50 border-primary-300 ring-2 ring-primary-200'
                        : getSubjectColor(slot.subject)
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <p className="font-semibold">{slot.subject}</p>
                          {isCurrent && (
                            <span className="px-2 py-1 bg-primary-700 text-white text-xs rounded-full">
                              Current
                            </span>
                          )}
                        </div>
                        <p className="text-sm">
                          {formatTime(slot.startTime)} - {formatTime(slot.endTime)}
                        </p>
                        <p className="text-sm mt-1">
                          Room {slot.room} • {slot.teacher.name}
                          {slot.teacher.department && ` • ${slot.teacher.department}`}
                        </p>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Weekly Overview */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Weekly Overview</h3>
        <div className="space-y-4">
          {days.map((day) => {
            const daySlots = timetable[day];
            if (daySlots.length === 0) return null;

            return (
              <div key={day} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                <h4 className="font-semibold text-primary-900 mb-3">{day}</h4>
                <div className="space-y-2 ml-4">
                  {daySlots.map((slot) => (
                    <div
                      key={slot._id}
                      className={`p-3 rounded-lg border ${getSubjectColor(slot.subject)}`}
                    >
                      <p className="font-medium">{slot.subject}</p>
                      <p className="text-sm mt-1">
                        {formatTime(slot.startTime)} - {formatTime(slot.endTime)} • Room {slot.room}
                      </p>
                      <p className="text-xs mt-1 opacity-75">{slot.teacher.name}</p>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
        {Object.values(timetable).every((day) => day.length === 0) && (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <p>No timetable available</p>
          </div>
        )}
      </div>
    </div>
  );
}
