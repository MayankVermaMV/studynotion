const mongoose = require("mongoose");

const validateReviewPayload = ({ courseId, rating, review }) => {
	if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
		return "Valid courseId is required";
	}

	const ratingNumber = Number(rating);
	if (Number.isNaN(ratingNumber) || ratingNumber < 1 || ratingNumber > 5) {
		return "Rating must be between 1 and 5";
	}

	if (!review || typeof review !== "string" || review.trim().length < 5) {
		return "Review must be at least 5 characters long";
	}

	return null;
};

module.exports = { validateReviewPayload };
