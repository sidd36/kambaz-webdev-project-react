import { Button, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
// import LessonControlButtons from "../../Modules/LessonControlButtons";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { deleteQuestion, setQuestions, setTempQuestion } from "./reducer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as quizClient from "../client";
import * as questionClient from "./client";
import { useEffect } from "react";

export default function Questions() {
  const { cid, quiz_id } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { questions } = useSelector((state: any) => state.questionsReducer);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const createQuestion = () => {
    const tempQuestion = {
      _id: "Ques" + Math.floor(Math.random() * (999 - 100 + 1) + 100),
      title: "New Question Title",
      quizId: quiz_id,
      points: 0,
      question: "New Question",
      multiple_choices: [],
      answer_blanks: [],
      type: "multiple_choice"
    };
    dispatch(setTempQuestion(tempQuestion));
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz_id}/QuestionEditor/${tempQuestion._id}`);
  }

  const deleteSelectedQuestion = async (id: string) => {
    await questionClient.deleteQuestion(id);
    dispatch(deleteQuestion(id));
  }

  const fetchQuestions = async () => {
    const questions = await quizClient.findQuestionsForQuiz(quiz_id as string);
    dispatch(setQuestions(questions));
  };

  useEffect(() => {
    fetchQuestions();
  }, [quiz_id])

  return (
    <div id="wd-assignments">
      <div>
        {currentUser.role === "FACULTY" &&
          <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment"
            onClick={() => createQuestion()}>
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Question
          </Button>
        }
      </div>
      <br /><br /><br />
      <ListGroup className="rounded-0">
        <ListGroup.Item className="p-0 mb-5 fs-5 border-gray">
          <div id="wd-assignments-title" className="p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> Questions
          </div>
          <ListGroup className="wd-assignment-list rounded-0">
            {
              questions.map((question: any) => (
                <ListGroup.Item className="wd-assignment-list-item p-3 ps-1 position-relative">
                  <div className="d-flex justify-content-between">
                    <BsGripVertical className="me-2 fs-3" />
                    {currentUser.role === "FACULTY" && <a href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz_id}/QuestionEditor/${question._id}`}
                      className="wd-assignment-link" style={{
                        left: "-7em",
                        position: "relative"
                      }} >
                      {question._id} - {question.title} <br />
                    </a>}
                    {currentUser.role !== "FACULTY" && <span className="wd-assignment-link" >
                      {question._id} - {question.title} <br />
                    </span>}
                    {currentUser.role === "FACULTY" &&
                      <FaTrash className="text-danger me-2 float-end" data-bs-toggle="modal" data-bs-target={`#wd-delete-assgn-dialog-${question._id}`} />}
                    <ConfirmationPopup title={question.title} id={question._id}></ConfirmationPopup>
                  </div>
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );

  function ConfirmationPopup({ title, id }: { title: string, id: string }) {
    return (
      <div id={`wd-delete-assgn-dialog-${id}`} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false">
        <div className="modal-dialog">
          <div className="modal-content">
            <div className="modal-header">
              <h1 className="modal-title fs-5" id="staticBackdropLabel">
                Delete Question? </h1>
              <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
            </div>
            <div className="modal-body">
              Are you sure you want to delete - <b><i>{title}</i></b> ?
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                Cancel </button>
              <button onClick={() => deleteSelectedQuestion(id)} type="button" data-bs-dismiss="modal" className="btn btn-danger">
                Yes </button>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

