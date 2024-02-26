import React, { useState, useContext, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import { Typography } from "@mui/material";
import InfoRender from "../threejs/InfoRender";
import useMediaQuery from "@mui/material/useMediaQuery";
import Footer from "./Footer";
import Grid from "@mui/material/Grid";
import { link } from "fs";


const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    width: "100%",
    // height: '100vh',
    alignItems: "center",
    overflow:"hidden",
  },

  assetContainer: {
    height: "100vh",
    // border: "1px solid black",
    textAlign: "right",
    width: '100%',
    padding: 0,
  },

  textContainer: {
    columnGap: "20px",
    textAlign: "right",
    paddingLeft:"20px",
    paddingRight:"20px",
    // height: "40rem",
    // width: "40rem",
    // position: "fixed",
    // bottom: "10px",
    // left: "40vw",
    // textAlign: "left",
  },
}));

export const AboutPage = (props) => {
  const classes = useStyles();
  const largeScreen = useMediaQuery("(min-width:600px)");

  return (
    <div className={classes.root}>
      <div className={classes.assetContainer} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
        <InfoRender />
      </div>

      <Grid
          container
          className={classes.textContainer} 
          style={{
            width: largeScreen ? '100%' : '100%', 
            padding: largeScreen ? '0px 10px 0px 10px' : '0px 4px 0px 4px', 
            // boxSizing: 'border-box', bottom: largeScreen ? '0rem' : "16px", 
            flexWrap:"nowrap",
            alignItems:"flex-end",
            position: "fixed",
            bottom: "0",
            paddingBottom:"10px",
            justifyContent: "flex-end",
          }}
        >
          <Grid
            item
            xs={6}
            sm={12}
            sx={{ display: "flex", justifyContent: "flex-start" , flexwrap:"nowrap",}}
          >
            <Typography
            style={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".55rem",
              // right: "0",
              // paddingBottom:"10px",
              textAlign:"left",
             }}>
            Pleasure Craft is a NYC-based creative studio and directing duo that specializes in CGI and live-action cinematography to design visual worlds that transcend the ordinary.
            </Typography>
          </Grid>

          <Grid
            item
            xs={6}
            sm={12}
            sx={{ display: "flex", justifyContent: "flex-end" , flexwrap:"nowrap",}}
            style={{
              textDecoration: "none",
            }}
          >
            <Typography
            style={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".55rem",
              // right: "0",
              // paddingBottom:"10px",
              textTransform:"Uppercase",
              textDecoration: "none",
             }}>
            info@pleasurecraft.fun
            </Typography>
          </Grid>

          <Grid
            item
            xs={6}
            sm={12}
            sx={{ display: "flex", justifyContent: "flex-end" , flexwrap:"nowrap",}}
            style={{
            }}
          >
            <Typography
            style={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".55rem",
              textTransform:"Uppercase",
              // right: "0",
              // paddingBottom:"10px",
             }}>
            Instagram
            </Typography>
          </Grid>

      </Grid>


    </div>
  );
};

export default AboutPage;
