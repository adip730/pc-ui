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
  scrollView: {
    width: "100%",
    height: "100vh",
    overflowY: "scroll",
  },
  root: {
    animation: "$fadein 1000ms",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    // padding: "84px 64px 0 64px",
    paddingTop: '84px',
    height: "100vh",
    width: "100%",
    overflowY: "scroll",
    boxSizing: "border-box",
    justifyContent: "flex-start",
    backgroundColor: "#dde1e1",
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
    background: "#dde1e1 !important",
  },
  videoWrapper: {
    height: "100%",
    borderRadius: "20px",
    overflow: "hidden",
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    aspectRatio: 16 / 9,
    backgroundColor: "#dde1e1",
  },
  overlay: {
    height: "100%",
    width: "100%",
    position: "absolute",
    top: 0,
    left: 0,
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
    height: "auto",
    width: "100%",
    padding: "16px 64px",
    marginBottom: "32px",
    display: "flex",
  },
  row: {
    marginTop: "32px",
    textAlign: "center",
    maxWidth: "75%",
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
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [showOverlay, setShowOverlay] = useState(false);
  const [isLoaded, setIsLoaded] = useState(false);
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
    if (!playing && isLoaded) {
      setShowOverlay(true);
    }
  }, [playing, isLoaded]);

  const handleProgress = (changeState) => {
    if (changeState.played === 1) {
      setPlaying(false);
    }
    if (!seeking) {
      setVideoDuration(changeState.played);
    }
  };

  // Manual Video Expansion
  // useEffect(() => {
  //   let container = document.getElementById("container");
  //   let player = document.getElementById("player-wrapper");
  //   let root = document.getElementById("pageRoot");
  //   if (container && player) {
  //     if (expanded) {
  //       setShowNav(false);
  //       player.style.transition = ".25s";
  //       container.style.transition = "all 1s ease-in-out";
  //       player.style.transformOrigin = "0 50%";
  //       container.style.transformOrigin = "center";
  //       player.style.borderRadius = 0;
  //       container.style.height = "100vh";
  //       player.style.paddingTop = "56.25%";
  //       player.style.height = "auto";
  //       player.style.width = "100%";
  //       container.style.width = "100vw";
  //       container.style.position = "fixed";
  //       container.style.top = 0;
  //       container.style.left = 0;
  //       container.style.right = 0;
  //       container.style.bottom = 0;
  //       container.style.marginBottom = 0;
  //       container.style.borderRadius = 0;
  //       container.style.backgroundColor = "#1a1a1a";
  //     } else {
  //       setShowNav(true);
  //       container.style.transition = "0s";
  //       container.style.height = "60%";
  //       container.style.width = "100%";
  //       container.style.position = "relative";
  //       container.style.marginBottom = "24px";
  //       container.style.borderRadius = "20px";
  //       container.style.backgroundColor = "#FFFFFF";
  //       player.style.borderRadius = "20px";
  //       player.style.paddingTop = 0;
  //       player.style.height = "100%";
  //       player.style.width = "";
  //     }
  //   }
  // }, [expanded]);

  // Controls styling
  // const host = document.getElementById("videoFrame");
  // // host?.attachShadow({mode: 'open'})
  // var sheet = new CSSStyleSheet();
  // sheet.replaceSync(`-webkit-media-controls::- { color: rgb(255, 0, 0) }`);
  // // console.log(host);
  // // console.log(host?.shadowRoot);
  // const elemStyleSheets = host?.shadowRoot?.adoptedStyleSheets;
  // elemStyleSheets?.push(sheet);

  return (
    <div
      className={classes.root}

      id="pageRoot"
    >
      <div
        className={classes.window}
        id="container"
        // onMouseEnter={() => expanded && setShowControls(true)}
        // onMouseLeave={() => expanded && setShowControls(false)}
        onMouseEnter={() => playing && setShowOverlay(true)}
        onMouseLeave={() => playing && setShowOverlay(false)}
      >
        <div
          className={classes.videoWrapper}
          onClick={() => setPlaying(!playing)}
          // onMouseEnter={() => !expanded && setShowControls(true)}
          // onMouseLeave={() => !expanded && setShowControls(false)}
          onMouseEnter={() => playing && setShowOverlay(true)}
          onMouseLeave={() => playing && setShowOverlay(false)}
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
            width={expanded ? "auto" : "100%"}
            height={expanded ? "100%" : "auto"}
            playing={playing}
            volume={volume}
            playsinline
            controls={false}
            progressInterval={100}
            onProgress={handleProgress}
            onReady={() => setIsLoaded(true)}
          />

          {showOverlay && (
            <>
              <div className={classes.overlay}>
                <IconButton
                  size="large"
                  style={{ color: "#FFFFFF" }}
                  onClick={() => {
                    setShowOverlay(!showOverlay);
                    setPlaying(!playing);
                  }}
                >
                  <Typography
                    sx={{
                      fontFamily: "Square721",
                      fontSize: "1rem",
                    }}
                  >
                    {playing ? "PAUSE" : "PLAY"}
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
          padding: largeScreen ? '16px 64px' : '16px 32px',
        }}
      >
        <Grid item xs={6}>
          <Typography
            color="primary"
            sx={{
              fontFamily: "Square721",
              fontSize: largeScreen ? ".75rem" : ".6rem",
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
              fontSize: largeScreen ? ".75rem" : ".6rem",
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
              fontSize: largeScreen ? ".75rem" : ".6rem",
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
              fontSize: largeScreen ? ".75rem" : ".6rem",
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
              fontSize: largeScreen ? ".75rem" : ".6rem",
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
              fontSize: largeScreen ? ".75rem" : ".6rem",
              textAlign: "left",
            }}
          >
            {client?.toUpperCase()}
          </Typography>
        </Grid>
        {creditsArr.map((cred) => {
          return (
            <>
              <Grid item xs={6}>
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
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
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                    textAlign: "left",
                  }}
                >
                  {cred[1]?.toUpperCase()}
                </Typography>
              </Grid>
            </>
          );
        })}

        <Grid item xs={12} className={classes.row} sx={{ marginTop: "32px" }}>
          <Typography
            color="primary"
            style={{
              fontFamily: "Square721",
              textAlign: "center",
              fontSize: largeScreen ? ".75rem" : ".6rem",
            }}
          >
            {writeup?.toUpperCase()}
          </Typography>
        </Grid>
      </Grid>
      <div style={{ width: "100%", marginTop: "auto" }}>
        <Footer />
      </div>
    </div>
  );
};

export default ProjectPageNew;
