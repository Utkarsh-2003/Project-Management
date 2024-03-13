import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import Login from "./Login";
const Pending = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setProjects(data);
    });

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // Format as DD/MM/YYYY
  };
  return (
    <>
      {isAuthenticated ? (
        <>
          <div>
            <div className="p-3">
              <h1 className="text-center mt-3">Projects</h1>
              <div className="container mt-4 border rounded p-3">
                <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-2">
                  {projects.length === 0 ? ( // Check if projects array is empty
                    <li className="list-group-item">No Projects</li>
                  ) : (
                    projects.map((project, index) => (
                      <div key={index} className="col">
                        <div
                          className="card h-100 shadow"
                          style={{ cursor: "pointer" }}
                        >
                          <div className="card-body">
                            <h4 className="card-title">{project.Title}</h4>
                            <div className="d-flex">
                              <strong> Due Date:</strong> &nbsp;
                              <p className="card-text">
                                {formatDate(project.DueDate)}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
          <Login />
        </>
      )}
    </>
  );
};

export default Pending;
