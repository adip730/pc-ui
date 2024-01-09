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
    height: "100vh",
    width: "100%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "flex-end",
    padding: "84px 24px 0 24px",
    boxSizing: "border-box",
    //background: "rgb(237,239,240)",
    backgroundColor: "#dde1e1",
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
    paddingTop: "200px",
    boxSizing: "border-box",
  },

  viewWindow: {
    minHeight: 0,
    maxHeight: "30%",
    height: "auto",
    maxWidth: "50%",
    borderRadius: "20px",
    overflow: "hidden",
    //boxShadow: '1px 1px 1px 1px grey',
    zIndex: 2,
    boxShadow:
      "rgba(0, 0, 0, 0.2) 0px 12px 28px 0px, rgba(0, 0, 0, 0.1) 0px 2px 4px 0px, rgba(255, 255, 255, 0.05) 0px 0px 0px 1px inset",
  },

  bottomBox: {
    zIndex: 1,
    width: "100%",
    height: "auto",
    maxHeight: "80%",
    overflowY: "auto",
    paddingBottom: '64px',
  },
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

  useEffect(() => {
    if (hover !== "") {
      if (projects.some((proj) => proj.name === hover)) {
        let proj = projects[projects.findIndex((proj) => proj.name === hover)];
        if (proj.preview && proj.preview.data && proj.preview.data.attributes) {
          let url = proj.preview.data.attributes.url;
          setFeaturedUrl(`http://${endpoint}${url}`);
        }
      }
    } else {
      setFeaturedUrl("");
      setIsLoaded(false);
    }
  }, [hover]);

  const goTo = (route) => {
    navigate(`../project/${route}`, { replace: true });
  };

  return (
    <div
      className={classes.viewContainer}
      style={{
        padding: largeScreen ? "84px 24px 0px 24px" : "84px 24px 0px 24px",
      }}
    >
      <div className={classes.bottomBox}>
        {projects.map((proj, index) => {
          return (
            <Grid
              container
              columns={{ xs: 3, md: 15 }}
              direction="row"
              alignItems="center"
              justifyContent="space-evenly"
              key={`${proj.projectName}-${index}`}
              sx={{ padding: "4px 0 4px 0" }}
            >
              <Grid
                sx={{
                  display: { xs: "none", md: "block" },
                  textAlign: "left",
                }}
                item
                xs={0}
                md={5}
                align="left"
                onMouseEnter={(e) => setHover(proj.name)}
                onMouseLeave={(e) => setHover("")}
              >
                <Button
                  className={classes.indexButton}
                  style={{
                    display: "block",
                    position: "absolute",
                    width: "90%",
                  }}
                  onClick={() => goTo(proj.name)}
                />
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                    lineHeight: ".6rem",
                  }}
                >
                  {proj.projectName.toUpperCase()}
                </Typography>
              </Grid>

              <Grid item xs={1} md={3} sx={{ textAlign: "left" }}>
                {largeScreen ? (
                  <Typography
                    color="primary"
                    style={{
                      fontFamily: "Square721",
                      fontSize: largeScreen ? ".75rem" : ".6rem",
                      lineHeight: ".6rem",
                    }}
                  >
                    {proj.client.toUpperCase()}
                  </Typography>
                ) : (
                  <>
                    <Button
                      className={classes.indexButton}
                      style={{
                        display: "block",
                        position: "absolute",
                        width: "90%",
                      }}
                      onClick={() => goTo(proj.name)}
                    />
                    <Typography
                      color="primary"
                      style={{
                        fontFamily: "Square721",
                        fontSize: largeScreen ? ".75rem" : ".6rem",
                        lineHeight: ".6rem",
                      }}
                    >
                      {proj.client.toUpperCase()}
                    </Typography>
                  </>
                )}
              </Grid>
              <Grid item xs={1} md={3} sx={{ textAlign: "center" }}>
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                    lineHeight: ".6rem",
                  }}
                >
                  {proj.role.toUpperCase()}
                </Typography>
              </Grid>
              <Grid
                sx={{
                  display: { xs: "none", md: "block", textAlign: "center" },
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
                xs={1}
                md={1}
                sx={{
                  textAlign: { xs: "right", md: "center" },
                }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                    lineHeight: ".6rem",
                  }}
                >
                  {proj.code.toUpperCase()}
                </Typography>
              </Grid>
            </Grid>
          );
        })}
      </div>
      <div
        style={{
          width: "100%",
          position: "relative",
          width: "calc(100% + 48px)",
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
