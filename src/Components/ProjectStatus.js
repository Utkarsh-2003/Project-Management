import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useNavigate } from "react-router-dom";

const ProjectStatus = () => {
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setProjects(data);
    });

    return () => unsubscribe();
  }, []);

  const calculateWorkPercentage = (tasks) => {
    return tasks.reduce((acc, task) => {
      let completedCount = task.SelectedUsers.filter(
        (user) => user.Status === "Completed"
      ).length;
      task.workPercentage = (completedCount / task.SelectedUsers.length) * 100;
      return acc + task.workPercentage;
    }, 0);
  };

  const calculateProjectPercentage = (project) => {
    if (project.Tasks.length === 0) return 0;
    const totalWorkPercentage = calculateWorkPercentage(project.Tasks);
    return totalWorkPercentage / project.Tasks.length;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  };

  return (
    <>
      <div className="p-2">
        <div className="row g-2">
          <div className="col-lg-6">
            <div className="container border rounded">
              <h2 className="text-danger p-2 border-bottom">
                Pending Projects
              </h2>
              <div className="row">
                {projects
                  .filter(
                    (project) => calculateProjectPercentage(project) !== 100
                  )
                  .map((project) => (
                    <div className="col-lg-6">
                      <div
                        className="card mb-2 border-0"
                        onClick={() =>
                          navigate(
                            `/admin/dashboard/project/${project.ProjectId}`
                          )
                        }
                        style={{ cursor: "pointer" }}
                        key={project.id}
                      >
                        <h3 className="card-header border border-danger bg-danger-subtle">
                          {project.Title}
                        </h3>
                        <div className="card-body  border border-dark rounded-bottom border-top-0">
                          <p className="card-text">
                            DueDate : {formatDate(project.DueDate)}
                          </p>
                          <div className="card-text bg-white border-0">
                            Progress :{" "}
                            <strong>
                              {parseFloat(
                                calculateProjectPercentage(project)
                              ).toFixed(2)}
                              %
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="container border rounded">
              <h2 className="text-success p-2 border-bottom">
                Completed Projects
              </h2>
              <div className="row">
                {projects
                  .filter(
                    (project) => calculateProjectPercentage(project) === 100
                  )
                  .map((project) => (
                    <div className="col-lg-6">
                      <div
                        className="card mb-2 border-0"
                        onClick={() =>
                          navigate(
                            `/admin/dashboard/project/${project.ProjectId}`
                          )
                        }
                        style={{ cursor: "pointer" }}
                        key={project.id}
                      >
                        <h3 className="card-header  border border-success bg-success-subtle">
                          {project.Title}
                        </h3>
                        <div className="card-body border border-dark rounded-bottom border-top-0">
                          <p className="card-text">
                            DueDate : {formatDate(project.DueDate)}
                          </p>
                          <div className="card-text bg-white border-0">
                            Progress :{" "}
                            <strong>
                              {parseFloat(
                                calculateProjectPercentage(project)
                              ).toFixed(2)}
                              %
                            </strong>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectStatus;
