import api from '../utils/api';

export interface OverviewStats {
  totalStudents: number;
  totalTeachers: number;
  totalAdmins: number;
  totalActiveUsers: number;
  totalNotificationsSent: number;
  totalMessagesSent: number;
}

export interface AttendanceStats {
  averageAttendance: number;
  studentsBelow75: number;
  studentsBelow75Details: Array<{
    name: string;
    rollNumber: string;
    department: string;
    attendancePercentage: number;
  }>;
  subjectWiseSummary: Array<{
    subject: string;
    totalRecords: number;
    presentRecords: number;
    absentRecords: number;
    percentage: number;
  }>;
}

export interface LibraryStats {
  totalBooks: number;
  issuedBooksCount: number;
  overdueBooksCount: number;
  topDefaulters: Array<{
    name: string;
    rollNumber: string;
    email: string;
    overdueCount: number;
  }>;
}

export interface SystemActivity {
  recentBroadcasts: Array<{
    title: string;
    message: string;
    receiverRole: string;
    isImportant: boolean;
    sender: { name: string; email: string } | null;
    createdAt: string;
  }>;
  recentAttendanceSessions: Array<{
    date: string;
    subject: string;
    teacherName: string;
    teacherEmail: string;
    studentCount: number;
    presentCount: number;
    absentCount: number;
    timestamp: string;
  }>;
  recentLogins: Array<{
    name: string;
    email: string;
    rollNumber: string | null;
    role: string;
    lastActive: string;
  }>;
}

export interface OverviewResponse {
  success: boolean;
  data: OverviewStats;
}

export interface AttendanceStatsResponse {
  success: boolean;
  data: AttendanceStats;
}

export interface LibraryStatsResponse {
  success: boolean;
  data: LibraryStats;
}

export interface SystemActivityResponse {
  success: boolean;
  data: SystemActivity;
}

/**
 * Get platform overview statistics (Admin only)
 */
export const getOverview = async (): Promise<OverviewResponse> => {
  const response = await api.get<OverviewResponse>('/admin/overview');
  return response.data;
};

/**
 * Get attendance statistics (Admin only)
 */
export const getAttendanceStats = async (): Promise<AttendanceStatsResponse> => {
  const response = await api.get<AttendanceStatsResponse>('/admin/attendance-stats');
  return response.data;
};

/**
 * Get library statistics (Admin only)
 */
export const getLibraryStats = async (): Promise<LibraryStatsResponse> => {
  const response = await api.get<LibraryStatsResponse>('/admin/library-stats');
  return response.data;
};

/**
 * Get system activity (Admin only)
 */
export const getSystemActivity = async (
  limit?: number
): Promise<SystemActivityResponse> => {
  const params = limit ? { limit } : {};
  const response = await api.get<SystemActivityResponse>('/admin/system-activity', {
    params,
  });
  return response.data;
};
