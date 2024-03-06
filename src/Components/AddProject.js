import React, { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../Firebase";

const AddProject = () => {
  const projectId = uuidv4();
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    db.collection(`Projects`)
      .where("Title", "==", title)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) {
          db.collection(`Projects`)
            .add({
              ProjectId: projectId,
              Title: title,
              DueDate: date,
              Description: description,
            })
            .then((docRef) => {
              console.log("Project Added:", docRef.id);
              alert("Project Added.");
            })
            .catch((error) => {
              console.error("Error adding project:", error);
            });
        } else {
          console.log("Duplicate Project found");
          alert("This project name already exists.");
        }
      })
      .catch((error) => {
        console.error("Error querying document:", error);
      });
  };
  return (
    <>
      <div>
        <h1 className="text-center mt-3 mb-3">Add Project</h1>
        <div
          className="container border rounded p-2"
          style={{ maxWidth: "400px" }}
        >
          <form onSubmit={handleSubmit}>
            <input
              type="text"
              placeholder="Title"
              className="form-control mb-2"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            Due Date:{" "}
            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="form-control mb-2"
            />
            <textarea
              placeholder="Description"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="form-control mb-2 mt-3"
            ></textarea>
            <button className="btn btn-primary text-center">Add</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default AddProject;
