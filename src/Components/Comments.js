import React, { useEffect, useState } from "react";
import { db } from "../Firebase";

const Comments = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(data);
      console.log(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);
  return (
    <div>
      <div className="p-3">
        <div className="row">
          <div className="col-md-6 mb-2">
            <div className="container broder rounded shadow p-3">
              <h3>User Comments</h3>
            </div>
          </div>
          <div className="col-md-6">
            <div className="container border rounded shadow p-3">
              <h3>Admin Comments</h3>
              {loading ? (<>Loading...</>) : (<>{projects.map((project) => project.AdminComments.map((cmt) => cmt))}</>)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Comments;
