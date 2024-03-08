import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import "../App.css";
import Avatar from "react-avatar";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);

  const handleRemoveProject = async (projectId) => {
    try {
      await db.collection("Projects").doc(projectId).delete();
      console.log("Document successfully deleted!");
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div className="p-3">
        <h1 className="text-center mt-3">Projects</h1>
        <div className="container mt-4 border rounded p-3">
          <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-2">
            {projects.length === 0 ? ( // Check if projects array is empty
              <li className="list-group-item">No Projects</li>
            ) : (
              projects.map((project, index) => (
                <div key={index} className="col">
                  <div className="card h-100 shadow">
                    <div className="card-body">
                      <h5 className="card-title position-relative">
                        {project.Title}
                        <button
                          className="btn text-danger text-decoration-none fa-solid fa-trash-can position-absolute top-0 end-0 mt-1"
                          onClick={() => handleRemoveProject(project.id)}
                          style={{ cursor: "pointer" }}
                        ></button>
                      </h5>
                      <p className="card-text">{project.DueDate}</p>
                      <p className="card-text">{project.Description}</p>
                      <div className="d-flex justify-content-start align-items-center">
                        {project.SelectedUsers.map((user, index) => (
                          <Avatar
                            key={index}
                            name={user.value[0]}
                            size={40}
                            round={true}
                            className="me-2"
                            title={user.label}
                          />
                        ))}
                      </div>
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

export default AdminDashboard;
