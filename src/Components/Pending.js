import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import Login from "./Login";
import { Button, Modal } from "react-bootstrap";
import Swal from "sweetalert2";

const Pending = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const [projects, setProjects] = useState([]);
  const user = useSelector((state) => state.user.email);
  const [modalShow, setModalShow] = useState(false);

  const handleTask = () => {
    Swal.fire({
      text: `Task Completed`,
      icon: "success",
    });
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
      {isAuthenticated ? (
        <div>
          <div className="p-3">
            <h1 className="text-center mt-3">Pending Work</h1>
            <div className="container mt-4 border rounded p-3">
              {projects.length === 0 ? (
                <li className="list-group-item">No Work</li>
              ) : (
                <div className="row">
                  {projects.map((project, index) => {
                    const userTasks = project.Tasks.filter((task) =>
                      task.SelectedUsers.some(
                        (selectedUser) => selectedUser.value === user
                      )
                    );

                    if (userTasks.length === 0) {
                      return null;
                    }

                    return (
                      <div className="col-lg-4" key={index}>
                        <h4 className="mx-2">{project.Title}</h4>
                        <div
                          className="card p-2 my-2"
                          style={{ maxWidth: "400px" }}
                        >
                          <table
                            className="table table-hover"
                            style={{ maxWidth: "400px" }}
                          >
                            <thead>
                              <tr>
                                <th>Task Name</th>
                                <th>Description</th>
                                <th>Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {userTasks.map((task, taskIndex) => (
                                <tr key={taskIndex}>
                                  <td>{task.Title}</td>
                                  <td>{task.Description}</td>
                                  <td>
                                    {task.SelectedUsers.map(
                                      (userStatus, index) =>
                                        userStatus.value === user &&
                                        (userStatus.Status !== "Completed" ? (
                                          <button
                                            className="btn btn-success btn-sm"
                                            onClick={() => setModalShow(true)}
                                            key={index}
                                          >
                                            Mark as done
                                          </button>
                                        ) : (<><span className="fa-solid fa-circle-check fs-2 text-success"></span></>) )
                                    )}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}

      {/* Modal for marking a task as completed  */}
      <Modal
        show={modalShow}
        onHide={() => setModalShow(false)}
        size="sm"
        aria-labelledby="contained-modal-title-vcenter"
        centered
      >
        <Modal.Header>
          <Modal.Title>Mark As Done</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Are you sure? This task will be marked as done!</p>
          <div className="text-center">
            <Button
              size="md"
              className="me-2"
              variant="success"
              onClick={() => {
                handleTask();
                setModalShow(false);
              }}
            >
              Mark As Done
            </Button>
            <Button
              size="md"
              variant="danger"
              onClick={() => setModalShow(false)}
            >
              Cancel
            </Button>
          </div>
        </Modal.Body>
      </Modal>
    </>
  );
};

export default Pending;
