import { React, useState } from "react";
import { Close } from "@mui/icons-material";
import { TextField, Typography, Box, Button } from "@mui/material";
import axios from "axios";

export default function Profile(props) {
  const [data, setData] = useState({
    first_name: props.loggedInUser.first_name,
    last_name: props.loggedInUser.last_name,
    phone: props.loggedInUser.phone,
    email: props.loggedInUser.email,
    address: props.loggedInUser.address,
    postcode: props.loggedInUser.postcode,
    state: props.loggedInUser.state,
  });

  const handleChange = (event) => {
    setData((prevData) => {
      return {
        ...prevData,
        [event.target.name]:
          event.target.name === "images"
            ? [...prevData.images, ...event.target.files]
            : event.target.value,
      };
    });
  };

  const handleCancel = () => {
    setData({
      first_name: props.loggedInUser.first_name,
      last_name: props.loggedInUser.last_name,
      phone: props.loggedInUser.phone,
      email: props.loggedInUser.email,
      address: props.loggedInUser.address,
      postcode: props.loggedInUser.postcode,
      state: props.loggedInUser.state,
    });
    props.profileCancelled();
  };

  const handleOnSubmit = () => {
    console.log(data);
    axios
      .put("http://localhost:5000/user/update", { ...data })
      .then((res) => {
        console.log(res.data.message);
        //saving user info
        props.setLoggedInUser((prevData) => {
          return {
            ...prevData,
            first_name: res.data.user.first_name,
            last_name: res.data.user.last_name,
            phone: res.data.user.phone,
            address: res.data.user.address,
            postcode: res.data.user.postcode,
            state: res.data.user.state,
          };
        });
      })
      .catch((err) => {
        console.error(err.response.data.error);
      });
  };

  return (
    <>
      {props.isProfileActive && (
        <div className="profilePopup">
          <form
            style={{
              maxWidth: "700px",
              padding: "1rem",
              gap: "1rem",
            }}
          >
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "end",
              }}
            >
              <Close
                onClick={handleCancel}
                sx={{ fontSize: "2.5rem", mb: "1rem" }}
              />
            </Box>
            <Typography component="h1" variant="h4">
              Profile
            </Typography>
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
                onChange={handleChange}
                value={data.first_name}
                required
                sx={{
                  width: "50%",
                }}
              />
              <TextField
                label="Last Name"
                name="last_name"
                onChange={handleChange}
                value={data.last_name}
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
                label="Email"
                name="email"
                type="email"
                value={data.email}
                sx={{
                  width: "50%",
                }}
                required
                disabled
              />
              <TextField
                label="Phone"
                name="phone"
                type="tel"
                onChange={handleChange}
                value={data.phone}
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
                onChange={handleChange}
                value={data.address}
                required
              />
              <TextField
                label="Postcode"
                name="postcode"
                onChange={handleChange}
                value={data.postcode}
                required
              />
              <TextField
                label="State"
                name="state"
                onChange={handleChange}
                value={data.state}
                required
              />
            </Box>
            <div>
              <Button variant="contained" size="large" onClick={handleOnSubmit}>
                Save Details
              </Button>
            </div>
          </form>
        </div>
      )}
    </>
  );
}
