export default function StudentLibraryPage() {
  // Mock data
  const issuedBooks = [
    {
      id: 1,
      title: 'Introduction to Algorithms',
      author: 'Cormen, Leiserson, Rivest',
      issueDate: '2024-01-01',
      returnDate: '2024-01-31',
      daysLeft: 10,
      overdue: false,
    },
    {
      id: 2,
      title: 'Physics for Scientists',
      author: 'Serway & Jewett',
      issueDate: '2023-12-15',
      returnDate: '2024-01-15',
      daysLeft: -5,
      overdue: true,
    },
    {
      id: 3,
      title: 'Organic Chemistry',
      author: 'Wade & Simek',
      issueDate: '2024-01-05',
      returnDate: '2024-02-05',
      daysLeft: 20,
      overdue: false,
    },
  ];

  const calculateDaysLeft = (returnDate: string) => {
    const today = new Date();
    const returnDateObj = new Date(returnDate);
    const diffTime = returnDateObj.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-primary-900 mb-2">Library</h1>
        <p className="text-gray-600">Manage your issued books and track due dates</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Books Issued</p>
              <p className="text-3xl font-bold text-primary-900">{issuedBooks.length}</p>
            </div>
            <div className="text-4xl">📚</div>
          </div>
        </div>
        <div className="bg-background-light p-6 rounded-lg border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Due Soon</p>
              <p className="text-3xl font-bold text-primary-900">
                {issuedBooks.filter((b) => b.daysLeft > 0 && b.daysLeft <= 7).length}
              </p>
            </div>
            <div className="text-4xl">⏰</div>
          </div>
        </div>
        <div className="bg-background-light p-6 rounded-lg border border-red-200 bg-red-50">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-red-700 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-red-700">
                {issuedBooks.filter((b) => b.overdue).length}
              </p>
            </div>
            <div className="text-4xl">⚠️</div>
          </div>
        </div>
      </div>

      {/* Issued Books List */}
      <div className="bg-background-light p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold text-primary-900 mb-4">Issued Books</h2>
        <div className="space-y-4">
          {issuedBooks.map((book) => (
            <div
              key={book.id}
              className={`p-4 rounded-lg border ${
                book.overdue
                  ? 'bg-red-50 border-red-200'
                  : book.daysLeft <= 7
                  ? 'bg-yellow-50 border-yellow-200'
                  : 'bg-white border-gray-200'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-primary-900 mb-1">{book.title}</h3>
                  <p className="text-sm text-gray-600 mb-2">by {book.author}</p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Issued:</span>{' '}
                      <span className="font-medium">{book.issueDate}</span>
                    </div>
                    <div>
                      <span className="text-gray-600">Return Date:</span>{' '}
                      <span className="font-medium">{book.returnDate}</span>
                    </div>
                  </div>
                </div>
                <div className="ml-4 text-right">
                  {book.overdue ? (
                    <div>
                      <p className="text-red-700 font-bold text-lg">
                        {Math.abs(book.daysLeft)} days overdue
                      </p>
                      <span className="px-2 py-1 bg-red-200 text-red-800 text-xs rounded-full mt-1 inline-block">
                        Overdue
                      </span>
                    </div>
                  ) : (
                    <div>
                      <p className="text-primary-900 font-bold text-lg">
                        {book.daysLeft} days left
                      </p>
                      {book.daysLeft <= 7 && (
                        <span className="px-2 py-1 bg-yellow-200 text-yellow-800 text-xs rounded-full mt-1 inline-block">
                          Due Soon
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
