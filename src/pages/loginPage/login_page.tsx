import "./login_page.css";
import SITE_META from "../../metadata/site_meta";
import { FormEvent, useState } from "react";
import { signInWithEmailAndPassword } from "../../utils/firebase/auth";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailError, setEmailError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  function validateEmail(email: any) {
    const re = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return re.test(String(email).toLowerCase());
  }
  function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setEmailError("");
    setPasswordError("");
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

    if (password.length < 6) {
      setPasswordError("Invalid Passsword");
      return;
    }

    signInWithEmailAndPassword(email, password).catch((err) => {
      console.log(err);
      switch (err.code) {
        case "auth/user-not-found": {
          setEmailError("No such user found!");
          break;
        }
        case "auth/wrong-password": {
          setPasswordError("Invalid Password!");
          break;
        }
        default:
          setPasswordError(err.message);
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
                    id="exampleInputPassword1"
                  />
                  <small className="text-danger">{passwordError}</small>
                </div>
                <button
                  type="submit"
                  className="btn btn-outline-dark mt-3"
                  id="loginb"
                >
                  Login
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
