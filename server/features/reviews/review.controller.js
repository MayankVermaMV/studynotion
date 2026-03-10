const mongoose = require("mongoose");
const RatingAndReview = require("../../models/RatingAndRaview");
const Course = require("../../models/Course");
const { syncCourseRatingStats } = require("./review.service");
const { validateReviewPayload } = require("./review.validation");
const {
	createNotification,
} = require("../notifications/notification.service");

const toPositiveInt = (value, fallback) => {
	const parsed = Number.parseInt(value, 10);
	if (Number.isNaN(parsed) || parsed < 1) {
		return fallback;
	}
	return parsed;
};

const getReviewSort = (sortBy = "latest") => {
	switch (sortBy) {
		case "highest":
			return { rating: -1, createdAt: -1 };
		case "lowest":
			return { rating: 1, createdAt: -1 };
		case "oldest":
			return { createdAt: 1 };
		default:
			return { createdAt: -1 };
	}
};

exports.createOrUpdateCourseReview = async (req, res) => {
	try {
		const { courseId, rating, review, reviewTitle = "" } = req.body;
		const userId = req.user.id;

		const validationMessage = validateReviewPayload({ courseId, rating, review });
		if (validationMessage) {
			return res.status(400).json({
				success: false,
				message: validationMessage,
			});
		}

		const enrolledCourse = await Course.findOne({
			_id: courseId,
			studentsEnrolled: { $elemMatch: { $eq: userId } },
		}).select("_id instructor courseName");

		if (!enrolledCourse) {
			return res.status(403).json({
				success: false,
				message: "Only enrolled students can review this course",
			});
		}

		let reviewDoc = await RatingAndReview.findOne({
			user: userId,
			course: courseId,
		});

		let action = "created";
		if (reviewDoc) {
			reviewDoc.rating = Number(rating);
			reviewDoc.review = review.trim();
			reviewDoc.reviewTitle = reviewTitle?.trim() || "";
			reviewDoc.isEdited = true;
			await reviewDoc.save();
			action = "updated";
		} else {
			reviewDoc = await RatingAndReview.create({
				user: userId,
				course: courseId,
				rating: Number(rating),
				review: review.trim(),
				reviewTitle: reviewTitle?.trim() || "",
			});

			await Course.findByIdAndUpdate(courseId, {
				$addToSet: { ratingAndReviews: reviewDoc._id },
			});
		}

		const summary = await syncCourseRatingStats(courseId);

		if (String(enrolledCourse.instructor) !== String(userId)) {
			await createNotification({
				userId: enrolledCourse.instructor,
				type: "COURSE_REVIEW",
				title: `New review on ${enrolledCourse.courseName}`,
				message: `A student left a ${Number(rating).toFixed(1)} star review.`,
				metadata: {
					courseId,
					reviewId: reviewDoc._id,
				},
			});
		}

		return res.status(200).json({
			success: true,
			message: `Review ${action} successfully`,
			action,
			data: reviewDoc,
			summary,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not save review",
			error: error.message,
		});
	}
};

exports.getCourseReviews = async (req, res) => {
	try {
		const { courseId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(courseId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid course id",
			});
		}

		const page = toPositiveInt(req.query.page, 1);
		const limit = Math.min(toPositiveInt(req.query.limit, 10), 50);
		const skip = (page - 1) * limit;
		const sort = getReviewSort(req.query.sortBy);

		const query = {
			course: courseId,
			status: "published",
		};

		const [reviews, totalCount, courseMeta] = await Promise.all([
			RatingAndReview.find(query)
				.populate("user", "firstName lastName image")
				.sort(sort)
				.skip(skip)
				.limit(limit)
				.lean(),
			RatingAndReview.countDocuments(query),
			Course.findById(courseId).select("averageRating totalRatings").lean(),
		]);

		return res.status(200).json({
			success: true,
			data: reviews,
			summary: {
				averageRating: courseMeta?.averageRating || 0,
				totalRatings: courseMeta?.totalRatings || 0,
			},
			pagination: {
				page,
				limit,
				totalCount,
				totalPages: Math.ceil(totalCount / limit) || 1,
			},
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not fetch course reviews",
			error: error.message,
		});
	}
};

exports.getMyReviewForCourse = async (req, res) => {
	try {
		const { courseId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(courseId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid course id",
			});
		}

		const review = await RatingAndReview.findOne({
			course: courseId,
			user: req.user.id,
			status: "published",
		}).lean();

		return res.status(200).json({
			success: true,
			data: review,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not fetch review",
			error: error.message,
		});
	}
};

exports.deleteMyReview = async (req, res) => {
	try {
		const { reviewId } = req.params;
		if (!mongoose.Types.ObjectId.isValid(reviewId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid review id",
			});
		}

		const review = await RatingAndReview.findOne({
			_id: reviewId,
			user: req.user.id,
		});

		if (!review) {
			return res.status(404).json({
				success: false,
				message: "Review not found",
			});
		}

		const courseId = review.course;
		await RatingAndReview.findByIdAndDelete(reviewId);
		await Course.findByIdAndUpdate(courseId, {
			$pull: { ratingAndReviews: reviewId },
		});
		const summary = await syncCourseRatingStats(courseId);

		return res.status(200).json({
			success: true,
			message: "Review deleted successfully",
			summary,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: "Could not delete review",
			error: error.message,
		});
	}
};

exports.getPublicReviews = async (req, res) => {
	try {
		const page = toPositiveInt(req.query.page, 1);
		const limit = Math.min(toPositiveInt(req.query.limit, 20), 100);
		const skip = (page - 1) * limit;

		const reviews = await RatingAndReview.find({ status: "published" })
			.populate({
				path: "user",
				select: "firstName lastName email image",
			})
			.populate({
				path: "course",
				select: "courseName",
			})
			.sort({ createdAt: -1 })
			.skip(skip)
			.limit(limit)
			.lean();

		return res.status(200).json({
			success: true,
			message: "All reviews fetched successfully",
			data: reviews,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};

exports.getCourseAverageRating = async (req, res) => {
	try {
		const courseId = req.query.courseId || req.body.courseId;
		if (!courseId || !mongoose.Types.ObjectId.isValid(courseId)) {
			return res.status(400).json({
				success: false,
				message: "Invalid course id",
			});
		}

		const course = await Course.findById(courseId)
			.select("averageRating totalRatings")
			.lean();

		return res.status(200).json({
			success: true,
			averageRating: course?.averageRating || 0,
			totalRatings: course?.totalRatings || 0,
		});
	} catch (error) {
		return res.status(500).json({
			success: false,
			message: error.message,
		});
	}
};
