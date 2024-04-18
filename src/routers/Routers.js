import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Components/User/Home";
import Login from "../Components/Login";
import Register from "../Components/Register";
import AdminDashboard from "../Components/Admin/AdminDashboard";
import AddProject from "../Components/Admin/AddProject";
import MyProject from "../Components/User/MyProject";
import Pending from "../Components/User/Pending";
import Completed from "../Components/User/Completed";
import Profile from "../Components/User/Profile";
import ProjectInfromation from "../Components/User/ProjectInfromation";
import AddTask from "../Components/Admin/AddTask";
import ProjectDetails from "../Components/Admin/ProjectDetails";
import Users from "../Components/Admin/Users";
import ProjectStatus from "../Components/Admin/ProjectStatus";
import Review from "../Components/User/Review";
import AdminReview from "../Components/Admin/AdminReview";

const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myprojects" element={<MyProject />} />
        <Route
          path="/myprojects/project/:id"
          element={<ProjectInfromation />}
        />
        <Route path="/pending" element={<Pending />} />
        <Route path="/review" element={<Review />} />
        <Route path="/complete" element={<Completed />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add" element={<AddProject />} />
        <Route path="/admin/review" element={<AdminReview />} />
        <Route path="/admin/status" element={<ProjectStatus />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/:projectId/addtask" element={<AddTask />} />
        <Route
          path="/admin/dashboard/project/:id"
          element={<ProjectDetails />}
        />
      </Routes>
    </div>
  );
};

export default Routers;
