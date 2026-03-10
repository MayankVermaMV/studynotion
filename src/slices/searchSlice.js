import { createSlice } from "@reduxjs/toolkit"

const initialFilters = {
  q: "",
  category: "",
  minPrice: "",
  maxPrice: "",
  minRating: "",
  tags: "",
  sortBy: "relevance",
  page: 1,
}

const initialState = {
  filters: initialFilters,
  results: [],
  pagination: {
    page: 1,
    limit: 12,
    totalCount: 0,
    totalPages: 1,
  },
  availableFilters: {
    categories: [],
    tags: [],
  },
  loading: false,
}

const searchSlice = createSlice({
  name: "search",
  initialState,
  reducers: {
    setSearchFilters(state, action) {
      state.filters = { ...state.filters, ...action.payload }
    },
    resetSearchFilters(state) {
      state.filters = initialFilters
    },
    setSearchLoading(state, action) {
      state.loading = action.payload
    },
    setSearchResults(state, action) {
      const { data = [], pagination, filters } = action.payload || {}
      state.results = data
      state.pagination = pagination || initialState.pagination
      state.availableFilters = filters || initialState.availableFilters
    },
  },
})

export const {
  setSearchFilters,
  resetSearchFilters,
  setSearchLoading,
  setSearchResults,
} = searchSlice.actions

export default searchSlice.reducer
