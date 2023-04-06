import React, { useState, useContext, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";
import HomeLogo from "../threejs/HomeLogo";
import InfoRender from "../threejs/InfoRender";

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
    border: "1px solid black",
    textAlign: "center",
  },
  textContainer: {
    height: "25%",
    width: "25%",
    position: "absolute",
    bottom: "64px",
    left: "10%",
    // border: "1px solid black",
    textAlign: "left",
  },
}));

export const AboutPage = (props) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      <div className={classes.assetContainer}>
        <InfoRender />
      </div>
      <div className={classes.textContainer}>
        <Typography
          style={{
            fontFamily: "Square721",
            fontSize: ".75rem"
          }}
        >
          About us blurb will go here. About us blurb will go here. About us
          blurb will go here. About us blurb will go here. About us blurb will
          go here. About us blurb will go here. About us blurb will go here.
          About us blurb will go here. About us blurb will go here. About us
          blurb will go here. About us blurb will go here.
        </Typography>
      </div>
    </div>
  );
};

export default AboutPage;
