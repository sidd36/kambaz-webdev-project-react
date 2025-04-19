import { useEffect, useState } from "react";
import { Button, Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../Questions/reducer";
import * as quizClient from "../client";
import { useParams } from "react-router-dom";

export default function QuizAnswers() {
  const { quiz_id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { questions } = useSelector((state: any) => state.questionsReducer);

  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [quizSavedAt, setQuizSavedAt] = useState("");

  useEffect(() => {
    const fetchQuestions = async () => {
      const fetchedQuestions = await quizClient.findQuestionsForQuiz(quiz_id as string);
      dispatch(setQuestions(fetchedQuestions));
    };
    fetchQuestions();
  }, [quiz_id]);

  const handleOptionChange = (questionId: string, value: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: value });
  };

  const handleNext = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handleSubmit = () => {
    console.log("Submitted Answers:", selectedAnswers);
  };

  const currentQuestion = questions[currentQuestionIndex];

  if (!currentQuestion) {
    return <div className="container mt-4">Loading Question...</div>;
  }

  return (
    <div className="container mt-4">
      <h4><strong>Q{currentQuestionIndex + 1} - {currentQuestion.title}</strong></h4>
      {currentUser.role === "FACULTY" &&<div className="alert alert-danger py-1 px-2">
        <small>This is a preview of the quiz</small>
      </div>}

      <h3 className="fw-bold">Quiz Instructions</h3>
      <hr className="mb-3 mt-0"/>

      <Card className="mb-3 mt-4">
        <Card.Header><div className="d-flex justify-content-between m-1">
            <div><strong>Question {currentQuestionIndex + 1}</strong></div>
            <div>{currentQuestion.points} pts</div>
          </div></Card.Header>
        <Card.Body>
          <div className="mb-3" dangerouslySetInnerHTML={{ __html: currentQuestion.question }} />

          <hr></hr>
          <Form>
            {currentQuestion.type == "multiple_choice" && <>{currentQuestion.multiple_choices.map((choice: any, index: number) => (
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
            ))}</>}
            {currentQuestion.type == "true_false" && <>
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
            </>}
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
        {currentQuestionIndex < questions.length - 1 && <Button variant="light" onClick={handleNext}>Next ▸</Button>}
      </div>
      <Card className="mt-4">
        <Card.Body>
        <div className="d-flex justify-content-between align-items-center">
        <div className="text-muted">Quiz saved at {quizSavedAt}</div>
        <div className="d-flex justify-content-end">
          <Button variant="primary" onClick={handleSubmit}>Submit Quiz</Button>
        </div>
        </div>
        </Card.Body>
      </Card>
    </div>
  );
}
