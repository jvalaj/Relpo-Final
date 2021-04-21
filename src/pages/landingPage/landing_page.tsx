import "./landing_page.css";
import { useHistory } from "react-router-dom";
import SITE_META from "../../metadata/site_meta";
import ROUTES_META from "../../metadata/routes_meta";
export default function LandingPage() {
  const history = useHistory();
  return (
    <div className="section1 min-vh-100 w-100 d-flex align-items-center">
      <div className="container" id="base">
        <div className="row-fluid text-center">
          <div className="col-fluid">
            <h1 className="display-4">Welcome To </h1>
            <h3 className="display-1">{SITE_META.appName}</h3>
          </div>
          <br />
          <div className="row-fluid">
            <div className="col-fluid">
              <button
                onClick={() => {
                  history.push(ROUTES_META.logIn);
                }}
                type="button"
                className="btn btn-outline-dark"
                id="loginb"
              >
                Login
              </button>
            </div>
            <br />
            <div className="col-fluid">
              <button
                onClick={() => {
                  history.push(ROUTES_META.signUp);
                }}
                type="button"
                className="btn btn-dark"
                id="signupb"
              >
                Signup
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
