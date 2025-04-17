import { IoEllipsisVertical } from "react-icons/io5";
import GreenCheckmark from "./GreenCheckmark";
import { IoMdAdd } from "react-icons/io";
import { FaPencil, FaTrash } from "react-icons/fa6";
import { useSelector } from "react-redux";
export default function ModuleControlButtons({ moduleId, deleteModule, editModule }:
    { moduleId: string; deleteModule: (moduleId: string) => void; editModule: (moduleId: string) => void }) {
    const { currentUser } = useSelector((state: any) => state.accountReducer)
    return (
        <div className="float-end">
            {currentUser.role === "FACULTY" &&
                <span>
                    <FaPencil onClick={() => editModule(moduleId)} className="text-primary me-3" />
                    <FaTrash className="text-danger me-2 mb-1" onClick={() => deleteModule(moduleId)} />
                </span>
            }
            <GreenCheckmark />
            <IoMdAdd className="fs-4" />
            <IoEllipsisVertical className="fs-4" />
        </div>);
}