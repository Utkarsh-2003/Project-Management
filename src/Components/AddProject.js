import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../Firebase";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { useNavigate } from "react-router-dom";

const AddProject = () => {
  const projectId = uuidv4();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setProjects(data);
    });

    db.collection("user")
      .get()
      .then((snapshot) => {
        const usersData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setUsers(usersData);
      });

    return () => unsubscribe();
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (
      !title.trim() ||
      !date ||
      !description.trim() ||
      selectedUsers.length === 0
    ) {
      alert("Fill in all the details.");
      return;
    }
    // If all fields are filled, proceed with the submission
    if (editingProjectId) {
      handleSaveEditProduct(e);
    } else {
      handleAddProject();
    }
  };

  const handleAddProject = () => {
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
              SelectedUsers: selectedUsers,
              Tasks: [],
            })
            .then((docRef) => {
              console.log("Project Added:", docRef.id);
              alert("Project Added.");
              navigate(`/admin/${projectId}/addtask`);
              setTitle("");
              setDate("");
              setDescription("");
              setSelectedUsers([]);
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

  const handleEditProject = (projectId) => {
    const projectToEdit = projects.find((project) => project.id === projectId);
    if (projectToEdit) {
      setEditingProjectId(projectId);
      setTitle(projectToEdit.Title);
      setDate(projectToEdit.DueDate);
      setDescription(projectToEdit.Description);
      setSelectedUsers(projectToEdit.SelectedUsers);
    }
  };

  const handleSaveEditProduct = (e) => {
    e.preventDefault();

    if (
      !title.trim() ||
      !date ||
      !description.trim() ||
      selectedUsers.length === 0
    ) {
      alert("Fill in all the details.");
      return;
    }
    db.collection("Projects")
      .doc(editingProjectId)
      .update({
        Title: title,
        DueDate: date,
        Description: description,
        SelectedUsers: selectedUsers,
      })
      .then(() => {
        console.log("Project updated in Firestore:", editingProjectId);
      })
      .catch((error) => {
        console.error("Error updating project in Firestore: ", error);
      });
    setEditingProjectId(null);
    setTitle("");
    setDate("");
    setDescription("");
    setSelectedUsers([]);
  };

  const animatedComponents = makeAnimated();

  const userOptions = users.map((user) => ({
    value: user.email,
    label: user.name,
  }));

  return (
    <>
      <div className="p-3">
        <div className="mb-3">
          <h1 className="text-center mt-3 mb-3">Add/Manage Project</h1>
          <div
            className="container border shadow rounded p-3"
            style={{ maxWidth: "400px" }}
          >
            <form onSubmit={handleSubmit}>
              <div className="form-floating">
                <input
                  type="text"
                  placeholder="Title"
                  className="form-control mb-2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                />
                <label htmlFor="floatingInput">Title</label>
              </div>
              <div className="form-floating">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="form-control mb-2"
                  required
                />
                <label htmlFor="floatingInput">Due Date</label>
              </div>
              <div className="form-floating">
                <textarea
                  placeholder="Description"
                  rows={5}
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="form-control mb-2 mt-3"
                  required
                />
                <label htmlFor="floatingInput">Description</label>
              </div>
              <Select
                className="mb-2"
                placeholder="Select User."
                closeMenuOnSelect={false}
                components={animatedComponents}
                options={userOptions}
                isMulti
                value={selectedUsers} // Set selected users
                onChange={(selected) => setSelectedUsers(selected)} // Update selected users
              />
              <button type="submit" className="button btn btn-success">
                {editingProjectId ? "Save" : "Add Project"}
              </button>
            </form>
          </div>
        </div>
        <table
          className="table table-bordered mx-auto"
          style={{ maxWidth: "500px" }}
        >
          <thead className="thead-dark">
            <tr>
              <th className="text-center">Project Name</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr className="mx-2" key={index}>
                <td className="text-center">{project.Title}</td>
                <td>
                  <button
                    className="mx-2 btn text-warning fa-solid fa-pen-to-square"
                    title="Edit project"
                    onClick={() => handleEditProject(project.id)}
                  ></button>
                  <button
                    className="btn btn-primary btn-sm"
                    onClick={() =>
                      navigate(`/admin/${project.ProjectId}/addtask`)
                    }
                  >
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      width="16"
                      height="16"
                      fill="currentColor"
                      class=" mb-1 bi bi-plus-circle"
                      viewBox="0 0 16 16"
                    >
                      <path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14m0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16" />
                      <path d="M8 4a.5.5 0 0 1 .5.5v3h3a.5.5 0 0 1 0 1h-3v3a.5.5 0 0 1-1 0v-3h-3a.5.5 0 0 1 0-1h3v-3A.5.5 0 0 1 8 4" />
                    </svg>
                    &nbsp;Task
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default AddProject;
