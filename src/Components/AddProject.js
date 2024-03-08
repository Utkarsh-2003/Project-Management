import React, { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import { db } from "../Firebase";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const AddProject = () => {
  const projectId = uuidv4();
  const [projects, setProjects] = useState([]);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState(new Date());
  const [description, setDescription] = useState("");
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [users, setUsers] = useState([]);
  const [selectedUsers, setSelectedUsers] = useState([]); // State to store selected users

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
    if (!title.trim() || !date || !description.trim() || selectedUsers.length === 0) {
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
              
            })
            .then((docRef) => {
              console.log("Project Added:", docRef.id);
              alert("Project Added.");
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

    if (!title.trim() || !date || !description.trim() || selectedUsers.length === 0) {
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
          <h1 className="text-center mt-3 mb-3">Add Project</h1>
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
              <button
                type="submit"
                className="button btn btn-success"
              >
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
              <th className="text-center">Name</th>
              <th className="text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project, index) => (
              <tr key={index}>
                <td className="text-center">{project.Title}</td>
                <td>
                  <button
                    className="btn text-warning fa-solid fa-pen-to-square"
                    onClick={() => handleEditProject(project.id)}
                  ></button>
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
