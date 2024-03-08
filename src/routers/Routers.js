import React from 'react'
import { Route, Routes } from 'react-router-dom'
import Home from '../Components/Home';
import Login from '../Components/Login';
import Register from '../Components/Register';
import Dashboard from '../Components/Dashboard';
import AdminDashboard from '../Components/AdminDashboard';
import AddProject from '../Components/AddProject';
import Project from '../Components/Project';
import Pending from '../Components/Pending';
import Completed from '../Components/Completed';
import Profile  from '../Components/Profile';
import ProjectInfromation from '../Components/ProjectInfromation';
import Task from '../Components/Task';

const Routers = () => {
  return (
    <div>
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />}/>
        <Route path='/register' element={<Register />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/dashboard' element={<Dashboard />} />
        <Route path='/project' element={<Project />} />
        <Route path='/project/:id' element={<ProjectInfromation />} />
        <Route path='/pending' element={<Pending />} />
        <Route path='/complete' element={<Completed />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/admin/add' element={<AddProject />} />
        <Route path='/admin/task' element={<Task />} />
      </Routes>
    </div>
  )
}

export default Routers;