import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useNavigate, useParams } from "react-router-dom";

const ProjectInfromation = () => {
  const { id } = useParams();
  const [projects, setProjects] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => doc.data(id));
      setProjects(data);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div>
        <button className="btn"onClick={() => navigate("/project")}>Back</button>
      {id}
      {projects.map((project, index) => (
        <div key={index}></div>
      ))}
    </div>
  );
};

export default ProjectInfromation;
