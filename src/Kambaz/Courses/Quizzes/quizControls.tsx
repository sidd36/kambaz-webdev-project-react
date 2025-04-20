import { Container, Dropdown } from "react-bootstrap";
import { IoEllipsisVertical } from "react-icons/io5";
import * as quizClient from "./client";
import { useDispatch } from "react-redux";
import { deleteQuiz, updateQuiz } from "./reducer";
import { FaPencil, FaTrash } from "react-icons/fa6";
import GreenCheckmark from "../Modules/GreenCheckmark";
import { MdDoNotDisturbAlt } from "react-icons/md";
import { Link, useParams } from "react-router";

export default function QuizControls({ quiz }: { quiz: any }) {
    const dispatch = useDispatch();
    const { cid } = useParams();

    const removeQuiz = async (id: string) => {
        await quizClient.deleteQuiz(id);
        dispatch(deleteQuiz(id));
    }

    const updatePublished = async (publishedNew: boolean) => {
        const updatedQuiz = { ...quiz, published: publishedNew };
        await quizClient.updateQuiz(updatedQuiz);
        dispatch(updateQuiz(updatedQuiz));
    }

    return (
        <Container>
            <Dropdown className="position-absolute end-0 top-0 me-2 mt-2" style={{right: "1em"}}>
                <Dropdown.Toggle
                    as={IoEllipsisVertical}
                    bsPrefix="p-0 border-0 bg-transparent"
                    id="dropdown-icon"
                >
                </Dropdown.Toggle>

                <Dropdown.Menu>
                    <Dropdown.Item>
                        <Link to={{ pathname: `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}` }} className="text-dark text-decoration-none"><FaPencil className="text-primary me-3" />Edit</Link>
                    </Dropdown.Item>
                    <Dropdown.Item data-bs-toggle="modal" data-bs-target={`#wd-delete-quiz-dialog-${quiz._id}`}>
                        <FaTrash className="text-danger me-3" />Delete
                    </Dropdown.Item>
                    {!quiz.published && <Dropdown.Item onClick={(e) => { e.preventDefault(); updatePublished(true); }}>
                        <span className="me-2"><GreenCheckmark /></span>Publish
                    </Dropdown.Item>}
                    {quiz.published && <Dropdown.Item onClick={(e) => { e.preventDefault(); updatePublished(false); }}>
                        <MdDoNotDisturbAlt className="me-3" />Unpublish
                    </Dropdown.Item>}
                </Dropdown.Menu>
            </Dropdown>
            <ConfirmationPopup title={quiz.title} id={quiz._id}></ConfirmationPopup>
        </Container>
    )

    function ConfirmationPopup({ title, id }: { title: string, id: string }) {
        return (
            <div id={`wd-delete-quiz-dialog-${id}`} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false">
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h1 className="modal-title fs-5" id="staticBackdropLabel">
                                Delete Quiz? </h1>
                            <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                        </div>
                        <div className="modal-body">
                            Are you sure you want to delete - <b><i>{title}</i></b> ?
                        </div>
                        <div className="modal-footer">
                            <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                                Cancel </button>
                            <button onClick={() => removeQuiz(id)} type="button" data-bs-dismiss="modal" className="btn btn-danger">
                                Yes </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}