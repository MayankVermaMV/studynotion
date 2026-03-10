const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema(
	{
		user: {
			type: mongoose.Schema.Types.ObjectId,
			required: true,
			ref: "user",
			index: true,
		},
		type: {
			type: String,
			enum: [
				"COURSE_REVIEW",
				"COURSE_ENROLLMENT",
				"PAYMENT",
				"SYSTEM",
				"COURSE_UPDATE",
			],
			default: "SYSTEM",
		},
		title: {
			type: String,
			required: true,
			trim: true,
			maxlength: 120,
		},
		message: {
			type: String,
			required: true,
			trim: true,
			maxlength: 600,
		},
		priority: {
			type: String,
			enum: ["low", "medium", "high"],
			default: "medium",
		},
		metadata: {
			type: mongoose.Schema.Types.Mixed,
			default: {},
		},
		isRead: {
			type: Boolean,
			default: false,
			index: true,
		},
		readAt: {
			type: Date,
			default: null,
		},
	},
	{ timestamps: true }
);

notificationSchema.index({ user: 1, createdAt: -1 });

module.exports = mongoose.model("Notification", notificationSchema);
