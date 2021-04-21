import React from "react";
import "./App.css";
import LoginPage from "./pages/loginPage/login_page";
import SignupPage from "./pages/signupPage/signup_page";
import { Switch, HashRouter, Route, Redirect } from "react-router-dom";
import LandingPage from "./pages/landingPage/landing_page";
import DashboardPage from "./pages/dashboardPage/dashboard_page";
import ROUTES_META from "./metadata/routes_meta";
import { useUser } from "./contexts/user_context";
import Loading from "./components/loading/loading";
import RidePage from "./pages/ridePage/ride_page";

function App() {
  const [user] = useUser();
  if (user === undefined) {
    return <Loading />;
  }
  return (
    <HashRouter>
      <Switch>
        <Route exact={true} path={"/"}>
          {user ? <Redirect to="/home" /> : <LandingPage />}
        </Route>
        <Route path="/home">
          {!user ? <Redirect to="/" /> : <DashboardPage />}
        </Route>
        <Route path={ROUTES_META.signUp}>
          {user ? <Redirect to="/home" /> : <SignupPage />}
        </Route>
        <Route path={ROUTES_META.logIn}>
          {user ? <Redirect to="/home" /> : <LoginPage />}
        </Route>
        <Route path={ROUTES_META.ride}>
          {!user ? <Redirect to="/" /> : <RidePage />}
        </Route>
      </Switch>
    </HashRouter>
  );
}

export default App;
