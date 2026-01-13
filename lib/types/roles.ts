// Role types for the Acadence platform
export type UserRole = 'student' | 'teacher' | 'admin';

export interface User {
  id: string;
  email: string;
  role: UserRole;
  name: string;
}
