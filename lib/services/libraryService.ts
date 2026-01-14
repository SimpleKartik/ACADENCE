import api from '../utils/api';

export interface Book {
  _id: string;
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
  availableCopies: number;
  createdAt: string;
  updatedAt: string;
}

export interface BookIssue {
  _id: string;
  book: Book;
  student: {
    _id: string;
    name: string;
    email: string;
    rollNumber?: string;
  };
  issuedBy: {
    _id: string;
    name: string;
    email: string;
  };
  issueDate: string;
  dueDate: string;
  returnDate?: string | null;
  status: 'ISSUED' | 'RETURNED' | 'OVERDUE';
  daysLeft?: number | null;
  isOverdue?: boolean;
}

export interface CreateBookRequest {
  title: string;
  author: string;
  isbn: string;
  totalCopies: number;
}

export interface UpdateBookRequest {
  title?: string;
  author?: string;
  isbn?: string;
  totalCopies?: number;
}

export interface IssueBookRequest {
  bookId: string;
  studentId: string;
}

export interface ReturnBookRequest {
  issueId: string;
}

export interface CreateBookResponse {
  success: boolean;
  message: string;
  data: {
    book: Book;
  };
}

export interface GetBooksResponse {
  success: boolean;
  data: {
    books: Book[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

export interface GetMyBooksResponse {
  success: boolean;
  data: {
    books: BookIssue[];
    summary: {
      totalIssued: number;
      overdue: number;
      dueSoon: number;
    };
  };
}

export interface IssueBookResponse {
  success: boolean;
  message: string;
  data: {
    bookIssue: BookIssue;
  };
}

export interface GetAllIssuesResponse {
  success: boolean;
  data: {
    bookIssues: BookIssue[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      pages: number;
    };
  };
}

/**
 * Create book (Admin only)
 */
export const createBook = async (data: CreateBookRequest): Promise<CreateBookResponse> => {
  const response = await api.post<CreateBookResponse>('/library/books', data);
  return response.data;
};

/**
 * Update book (Admin only)
 */
export const updateBook = async (
  id: string,
  data: UpdateBookRequest
): Promise<CreateBookResponse> => {
  const response = await api.put<CreateBookResponse>(`/library/books/${id}`, data);
  return response.data;
};

/**
 * Get all books (Admin only)
 */
export const getAllBooks = async (
  search?: string,
  page?: number,
  limit?: number
): Promise<GetBooksResponse> => {
  const params: any = {};
  if (search) params.search = search;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get<GetBooksResponse>('/library/books', { params });
  return response.data;
};

/**
 * Issue book (Admin only)
 */
export const issueBook = async (data: IssueBookRequest): Promise<IssueBookResponse> => {
  const response = await api.post<IssueBookResponse>('/library/issue', data);
  return response.data;
};

/**
 * Return book (Admin only)
 */
export const returnBook = async (data: ReturnBookRequest): Promise<any> => {
  const response = await api.post('/library/return', data);
  return response.data;
};

/**
 * Get all book issues (Admin only)
 */
export const getAllIssues = async (
  status?: string,
  page?: number,
  limit?: number
): Promise<GetAllIssuesResponse> => {
  const params: any = {};
  if (status) params.status = status;
  if (page) params.page = page;
  if (limit) params.limit = limit;

  const response = await api.get<GetAllIssuesResponse>('/library/issues', { params });
  return response.data;
};

/**
 * Get student's issued books (Student only)
 */
export const getMyBooks = async (): Promise<GetMyBooksResponse> => {
  const response = await api.get<GetMyBooksResponse>('/library/my-books');
  return response.data;
};

/**
 * Trigger email reminders (Admin only)
 */
export const triggerReminders = async (): Promise<any> => {
  const response = await api.post('/library/send-reminders');
  return response.data;
};
