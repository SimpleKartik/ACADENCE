import api from '../utils/api';

export interface GenerateQRResponse {
  success: boolean;
  data: {
    sessionId: string;
    qrCode: string;
    expiresAt: string;
    expiresIn: number;
    subject: string;
  };
}

export interface MarkAttendanceResponse {
  success: boolean;
  message: string;
  data: {
    attendance: any;
  };
}

export interface AttendanceOverview {
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
}

export interface SubjectWiseAttendance {
  subject: string;
  totalClasses: number;
  attendedClasses: number;
  attendancePercentage: number;
}

export interface MyAttendanceResponse {
  success: boolean;
  data: {
    overview: AttendanceOverview;
    subjectWise: SubjectWiseAttendance[];
  };
}

export interface ClassAttendanceSummary {
  totalStudents: number;
  presentCount: number;
  absentCount: number;
}

export interface ClassAttendanceRecord {
  date: string;
  subject: string;
  presentCount: number;
  absentCount: number;
  students: Array<{
    student: any;
    status: string;
    timestamp: string;
  }>;
}

export interface ClassAttendanceResponse {
  success: boolean;
  data: {
    summary: ClassAttendanceSummary;
    attendance: ClassAttendanceRecord[];
  };
}

/**
 * Generate QR code for attendance (Teacher only)
 */
export const generateQR = async (subject: string): Promise<GenerateQRResponse> => {
  const response = await api.post<GenerateQRResponse>('/attendance/generate-qr', {
    subject,
  });
  return response.data;
};

/**
 * Mark attendance by scanning QR (Student only)
 */
export const markAttendance = async (sessionId: string): Promise<MarkAttendanceResponse> => {
  const response = await api.post<MarkAttendanceResponse>('/attendance/mark', {
    sessionId,
  });
  return response.data;
};

/**
 * Get student's own attendance records
 */
export const getMyAttendance = async (subject?: string): Promise<MyAttendanceResponse> => {
  const params = subject ? { subject } : {};
  const response = await api.get<MyAttendanceResponse>('/attendance/my', { params });
  return response.data;
};

/**
 * Get class attendance records (Teacher only)
 */
export const getClassAttendance = async (
  subject?: string,
  date?: string
): Promise<ClassAttendanceResponse> => {
  const params: any = {};
  if (subject) params.subject = subject;
  if (date) params.date = date;
  
  const response = await api.get<ClassAttendanceResponse>('/attendance/class', { params });
  return response.data;
};
