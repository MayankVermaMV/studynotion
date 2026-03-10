const express = require("express");
const router = express.Router();

const {
	getMyNotifications,
	getUnreadCount,
	markNotificationAsRead,
	markAllAsRead,
	deleteNotification,
	getMyNotificationPreferences,
	updateMyNotificationPreferences,
} = require("./notification.controller");
const { auth } = require("../../middlewares/auth");

router.get("/", auth, getMyNotifications);
router.get("/unread-count", auth, getUnreadCount);
router.patch("/read-all", auth, markAllAsRead);
router.patch("/:notificationId/read", auth, markNotificationAsRead);
router.delete("/:notificationId", auth, deleteNotification);

router.get("/preferences/me", auth, getMyNotificationPreferences);
router.put("/preferences/me", auth, updateMyNotificationPreferences);

module.exports = router;
