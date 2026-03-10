import { useEffect, useMemo } from "react"
import { Link, useSearchParams } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import { toast } from "react-hot-toast"

import { searchCourses } from "../services/operations/searchAPI"
import {
  resetSearchFilters,
  setSearchFilters,
  setSearchLoading,
  setSearchResults,
} from "../slices/searchSlice"
import RatingStars from "../components/common/RatingStars"

const parseQueryFilters = (searchParams) => ({
  q: searchParams.get("q") || "",
  category: searchParams.get("category") || "",
  minPrice: searchParams.get("minPrice") || "",
  maxPrice: searchParams.get("maxPrice") || "",
  minRating: searchParams.get("minRating") || "",
  tags: searchParams.get("tags") || "",
  sortBy: searchParams.get("sortBy") || "relevance",
  page: Number(searchParams.get("page")) > 0 ? Number(searchParams.get("page")) : 1,
})

export default function CourseSearch() {
  const dispatch = useDispatch()
  const [searchParams, setSearchParams] = useSearchParams()
  const { filters, results, pagination, availableFilters, loading } = useSelector(
    (state) => state.search
  )

  const currentFilters = useMemo(
    () => parseQueryFilters(searchParams),
    [searchParams]
  )

  useEffect(() => {
    dispatch(setSearchFilters(currentFilters))
  }, [currentFilters, dispatch])

  useEffect(() => {
    const fetchResults = async () => {
      dispatch(setSearchLoading(true))
      try {
        const response = await searchCourses(
          currentFilters,
          currentFilters.page || 1,
          12
        )
        if (!response?.success) {
          throw new Error(response?.message || "Could not search courses")
        }
        dispatch(
          setSearchResults({
            data: response.data,
            pagination: response.pagination,
            filters: response.filters,
          })
        )
      } catch (error) {
        toast.error(error.message)
        dispatch(
          setSearchResults({
            data: [],
            pagination: { page: 1, limit: 12, totalCount: 0, totalPages: 1 },
            filters: { categories: [], tags: [] },
          })
        )
      } finally {
        dispatch(setSearchLoading(false))
      }
    }

    fetchResults()
  }, [currentFilters, dispatch])

  const updateQueryParams = (payload, { resetPage = true } = {}) => {
    const nextFilters = { ...filters, ...payload }
    if (resetPage) {
      nextFilters.page = 1
    }
    const query = {}
    Object.entries(nextFilters).forEach(([key, value]) => {
      if (value !== "" && value !== null && value !== undefined) {
        query[key] = value
      }
    })
    setSearchParams(query)
  }

  const clearFilters = () => {
    dispatch(resetSearchFilters())
    setSearchParams({})
  }

  return (
    <div className="mx-auto w-11/12 max-w-maxContent py-10 text-richblack-5">
      <div className="mb-8">
        <h1 className="text-3xl font-semibold">Find Courses</h1>
        <p className="mt-2 text-richblack-300">
          Search by keyword, category, pricing, tags, and rating.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
        <div className="space-y-4 rounded-lg border border-richblack-700 bg-richblack-800 p-4">
          <div>
            <label className="mb-1 block text-xs uppercase text-richblack-300">
              Keyword
            </label>
            <input
              value={filters.q}
              onChange={(event) => updateQueryParams({ q: event.target.value })}
              placeholder="e.g. React, JavaScript"
              className="w-full rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-richblack-300">
              Category
            </label>
            <select
              value={filters.category}
              onChange={(event) =>
                updateQueryParams({ category: event.target.value })
              }
              className="w-full rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
            >
              <option value="">All categories</option>
              {availableFilters.categories.map((category) => (
                <option key={category._id} value={category._id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-richblack-300">
              Min Rating
            </label>
            <select
              value={filters.minRating}
              onChange={(event) =>
                updateQueryParams({ minRating: event.target.value })
              }
              className="w-full rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
            >
              <option value="">Any</option>
              <option value="4.5">4.5+</option>
              <option value="4">4.0+</option>
              <option value="3.5">3.5+</option>
              <option value="3">3.0+</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-2">
            <div>
              <label className="mb-1 block text-xs uppercase text-richblack-300">
                Min Price
              </label>
              <input
                type="number"
                min="0"
                value={filters.minPrice}
                onChange={(event) =>
                  updateQueryParams({ minPrice: event.target.value })
                }
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
              />
            </div>
            <div>
              <label className="mb-1 block text-xs uppercase text-richblack-300">
                Max Price
              </label>
              <input
                type="number"
                min="0"
                value={filters.maxPrice}
                onChange={(event) =>
                  updateQueryParams({ maxPrice: event.target.value })
                }
                className="w-full rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
              />
            </div>
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-richblack-300">
              Tags (comma separated)
            </label>
            <input
              value={filters.tags}
              onChange={(event) =>
                updateQueryParams({ tags: event.target.value })
              }
              placeholder="frontend, react"
              className="w-full rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
            />
          </div>

          <div>
            <label className="mb-1 block text-xs uppercase text-richblack-300">
              Sort By
            </label>
            <select
              value={filters.sortBy}
              onChange={(event) =>
                updateQueryParams({ sortBy: event.target.value })
              }
              className="w-full rounded-md border border-richblack-600 bg-richblack-700 px-3 py-2 text-sm"
            >
              <option value="relevance">Relevance</option>
              <option value="newest">Newest</option>
              <option value="popular">Most Popular</option>
              <option value="rating_desc">Highest Rated</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
          </div>

          <button
            type="button"
            onClick={clearFilters}
            className="w-full rounded-md border border-richblack-500 py-2 text-sm text-richblack-50"
          >
            Clear Filters
          </button>
        </div>

        <div className="lg:col-span-3">
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-richblack-300">
              {pagination.totalCount} courses found
            </p>
            {pagination.totalPages > 1 && (
              <p className="text-xs text-richblack-400">
                Page {pagination.page} of {pagination.totalPages}
              </p>
            )}
          </div>

          {loading ? (
            <div className="grid min-h-[300px] place-items-center">
              <div className="spinner"></div>
            </div>
          ) : results.length === 0 ? (
            <div className="rounded-lg border border-richblack-700 bg-richblack-800 p-6 text-center text-richblack-300">
              No courses matched your filters.
            </div>
          ) : (
            <div className="space-y-4">
              {results.map((course) => (
                <Link
                  key={course._id}
                  to={`/courses/${course._id}`}
                  className="block rounded-lg border border-richblack-700 bg-richblack-800 p-4 transition-all duration-200 hover:border-richblack-500"
                >
                  <div className="flex flex-col gap-4 md:flex-row">
                    <img
                      src={course.thumbnail}
                      alt={course.courseName}
                      className="h-[140px] w-full rounded-md object-cover md:w-[240px]"
                    />
                    <div className="flex flex-1 flex-col justify-between">
                      <div>
                        <h2 className="text-xl font-semibold text-richblack-5">
                          {course.courseName}
                        </h2>
                        <p className="mt-1 line-clamp-2 text-sm text-richblack-300">
                          {course.courseDescription}
                        </p>
                      </div>
                      <div className="mt-3 flex flex-wrap items-center gap-3 text-sm text-richblack-200">
                        <span>{course.category?.name || "General"}</span>
                        <span>by {course.instructor?.firstName || "Instructor"}</span>
                        <span>{course.studentsEnrolledCount || 0} students</span>
                      </div>
                      <div className="mt-3 flex items-center gap-2">
                        <span className="text-yellow-50">
                          {(course.averageRating || 0).toFixed(1)}
                        </span>
                        <RatingStars
                          Review_Count={course.averageRating || 0}
                          Star_Size={18}
                        />
                        <span className="text-xs text-richblack-300">
                          ({course.totalRatings || 0} ratings)
                        </span>
                      </div>
                    </div>
                    <div className="text-xl font-semibold text-yellow-50">
                      Rs. {course.price}
                    </div>
                  </div>
                </Link>
              ))}

              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-center gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() =>
                      updateQueryParams(
                        { page: Math.max(1, pagination.page - 1) },
                        { resetPage: false }
                      )
                    }
                    disabled={pagination.page <= 1}
                    className="rounded-md border border-richblack-500 px-4 py-2 text-sm text-richblack-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Previous
                  </button>
                  <button
                    type="button"
                    onClick={() =>
                      updateQueryParams(
                        { page: Math.min(pagination.totalPages, pagination.page + 1) },
                        { resetPage: false }
                      )
                    }
                    disabled={pagination.page >= pagination.totalPages}
                    className="rounded-md border border-richblack-500 px-4 py-2 text-sm text-richblack-50 disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    Next
                  </button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
