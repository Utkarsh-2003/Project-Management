import React from "react";
import { Route, Routes } from "react-router-dom";
import Home from "../Components/Home";
import Login from "../Components/Login";
import Register from "../Components/Register";
import AdminDashboard from "../Components/AdminDashboard";
import AddProject from "../Components/AddProject";
import MyProject from "../Components/MyProject";
import Pending from "../Components/Pending";
import Completed from "../Components/Completed";
import Profile from "../Components/Profile";
import ProjectInfromation from "../Components/ProjectInfromation";
import AddTask from "../Components/AddTask";
import ProjectDetails from "../Components/ProjectDetails";
import Users from "../Components/Users";
import ProjectStatus from "../Components/ProjectStatus";
import Review from "../Components/Review";
import AdminReview from "../Components/AdminReview";

const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/myprojects" element={<MyProject />} />
        <Route path="/myprojects/project/:id" element={<ProjectInfromation />} />
        <Route path="/pending" element={<Pending />} />
        <Route path="/review" element={<Review />} />
        <Route path="/complete" element={<Completed />} />
        <Route path="/admin/dashboard" element={<AdminDashboard />} />
        <Route path="/admin/add" element={<AddProject />} />
        <Route path="/admin/review" element={<AdminReview />} />
        <Route path="/admin/status" element={<ProjectStatus />} />
        <Route path="/admin/users" element={<Users />} />
        <Route path="/admin/:projectId/addtask" element={<AddTask />} />
        <Route path="/admin/dashboard/project/:id" element={<ProjectDetails />} />
      </Routes>
    </div>
  );
};

export default Routers;
