import api from '../utils/api';

export type CabinStatusType = 'AVAILABLE' | 'BUSY' | 'IN_CLASS';

export interface CabinStatus {
  _id: string;
  teacher: {
    _id: string;
    name: string;
    email: string;
    department?: string;
  };
  status: CabinStatusType;
  note?: string;
  updatedAt: string;
  createdAt: string;
}

export interface TeacherWithStatus {
  teacher: {
    _id: string;
    name: string;
    email: string;
    department?: string;
  };
  status: CabinStatusType | 'OFFLINE';
  note?: string | null;
  updatedAt: string;
}

export interface UpdateCabinStatusRequest {
  status: CabinStatusType;
  note?: string;
}

export interface UpdateCabinStatusResponse {
  success: boolean;
  message: string;
  data: {
    cabinStatus: CabinStatus;
  };
}

export interface GetCabinStatusesResponse {
  success: boolean;
  data: {
    teachers: TeacherWithStatus[];
  };
}

export interface GetMyCabinStatusResponse {
  success: boolean;
  data: {
    cabinStatus: CabinStatus | null;
    message?: string;
  };
}

/**
 * Update cabin status (Teacher only)
 */
export const updateCabinStatus = async (
  data: UpdateCabinStatusRequest
): Promise<UpdateCabinStatusResponse> => {
  const response = await api.put<UpdateCabinStatusResponse>('/cabin-status', data);
  return response.data;
};

/**
 * Get all cabin statuses (Student/Admin)
 */
export const getCabinStatuses = async (): Promise<GetCabinStatusesResponse> => {
  const response = await api.get<GetCabinStatusesResponse>('/cabin-status');
  return response.data;
};

/**
 * Get current teacher's cabin status
 */
export const getMyCabinStatus = async (): Promise<GetMyCabinStatusResponse> => {
  const response = await api.get<GetMyCabinStatusResponse>('/cabin-status/me');
  return response.data;
};
