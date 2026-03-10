import { useEffect } from "react"
import { FiBell } from "react-icons/fi"
import { RiDeleteBin6Line } from "react-icons/ri"
import { useDispatch, useSelector } from "react-redux"

import {
  deleteNotification,
  fetchNotifications,
  fetchUnreadCount,
  markAllNotificationsRead,
  markNotificationRead,
} from "../../services/operations/notificationAPI"
import {
  markAllNotificationsReadLocal,
  markNotificationAsReadLocal,
  removeNotificationLocal,
  setNotificationPanelOpen,
  setNotifications,
  setNotificationsLoading,
  setUnreadCount,
} from "../../slices/notificationSlice"

const formatNotificationTime = (createdAt) => {
  if (!createdAt) return ""
  const date = new Date(createdAt)
  return date.toLocaleString()
}

export default function NotificationBell() {
  const dispatch = useDispatch()
  const { token } = useSelector((state) => state.auth)
  const { items, unreadCount, panelOpen, loading } = useSelector(
    (state) => state.notification
  )

  const loadNotifications = async () => {
    dispatch(setNotificationsLoading(true))
    try {
      const response = await fetchNotifications(token, { page: 1, limit: 10 })
      if (response?.success) {
        dispatch(
          setNotifications({
            data: response.data,
            unreadCount: response.unreadCount,
            pagination: response.pagination,
          })
        )
      }
    } finally {
      dispatch(setNotificationsLoading(false))
    }
  }

  const loadUnreadCount = async () => {
    const count = await fetchUnreadCount(token)
    dispatch(setUnreadCount(count))
  }

  useEffect(() => {
    if (!token) return
    loadUnreadCount()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token])

  const togglePanel = async () => {
    const nextOpen = !panelOpen
    dispatch(setNotificationPanelOpen(nextOpen))
    if (nextOpen) {
      await loadNotifications()
    }
  }

  const handleMarkRead = async (notificationId, isRead) => {
    if (isRead) return
    const response = await markNotificationRead(token, notificationId)
    if (response?.success) {
      dispatch(markNotificationAsReadLocal(notificationId))
      await loadUnreadCount()
    }
  }

  const handleMarkAllRead = async () => {
    const response = await markAllNotificationsRead(token)
    if (response?.success) {
      dispatch(markAllNotificationsReadLocal())
      await loadUnreadCount()
    }
  }

  const handleDelete = async (notificationId) => {
    const response = await deleteNotification(token, notificationId)
    if (response?.success) {
      dispatch(removeNotificationLocal(notificationId))
      await loadUnreadCount()
    }
  }

  return (
    <div className="relative">
      <button
        type="button"
        onClick={togglePanel}
        className="relative rounded-md p-1 text-richblack-100 transition-all duration-200 hover:bg-richblack-700"
      >
        <FiBell className="text-2xl" />
        {unreadCount > 0 && (
          <span className="absolute -bottom-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full bg-pink-300 px-1 text-xs font-bold text-richblack-900">
            {unreadCount > 9 ? "9+" : unreadCount}
          </span>
        )}
      </button>

      {panelOpen && (
        <div className="absolute right-0 z-[1100] mt-3 w-[340px] rounded-md border border-richblack-600 bg-richblack-800 shadow-lg">
          <div className="flex items-center justify-between border-b border-richblack-600 p-3">
            <p className="font-semibold text-richblack-5">Notifications</p>
            <button
              type="button"
              onClick={handleMarkAllRead}
              className="text-xs font-medium text-yellow-50"
            >
              Mark all read
            </button>
          </div>

          <div className="max-h-[360px] overflow-y-auto">
            {loading ? (
              <p className="p-3 text-sm text-richblack-300">Loading...</p>
            ) : items.length === 0 ? (
              <p className="p-3 text-sm text-richblack-300">
                No notifications yet
              </p>
            ) : (
              items.map((notification) => (
                <div
                  key={notification._id}
                  className={`border-b border-richblack-700 p-3 ${
                    notification.isRead ? "bg-transparent" : "bg-richblack-700/50"
                  }`}
                >
                  <button
                    type="button"
                    className="w-full text-left"
                    onClick={() =>
                      handleMarkRead(notification._id, notification.isRead)
                    }
                  >
                    <p className="text-sm font-semibold text-richblack-5">
                      {notification.title}
                    </p>
                    <p className="mt-1 text-xs text-richblack-200">
                      {notification.message}
                    </p>
                    <p className="mt-1 text-[10px] text-richblack-400">
                      {formatNotificationTime(notification.createdAt)}
                    </p>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDelete(notification._id)}
                    className="mt-2 inline-flex items-center gap-1 text-xs text-pink-200"
                  >
                    <RiDeleteBin6Line />
                    Remove
                  </button>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  )
}
