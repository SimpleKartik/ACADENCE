'use client';

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { UserRole } from '../types/roles';
import api from '../utils/api';
import { getToken, isTokenExpired } from '../utils/jwt';

interface User {
  _id: string;
  email: string;
  role: UserRole;
  name: string;
  rollNumber?: string;
  adminId?: string;
  department?: string;
  cabinStatus?: string;
  createdAt?: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  login: (emailOrRollNumber: string, password: string, role: UserRole) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
  fetchUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  /**
   * Fetch current user from API
   */
  const fetchUser = async () => {
    try {
      const token = getToken();
      if (!token || isTokenExpired(token)) {
        setUser(null);
        if (typeof window !== 'undefined') {
          localStorage.removeItem('acadence_token');
        }
        return;
      }

      const response = await api.get('/users/me');
      if (response.data.success && response.data.data.user) {
        setUser(response.data.data.user);
      } else {
        setUser(null);
      }
    } catch (error: any) {
      console.error('Failed to fetch user:', error);
      setUser(null);
      // Clear invalid token
      if (typeof window !== 'undefined') {
        localStorage.removeItem('acadence_token');
      }
    }
  };

  /**
   * Check for stored token and fetch user on mount
   */
  useEffect(() => {
    const initAuth = async () => {
      setIsLoading(true);
      const token = getToken();
      
      if (token && !isTokenExpired(token)) {
        // Token exists and is valid, fetch user data
        await fetchUser();
      } else {
        // Token expired or doesn't exist
        if (token) {
          localStorage.removeItem('acadence_token');
        }
        setUser(null);
      }
      setIsLoading(false);
    };

    initAuth();
  }, []);

  /**
   * Login function - calls appropriate API endpoint based on role
   */
  const login = async (
    emailOrRollNumber: string,
    password: string,
    role: UserRole
  ): Promise<boolean> => {
    try {
      let endpoint = '';
      let payload: any = { password };

      // Determine endpoint and payload based on role
      switch (role) {
        case 'student':
          endpoint = '/auth/student/login';
          // Student can login with email or rollNumber
          if (emailOrRollNumber.includes('@')) {
            payload.email = emailOrRollNumber.toLowerCase().trim();
          } else {
            payload.rollNumber = emailOrRollNumber.trim().toUpperCase();
          }
          break;
        case 'teacher':
          endpoint = '/auth/teacher/login';
          payload.email = emailOrRollNumber.toLowerCase().trim();
          break;
        case 'admin':
          endpoint = '/auth/admin/login';
          payload.email = emailOrRollNumber.toLowerCase().trim();
          break;
        default:
          throw new Error('Invalid role');
      }

      const response = await api.post(endpoint, payload);

      if (response.data.success && response.data.data.token) {
        // Store token in localStorage
        const token = response.data.data.token;
        localStorage.setItem('acadence_token', token);

        // Set user data
        if (response.data.data.user) {
          setUser(response.data.data.user);
        } else {
          // Fetch user data if not included in response
          await fetchUser();
        }

        return true;
      }

      return false;
    } catch (error: any) {
      console.error('Login error:', error);
      
      // Handle specific error messages
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      
      throw new Error('Login failed. Please check your credentials.');
    }
  };

  /**
   * Logout function - clears token and user data
   */
  const logout = () => {
    setUser(null);
    if (typeof window !== 'undefined') {
      localStorage.removeItem('acadence_token');
      router.push('/select-role');
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
        isLoading,
        fetchUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
