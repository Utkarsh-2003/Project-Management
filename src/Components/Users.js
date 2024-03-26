import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import Avatar from "react-avatar";
import { Bar } from "react-chartjs-2";
import {
  Chart as Chartjs,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
} from "chart.js/auto";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";

Chartjs.register(LineElement, CategoryScale, LinearScale, PointElement);

const Users = () => {
  const admin = useSelector((state) => state.admin);
  const [users, setUsers] = useState([]);
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = db.collection("Projects").onSnapshot((snapshot) => {
      const data = snapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setProjects(data);
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await db.collection("user").get();
      const usersData = usersSnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
        totalTask: 0,
      }));
      setUsers(usersData);
      setLoading(false);
    };

    fetchUsers();
  }, []);

  useEffect(() => {
    users.forEach((user) => {
      let count = 0;
      projects.forEach((project) => {
        project.Tasks.forEach((task) => {
          if (
            task.SelectedUsers.some((userVal) => userVal.value === user.email)
          ) {
            count++;
          }
        });
      });
      user.totalTask = count;
    });
    setUsers([...users]);
    setLoading(false);
  }, [projects]);

  // Prepare data for the chart
  const chartData = {
    labels: users.map((user) => user.name),
    datasets: [
      {
        label: "Tasks Assigned",
        backgroundColor: "rgba(75,192,192,1)",
        borderColor: "rgba(75,192,192,1)",
        borderWidth: 1,
        hoverBackgroundColor: "rgba(75,192,192,0.4)",
        hoverBorderColor: "rgba(75,192,192,0.2)",
        data: users.map((user) => user.totalTask),
      },
    ],
  };

  const chartOptions = {
    maintainAspectRatio: false,
    scales: {
      x: {
        grid: {
          display: false, // Hide x-axis grid lines
        },
      },
      y: {
        grid: {
          display: false, // Hide y-axis grid lines
        },
      },
    },
  };

  return (
    <>
      {admin ? (
        <>
          {loading ? (
            <>Loading ...</>
          ) : (
            <>
              <div className="p-3">
                <div className="row">
                  <div className="col-lg-4 mb-2">
                    <div className="container shadow border rounded p-3">
                      <h2 className="mb-4">All Users</h2>
                      <ul className="list-unstyled">
                        {users
                          .sort((a, b) => a.name.localeCompare(b.name))
                          .map((user, index) => (
                            <li
                              key={index}
                              className="d-flex align-items-center mb-3"
                            >
                              <div className="container border rounded p-2 shadow">
                                <Avatar
                                  name={user.name[0]}
                                  size={40}
                                  round={true}
                                  className="me-2"
                                  title={user.name}
                                />
                                <span>{user.name}</span>
                              </div>
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                  <div className="col-lg-8">
                    <div className="container shadow border rounded p-2">
                      <h2 className="text-cneter mb-4">Tasks</h2>
                      <div style={{ maxWidth: "100%", height: "70vh" }}>
                        <Bar
                          className="border rounded"
                          data={chartData}
                          options={chartOptions}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}
        </>
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

export default Users;
