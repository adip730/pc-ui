// CHANGE THE VIDEO TO PREVIEW VIDEOS

import React, { useState, useContext, useEffect } from "react";
import makeStyles from "@mui/styles/makeStyles";
import AppContext from "../context/AppContext";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import Footer from "./Footer";
import Button from "@mui/material/Button";

const useStyles = makeStyles(() => ({
  viewContainer: {
    position: "relative",
    height: "auto",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    // padding: "0px 24px 0 24px",
    boxSizing: "border-box",
    //background: "rgb(237,239,240)",
    backgroundColor: "#dde1e1",
    overflow: "hidden",
    marginTop: "-10px",
  },

  previewContainer: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: "180px",
    boxSizing: "border-box",
  },

  viewWindow: {
    minHeight: 0,
    maxHeight: "50%",
    height: "auto",
    maxWidth: "50%",
    borderRadius: "20px",
    overflow: "hidden",
    //boxShadow: '1px 1px 1px 1px grey',
    zIndex: 0,
    // boxShadow:
    //   "rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset",
  },

  bottomBox: {
    zIndex: 1,
    width: "100%",
    height: "100dvh",
    maxHeight: "80%",
    overflowY: "auto",
    display: "flex",
    justifyContent: "flex-end",
    flexDirection: "column",
    // paddingBottom:"10px",
  },

  // indexButton:{
  //   "&:hover": {
  //   backgroundColor: 'red important!',
  //   }
  // }
}));

const endpoint = process.env.REACT_APP_STRAPIURL;

export const IndexPage = (props) => {
  const { state, api } = useContext(AppContext);
  const { projects, videoMap } = state;

  const classes = useStyles();
  let navigate = useNavigate();

  const largeScreen = useMediaQuery("(min-width:600px)");

  const [hover, setHover] = useState("");
  const [featuredUrl, setFeaturedUrl] = useState("");

  const [isLoaded, setIsLoaded] = useState(false);

  const xsScreen = useMediaQuery("(max-width:385px)");

  useEffect(() => {
    if (hover !== "") {
      if (projects.some((proj) => proj.name === hover)) {
        let proj = projects[projects.findIndex((proj) => proj.name === hover)];
        if (proj.preview && proj.preview.data && proj.preview.data.attributes) {
          let url = proj.preview.data.attributes.url;
          setFeaturedUrl(`https://${endpoint}${url}`);
        }
      }
    } else {
      setFeaturedUrl("");
      setIsLoaded(false);
    }
  }, [hover]);

  // useEffect(() => {
  //   if (hover !== "") {
  //     if (projects.some((proj) => proj.client === hover)) {
  //       let proj =
  //         projects[projects.findIndex((proj) => proj.client === hover)];
  //       if (proj.featured) {
  //         let url = proj.preview.data[0].attributes.url;
  //         setFeaturedUrl(`https://${endpoint}${url}`);
  //       }
  //     }
  //   } else {
  //     setFeaturedUrl("");
  //     setIsLoaded(false);
  //   }
  // }, [hover]);

  const goTo = (route) => {
    navigate(`../project/${route}`, { replace: true });
  };

  return (
    <div
      className={classes.viewContainer}
      style={{
        padding: largeScreen ? "0px 24px 0px 24px" : "0px 10px 0px 10px",
      }}
    >
      <div
        className={classes.bottomBox}
        style={{
          paddingBottom: largeScreen ? "84px" : "34px",
        }}
      >
        {projects.map((proj, index) => {
          return (
            <Grid
              container
              columns={{ xs: 2, md: 15 }}
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
              key={`${proj.projectName}-${index}`}
              sx={{ padding: "4px 0 4px 0" }}
              style={{
                marginBottom: "2px",
              }}
            >
              <Grid
                sx={{
                  textAlign: "left",
                  whiteSpace: "nowrap",
                }}
                item
                xs={1}
                md={3}
                align="left"
                onMouseEnter={(e) => setHover(proj.name)}
                onMouseLeave={(e) => setHover("")}
              >
                <Button
                  className={classes.indexButton}
                  style={{
                    display: "block",
                    position: "absolute",
                    width: "calc(100% - 48px)",
                  }}
                  onClick={() => goTo(proj.name)}
                />
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen
                      ? ".75rem"
                      : xsScreen
                      ? ".5rem"
                      : ".6rem",
                    lineHeight: ".6rem",
                  }}
                >
                  {proj.client?.toUpperCase()}
                </Typography>
              </Grid>

              <Grid
                item
                xs={0}
                md={5}
                sx={{
                  display: { xs: "none", md: "block" },
                  textAlign: "left",
                }}
                onMouseEnter={(e) => setHover(proj.client)}
                onMouseLeave={(e) => setHover("")}
              >
                {/* {largeScreen ? ( */}
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                    lineHeight: ".6rem",
                  }}
                >
                  {proj.projectName?.toUpperCase()}
                </Typography>
                {/* ) : (
                  <>
                    <Button
                      className={classes.indexButton}
                      style={{
                        display: "block",
                        position: "absolute",
                        width: "calc(100% - 48px)",
                        cursor: "pointer",
                      }}
                      onClick={() => goTo(proj.name)}
                    />
                    <Typography
                      color="primary"
                      style={{
                        fontFamily: "Square721",
                        fontSize: largeScreen
                          ? ".75rem"
                          : xsScreen
                          ? ".5rem"
                          : ".6rem",
                        lineHeight: ".6rem",
                      }}
                    >
                      {proj.client?.toUpperCase()}
                    </Typography>
                  </>
                )} */}
              </Grid>

              <Grid
                item
                xs={0}
                md={3}
                sx={{
                  textAlign: { xs: "left", md: "left" },
                  display: { xs: "none", md: "block" },
                  paddingLeft: { xs: "4rem" },
                  whiteSpace: "nowrap",
                }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen
                      ? ".75rem"
                      : xsScreen
                      ? ".5rem"
                      : ".6rem",
                    lineHeight: ".6rem",
                  }}
                >
                  {proj.role?.toUpperCase()}
                </Typography>
              </Grid>

              <Grid
                sx={{
                  display: { xs: "none", md: "block", textAlign: "left" },
                }}
                item
                xs={0}
                md={3}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                    lineHeight: ".6rem",
                  }}
                >
                  {proj.roles?.toUpperCase()}
                </Typography>
              </Grid>
              <Grid
                item
                xs={0}
                md={1}
                sx={{
                  textAlign: { md: "right" },
                  display: { xs: "none", md: "block" },
                }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen
                      ? ".75rem"
                      : xsScreen
                      ? ".5rem"
                      : ".6rem",
                    lineHeight: ".6rem",
                    textAlign: "right",
                  }}
                >
                  {proj.code?.toUpperCase()}
                </Typography>
              </Grid>
              <Grid
                item
                xs={1}
                md={0}
                sx={{
                  textAlign: { xs: "right", md: "right" },
                  display: { xs: "block", md: "none" },

                }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen
                      ? ".75rem"
                      : xsScreen
                      ? ".5rem"
                      : ".6rem",
                    lineHeight: ".6rem",
                  }}
                >
                  {proj.projectName?.toUpperCase()}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </div>
      <div
        style={{
          // width: "100%",
          position: "relative",
          width: "calc(100% + 24px)",
          margin: "-44px -48px 0 -48px",
          // bottom: 0,
        }}
      >
        <Footer />
      </div>

      {hover !== "" && (
        <div
          className={classes.previewContainer}
          style={{ display: largeScreen ? "flex" : "none" }}
        >
          <div
            className={classes.viewWindow}
            style={{ display: isLoaded ? "" : "none" }}
          >
            <video
              onLoadedData={() => setIsLoaded(true)}
              autoPlay
              muted
              height="auto"
              width="100%"
              style={{
                maxWidth: "100%",
                maxHeight: "100%",
                overflow: "hidden",
                borderRadius: "20px",
              }}
              src={videoMap[hover] ? videoMap[hover] : featuredUrl}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default IndexPage;
