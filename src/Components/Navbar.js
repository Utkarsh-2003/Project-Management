import React from "react";
import "../App.css";
import Logo from "./Images/Logo.png";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { useDispatch } from "react-redux";
import { logoutAdmin, logoutUser } from "../Redux/userSlice";

const Navbar = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const user = useSelector((state) => state.user);
  const admin = useSelector((state) => state.admin);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    if (admin) {
      dispatch(logoutAdmin());
      navigate("/login");
    } else {
      dispatch(logoutUser());
      navigate("/login");
    }
  };

  return (
    <>
      {isAuthenticated ? (
        <>
          {admin ? (
            <>
              <nav class="navbar navbar-expand-lg bg-dark">
                <div class="container-fluid">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="mx-4"
                    style={{ height: "50px", width: "50px" }}
                  />
                  <button
                    class="navbar-toggler bg-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span class="navbar-toggler-icon"></span>
                  </button>
                  <div
                    class="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <ul class="navbar-nav me-auto mb-2 mb-lg-0">
                      <li class="nav-item">
                        <Link
                          className="navbar-brand text-light mx-3"
                          to="/admin/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li class="nav-item">
                        <Link
                          className="navbar-brand text-light mx-3"
                          to="/admin/add"
                        >
                          Add Projects
                        </Link>
                      </li>
                    </ul>
                    <div className="mx-3 dropdown">
                      <a
                        href="#"
                        className="nav-container link-light dropdown-toggle"
                        role="button"
                        id="userDropdown"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i
                          className="fa-solid fa-user rounded-circle"
                          width="40"
                          height="40"
                        ></i>
                      </a>
                      <ul
                        className="dropdown-menu dropdown-menu-end text-small"
                        aria-labelledby="userDropdown"
                      >
                        <li>
                          <p className="dropdown-item">Hi, {admin.email}!</p>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleLogout}
                          >
                            Log out
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </nav>
            </>
          ) : (
            <>
              <nav class="navbar navbar-expand-lg bg-dark text-white">
                <div class="container-fluid">
                  <img
                    src={Logo}
                    alt="Logo"
                    className="mx-4"
                    style={{ height: "50px", width: "50px" }}
                  />
                  <button
                    class="navbar-toggler bg-white"
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target="#navbarSupportedContent"
                    aria-controls="navbarSupportedContent"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                  >
                    <span class="navbar-toggler-icon"></span>
                  </button>
                  <div
                    class="collapse navbar-collapse"
                    id="navbarSupportedContent"
                  >
                    <ul class="logo navbar-nav me-auto mb-2 mb-lg-0">
                      <li class="nav-item">
                        <Link
                          className="navbar-brand text-light mx-3"
                          to="/dashboard"
                        >
                          Dashboard
                        </Link>
                      </li>
                      <li class="nav-item">
                        <Link
                          className="navbar-brand text-light mx-3"
                          to="/project"
                        >
                          All Projects
                        </Link>
                      </li>
                      <li class="nav-item">
                        <Link
                          className="navbar-brand text-light mx-3"
                          to="/Pending"
                        >
                          Pending
                        </Link>
                      </li>
                      <li class="nav-item">
                        <Link
                          className="navbar-brand text-light mx-3"
                          to="/complete"
                        >
                          Completed
                        </Link>
                      </li>
                    </ul>

                    <div className="navbar-brand text-light mx-3"></div>
                    <div className="mx-3 dropdown">
                      <a
                        href="#"
                        className="nav-container link-light dropdown-toggle"
                        role="button"
                        id="userDropdown"
                        data-bs-toggle="dropdown"
                        aria-haspopup="true"
                        aria-expanded="false"
                      >
                        <i
                          className="fa-solid fa-user rounded-circle"
                          width="40"
                          height="40"
                        ></i>
                      </a>
                      <ul
                        className="dropdown-menu dropdown-menu-end text-small"
                        aria-labelledby="userDropdown"
                      >
                        <li>
                          <p className="dropdown-item">Hi, {user.email}!</p>
                        </li>
                        <li>
                          <hr className="dropdown-divider" />
                        </li>
                        <li>
                          <button
                            className="dropdown-item"
                            onClick={handleLogout}
                          >
                            Log out
                          </button>
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </nav>
            </>
          )}
        </>
      ) : (
        <>
          <nav className="navbar navbar-expand-lg bg-dark py-2">
            <div className="container-fluid">
              <img
                src={Logo}
                alt="Logo"
                className="mx-4"
                style={{ height: "50px", width: "50px" }}
              />
              <button
                className="navbar-toggler bg-white"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div
                className="collapse navbar-collapse"
                id="navbarSupportedContent"
              >
                <div className="navbar-nav me-auto mb-2 mb-lg-0">
                </div>
                <div className="ml-auto">
                  <Link to="/login" className="btn btn-primary mx-2 mb-2 mt-1">
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="btn btn-primary mx-2 mb-2 mt-1"
                  >
                    Register
                  </Link>
                </div>
              </div>
            </div>
          </nav>
        </>
      )}
    </>
  );
};

export default Navbar;
