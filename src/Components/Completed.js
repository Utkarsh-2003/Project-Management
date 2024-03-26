import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";
import { Link } from "react-router-dom";

const Completed = () => {
  const [projects, setProjects] = useState([]);
  const user = useSelector((state) => state.user);

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    });

    return () => unsubscribe();
  }, []);

  const handleUnsubmit = (ProjectId, TaskId, Title) => {
    if (window.confirm(`Are you sure to Unsubmit this Task: ${Title} ?`)) {
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

            if (userStatus && userStatus.Status === "In Process") {
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

            const updatedProjectData = { ...projectData, Tasks: updatedTasks };

            // Update the document in Firestore
            db.collection("Projects")
              .doc(doc.id)
              .update(updatedProjectData)
              .then(() => {
                Swal.fire({
                  text: `Task Unsubmitted!`,
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
  };

  return (
    <>
      {user ? (
        <>
          <div className="p-2">
            <h1 className="text-center">Completed Work</h1>
            <div className="container mt-4 border rounded p-3">
              {projects.some((project) =>
                project.Tasks.some((task) =>
                  task.SelectedUsers.some(
                    (selectedUser) =>
                      selectedUser.value === user &&
                      selectedUser.Status === "Completed"
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

                    const completedTasks = userTasks.filter((task) =>
                      task.SelectedUsers.find(
                        (userStatus) =>
                          userStatus.value === user &&
                          userStatus.Status === "Completed"
                      )
                    );

                    if (completedTasks.length === 0) {
                      return null;
                    }

                    return (
                      <div
                        className="mb-2 col-lg-6 col-sm-12 col-xs-12"
                        key={index}
                      >
                        <h4 className="mx-2">{project.Title}</h4>
                        <div className="card p-2 my-2 w-100 h-75">
                          <div className="table-responsive">
                            <table className="table table-hover w-100">
                              <thead>
                                <tr>
                                  <th>Task Name</th>
                                  <th>Description</th>
                                  <th>Status</th>
                                  <th></th>
                                </tr>
                              </thead>
                              <tbody>
                                {completedTasks.map((task, taskIndex) => (
                                  <tr key={taskIndex}>
                                    <td>{task.Title}</td>
                                    <td>{task.Description}</td>
                                    <td>
                                      <i className="fa-solid fa-circle-check fs-3 text-success"></i>
                                    </td>
                                    <td>
                                      <button
                                        className="btn btn-sm btn-danger"
                                        onClick={() =>
                                          handleUnsubmit(
                                            project.ProjectId,
                                            task.TaskId,
                                            task.Title
                                          )
                                        }
                                      >
                                        Unsubmit
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
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
            Log in to see your completed work.<br /><Link to="/login">Login</Link>
          </div>
        </>
      )}
    </>
  );
};

export default Completed;
