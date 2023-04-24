import { React, useState } from "react";
import { Close } from "@mui/icons-material";
import axios from "axios";
import {
  TextField,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  Radio,
  RadioGroup,
  FormControlLabel,
  FormLabel,
  Slider,
  Typography,
  Box,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
export default function Request(props) {
  //make 2 data comsumer and clothing and join at end
  const navigate = useNavigate();

  const [consumerData, setConsumerData] = useState({
    consumer_id: props.loggedInUser.id,
    first_name: props.loggedInUser.first_name,
    last_name: props.loggedInUser.last_name,
    phone: props.loggedInUser.phone,
    email: props.loggedInUser.email,
    address: props.loggedInUser.address,
    state: props.loggedInUser.state,
    postcode: props.loggedInUser.postcode,
  });

  const handleConsumerDataChange = (event) => {
    setConsumerData((prevData) => {
      return {
        ...prevData,
        [event.target.name]: event.target.value,
      };
    });
  };

  const [jobData, setJobData] = useState({
    clothing_type: "",
    images: [],
    title: "",
    description: "",
    budget: 0,
    status: "open",
    gender: "female",
    req_makers: [],
    accepted_maker: -1,
  });

  const handleJobDataChange = (event) => {
    setJobData((prevData) => {
      return {
        ...prevData,
        [event.target.name]:
          event.target.name === "images"
            ? [...prevData.images, ...event.target.files]
            : event.target.value,
      };
    });
  };

  const handleOnSubmit = () => {
    console.log(props.jobs);
    console.log({ consumer_info: { ...consumerData }, ...jobData });
    axios
      .post("http://localhost:5000/jobs/add", {
        ...consumerData,
        ...jobData,
      })
      .then((res) => {
        console.log(res.data.message);
        props.requestCancelled();
        props.setJobAdded(true);
        navigate("/user/consumer");
      })
      .catch((err) => {
        console.error(err.response.data.error);
      });
  };

  return (
    <>
      {props.isRequestActive && (
        <div className="requestPopup">
          <form style={{ maxWidth: "700px", padding: "1rem", gap: "1rem" }}>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              <Close
                onClick={props.requestCancelled}
                sx={{ fontSize: "2.5rem", mb: "1rem" }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
              }}
            >
              <TextField
                label="First Name"
                name="first_name"
                onChange={handleConsumerDataChange}
                value={consumerData.first_name}
                required
                sx={{
                  width: "50%",
                }}
              />
              <TextField
                label="Last Name"
                name="last_name"
                onChange={handleConsumerDataChange}
                value={consumerData.last_name}
                required
                sx={{
                  width: "50%",
                }}
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
              }}
            >
              <TextField
                label="Phone"
                name="phone"
                type="tel"
                onChange={handleConsumerDataChange}
                value={consumerData.phone}
                sx={{
                  width: "50%",
                }}
                required
              />
              <TextField
                label="Email"
                name="email"
                type="email"
                onChange={handleConsumerDataChange}
                value={consumerData.email}
                sx={{
                  width: "50%",
                }}
                required
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
                gap: 1,
              }}
            >
              <TextField
                label="Address"
                name="address"
                onChange={handleConsumerDataChange}
                value={consumerData.address}
                required
              />
              <TextField
                label="Postcode"
                name="postcode"
                type="number"
                onChange={handleConsumerDataChange}
                value={consumerData.postcode}
                required
              />
              <TextField
                label="State"
                name="state"
                onChange={handleConsumerDataChange}
                value={consumerData.state}
                required
              />
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <FormControl component="fieldset">
                <FormLabel component="legend">Gender</FormLabel>
                <RadioGroup
                  aria-label="gender"
                  name="gender"
                  defaultValue="female"
                  row
                >
                  <FormControlLabel
                    value="female"
                    control={<Radio />}
                    label="Female"
                    checked={jobData.gender === "female"}
                    onChange={handleJobDataChange}
                  />
                  <FormControlLabel
                    value="male"
                    control={<Radio />}
                    label="Male"
                    checked={jobData.gender === "male"}
                    onChange={handleJobDataChange}
                  />
                  <FormControlLabel
                    value="other"
                    control={<Radio />}
                    label="Other"
                    checked={jobData.gender === "other"}
                    onChange={handleJobDataChange}
                  />
                </RadioGroup>
              </FormControl>
              <div style={{ width: "50%" }}>
                <Typography id="discrete-slider" gutterBottom>
                  Budget: ${jobData.budget}
                </Typography>
                <Slider
                  name="budget"
                  value={jobData.value}
                  onChange={handleJobDataChange}
                  aria-labelledby="discrete-slider"
                  valueLabelDisplay="auto"
                  step={100}
                  marks
                  min={0}
                  max={5000}
                  sx={{ width: "100%" }}
                />
              </div>
            </Box>
            <input
              type="file"
              name="images"
              onChange={handleJobDataChange}
              multiple
              required
            />
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
              }}
            >
              <TextField
                label="title"
                name="title"
                onChange={handleJobDataChange}
                value={jobData.title}
                required
                sx={{ width: "50%" }}
              />
              <div style={{ width: "50%" }}>
                <FormControl sx={{ width: "100%" }}>
                  <InputLabel id="clothing-select-label">
                    Select clothing type
                  </InputLabel>
                  <Select
                    labelId="clothing-select-label"
                    id="clothing-select"
                    name="clothing_type"
                    value={jobData.clothing_type}
                    onChange={handleJobDataChange}
                    required
                  >
                    <MenuItem value="dress">Dress</MenuItem>
                    <MenuItem value="sari-blouse">
                      Ethnic Wear - Sari / Blouse
                    </MenuItem>
                    <MenuItem value="shirt-pant">Shirt / Pant</MenuItem>
                    <MenuItem value="suit">Suit</MenuItem>
                    <MenuItem value="jacket">Jacket</MenuItem>
                    <MenuItem value="coat">Coat</MenuItem>
                    <MenuItem value="accessories">Accessories</MenuItem>
                    <MenuItem value="others">Others</MenuItem>
                  </Select>
                </FormControl>
              </div>
            </Box>
            <div>
              <TextField
                label="Description"
                name="description"
                onChange={handleJobDataChange}
                value={jobData.description}
                multiline
                rows={3}
                fullWidth
                required
              />
            </div>
            <div>
              <Button variant="contained" size="large" onClick={handleOnSubmit}>
                Post the Job
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
