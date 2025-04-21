import { useEffect, useState } from "react";
import { Card, Form } from "react-bootstrap";
import { useDispatch, useSelector } from "react-redux";
import { setQuestions } from "../Questions/reducer";
import * as quizClient from "../client";
import { useParams } from "react-router-dom";

export default function QuizResponses() {
  const { quiz_id } = useParams();
  const dispatch = useDispatch();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { questions } = useSelector((state: any) => state.questionsReducer);

  const [selectedAnswers, setSelectedAnswers] = useState<{ [key: string]: string }>({});
  const [quizSavedAt, setQuizSavedAt] = useState("");
  const [correctAnswers, setCorrectAnswers] = useState<{ [key: string]: boolean }>({});
  const [score, setScore] = useState("0");
  useEffect(() => {
    const fetchData = async () => {
      // 1. Fetch Questions
      const fetchedQuestions = await quizClient.findQuestionsForQuiz(quiz_id as string);
      dispatch(setQuestions(fetchedQuestions));

      // 2. Fetch User's Quiz Response
      const userResponse = await quizClient.getQuizResponseByQuizAndUser(quiz_id, currentUser._id);
      console.log("quiz response = ", userResponse)
      if (userResponse) {
        const answerMap: { [key: string]: string } = {};
        const correctnessMap: { [key: string]: boolean } = {};
      
        userResponse.answers.forEach((ans: any) => {
          answerMap[ans.question_id] = ans.selected_option;
          correctnessMap[ans.question_id] = ans.is_correct;
        });
      
        setScore(userResponse.score)
        setSelectedAnswers(answerMap);
        setCorrectAnswers(correctnessMap);
        setQuizSavedAt(new Date(userResponse.submitted_on).toLocaleString());
      }
    };
    fetchData();
  }, [quiz_id, currentUser._id]);

  if (!questions.length) {
    return <div className="container mt-4">Loading Quiz Answers...</div>;
  }

  return (
    <div className="container mt-4">
      <div className="d-flex justify-content-between align-items-center">
        <h3 className="fw-bold mb-0">Quiz Responses</h3>
        <h5 className="fw-semibold text-primary mb-0">Score: {score}</h5>
      </div>
      <hr className="mb-3 mt-0" />

      {questions.map((q: any, index: number) => (
        <Card className="mb-4" key={q._id}>
          <Card.Header>
            <div className="d-flex justify-content-between">
              <strong>
                Q{index + 1} - {q.title}{" "}
                {q._id in correctAnswers && (
                  correctAnswers[q._id] ? (
                    <span className="text-success ms-2">✅</span>
                  ) : (
                    <span className="text-danger ms-2">❌</span>
                  )
                )}
              </strong>
              <span>{q.points} pts</span>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="mb-2" dangerouslySetInnerHTML={{ __html: q.question }} />
            <hr />

            <Form>
              {q.type === "multiple_choice" && (
                q.multiple_choices.map((choice: any, idx: number) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    label={choice.text}
                    value={choice.text}
                    name={`q-${q._id}`}
                    checked={selectedAnswers[q._id] === choice.text}
                    disabled
                    className="mb-2"
                  />
                ))
              )}

              {q.type === "true_false" && (
                ["True", "False"].map((val, idx) => (
                  <Form.Check
                    key={idx}
                    type="radio"
                    label={val}
                    value={val}
                    name={`q-${q._id}`}
                    checked={selectedAnswers[q._id] === val}
                    disabled
                    className="mb-2"
                  />
                ))
              )}

              {q.type === "fill_the_blank" && (
                <Form.Control
                  type="text"
                  value={selectedAnswers[q._id] || ""}
                  readOnly
                  className="mb-2"
                />
              )}
            </Form>
          </Card.Body>
        </Card>
      ))}


      <div className="text-muted text-end mt-4">Quiz submitted at: {quizSavedAt}</div>
    </div>
  );
}
