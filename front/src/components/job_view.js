import { Typography, Button, Box, TextField } from "@mui/material";
import { Close } from "@mui/icons-material";
import axios from "axios";
import { useEffect, useState } from "react";
export default function JobView(props) {
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

  const [reqData, setReqData] = useState({
    id: props.loggedInUser.id,
    price: 0,
    comments: "",
  });

  const handleReqDataChange = (event) => {
    setReqData((prevData) => {
      return { ...prevData, [event.target.name]: event.target.value };
    });
  };

  const [showReqForm, setShowReqForm] = useState(false);

  const handleOnConfirm = () => {
    axios
      .put(
        `http://localhost:5000/jobs/${props.clickedJobId}/update-req-makers`,
        { req_makers: [...jobData.req_makers, reqData] }
      )
      .then((res) => {
        console.log(res.data.message);
        setReqData({
          id: props.loggedInUser.id,
          price: 0,
          comments: "",
        });
        setShowReqForm(false);
        props.setJobAdded(true);
      })
      .catch((err) => {
        console.error(err);
        console.error(err.response.data.error);
      });
  };

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
                  setShowReqForm(false);
                  props.setClickedJobId("");
                }}
                sx={{ fontSize: "2.5rem", mb: "1rem" }}
              />
            </Box>
            <div key={jobData.id} style={{ padding: "8px" }}>
              <Typography>First Name: {jobData.first_name}</Typography>
              <Typography>Last Name: {jobData.last_name}</Typography>
              <Typography>Phone: {jobData.phone}</Typography>
              <Typography>Email: {jobData.email}</Typography>
              <Typography>Address: {jobData.address}</Typography>
              <Typography>State: {jobData.state}</Typography>
              <Typography>Postcode: {jobData.postcode}</Typography>
              <Typography>Clothing Type: {jobData.clothing_type}</Typography>
              <Typography>Title: {jobData.title}</Typography>
              <Typography>Description: {jobData.description}</Typography>
              <Typography>Budget: {jobData.budget}</Typography>
              <Typography>Status: {jobData.status}</Typography>
              <Typography>Gender: {jobData.gender}</Typography>
              {jobData.status == "open" && (
                <Button variant="outlined" onClick={() => setShowReqForm(true)}>
                  Request the job
                </Button>
              )}
            </div>
          </div>
          {showReqForm && (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                gap: "1rem",
              }}
              className="req_form"
            >
              <TextField
                label="price"
                name="price"
                type="number"
                value={reqData.price}
                onChange={handleReqDataChange}
                required
              />
              <TextField
                label="comments"
                name="comments"
                multiline
                rows={3}
                value={reqData.comments}
                onChange={handleReqDataChange}
                fullWidth
                required
              />
              <Button variant="contained" onClick={handleOnConfirm}>
                Confirm
              </Button>
            </Box>
          )}
        </div>
      )}
    </>
  );
}
