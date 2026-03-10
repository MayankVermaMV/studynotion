const API_PREFIX = "/api/v1"

const normalizeBaseUrl = (baseUrl) => {
  const trimmedBaseUrl = (baseUrl || "").trim().replace(/\/+$/, "")

  if (!trimmedBaseUrl) {
    return "http://localhost:4000/api/v1"
  }

  return trimmedBaseUrl.endsWith(API_PREFIX)
    ? trimmedBaseUrl
    : `${trimmedBaseUrl}${API_PREFIX}`
}

const BASE_URL = normalizeBaseUrl(process.env.REACT_APP_BASE_URL)

// AUTH ENDPOINTS
export const endpoints = {
  SENDOTP_API: BASE_URL + "/auth/sendotp",
  SIGNUP_API: BASE_URL + "/auth/signup",
  LOGIN_API: BASE_URL + "/auth/login",
  RESETPASSTOKEN_API: BASE_URL + "/auth/reset-password-token",
  RESETPASSWORD_API: BASE_URL + "/auth/reset-password",
}

// PROFILE ENDPOINTS
export const profileEndpoints = {
  GET_USER_DETAILS_API: BASE_URL + "/profile/getUserDetails",
  GET_USER_ENROLLED_COURSES_API: BASE_URL + "/profile/getEnrolledCourses",
  GET_INSTRUCTOR_DATA_API: BASE_URL + "/profile/instructorDashboard",
}

// STUDENTS ENDPOINTS
export const studentEndpoints = {
  COURSE_PAYMENT_API: BASE_URL + "/payment/capturePayment",
  COURSE_VERIFY_API: BASE_URL + "/payment/verifyPayment",
  SEND_PAYMENT_SUCCESS_EMAIL_API: BASE_URL + "/payment/sendPaymentSuccessEmail",
}

// COURSE ENDPOINTS
export const courseEndpoints = {
  GET_ALL_COURSE_API: BASE_URL + "/course/getAllCourses",
  COURSE_DETAILS_API: BASE_URL + "/course/getCourseDetails",
  EDIT_COURSE_API: BASE_URL + "/course/editCourse",
  COURSE_CATEGORIES_API: BASE_URL + "/course/showAllCategories",
  CREATE_COURSE_API: BASE_URL + "/course/createCourse",
  CREATE_SECTION_API: BASE_URL + "/course/addSection",
  CREATE_SUBSECTION_API: BASE_URL + "/course/addSubSection",
  UPDATE_SECTION_API: BASE_URL + "/course/updateSection",
  UPDATE_SUBSECTION_API: BASE_URL + "/course/updateSubSection",
  GET_ALL_INSTRUCTOR_COURSES_API: BASE_URL + "/course/getInstructorCourses",
  DELETE_SECTION_API: BASE_URL + "/course/deleteSection",
  DELETE_SUBSECTION_API: BASE_URL + "/course/deleteSubSection",
  DELETE_COURSE_API: BASE_URL + "/course/deleteCourse",
  GET_FULL_COURSE_DETAILS_AUTHENTICATED:
    BASE_URL + "/course/getFullCourseDetails",
  LECTURE_COMPLETION_API: BASE_URL + "/course/updateCourseProgress",
  CREATE_RATING_API: BASE_URL + "/course/createRating",
}

// RATINGS AND REVIEWS
export const ratingsEndpoints = {
  REVIEWS_DETAILS_API: BASE_URL + "/course/getReviews",
}

// REVIEWS API
export const reviewEndpoints = {
  UPSERT_REVIEW_API: BASE_URL + "/reviews",
  PUBLIC_REVIEWS_API: BASE_URL + "/reviews/public",
  COURSE_REVIEWS_API: BASE_URL + "/reviews/course",
  MY_COURSE_REVIEW_API: BASE_URL + "/reviews/course",
  DELETE_REVIEW_API: BASE_URL + "/reviews",
}

// CATAGORIES API
export const categories = {
  CATEGORIES_API: BASE_URL + "/course/showAllCategories",
}

// CATALOG PAGE DATA
export const catalogData = {
  CATALOGPAGEDATA_API: BASE_URL + "/course/getCategoryPageDetails",
}
// CONTACT-US API
export const contactusEndpoint = {
  CONTACT_US_API: BASE_URL + "/reach/contact",
}

// SETTINGS PAGE API
export const settingsEndpoints = {
  UPDATE_DISPLAY_PICTURE_API: BASE_URL + "/profile/updateDisplayPicture",
  UPDATE_PROFILE_API: BASE_URL + "/profile/updateProfile",
  CHANGE_PASSWORD_API: BASE_URL + "/auth/changepassword",
  DELETE_PROFILE_API: BASE_URL + "/profile/deleteProfile",
}

// SEARCH API
export const searchEndpoints = {
  SEARCH_COURSES_API: BASE_URL + "/search/courses",
}

// NOTIFICATION API
export const notificationEndpoints = {
  GET_NOTIFICATIONS_API: BASE_URL + "/notifications",
  GET_UNREAD_COUNT_API: BASE_URL + "/notifications/unread-count",
  MARK_ALL_READ_API: BASE_URL + "/notifications/read-all",
  MARK_READ_API: BASE_URL + "/notifications",
  DELETE_NOTIFICATION_API: BASE_URL + "/notifications",
  GET_NOTIFICATION_PREFERENCES_API: BASE_URL + "/notifications/preferences/me",
  UPDATE_NOTIFICATION_PREFERENCES_API:
    BASE_URL + "/notifications/preferences/me",
}
