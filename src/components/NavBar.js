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
  gradient: {
    position: "fixed",
    zIndex: 4,
    right: "0",
    left: "0",
    height: "60px",
    background:
      "linear-gradient(to bottom, rgba(221,225,225, 0) 0%, rgba(221,225,225, .5) 5%, rgba(221,225,225, .5) 60%, rgba(221,225,225, 0) 100%)",
  },

  navBar: {
    minWidth: "100%",
    background: "rgb(0,0,0,0)",
    width: "100%",
    position: "fixed",
    top: "0px",
    right: 0,
    flexWrap: "nowrap",
    left: 0,
    height: "30px",
    zIndex: 6,
    marginBottom: 0,
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: "0px 24px",
    boxSizing: "border-box",
    transformOrigin: "top",
    backdropFilter: "blur(7.1px) contrast(1) invert(0.00)",
    borderRadius: "5rem",
    //boxShadow: "rgba(50, 50, 93, 0.25) 0px 3px 17px -5px, rgba(0, 0, 0, 0.3) 0px 8px 16px -8px",
    //boxShadow: "rgba(50, 50, 93, 0.25) 0px 10px 10px -20px, rgba(0, 0, 0, 0.3) 0px 3px 6px -3px",
  },
  toolbar: {
    display: "flex",
    padding: "0px 0px",
    minWidth: "60%",
    flexDirection: "row",
    alignItems: "flex-start",
    height: "100%",
    zIndex: 5,
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
    paddingRight: "10px",
    paddingTop: "10px",
    top: "0px",
    right: "0px",
    position: "absolute",
    height: "70px",
    // marginRight:"-4rem",
    // animation: "$fadein 2000ms",
    // animationDelay: "150ms",
  },
  // logoOut: {
  //   animation: "$fadeout 000ms",
  // },

  "@keyframes fadein": {
    "0%": {
      opacity: 0,
    },
    "50%": {
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
    "50%": {
      opacity: 0,
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
  const [hideLogo, sethideLogo] = useState(false);
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

  // useEffect(() => {
  //   if (location.pathname.includes("info")) {
  //     sethideLogo(false);
  //   } else {
  //     sethideLogo(false);
  //   }
  // }, [location]);

  //const audio = new Audio("");
  //const buttons = document.querySelectorAll("button");

  //buttons.forEach(button => {
  //  button.addEventListener("click", () => {
  //    audio.play();
  //  });
  // });

  return (
    <>
      <div
        className={classes.navBar}
        style={{
          transform: showNav ? "scaleY(1)" : "scaleY(0)",
          padding: largeScreen ? "5px 5px" : "5px 5px",
          flexWrap: largeScreen ? "nowrap" : "nowrap",
          background: invertColor
            ? "rgba(255,255,255,0)"
            : "rgba(255, 255, 255, 0)",
        }}
      >
        <Grid
          container
          className={classes.toolbar}
          style={{
            flexWrap: largeScreen ? "nowrap" : "nowrap",
            padding: largeScreen ? "0px 5px" : "0px",
            minWidth: largeScreen && showLogo ? "100%" : "60%",
          }}
        >
          <Grid
            item
            xs={6}
            sm={2}
            sx={{
              display: "flex",
              justifyContent: "flex-start",
              flexwrap: "nowrap",
            }}
          >
            <Button
              className={classes.menuButton}
              style={{
                fontFamily: "Square721",
                fontWeight: "500",
                color: invertColor ? "#000000" : "#000000",
                padding: 0,
                fontSize: largeScreen ? ".7rem" : ".55rem",
                flexWrap: largeScreen ? "nowrap" : "nowrap",
                whiteSpace: "nowrap",
              }}
              onClick={(e) => navigate("/")}
            >
              Pleasure Craft
            </Button>
          </Grid>
          <Grid
            item
            xs={0}
            sm={0}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              className={classes.menuButton}
              style={{
                fontFamily: "Square721",
                fontWeight: "500",
                color: invertColor ? "#000000" : "#000000",
                padding: 0,
                fontSize: largeScreen ? ".7rem" : ".55rem",
              }}
              onClick={(e) => navigate("/info")}
            >
              Info
            </Button>
          </Grid>
          <Grid
            item
            xs={6}
            sm={1}
            sx={{ display: "flex", justifyContent: "flex-end" }}
          >
            <Button
              className={classes.menuButton}
              style={{
                fontFamily: "Square721",
                fontWeight: "500",
                //color: invertColor ? "#FFFFFF" : "#000000",//
                color: invertColor ? "#000000" : "#000000",
                padding: 0,
                fontSize: largeScreen ? ".7rem" : ".55rem",
              }}
              onClick={(e) => navigate("/projectindex")}
            >
              Index
            </Button>
          </Grid>

          <Grid
            item
            xs={8}
            sm={8}
            style={{
              display: "block",
              alignItems: "center",
              justifyContent: "flex-end",
              visibility: hideLogo ? "hidden" : "visible",
              // position:"relative",
            }}
            onClick={(e) => navigate("/")}
          >
            {largeScreen ? (
              <Fade
                in={showLogo}
                mountOnEnter
                unmountOnExit
                timeout={{ appear: 2500, enter: 2500, exit: 500 }}
              >
                <img
                  className={classes.logo}
                  src={logo_gif}
                  onClick={(e) => navigate("/")}
                />
              </Fade>
            ) : null}
          </Grid>
        </Grid>
        {/*         
        <Grid
          item
          xs={0}
          sm={0}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            className={classes.menuButton}
            style={{
              fontFamily: "Square721",
              fontWeight: "500",
              color: invertColor ? "#000000" : "#000000",
              padding: 0,
              fontSize: largeScreen ? ".7rem" : ".55rem",
            }}
            onClick={(e) => navigate("/info")}
          >
            Info
          </Button>
        </Grid>
        <Grid
          item
          xs={2}
          sm={2}
          sx={{ display: "flex", justifyContent: "flex-end" }}
        >
          <Button
            className={classes.menuButton}
            style={{
              fontFamily: "Square721",
              fontWeight: "500",
              //color: invertColor ? "#FFFFFF" : "#000000",//
              color: invertColor ? "#000000" : "#000000",
              padding: 0,
              fontSize: largeScreen ? ".7rem" : ".55rem",
            }}
            onClick={(e) => navigate("/index")}
          >
            Index
          </Button>
        </Grid> */}

        {/* <Grid
          item
          xs={6}
          sm={5}
          style={{
            padding: largeScreen ? "0px 5px" : "0px",
            minWidth: largeScreen && showLogo ? "100%" : "60%",
          }}
        >
          {largeScreen ? (
            <Fade in={showLogo} unmountOnExit timeout={500}>
              <img
                className={classes.logo}
                src={logo_gif}
                onClick={(e) => navigate("/")} />
            </Fade>
          ) : null}
        </Grid> */}

        {/* </Grid> */}
      </div>
      <div className={classes.gradient}></div>
    </>
  );
};

export default NavBar;
