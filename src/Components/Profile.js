import React, { useEffect, useState } from "react";
import { db } from "../Firebase";
import { useSelector } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEyeSlash, faEye } from "@fortawesome/free-solid-svg-icons";
import "../App.css";
import Avatar from "react-avatar";
import { toast } from "react-toastify";

const Profile = () => {
  const user = useSelector((state) => state.user);
  const [id, setId] = useState();
  const [email, setEmail] = useState();
  const [name, setName] = useState();
  const [password, setPassword] = useState();
  const [type, setType] = useState("password");
  const [icon, setIcon] = useState(faEyeSlash);
  const [confirm_password, setConfirm_password] = useState("");

  const handleHidePassword = () => {
    setType((prevType) => (prevType === "password" ? "text" : "password"));
    setIcon((prevIcon) => (prevIcon === faEyeSlash ? faEye : faEyeSlash));
  };

  useEffect(() => {
    db.collection("user")
      .where("email", "==", user)
      .get()
      .then((querySnapshot) => {
        querySnapshot.forEach((doc) => {
          setId(doc.data().id);
          setName(doc.data().name);
          setEmail(doc.data().email);
          setPassword(doc.data().password);
        });
      })
      .catch((error) => {
        console.log("Error getting documents: ", error);
      });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();

    if (
      name !== "" &&
      email !== "" &&
      password !== "" &&
      confirm_password !== ""
    ) {
      if (password === confirm_password) {
        db.collection("user")
          .where("id", "==", id)
          .get()
          .then(function (querySnapshot) {
            querySnapshot.forEach(function (doc) {
              doc.ref.update({
                name: name,
                email: email,
                password: password,
              });
            });
            toast.success("Profile Updated Successfully", {
              autoClose: 1500,
              toastId: "update",
            });
          });
      } else {
        toast.warning(`Confirm Password does not match`, {
          autoClose: 1500,
          toastId: "passnotmatch",
        });
      }
    } else {
      toast.warning(`Please fill all the field`, {
        autoClose: 1500,
        toastId: "emptyfield",
      });
    }
  };

  return (
    <>
      <div className="p-3">
        <div
          className="container border rounded mt-3"
          style={{ maxWidth: "700px" }}
        >
          <h1 className="text-center mt-2">Profile</h1>
          <div
            className="container-sm border border-warning bg-white shadow rounded p-3 mt-3 mb-3"
            style={{ maxWidth: "400px" }}
          >
            <div className="d-flex align-items-center">
              <div className="mb-2">
                <Avatar
                  name={email}
                  size={60}
                  round={true}
                  className="avatar-xlarge avatar-circle"
                />
              </div>
              <div className="ms-3 mt-0 p-2">
                <span className="d-block">
                  <strong>{name}</strong>
                </span>
                <span className="d-block">{email}</span>
              </div>
            </div>
          </div>
          <div>
            <form onSubmit={onSubmit}>
              <div className="form-group row m-1">
                <label htmlFor="inputName" className="col-sm-2 col-form-label">
                  Name :
                </label>
                <div className="col-sm-6">
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => {
                      setName(e.target.value);
                    }}
                    className="form-control focus-ring focus-ring-light"
                    id="inputName"
                    placeholder="Name"
                    required
                  />
                </div>
              </div>

              <div className="form-group row m-1">
                <label htmlFor="inputEmail" className="col-sm-2 col-form-label">
                  Email :
                </label>
                <div className="col-sm-6">
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                    }}
                    className="form-control focus-ring focus-ring-light"
                    id="inputEmail"
                    placeholder="Email"
                    required
                  />
                </div>
              </div>

              <div className="form-group row m-1">
                <label
                  htmlFor="inputPassword"
                  className="col-sm-2 col-form-label"
                >
                  Password :
                </label>
                <div className="col-sm-6 position-relative">
                  <input
                    type={type}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                    }}
                    className="form-control rounded-0 rounded-start focus-ring focus-ring-light"
                    id="inputPassword"
                    placeholder="Password"
                  />
                  <span
                    className="pe-3 position-absolute end-0 top-50 translate-middle-y"
                    onClick={handleHidePassword}
                    style={{ cursor: "pointer", marginRight: "10px" }}
                  >
                    <FontAwesomeIcon icon={icon}></FontAwesomeIcon>
                  </span>
                </div>
              </div>

              <div className="form-group row m-1">
                <label
                  htmlFor="inputConfirmPassword"
                  className="col-sm-2 col-form-label"
                ></label>
                <div className="col-sm-6">
                  <input
                    type="password"
                    value={confirm_password}
                    onChange={(e) => {
                      setConfirm_password(e.target.value);
                    }}
                    className="form-control focus-ring focus-ring-light"
                    id="inputConfirmPassword"
                    placeholder="Confirm Password"
                    required
                  />
                </div>
              </div>

              <div className="form-group row mt-3 text-center mb-2">
                <div className="col-sm-10 ">
                  <button type="submit" className="btn btn-success">
                    Update
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
