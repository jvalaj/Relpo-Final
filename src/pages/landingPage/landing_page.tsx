import './landing_page.css'
import { useHistory } from "react-router-dom";
import SITE_META from "../../metadata/site_meta";
import ROUTES_META from "../../metadata/routes_meta";
export default function LandingPage() {
  const history = useHistory();
  return (
    <div className="section3">
      <div className="container-fluid min-vh-100 d-flex align-content-center justify-content-center">
        <div className="row-fluid align-self-center text-center" id='row2'>
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
                className="btn mb-3 btn-outline-dark"
                id="loginb"
              >
                Login
              </button>
            </div>

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
