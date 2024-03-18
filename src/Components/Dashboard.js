import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import Login from "./Login";
const Dashboard = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const [projects, setProjects] = useState([]);

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
                        <div className="card shadow">
                          <div class="card-header fs-2">{project.Title}</div>
                          <div class="card-body">
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

export default Dashboard;
