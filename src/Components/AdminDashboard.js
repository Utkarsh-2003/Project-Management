import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import "../App.css";
import Avatar from "react-avatar";
import { useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const AdminDashboard = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);

  const handleRemoveProject = async (projectId, Title) => {
    try {
      if (window.confirm(`Are you sure to delete this project: ${Title} ?`)) {
        await db.collection("Projects").doc(projectId).delete();
        console.log("Document successfully deleted!");
        toast.success("Project Deleted Successfully");
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

    return () => unsubscribe();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`; // Format as DD/MM/YYYY
  };

  return (
    <>
      {admin ? (
        <>
          <div className="p-2">
            <div className="row">
              <div className="col-lg-12">
                <div className="container mt-2 border rounded p-3 shadow">
                  <h1 className="text-center">Projects</h1>
                  <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-2">
                    {projects.length === 0 ? ( // Check if projects array is empty
                      <li className="list-group-item">No Projects</li>
                    ) : (
                      projects.map((project, index) => (
                        <div key={index} className="col">
                          <div
                            className="h-100 card shadow"
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
                                    handleRemoveProject(
                                      project.id,
                                      project.Title
                                    );
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
            </div>
          </div>
        </>
      ) : (
        <>You Are Not Authorized To Access This Page.</>
      )}
    </>
  );
};

export default AdminDashboard;
