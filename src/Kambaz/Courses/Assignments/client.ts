import axios from "axios";
const REMOTE_SERVER = import.meta.env.VITE_REACT_APP_REMOTE_SERVER;
const ASSIGNMENTS_API = `${REMOTE_SERVER}/api/assignments`;
const axiosWithCredentials = axios.create({ withCredentials: true });

export const fetchAllAssignments = async () => {
    const { data } = await axiosWithCredentials.get(ASSIGNMENTS_API);
    return data;
};

export const deleteAssignment = async (assignmentId: string) => {
    const status = await axiosWithCredentials.delete(`${ASSIGNMENTS_API}/${assignmentId}`);
    return status;
}

export const createAssignment = async (assignment: any) => {
    const newAssignment = await axiosWithCredentials.post(ASSIGNMENTS_API, assignment);
    return newAssignment;
}

export const updateAssignment = async (assignment: any) => {
    const { data } = await axiosWithCredentials.put(`${ASSIGNMENTS_API}/${assignment._id}`, assignment);
    return data;
}
