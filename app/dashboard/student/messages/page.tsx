'use client';

import { useState } from 'react';

export default function StudentMessagesPage() {
  const [selectedTeacher, setSelectedTeacher] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Mock data
  const teachers = [
    { id: '1', name: 'Dr. Smith', subject: 'Mathematics', available: true },
    { id: '2', name: 'Dr. Johnson', subject: 'Physics', available: true },
    { id: '3', name: 'Dr. Williams', subject: 'Chemistry', available: false },
    { id: '4', name: 'Dr. Brown', subject: 'Computer Science', available: true },
  ];

  const messages = selectedTeacher
    ? [
        { id: 1, sender: 'student', text: 'Hello, I have a question about the assignment.', time: '10:30 AM' },
        { id: 2, sender: 'teacher', text: 'Sure, what would you like to know?', time: '10:35 AM' },
        { id: 3, sender: 'student', text: 'When is the deadline for submission?', time: '10:36 AM' },
        { id: 4, sender: 'teacher', text: 'The deadline is next Friday at 5 PM.', time: '10:40 AM' },
      ]
    : [];

  const handleSend = () => {
    if (message.trim() && selectedTeacher) {
      // In real app, would send to API
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Messages</h1>
        <p className="text-gray-600">Communicate with your teachers</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Teacher List */}
        <div className="lg:col-span-1 bg-background-light p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Teachers</h2>
          <div className="space-y-2">
            {teachers.map((teacher) => (
              <button
                key={teacher.id}
                onClick={() => setSelectedTeacher(teacher.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors ${
                  selectedTeacher === teacher.id
                    ? 'bg-primary-50 border-primary-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-primary-900">{teacher.name}</p>
                    <p className="text-sm text-gray-600">{teacher.subject}</p>
                  </div>
                  <div
                    className={`w-3 h-3 rounded-full ${
                      teacher.available ? 'bg-green-500' : 'bg-gray-400'
                    }`}
                  ></div>
                </div>
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-background-light rounded-lg border border-gray-200 flex flex-col">
          {selectedTeacher ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-primary-900">
                  {teachers.find((t) => t.id === selectedTeacher)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  {teachers.find((t) => t.id === selectedTeacher)?.subject}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'student' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'student'
                          ? 'bg-primary-700 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'student' ? 'text-primary-200' : 'text-gray-500'
                        }`}
                      >
                        {msg.time}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Message Input */}
              <div className="p-4 border-t border-gray-200">
                <div className="flex space-x-2">
                  <input
                    type="text"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                    placeholder="Type your message..."
                    className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  />
                  <button
                    onClick={handleSend}
                    className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
                  >
                    Send
                  </button>
                </div>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center">
              <div className="text-center">
                <div className="text-6xl mb-4">💬</div>
                <p className="text-gray-600">Select a teacher to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
