import { Button, Container, FormControl, FormGroup, InputGroup, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useNavigate, useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as quizClient from "./client";
import { addQuiz, setQuizzes } from "./reducer";
import { useEffect } from "react";
import { IoRocketOutline } from "react-icons/io5";
import QuizControls from "./quizControls";
import { v4 as uuidv4 } from "uuid";

export default function Quizzes() {
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const fetchQuizzes = async () => {
        const quizzes = await quizClient.fetchAllQuizzes();
        dispatch(setQuizzes(quizzes));
    };

    const createQuiz = async () => {
        const newQuiz = {
            _id: uuidv4(),
            title: "New Quiz",
            course: cid,
            type: "Graded Quiz",
            assignmentGroup: "Quizzes",
            shuffleAns: true,
            timeLimit: 20,
            multipleAttempts: false,
            noOfAttempts: 1,
            showCorrectAns: "Immediately",
            accessCode: "",
            oneQn: true,
            webcam: false,
            lockQns: false,
            dueDt: "",
            dueTime: "",
            availableDt: "",
            availableTime: "",
            untilDt: "",
            untilTime: "",
            points: 0,
            qns: 0,
            published: false
        };
        await quizClient.addQuiz(newQuiz);
        dispatch(addQuiz(newQuiz));
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${newQuiz._id}`);
    }

    useEffect(() => {
        fetchQuizzes();
    }, [])

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
                    <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment"
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
                            quizzes
                                .filter((quiz: any) => {
                                    return currentUser.role === "FACULTY" || quiz.published;
                                })
                                .map((quiz: any) => (
                                    <ListGroup.Item className="wd-assignment-list-item p-3 ps-1 position-relative">
                                        <div className="d-block justify-content-between">
                                            <IoRocketOutline style={{ color: "green" }} className="mt-1" />
                                            {currentUser.role === "FACULTY" && <a href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                                                className="wd-assignment-link" >
                                                {quiz.title} <br />
                                            </a>}
                                            {currentUser.role !== "FACULTY" && <a href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/QuestionsAnswers`}
                                                className="wd-assignment-link" >
                                                {quiz.title} <br />
                                            </a>}
                                            {currentUser.role === "FACULTY" &&
                                                <QuizControls quiz={quiz}></QuizControls>
                                            }
                                        </div>
                                        <div className="wd-quiz-modules">
                                            {getStatus(quiz.availableDt, quiz.availableTime, quiz.untilDt, quiz.untilTime)} | <b>Due</b> {quiz.dueDt} at {quiz.dueTime} | {quiz.points} pt(s) | {quiz.qns} Question(s)
                                        </div>
                                    </ListGroup.Item>
                                ))
                        }
                    </ListGroup>
                </ListGroup.Item>
            </ListGroup>
        </div>
    );

    function getStatus(availableDt: string, availableTime: string, untilDt: string, untilTime: string) {
        const availableDate = new Date(availableDt + " " + availableTime);
        const untilDate = new Date(untilDt + " " + untilTime);
        const currentDate = new Date();
        if (currentDate >= availableDate && currentDate <= untilDate) {
            return "Available";
        }
        else if (currentDate > availableDate) {
            return "Closed";
        } else if (currentDate < availableDate) {
            return "Not available until " + availableDt + " at " + availableTime;
        }
    }
}

