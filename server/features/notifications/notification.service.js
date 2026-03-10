const Notification = require("../../models/Notification");
const NotificationPreference = require("../../models/NotificationPreference");

const typeToPreferenceKey = {
	COURSE_REVIEW: "reviewAlerts",
	COURSE_ENROLLMENT: "courseAlerts",
	PAYMENT: "paymentAlerts",
	COURSE_UPDATE: "courseAlerts",
	SYSTEM: "inAppEnabled",
};

const canSendInAppNotification = async (userId, type) => {
	const preference = await NotificationPreference.findOne({ user: userId });
	if (!preference) {
		return true;
	}

	if (!preference.inAppEnabled) {
		return false;
	}

	const key = typeToPreferenceKey[type];
	if (!key) {
		return true;
	}

	return Boolean(preference[key]);
};

const createNotification = async ({
	userId,
	type = "SYSTEM",
	title,
	message,
	metadata = {},
	priority = "medium",
}) => {
	if (!userId || !title || !message) {
		return null;
	}

	const allowed = await canSendInAppNotification(userId, type);
	if (!allowed) {
		return null;
	}

	return Notification.create({
		user: userId,
		type,
		title,
		message,
		metadata,
		priority,
	});
};

const createBulkNotifications = async (notifications = []) => {
	if (!Array.isArray(notifications) || notifications.length === 0) {
		return [];
	}

	const created = await Promise.all(
		notifications.map((notification) => createNotification(notification))
	);
	return created.filter(Boolean);
};

module.exports = {
	createNotification,
	createBulkNotifications,
};
