import { Col, Container, Form, FormControl, FormGroup, FormLabel, FormSelect, Row } from "react-bootstrap";
import { Link, useParams } from "react-router";
import { useSelector, useDispatch } from "react-redux";
import { addAssignment, setTempAssignment, updateAssignment } from "./reducer";
import { useEffect, useState } from "react";
import * as assignmentClient from "./client";

export default function AssignmentEditor() {
  const { aid } = useParams();
  const { cid } = useParams();
  const { assignments, tempAssignment } = useSelector((state: any) => state.assignmentsReducer);
  const assignment = assignments.filter((a: any) => a._id === aid)
  let [assgn, setAssignment] = useState<any>(assignment.length === 0 ? {} : assignment[0]);
  useEffect(() => {
    if (tempAssignment != null) {
      setAssignment(tempAssignment);
    }
  }, [tempAssignment]);
  const save = async () => {
    if (assignment.length !== 0) {
      await assignmentClient.updateAssignment(assgn);
      dispatch(updateAssignment(assgn));
    } else {
      dispatch(setTempAssignment(null));
      await assignmentClient.createAssignment(assgn);
      dispatch(addAssignment(assgn));
    }
  }
  const dispatch = useDispatch();
  return (
    <Container id="wd-assignments-editor">
      <FormGroup className="mb-3" controlId="wd-assignment-name">
        <FormLabel>Assignment Name</FormLabel>
        <FormControl type="text" defaultValue={assgn.title}
          onChange={(e) => setAssignment({ ...assgn, title: e.target.value })} />
      </FormGroup>
      <FormGroup className="mb-3" controlId="wd-assignment-description">
        <FormControl as="textarea" style={{ height: "120px" }}
          defaultValue={assgn.desc}
          onChange={(e) => setAssignment({ ...assgn, desc: e.target.value })} />
      </FormGroup>
      <Container>
        <Row>
          <Col>
            <FormGroup className="mb-3 d-flex align-items-center" controlId="wd-points">
              <FormLabel column sm={2} className="me-2 ms-5 mb-0" >Points</FormLabel>
              <FormControl type="text" defaultValue={assgn.points}
                onChange={(e) => setAssignment({ ...assgn, points: e.target.value })} />
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormGroup className="mb-3 d-flex flex-nowrap align-items-center" controlId="wd-group">
              <FormLabel column sm={2} className="me-2 ms-5 mb-0" style={{ whiteSpace: "nowrap" }}>Assignment Group</FormLabel>
              <FormSelect style={{ width: "auto" }}>
                <option selected>ASSIGNMENTS</option>
              </FormSelect>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormGroup className="mb-3 d-flex flex-nowrap align-items-center" controlId="wd-display-grade-as">
              <FormLabel column sm={2} className="me-2 ms-5 mb-0" style={{ whiteSpace: "nowrap" }}>Display Grade as</FormLabel>
              <FormSelect style={{ width: "auto" }}>
                <option selected>Percentage</option>
              </FormSelect>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormGroup className="mb-3 d-flex flex-nowrap" controlId="wd-submission-type">
              <FormLabel column sm={2} className="me-2 ms-5 mb-0" style={{ whiteSpace: "nowrap" }}>Submission Type</FormLabel>
              <div className="wd-assignment-editor-group">
                <FormSelect>
                  <option selected>Online</option>
                </FormSelect><br />
                <label style={{ fontWeight: "bold" }}>Online Entry Options</label><br />
                <Form.Check name="online-opts" id="wd-text-entry" label="Text Entry" />
                <Form.Check name="online-opts" id="wd-website-url" label="Website URL" />
                <Form.Check name="online-opts" id="wd-media-recordings" label="Media Recordings" />
                <Form.Check name="online-opts" id="wd-student-annotation" label="Student Annotation" />
                <Form.Check name="online-opts" id="wd-file-upload" label="File Uploads" />
              </div>
            </FormGroup>
          </Col>
        </Row>

        <Row>
          <Col>
            <FormGroup className="mb-3 d-flex flex-nowrap" controlId="wd-assign-to">
              <FormLabel column sm={2} className="me-2 ms-5 mb-0">Assign</FormLabel>
              <div className="wd-assignment-editor-group">
                <FormGroup className="mb-3" controlId="wd-assign-to">
                  <FormLabel>Assign to</FormLabel>
                  <FormControl type="text" value={"Everyone"} />
                </FormGroup>
                <FormGroup className="mb-3" controlId="wd-due-date">
                  <FormLabel>Due</FormLabel>
                  <FormControl type="date" defaultValue={convertDate(assgn.dueDt)}
                    onChange={(e) => setAssignment({ ...assgn, dueDt: e.target.value })} />
                </FormGroup>
                <Row>
                  <Col>
                    <FormGroup className="mb-3" controlId="wd-available-from">
                      <FormLabel>Available from</FormLabel>
                      <FormControl type="date" value={convertDate(assgn.availableDt)}
                        onChange={(e) => setAssignment({ ...assgn, availableDt: e.target.value })} />
                    </FormGroup>
                  </Col>
                  <Col>
                    <FormGroup className="mb-3" controlId="wd-available-until">
                      <FormLabel>Until</FormLabel>
                      <FormControl type="date" value={convertDate(assgn.untilDt)}
                        onChange={(e) => setAssignment({ ...assgn, untilDt: e.target.value })} />
                    </FormGroup>
                  </Col>
                </Row>
              </div>
            </FormGroup>
          </Col>
        </Row>
      </Container>
      <hr />
      <div style={{ display: 'flex', justifyContent: 'end' }}>
        <Link key={"cancel"} onClick={() => dispatch(setTempAssignment(null))} to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-secondary">Cancel</Link>
        <Link key={"save"} onClick={save} to={`/Kambaz/Courses/${cid}/Assignments`} className="btn btn-danger">Save</Link>
      </div>
    </Container>
  );
}

function convertDate(dateString: string | undefined) {
  if (dateString) {
    const date = new Date(dateString);
    return date.getFullYear() + "-" + String(date.getMonth() + 1).padStart(2, '0') + "-" + String(date.getDate()).padStart(2, '0');
  }
}
