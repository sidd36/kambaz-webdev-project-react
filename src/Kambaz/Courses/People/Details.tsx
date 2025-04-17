import { useEffect, useState } from "react";
import { FaCheck, FaUserCircle } from "react-icons/fa";
import { IoCloseSharp } from "react-icons/io5";
import { useParams, useNavigate } from "react-router";
import * as client from "../../Account/client";
import { FaPencil } from "react-icons/fa6";
import { FormControl } from "react-bootstrap";
export default function PeopleDetails() {
    const { uid } = useParams();
    const [user, setUser] = useState<any>({});
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [role, setRole] = useState("");
    const [editing, setEditing] = useState("");
    const saveUser = async (update: string) => {
        let updatedUser;
        if (update === "name") {
            const [firstName, lastName] = name.split(" ");
            updatedUser = { ...user, firstName, lastName };
        } else if (update === "email") {
            updatedUser = { ...user, email };
        } else if (update === "role") {
            updatedUser = { ...user, role };
        }
        await client.updateUser(updatedUser);
        setUser(updatedUser);
        setEditing("");
        navigate(-1);
    };
    const navigate = useNavigate();
    const deleteUser = async (uid: string) => {
        await client.deleteUser(uid);
        navigate(-1);
    };
    const fetchUser = async () => {
        if (!uid) return;
        const user = await client.findUserById(uid);
        setUser(user);
        setEmail(user.email);
        setName(user.firstName + " " + user.lastName);
        setRole(user.role);
    };
    useEffect(() => {
        if (uid) fetchUser();
    }, [uid]);
    if (!uid) return null;
    return (
        <div className="wd-people-details position-fixed top-0 end-0 bottom-0 bg-white p-4 shadow w-25">
            <button onClick={() => navigate(-1)} className="btn position-fixed end-0 top-0 wd-close-details">
                <IoCloseSharp className="fs-1" /> </button>
            <div className="text-center mt-2"> <FaUserCircle className="text-secondary me-2 fs-1" /> </div><hr />
            <div className="text-danger fs-4 wd-name">
                {editing !== "name" && (
                    <FaPencil onClick={() => setEditing("name")}
                        className="float-end fs-3 mt-3 wd-edit"
                        onClickCapture={() => { setEditing("name"); setName(`${user.name}`)}} />)}
                {editing === "name" && (
                    <FaCheck onClick={() => saveUser("name")}
                        className="float-end fs-3 mt-2 me-2 wd-save" />)}
                {editing !== "name" && (
                    <div className="wd-name"
                        onClick={() => {setEditing("name"); setName(`${user.firstName} ${user.lastName}`)}}>
                        {user.firstName} {user.lastName}</div>)}
                {user && editing === "name" && (
                    <FormControl className="w-50 wd-edit-name"
                        value={`${user.firstName} ${user.lastName}`}
                        onClick={(e) => setName((e.target as HTMLInputElement).value)}
                        onChange={(e) => setName(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") { saveUser("name"); }
                        }} />)}
            </div>
            <b>Email:</b>           <span className="wd-email">
                {editing !== "email" && (
                    <FaPencil onClick={() => setEditing("email")}
                        className="float-end fs-3 mt-3 wd-edit" 
                        onClickCapture={() => { setEditing("email"); setEmail(`${user.email}`)}}/>)}
                {editing === "email" && (
                    <FaCheck onClick={() => saveUser("email")}
                        className="float-end fs-3 mt-2 me-2 wd-save" />)}
                {editing !== "email" && (
                    <div className="wd-email"
                        onClick={() => {setEditing("email"); setEmail(`${user.email}`)}}>
                        {user.email}</div>)}
                {user && editing === "email" && (
                    <FormControl className="w-50 wd-edit-email" type="email"
                        value={`${user.email}`}
                        onClick={(e) => setEmail(e.currentTarget.value)}
                        onChange={(e) => setEmail(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") { saveUser("email"); }
                        }} />)}
            </span> <br />
            <b>Roles:</b>           <span className="wd-roles">
                {editing !== "role" && (
                    <FaPencil onClick={() => setEditing("role")}
                        className="float-end fs-3 mt-3 wd-edit" 
                        onClickCapture={() => { setEditing("role"); setRole(`${user.role}`)}}/>)}
                {editing === "role" && (
                    <FaCheck onClick={() => saveUser("role")}
                        className="float-end fs-3 mt-2 me-2 wd-save" />)}
                {editing !== "role" && (
                    <div className="wd-role"
                        onClick={() => {setEditing("role"); setRole(`${user.role}`)}}>
                        {user.role}</div>)}
                {user && editing === "role" && (
                    <select value={role} onClick={(e) => setRole((e.target as HTMLInputElement).value)} onChange={(e) => setRole(e.target.value)}
                        className="form-select float-end w-25 wd-role" >
                        <option value="STUDENT">Student</option>
                        <option value="TA">Assistant</option>
                        <option value="FACULTY">Faculty</option>
                        <option value="ADMIN">Administrator</option>
                    </select>
                )}
            </span> <br />
            <b>Login ID:</b>        <span className="wd-login-id">      {user.loginId}      </span> <br />
            <b>Section:</b>         <span className="wd-section">       {user.section}      </span> <br />
            <b>Total Activity:</b>  <span className="wd-total-activity">{user.totalActivity}</span>
            <hr />
            <button onClick={() => deleteUser(uid)} className="btn btn-danger float-end wd-delete" > Delete </button>
            <button onClick={() => navigate(-1)}
                className="btn btn-secondary float-start float-end me-2 wd-cancel" > Cancel </button>
        </div>);
}