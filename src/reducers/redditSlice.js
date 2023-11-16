import { createSlice } from '@reduxjs/toolkit';

// Initial state
const initialState = {
  sorting: 'hot',
  viewMode: 'card',
  after: null,
  subredditRequest: {
    after: null,
    sort: 'hot'
  },
  subredditList: [],
  isLastPage: false,
};

// Reddit slice
const redditSlice = createSlice({
  name: 'reddit',
  initialState,
  reducers: {
    // Reducer functions to handle actions
    setSorting: (state, action) => {
      state.sorting = action.payload;
    },
    setViewMode: (state, action) => {
      state.viewMode = action.payload;
    },
    setAfter: (state, action) => {
      state.after = action.payload;
    },
    setSubRedditRequest: (state, action) => {
      state.subredditRequest = {
        ...state.subredditRequest,
        ...action.payload
      }
    },
    setSubRedditList: (state, action) => {
      state.subredditList = [...action.payload];
    },
    setIsLastPage: (state, action) => {
      state.isLastPage = action.payload;
    },
  },
});

// Export the actions and reducer
export const { setSorting, setViewMode, setSubRedditRequest, setSubRedditList, setIsLastPage, setAfter } = redditSlice.actions;
export default redditSlice.reducer;
