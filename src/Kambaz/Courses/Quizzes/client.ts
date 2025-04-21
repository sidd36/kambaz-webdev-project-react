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

export const updateQuiz = async (quiz: any) => {
    const { data }  = await axiosWithCredentials.put(`${QUIZZES_API}/${quiz._id}`, quiz);
    return data;
}

export const addQuiz = async (quiz: any) => {
    const { data }  = await axiosWithCredentials.post(QUIZZES_API, quiz);
    return data;
}
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

export const saveQuizResponse = async (quiz_response: any) => {
    const response = await axiosWithCredentials.post(
        `${QUIZZES_API}/${quiz_response.quiz_id}/responses`,
        quiz_response
    );
    return response.data;
};

export const getQuizResponseByQuizAndUser = async (quizId: any, userId: string) => {
    const response = await axiosWithCredentials
        .get(`${QUIZZES_API}/${quizId}/responses/${userId}`);
    return response.data;
};
