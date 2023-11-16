import { configureStore } from '@reduxjs/toolkit';
import redditReducer from './reducers/redditSlice';

const store = configureStore({
  reducer: {
    reddit: redditReducer,
  },
});

export default store;