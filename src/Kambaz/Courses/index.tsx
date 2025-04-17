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

export default function Courses({ courses }: { courses: any[]; }) {
  const { pathname } = useLocation();
  const { cid } = useParams();
  const [users, setUsers] = useState<any[]>([]);
  const course = courses.find((course) => course._id === cid);
  const getCourseUsers = async (courseId: string) => {
    const users = await findUsersForCourse(courseId);
    setUsers([...users]);
  };
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
          </Routes>
        </div></div>
    </div>

  );
}
