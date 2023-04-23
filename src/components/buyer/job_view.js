import { Typography, Button, Box, Paper } from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
export default function BuyerJobView(props) {
  const [jobData, setJobData] = useState({});
  useEffect(() => {
    if (props.clickedJobId !== "") {
      axios
        .post("http://localhost:5000/job/retrive", { id: props.clickedJobId })
        .then((res) => {
          console.log(res.data.message);
          console.log(res.data.jobData);
          setJobData(res.data.jobData);
        })
        .catch((err) => {
          console.error(err.response.data.error);
        });
    }
  }, [props.clickedJobId]);
  console.log(props);
  const handleOnAccept = (maker_id) => {
    axios
      .put(
        `http://localhost:5000/jobs/${props.clickedJobId}/update-req-status`,
        {
          maker_id: maker_id,
        }
      )
      .then((res) => {
        console.log(res.data.message);
        props.setJobAdded(true);
        props.setClickedJobId("");
      })
      .catch((err) => {
        console.error(err.response.data.error);
      });
  };

  useEffect(() => {
    console.log(jobData);
  }, [jobData]);

  return (
    <>
      {props.clickedJobId != "" && (
        <div
          className="jobPopup"
          style={{ display: "flex", flexDirection: "row", gap: "4rem" }}
        >
          <div style={{ display: "flex", flexDirection: "column" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              <Close
                onClick={() => {
                  props.setClickedJobId("");
                }}
                sx={{ fontSize: "2.5rem", mb: "1rem" }}
              />
            </Box>
            <div key={jobData.id} style={{ padding: "8px" }}>
              <Typography>Clothing Type: {jobData.clothing_type}</Typography>
              <Typography>Title: {jobData.title}</Typography>
              <Typography>Description: {jobData.description}</Typography>
              <Typography>Budget: {jobData.budget}</Typography>
            </div>
            {jobData.req_makers && jobData.req_makers.length > 0 ? (
              <div>
                <h4>Maker's Request:</h4>
                {jobData.req_makers.map((maker) => {
                  return (
                    <Paper
                      sx={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        gap: "1rem",
                        p: "0.5rem 2rem",
                      }}
                    >
                      <Typography>Price: ${maker.price}</Typography>
                      <Typography>Comments: {maker.comments}</Typography>
                      <Button
                        variant="contained"
                        onClick={() => {
                          handleOnAccept(maker.id);
                        }}
                      >
                        Accept
                      </Button>
                    </Paper>
                  );
                })}
              </div>
            ) : (
              <div>No requests yet.</div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
