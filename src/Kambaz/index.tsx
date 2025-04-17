import { Navigate, Route, Routes } from "react-router-dom";
import Account from "./Account";
import Dashboard from "./Dashboard/Dashboard";
import KambazNavigation from "./Navigation";
import Courses from "./Courses";
import "./styles.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import ProtectedRoute from "./Account/ProtectedRoute";
import { useSelector, useDispatch } from "react-redux";
import { enroll } from "./Dashboard/reducer";
import Session from "./Account/Session";
import * as userClient from "./Account/client";
import * as courseClient from "./Courses/client";

export default function Kambaz() {
  const [allCourses, setAllCourses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const fetchCourses = async () => {
    try {
      const allCourses = await courseClient.fetchAllCourses();
      const courses = await userClient.findMyCourses();
      setCourses(courses);
      setAllCourses(allCourses);
    } catch (error) {
      console.error(error);
    }
  };
  useEffect(() => {
    fetchCourses();
  }, [currentUser]);

  const [course, setCourse] = useState<any>({
    _id: "1234", name: "New Course", number: "New Number", img: "/images/no_img.jpeg",
    startDate: "2023-09-10", endDate: "2023-12-15", description: "New Description",
  });
  const dispatch = useDispatch();
  const addNewCourse = async () => {
    const newCourse = await courseClient.createCourse(course);
    setCourses([...courses, newCourse ]);
    dispatch(enroll({ _id: uuidv4(), user: currentUser._id, course: newCourse._id }));
  };
  const addCourse = (newCourse: any) => {
    setCourses([...courses, newCourse ]);
  }
  const removeCourse = (courseId: any) => {
    setCourses(courses.filter((course) => course._id !== courseId));
  }
  const deleteCourse = async (courseId: any) => {
    await courseClient.deleteCourse(courseId);
    setCourses(courses.filter((course) => course._id !== courseId));
  };
  const updateCourse = async () => {
    await courseClient.updateCourse(course);
    setCourses(
      courses.map((c) => {
        if (c._id === course._id) {
          return course;
        } else {
          return c;
        }
      })
    );
  };

  return (
    <Session>
      <div id="wd-kambaz">
        <KambazNavigation />
        <div className="wd-main-content-offset p-3">
          <Routes>
            <Route path="/" element={<Navigate to="/Kambaz/Dashboard" />} />
            <Route path="/Account/*" element={<Account />} />
            <Route path="/Dashboard" element={<ProtectedRoute><Dashboard
              courses={courses}
              allCourses={allCourses}
              course={course}
              setCourse={setCourse}
              addNewCourse={addNewCourse}
              deleteCourse={deleteCourse}
              updateCourse={updateCourse}
              addCourse={addCourse}
              removeCourse={removeCourse} /></ProtectedRoute>} />
            <Route path="/Courses/:cid/*" element={<ProtectedRoute><Courses courses={courses} /></ProtectedRoute>} />
            <Route path="/Calendar" element={<h1>Calendar</h1>} />
            <Route path="/Inbox" element={<h1>Inbox</h1>} />
          </Routes>
        </div>
      </div>
    </Session>
  );
}
