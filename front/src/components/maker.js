import { AppBar, Typography, Button, Toolbar, Box } from "@mui/material";
import axios from "axios";
import { useState, useEffect } from "react";
import JobCard from "./job_card";

export default function Maker(props) {
  const [jobScreen, setJobScreen] = useState("Open");
  const handleSetJobScreen = (state) => {
    setJobScreen(state);
  };

  const [openJobs, setOpenJobs] = useState([]);
  const [accpetedJobs, setAcceptedJobs] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:5000/maker/open-jobs/retrive", {
        status: "open",
      })
      .then((res) => {
        if (res && res.data) {
          console.log(res.data.message);
          setOpenJobs(res.data.jobsData);
          props.setJobAdded(false);
        }
      })
      .catch((err) => {
        console.error(err.response.data.error);
      });
  }, [props.jobAdded]);

  useEffect(() => {
    axios
      .post("http://localhost:5000/maker/jobs/retrive", {
        accepted_maker: props.loggedInUser.id,
      })
      .then((res) => {
        console.log(res.data.message);
        setAcceptedJobs(res.data.jobsData);
        props.setJobAdded(false);
      })
      .catch((err) => {
        console.error(err.response.data.error);
      });
  }, [props.jobAdded]);

  const handleLogout = () => {
    props.clearUserInfo();
    window.location.href = "/";
  };

  return (
    <>
      <AppBar
        position="static"
        color="default"
        elevation={0}
        sx={{ borderBottom: (theme) => `1px solid ${theme.palette.divider}` }}
      >
        <Toolbar sx={{ flexWrap: "wrap" }}>
          <Typography variant="h6" color="inherit" noWrap sx={{ flexGrow: 1 }}>
            Company name
          </Typography>
          <nav>
            <Button onClick={props.profileClicked} sx={{ my: 1, mx: 1.5 }}>
              Profile
            </Button>
          </nav>
          {props.loggedInUser.email == "" && (
            <Button href="/" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
              Login
            </Button>
          )}
          {props.loggedInUser.email != "" && (
            <Button
              href="#"
              variant="outlined"
              sx={{ my: 1, mx: 1.5 }}
              onClick={() => {
                handleLogout();
              }}
            >
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Box sx={{ display: "flex", flexDirection: "column" }}>
        <Box sx={{ display: "flex" }}>
          <Button
            variant={jobScreen === "Open" ? "contained" : "outlined"}
            onClick={() => handleSetJobScreen("Open")}
          >
            Open Jobs
          </Button>
          <Button
            variant={jobScreen === "Accepted" ? "contained" : "outlined"}
            onClick={() => handleSetJobScreen("Accepted")}
          >
            Accepted Jobs
          </Button>
        </Box>
        {jobScreen == "Open" && (
          <JobCard
            jobs={openJobs}
            isMaker={true}
            setClickedJobId={props.setClickedJobId}
          />
        )}
        {jobScreen == "Accepted" && (
          <JobCard
            jobs={accpetedJobs}
            isMaker={true}
            setClickedJobId={props.setClickedJobId}
            setJobAdded={props.setJobAdded}
          />
        )}
      </Box>
    </>
  );
}
