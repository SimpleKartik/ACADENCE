import api from '../utils/api';

export type DayType = 'Monday' | 'Tuesday' | 'Wednesday' | 'Thursday' | 'Friday' | 'Saturday';

export interface TimetableSlot {
  _id: string;
  teacher: {
    _id: string;
    name: string;
    email: string;
    department?: string;
  };
  subject: string;
  day: DayType;
  startTime: string; // HH:mm format
  endTime: string; // HH:mm format
  room: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTimetableSlotRequest {
  subject: string;
  day: DayType;
  startTime: string;
  endTime: string;
  room: string;
}

export interface UpdateTimetableSlotRequest {
  subject?: string;
  day?: DayType;
  startTime?: string;
  endTime?: string;
  room?: string;
}

export interface CreateTimetableSlotResponse {
  success: boolean;
  message: string;
  data: {
    timetableSlot: TimetableSlot;
  };
}

export interface GetTimetableResponse {
  success: boolean;
  data: {
    timetableSlots: TimetableSlot[];
  };
}

export interface GetStudentTimetableResponse {
  success: boolean;
  data: {
    timetable: {
      [key in DayType]: TimetableSlot[];
    };
    allSlots: TimetableSlot[];
  };
}

/**
 * Create timetable slot (Teacher only)
 */
export const createTimetableSlot = async (
  data: CreateTimetableSlotRequest
): Promise<CreateTimetableSlotResponse> => {
  const response = await api.post<CreateTimetableSlotResponse>('/timetable', data);
  return response.data;
};

/**
 * Update timetable slot (Teacher only)
 */
export const updateTimetableSlot = async (
  id: string,
  data: UpdateTimetableSlotRequest
): Promise<CreateTimetableSlotResponse> => {
  const response = await api.put<CreateTimetableSlotResponse>(`/timetable/${id}`, data);
  return response.data;
};

/**
 * Delete timetable slot (Teacher only)
 */
export const deleteTimetableSlot = async (id: string): Promise<any> => {
  const response = await api.delete(`/timetable/${id}`);
  return response.data;
};

/**
 * Get teacher's timetable (Teacher only)
 */
export const getMyTimetable = async (): Promise<GetTimetableResponse> => {
  const response = await api.get<GetTimetableResponse>('/timetable');
  return response.data;
};

/**
 * Get student's timetable (Student only)
 */
export const getStudentTimetable = async (): Promise<GetStudentTimetableResponse> => {
  const response = await api.get<GetStudentTimetableResponse>('/timetable/my');
  return response.data;
};
