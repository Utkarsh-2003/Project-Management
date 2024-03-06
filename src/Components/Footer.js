import React from "react";

const Footer = () => {
  return (
    <footer className="bg-dark text-light">
      <div className="container">
        <div className="d-flex justify-content-between align-items-center">
          <p className="mb-0">© 2024 Project Manager, Inc</p>
          <a href="/" className="text-decoration-none">
            <svg
              className="bi text-light me-2"
              width="40"
              height="32"
              fill="currentColor"
            >
              <use xlinkHref="#bootstrap"></use>
            </svg>
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
