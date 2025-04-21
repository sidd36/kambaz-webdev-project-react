import { Button, Form, InputGroup } from "react-bootstrap";
import { Link, useNavigate, useParams } from "react-router";
import { Editor } from "@tinymce/tinymce-react";
import { useSelector, useDispatch } from "react-redux";
import { useEffect, useRef, useState } from "react";
import { addQuestion, setTempQuestion, updateQuestion } from "./reducer";
import * as questionClient from "./client";
import * as quizClient from "../client";
import { FaTrash } from "react-icons/fa";


export default function QuestionEditor() {
    const { cid, quiz_id } = useParams();
    const { question_id } = useParams();
    const { questions, tempQuestion } = useSelector((state: any) => state.questionsReducer);
    const question = questions.filter((ques: any) => ques._id === question_id)
    console.log(question)
    let [edit_question, setQuestion] = useState<any>(question.length === 0 ? {multiple_choices: [], answer_blanks: [], question: ""} : question[0]);

    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate()
    useEffect(() => {
        if (tempQuestion != null) {
            setQuestion(tempQuestion);
        }
      }, [tempQuestion]);

    const save = async () => {
        if (edit_question.type == "multiple_choice"){
            const choices = edit_question.multiple_choices;

            if (!choices || choices.length === 0) {
                setError("Please add at least one possible answer.");
                return;
            }

            const hasCorrect = choices.some((c: any) => c.isCorrect);

            if (!hasCorrect) {
                setError("Please mark at least one answer as correct.");
                return;
            }

            setError(null);
        } else if (edit_question.type == "true_false") {
            if (edit_question.answer_boolean == null) {
                setError("Select atleast one answer between true and false.")
                return;
            }
            setError(null);
        }
        if (question.length !== 0) {
          await questionClient.updateQuestion(edit_question);
          dispatch(updateQuestion(edit_question));
        } else {
          dispatch(setTempQuestion(null));
          if (quiz_id) {
            await quizClient.createQuestionsForQuiz(quiz_id, edit_question);
          } else {
            console.error("quiz_id is undefined");
          }
          dispatch(addQuestion(edit_question));
        }
        navigate(`/Kambaz/Courses/${cid}/Quizzes/${quiz_id}/Questions`);
      }
      const dispatch = useDispatch();

      const setAnswer = (answer:boolean) => {
        setQuestion({ ...edit_question, answer_boolean: answer });
      }
      const handleChoiceChange = (index: number, newText: string) => {
        const updatedChoices = edit_question.multiple_choices.map((choice: any, i: number) =>
          i === index ? { ...choice, text: newText } : choice
        );
        setQuestion({ ...edit_question, multiple_choices: updatedChoices });
      };

      const addChoice = () => {
        const newChoice = { text: "", isCorrect: false };
        const updatedChoices = [...(edit_question.multiple_choices || []), newChoice];
        setQuestion({ ...edit_question, multiple_choices: updatedChoices });
      };
      const removeChoice = (index: number) => {
        const updatedChoices = edit_question.multiple_choices.filter((_: any, i: number) => i !== index);
        setQuestion({ ...edit_question, multiple_choices: updatedChoices });
      };

      const setCorrectIndex = (index: number) => {
        const updatedChoices = edit_question.multiple_choices.map((choice: any, i: number) => ({
          ...choice,
          isCorrect: i === index,
        }));
        setQuestion({ ...edit_question, multiple_choices: updatedChoices });
      };

      const handlePossibleAnswerChange = (index: number, newText: string) => {
        const updatedPossibleAnswers = edit_question.answer_blanks.map((possible_answer: any, i: number) =>
          i === index ? newText : possible_answer
        );
        setQuestion({ ...edit_question, answer_blanks: updatedPossibleAnswers });
      };

      const addPossibleAnswer = () => {
        const updatedPossibleAnswers = [...(edit_question.answer_blanks || []), ""];
        setQuestion({ ...edit_question, answer_blanks: updatedPossibleAnswers });
      };
      const removePossibleAnswer = (index: number) => {
        const updatedPossibleAnswers = edit_question.answer_blanks.filter((_: any, i: number) => i !== index);
        setQuestion({ ...edit_question, answer_blanks: updatedPossibleAnswers });
      };
      const editorRef = useRef(null);

  return (
    <div className="container mt-4">
        {error && (
            <div className="alert alert-danger" role="alert">
            {error}
            </div>
        )}
      <div className="mb-3 d-flex ">
        <Form.Label className="mt-2 me-2">Title</Form.Label>
        <Form.Control
          type="text"
          placeholder="Question Title"
          value={edit_question.title}
          onChange={(e) => setQuestion({ ...edit_question, title: e.target.value })}
          className="me-4"
          style={{ maxWidth: "300px" }}
        />
        <Form.Label className="mt-2 me-2">Question Type</Form.Label>
        <Form.Select
            value={edit_question.type || "multiple_choice"}
            onChange={(e) => setQuestion({ ...edit_question, type: e.target.value })}
            className="me-4"
            style={{ maxWidth: "300px" }}
            >
            <option value="multiple_choice">Multiple Choice</option>
            <option value="true_false">True / False</option>
            <option value="fill_the_blank">Fill in the Blank</option>
        </Form.Select>
        <Form.Label className="mt-2 me-2 ms-4">Points</Form.Label>
        <Form.Control
          type="number"
          placeholder="Points"
          value={edit_question.points}
          onChange={(e) => setQuestion({ ...edit_question, points: e.target.value })}
          style={{ maxWidth: "100px" }}
        />
      </div>

      <Form.Group className="mb-4">
        <Form.Label><h5>Question:</h5></Form.Label>
        <Editor
          apiKey={import.meta.env.VITE_REACT_APP_TINYMCE_API_KEY}
          onInit={(_evt: any, editor: any) => editorRef.current = editor}
          onEditorChange={(newValue: any) => setQuestion({ ...edit_question, question: newValue })}
          initialValue={edit_question.question?.replace(/dir="rtl"/g, '')}
          init={{
            height: 200,
            menubar: false,
            plugins: "lists link image preview",
            content_style: "body { direction: ltr !important; text-align: left !important; }",
            directionality: 'ltr',
            toolbar:
              "undo redo | formatselect | bold italic underline | \
               alignleft aligncenter alignright alignjustify | \
               bullist numlist outdent indent | removeformat | preview",
          }}
        />
      </Form.Group>

      <Form.Label><h5>Answers:</h5></Form.Label>
      {edit_question.type === "multiple_choice" && (
        <>
        {edit_question.multiple_choices.map((choice: any, index: any) => (
        <InputGroup className="mb-2" key={index}>
            <InputGroup.Radio
            checked={choice.isCorrect}
            onChange={() => setCorrectIndex(index)}
            />
            <Form.Control
            value={choice.text}
            onChange={(e) => handleChoiceChange(index, e.target.value)}
            placeholder={`Possible Answer ${index + 1}`}
            />
            <Button variant="outline-danger" onClick={() => removeChoice(index)}>
            <FaTrash />
            </Button>
            </InputGroup>
            ))}
            <br />
            <Button variant="info" onClick={addChoice}>+ Add Another Answer</Button>
        </>
        )}

        {edit_question.type === "true_false" && (
            <div className="mb-3">
                <Form.Check type="radio" id="true-answer" label="True" checked={edit_question.answer_boolean === true} onChange={() => setAnswer(true)} className="mb-2"
                />
                <Form.Check type="radio" id="false-answer" label="False" checked={edit_question.answer_boolean === false} onChange={() => setAnswer(false)}
                />
            </div>
        )}

        {edit_question.type === "fill_the_blank" && (
            <>
            {edit_question.answer_blanks.map((possible_answer: any, index: any) => (
            <InputGroup className="mb-2" key={index}>
                <Form.Control value={possible_answer} onChange={(e) => handlePossibleAnswerChange(index, e.target.value)}
                placeholder={`Possible Answer ${index + 1}`}
                />
                <Button variant="outline-danger" onClick={() => removePossibleAnswer(index)}>
                <FaTrash />
                </Button>
                </InputGroup>
                ))}
                <br />
                <Button variant="info" onClick={addPossibleAnswer}>+ Add Another Possible Answer</Button>
            </>
        )}

        <div style={{ display: 'flex', justifyContent: 'end' }}>
            <Link key={"cancel"} onClick={() => dispatch(setTempQuestion(null))} to={`/Kambaz/Courses/${cid}/Quizzes/${quiz_id}/Questions`} className="btn btn-secondary">Cancel</Link>
            <Button variant="danger" className="ms-3" onClick={save}>Save</Button>
        </div>
    </div>
  );
}