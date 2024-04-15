import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

const AdminReview = () => {
  const [projects, setProjects] = useState([]);
  const admin = useSelector((state) => state.admin);

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setProjects(data);
    });

    return () => unsubscribe();
  }, []);

  const handleTask = (ProjectId, TaskId, Title, user) => {
    Swal.fire({
      title: `Are you sure to complete this task <strong>${Title}</strong> ?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#198754",
      cancelButtonText: "No",
      cancelButtonColor: "#dc3545",
      width: "450px",
    }).then((result) => {
      if (result.isConfirmed) {
        const projectRef = db
          .collection("Projects")
          .where("ProjectId", "==", ProjectId);

        projectRef
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              console.error(`Project with ID ${ProjectId} not found.`);
              return;
            }

            querySnapshot.forEach((doc) => {
              const projectData = doc.data();
              const task = projectData.Tasks.find(
                (task) => task.TaskId === TaskId
              );

              if (!task) {
                console.error(
                  `Task with ID ${TaskId} not found in project ${ProjectId}.`
                );
                return;
              }

              const userStatus = task.SelectedUsers.find(
                (userStatus) => userStatus.value === user
              );

              if (userStatus && userStatus.Status === "Completed") {
                console.log(
                  `Task with ID ${TaskId} is already completed by user.`
                );
                return;
              }

              const updatedTasks = projectData.Tasks.map((task) =>
                task.TaskId === TaskId
                  ? {
                      ...task,
                      SelectedUsers: task.SelectedUsers.map((userStatus) =>
                        userStatus.value === user
                          ? { ...userStatus, Status: "Completed" }
                          : userStatus
                      ),
                    }
                  : task
              );

              const updatedProjectData = {
                ...projectData,
                Tasks: updatedTasks,
              };

              // Update the document in Firestore
              db.collection("Projects")
                .doc(doc.id)
                .update(updatedProjectData)
                .then(() => {
                  Swal.fire({
                    text: `Task completed.`,
                    icon: "success",
                  });
                })
                .catch((error) => {
                  console.error("Error updating document: ", error);
                });
            });
          })
          .catch((error) => {
            console.error("Error getting documents:", error);
          });
      }
    });
  };

  const handleUnsubmit = (ProjectId, TaskId, Title, user) => {
    Swal.fire({
      title: `Are you sure to unsubmit this task <strong>${Title}</strong> ?`,
      icon: "info",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#198754",
      cancelButtonText: "No",
      cancelButtonColor: "#dc3545",
      width: "450px",
    }).then((result) => {
      if (result.isConfirmed) {
        const projectRef = db
          .collection("Projects")
          .where("ProjectId", "==", ProjectId);

        projectRef
          .get()
          .then((querySnapshot) => {
            if (querySnapshot.empty) {
              console.error(`Project with ID ${ProjectId} not found.`);
              return;
            }

            querySnapshot.forEach((doc) => {
              const projectData = doc.data();
              const task = projectData.Tasks.find(
                (task) => task.TaskId === TaskId
              );

              if (!task) {
                console.error(
                  `Task with ID ${TaskId} not found in project ${ProjectId}.`
                );
                return;
              }

              const userStatus = task.SelectedUsers.find(
                (userStatus) => userStatus.value === user
              );

              if (userStatus && userStatus.Status === "Completed") {
                console.log(
                  `Task with ID ${TaskId} is already completed by user ${user}.`
                );
                return;
              }

              const updatedTasks = projectData.Tasks.map((task) =>
                task.TaskId === TaskId
                  ? {
                      ...task,
                      SelectedUsers: task.SelectedUsers.map((userStatus) =>
                        userStatus.value === user
                          ? { ...userStatus, Status: "In Process" }
                          : userStatus
                      ),
                    }
                  : task
              );

              const updatedProjectData = {
                ...projectData,
                Tasks: updatedTasks,
              };

              // Update the document in Firestore
              db.collection("Projects")
                .doc(doc.id)
                .update(updatedProjectData)
                .then(() => {
                  Swal.fire({
                    text: `Task Assigned!`,
                    icon: "success",
                  });
                })
                .catch((error) => {
                  console.error("Error updating document: ", error);
                });
            });
          })
          .catch((error) => {
            console.error("Error getting documents:", error);
          });
      }
    });
  };

  return (
    <>
      {admin ? (
        <>
          <div className="p-2">
            <h1 className="text-center">Tasks For Review</h1>
            <div className="container mt-4 border rounded p-4">
              {projects.some((project) =>
                project.Tasks.some((task) =>
                  task.SelectedUsers.some(
                    (selectedUser) => selectedUser.Status === "In Review"
                  )
                )
              ) ? (
                <div className="row">
                  {projects.map((project, index) => {
                    const userTasks = project.Tasks.filter((task) =>
                      task.SelectedUsers.some(
                        (selectedUser) => selectedUser.Status === "In Review"
                      )
                    );

                    if (userTasks.length === 0) {
                      return null;
                    }

                    return (
                      <div
                        className="mb-3 col-lg-12 col-sm-12 col-xs-12"
                        key={index}
                      >
                        <div className="shadow shadow-sm card mb-3 w-100 h-100 border-0 overflow-auto">
                          <h4 className="card-header bg-primary-subtle border border-primary">
                            {project.Title}
                          </h4>
                          <div className="card-body border border-dark border-top-0 rounded-bottom">
                            <div className="table-responsive">
                              <table className="table table-hover w-100">
                                <thead>
                                  <tr>
                                    <th>Task Name</th>
                                    <th>User</th>
                                    <th>Description</th>
                                    <th>Attachment</th>
                                    <th>Action</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {userTasks.map((task, taskIndex) => (
                                    <>
                                      {task.SelectedUsers.map((user) => (
                                        <>
                                          {user.Status === "In Review" ? (
                                            <>
                                              <tr key={taskIndex}>
                                                <td>{task.Title}</td>
                                                <td>
                                                  {user.label.split(" ")[0]}
                                                </td>
                                                <td>{task.Description}</td>
                                                <td>
                                                  {user.File ? (
                                                    <>
                                                      <Link
                                                        to={user.File}
                                                        className="btn btn-sm   btn-info"
                                                        target="_blank"
                                                      >
                                                        View File
                                                      </Link>
                                                    </>
                                                  ) : (
                                                    <>No Attachment</>
                                                  )}
                                                </td>
                                                <td>
                                                  <button
                                                    className="btn btn-sm btn-danger mb-1"
                                                    onClick={() =>
                                                      handleUnsubmit(
                                                        project.ProjectId,
                                                        task.TaskId,
                                                        task.Title,
                                                        user.value
                                                      )
                                                    }
                                                  >
                                                    Mark for Rework
                                                  </button>
                                                  <button
                                                    className="btn btn-sm btn-success mx-2 mb-1"
                                                    onClick={() =>
                                                      handleTask(
                                                        project.ProjectId,
                                                        task.TaskId,
                                                        task.Title,
                                                        user.value
                                                      )
                                                    }
                                                  >
                                                    Mark as Done
                                                  </button>
                                                </td>
                                              </tr>
                                            </>
                                          ) : (
                                            <></>
                                          )}
                                        </>
                                      ))}
                                    </>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                <span>All work due.</span>
              )}
            </div>
          </div>
        </>
      ) : (
        <>
          <div className="text-center mt-5 fs-1">
            Log in to see your completed work.
            <br />
            <Link to="/login">Login</Link>
          </div>
        </>
      )}
    </>
  );
};

export default AdminReview;
