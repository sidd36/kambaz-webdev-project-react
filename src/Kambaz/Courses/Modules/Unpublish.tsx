import { AiOutlineStop } from "react-icons/ai";
import { FaCircle } from "react-icons/fa";
export default function Unpublish() {
    return (
        <span className="me-1 position-relative">
            <AiOutlineStop style={{ top: "2px" }} className="me-1 position-absolute fs-5" />
            <FaCircle className="text-white me-1 fs-6" />
        </span>);
}