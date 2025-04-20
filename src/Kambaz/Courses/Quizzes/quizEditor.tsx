import { useEffect, useState } from "react";
import { Col, Container, FormCheck, FormControl, FormGroup, FormLabel, FormSelect, Row, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { Link, useNavigate, useParams } from "react-router";
import * as quizClient from "./client";
import { updateQuiz } from "./reducer";

export default function QuizEditor() {
    const { qid } = useParams();
    const { cid } = useParams();
    const { quizzes } = useSelector((state: any) => state.quizzesReducer);
    const [quiz, setQuiz] = useState<any>({});
    const [key, setKey] = useState("details");
    const dispatch = useDispatch();
    const navigate = useNavigate();

    useEffect(() => {
        setQuiz(quizzes.find((q: any) => q._id === qid));
    }, [qid]);

    useEffect(() => {
        if (key === "questions") {
            navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz._id}/Questions`);
        }
    }, [key]);

    const save = async (publish: boolean) => {
        const newQuiz = publish ? { ...quiz, published: true } : quiz;
        setQuiz(newQuiz);
        await quizClient.updateQuiz(newQuiz);
        dispatch(updateQuiz(quiz));
    }

    return (
        <Container id="wd-quizzes-editor">
            <Tabs
                id="quiz-tabs"
                activeKey={key}
                onSelect={(k) => setKey(k || "details")}
                className="mb-3 border-bottom"
                variant="tabs"
            >
                <Tab eventKey="details" title={<span className={`${key === 'details' ? 'text-body' : 'text-danger'}`}>Details</span>}>
                    <FormGroup className="mb-3" controlId="wd-quiz-title">
                        <FormLabel>Title</FormLabel>
                        <FormControl type="text" defaultValue={quiz.title}
                            onChange={(e) => setQuiz({ ...quiz, title: e.target.value })} />
                    </FormGroup>
                    <FormGroup className="mb-3" controlId="wd-quiz-description">
                        <FormControl as="textarea" style={{ height: "120px" }}
                            defaultValue={quiz.desc}
                            onChange={(e) => setQuiz({ ...quiz, desc: e.target.value })} />
                    </FormGroup>
                    <Container>
                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Quiz Type</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <FormSelect
                                    value={quiz.type}
                                    style={{ maxWidth: "250px" }}
                                    onChange={(e) => setQuiz({ ...quiz, type: e.target.value })}
                                >
                                    <option>Graded Quiz</option>
                                    <option>Practice Quiz</option>
                                    <option>Graded Survey</option>
                                    <option>Ungraded Survey</option>
                                </FormSelect>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Points</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <FormControl
                                    type="number"
                                    value={quiz.points}
                                    onChange={(e) => setQuiz({ ...quiz, points: e.target.value })}
                                    style={{ maxWidth: "100px" }}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0" htmlFor="wd-assgn-group">Assignment Group</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <FormSelect
                                    id="wd-assgn-group"
                                    value={quiz.assignmentGroup}
                                    onChange={(e) => setQuiz({ ...quiz, assignmentGroup: e.target.value })}
                                    style={{ maxWidth: "250px" }}
                                >
                                    <option value="Quizzes">Quizzes</option>
                                    <option value="Exams">Exams</option>
                                    <option value="Assignments">Assignments</option>
                                    <option value="Project">Project</option>
                                </FormSelect>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Shuffle Answers</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <div className="d-flex gap-4">
                                    <FormCheck
                                        type="radio"
                                        label="Yes"
                                        name="shuffleAns"
                                        id="shuffle-yes"
                                        checked={quiz.shuffleAns === true}
                                        onChange={() => setQuiz({ ...quiz, shuffleAns: true })}
                                    />
                                    <FormCheck
                                        type="radio"
                                        label="No"
                                        name="shuffleAns"
                                        id="shuffle-no"
                                        checked={quiz.shuffleAns === false}
                                        onChange={() => setQuiz({ ...quiz, shuffleAns: false })}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Time Limit</FormLabel>
                            </Col>
                            <Col xs={2}>
                                <FormControl
                                    type="number"
                                    value={quiz.timeLimit}
                                    onChange={(e) => setQuiz({ ...quiz, timeLimit: e.target.value })}
                                    style={{ maxWidth: "100px" }}
                                />
                            </Col>
                            <Col xs={2}>
                                <FormLabel className="mb-0">Minutes</FormLabel>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Multiple Attempts</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <div className="d-flex gap-4">
                                    <FormCheck
                                        type="radio"
                                        label="Yes"
                                        name="multipleAttempts"
                                        id="multipleAttempts-yes"
                                        checked={quiz.multipleAttempts === true}
                                        onChange={() => setQuiz({ ...quiz, multipleAttempts: true })}
                                    />
                                    <FormCheck
                                        type="radio"
                                        label="No"
                                        name="multipleAttempts"
                                        id="multipleAttempts-no"
                                        checked={quiz.multipleAttempts === false}
                                        onChange={() => setQuiz({ ...quiz, multipleAttempts: false })}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Show Correct Answers</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <FormControl
                                    type="text"
                                    value={quiz.showCorrectAns}
                                    onChange={(e) => setQuiz({ ...quiz, showCorrectAns: e.target.value })}
                                    style={{ maxWidth: "150px" }}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Access Code</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <FormControl
                                    type="text"
                                    value={quiz.accessCode}
                                    onChange={(e) => setQuiz({ ...quiz, accessCode: e.target.value })}
                                    style={{ maxWidth: "150px" }}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">One Question at a Time</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <div className="d-flex gap-4">
                                    <FormCheck
                                        type="radio"
                                        label="Yes"
                                        name="oneQn"
                                        id="oneQn-yes"
                                        checked={quiz.oneQn === true}
                                        onChange={() => setQuiz({ ...quiz, oneQn: true })}
                                    />
                                    <FormCheck
                                        type="radio"
                                        label="No"
                                        name="oneQn"
                                        id="oneQn-no"
                                        checked={quiz.oneQn === false}
                                        onChange={() => setQuiz({ ...quiz, oneQn: false })}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Webcam Required</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <div className="d-flex gap-4">
                                    <FormCheck
                                        type="radio"
                                        label="Yes"
                                        name="webcam"
                                        id="webcam-yes"
                                        checked={quiz.webcam === true}
                                        onChange={() => setQuiz({ ...quiz, webcam: true })}
                                    />
                                    <FormCheck
                                        type="radio"
                                        label="No"
                                        name="webcam"
                                        id="webcam-no"
                                        checked={quiz.webcam === false}
                                        onChange={() => setQuiz({ ...quiz, webcam: false })}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Lock Questions After Answering</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <div className="d-flex gap-4">
                                    <FormCheck
                                        type="radio"
                                        label="Yes"
                                        name="lockQns"
                                        id="lockQns-yes"
                                        checked={quiz.lockQns === true}
                                        onChange={() => setQuiz({ ...quiz, lockQns: true })}
                                    />
                                    <FormCheck
                                        type="radio"
                                        label="No"
                                        name="lockQns"
                                        id="lockQns-no"
                                        checked={quiz.lockQns === false}
                                        onChange={() => setQuiz({ ...quiz, lockQns: false })}
                                    />
                                </div>
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Due Date</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <FormControl
                                    type="date"
                                    defaultValue={convertDate(quiz.dueDt)}
                                    onChange={(e) => setQuiz({ ...quiz, dueDt: e.target.value })}
                                    style={{ maxWidth: "150px" }}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Available Date</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <FormControl
                                    type="date"
                                    defaultValue={convertDate(quiz.availableDt)}
                                    onChange={(e) => setQuiz({ ...quiz, availableDt: e.target.value })}
                                    style={{ maxWidth: "150px" }}
                                />
                            </Col>
                        </Row>

                        <Row className="mb-3 align-items-center">
                            <Col xs={4} className="text-end">
                                <FormLabel className="mb-0">Until Date</FormLabel>
                            </Col>
                            <Col xs={8}>
                                <FormControl
                                    type="date"
                                    defaultValue={convertDate(quiz.untilDt)}
                                    onChange={(e) => setQuiz({ ...quiz, untilDt: e.target.value })}
                                    style={{ maxWidth: "150px" }}
                                />
                            </Col>
                        </Row>
                    </Container>
                    <hr />
                    <div style={{ display: 'flex', justifyContent: 'end' }} className="gap-2">
                        <Link key={"cancel"} to={`/Kambaz/Courses/${cid}/Quizzes`} className="btn btn-secondary">Cancel</Link>
                        <Link key={"save"} onClick={() => save(false)} to={`/Kambaz/Courses/${cid}/Quizzes/${qid}`} className="btn btn-danger">Save</Link>
                        <Link key={"save"} onClick={() => save(true)} to={`/Kambaz/Courses/${cid}/Quizzes`} className="btn btn-danger">Save & Publish</Link>
                    </div>
                </Tab>
                <Tab eventKey="questions" title={<span className={`${key === 'details' ? 'text-danger' : 'text-body'}`}>Questions</span>}></Tab>
            </Tabs>
        </Container>
    );

    function convertDate(dateString: string | undefined) {
        if (dateString) {
            const date = new Date(dateString);
            return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
        }
    }
}