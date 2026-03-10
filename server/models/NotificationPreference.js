const mongoose = require("mongoose");

const notificationPreferenceSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "user",
			unique: true,
			index: true,
		},
		inAppEnabled: {
			type: Boolean,
			default: true,
		},
		emailEnabled: {
			type: Boolean,
			default: false,
		},
		reviewAlerts: {
			type: Boolean,
			default: true,
		},
		paymentAlerts: {
			type: Boolean,
			default: true,
		},
		courseAlerts: {
			type: Boolean,
			default: true,
		},
	},
	{ timestamps: true }
);

module.exports = mongoose.model(
	"NotificationPreference",
	notificationPreferenceSchema
);
