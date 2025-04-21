import { Navigate, Route, Routes, useParams, useLocation } from "react-router-dom";
import CourseNavigation from "./Navigation";
import Modules from "./Modules";
import Home from "./Home";
import Assignments from "./Assignments";
import AssignmentEditor from "./Assignments/Editor";
import { FaAlignJustify } from "react-icons/fa";
import PeopleTable from "./People/Table";
import { findUsersForCourse } from "./client";
import { useEffect, useState } from "react";
import Quizzes from "./Quizzes";
import QuizDetails from "./Quizzes/quizDetails";
import Questions from "./Quizzes/Questions";
import QuestionEditor from "./Quizzes/Questions/editor";
import QuizEditor from "./Quizzes/quizEditor";
import QuizAnswers from "./Quizzes/QuizAnswers";
import QuizResponses from "./Quizzes/QuizResponses";
// import * as userClient from "../Account/client";
import { useSelector } from "react-redux";

export default function Courses({ co }: { co: any[]; }) {
  const { pathname } = useLocation();
  const { cid } = useParams();
  const { courses } = useSelector((state: any) => state.coursesReducer);
  const [users, setUsers] = useState<any[]>([]);
  const course = courses.find((course: { _id: string | undefined; }) => course._id === cid);
  const getCourseUsers = async (courseId: string) => {
    const users = await findUsersForCourse(courseId);
    setUsers([...users]);
  };
  console.log(co)
  useEffect(() => {
    getCourseUsers(course._id);
  }, [course])
  return (
    <div id="wd-courses">
      <h2 className="text-danger">
        <FaAlignJustify className="me-4 fs-4 mb-1" />
        {course && course.name}  &gt; {pathname.split("/")[4]} </h2> <hr />
      <div className="d-flex">
        <div className="d-none d-md-block">
          <CourseNavigation />
        </div>
        <div className="flex-fill">
          <Routes>
            <Route path="/" element={<Navigate to="Home" />} />
            <Route path="Home" element={<Home />} />
            <Route path="Modules" element={<Modules />} />
            <Route path="Assignments" element={<Assignments />} />
            <Route path="Assignments/:aid" element={<AssignmentEditor />} />
            <Route path="People" element={<PeopleTable users={users}/>} />
            <Route path="Quizzes" element={<Quizzes />} />
            <Route path="Quizzes/:qid" element={<QuizDetails />} />
            <Route path="Quizzes/:qid/edit" element={<QuizEditor />} />
            <Route path="Quizzes/:quiz_id/Questions" element={<Questions />} />
            <Route path="Quizzes/:quiz_id/QuestionsAnswers" element={<QuizAnswers />} />
            <Route path="Quizzes/:quiz_id/QuestionEditor/:question_id" element={<QuestionEditor />} />
            <Route path="Quizzes/:quiz_id/responses" element={<QuizResponses />} />
          </Routes>
        </div></div>
    </div>

  );
}
