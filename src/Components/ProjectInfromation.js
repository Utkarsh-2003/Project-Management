import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useNavigate, useParams } from "react-router-dom";
import Avatar from "react-avatar";

const ProjectInformation = () => {
  const { id } = useParams();
  const [project, setProject] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db
      .collection("Projects")
      .where("ProjectId", "==", id)
      .onSnapshot((snapshot) => {
        const data = snapshot.docs.map((doc) => doc.data());
        if (data.length > 0) {
          setProject(data[0]); // Assuming there's only one project with a given ID
        }
      });

    return () => unsubscribe();
  }, [id]);

  return (
    <div className="p-3">
      <button
        className="btn mx-1 mb-3 mt-5"
        onClick={() => navigate("/dashboard")}
      >
        <u>Back</u>
      </button>
      {project && (
        <div className="container p-3 shadow" style={{ borderRadius: "10px" }}>
          <h2>{project.Title}</h2>
          <p>{project.Description}</p>
          <table
            className="table table-bordered mx-auto"
            style={{ maxWidth: "500px" }}
          >
            <thead className="thead-dark">
              <tr>
                <th className="text-center">Task Name</th>
                <th className="text-center">Description</th>
                <th className="text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {project.Tasks.map((task, index) => (
                <tr key={index}>
                  <td>{task.Title}</td>
                  <td>{task.Description}</td>
                  <td>Pending</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="d-flex justify-content-start align-items-center">
            Assigned To:&nbsp;&nbsp;
            {project.SelectedUsers.map((user, index) => (
              <Avatar
                key={index}
                name={user.value[0]}
                size={40}
                round={true}
                className="me-2"
                title={user.label}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ProjectInformation;
