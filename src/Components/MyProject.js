import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";

const MyProject = () => {
  const [projects, setProjects] = useState([]);
  const user = useSelector((state) => state.user.email);

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((project) => project.SelectedUsers.some((selectedUser) => selectedUser.value === user));
      setProjects(data);
    });

    return () => unsubscribe();
  }, [user]);

  return (
    <>
      <div className="p-3">
        <h1 className="text-center mt-3">My Projects</h1>
        <div className="container mt-4 border rounded p-3">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-2">
            {projects.length === 0 ? (
              <li className="list-group-item">No Projects</li>
            ) : (
              projects.map((project, index) => (
                <div key={index} className="col">
                  <div
                    className="card h-100 shadow"
                    style={{ cursor: "pointer" }}
                  >
                    <div className="card-body">
                      <h5 className="card-title">{project.Title}</h5>
                      <p className="card-text">{project.DueDate}</p>
                      <p className="card-text">{project.Description}</p>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default MyProject;
