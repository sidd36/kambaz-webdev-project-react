import { createSlice } from "@reduxjs/toolkit";
import { v4 as uuidv4 } from "uuid";
const initialState = {
    questions: [],
    tempQuestion: null
};
const questionsSlice = createSlice({
    name: "questions",
    initialState,
    reducers: {
        setQuestions: (state, action) => {
            state.questions = action.payload;
        },
        addQuestion: (state, { payload: question }) => {
            const newQuestion: any = {
                _id: uuidv4(),
                lessons: [],
                name: question.name,
                course: question.course,
            };
            state.questions = [...state.questions, newQuestion] as any;
        },
        deleteQuestion: (state, { payload: questionId }) => {
            state.questions = state.questions.filter(
                (m: any) => m._id !== questionId);
        },
        updateQuestion: (state, { payload: question }) => {
            state.questions = state.questions.map((m: any) =>
                m._id === question._id ? question : m
            ) as any;
        },
        editQuestion: (state, { payload: questionId }) => {
            state.questions = state.questions.map((m: any) =>
                m._id === questionId ? { ...m, editing: true } : m
            ) as any;
        },
        setTempQuestion: (state, { payload: tempQuestion }) => {
            state.tempQuestion = tempQuestion;
        },
    },
});
export const { addQuestion, deleteQuestion, updateQuestion, editQuestion, setQuestions, setTempQuestion } =
    questionsSlice.actions;
export default questionsSlice.reducer;