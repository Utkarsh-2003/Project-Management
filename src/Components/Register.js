import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import { Link, useNavigate } from "react-router-dom";
import "../App.css";
import { v4 as uuidv4 } from "uuid";
import Gif from "./Images/Gif Animation.gif";
import auth, { db } from "../Firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";

const Register = () => {
  const id = uuidv4();
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(faEyeSlash);
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleHidePassword = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
    setIcon((prevIcon) => (prevIcon === faEyeSlash ? faEye : faEyeSlash));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    } else if (password.length < 6) {
      alert("Password length should be at least 6 characters.");
    } else {
      db.collection(`${role}`)
        .where("email", "==", email)
        .get()
        .then((snapshot) => {
          if (snapshot.empty) {
            db.collection(`${role}`)
              .add({
                id: id,
                email: email,
                password: password,
                name: name,
                username: username,
                role: role,
              })
              .then((docRef) => {
                console.log("Document written with ID:", docRef.id);
              })
              .catch((error) => {
                console.error("Error adding document:", error);
              });
          } else {
            console.log("Duplicate data found");
          }
        })
        .catch((error) => {
          console.error("Error querying document:", error);
        });

      try {
        await createUserWithEmailAndPassword(auth, email, password);
        alert("New User Created.");
        navigate("/login");
      } catch (error) {
        console.error("Error creating user:", error);
        alert("Error creating user. Please try again.");
      }
    }
  };

  return (
    <div className="p-3">
      <div className="container border rounded shadow mt-2 p-3">
        <div className="row">
          <div className="col-md-7 d-flex justify-content-center align-items-center">
            <img
              src={Gif}
              alt="gif"
              style={{ maxWidth: "100%", height: "auto" }}
            />
          </div>
          <div className="col-md-5">
            <div className="container mt-4 me-5 py-3 text-center border rounded bg-light shadow">
              <h2 className="text-center mb-4">Register</h2>
              <form
                className="form-container"
                onSubmit={handleSubmit}
                style={{ maxWidth: "300px", margin: "0 auto" }}
              >
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    id="username"
                    className="form-control"
                    value={username}
                    placeholder="Username"
                    onChange={(e) => setUsername(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Username</label>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="text"
                    id="name"
                    className="form-control"
                    value={name}
                    placeholder="Name"
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Name</label>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="email"
                    id="email"
                    className="form-control"
                    value={email}
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-2 position-relative">
                  <input
                    type={type}
                    placeholder="Password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Password</label>
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y"
                    onClick={handleHidePassword}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  >
                    <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
                  </span>
                </div>
                <div className="form-floating mb-2">
                  <input
                    type="password"
                    placeholder="Confirm Password"
                    className="form-control"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                  <label htmlFor="floatingInput">Confirm Password</label>
                </div>
                <div>
                  <select
                    onChange={(e) => setRole(e.target.value)}
                    className="mb-2 form-select py-2"
                    id="role"
                    value={role}
                    required
                  >
                    <option defaultValue={true}>Select User Role...</option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="text-center mb-2">
                  <button
                    type="submit"
                    className="btn btn-primary rounded-pill"
                  >
                    Register
                  </button>
                </div>
                <div className="text-center">
                  <Link to="/login">Already have an account?</Link>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
