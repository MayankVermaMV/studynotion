import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { RxCross2 } from "react-icons/rx"
import ReactStars from "react-rating-stars-component"
import { toast } from "react-hot-toast"
import { useSelector } from "react-redux"

import {
  fetchMyReviewForCourse,
  upsertCourseReview,
} from "../../../services/operations/reviewAPI"
import IconBtn from "../../common/IconBtn"

export default function CourseReviewModal({ setReviewModal }) {
  const { user } = useSelector((state) => state.profile)
  const { token } = useSelector((state) => state.auth)
  const { courseEntireData } = useSelector((state) => state.viewCourse)

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      courseRating: 0,
      reviewTitle: "",
      courseExperience: "",
    },
  })
  const courseRatingValue = watch("courseRating")

  useEffect(() => {
    const loadExistingReview = async () => {
      const review = await fetchMyReviewForCourse(courseEntireData._id, token)
      if (review) {
        setValue("courseRating", review.rating || 0)
        setValue("reviewTitle", review.reviewTitle || "")
        setValue("courseExperience", review.review || "")
      }
    }

    if (courseEntireData?._id && token) {
      loadExistingReview()
    }
  }, [courseEntireData?._id, setValue, token])

  const ratingChanged = (newRating) => {
    setValue("courseRating", newRating)
  }

  const onSubmit = async (data) => {
    if (!data.courseRating || Number(data.courseRating) < 1) {
      toast.error("Please select a rating")
      return
    }

    const response = await upsertCourseReview(
      {
        courseId: courseEntireData._id,
        rating: data.courseRating,
        reviewTitle: data.reviewTitle,
        review: data.courseExperience,
      },
      token
    )

    if (response?.success) {
      setReviewModal(false)
    }
  }

  return (
    <div className="fixed inset-0 z-[1000] !mt-0 grid h-screen w-screen place-items-center overflow-auto bg-white bg-opacity-10 backdrop-blur-sm">
      <div className="my-10 w-11/12 max-w-[700px] rounded-lg border border-richblack-400 bg-richblack-800">
        <div className="flex items-center justify-between rounded-t-lg bg-richblack-700 p-5">
          <p className="text-xl font-semibold text-richblack-5">
            Add or Update Review
          </p>
          <button type="button" onClick={() => setReviewModal(false)}>
            <RxCross2 className="text-2xl text-richblack-5" />
          </button>
        </div>

        <div className="p-6">
          <div className="flex items-center justify-center gap-x-4">
            <img
              src={user?.image}
              alt={`${user?.firstName || "user"} profile`}
              className="aspect-square w-[50px] rounded-full object-cover"
            />
            <div>
              <p className="font-semibold text-richblack-5">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-sm text-richblack-5">Posting Publicly</p>
            </div>
          </div>

          <form
            onSubmit={handleSubmit(onSubmit)}
            className="mt-6 flex flex-col items-center"
          >
            <ReactStars
              count={5}
              value={Number(courseRatingValue) || 0}
              onChange={ratingChanged}
              size={24}
              activeColor="#ffd700"
            />

            <div className="mt-4 flex w-11/12 flex-col space-y-2">
              <label className="text-sm text-richblack-5" htmlFor="reviewTitle">
                Review Title
              </label>
              <input
                id="reviewTitle"
                placeholder="Summarize your feedback"
                {...register("reviewTitle")}
                className="form-style w-full"
              />
            </div>

            <div className="mt-4 flex w-11/12 flex-col space-y-2">
              <label
                className="text-sm text-richblack-5"
                htmlFor="courseExperience"
              >
                Add Your Experience <sup className="text-pink-200">*</sup>
              </label>
              <textarea
                id="courseExperience"
                placeholder="Add your learning experience"
                {...register("courseExperience", { required: true, minLength: 5 })}
                className="form-style min-h-[130px] w-full resize-none"
              />
              {errors.courseExperience && (
                <span className="ml-2 text-xs tracking-wide text-pink-200">
                  Please add at least 5 characters.
                </span>
              )}
            </div>

            <div className="mt-6 flex w-11/12 justify-end gap-x-2">
              <button
                type="button"
                onClick={() => setReviewModal(false)}
                className="flex cursor-pointer items-center gap-x-2 rounded-md bg-richblack-300 px-[20px] py-[8px] font-semibold text-richblack-900"
              >
                Cancel
              </button>
              <IconBtn disabled={isSubmitting} text={isSubmitting ? "Saving..." : "Save"} />
            </div>
          </form>
        </div>
      </div>
    </div>
  )
}
