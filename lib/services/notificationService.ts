import api from '../utils/api';

export interface Notification {
  _id: string;
  title: string;
  message: string;
  sender: {
    _id: string;
    name: string;
    email: string;
  };
  receiverRole: 'student' | 'teacher' | 'all';
  isImportant: boolean;
  isRead: boolean;
  readBy: Array<{
    user: string;
    userModel: string;
    readAt: string;
  }>;
  createdAt: string;
  updatedAt: string;
}

export interface BroadcastNotificationRequest {
  title: string;
  message: string;
  receiverRole: 'student' | 'teacher' | 'all';
  isImportant?: boolean;
}

export interface BroadcastNotificationResponse {
  success: boolean;
  message: string;
  data: {
    notification: Notification;
  };
}

export interface GetNotificationsResponse {
  success: boolean;
  data: {
    notifications: Notification[];
    pagination: {
      total: number;
      limit: number;
      skip: number;
      hasMore: boolean;
    };
    unreadCount: number;
  };
}

export interface UnreadCountResponse {
  success: boolean;
  data: {
    unreadCount: number;
  };
}

/**
 * Broadcast notification (Teacher only)
 */
export const broadcastNotification = async (
  data: BroadcastNotificationRequest
): Promise<BroadcastNotificationResponse> => {
  const response = await api.post<BroadcastNotificationResponse>(
    '/notifications/broadcast',
    data
  );
  return response.data;
};

/**
 * Get notifications for current user
 */
export const getNotifications = async (
  limit?: number,
  skip?: number,
  unreadOnly?: boolean
): Promise<GetNotificationsResponse> => {
  const params: any = {};
  if (limit) params.limit = limit;
  if (skip) params.skip = skip;
  if (unreadOnly) params.unreadOnly = unreadOnly;

  const response = await api.get<GetNotificationsResponse>('/notifications', {
    params,
  });
  return response.data;
};

/**
 * Mark notification as read
 */
export const markAsRead = async (notificationId: string): Promise<any> => {
  const response = await api.put(`/notifications/${notificationId}/read`);
  return response.data;
};

/**
 * Get unread notification count
 */
export const getUnreadCount = async (): Promise<UnreadCountResponse> => {
  const response = await api.get<UnreadCountResponse>(
    '/notifications/unread-count'
  );
  return response.data;
};
