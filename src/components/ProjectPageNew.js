import React, { useState, useEffect, useContext, useRef } from "react";
import ReactPlayer from "react-player/file";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppContext from "../context/AppContext";
import Footer from "./Footer";

import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import Slider from "@mui/material/Slider";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ReplayIcon from "@mui/icons-material/Replay";

const useStyles = makeStyles(() => ({
  "@keyframes fadein": {
    "0%": {
      opacity: 0,
    },
    "100%": {
      opacity: 1,
    },
  },
  root: {
    animation: "$fadein 1000ms",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    padding: "84px 64px 0 64px",
    // maxHeight: "calc(100%-60)",
    height: "100vh",
    width: "100%",
    // flexGrow: 1,
    overflow: "auto",
    boxSizing: "border-box",
    justifyContent: "flex-start",
    
  },
  window: {
    height: "60%",
    minHeight: "60%",
    width: "100%",
    overflow: "hidden",
    borderRadius: "20px",
    position: "relative",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: "24px",
  },
  videoWrapper: {
    height: "100%",
    // width: "100%",
    borderRadius: "20px",
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    aspectRatio: 16 / 9,
    // borderRadius: "20px",
    // marginRight: "64px",
    // objectFit: "cover",
  },
  overlay: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    // backgroundColor: "#00000033",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 3,
  },
  thumbnail: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
    zIndex: 2,
  },
  infoSection: {
    position: "relative",
    // bottom: 0,
    // marginTop: "auto",
    height: "auto",
    width: "100%",
    // boxSizing: "border-box",
    padding: "16px 0",
    marginBottom: "32px",
    display: "flex",
    // flexDirection: "column",
    // marginBottom: "16px",
    // rowGap: "24px",
    // justifyContent: "flex-start",
  },
  row: {
    marginTop: "32px",
    textAlign: "center",

    maxWidth: "75%",
    // alignItems: "center",
    // justifyContent: "center",
  },
  controls: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    height: "10%",
    maxHeight: "48px",
    width: "100%",
    background: "#000000",
    opacity: 0.75,
    position: "absolute",
    bottom: 0,
    boxSizing: "border-box",
    padding: "4px 32px",
  },
  playPause: {
    maxWidth: "10%",
  },
  volume: {
    maxWidth: "10%",
    display: "flex",
    alignItems: "center",
    justifyContent: "flex-start",
  },
  scrub: {
    flexGrow: 1,
    padding: "0 2%",
    display: "flex",
    alignItems: "center",
  },
  fullScreen: {
    maxWidth: "10%",
  },
  durationSlider: {
    color: "#FFFFFF",
    // height: 24,
    "& .MuiSlider-track": {
      border: "none",
      backgroundColor: "#FFFFFF",
      height: "8px",
    },
    "& .MuiSlider-thumb": {
      display: "none",
    },
    "& .MuiSlider-rail": {
      backgroundColor: "#FFFFFF",
      height: "8px",
    },
  },
}));

const endpoint = process.env.REACT_APP_STRAPIURL;

export const ProjectPageNew = (props) => {
  const { viewMode, data, media } = props;
  const classes = useStyles();
  const navigate = useNavigate();

  const { api } = useContext(AppContext);
  const { setShowNav } = api;

  const {
    projectName,
    name,
    role,
    client,
    writeup,
    roles,
    director,
    code,
    featured,
    thumbnail,
    gallery,
    description,
  } = data;

  const largeScreen = useMediaQuery("(min-width:800px)");
  const xlargeScreen = useMediaQuery("(min-width:1200px)");

  const playerRef = useRef(null);

  const [featuredUrl, setFeaturedUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [creditsArr, setCreditsArr] = useState([]);

  const [expanded, setExpanded] = useState(false);
  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(0);
  const [showControls, setShowControls] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [videoDuration, setVideoDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);

  useEffect(() => {
    let featUrl = featured.data.attributes.url;
    let thumbUrl =
      thumbnail && thumbnail.data && thumbnail.data.attributes
        ? thumbnail.data.attributes.url
        : "";
    setFeaturedUrl(featUrl);
    setThumbnailUrl(thumbUrl);

    if (roles) {
      let tempCreds = roles.split(",");
      let creds = [];
      tempCreds.forEach((cred) => {
        creds.push(cred.split(":"));
      });
      setCreditsArr(creds);
    } else {
      setCreditsArr([]);
    }
  }, []);

  useEffect(() => {
    if (!largeScreen) {
      if (!expanded) {
        setShowOverlay(true);
        setPlaying(false);
      }
    }
  }, [expanded]);

  /*useEffect(() => {
    if (!largeScreen) {
      if (playing) {
        setExpanded(true);
      }
    }
  }, [playing]);*/

  const handleProgress = (changeState) => {
    if (changeState.played === 1) {
      setPlaying(false);
    }
    if (!seeking) {
      setVideoDuration(changeState.played);
    }
  };

  useEffect(() => {
    let container = document.getElementById("container");
    let player = document.getElementById("player-wrapper");
    let root = document.getElementById("pageRoot");
    if (container && player) {
      if (expanded) {
        setShowNav(false);
        player.style.transition = ".25s";
        container.style.transition = "all 1s ease-in-out";
        player.style.transformOrigin = "0 50%";
        container.style.transformOrigin = "center";
        player.style.borderRadius = 0;
        container.style.height = "100vh";
        player.style.paddingTop = "56.25%";
        player.style.height = "auto";
        player.style.width = "100%";
        container.style.width = "100vw";
        container.style.position = "fixed";
        container.style.top = 0;
        container.style.left = 0;
        container.style.right = 0;
        container.style.bottom = 0;
        container.style.marginBottom = 0;
        container.style.borderRadius = 0;
        container.style.backgroundColor = "#1a1a1a";
      } else {
        setShowNav(true);
        container.style.transition = "0s";
        container.style.height = "60%";
        container.style.width = "100%";
        container.style.position = "relative";
        container.style.marginBottom = "24px";
        container.style.borderRadius = "20px";
        container.style.backgroundColor = "#FFFFFF";
        player.style.borderRadius = "20px";
        player.style.paddingTop = 0;
        player.style.height = "100%";
        player.style.width = "";
      }
    }
  }, [expanded]);

  // const host = document.getElementById("videoFrame");
  // var sheet = new CSSStyleSheet();
  // sheet.replaceSync(`-webkit-media-controls::- { color: rgb(255, 0, 0) }`);
  // host.shadowRoot.adoptedStyleSheets = [sheet];

  return (
    <div
      className={classes.root}
      id="pageRoot"
      style={{
        padding: largeScreen ? "84px 64px 0px 64px" : "84px 32px 0px 32px",
      }}
    >
      <div
        className={classes.window}
        id="container"
        onMouseEnter={() => expanded && setShowControls(true)}
        onMouseLeave={() => expanded && setShowControls(false)}
      >
        <div
          className={classes.videoWrapper}
          onMouseEnter={() => !expanded && setShowControls(true)}
          onMouseLeave={() => !expanded && setShowControls(false)}
          id="player-wrapper"
        >
          <ReactPlayer
            onClick={() => setPlaying(!playing)}
            ref={playerRef}
            id="videoFrame"
            style={{
              maxHeight: "100%",
              maxWidth: "100%",
              borderRadius: expanded ? "0px" : "20px",
              overflow: "hidden",
              position: "absolute",
              top: 0,
              left: 0,
              alignContent: "center",
            }}
            url={`http://${endpoint}${featuredUrl}`}
            // width="100%"
            // height='auto'
            width={expanded ? "auto" : "100%"}
            height={expanded ? "100%" : "auto"}
            playing={playing}
            // loop
            volume={volume}
            // muted
            playsinline
            controls={showControls}
            progressInterval={100}
            onProgress={handleProgress}
          />

          {showOverlay && (
            <>
              <div className={classes.overlay}>
                <IconButton
                  size="large"
                  style={{ color: "#FFFFFF" }}
                  onClick={() => {
                    setShowOverlay(false);
                    setPlaying(true);
                  }}
                >
                  {/* <PlayCircleOutlinedIcon
                    style={{ height: "60px", width: "60px" }}
                  /> */}
                  <Typography
                    sx={{
                      fontFamily: "Square721",
                      fontSize: '1rem',
                    }}
                  >
                    PLAY
                  </Typography>
                </IconButton>
              </div>
              {thumbnailUrl !== "" && (
                <img
                  className={classes.thumbnail}
                  src={`http://${endpoint}${thumbnailUrl}`}
                />
              )}
            </>
          )}
        </div>
      </div>

      <Grid
        container
        className={classes.infoSection}
        direction="row"
        rowSpacing={0.5}
        columnSpacing={4}
        sx={{
          display: expanded ? "none" : "flex",
          marginBottom: largeScreen ? "48px" : "32px",
        }}
      >
        <Grid item xs={6}>
          <Typography
            color="primary"
            sx={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".7rem",
              textAlign: "right",
            }}
          >
            PROJECT
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            color="primary"
            sx={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".7rem",
              textAlign: "left",
            }}
          >
            {projectName?.toUpperCase()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            color="primary"
            sx={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".7rem",
              textAlign: "right",
            }}
          >
            ROLE
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            color="primary"
            sx={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".7rem",
              textAlign: "left",
            }}
          >
            {role?.toUpperCase()}
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            color="primary"
            sx={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".7rem",
              textAlign: "right",
            }}
          >
            CLIENT
          </Typography>
        </Grid>
        <Grid item xs={6}>
          <Typography
            color="primary"
            sx={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".7rem" : ".7rem",
              textAlign: "left",
            }}
          >
            {client?.toUpperCase()}
          </Typography>
        </Grid>

        {/* {creditsArr.map((cred) => {
          return (
            <>
              <Grid item xs={6}>
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".7rem" : ".7rem",
                    textAlign: "right",
                  }}
                >
                  {cred[0]?.toUpperCase()}
                </Typography>
              </Grid>
              <Grid item xs={6}>
                <Typography
                  color="primary"
                  sx={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".7rem" : ".7rem",
                    textAlign: "left",
                  }}
                >
                  {cred[1]?.toUpperCase()}
                </Typography>
              </Grid>
            </>
          );
        })} */}

        <Grid item xs={12} className={classes.row} sx={{ marginTop: "32px" }}>
          <Typography
            color="primary"
            style={{
              fontFamily: "Square721",
              textAlign: "center",
              fontSize: largeScreen ? ".7rem" : ".7rem",
              padding: largeScreen ? "0 10rem 0 10rem" : "0",
              maxWidth:largeScreen ? "50%" : "90%",
              margin:"0 auto",
              whiteSpace: "pre-line",
            }}
          >
            {/* {writeup?.toUpperCase()} */}
            {writeup}
          </Typography>
        </Grid>
      </Grid>

      <div
        style={{
          width: largeScreen ? "calc(100% + 128px)" : "calc(100% + 64px)",
          // marginTop: "auto",
          // marginLeft: '-64px',
          // marginRight: '-64px',
          margin: largeScreen ? 'auto -64px 0 -64px' : 'auto -32px 0 -32px',
        }}
      >
        <Footer />
      </div>
      {/* )} */}
      {/* {xlargeScreen && (
        <div
          style={{
            position: "absolute",
            bottom: 0,
            width: "100%",
            marginTop: "auto",
          }}
        >
          <Footer />
        </div> */}
    </div>
  );
};

export default ProjectPageNew;
