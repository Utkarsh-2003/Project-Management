import React, { useState } from "react";
import "../App.css";
import { Link, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import main from "./Images/happy-employees.gif";
import auth from "../Firebase";
import { signInWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useDispatch } from "react-redux";
import { loginAdmin, loginUser } from "../Redux/userSlice";
import { toast } from "react-toastify";

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
      await signInWithEmailAndPassword(auth, email, password).then((res) => {
        console.log(res);
        const user = res.user;
        if (role === "admin") {
          if (user.email == "a@gmail.com") {
            toast.success("Login Successful!", {
              autoClose: 1500,
            });
            dispatch(loginAdmin(email));
            navigate("/admin/dashboard");
          } else {
            toast.error("You are not Admin!", {
              autoClose: 1500,
              position: "top-center",
            });
          }
        } else {
          toast.success("Login Successful!", {
            autoClose: 1500,
          });
          const displayName = user.email;
          updateProfile(user, { displayName });
          dispatch(loginUser(email));
          navigate("/dashboard");
        }
      });
    } catch (error) {
      console.error("Error signing in:", error.message);
      toast.error("Error signing in. Please try again.", {
        autoClose: 1500,
        position: "top-center",
      });
    }
  };

  return (
    <div className="p-3">
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
                    <label htmlFor="floatingInput">Email address</label>
                  </div>
                  <div className="form-floating mb-3 position-relative">
                    <input
                      type={type}
                      placeholder="Password"
                      className="form-control"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    <label htmlFor="floatingInput">Password</label>
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
                      className="btn btn-primary btn-block mb-2 rounded-pill"
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
    </div>
  );
};

export default Login;
