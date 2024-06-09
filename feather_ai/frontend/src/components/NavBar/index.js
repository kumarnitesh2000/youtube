import React from "react";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";

const NavBar = () => {
  return (
    <AppBar
      position="static"
      sx={{ backgroundColor: "#ffffff", color: "black" }}
    >
      <Toolbar sx={{ justifyContent: "start" }}>
        <Box
          component="img"
          sx={{
            height: 50,
            width: 50,
            cursor: "pointer",
          }}
          alt="Logo"
          src="/img/logo.svg"
        />
        <Typography variant="h6" component="div" sx={{ fontFamily: "Raleway" }}>
          feather
        </Typography>
      </Toolbar>
    </AppBar>
  );
};

export default NavBar;
