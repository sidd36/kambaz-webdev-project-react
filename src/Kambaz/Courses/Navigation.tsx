import { Link, useLocation, useParams } from "react-router-dom";
import { useDispatch } from "react-redux";
import { setTempAssignment } from "./Assignments/reducer";
export default function CourseNavigation() {
  const links = ["Home", "Modules", "Piazza", "Zoom", "Assignments", "Quizzes", "Grades", "People"];
  const { pathname } = useLocation();
  const { cid } = useParams();
  const dispatch = useDispatch();
  return (
    <div id="wd-courses-navigation" className="wd list-group fs-5 rounded-0">
      {
        links.map(link => (
          <Link key={link} onClick={() => dispatch(setTempAssignment(null))} to={`/Kambaz/Courses/${cid}/${link}`} id={`wd-course-${link.toLowerCase()}-link`}
            className={`list-group-item border border-0 ${pathname.includes(link) ? "active" : "text-danger"}`}>
            {link}
          </Link>
        ))
      }
      <br />
    </div>
  );
}
