import { Typography, Box, Paper, Button } from "@mui/material";
import axios from "axios";

export default function JobCard(props) {
  const handleOnCompleted = (id) => {
    axios
      .put(`http://localhost:5000/jobs/${id}/completed`)
      .then((res) => {
        if (res && res.data) {
          console.log(res.data.message);
          props.setJobAdded(true);
        }
      })
      .catch((err) => {
        console.error(err.response.data.error);
      });
  };
  return (
    <>
      {props.jobs.map((job) => (
        <Paper
          onClick={() => {
            props.setClickedJobId(job.id);
          }}
          key={job.id}
          elevation={3}
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
              flexWrap: "wrap",
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
            {job.status == "Inprogress" && (
              <Button
                variant="contained"
                onClick={() => {
                  handleOnCompleted(job.id);
                }}
              >
                Completed
              </Button>
            )}
          </Box>
        </Paper>
      ))}
    </>
  );
}
