const mongoose = require("mongoose");

// Define the RatingAndReview schema
const ratingAndReviewSchema = new mongoose.Schema({
	user: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "user",
	},
	rating: {
		type: Number,
		required: true,
		min: 1,
		max: 5,
	},
	reviewTitle: {
		type: String,
		trim: true,
		default: "",
		maxlength: 120,
	},
	review: {
		type: String,
		required: true,
		trim: true,
		maxlength: 2000,
	},
	course: {
		type: mongoose.Schema.Types.ObjectId,
		required: true,
		ref: "Course",
		index: true,
	},
	isEdited: {
		type: Boolean,
		default: false,
	},
	status: {
		type: String,
		enum: ["published", "hidden"],
		default: "published",
	},
	helpfulCount: {
		type: Number,
		default: 0,
		min: 0,
	},
}, { timestamps: true });

ratingAndReviewSchema.index({ user: 1, course: 1 }, { unique: true });
ratingAndReviewSchema.index({ course: 1, createdAt: -1 });

// Export the RatingAndReview model
module.exports = mongoose.model("RatingAndReview", ratingAndReviewSchema);
