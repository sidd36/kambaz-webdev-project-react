import { createSlice } from "@reduxjs/toolkit";
const initialState = {
    quizzes: []
}
const quizzesSlice = createSlice({
    name: "quizzes",
    initialState: initialState,
    reducers: {
        setQuizzes: (state, action) => {
            state.quizzes = action.payload;
        },

        deleteQuiz: (state, action) => {
            state.quizzes = state.quizzes.filter((q: any) => q._id !== action.payload);
        }
    }
})

export const { setQuizzes, deleteQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;