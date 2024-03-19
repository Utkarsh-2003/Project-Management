import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "react-avatar";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [daysLeft, setDaysLeft] = useState(null);
  const [daysOver, setDaysOver] = useState(0);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const getProject = () => {
    db.collection("Projects")
      .where("ProjectId", "==", id)
      .onSnapshot((snapshot) => {
        snapshot.forEach((doc) => {
          setProject(doc.data());
          setLoading(false);
        });
      });
  };

  useEffect(() => {
    getProject();
  }, []);

  useEffect(() => {
    if (project.DueDate) {
      const daysLeftValue = calculateDaysLeft();
      setDaysLeft(daysLeftValue);

      const daysOverValue = daysLeftValue < 0 ? Math.abs(daysLeftValue) : 0;
      setDaysOver(daysOverValue);
    }
  }, [project]);

  const calculateDaysLeft = () => {
    const dueDate = new Date(project.DueDate);
    const currentDate = new Date();
    const timeDiff = dueDate.getTime() - currentDate.getTime();
    const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
    return daysDiff;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <div className="p-2">
      <div
        className="container mt-2 mb-2 p-2 border rounded shadow"
        style={{ maxWidth: "1300px" }}
      >
        <div className="container-fluid">
          <div className="d-flex  border rounded shadow-sm mb-3 p-2">
            <button
              className="btn"
              title="back"
              onClick={() => navigate("/myprojects")}
            >
              <i className="fa-solid fa-circle-arrow-left fs-3"></i>
            </button>
            <div className="text-center flex-grow-1">
              <h2>{project.Title}</h2>
            </div>
          </div>
          <div className="row g-2">
            <div className="col-lg-8">
              <div>
                {loading ? (
                  <div>Loading...</div>
                ) : (
                  <div
                    className="container border rounded p-3 shadow mb-2"
                    style={{ borderRadius: "10px" }}
                  >
                    <div className="row">
                      <div className="col-lg-9 col-xs-10">
                        <p className="fs-3">About Project</p>
                        <p>{project.Description}</p>
                      </div>
                      <div className="col-lg-3 col-xs-2 p-2">
                        <div className="border rounded text-center shadow-sm p-2">
                          <span
                            className={`badge rounded-pill ${
                              daysLeft < 0 ? "bg-danger" : "bg-success"
                            } fs-5 mt-1`}
                          >
                            Due Date
                          </span>
                          <div className="p-3">
                            {formatDate(project.DueDate)}
                          </div>
                          <span
                            className={`badge rounded-pill ${
                              daysLeft < 0 ? "bg-danger" : "bg-success"
                            } mx-1`}
                          >
                            {daysLeft < 0 ? daysOver : daysLeft}
                          </span>
                          {daysLeft < 0 ? "days late" : "days left"}
                        </div>
                      </div>
                    </div>
                    <h3 className="mx-2">Tasks</h3>
                    <div
                      className="card p-2 mt-3"
                      style={{ maxWidth: "700px" }}
                    >
                      <div className="table-responsive">
                        <table
                          className="table table-hover"
                          style={{ maxWidth: "700px" }}
                        >
                          <thead>
                            <tr>
                              <th>Task Name</th>
                              <th>Description</th>
                              <th>Colleagues</th>
                            </tr>
                          </thead>
                          <tbody>
                            {project.Tasks.map((task, index) => (
                              <tr key={index}>
                                <td>{task.Title}</td>
                                <td>{task.Description}</td>
                                <td>
                                  {task.SelectedUsers.map((user, index) => (
                                    <div key={index}>
                                      <span>{user.label}</span>
                                    </div>
                                  ))}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-4 mb-3">
              <div className="sidebar container shadow border rounded p-3">
                <h2 className="mb-4 text-center">Colleagues</h2>
                <ul className="list-unstyled">
                  {project.SelectedUsers &&
                    project.SelectedUsers.map((user, index) => (
                      <div
                        key={index}
                        className="container-sm mb-3 border rounded shadow-sm p-2"
                      >
                        <Avatar
                          name={user.value[0]}
                          size={40}
                          round={true}
                          className="me-2"
                          title={user.label}
                        />
                        <span>{user.label}</span>
                      </div>
                    ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectDetails;
