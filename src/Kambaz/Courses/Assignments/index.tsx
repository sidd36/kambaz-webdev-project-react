import { Button, FormControl, FormGroup, InputGroup, ListGroup } from "react-bootstrap";
import { BsGripVertical } from "react-icons/bs";
import { FaPlus, FaTrash } from "react-icons/fa6";
import { HiMagnifyingGlass } from "react-icons/hi2";
import LessonControlButtons from "../Modules/LessonControlButtons";
import { IoEllipsisVertical } from "react-icons/io5";
import { MdEditDocument } from "react-icons/md";
import { useNavigate, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { deleteAssignment, setAssignments, setTempAssignment } from "./reducer";
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import * as assignmentClient from "./client";
import { useEffect } from "react";

export default function Assignments() {
  const { cid } = useParams();
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const { assignments } = useSelector((state: any) => state.assignmentsReducer);
  const dispatch = useDispatch();
  let assgns = assignments.filter((a: any) => a.course === cid);
  const navigate = useNavigate();

  const createAssignment = () => {
    const tempAssignment = {
      _id: "A" + Math.floor(Math.random() * (999 - 100 + 1) + 100),
      title: "New Assignment",
      course: cid,
      availableDt: "",
      availableTime: "12:00am",
      dueDt: "",
      dueTime: "11:59pm",
      untilDt: "",
      untilTime: "11:59pm",
      points: 100,
      desc: "New Assignment Description"
    };
    dispatch(setTempAssignment(tempAssignment));
    navigate(`/Kambaz/Courses/${cid}/Assignments/${tempAssignment._id}`);
  }

  const deleteAssgn = async(id: string) => {
    await assignmentClient.deleteAssignment(id);
    dispatch(deleteAssignment(id));
  }

  const fetchAssignments = async () => {
    const assignments = await assignmentClient.fetchAllAssignments();
    dispatch(setAssignments(assignments));
  };

  useEffect(() => {
    fetchAssignments();
  }, [])

  useEffect(() => {
    assgns = assignments.filter((a: any) => a.course === cid);
  }, [assignments])

  return (
    <div id="wd-assignments">
      <div style={{ display: "flex" }}>
        <FormGroup className="w-50" controlId="wd-assignment-search">
          <InputGroup style={{ width: "fit-content" }}>
            <InputGroup.Text> <HiMagnifyingGlass /> </InputGroup.Text>
            <FormControl type="text" placeholder="Search..." />
          </InputGroup>
        </FormGroup>
      </div>
      <div style={{ marginTop: "-37px" }}>
        {currentUser.role === "FACULTY" &&
          <Button variant="danger" size="lg" className="me-1 float-end" id="wd-add-assignment"
            onClick={() => createAssignment()}>
            <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
            Assignment
          </Button>
        }
        <Button variant="secondary" size="lg" className="me-1 float-end" id="wd-add-assignment-group">
          <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} />
          Group
        </Button>
      </div>
      <br /><br /><br /><br />
      <ListGroup className="rounded-0">
        <ListGroup.Item className="p-0 mb-5 fs-5 border-gray">
          <div id="wd-assignments-title" className="p-3 ps-2 bg-secondary">
            <BsGripVertical className="me-2 fs-3" /> ASSIGNMENTS
            <div className="float-end">
              <span className="wd-assignment-weight"><span className="wd-assignment-weight-val">40% of Total</span> <FaPlus className="position-relative me-2" style={{ bottom: "1px" }} /></span><IoEllipsisVertical className="fs-4" />
            </div>
          </div>
          <ListGroup className="wd-assignment-list rounded-0">
            {
              assgns.map((assgn: any) => (
                <ListGroup.Item className="wd-assignment-list-item p-3 ps-1">
                  <BsGripVertical className="me-2 fs-3" />
                  <MdEditDocument style={{ color: "green" }} />
                  {currentUser.role === "FACULTY" && <a href={`#/Kambaz/Courses/${cid}/Assignments/${assgn._id}`}
                    className="wd-assignment-link" >
                    {assgn._id} - {assgn.title} <br />
                  </a>}
                  {currentUser.role !== "FACULTY" && <span className="wd-assignment-link" >
                    {assgn._id} - {assgn.title} <br />
                  </span>}
                  <LessonControlButtons />
                  {currentUser.role === "FACULTY" &&
                    <FaTrash className="text-danger me-2 mt-2 float-end" data-bs-toggle="modal" data-bs-target={`#wd-delete-assgn-dialog-${assgn._id}`} />}
                    <ConfirmationPopup title={assgn.title} id={assgn._id}></ConfirmationPopup>
                  <div className="wd-assignment-modules">
                    <span className="wd-assignment-modules-red">Multiple Modules</span> | <b>Not available until</b> {assgn.availableDt} at {assgn.availableTime} | <br />
                    <b>Due</b> {assgn.dueDt} at {assgn.dueTime} | {assgn.points} pts
                  </div>
                </ListGroup.Item>
              ))
            }
          </ListGroup>
        </ListGroup.Item>
      </ListGroup>
    </div>
  );

  function ConfirmationPopup({title, id}: {title: string, id: string}) {
    return (
        <div id={`wd-delete-assgn-dialog-${id}`} className="modal fade" data-bs-backdrop="static" data-bs-keyboard="false">
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h1 className="modal-title fs-5" id="staticBackdropLabel">
                            Delete Assignment? </h1>
                        <button type="button" className="btn-close" data-bs-dismiss="modal"></button>
                    </div>
                    <div className="modal-body">
                            Are you sure you want to delete - <b><i>{title}</i></b> ?
                    </div>
                    <div className="modal-footer">
                        <button type="button" className="btn btn-secondary" data-bs-dismiss="modal">
                            Cancel </button>
                        <button onClick={() => deleteAssgn(id)} type="button" data-bs-dismiss="modal" className="btn btn-danger">
                            Yes </button>
                    </div>
                </div>
            </div>
        </div>
    );
  }
}

