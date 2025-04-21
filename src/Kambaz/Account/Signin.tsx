import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { setCurrentUser } from "./reducer";
import { useDispatch } from "react-redux";
import * as client from "./client";
export default function Signin() {
  const [credentials, setCredentials] = useState<any>({});
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const signin = async () => {
    const user = await client.signin(credentials);
    if (!user) return;
    dispatch(setCurrentUser(user));
    navigate("/Kambaz/Dashboard");
  };

  return (
    <div id="wd-signin-screen">
      <h1>Sign in</h1>
      <input defaultValue={credentials.username}
        onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
        className="form-control mb-2" placeholder="username" id="wd-username" />
      <input defaultValue={credentials.password}
        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
        className="form-control mb-2" placeholder="password" type="password" id="wd-password" />
      <button onClick={signin} id="wd-signin-btn" className="btn btn-primary w-100" > Sign in </button>
      <Link id="wd-signup-link" to="/Kambaz/Account/Signup">Sign up</Link>


      <hr className="my-4" />
      <div id="wd-project-info">
        <h5>Team Members</h5>
        <ul>
          <li>Pushkar Sadaphal - Section 1</li>
          <li>Siddharth Sanjeev - Section 1</li>
          <li>Sagar Bilwal - Section 1</li>
        </ul>

        <h5>Project Repositories</h5>
        <ul>
          <li>
            <a
              href="https://github.com/sidd36/kambaz-webdev-project-react/tree/quiz-merged"
              target="_blank"
              rel="noreferrer"
            >
              React.js Frontend Repository
            </a>
          </li>
          <li>
            <a
              href="https://github.com/sidd36/kambaz-webdev-project-node/tree/quiz-merged"
              target="_blank"
              rel="noreferrer"
            >
              Node.js Backend Repository
            </a>
          </li>
        </ul>
      </div>
    </div>);
}