import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "react-avatar";
import { useSelector } from "react-redux";
import { Button, Modal } from "react-bootstrap";
import { toast } from "react-toastify";

const ProjectInfromation = () => {
  const { id } = useParams();
  const user = useSelector((state) => state.user);
  const [project, setProject] = useState({
    AdminComments: [],
    UserComments: [],
  });
  const [daysLeft, setDaysLeft] = useState(null);
  const [daysOver, setDaysOver] = useState(0);
  const [loading, setLoading] = useState(true);
  const [modalShow, setModalShow] = React.useState(false);
  const [comment, setComment] = useState("");
  const navigate = useNavigate();

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim() !== "") {
      db.collection("Projects")
        .where("ProjectId", "==", id)
        .get()
        .then((querySnapshot) => {
          querySnapshot.forEach((doc) => {
            let Comments = doc.data().UserComments;
            Comments.push({
              user: user,
              dateTime: new Date(),
              message: comment,
            });
            doc.ref.update({
              UserComments: Comments,
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

  const addComment = () => {
    setModalShow(true);
  };

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

  const adminComments = project.AdminComments
    ? project.AdminComments.map((comment) => comment)
    : [];
  const userComments = project.UserComments
    ? project.UserComments.map((comment) => comment)
    : [];
  const mergedComments = [...adminComments, ...userComments];
  const sortedComments = mergedComments.sort((a, b) => a.dateTime - b.dateTime);

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
                    <div
                      className="container border rounded p-3 shadow mt-2"
                      style={{ height: "50vh", overflowY: "auto" }}
                    >
                      <h3 className="mb-2">Comments</h3>
                      <div className="p-3">
                        {loading ? (
                          <>Loading...</>
                        ) : (
                          <>
                            {sortedComments.map((comment, index) => (
                              <div
                                key={index}
                                className={`comment ${
                                  comment.user
                                    ? "text-end"
                                    : "text-start mb-3"
                                }`}
                              >
                                {comment.user ? (
                                  <>
                                    <span className="bg-primary p-2 rounded text-white">
                                      {comment.message}
                                      <sub className="mx-1 mt-1">
                                        {comment.dateTime
                                          .toDate()
                                          .toLocaleString()}
                                      </sub>
                                    </span>
                                    <span>
                                      <Avatar
                                        name={comment.user}
                                        size={40}
                                        round={true}
                                        className="mx-1 mb-1"
                                      />
                                    </span>
                                  </>
                                ) : (
                                  <span className="bg-info p-2 rounded text-white">
                                    {comment.message}
                                    <sub className="mx-1 mt-1">
                                      {comment.dateTime
                                        .toDate()
                                        .toLocaleString()}
                                    </sub>
                                  </span>
                                )}
                              </div>
                            ))}
                          </>
                        )}
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
  );
};

export default ProjectInfromation;
