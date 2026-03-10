const mongoose = require("mongoose");
const RatingAndReview = require("../../models/RatingAndRaview");
const Course = require("../../models/Course");

const syncCourseRatingStats = async (courseId) => {
	const courseObjectId = new mongoose.Types.ObjectId(courseId);
	const stats = await RatingAndReview.aggregate([
		{
			$match: {
				course: courseObjectId,
				status: "published",
			},
		},
		{
			$group: {
				_id: "$course",
				averageRating: { $avg: "$rating" },
				totalRatings: { $sum: 1 },
			},
		},
	]);

	const averageRating = stats[0]?.averageRating || 0;
	const totalRatings = stats[0]?.totalRatings || 0;

	await Course.findByIdAndUpdate(courseId, {
		averageRating: Math.round(averageRating * 10) / 10,
		totalRatings,
	});

	return {
		averageRating: Math.round(averageRating * 10) / 10,
		totalRatings,
	};
};

module.exports = {
	syncCourseRatingStats,
};
