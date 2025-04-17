import { Button, FormControl, FormGroup, InputGroup, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { MdEditDocument } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as quizClient from "./client";
import { setQuizzes, deleteQuiz } from "./reducer";
import { useEffect } from "react";
import { IoRocketOutline } from "react-icons/io5";

export default function Quizzes() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);
  const dispatch = useDispatch();

  const createQuiz = () => {
    const tempQuiz = {
      _id: "Q" + Math.floor(Math.random() * (999 - 100 + 1) + 100),
      title: "New Quiz",
      course: cid,
      dueDt: "",
      dueTime: "11:59pm",
      points: 100,
      qns: 15
    };
  }

  const fetchQuizzes = async () => {
    const quizzes = await quizClient.fetchAllQuizzes();
    dispatch(setQuizzes(quizzes));
  };

  useEffect(() => {
    fetchQuizzes();
  }, [])

  const removeQuiz = async(id: string) => {
    await quizClient.deleteQuiz(id);
    dispatch(deleteQuiz(id));
  }

  return (
    <div id="wd-quizzes">
      <div style={{ display: "flex" }}>
        <FormGroup className="w-50" controlId="wd-quizzes-search">
          <InputGroup style={{ width: "fit-content" }}>
            <InputGroup.Text> <HiMagnifyingGlass /> </InputGroup.Text>
            <FormControl type="text" placeholder="Search..." />
          </InputGroup>
        </FormGroup>
      </div>
      <div style={{ marginTop: "-37px" }}>
        {currentUser.role === "FACULTY" &&
          <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-quiz"
            onClick={() => createQuiz()}>
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Quiz
          </Button>
        }
      </div>
      <br /><br /><br /><br />
      <ListGroup className="rounded-0">
        <ListGroup.Item className="p-0 mb-5 fs-5 border-gray">
          <div id="wd-assignments-title" className="p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> QUIZZES
          </div>
          <ListGroup className="wd-assignment-list rounded-0">
            {
              quizzes.map((quiz: any) => (
                <ListGroup.Item className="wd-assignment-list-item p-3 ps-1">
                  <IoRocketOutline style={{ color: "green" }} />
                  {currentUser.role === "FACULTY" && <a href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                    className="wd-assignment-link" >
                    {quiz.title} <br />
                  </a>}
                  {currentUser.role !== "FACULTY" && <span className="wd-assignment-link" >
                    {quiz.title} <br />
                  </span>}
                  <LessonControlButtons />
                  {currentUser.role === "FACULTY" &&
                    <FaTrash className="text-danger me-2 mt-2 float-end" data-bs-toggle="modal" data-bs-target={`#wd-delete-quiz-dialog-${quiz._id}`} />}
                    <ConfirmationPopup title={quiz.title} id={quiz._id}></ConfirmationPopup>
                  <div className="wd-quiz-modules">
                    {quiz.status} | <b>Due</b> {quiz.dueDt} at {quiz.dueTime} | {quiz.points} pt(s) | {quiz.qns} Question(s)
                  </div>
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );

  function ConfirmationPopup({title, id}: {title: string, id: string}) {
    console.log(title);
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

