import { AppBar, Typography, Button, Toolbar, Box, Paper } from "@mui/material";
export default function Appbar(props) {
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
        <Button href="#" variant="outlined" sx={{ my: 1, mx: 1.5 }}>
          Logout
        </Button>
      )}
    </Toolbar>
  </AppBar>;
}
