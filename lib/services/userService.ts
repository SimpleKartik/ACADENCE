import api from '../utils/api';

export interface Student {
  _id: string;
  name: string;
  email: string;
  rollNumber?: string;
  department?: string;
}

export interface SearchStudentsResponse {
  success: boolean;
  data: {
    students: Student[];
  };
}

/**
 * Search students (Admin only)
 */
export const searchStudents = async (query: string): Promise<SearchStudentsResponse> => {
  const response = await api.get<SearchStudentsResponse>('/users/students/search', {
    params: { query },
  });
  return response.data;
};
