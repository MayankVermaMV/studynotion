const mongoose = require("mongoose");
const Notification = require("../../models/Notification");
const NotificationPreference = require("../../models/NotificationPreference");

const toPositiveInt = (value, fallback) => {
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed) || parsed < 1) {
		return fallback;
	}
	return parsed;
};

exports.getMyNotifications = async (req, res) => {
	try {
		const userId = req.user.id;
		const page = toPositiveInt(req.query.page, 1);
		const limit = Math.min(toPositiveInt(req.query.limit, 10), 50);
		const skip = (page - 1) * limit;
		const { type, isRead } = req.query;

		const query = { user: userId };
		if (type) {
			query.type = type;
		}
		if (isRead === "true" || isRead === "false") {
			query.isRead = isRead === "true";
		}

		const [notifications, totalCount, unreadCount] = await Promise.all([
			Notification.find(query)
				.sort({ createdAt: -1 })
				.skip(skip)
				.limit(limit)
				.lean(),
			Notification.countDocuments(query),
			Notification.countDocuments({ user: userId, isRead: false }),
		]);

		return res.status(200).json({
			success: true,
			data: notifications,
			pagination: {
				page,
				limit,
				totalCount,
				totalPages: Math.ceil(totalCount / limit) || 1,
			},
			unreadCount,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not fetch notifications",
			error: error.message,
		});
	}
};

exports.getUnreadCount = async (req, res) => {
	try {
		const unreadCount = await Notification.countDocuments({
			user: req.user.id,
			isRead: false,
		});

		return res.status(200).json({
			success: true,
			unreadCount,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not fetch unread count",
			error: error.message,
		});
	}
};

exports.markNotificationAsRead = async (req, res) => {
	try {
		const { notificationId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(notificationId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid notification id",
			});
		}

		const notification = await Notification.findOneAndUpdate(
			{ _id: notificationId, user: req.user.id },
			{ isRead: true, readAt: new Date() },
			{ new: true }
		);

		if (!notification) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}

		return res.status(200).json({
			success: true,
			data: notification,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not mark notification as read",
			error: error.message,
		});
	}
};

exports.markAllAsRead = async (req, res) => {
	try {
		await Notification.updateMany(
			{ user: req.user.id, isRead: false },
			{ isRead: true, readAt: new Date() }
		);

		return res.status(200).json({
			success: true,
			message: "All notifications marked as read",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not update notifications",
			error: error.message,
		});
	}
};

exports.deleteNotification = async (req, res) => {
	try {
		const { notificationId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(notificationId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid notification id",
			});
		}

		const deleted = await Notification.findOneAndDelete({
			_id: notificationId,
			user: req.user.id,
		});

		if (!deleted) {
			return res.status(404).json({
				success: false,
				message: "Notification not found",
			});
		}

		return res.status(200).json({
			success: true,
			message: "Notification deleted",
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not delete notification",
			error: error.message,
		});
	}
};

exports.getMyNotificationPreferences = async (req, res) => {
	try {
		let preference = await NotificationPreference.findOne({
			user: req.user.id,
		}).lean();

		if (!preference) {
			preference = await NotificationPreference.create({
				user: req.user.id,
			});
		}

		return res.status(200).json({
			success: true,
			data: preference,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not fetch notification preferences",
			error: error.message,
		});
	}
};

exports.updateMyNotificationPreferences = async (req, res) => {
	try {
		const allowedKeys = [
			"inAppEnabled",
			"emailEnabled",
			"reviewAlerts",
			"paymentAlerts",
			"courseAlerts",
		];

		const updates = {};
		for (const key of allowedKeys) {
			if (typeof req.body[key] === "boolean") {
				updates[key] = req.body[key];
			}
		}

		const preference = await NotificationPreference.findOneAndUpdate(
			{ user: req.user.id },
			{ $set: updates },
			{ new: true, upsert: true }
		);

		return res.status(200).json({
			success: true,
			data: preference,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not update notification preferences",
			error: error.message,
		});
	}
};
