import { createSlice } from "@reduxjs/toolkit";

const initialState = {
    enrollmentClicked: false,
    enrollments: [{}]
}

const enrollmentsSlice = createSlice({
    name: "enrollments",
    initialState: initialState,
    reducers: {
        setEnrollments: (state, action) => {
            state.enrollments = action.payload;
        },
        enroll: (state, {payload: enrollment}) => {
            state.enrollments = [...state.enrollments, enrollment];
        },
        unEnroll: (state, {payload: enrollment}) => {
            const e =  state.enrollments.find((e: any) => e.course === enrollment.course && e.user === enrollment.user)
            state.enrollments = state.enrollments.filter(enrollment => e !== enrollment);
        },
        enrollmentToggle: (state, {payload: clicked}) => {
            state.enrollmentClicked = clicked;
        }
    }
})

export const { enrollmentToggle, enroll, unEnroll, setEnrollments } = enrollmentsSlice.actions;
export default enrollmentsSlice.reducer;