import { useState, useEffect } from "react";
import { AppBar, Typography, Button, Toolbar, Box, Paper } from "@mui/material";
import axios from "axios";

export default function Buyer(props) {
  const [jobs, setJobs] = useState([]);

  useEffect(() => {
    axios
      .post("http://localhost:5000/consumer/jobs/retrive", {
        consumer_id: props.loggedInUser.id,
      })
      .then((res) => {
        console.log(res.data.message);
        setJobs(res.data.jobsData);
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
      <div>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
          }}
        >
          <Button variant="contained" onClick={props.requestClicked}>
            Post a job
          </Button>
          {jobs.map((job) => (
            <Paper
              key={job.id}
              elevation={3}
              onClick={() => {
                props.setClickedJobId(job.id);
              }}
              sx={{
                p: "1rem",
                m: "1rem 0",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                "&:hover": { cursor: "pointer" },
              }}
            >
              <Typography variant="h4">{job.title}</Typography>
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-around",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Typography variant="body1">
                  Clothing Type: {job.clothing_type}
                </Typography>
                <Typography variant="body1">Budget: {job.budget}</Typography>
                <Typography>Requests: {job.req_makers.length}</Typography>
                <Box
                  bgcolor={
                    job.status === "open"
                      ? "lightblue"
                      : job.status === "Inprogress"
                      ? "orange"
                      : "lightgreen"
                  }
                  display="inline-block"
                  px={2}
                  py={1}
                  borderRadius={16}
                >
                  <Typography variant="body1" color="textPrimary">
                    {job.status}
                  </Typography>
                </Box>
              </Box>
            </Paper>
          ))}
        </Box>
      </div>
    </>
  );
}
