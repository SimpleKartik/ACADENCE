'use client';

import { useEffect, useState } from 'react';
import {
  getMyTimetable,
  createTimetableSlot,
  updateTimetableSlot,
  deleteTimetableSlot,
  TimetableSlot,
  DayType,
} from '@/lib/services/timetableService';

export default function TimetableEditor() {
  const [slots, setSlots] = useState<TimetableSlot[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    subject: '',
    day: 'Monday' as DayType,
    startTime: '',
    endTime: '',
    room: '',
  });

  const days: DayType[] = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

  useEffect(() => {
    loadTimetable();
  }, []);

  const loadTimetable = async () => {
    setIsLoading(true);
    setError('');
    try {
      const response = await getMyTimetable();
      setSlots(response.data.timetableSlots);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load timetable');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (!formData.subject.trim() || !formData.startTime || !formData.endTime || !formData.room.trim()) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      if (editingId) {
        await updateTimetableSlot(editingId, formData);
        setEditingId(null);
      } else {
        await createTimetableSlot(formData);
      }
      await loadTimetable();
      resetForm();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to save timetable slot');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this timetable slot?')) {
      return;
    }

    try {
      await deleteTimetableSlot(id);
      await loadTimetable();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to delete timetable slot');
    }
  };

  const handleEdit = (slot: TimetableSlot) => {
    setEditingId(slot._id);
    setFormData({
      subject: slot.subject,
      day: slot.day,
      startTime: slot.startTime,
      endTime: slot.endTime,
      room: slot.room,
    });
    setIsAdding(true);
  };

  const resetForm = () => {
    setFormData({
      subject: '',
      day: 'Monday',
      startTime: '',
      endTime: '',
      room: '',
    });
    setIsAdding(false);
    setEditingId(null);
  };

  const formatTime = (time: string): string => {
    const [hours, minutes] = time.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
  };

  const getSlotsByDay = (day: DayType) => {
    return slots.filter((slot) => slot.day === day).sort((a, b) => {
      const timeA = a.startTime.split(':').map(Number);
      const timeB = b.startTime.split(':').map(Number);
      return timeA[0] * 60 + timeA[1] - (timeB[0] * 60 + timeB[1]);
    });
  };

  // Generate color for subject
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
      <div className="flex items-center justify-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-700"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-primary-900">Manage Timetable</h2>
          <p className="text-gray-600">Add, edit, or remove your class schedule</p>
        </div>
        <button
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
        >
          {isAdding ? 'Cancel' : '+ Add Slot'}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {/* Add/Edit Form */}
      {isAdding && (
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">
            {editingId ? 'Edit Timetable Slot' : 'Add New Timetable Slot'}
          </h3>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700 mb-2">
                  Subject <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>

              <div>
                <label htmlFor="day" className="block text-sm font-medium text-gray-700 mb-2">
                  Day <span className="text-red-500">*</span>
                </label>
                <select
                  id="day"
                  value={formData.day}
                  onChange={(e) => setFormData({ ...formData, day: e.target.value as DayType })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                >
                  {days.map((day) => (
                    <option key={day} value={day}>
                      {day}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="startTime" className="block text-sm font-medium text-gray-700 mb-2">
                  Start Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="startTime"
                  value={formData.startTime}
                  onChange={(e) => setFormData({ ...formData, startTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">24-hour format (HH:mm)</p>
              </div>

              <div>
                <label htmlFor="endTime" className="block text-sm font-medium text-gray-700 mb-2">
                  End Time <span className="text-red-500">*</span>
                </label>
                <input
                  type="time"
                  id="endTime"
                  value={formData.endTime}
                  onChange={(e) => setFormData({ ...formData, endTime: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">24-hour format (HH:mm)</p>
              </div>

              <div className="md:col-span-2">
                <label htmlFor="room" className="block text-sm font-medium text-gray-700 mb-2">
                  Room <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="room"
                  value={formData.room}
                  onChange={(e) => setFormData({ ...formData, room: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>
            </div>

            <div className="flex space-x-3">
              <button
                type="submit"
                className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
              >
                {editingId ? 'Update' : 'Add'} Slot
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Weekly Timetable */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Weekly Schedule</h3>
        {slots.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📅</div>
            <p>No timetable slots yet. Add your first slot to get started!</p>
          </div>
        ) : (
          <div className="space-y-4">
            {days.map((day) => {
              const daySlots = getSlotsByDay(day);
              if (daySlots.length === 0) return null;

              return (
                <div key={day} className="border-b border-gray-200 pb-4 last:border-0 last:pb-0">
                  <h4 className="font-semibold text-primary-900 mb-3">{day}</h4>
                  <div className="space-y-2 ml-4">
                    {daySlots.map((slot) => (
                      <div
                        key={slot._id}
                        className={`p-4 rounded-lg border ${getSubjectColor(slot.subject)}`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <p className="font-semibold">{slot.subject}</p>
                            <p className="text-sm mt-1">
                              {formatTime(slot.startTime)} - {formatTime(slot.endTime)} • Room {slot.room}
                            </p>
                          </div>
                          <div className="flex space-x-2">
                            <button
                              onClick={() => handleEdit(slot)}
                              className="px-3 py-1 bg-white text-primary-700 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors"
                            >
                              Edit
                            </button>
                            <button
                              onClick={() => handleDelete(slot._id)}
                              className="px-3 py-1 bg-red-100 text-red-700 rounded-lg text-sm font-medium hover:bg-red-200 transition-colors"
                            >
                              Delete
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
