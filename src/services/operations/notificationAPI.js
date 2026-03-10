import { apiConnector } from "../apiconnector"
import { notificationEndpoints } from "../apis"

const {
  GET_NOTIFICATIONS_API,
  GET_UNREAD_COUNT_API,
  MARK_ALL_READ_API,
  MARK_READ_API,
  DELETE_NOTIFICATION_API,
  GET_NOTIFICATION_PREFERENCES_API,
  UPDATE_NOTIFICATION_PREFERENCES_API,
} = notificationEndpoints

const authHeaders = (token) => ({
  Authorization: `Bearer ${token}`,
})

export const fetchNotifications = async (token, { page = 1, limit = 10 } = {}) => {
  const response = await apiConnector(
    "GET",
    GET_NOTIFICATIONS_API,
    null,
    authHeaders(token),
    { page, limit }
  )
  return response?.data
}

export const fetchUnreadCount = async (token) => {
  const response = await apiConnector(
    "GET",
    GET_UNREAD_COUNT_API,
    null,
    authHeaders(token)
  )
  return response?.data?.unreadCount || 0
}

export const markNotificationRead = async (token, notificationId) => {
  const response = await apiConnector(
    "PATCH",
    `${MARK_READ_API}/${notificationId}/read`,
    null,
    authHeaders(token)
  )
  return response?.data
}

export const markAllNotificationsRead = async (token) => {
  const response = await apiConnector(
    "PATCH",
    MARK_ALL_READ_API,
    null,
    authHeaders(token)
  )
  return response?.data
}

export const deleteNotification = async (token, notificationId) => {
  const response = await apiConnector(
    "DELETE",
    `${DELETE_NOTIFICATION_API}/${notificationId}`,
    null,
    authHeaders(token)
  )
  return response?.data
}

export const getNotificationPreferences = async (token) => {
  const response = await apiConnector(
    "GET",
    GET_NOTIFICATION_PREFERENCES_API,
    null,
    authHeaders(token)
  )
  return response?.data
}

export const updateNotificationPreferences = async (token, payload) => {
  const response = await apiConnector(
    "PUT",
    UPDATE_NOTIFICATION_PREFERENCES_API,
    payload,
    authHeaders(token)
  )
  return response?.data
}
