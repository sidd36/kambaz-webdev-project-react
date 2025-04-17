import { Link, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { useState } from "react";
import * as client from "./client";
import { setCurrentUser } from "./reducer";
export default function Signup() {
  const [user, setUser] = useState<any>({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const signup = async () => {
    const currentUser = await client.signup(user);
    if (!currentUser._id)
      return
    dispatch(setCurrentUser(currentUser));
    navigate("/Kambaz/Account/Profile");
  };
  return (
    <div id="wd-signup-screen">
      <h1>Sign up</h1>
      <input value={user.username} onChange={(e) => setUser({ ...user, username: e.target.value })}
        className="wd-username form-control mb-2" placeholder="username" />
      <input value={user.password} onChange={(e) => setUser({ ...user, password: e.target.value })} type="password"
        className="wd-password form-control mb-2" placeholder="password" />
      <button onClick={signup} className="wd-signup-btn btn btn-primary mb-2 w-100"> Sign up </button><br />
      <Link to="/Kambaz/Account/Signin" className="wd-signin-link">Sign in</Link>
    </div>);
}

