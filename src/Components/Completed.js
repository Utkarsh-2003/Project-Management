import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";

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

  return (
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

                const completeTasks = userTasks.filter((task) =>
                  task.SelectedUsers.find(
                    (userStatus) =>
                      userStatus.value === user &&
                      userStatus.Status === "Completed"
                  )
                );

                if (completeTasks.length === 0) {
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
                            </tr>
                          </thead>
                          <tbody>
                            {completeTasks.map((task, taskIndex) => (
                              <tr key={taskIndex}>
                                <td>{task.Title}</td>
                                <td>{task.Description}</td>
                                <td>
                                  <i className="fa-solid fa-circle-check fs-3 text-success"></i>
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
  );
};

export default Completed;
