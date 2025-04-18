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
        },

        updateQuiz: (state, action) => {
            state.quizzes = state.quizzes.map((q: any) => {
                q._id === action.payload._id ? action.payload : q
            }) as any;
        },
        addQuiz: (state, action) => {
            state.quizzes = [...state.quizzes, action.payload] as any;
        }
    }
})

export const { setQuizzes, deleteQuiz, updateQuiz, addQuiz } = quizzesSlice.actions;
export default quizzesSlice.reducer;