import { createSlice } from '@reduxjs/toolkit'

const feedSlice = createSlice({
  name: 'feed',
  initialState: [],
  reducers: {
    addfeed: (state, action) => action.payload,
    removeUserFromFeed: (state, action) => {
      const newfeed = state.filter((user) => user._id !== action.payload);
      return newfeed;
    },
  },
});

export const { addfeed, removeUserFromFeed } = feedSlice.actions;
export default feedSlice.reducer;