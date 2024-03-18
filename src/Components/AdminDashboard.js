import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import "../App.css";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const [users, setUsers] = useState([]);
  const navigate = useNavigate();

  const handleRemoveProject = async (projectId, Title) => {
    try {
      if (window.confirm(`Are you sure to delete this project: ${Title} ?`)) {
        await db.collection("Projects").doc(projectId).delete();
        console.log("Document successfully deleted!");
        alert("Project Deleted!");
      }
    } catch (error) {
      console.error("Error removing document: ", error);
    }
  };

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    });

    // Fetch users from database and set them into state
    const fetchUsers = async () => {
      const usersSnapshot = await db.collection("user").get();
      const usersData = usersSnapshot.docs.map((doc) => doc.data());
      setUsers(usersData);
    };

    fetchUsers();

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // Format as DD/MM/YYYY
  };

  return (
    <>
      <div className="p-3">
        <div className="row">
          <div className="col-lg-10">
            <div className="container mt-2 border rounded p-3 shadow">
              <h1 className="text-center">Projects</h1>
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-2">
                {projects.length === 0 ? ( // Check if projects array is empty
                  <li className="list-group-item">No Projects</li>
                ) : (
                  projects.map((project, index) => (
                    <div key={index} className="col">
                      <div
                        className="card shadow"
                        onClick={() =>
                          navigate(
                            `/admin/dashboard/project/${project.ProjectId}`
                          )
                        }
                        style={{ cursor: "pointer" }}
                      >
                        <div className="card-body">
                          <h5 className="card-title position-relative">
                            {project.Title}
                            <button
                              title="Remove"
                              className="btn text-danger text-decoration-none fa-solid fa-trash-can position-absolute top-0 end-0 mt-1"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveProject(project.id,project.Title);
                              }}
                              style={{ cursor: "pointer" }}
                            ></button>
                          </h5>
                          <p className="card-text">
                            {formatDate(project.DueDate)}
                          </p>
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
          <div className="col-lg-2 mt-2">
            <div className="sidebar container shadow border rounded p-3">
              <h2 className="mb-4">All Users</h2>
              <ul className="list-unstyled">
                {users
                  .sort((a, b) => a.name.localeCompare(b.name)) // Sort users alphabetically by name
                  .map((user, index) => (
                    <li key={index} className="d-flex align-items-center mb-3">
                      <div className="container border rounded p-2 shadow">
                        <Avatar
                          name={user.name[0]}
                          size={40}
                          round={true}
                          className="me-2"
                          title={user.name}
                        />
                        <span>{user.name}</span>
                      </div>
                    </li>
                  ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
