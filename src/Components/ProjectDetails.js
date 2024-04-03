import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { Link, useNavigate, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import ReactConfetti from "react-confetti";
import Button from "react-bootstrap/Button";
import Modal from "react-bootstrap/Modal";
import { Bar } from "react-chartjs-2";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";

const ProjectDetails = () => {
  const { id } = useParams();
  const admin = useSelector((state) => state.admin);
  const [project, setProject] = useState({});
  const [daysLeft, setDaysLeft] = useState(null);
  const [daysOver, setDaysOver] = useState(0);
  const [loading, setLoading] = useState(true);
  const [project_per, setProjectPer] = useState("");
  const [showConfetti, setShowConfetti] = useState(false);
  const [modalShow, setModalShow] = React.useState(false);
  const [comment, setComment] = useState("");
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
  }, [id]);

  const workPercentageTasks = () => {
    if (project.Tasks) {
      let tasks = project.Tasks;

      for (let i = 0; i < tasks.length; i++) {
        let user = tasks[i].SelectedUsers;
        let counter = 0;

        for (let j = 0; j < user.length; j++) {
          if (user[j].Status === "Completed") {
            counter++;
          }
        }

        let work_percentage = (counter * 100) / user.length;
        tasks[i].workPercentage = work_percentage;
      }
      // setProject((prevProject) => ({
      //   ...prevProject,
      //   Tasks: tasks,
      // }));
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

  useEffect(() => {
    if (project_per === 100) {
      setShowConfetti(true);

      const timeoutId = setTimeout(() => {
        setShowConfetti(false);
      }, 10000);

      return () => clearTimeout(timeoutId);
    }
  }, [project_per]);

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

  const addComment = () => {
    setModalShow(true);
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim() !== "") {
      db.collection("Projects")
        .where("ProjectId", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let Comments = doc.data().AdminComments;
            Comments.push({ dateTime: new Date(), message: comment });
            doc.ref.update({
              AdminComments: Comments,
            });
          });
          toast.success("Comment Added!", {
            autoClose: 1500,
            position: "top-center",
          });
          setModalShow(false);
          setComment("");
        });
    } else {
      toast.warning("Please enter a comment before sending.", {
        autoClose: 1500,
        position: "top-center",
      });
    }
  };

  useEffect(() => {
    if (project.SelectedUsers) {
      project.SelectedUsers.map((user) => {
        let count = 0;

        project.Tasks.forEach((task) => {
          if (
            task.SelectedUsers.some((userVal) => userVal.value === user.value)
          ) {
            count++;
          }
        });
        user.totalTask = count;
      });
    }
  }, [project]);

  // Prepare data for the chart
  const chartData = project.SelectedUsers
    ? {
        labels: project.SelectedUsers.map((user) => user.label.split(" ")[0]),
        datasets: [
          {
            label: "Tasks Assigned",
            backgroundColor: "rgba(75,192,192,1)",
            borderColor: "rgba(75,192,192,1)",
            borderWidth: 1,
            hoverBackgroundColor: "rgba(75,192,192,0.4)",
            hoverBorderColor: "rgba(75,192,192,0.2)",
            data: project.SelectedUsers.map((user) => user.totalTask),
          },
        ],
      }
    : null;

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Hide y-axis grid lines
        },
      },
    },
  };

  return (
    <>
      {admin ? (
        <div className="p-2">
          {showConfetti && (
            <ReactConfetti
              height={window.innerHeight}
              width={window.innerWidth}
            />
          )}
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
                <div>
                  <button
                    className="btn"
                    title="Comment"
                    onClick={() => {
                      addComment();
                    }}
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="35"
                      height="35"
                      fill="currentColor"
                      className="bi bi-chat-dots-fill"
                      viewBox="0 0 16 16"
                    >
                      <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M5 8a1 1 0 1 0-2 0 1 1 0 0 0 2 0m4 0a1 1 0 1 0-2 0 1 1 0 0 0 2 0m3 1a1 1 0 1 0 0-2 1 1 0 0 0 0 2" />
                    </svg>
                  </button>
                </div>
              </div>
              <div className="p-3 border rounded mb-3 shadow">
                <div
                  className={`${
                    project_per <= 33.33
                      ? "progress mb-3 border border-danger rounded"
                      : project_per >= 66.67
                      ? "progress mb-3 border border-success rounded"
                      : "progress mb-3 border border-primary rounded"
                  }`}
                  role="progressbar"
                  aria-label="Success example"
                  aria-valuenow="25"
                  aria-valuemin="0"
                  aria-valuemax="100"
                >
                  <div
                    className={`${
                      project_per <= 33.33
                        ? "rounded progress-bar bg-danger progress-bar-striped progress-bar-animated"
                        : project_per >= 66.67
                        ? "rounded progress-bar bg-success"
                        : "rounded progress-bar bg-primary progress-bar-striped progress-bar-animated"
                    }`}
                    style={
                      project_per === 100
                        ? { width: `${project_per}%` }
                        : {
                            width: `${project_per}%`,
                            animationDirection: "reverse",
                          }
                    }
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
                          className="card text-center my-2 mx-4 p-0 border-0"
                          key={index}
                          style={{ maxWidth: "250px" }}
                        >
                          <div className="card-header bg-primary-subtle border border-primary">
                            {task.Title}
                          </div>
                          <div className="card-body border border-dark border-top-0 rounded-bottom">
                            <p className="card-text">
                              {task.workPercentage === 100 ? (
                                <>
                                  <div
                                    className="mx-auto"
                                    style={{ width: 80, height: 80 }}
                                  >
                                    <CircularProgressbar
                                      value={task.workPercentage}
                                      text={
                                        parseFloat(task.workPercentage).toFixed(
                                          2
                                        ) + "%"
                                      }
                                      styles={buildStyles({
                                        pathColor: "#198754",
                                        textColor: "#198754",
                                      })}
                                    />
                                  </div>
                                </>
                              ) : (
                                <>
                                  <div
                                    className="mx-auto"
                                    style={{ width: 80, height: 80 }}
                                  >
                                    <CircularProgressbar
                                      value={task.workPercentage}
                                      text={
                                        parseFloat(task.workPercentage).toFixed(
                                          2
                                        ) + "%"
                                      }
                                      styles={buildStyles({
                                        pathColor:
                                          task.workPercentage <= 33.33
                                            ? "#dc3545"
                                            : task.workPercentage >= 66.67
                                            ? "#198754"
                                            : "#0d6efd",
                                        textColor:
                                          task.workPercentage <= 33.33
                                            ? "#dc3545"
                                            : task.workPercentage >= 66.67
                                            ? "#198754"
                                            : "#0d6efd",
                                      })}
                                    />
                                  </div>
                                </>
                              )}
                            </p>
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
                          <div className="table-responsive">
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
                                              {user.Status === "In Process" ? (
                                                <>
                                                  <>
                                                    <span className="badge rounded-pill text-dark bg-info">
                                                      {user.Status}
                                                    </span>
                                                  </>
                                                </>
                                              ) : (
                                                <>
                                                  <span className="badge rounded-pill text-dark bg-warning">
                                                    {user.Status}
                                                  </span>
                                                </>
                                              )}
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
                        <div className="container shadow border rounded p-3 mt-2">
                          <h2 className="text-cneter mb-4">Tasks</h2>
                          <div style={{ maxWidth: "100%", height: "50vh" }}>
                            <Bar
                              className="border border-info rounded"
                              data={chartData}
                              options={chartOptions}
                            />
                          </div>
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
                  <div
                    className="container border rounded shadow p-3 mt-2"
                    style={{ height: "45vh", overflowY: "auto" }}
                  >
                    <h3>Admin Comments</h3>
                    {loading ? (
                      <>Loading...</>
                    ) : (
                      <>
                        {project.AdminComments.map((comment) => (
                          <div className="w-100 mb-2 p-2 bg-info rounded">
                            <span>
                              {comment.message}
                              <sub className="mx-1 mt-1">
                                {comment.dateTime
                                  .toDate()
                                  .toLocaleString("en-IN")}
                              </sub>
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                  <div
                    className="container border rounded shadow p-3 mt-2"
                    style={{ height: "45vh", overflowY: "auto" }}
                  >
                    <h3>User Comments</h3>
                    {loading ? (
                      <>Loading...</>
                    ) : (
                      <>
                        {project.UserComments.map((comment) => (
                          <div className="mb-1">
                            <span>
                              <Avatar
                                name={comment.user}
                                size={40}
                                round={true}
                                className="mx-1 mb-1"
                              />
                            </span>
                            &nbsp;:&nbsp;
                            <span
                              className="bg-primary p-2"
                              style={{ borderRadius: "10px" }}
                            >
                              {comment.message}
                              <sub className="mx-1">
                                {comment.dateTime
                                  .toDate()
                                  .toLocaleString("en-IN")}
                              </sub>
                            </span>
                          </div>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Modal component */}
          <Modal
            show={modalShow}
            onHide={() => setModalShow(false)}
            size="md"
            aria-labelledby="contained-modal-title-vcenter"
            centered
          >
            <Modal.Header>
              <Modal.Title id="contained-modal-title-vcenter">
                Add Comment
              </Modal.Title>
            </Modal.Header>
            <Modal.Body>
              <form className="form">
                <textarea
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  rows={5}
                  className="form-control p-3 rounded w-100"
                  placeholder="Enter your comment here..."
                  required
                />
              </form>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="success" onClick={handleComment}>
                Send
              </Button>
              <Button variant="danger" onClick={() => setModalShow(false)}>
                Close
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      ) : (
        <>
          <div className="text-center mt-5 fs-1">
            You Are Not Authorized To Access This Page.
            <br />
            <Link to="/login">Login</Link>
          </div>
        </>
      )}
    </>
  );
};

export default ProjectDetails;
