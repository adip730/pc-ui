import React, { useState, useContext, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";
import InfoRender from "../threejs/InfoRender";
import useMediaQuery from "@mui/material/useMediaQuery";
import Footer from "./Footer";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    // height: '100vh',
    alignItems: "center",
  },
  assetContainer: {
    height: "100vh",
    // border: "1px solid black",
    textAlign: "center",
    width: '100%',
  },
  textContainer: {
    height: "25%",
    width: "25%",
    position: "absolute",
    bottom: "64px",
    left: "10%",
    textAlign: "left",
  },
}));

export const AboutPage = (props) => {
  const classes = useStyles();
  const largeScreen = useMediaQuery("(min-width:600px)");

  return (
    <div className={classes.root}>
      <div className={classes.assetContainer}>
        <InfoRender />
      </div>
      <div className={classes.textContainer} style={{width: largeScreen ? '25%' : '100%', padding: largeScreen ? 0 : '64px 20px 20px 20px', boxSizing: 'border-box', bottom: largeScreen ? '48px' : "16px", left: largeScreen ? '10%' : 0, right: largeScreen ? '' : 0, textAlign: largeScreen ? 'left' : 'center'}}>
        <Typography
          style={{
            fontFamily: "Square721",
            fontSize: largeScreen ? ".75rem" : '.6rem',
          }}
        >
          Pleasure Craft is a NYC-based creative studio and directing duo that
          specializes in CGI and live-action cinematography. The world they
          create becomes a portal that trancends from the ordinary to the
          surreal.
        </Typography>
      </div>
      <div style={{ width: "100%", position: "absolute", bottom: 0 }}>
        <Footer />
      </div>
    </div>
  );
};

export default AboutPage;
