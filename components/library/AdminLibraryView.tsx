'use client';

import { useEffect, useState } from 'react';
import {
  getAllBooks,
  getAllIssues,
  issueBook,
  returnBook,
  createBook,
  updateBook,
  Book,
  BookIssue,
} from '@/lib/services/libraryService';

export default function AdminLibraryView() {
  const [books, setBooks] = useState<Book[]>([]);
  const [issues, setIssues] = useState<BookIssue[]>([]);
  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [activeTab, setActiveTab] = useState<'books' | 'issues'>('books');
  const [isAddingBook, setIsAddingBook] = useState(false);
  const [isIssuing, setIsIssuing] = useState(false);
  const [editingBook, setEditingBook] = useState<Book | null>(null);
  const [bookForm, setBookForm] = useState({
    title: '',
    author: '',
    isbn: '',
    totalCopies: 1,
  });
  const [issueForm, setIssueForm] = useState({
    bookId: '',
    studentId: '',
  });
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setIsLoading(true);
    setError('');
    try {
      const [booksResponse, issuesResponse] = await Promise.all([
        getAllBooks(),
        getAllIssues(),
      ]);
      setBooks(booksResponse.data.books);
      setIssues(issuesResponse.data.bookIssues);
      
      // Extract unique students from issues
      const studentMap = new Map();
      issuesResponse.data.bookIssues.forEach((issue: BookIssue) => {
        if (issue.student && !studentMap.has(issue.student._id)) {
          studentMap.set(issue.student._id, issue.student);
        }
      });
      setStudents(Array.from(studentMap.values()));
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load library data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      await createBook(bookForm);
      setSuccess('Book created successfully');
      setIsAddingBook(false);
      setBookForm({ title: '', author: '', isbn: '', totalCopies: 1 });
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create book');
    }
  };

  const handleUpdateBook = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingBook) return;

    setError('');
    setSuccess('');

    try {
      await updateBook(editingBook._id, bookForm);
      setSuccess('Book updated successfully');
      setEditingBook(null);
      setBookForm({ title: '', author: '', isbn: '', totalCopies: 1 });
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to update book');
    }
  };

  const handleIssueBook = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!issueForm.bookId || !issueForm.studentId) {
      setError('Please select both book and student');
      return;
    }

    setIsIssuing(true);
    try {
      await issueBook({
        bookId: issueForm.bookId,
        studentId: issueForm.studentId,
      });
      setSuccess('Book issued successfully');
      setIssueForm({ bookId: '', studentId: '' });
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to issue book');
    } finally {
      setIsIssuing(false);
    }
  };

  const handleReturnBook = async (issueId: string) => {
    if (!confirm('Are you sure you want to mark this book as returned?')) {
      return;
    }

    setError('');
    setSuccess('');

    try {
      await returnBook({ issueId });
      setSuccess('Book returned successfully');
      await loadData();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to return book');
    }
  };

  const startEdit = (book: Book) => {
    setEditingBook(book);
    setBookForm({
      title: book.title,
      author: book.author,
      isbn: book.isbn,
      totalCopies: book.totalCopies,
    });
    setIsAddingBook(true);
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString();
  };

  const filteredBooks = books.filter(
    (book) =>
      book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
      book.isbn.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeIssues = issues.filter((issue) => issue.status !== 'RETURNED');

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
          <h2 className="text-xl font-semibold text-primary-900">Library Management</h2>
          <p className="text-gray-600">Manage books and track issues</p>
        </div>
        <div className="flex space-x-2">
          <button
            onClick={() => {
              setIsAddingBook(true);
              setEditingBook(null);
              setBookForm({ title: '', author: '', isbn: '', totalCopies: 1 });
            }}
            className="bg-primary-700 text-white px-4 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors"
          >
            + Add Book
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
          {success}
        </div>
      )}

      {/* Add/Edit Book Form */}
      {isAddingBook && (
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">
            {editingBook ? 'Edit Book' : 'Add New Book'}
          </h3>
          <form onSubmit={editingBook ? handleUpdateBook : handleCreateBook} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="title"
                  value={bookForm.title}
                  onChange={(e) => setBookForm({ ...bookForm, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="author" className="block text-sm font-medium text-gray-700 mb-2">
                  Author <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="author"
                  value={bookForm.author}
                  onChange={(e) => setBookForm({ ...bookForm, author: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="isbn" className="block text-sm font-medium text-gray-700 mb-2">
                  ISBN <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="isbn"
                  value={bookForm.isbn}
                  onChange={(e) => setBookForm({ ...bookForm, isbn: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                  required
                />
              </div>
              <div>
                <label htmlFor="totalCopies" className="block text-sm font-medium text-gray-700 mb-2">
                  Total Copies <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  id="totalCopies"
                  value={bookForm.totalCopies}
                  onChange={(e) =>
                    setBookForm({ ...bookForm, totalCopies: parseInt(e.target.value) || 1 })
                  }
                  min="1"
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
                {editingBook ? 'Update' : 'Create'} Book
              </button>
              <button
                type="button"
                onClick={() => {
                  setIsAddingBook(false);
                  setEditingBook(null);
                  setBookForm({ title: '', author: '', isbn: '', totalCopies: 1 });
                }}
                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg font-semibold hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Issue Book Form */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold text-primary-900 mb-4">Issue Book</h3>
        <form onSubmit={handleIssueBook} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="issueBook" className="block text-sm font-medium text-gray-700 mb-2">
                Select Book <span className="text-red-500">*</span>
              </label>
              <select
                id="issueBook"
                value={issueForm.bookId}
                onChange={(e) => setIssueForm({ ...issueForm, bookId: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              >
                <option value="">Select a book</option>
                {books
                  .filter((book) => book.availableCopies > 0)
                  .map((book) => (
                    <option key={book._id} value={book._id}>
                      {book.title} by {book.author} ({book.availableCopies} available)
                    </option>
                  ))}
              </select>
            </div>
            <div>
              <label htmlFor="issueStudent" className="block text-sm font-medium text-gray-700 mb-2">
                Select Student <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="issueStudent"
                value={issueForm.studentId}
                onChange={(e) => setIssueForm({ ...issueForm, studentId: e.target.value })}
                placeholder="Enter student email or roll number"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
                required
              />
              <p className="text-xs text-gray-500 mt-1">
                Note: Enter student email or roll number to issue book
              </p>
            </div>
          </div>
          <button
            type="submit"
            disabled={isIssuing}
            className="bg-primary-700 text-white px-6 py-2 rounded-lg font-semibold hover:bg-primary-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isIssuing ? 'Issuing...' : 'Issue Book'}
          </button>
        </form>
      </div>

      {/* Tabs */}
      <div className="bg-background-light p-4 rounded-lg border border-gray-200">
        <div className="flex space-x-2">
          <button
            onClick={() => setActiveTab('books')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'books'
                ? 'bg-primary-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Books ({books.length})
          </button>
          <button
            onClick={() => setActiveTab('issues')}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              activeTab === 'issues'
                ? 'bg-primary-700 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            Active Issues ({activeIssues.length})
          </button>
        </div>
      </div>

      {/* Books Tab */}
      {activeTab === 'books' && (
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="mb-4">
            <input
              type="text"
              placeholder="Search books by title, author, or ISBN..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 outline-none"
            />
          </div>
          {filteredBooks.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📚</div>
              <p>No books found</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-primary-900">Title</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-900">Author</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-900">ISBN</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-900">Total</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-900">Available</th>
                    <th className="text-left py-3 px-4 font-semibold text-primary-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredBooks.map((book) => (
                    <tr key={book._id} className="border-b border-gray-200 hover:bg-gray-50">
                      <td className="py-3 px-4">{book.title}</td>
                      <td className="py-3 px-4">{book.author}</td>
                      <td className="py-3 px-4 font-mono text-sm">{book.isbn}</td>
                      <td className="py-3 px-4">{book.totalCopies}</td>
                      <td className="py-3 px-4">
                        <span
                          className={`font-semibold ${
                            book.availableCopies === 0
                              ? 'text-red-600'
                              : book.availableCopies < book.totalCopies / 2
                              ? 'text-yellow-600'
                              : 'text-green-600'
                          }`}
                        >
                          {book.availableCopies}
                        </span>
                      </td>
                      <td className="py-3 px-4">
                        <button
                          onClick={() => startEdit(book)}
                          className="text-primary-700 hover:text-primary-800 text-sm font-medium"
                        >
                          Edit
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}

      {/* Issues Tab */}
      {activeTab === 'issues' && (
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <h3 className="text-lg font-semibold text-primary-900 mb-4">Active Book Issues</h3>
          {activeIssues.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              <div className="text-4xl mb-2">📖</div>
              <p>No active issues</p>
            </div>
          ) : (
            <div className="space-y-4">
              {activeIssues.map((issue) => {
                const daysLeft = issue.daysLeft ?? 0;
                const isOverdue = issue.isOverdue || false;

                return (
                  <div
                    key={issue._id}
                    className={`p-4 rounded-lg border ${
                      isOverdue
                        ? 'bg-red-50 border-red-200'
                        : daysLeft <= 2
                        ? 'bg-yellow-50 border-yellow-200'
                        : 'bg-white border-gray-200'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h4 className="font-semibold text-primary-900 mb-1">
                          {issue.book.title}
                        </h4>
                        <p className="text-sm text-gray-600 mb-2">by {issue.book.author}</p>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <span className="text-gray-600">Student:</span>{' '}
                            <span className="font-medium">
                              {issue.student.name} ({issue.student.rollNumber || issue.student.email})
                            </span>
                          </div>
                          <div>
                            <span className="text-gray-600">Issued:</span>{' '}
                            <span className="font-medium">{formatDate(issue.issueDate)}</span>
                          </div>
                          <div>
                            <span className="text-gray-600">Due:</span>{' '}
                            <span className="font-medium">{formatDate(issue.dueDate)}</span>
                          </div>
                        </div>
                      </div>
                      <div className="ml-4 text-right">
                        {isOverdue ? (
                          <div className="mb-2">
                            <p className="text-red-700 font-bold">
                              {Math.abs(daysLeft)} days overdue
                            </p>
                            <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full">
                              Overdue
                            </span>
                          </div>
                        ) : (
                          <div className="mb-2">
                            <p className="text-primary-900 font-bold">{daysLeft} days left</p>
                            {daysLeft <= 2 && (
                              <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full">
                                Due Soon
                              </span>
                            )}
                          </div>
                        )}
                        <button
                          onClick={() => handleReturnBook(issue._id)}
                          className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors"
                        >
                          Mark Returned
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
