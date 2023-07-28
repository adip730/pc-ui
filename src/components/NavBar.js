import React, { useContext, useEffect, useState } from "react";
import makeStyles from "@mui/styles/makeStyles";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import { useLocation, useNavigate } from "react-router-dom";
import AppContext from "../context/AppContext";
import useMediaQuery from "@mui/material/useMediaQuery";

import logo_gif from "../../public/logo-gif.gif";

const useStyles = makeStyles(() => ({
  navBar: {
    minWidth: "100%",
    background: "#FFFFFF",
    width: "100%",
    position: "fixed",
    top: 0,
    right: 0,
    left: 0,
    height: "60px",
    zIndex: 3,
    marginBottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    boxSizing: "border-box",
    transformOrigin: "top",
  },
  toolbar: {
    display: "flex",
    padding: "0px 40px",
    minWidth: "60%",
    flexDirection: "row",
    alignItems: "center",
    height: "100%",
    zIndex: 2,
  },
  menuButton: {
    fontFamily: "Square721",
    cursor: "pointer",
    textAlign: "center",
    padding: 0,
    opacity: "1 !important",
    color: "#000000",
  },
  barText: {
    fontFamily: "Square721",
  },
  logo: {
    height: "44px",
  },
  logoOut: {
    animation: "$fadeout 1000ms",
  },
  "@keyframes fadein": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  "@keyframes fadeout": {
    "0%": {
      opacity: 1,
    },
    "100%": {
      opacity: 0,
    },
  },
}));

export const NavBar = (props) => {
  const classes = useStyles();
  let navigate = useNavigate();
  const { state } = useContext(AppContext);
  const { showNav, showLogo } = state;
  const [render, setRender] = useState(showLogo);
  const [invertColor, setInvertColor] = useState(false);
  const largeScreen = useMediaQuery("(min-width:800px)");

  // function hideTimer() {
  //   setRender(false);
  // }
  // useEffect(() => {
  //   if (showLogo) {
  //     clearTimeout(this.fade);
  //     setRender(true);
  //   } else {
  //     this.fade = setTimeout(hideTimer, 500);
  //   }
  // }, [showLogo]);

  const location = useLocation();

  useEffect(() => {
    if (location.pathname.includes("info")) {
      setInvertColor(true);
    } else {
      setInvertColor(false);
    }
  }, [location]);

  return (
    <div
      className={classes.navBar}
      style={{
        transform: showNav ? "scaleY(1)" : "scaleY(0)",
        padding: largeScreen ? "0px 24px" : "0px 32px",
        background: invertColor
          ? "rgba(255,255,255,0)"
          : "rgba(255, 255, 255, 1)",
      }}
    >
      <Grid
        container
        className={classes.toolbar}
        style={{
          padding: largeScreen ? "0px 40px" : "0px",
          minWidth: largeScreen && showLogo ? "100%" : "60%",
        }}
      >
        <Grid
          item
          xs={6}
          sm={4}
          sx={{ display: "flex", justifyContent: "flex-start" }}
        >
          <Button
            className={classes.menuButton}
            style={{
              fontFamily: "Square721",
              color: invertColor ? "#FFFFFF" : "#000000",
              padding: 0,
              fontSize: largeScreen ? ".75rem" : ".6rem",
            }}
            onClick={(e) => navigate("/")}
          >
            Pleasure Craft
          </Button>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            className={classes.menuButton}
            style={{
              fontFamily: "Square721",
              color: invertColor ? "#FFFFFF" : "#000000",
              padding: 0,
              fontSize: largeScreen ? ".75rem" : ".6rem",
            }}
            onClick={(e) => navigate("/info")}
          >
            Info
          </Button>
        </Grid>
        <Grid
          item
          xs={3}
          sm={3}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            className={classes.menuButton}
            style={{
              fontFamily: "Square721",
              color: invertColor ? "#FFFFFF" : "#000000",
              padding: 0,
              fontSize: largeScreen ? ".75rem" : ".6rem",
            }}
            onClick={(e) => navigate("/index")}
          >
            Index
          </Button>
        </Grid>
        <Grid
          item
          xs={0}
          sm={2}
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "flex-end",
          }}
        >
          {largeScreen ? (
            <Fade in={showLogo} unmountOnExit timeout={1000}>
              <img
                className={classes.logo}
                src={logo_gif}
                onClick={(e) => navigate("/")}
              />
            </Fade>
          ) : null}
        </Grid>
      </Grid>
    </div>
  );
};

export default NavBar;
