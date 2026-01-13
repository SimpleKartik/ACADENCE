'use client';

import { useState } from 'react';

export default function TeacherMessagesPage() {
  const [selectedStudent, setSelectedStudent] = useState<string | null>(null);
  const [message, setMessage] = useState('');

  // Mock data
  const students = [
    { id: '1', name: 'John Doe', rollNo: 'STU001', unread: 2 },
    { id: '2', name: 'Jane Smith', rollNo: 'STU002', unread: 0 },
    { id: '3', name: 'Bob Johnson', rollNo: 'STU003', unread: 1 },
    { id: '4', name: 'Alice Williams', rollNo: 'STU004', unread: 0 },
  ];

  const messages = selectedStudent
    ? [
        { id: 1, sender: 'student', text: 'Hello, I have a question about the assignment.', time: '10:30 AM', read: true },
        { id: 2, sender: 'teacher', text: 'Sure, what would you like to know?', time: '10:35 AM', read: true },
        { id: 3, sender: 'student', text: 'When is the deadline for submission?', time: '10:36 AM', read: true },
        { id: 4, sender: 'teacher', text: 'The deadline is next Friday at 5 PM.', time: '10:40 AM', read: true },
        { id: 5, sender: 'student', text: 'Thank you!', time: '10:41 AM', read: true },
      ]
    : [];

  const handleSend = () => {
    if (message.trim() && selectedStudent) {
      // In real app, would send to API
      setMessage('');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Student Messages</h1>
        <p className="text-gray-600">Communicate with your students</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Student List */}
        <div className="lg:col-span-1 bg-background-light p-6 rounded-lg border border-gray-200">
          <h2 className="text-xl font-semibold text-primary-900 mb-4">Students</h2>
          <div className="space-y-2">
            {students.map((student) => (
              <button
                key={student.id}
                onClick={() => setSelectedStudent(student.id)}
                className={`w-full text-left p-4 rounded-lg border transition-colors relative ${
                  selectedStudent === student.id
                    ? 'bg-primary-50 border-primary-300'
                    : 'bg-white border-gray-200 hover:bg-gray-50'
                }`}
              >
                <div>
                  <p className="font-semibold text-primary-900">{student.name}</p>
                  <p className="text-sm text-gray-600">Roll No: {student.rollNo}</p>
                </div>
                {student.unread > 0 && (
                  <span className="absolute top-2 right-2 px-2 py-1 bg-primary-700 text-white text-xs rounded-full">
                    {student.unread}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Chat Interface */}
        <div className="lg:col-span-2 bg-background-light rounded-lg border border-gray-200 flex flex-col">
          {selectedStudent ? (
            <>
              {/* Chat Header */}
              <div className="p-4 border-b border-gray-200">
                <h3 className="font-semibold text-primary-900">
                  {students.find((s) => s.id === selectedStudent)?.name}
                </h3>
                <p className="text-sm text-gray-600">
                  Roll No: {students.find((s) => s.id === selectedStudent)?.rollNo}
                </p>
              </div>

              {/* Messages */}
              <div className="flex-1 p-4 overflow-y-auto space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.sender === 'teacher' ? 'justify-end' : 'justify-start'}`}
                  >
                    <div
                      className={`max-w-xs lg:max-w-md px-4 py-2 rounded-lg ${
                        msg.sender === 'teacher'
                          ? 'bg-primary-700 text-white'
                          : 'bg-gray-200 text-gray-900'
                      }`}
                    >
                      <p>{msg.text}</p>
                      <p
                        className={`text-xs mt-1 ${
                          msg.sender === 'teacher' ? 'text-primary-200' : 'text-gray-500'
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
                <p className="text-gray-600">Select a student to start messaging</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
