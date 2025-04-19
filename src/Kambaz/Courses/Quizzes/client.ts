import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REACT_APP_REMOTE_SERVER;
const QUIZZES_API = `${REMOTE_SERVER}/api/quizzes`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const fetchAllQuizzes = async () => {
    const { data } = await axiosWithCredentials.get(QUIZZES_API);
    return data;
};

export const deleteQuiz = async (id: string) => {
    const status = await axiosWithCredentials.delete(`${QUIZZES_API}/${id}`);
    return status;
};

export const findQuestionsForQuiz = async (id: string) => {
    const response = await axiosWithCredentials
        .get(`${QUIZZES_API}/${id}/questions`);
    return response.data;
};

export const createQuestionsForQuiz = async (quizId: string, question: any) => {
    const response = await axiosWithCredentials.post(
        `${QUIZZES_API}/${quizId}/questions`,
        question
    );
    return response.data;
};