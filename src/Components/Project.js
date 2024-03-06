import React, { useEffect, useState } from "react";
import { db } from "../Firebase";

const Project = () => {
  const [project, setProject] = useState([]);

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data());
      setProject(data);
    });

    return () => unsubscribe();
  }, []);

  return (
    <>
      <div>
        <h1 className="text-center mt-2">Projects</h1>
        <div className="container border rounded">
          {project.map((project, index) => (
            <div key={index} className="card">
              <p className="card-title">{project.Title}</p>
              <p className="card-body">{project.Date}</p>
              <p className="card-body">{project.Description}</p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default Project;
