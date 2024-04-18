import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { db } from "../../Firebase";
import { v4 } from "uuid";
import Select from "react-select";
import makeAnimated from "react-select/animated";
import { toast } from "react-toastify";
import { useSelector } from "react-redux";
import Swal from "sweetalert2";

const AddTask = () => {
  const { projectId } = useParams();
  const navigate = useNavigate();
  const admin = useSelector((state) => state.admin);
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
      .onSnapshot((snapshot) => {
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
      toast.warning("Please fill out all fields!", {
        autoClose: 1500,
        toastId: "empty",
      });
    } else {
      const isDuplicateTitle = tasks.some(
        (task) => task.Title === title && task.TaskId !== editingTaskId
      );
      if (isDuplicateTitle) {
        toast.warning("Task Name Exists!", {
          autoClose: 1500,
          toastId: "sametask",
        });
      } else {
        if (editingTaskId) {
          // Existing task being edited
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
          // Update the task in the database
          db.collection("Projects")
            .where("ProjectId", "==", projectId)
            .get()
            .then((querySnapshot) => {
              querySnapshot.forEach((doc) => {
                doc.ref.update({
                  Tasks: updatedTasks,
                });
              });
              toast.success("Task Updated!", {
                autoClose: 1500,
              });
              setEditingTaskId(null);
              setTitle("");
              setDescription("");
              setSelectedUsersForTask([]);
            });
        } else {
          // New task being added
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
              toast.success("New Task Added!", {
                autoClose: 1500,
              });
              setTitle("");
              setDescription("");
              setSelectedUsersForTask([]);
            });
        }
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

  const removeTask = async (TaskId, Title) => {
    Swal.fire({
      title: `Are you sure to Delete this Task: <strong>${Title}</strong> ?`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonText: "Yes",
      confirmButtonColor: "#198754",
      cancelButtonText: "No",
      cancelButtonColor: "#dc3545",
      width: "450px",
    }).then((result) => {
      if (result.isConfirmed) {
        db.collection("Projects")
          .where("ProjectId", "==", projectId)
          .get()
          .then((querySnapshot) => {
            querySnapshot.forEach((doc) => {
              const task = doc.data().Tasks.map((item) => item);
              const new_task = task.filter((val) => val.TaskId !== TaskId);

              doc.ref.update({ Tasks: new_task });
            });

            toast.error("Task Deleted!", {
              autoClose: 1500,
            });
          });
      }
    });
  };

  const animatedComponents = makeAnimated();

  const userOptions = selectedUsers.map((user) => ({
    value: user.value,
    label: user.label,
    Status: "In Process",
  }));

  return (
    <>
      {admin ? (
        <div>
          <button
            className="btn mt-1"
            title="back"
            onClick={() => navigate("/admin/add")}
          >
            <i className="fa-solid fa-circle-arrow-left fs-3"></i>
          </button>
          {loading ? (
            <>loading...</>
          ) : (
            <>
              <div className="container border rounded p-3">
                <div className="mb-3">
                  <h1 className="text-center mb-5 ">Add/Manage Tasks</h1>
                  <div className="row g-2">
                    <div className="col-lg-6">
                      <div
                        className="container bg-white border border-dark shadow rounded p-3"
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
                            onChange={(selected) =>
                              setSelectedUsersForTask(selected)
                            }
                          />
                          <div className="text-center">
                            <button type="submit" className="btn btn-success">
                              {editingTaskId ? "Update" : "Add"}
                            </button>
                          </div>
                        </form>
                      </div>
                    </div>

                    <div className="col-lg-6">
                      <div className="table-responsive">
                        <table
                          className="table table-bordered mx-auto shadow border-dark"
                          style={{ maxWidth: "500px" }}
                        >
                          <thead className="table-dark">
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
                                    className="btn text-warning fa-solid fa-pen-to-square"
                                    onClick={() => editTask(task.TaskId)}
                                  ></button>
                                  <button
                                    className="btn text-danger fa-solid fa-trash-can"
                                    onClick={() =>
                                      removeTask(task.TaskId, task.Title)
                                    }
                                  ></button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </div>
      ) : (
        <>
          <div className="text-center mt-5 fs-1">
            You Are Not Authorized To Access This Page.
            <br />
            <Link to="/login">Login</Link>
          </div>
        </>
      )}
    </>
  );
};

export default AddTask;
