import { createSlice } from "@reduxjs/toolkit"

const initialState = {
  items: [],
  unreadCount: 0,
  loading: false,
  panelOpen: false,
  pagination: {
    page: 1,
    limit: 10,
    totalCount: 0,
    totalPages: 1,
  },
  preferences: null,
}

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    setNotificationsLoading(state, action) {
      state.loading = action.payload
    },
    setNotifications(state, action) {
      const {
        data = [],
        unreadCount = 0,
        pagination = initialState.pagination,
      } = action.payload || {}
      state.items = data
      state.unreadCount = unreadCount
      state.pagination = pagination
    },
    setUnreadCount(state, action) {
      state.unreadCount = action.payload
    },
    markNotificationAsReadLocal(state, action) {
      const notificationId = action.payload
      state.items = state.items.map((notification) =>
        notification._id === notificationId
          ? { ...notification, isRead: true, readAt: new Date().toISOString() }
          : notification
      )
      state.unreadCount = Math.max(
        0,
        state.items.filter((notification) => !notification.isRead).length
      )
    },
    markAllNotificationsReadLocal(state) {
      state.items = state.items.map((notification) => ({
        ...notification,
        isRead: true,
        readAt: new Date().toISOString(),
      }))
      state.unreadCount = 0
    },
    removeNotificationLocal(state, action) {
      const notificationId = action.payload
      state.items = state.items.filter(
        (notification) => notification._id !== notificationId
      )
      state.unreadCount = state.items.filter(
        (notification) => !notification.isRead
      ).length
    },
    setNotificationPanelOpen(state, action) {
      state.panelOpen = action.payload
    },
    setNotificationPreferences(state, action) {
      state.preferences = action.payload
    },
  },
})

export const {
  setNotificationsLoading,
  setNotifications,
  setUnreadCount,
  markNotificationAsReadLocal,
  markAllNotificationsReadLocal,
  removeNotificationLocal,
  setNotificationPanelOpen,
  setNotificationPreferences,
} = notificationSlice.actions

export default notificationSlice.reducer
