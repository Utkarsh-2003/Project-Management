import React from "react";
import { useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  return (
    <div className="text-center">
      <h1 className="text-center mt-5 mb-3">
        Welcome. Please navigate through our website.
      </h1>
      <button
        className="btn btn-dark"
        onClick={() => {
          navigate("/login");
        }}
      >
        Get Started
      </button>
    </div>
  );
};

export default Home;
