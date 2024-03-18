import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { db } from "../Firebase";
import { v4 } from "uuid";
import Select from "react-select";
import makeAnimated from "react-select/animated";

const AddTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const taskId = v4();
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUsersForTask, setSelectedUsersForTask] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTaskId, setEditingTaskId] = useState(null);

  useEffect(() => {
    db.collection("Projects")
      .where("ProjectId", "==", projectId)
      .get()
      .then((snapshot) => {
        const data = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        if (data.length > 0) {
          const projectData = data[0];
          setTasks(projectData.Tasks);
          setSelectedUsers(projectData.SelectedUsers);
          setLoading(false);
        }
      });
  }, [projectId]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) {
      alert("Fill in all the details.");
    } else {
      if (editingTaskId) {
        const updatedTasks = tasks.map((task) =>
          task.TaskId === editingTaskId
            ? {
                ...task,
                Title: title,
                Description: description,
                SelectedUsers: selectedUsersForTask,
              }
            : task
        );
        db.collection("Projects")
          .where("ProjectId", "==", projectId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              doc.ref.update({
                Tasks: updatedTasks,
              });
            });
            alert(`Task Updated`);
            setEditingTaskId(null);
            setTitle("");
            setDescription("");
            setSelectedUsersForTask([]);
          });
      } else {
        db.collection("Projects")
          .where("ProjectId", "==", projectId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              let tasks = doc.data().Tasks;
              tasks.push({
                TaskId: taskId,
                Title: title,
                Description: description,
                SelectedUsers: selectedUsersForTask,
              });
              doc.ref.update({
                Tasks: tasks,
              });
            });
            alert(`Task Added`);
            setTitle("");
            setDescription("");
            setSelectedUsersForTask([]);
          });
      }
    }
  };

  const editTask = (taskId) => {
    const taskToEdit = tasks.find((task) => task.TaskId === taskId);
    if (taskToEdit) {
      setTitle(taskToEdit.Title);
      setDescription(taskToEdit.Description);
      setSelectedUsersForTask(taskToEdit.SelectedUsers); //selectedUsersForTask
      setEditingTaskId(taskId);
    }
  };

  const animatedComponents = makeAnimated();

  const userOptions = selectedUsers.map((user) => ({
    value: user.value,
    label: user.label,
    Status: "In Process",
  }));

  return (
    <div>
      <button className="btn" onClick={() => navigate(`/admin/add`)}>
        Back
      </button>
      {loading ? (
        <>loading...</>
      ) : (
        <>
          <div className="p-3">
            <div className="mb-3">
              <h1 className="text-center mt-3 mb-3">Add Task</h1>
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
                    value={selectedUsersForTask}
                    onChange={(selected) => setSelectedUsersForTask(selected)}
                  />
                  <button type="submit" className="button btn btn-success">
                    {editingTaskId ? "Update Task" : "Add Task"}
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
                  <th className="text-center">Task Name</th>
                  <th className="text-center">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tasks.map((task, index) => (
                  <tr className="mx-2" key={index}>
                    <td className="text-center">{task.Title}</td>
                    <td>
                      <button
                        className="mx-2 btn text-warning fa-solid fa-pen-to-square"
                        onClick={() => editTask(task.TaskId)}
                      ></button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </>
      )}
    </div>
  );
};

export default AddTask;