import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { Link, useParams } from "react-router";

export default function QuizDetails() {
    const { qid } = useParams();
    const { cid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const [quiz, setQuiz] = useState<any>({});

    useEffect(() => {
        setQuiz(quizzes.find((q: any) => q._id === qid));
    }, [quizzes])
    return (
        <Container id="wd-quizzes-details">
            <div className="d-flex justify-content-center gap-2">
                <Button className="btn-secondary">
                    <Link to={{ pathname: `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/QuestionsAnswers` }} className="text-dark text-decoration-none">
                        Preview</Link></Button>
                <Button className="btn-secondary">
                    <Link to={{ pathname: `/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/edit` }} className="text-dark text-decoration-none">
                        <FaPencil className="text-secondary me-2" />Edit</Link></Button>
            </div>
            <br />
            <div className="quiz-details">
                <h3>{quiz.title}</h3>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Quiz Type</b></Col>
                    <Col xs={6}>{quiz.type}</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Points</b></Col>
                    <Col xs={6}>{quiz.points}</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Assignment Group</b></Col>
                    <Col xs={6}>{quiz.assignmentGroup}</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Shuffle Answers</b></Col>
                    <Col xs={6}>{quiz.shuffleAns ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Time Limit</b></Col>
                    <Col xs={6}>{quiz.timeLimit} Minutes</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Multiple Attempts</b></Col>
                    <Col xs={6}>{quiz.multipleAttempts ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Show Correct Answers</b></Col>
                    <Col xs={6}>{quiz.showCorrectAns}</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>One Question at a Time</b></Col>
                    <Col xs={6}>{quiz.oneQn ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Webcam Required</b></Col>
                    <Col xs={6}>{quiz.webcam ? "Yes" : "No"}</Col>
                </Row>

                <Row className="mb-2">
                    <Col xs={6} className="text-end"><b>Lock Questions After Answering</b></Col>
                    <Col xs={6}>{quiz.lockQns ? "Yes" : "No"}</Col>
                </Row>
                <br/>
                <Row>
                    <Col xs={4}>Due</Col>
                    <Col xs={4}>Available from</Col>
                    <Col xs={4}>Until</Col>
                </Row>
                <hr />
                <Row>
                    <Col xs={4}>{quiz.dueDt} at {quiz.dueTime}</Col>
                    <Col xs={4}>{quiz.availableDt} at {quiz.availableTime}</Col>
                    <Col xs={4}>{quiz.untilDt} at {quiz.untilTime}</Col>
                </Row>
            </div>
        </Container>
    )
}