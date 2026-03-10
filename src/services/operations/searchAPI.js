import { apiConnector } from "../apiconnector"
import { searchEndpoints } from "../apis"

const { SEARCH_COURSES_API } = searchEndpoints

export const searchCourses = async (filters = {}, page = 1, limit = 12) => {
  const params = {
    page,
    limit,
  }

  if (filters.q) params.q = filters.q
  if (filters.category) params.category = filters.category
  if (filters.minPrice !== "" && filters.minPrice !== null) {
    params.minPrice = filters.minPrice
  }
  if (filters.maxPrice !== "" && filters.maxPrice !== null) {
    params.maxPrice = filters.maxPrice
  }
  if (filters.minRating) params.minRating = filters.minRating
  if (filters.tags) params.tags = filters.tags
  if (filters.sortBy) params.sortBy = filters.sortBy

  const response = await apiConnector(
    "GET",
    SEARCH_COURSES_API,
    null,
    null,
    params
  )
  return response?.data
}
