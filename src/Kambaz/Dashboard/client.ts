import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REACT_APP_REMOTE_SERVER;
const ENROLLMENTS_API = `${REMOTE_SERVER}/api/enrollments`;
const axiosWithCredentials = axios.create({ withCredentials: true });
export const fetchAllEnrollments = async () => {
    const { data } = await axiosWithCredentials.get(ENROLLMENTS_API);
    return data;
};

export const enrollInCourse = async(enrollment: any) => {
    const { data } = await axiosWithCredentials.put(ENROLLMENTS_API, enrollment);
    return data;
}

export const unEnrollFromCourse = async(enrollment: any) => {
    const { data } = await axiosWithCredentials.delete(`${ENROLLMENTS_API}/${enrollment.user}/${enrollment.course}`);
    return data;
}