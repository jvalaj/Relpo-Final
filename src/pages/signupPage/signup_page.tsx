import "./signup_page.css";
import SITE_META from "../../metadata/site_meta";
import { FormEvent, useState } from "react";
import { signUpWithEmailAndPassword } from "../../utils/firebase/auth";
import { createUserDocument } from "../../utils/firebase/firestore";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");
  const [cPasswordError, setCPasswordError] = useState("");

  const [name, setName] = useState("");
  const [nameError, setNameError] = useState("");
  function validateEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setNameError("");
    setCPasswordError("");
    setEmailError("");
    setPasswordError("");
    if (name === "") {
      setNameError("This field can't be empty");
      return;
    }
    if (email === "") {
      setEmailError("This field can't be empty");
      return;
    }
    if (!validateEmail(email)) {
      setEmailError("Not valid email");
      return;
    }
    if (password === "") {
      setPasswordError("This field can't be empty");
      return;
    }
    if (confirmPassword === "") {
      setCPasswordError("This field can't be empty");
      return;
    }

    if (password.length < 6) {
      setPasswordError("Passsword must be atleast 6 digits");
      return;
    }
    if (confirmPassword !== password) {
      setCPasswordError("Passwords don't match");
      return;
    }
    signUpWithEmailAndPassword(email, password)
      .then(() => {
        createUserDocument({ email, name, phone: "nothing!!" });
      })
      .catch((err) => {
        console.log(err);
        switch (err.code) {
          case "auth/email-already-in-use": {
            setEmailError("Email already in use!");
            break;
          }
          default:
            setCPasswordError(err.message);
        }
      });
  }

  return (
    <div className="section1">
      <div className="container" id="base">
        <div className="row-fluid ">
          <div className="col-fluid text-center">
            <h3 className="display-1">{SITE_META.appName}</h3>
          </div>
          <br />
          <div className="row-fluid">
            <div className="col-fluid">
              <form onSubmit={onSubmit} noValidate={true}>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Name
                  </label>
                  <input
                    onChange={(event) => {
                      setName(event.target.value);
                    }}
                    value={name}
                    type="text"
                    className="form-control bg-dark"
                    placeholder="Name"
                    id="exampleInputPassword1"
                  />
                  <small className="text-danger">{nameError}</small>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputEmail1" className="form-label">
                    Email address
                  </label>
                  <input
                    value={email}
                    onChange={(event) => {
                      setEmail(event.target.value);
                    }}
                    type="email"
                    className="form-control bg-dark"
                    placeholder="Email address"
                    id="exampleInputEmail1"
                    aria-describedby="emailHelp"
                  />
                  <small className="text-danger">{emailError}</small>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Password
                  </label>
                  <input
                    onChange={(event) => {
                      setPassword(event.target.value);
                    }}
                    value={password}
                    type="password"
                    className="form-control bg-dark"
                    placeholder="Password"
                    id="exampleInputPassword1"
                  />
                  <small className="text-danger">{passwordError}</small>
                </div>
                <div className="mb-3">
                  <label htmlFor="exampleInputPassword1" className="form-label">
                    Retype Password
                  </label>
                  <input
                    onChange={(event) => {
                      setConfirmPassword(event.target.value);
                    }}
                    value={confirmPassword}
                    type="password"
                    className="form-control bg-dark"
                    placeholder="Retype Password"
                    id="exampleInputPassword1"
                  />
                  <small className="text-danger">{cPasswordError}</small>
                </div>
                <button
                  type="submit"
                  className="btn btn-outline-dark mt-3"
                  id="loginb"
                >
                  Signup
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
