import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Avatar from "react-avatar";

const ProjectDetails = () => {
  const { id } = useParams();
  const [project, setProject] = useState({});
  const [daysLeft, setDaysLeft] = useState(null);
  const [daysOver, setDaysOver] = useState(0);
  const [loading, setLoading] = useState(true);
  const [project_per, setProjectPer] = useState("");
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

  const workPercentageTasks = () => {
    if (project.Tasks) {
      let tasks = project.Tasks;

      for (let i = 0; i < tasks.length; i++) {
        let emp = tasks[i].SelectedUsers;
        let counter = 0;

        for (let j = 0; j < emp.length; j++) {
          if (emp[j].Status === "Completed") {
            counter++;
          }
        }

        let work_percentage = (counter * 100) / emp.length;
        tasks[i].workPercentage = work_percentage;
      }
    }
  };

  const calculateProjectPercentage = () => {
    if (project.Tasks) {
      let tasks = project.Tasks;
      let total_percentage = 0;

      for (let i = 0; i < tasks.length; i++) {
        total_percentage += tasks[i].workPercentage || 0;
      }

      let project_percentage = total_percentage / tasks.length;
      setProjectPer(project_percentage);
    }
  };

  useEffect(() => {
    workPercentageTasks();
  }, [project]);

  useEffect(() => {
    calculateProjectPercentage();
  }, [project]);

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
              onClick={() => navigate("/admin/dashboard")}
            >
              <i className="fa-solid fa-circle-arrow-left fs-3"></i>
            </button>
            <div className="text-center flex-grow-1">
              <h2>{project.Title}</h2>
            </div>
          </div>
          <div className="p-3 border rounded mb-3 shadow">
            <div
              className="progress mb-3"
              role="progressbar"
              aria-label="Success example"
              aria-valuenow="25"
              aria-valuemin="0"
              aria-valuemax="100"
            >
              <div
                className="progress-bar bg-success"
                style={{ width: `${project_per}%` }} // Corrected usage of project_per variable
              >
                {parseFloat(project_per).toFixed(2)}%
              </div>
            </div>
            <div className="row mx-2">
              {loading ? (
                <>loading...</>
              ) : (
                <>
                  {project.Tasks.map((task, index) => (
                    <div
                      className="card text-center mx-4 my-1 p-0"
                      key={index}
                      style={{ maxWidth: "250px" }}
                    >
                      <div className="card-header">{task.Title}</div>
                      <div className="card-body">
                        <p className="card-text">
                          {task.workPercentage === 100 ? (
                            <>
                              <i className="fa-solid fa-circle-check fs-1 text-success"></i>
                              <div className="text-success">Completed</div>
                            </>
                          ) : (
                            <>
                              <span className="badge rounded-pill p-2 text-dark fs-5 bg-info">
                                {parseFloat(task.workPercentage).toFixed(2)}%
                              </span>
                              <div className="text-dark">In Process</div>
                            </>
                          )}
                        </p>
                      </div>
                      <div className="card-footer">
                        <div>
                          Work Percentage:
                          {parseFloat(task.workPercentage).toFixed(2)}%
                        </div>
                      </div>
                    </div>
                  ))}
                </>
              )}
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
                      style={{ maxWidth: "800px" }}
                    >
                      <table
                        className="table table-hover"
                        style={{ maxWidth: "900px" }}
                      >
                        <thead>
                          <tr>
                            <th className="text-center">Task Name</th>
                            <th className="text-center">Description</th>
                            <th className="text-center">Users</th>
                            <th className="text-center">Status</th>
                          </tr>
                        </thead>
                        <tbody>
                          {project.Tasks.map((task, index) => (
                            <tr
                              onClick={() => navigate(`/admin/${id}/addtask`)}
                              style={{ cursor: "pointer" }}
                              key={index}
                            >
                              <td>{task.Title}</td>
                              <td>{task.Description}</td>
                              <td>
                                {task.SelectedUsers.map((user, index) => (
                                  <div key={index}>
                                    <span>{user.label}</span>
                                  </div>
                                ))}
                              </td>
                              <td>
                                {task.SelectedUsers.map((user, index) => (
                                  <div key={index}>
                                    {user.Status === "Completed" ? (
                                      <>
                                        <span className="badge rounded-pill bg-success">
                                          {user.Status}
                                        </span>
                                      </>
                                    ) : (
                                      <>
                                        <span className="badge rounded-pill text-dark bg-info">
                                          {user.Status}
                                        </span>
                                      </>
                                    )}
                                  </div>
                                ))}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="col-lg-4 mb-3">
              <div className="sidebar container shadow border rounded p-3">
                <h2 className="mb-4 text-center">Users</h2>
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
