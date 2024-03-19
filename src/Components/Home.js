import React from "react";
import { useNavigate } from "react-router-dom";
import home from "./Images/main.png";

const Home = () => {
  const navigate = useNavigate();
  return (
    <>
    <div className="p-2">
      <div className="p-2 mt-2">
        <div className="row">
          <div className="col-md-6">
            <img
              className="img-fluid mt-0"
              src={home}
              alt="Home"
              style={{ height:"400px",width:"800px" }}
            />
          </div>
          <div className="col-md-6">
            <h1 className="mt-5 mb-3 mx-4">Project Management</h1>
            <div className="mx-4">
              <p className="fs-5">
                Welcome to our project management website, where efficiency
                meets simplicity. Streamline your projects with intuitive tools
                designed to enhance collaboration and productivity. From task
                allocation to progress tracking, empower your team to achieve
                milestones effortlessly.
              </p>
              <button
                className="btn btn-dark rounded-pill"
                onClick={() => {
                  navigate("/login");
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
      </div>
    </>
  );
};

export default Home;
