import { Button, Container, FormControl, FormGroup, InputGroup, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";
import { useParams } from "react-router";
import { useDispatch, useSelector } from "react-redux";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as quizClient from "./client";
import { setQuizzes } from "./reducer";
import { useEffect } from "react";
import { IoRocketOutline } from "react-icons/io5";
import QuizControls from "./quizControls";

export default function Quizzes() {
    const { cid } = useParams();
    const { currentUser } = useSelector((state: any) => state.accountReducer);
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const dispatch = useDispatch();

    const fetchQuizzes = async () => {
        const quizzes = await quizClient.fetchAllQuizzes();
        dispatch(setQuizzes(quizzes));
    };

    const addQuiz = () => {
        // const tempQuiz = {
        //     _id: "Q" + Math.floor(Math.random() * (999 - 100 + 1) + 100),
        //     title: "New Quiz",
        //     course: cid,
        //     dueDt: "",
        //     dueTime: "11:59pm",
        //     points: 100,
        //     qns: 15
        // };
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
                    <Container>
                        <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-quiz"
                            onClick={() => addQuiz()}>
                            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
                            Quiz
                        </Button>
                    </Container>
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
                                <ListGroup.Item className="wd-assignment-list-item p-3 ps-1 position-relative">
                                    <div className="d-block justify-content-between">
                                        <IoRocketOutline style={{ color: "green" }} className="mt-1" />
                                        {currentUser.role === "FACULTY" && <a href={`#/Kambaz/Courses/${cid}/Quizzes/${quiz._id}`}
                                            className="wd-assignment-link" >
                                            {quiz.title} <br />
                                        </a>}
                                        {currentUser.role !== "FACULTY" && <span className="wd-assignment-link" >
                                            {quiz.title} <br />
                                        </span>}
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

