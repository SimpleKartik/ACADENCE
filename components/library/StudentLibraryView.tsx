'use client';

import { useEffect, useState } from 'react';
import { getMyBooks, BookIssue } from '@/lib/services/libraryService';

export default function StudentLibraryView() {
  const [books, setBooks] = useState<BookIssue[]>([]);
  const [summary, setSummary] = useState({
    totalIssued: 0,
    overdue: 0,
    dueSoon: 0,
  });
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    loadBooks();
    // Auto-refresh every 30 seconds
    const interval = setInterval(loadBooks, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadBooks = async () => {
    try {
      const response = await getMyBooks();
      setBooks(response.data.books);
      setSummary(response.data.summary);
      setError('');
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load library books');
    } finally {
      setIsLoading(false);
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <div key={i} className="animate-pulse">
            <div className="h-24 bg-gray-200 rounded-lg"></div>
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

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Books Issued</p>
              <p className="text-3xl font-bold text-primary-900">{summary.totalIssued}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Due Soon</p>
              <p className="text-3xl font-bold text-primary-900">{summary.dueSoon}</p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>
        <div className="bg-background-light p-6 rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-red-700">{summary.overdue}</p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Issued Books List */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Issued Books</h2>
        {books.length === 0 ? (
          <div className="text-center py-12 text-gray-500">
            <div className="text-4xl mb-2">📚</div>
            <p>No books issued yet</p>
          </div>
        ) : (
          <div className="space-y-4">
            {books.map((book) => {
              const isOverdue = book.isOverdue || false;
              const daysLeft = book.daysLeft ?? 0;
              const isDueSoon = daysLeft > 0 && daysLeft <= 2 && !isOverdue;

              return (
                <div
                  key={book._id}
                  className={`p-4 rounded-lg border ${
                    isOverdue
                      ? 'bg-red-50 border-red-200'
                      : isDueSoon
                      ? 'bg-yellow-50 border-yellow-200'
                      : book.status === 'RETURNED'
                      ? 'bg-gray-50 border-gray-200'
                      : 'bg-white border-gray-200'
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="font-semibold text-primary-900 mb-1">
                        {book.book.title}
                      </h3>
                      <p className="text-sm text-gray-600 mb-2">by {book.book.author}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-600">Issued:</span>{' '}
                          <span className="font-medium">{formatDate(book.issueDate)}</span>
                        </div>
                        <div>
                          <span className="text-gray-600">Due Date:</span>{' '}
                          <span className="font-medium">{formatDate(book.dueDate)}</span>
                        </div>
                        {book.returnDate && (
                          <div>
                            <span className="text-gray-600">Returned:</span>{' '}
                            <span className="font-medium">{formatDate(book.returnDate)}</span>
                          </div>
                        )}
                        <div>
                          <span className="text-gray-600">ISBN:</span>{' '}
                          <span className="font-medium">{book.book.isbn}</span>
                        </div>
                      </div>
                    </div>
                    <div className="ml-4 text-right">
                      {book.status === 'RETURNED' ? (
                        <div>
                          <p className="text-gray-600 font-bold text-lg">Returned</p>
                          <span className="px-2 py-1 bg-gray-200 text-gray-800 text-xs rounded-full mt-1 inline-block">
                            Completed
                          </span>
                        </div>
                      ) : isOverdue ? (
                        <div>
                          <p className="text-red-700 font-bold text-lg">
                            {Math.abs(daysLeft)} days overdue
                          </p>
                          <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full mt-1 inline-block">
                            Overdue
                          </span>
                        </div>
                      ) : (
                        <div>
                          <p
                            className={`font-bold text-lg ${
                              isDueSoon ? 'text-yellow-700' : 'text-primary-900'
                            }`}
                          >
                            {daysLeft} day{daysLeft !== 1 ? 's' : ''} left
                          </p>
                          {isDueSoon && (
                            <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full mt-1 inline-block">
                              Due Soon
                            </span>
                          )}
                        </div>
                      )}
                    </div>
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
