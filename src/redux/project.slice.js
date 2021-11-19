import { createSlice, PayloadAction } from "@reduxjs/toolkit";

const initialState = {
  scrollSpeed: 0,
  scrollDirection: "L", //can be either L or R
};

export const projectSlice = createSlice({
  name: "project",
  initialState,
  reducers: {
    setScrollSpeed: (state, action) => {
      state.scrollSpeed = action.payload;
    },
    setScrollDirection: (state, action) => {
      state.scrollDirection = action.payload;
    },
  },
});

export const { setScrollSpeed, setScrollDirection } = projectSlice.actions;

export default projectSlice.reducer;
