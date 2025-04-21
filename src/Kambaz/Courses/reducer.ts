import { createSlice } from "@reduxjs/toolkit";
import { courses } from "../Database";
const initialState = {
  courses: courses
};
const CoursesSlice = createSlice({
  name: "courses",
  initialState,
  reducers: {
    setC: (state, action) => {
      state.courses = action.payload;
    }, 
  },
});
export const { setC } =
CoursesSlice.actions;
export default CoursesSlice.reducer;

