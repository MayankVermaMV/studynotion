const express = require("express");
const router = express.Router();

const {
	createOrUpdateCourseReview,
	getCourseReviews,
	getMyReviewForCourse,
	deleteMyReview,
	getPublicReviews,
	getCourseAverageRating,
} = require("./review.controller");
const { auth, isStudent } = require("../../middlewares/auth");

router.get("/public", getPublicReviews);
router.get("/average", getCourseAverageRating);
router.get("/course/:courseId", getCourseReviews);
router.get("/course/:courseId/me", auth, getMyReviewForCourse);

router.post("/", auth, isStudent, createOrUpdateCourseReview);
router.delete("/:reviewId", auth, isStudent, deleteMyReview);

module.exports = router;
