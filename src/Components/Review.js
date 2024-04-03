import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Review = () => {
  const [projects, setProjects] = useState([]);
  const user = useSelector((state) => state.user);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setProjects(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  const handleTask = (ProjectId, TaskId, Title) => {
    Swal.fire({
      title: `Are you sure to submit this task for review: <strong>${Title}</strong> ?`,
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
                    text: `Task submitted for review.`,
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
      {user ? (
        <>
          {loading ? (
            <>loading...</>
          ) : (
            <>
              <div>
                <div className="p-3">
                  <h1 className="text-center">Tasks Submitted for Review</h1>
                  <div className="container mt-4 border rounded p-3">
                    {projects.some((project) =>
                      project.Tasks.some((task) =>
                        task.SelectedUsers.some(
                          (selectedUser) =>
                            selectedUser.value === user &&
                            selectedUser.Status === "In Review"
                        )
                      )
                    ) ? (
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

                          const pendingTasks = userTasks.filter((task) =>
                            task.SelectedUsers.find(
                              (userStatus) =>
                                userStatus.value === user &&
                                userStatus.Status === "In Review"
                            )
                          );

                          if (pendingTasks.length === 0) {
                            return null;
                          }

                          return (
                            <div className="mb-2 col-lg-6" key={index}>
                              <div className="card my-2 w-100 h-100 border-0">
                                <h4 className="card-header bg-primary-subtle border border-primary">
                                  {project.Title}
                                </h4>
                                <div className="card-body border border-dark border-top-0 rounded-bottom">
                                  <div className="table-responsive">
                                    <table className="table table-hover w-100">
                                      <thead>
                                        <tr>
                                          <th>Task Name</th>
                                          <th>Description</th>
                                          <th>Status</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {pendingTasks.map((task, taskIndex) => (
                                          <tr key={taskIndex}>
                                            <td>{task.Title}</td>
                                            <td>{task.Description}</td>
                                            <td>
                                              {task.SelectedUsers.filter(
                                                (userStatus) =>
                                                  userStatus.value === user
                                              ).map((user) => (
                                                <span className="badge rounded-pill text-dark bg-warning">
                                                  {user.Status}
                                                </span>
                                              ))}
                                            </td>
                                          </tr>
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
                      <div>No tasks for review.</div>
                    )}
                  </div>
                </div>
              </div>
            </>
          )}
        </>
      ) : (
        <>
          <div className="text-center mt-5 fs-1">
            Log in to see your pending work.
            <br />
            <Link to="/login">Login</Link>
          </div>
        </>
      )}
    </>
  );
};

export default Review;
