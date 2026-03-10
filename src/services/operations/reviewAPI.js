import { toast } from "react-hot-toast"
import { apiConnector } from "../apiconnector"
import { reviewEndpoints } from "../apis"

const {
  UPSERT_REVIEW_API,
  PUBLIC_REVIEWS_API,
  COURSE_REVIEWS_API,
  MY_COURSE_REVIEW_API,
  DELETE_REVIEW_API,
} = reviewEndpoints

export const upsertCourseReview = async (payload, token) => {
  const toastId = toast.loading("Submitting review...")
  try {
    const response = await apiConnector("POST", UPSERT_REVIEW_API, payload, {
      Authorization: `Bearer ${token}`,
    })

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not submit review")
    }

    toast.success(response?.data?.message || "Review submitted")
    return response.data
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
    return null
  } finally {
    toast.dismiss(toastId)
  }
}

export const fetchCourseReviews = async (
  courseId,
  { page = 1, limit = 6, sortBy = "latest" } = {}
) => {
  try {
    const response = await apiConnector(
      "GET",
      `${COURSE_REVIEWS_API}/${courseId}`,
      null,
      null,
      {
        page,
        limit,
        sortBy,
      }
    )

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not fetch reviews")
    }

    return response.data
  } catch (error) {
    return {
      success: false,
      data: [],
      summary: { averageRating: 0, totalRatings: 0 },
      pagination: { page: 1, limit, totalCount: 0, totalPages: 1 },
      message: error?.response?.data?.message || error.message,
    }
  }
}

export const fetchPublicReviews = async ({ page = 1, limit = 20 } = {}) => {
  try {
    const response = await apiConnector(
      "GET",
      PUBLIC_REVIEWS_API,
      null,
      null,
      { page, limit }
    )
    if (!response?.data?.success) {
      throw new Error("Could not fetch reviews")
    }
    return response.data.data || []
  } catch (error) {
    return []
  }
}

export const fetchMyReviewForCourse = async (courseId, token) => {
  try {
    const response = await apiConnector(
      "GET",
      `${MY_COURSE_REVIEW_API}/${courseId}/me`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response?.data?.success) {
      throw new Error("Could not fetch review")
    }

    return response.data.data
  } catch (error) {
    return null
  }
}

export const deleteMyReview = async (reviewId, token) => {
  const toastId = toast.loading("Deleting review...")
  try {
    const response = await apiConnector(
      "DELETE",
      `${DELETE_REVIEW_API}/${reviewId}`,
      null,
      {
        Authorization: `Bearer ${token}`,
      }
    )

    if (!response?.data?.success) {
      throw new Error(response?.data?.message || "Could not delete review")
    }

    toast.success("Review deleted")
    return true
  } catch (error) {
    toast.error(error?.response?.data?.message || error.message)
    return false
  } finally {
    toast.dismiss(toastId)
  }
}
