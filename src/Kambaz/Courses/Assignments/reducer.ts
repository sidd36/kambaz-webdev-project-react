import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    assignments: [],
    tempAssignment: null
}
const assignmentsSlice = createSlice({
    name: "assignments",
    initialState: initialState,
    reducers: {
        setAssignments: (state, action) => {
            state.assignments = action.payload;
        },
        addAssignment: (state, { payload: assignment }) => {
            const newAssignment: any = {
                _id: assignment._id,
                title: assignment.title,
                course: assignment.course,
                availableDt: assignment.availableDt,
                availableTime: assignment.availableTime,
                dueDt: assignment.dueDt,
                dueTime: assignment.dueTime,
                untilDt: assignment.untilDt,
                untilTime: assignment.untilTime,
                points: assignment.points,
                desc: assignment.desc
            }
            state.assignments = [...state.assignments, newAssignment] as any;
        },

        deleteAssignment: (state, { payload: assignmentId }) => {
            state.assignments = state.assignments.filter((a: any) => a._id !== assignmentId)
        },

        updateAssignment: (state, { payload: assignment }) => {
            state.assignments = state.assignments.map((a: any) =>
                a._id === assignment._id ? assignment : a
            ) as any;
        },

        setTempAssignment: (state, { payload: tempAssignment }) => {
            state.tempAssignment = tempAssignment;
        },

    }
})

export const { addAssignment, deleteAssignment, updateAssignment, setTempAssignment, setAssignments } = assignmentsSlice.actions;
export default assignmentsSlice.reducer;