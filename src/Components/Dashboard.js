import React from 'react'
import { useSelector } from 'react-redux';
import Login from "./Login"
const Dashboard = () => {
  const isAuthenticated = useSelector((state) => state.isAuthenticated);
  return (
    <>
    {isAuthenticated ? (<><div>
      Dashboard
    </div></>) : (<><Login /></>)}
    
    </>
  )
}

export default Dashboard
