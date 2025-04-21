import { useEffect, useState } from "react";
import { Button, Card, Form, Tab, Tabs } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../Questions/reducer";
import * as quizClient from "../client";
import { useNavigate, useParams } from "react-router-dom";

export default function QuizAnswers() {
  const { quiz_id, cid } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { questions } = useSelector((state: any) => state.questionsReducer);
  const { quizzes } = useSelector((state: any) => state.quizzesReducer);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [quizSavedAt, setQuizSavedAt] = useState("");
  const [key, setKey] = useState("preview");
  const [attempts, setAttempt] = useState(0);
  const [quiz, setQuiz] = useState<any>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await quizClient.findQuestionsForQuiz(quiz_id as string);
      dispatch(setQuestions(fetchedQuestions));
    };

    const fetchQuizResponse = async () => {
      const res = await quizClient.getQuizResponseByQuizAndUser(quiz_id, currentUser._id);
      setAttempt(res.attempts);
    };

    const currentQuiz = quizzes.find((q: { _id: string | undefined }) => q._id === quiz_id);
    setQuiz(currentQuiz);
    setQuizSavedAt(new Date().toUTCString());
    fetchQuestions();
    fetchQuizResponse();
  }, [quiz_id, quizzes]);

  useEffect(() => {
    if (quiz && attempts >= quiz.noOfAttempts) {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz_id}/responses`);
    }
  }, [quiz, attempts, quiz_id, cid, navigate]);

  useEffect(() => {
    if (key === "previousAttempt") {
      navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz_id}/responses`);
    }
  }, [key]);

  const handleOptionChange = (questionId: string, value: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = async () => {
    const keys = Object.keys(selectedAnswers);
    const answers = keys.map((question_id) => ({
      question_id,
      selected_option: selectedAnswers[question_id],
    }));

    const quiz_response = {
      quiz_id,
      user_id: currentUser._id,
      answers,
    };

    await quizClient.saveQuizResponse(quiz_response);
    navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz_id}/responses`);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (quiz && attempts >= quiz.noOfAttempts) {
    return null; // already redirected
  }

  if (!currentQuestion) {
    return <div className="container mt-4">Loading Question...</div>;
  }

  return (
    <Tabs
      id="preview-tabs"
      activeKey={key}
      onSelect={(k) => setKey(k || "preview")}
      className="mb-3 border-bottom"
      variant="tabs"
    >
      {((attempts < quiz?.noOfAttempts) || currentUser.role === "FACULTY") &&  (
        <Tab
          eventKey="preview"
          title={
            <span className={`${key === "preview" ? "text-body" : "text-danger"}`}>
              {currentUser.role === "FACULTY" ? "Preview" : "Current Attempt"}
            </span>
          }
        >
          <div className="container mt-4">
            <h4><strong>Q{currentQuestionIndex + 1} - {currentQuestion.title}</strong></h4>
            {currentUser.role === "FACULTY" && <div className="alert alert-danger py-1 px-2">
              <small>This is a preview of the quiz</small>
            </div>}

            <h3 className="fw-bold">Quiz Instructions</h3>
            <hr className="mb-3 mt-0" />

            <Card className="mb-3 mt-4">
              <Card.Header>
                <div className="d-flex justify-content-between m-1">
                  <div><strong>Question {currentQuestionIndex + 1}</strong></div>
                  <div>{currentQuestion.points} pts</div>
                </div>
              </Card.Header>
              <Card.Body>
                <div className="mb-3" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

                <hr />
                <Form>
                  {currentQuestion.type === "multiple_choice" && currentQuestion.multiple_choices.map((choice: any, index: number) => (
                    <Form.Check
                      key={index}
                      type="radio"
                      id={`q-${currentQuestion._id}-opt-${index}`}
                      label={choice.text}
                      value={choice.text}
                      name={`q-${currentQuestion._id}`}
                      checked={selectedAnswers[currentQuestion._id] === choice.text}
                      onChange={() => handleOptionChange(currentQuestion._id, choice.text)}
                      className="mb-2"
                    />
                  ))}
                  {currentQuestion.type === "true_false" && (
                    <>
                      <Form.Check
                        key="True"
                        type="radio"
                        id={`q-${currentQuestion._id}-option-true`}
                        label="True"
                        value="True"
                        name={`q-${currentQuestion._id}`}
                        checked={selectedAnswers[currentQuestion._id] === "True"}
                        onChange={() => handleOptionChange(currentQuestion._id, "True")}
                        className="mb-2"
                      />
                      <Form.Check
                        key="False"
                        type="radio"
                        id={`q-${currentQuestion._id}-option-false`}
                        label="False"
                        value="False"
                        name={`q-${currentQuestion._id}`}
                        checked={selectedAnswers[currentQuestion._id] === "False"}
                        onChange={() => handleOptionChange(currentQuestion._id, "False")}
                        className="mb-2"
                      />
                    </>
                  )}
                  {currentQuestion.type === "fill_the_blank" && (
                    <Form.Group controlId={`fill-blank-${currentQuestion._id}`} className="mb-3">
                      <Form.Control
                        type="text"
                        placeholder="Enter your answer here"
                        value={selectedAnswers[currentQuestion._id] || ""}
                        onChange={(e) =>
                          handleOptionChange(currentQuestion._id, e.target.value)
                        }
                      />
                    </Form.Group>
                  )}
                </Form>
              </Card.Body>
            </Card>

            <div className="d-flex justify-content-end mt-3">
              {currentQuestionIndex < questions.length - 1 && (
                <Button variant="light" onClick={handleNext}>Next ▸</Button>
              )}
            </div>
            <Card className="mt-4">
              <Card.Body>
                <div className="d-flex justify-content-between align-items-center">
                  <div className="text-muted">Quiz saved on {quizSavedAt}</div>
                  <div className="d-flex justify-content-end">
                    <Button variant="primary" onClick={handleSubmit}>Submit Quiz</Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </div>
        </Tab>
      )}
      <Tab
        eventKey="previousAttempt"
        disabled={attempts === 0}
        title={
          <span className={`${key === "preview" ? "text-danger" : "text-body"}`}>
            Previous Attempt
          </span>
        }
      ></Tab>
    </Tabs>
  );
}
