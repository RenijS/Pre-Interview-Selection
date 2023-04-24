import { useState } from "react";
import Landing from "./components/landing";
import SignUp from "./components/signup";
import Buyer from "./components/buyer";
import Request from "./components/buyer/request";
import { Route, Routes } from "react-router-dom";
import Profile from "./components/profile";
import Maker from "./components/maker";
import JobView from "./components/job_view";
import BuyerJobView from "./components/buyer/job_view";

function App() {
  //Errors info
  const [errors, setErrors] = useState({
    signupError: "",
    loginError: "",
  });

  const clearError = () => {
    setErrors({ signupError: "", loginError: "" });
  };

  //Logged in user info
  const [loggedInUser, setLoggedInUser] = useState({
    id: 0,
    email: "",
    first_name: "",
    last_name: "",
    type: "",
    phone: "",
    address: "",
    postcode: "",
    state: "",
  });

  const clearUserInfo = () => {
    setLoggedInUser({
      id: 0,
      email: "",
      first_name: "",
      last_name: "",
      type: "",
      phone: "",
      address: "",
      postcode: "",
      state: "",
    });
  };

  //Profile listener
  const [isProfileActive, setIsProfileActive] = useState(false);

  const profileClicked = () => {
    setIsProfileActive((prevState) => !prevState);
  };

  const profileCancelled = () => {
    setIsProfileActive((prevState) => !prevState);
  };

  //Job request listener
  const [isRequestActive, setIsRequestActive] = useState(false);

  const requestClicked = () => {
    setIsRequestActive((prevState) => !prevState);
  };

  const requestCancelled = () => {
    setIsRequestActive((prevState) => !prevState);
  };

  const [jobAdded, setJobAdded] = useState(false);

  //id of clicked job card
  const [clickedJobId, setClickedJobId] = useState("");

  return (
    <Routes>
      <Route
        path="/"
        element={
          <Landing
            error={errors.loginError}
            setErrors={setErrors}
            clearError={clearError}
            setLoggedInUser={setLoggedInUser}
          />
        }
      />
      <Route
        path="/signup"
        element={
          <SignUp
            error={errors.signupError}
            setErrors={setErrors}
            clearError={clearError}
          />
        }
      />
      <Route
        path="/user/consumer"
        element={
          <>
            <Request
              loggedInUser={loggedInUser}
              isRequestActive={isRequestActive}
              requestCancelled={requestCancelled}
              setJobAdded={setJobAdded}
            />
            <Profile
              loggedInUser={loggedInUser}
              isProfileActive={isProfileActive}
              profileCancelled={profileCancelled}
              setLoggedInUser={setLoggedInUser}
            />
            <BuyerJobView
              clickedJobId={clickedJobId}
              setClickedJobId={setClickedJobId}
              loggedInUser={loggedInUser}
              setJobAdded={setJobAdded}
            />
            <Buyer
              loggedInUser={loggedInUser}
              clearUserInfo={clearUserInfo}
              profileClicked={profileClicked}
              requestClicked={requestClicked}
              jobAdded={jobAdded}
              setJobAdded={setJobAdded}
              setClickedJobId={setClickedJobId}
            />
          </>
        }
      />
      <Route
        path="/user/maker"
        element={
          <>
            <Profile
              loggedInUser={loggedInUser}
              isProfileActive={isProfileActive}
              profileCancelled={profileCancelled}
              setLoggedInUser={setLoggedInUser}
            />
            <JobView
              clickedJobId={clickedJobId}
              setClickedJobId={setClickedJobId}
              loggedInUser={loggedInUser}
              setJobAdded={setJobAdded}
            />
            <Maker
              loggedInUser={loggedInUser}
              clearUserInfo={clearUserInfo}
              profileClicked={profileClicked}
              setClickedJobId={setClickedJobId}
              setJobAdded={setJobAdded}
            />
          </>
        }
      />
    </Routes>
  );
}

export default App;
