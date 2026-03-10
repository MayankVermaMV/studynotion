import { useEffect, useState } from "react"

import RatingStars from "../../common/RatingStars"
import { fetchCourseReviews } from "../../../services/operations/reviewAPI"

export default function CourseReviewsSection({ courseId }) {
  const [loading, setLoading] = useState(false)
  const [sortBy, setSortBy] = useState("latest")
  const [reviews, setReviews] = useState([])
  const [summary, setSummary] = useState({
    averageRating: 0,
    totalRatings: 0,
  })
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 6,
    totalCount: 0,
    totalPages: 1,
  })

  useEffect(() => {
    const getReviews = async () => {
      if (!courseId) return
      setLoading(true)
      const response = await fetchCourseReviews(courseId, {
        page: 1,
        limit: 6,
        sortBy,
      })
      if (response?.success) {
        setReviews(response.data || [])
        setSummary(response.summary || { averageRating: 0, totalRatings: 0 })
        setPagination(response.pagination)
      } else {
        setReviews([])
      }
      setLoading(false)
    }

    getReviews()
  }, [courseId, sortBy])

  const handleLoadMore = async () => {
    if (pagination.page >= pagination.totalPages) return
    const nextPage = pagination.page + 1
    setLoading(true)
    const response = await fetchCourseReviews(courseId, {
      page: nextPage,
      limit: pagination.limit,
      sortBy,
    })
    if (response?.success) {
      setReviews((prev) => [...prev, ...(response.data || [])])
      setPagination(response.pagination)
    }
    setLoading(false)
  }

  return (
    <div className="my-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-2xl font-semibold">Learner Reviews</h2>
          <div className="mt-2 flex items-center gap-2">
            <span className="text-yellow-50">
              {(summary.averageRating || 0).toFixed(1)}
            </span>
            <RatingStars Review_Count={summary.averageRating || 0} Star_Size={20} />
            <span className="text-sm text-richblack-300">
              ({summary.totalRatings || 0} ratings)
            </span>
          </div>
        </div>
        <div>
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value)}
            className="rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
          >
            <option value="latest">Latest</option>
            <option value="highest">Highest Rated</option>
            <option value="lowest">Lowest Rated</option>
            <option value="oldest">Oldest</option>
          </select>
        </div>
      </div>

      {loading && reviews.length === 0 ? (
        <div className="mt-6 grid min-h-[120px] place-items-center">
          <div className="spinner"></div>
        </div>
      ) : reviews.length === 0 ? (
        <div className="mt-6 rounded-md border border-richblack-700 bg-richblack-800 p-4 text-richblack-300">
          No reviews yet. Be the first learner to review this course.
        </div>
      ) : (
        <div className="mt-6 space-y-4">
          {reviews.map((review) => (
            <div
              key={review._id}
              className="rounded-md border border-richblack-700 bg-richblack-800 p-4"
            >
              <div className="flex items-center gap-3">
                <img
                  src={
                    review?.user?.image
                      ? review.user.image
                      : `https://api.dicebear.com/5.x/initials/svg?seed=${review?.user?.firstName || "U"} ${review?.user?.lastName || "S"}`
                  }
                  alt="review user"
                  className="h-10 w-10 rounded-full object-cover"
                />
                <div>
                  <p className="font-semibold">
                    {review?.user?.firstName} {review?.user?.lastName}
                  </p>
                  <div className="flex items-center gap-2 text-xs text-richblack-300">
                    <span>{new Date(review.createdAt).toLocaleDateString()}</span>
                    <span>|</span>
                    <span>{Number(review.rating || 0).toFixed(1)} / 5</span>
                  </div>
                </div>
              </div>
              {review.reviewTitle && (
                <p className="mt-3 font-semibold text-richblack-25">
                  {review.reviewTitle}
                </p>
              )}
              <p className="mt-2 text-sm text-richblack-100">{review.review}</p>
            </div>
          ))}

          {pagination.page < pagination.totalPages && (
            <div className="flex justify-center">
              <button
                type="button"
                onClick={handleLoadMore}
                className="rounded-md border border-richblack-500 px-4 py-2 text-sm text-richblack-50"
              >
                {loading ? "Loading..." : "Load More Reviews"}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
