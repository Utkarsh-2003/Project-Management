import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import Login from "./Login";

const Pending = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  const [projects, setProjects] = useState([]);
  const user = useSelector((state) => state.user.email);

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
              <div className="row row-cols-1 row-cols-md-2 row-cols-lg-3 g-4 p-2">
                {projects.length === 0 ? (
                  <li className="list-group-item">No Work</li>
                ) : (
                  projects.map((project, index) => (
                    <table
                      key={index}
                      className="table table-hover table-bordered"
                    >
                      <thead>
                        <tr>
                          <th>Task Name</th>
                          <th>Description</th>
                          <th>Colleagues</th>
                        </tr>
                      </thead>
                      <tbody>
                        {project.Tasks.map((task, taskIndex) =>
                          // Filter tasks based on user email
                          task.SelectedUsers.some(
                            (selectedUser) => selectedUser.value === user
                          ) ? (
                            <>
                              <tr key={taskIndex}>
                                <td>{task.Title}</td>
                                <td>{task.Description}</td>
                                <td>
                                  {task.SelectedUsers.map((user, userIndex) => (
                                    <span key={userIndex}>{user.label}</span>
                                  ))}
                                </td>
                              </tr>
                            </>
                          ) : null
                        )}
                      </tbody>
                    </table>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <Login />
      )}
    </>
  );
};

export default Pending;
