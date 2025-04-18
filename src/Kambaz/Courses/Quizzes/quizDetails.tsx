import { useEffect, useState } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import { FaPencil } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { useParams } from "react-router";

export default function QuizDetails() {
    const { qid } = useParams();
    const { cid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const [quiz, setQuiz] = useState<any>({});

    useEffect(() => {
        setQuiz(quizzes.find((q: any) => q._id === qid));
    }, [qid])
    return (
        <Container id="wd-quizzes-details">
            <div className="d-flex justify-content-center gap-2">
                <Button className="btn-secondary">Preview</Button>
                <Button className="btn-secondary">
                    <FaPencil className="text-secondary me-2" />Edit</Button>
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
            </div>
        </Container>
    )
}