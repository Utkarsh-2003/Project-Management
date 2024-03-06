import React, { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import main from "./Images/happy-employees.gif";
import auth, { db } from "../Firebase";
import { signInWithEmailAndPassword } from "firebase/auth";
import { useDispatch } from "react-redux";
import { loginAdmin, loginUser } from "../Redux/userSlice";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(faEyeSlash);
  const [role, setRole] = useState("");
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleHidePassword = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
    setIcon((prevIcon) => (prevIcon === faEyeSlash ? faEye : faEyeSlash));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await signInWithEmailAndPassword(auth, email, password);
      if (role === "admin") {
        alert("Logged in successfully!");
        dispatch(loginAdmin({email, password}));
        navigate("/admin/dashboard");
      } else {
        alert("Logged in successfully!");
        dispatch(loginUser({email, password}));
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error signing in:", error.message);
      alert("Error signing in. Please try again.");
    }
  };

  return (
    <div className="container shadow border rounded p-1 mt-2">
      <div className="row justify-content-center align-items-center mt-5">
        <div className="col-md-6">
          <img src={main} alt="logo" style={{ width: "100%" }} />
        </div>
        <div className="col-md-4">
          <div className="card shadow bg-light">
            <div className="card-body">
              <h2 className="card-title text-center mb-4">Login</h2>
              <form
                className="container-form"
                onSubmit={handleSubmit}
                style={{ maxWidth: "250px", margin: "0 auto" }}
              >
                <div className="form-floating mb-3">
                  <input
                    type="email"
                    className="form-control"
                    value={email}
                    placeholder="Email address"
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                  <label for="floatingInput">Email address</label>
                </div>
                <div className="form-floating mb-3 position-relative">
                  <input
                    type={type}
                    placeholder="Password"
                    className="form-control"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <label for="floatingInput">Password</label>
                  <span
                    className="position-absolute end-0 top-50 translate-middle-y"
                    onClick={handleHidePassword}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  >
                    <FontAwesomeIcon icon={icon} />
                  </span>
                </div>
                <div>
                  <select
                    onChange={(e) => setRole(e.target.value)}
                    className="mb-2 form-select py-2"
                    id="role"
                    value={role}
                    required
                  >
                    <option disabled value="">
                      Select Role...
                    </option>
                    <option value="user">User</option>
                    <option value="admin">Admin</option>
                  </select>
                </div>
                <div className="text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-block mb-2"
                  >
                    Login
                  </button>
                </div>
                <Link to="/register" className="d-block text-center">
                  Don't have an account?
                </Link>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
