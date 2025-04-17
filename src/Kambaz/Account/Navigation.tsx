import { Link, useLocation } from "react-router-dom";
import { useSelector } from "react-redux";
export default function AccountNavigation() {
  const { currentUser } = useSelector((state: any) => state.accountReducer);
  const links = currentUser ? ["Profile"] : ["Signin", "Signup"];
  const { pathname } = useLocation();
  const active = (path: string) => (pathname.includes(path) ? "active" : "text-danger");
  return (
    <div id="wd-account-navigation" className="wd list-group fs-5 rounded-0">
      {links.includes("Signin") && <><Link to={`/Kambaz/Account/Signin`}
        className={`list-group-item border border-0 ${pathname.includes("Signin") ? "active" : "text-danger"}`}> Signin  </Link><br /></>}
      {links.includes("Signup") && <><Link to={`/Kambaz/Account/Signup`}
        className={`list-group-item border border-0 ${pathname.includes("Signup") ? "active" : "text-danger"}`}> Signup  </Link><br /></>}
      {links.includes("Profile") && <><Link to={`/Kambaz/Account/Profile`}
        className={`list-group-item border border-0 ${pathname.includes("Profile") ? "active" : "text-danger"}`}> Profile </Link><br /></>}
      {currentUser && currentUser.role === "ADMIN" && (
        <Link to={`/Kambaz/Account/Users`} className={`list-group-item border border-0 ${active("Users")}`}> Users </Link>)}
    </div>
  );
}
