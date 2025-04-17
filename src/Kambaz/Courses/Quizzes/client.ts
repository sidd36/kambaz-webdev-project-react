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