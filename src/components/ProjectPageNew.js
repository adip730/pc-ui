import React, {
  useState,
  useEffect,
  useContext,
  useLayoutEffect,
  useRef,
} from "react";
import { isMobile } from "react-device-detect";
import ReactPlayer from "react-player/file";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppContext from "../context/AppContext";
import Footer from "./Footer";
import ProjectItem from "./ProjectItem";

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
  "@keyframes fadeInLeft": {
    "0%": { transform: "translateX(-150%) scale(0.8)" },
    "100%": { transform: "translateX(0%) scale(1)" },
  },
  "@keyframes fadeInRight": {
    "0%": { transform: "translateX(150%) scale(0.8)" },
    "100%": { transform: "translateX(0%) scale(1)" },
  },
  "@keyframes fadeOutLeft": {
    "0%": { transform: "translateX(0%) scale(1)" },
    "100%": { transform: "translateX(-150%) scale(0.8)" },
  },
  "@keyframes fadeOutRight": {
    "0%": { transform: "translateX(0%) scale(1)" },
    "100%": { transform: "translateX(150%) scale(0.8)" },
  },
  showPrev: {
    animation: "$fadeInLeft ease-in-out 300ms",
  },
  hidePrev: {
    animation: "$fadeOutRight ease-in-out 300ms",
  },
  showNext: {
    animation: "$fadeInRight ease-in-out 300ms",
  },
  hideNext: {
    animation: "$fadeOutLeft ease-in-out 300ms",
  },
  root: {
    animation: "$fadein 1000ms",
    position: "absolute",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    position: "relative",
    padding: "84px 64px 0 64px",
    // paddingTop: "84px",
    height: "100vh",
    width: "100%",
    overflowY: "scroll",
    boxSizing: "border-box",
    justifyContent: "flex-start",
    backgroundColor: "#dde1e1",
  },
  buttonRow: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "100%",
    // maxWidth: "575px",
    maxHeight: "24px",
    padding: 0,
    boxSizing: "border-box",
    marginTop: "-4px",
    marginBottom: "24px",
  },
  window: {
    // animation: "$rollout 0.4s",
    // transition: 'all 0.5s ease',
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
    // marginBottom: "24px",
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
    // padding: "16px 64px",
    padding: "16px 0",
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
    alignItems: "space-between",
    height: "10%",
    maxHeight: "48px",
    maxWidth: "100%",
    background:
      "linear-gradient(to bottom, rgba(94,94,94,0), rgba(94,94,94,1))",
    position: "absolute",
    bottom: 0,
    boxSizing: "border-box",
    padding: "4px 8px",
    borderBottomLeftRadius: "20px",
    borderBottomRightRadius: "20px",
  },
  buttonContainer: {
    maxWidth: "8%",
    minWidth: "5%",
    padding: "0 4px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  scrub: {
    flexGrow: 1,
    padding: "0 1%",
    display: "flex",
    alignItems: "center",
    width: "85%",
  },
  durationSlider: {
    color: "#FFFFFF",
    "& .MuiSlider-track": {
      border: "none",
      backgroundColor: "#FFFFFF",
      height: "4px",
    },
    "& .MuiSlider-thumb": {
      display: "none",
    },
    "& .MuiSlider-rail": {
      backgroundColor: "#FFFFFF",
      height: "4px",
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

  const smallScreen = useMediaQuery("(max-width:600px)");
  const largeScreen = useMediaQuery("(min-width:800px)");

  const singleAsset = featured?.data?.length < 2;
  const [activeIndex, setActiveIndex] = useState(0);

  // const [featuredUrl, setFeaturedUrl] = useState("");
  // const [thumbnailUrl, setThumbnailUrl] = useState("");
  const [creditsArr, setCreditsArr] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [animateDirection, setAnimateDirection] = useState("");

  // const [expanded, setExpanded] = useState(false);
  // const [playing, setPlaying] = useState(false);
  // const [volume, setVolume] = useState(1);
  // const [showControls, setShowControls] = useState(false);
  // const [showOverlay, setShowOverlay] = useState(true);
  // const [isLoaded, setIsLoaded] = useState(false);
  // const [videoDuration, setVideoDuration] = useState(0);
  // const [seeking, setSeeking] = useState(false);
  // const [played, setPlayed] = useState(false);

  useEffect(() => {
    // let featUrl = featured.data[0].attributes.url;
    // let thumbUrl =
    //   thumbnail && thumbnail.data && thumbnail.data.attributes
    //     ? thumbnail.data.attributes.url
    //     : "";
    // setFeaturedUrl(featUrl);
    // setThumbnailUrl(thumbUrl);

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

  const stepUp = () => {
    let newIndex = activeIndex;
    setAnimateDirection("Next");
    setIsVisible(false);
    if (activeIndex + 1 < featured.data.length) {
      setTimeout(() => {
        setActiveIndex(newIndex + 1);
        setIsVisible(true);
      }, 300);
    } else {
      setTimeout(() => {
        setActiveIndex(0);
        setIsVisible(true);
      }, 300);
    }
  };
  const stepDown = () => {
    let newIndex = activeIndex;
    setAnimateDirection("Prev");
    setIsVisible(false);
    if (activeIndex - 1 < 0) {
      setTimeout(() => {
        setActiveIndex(featured.data.length - 1);
        setIsVisible(true);
      }, 300);
    } else {
      setTimeout(() => {
        setActiveIndex(newIndex - 1);
        setIsVisible(true);
      }, 300);
    }
  };
  // useEffect(() => {
  //   if (playing) {
  //     setPlayed(true);
  //   }
  // }, [playing]);

  // const handleProgress = (changeState) => {
  //   if (changeState.played === 1) {
  //     setPlaying(false);
  //   }
  //   if (!seeking) {
  //     setVideoDuration(changeState.played);
  //   }
  // };

  // const onSeek = (e, newVal) => {
  //   setVideoDuration(parseFloat(newVal / 100));
  // };

  // const onSeekMouseDown = (e) => {
  //   setSeeking(true);
  // };

  // const onSeekMouseUp = (e, newVal) => {
  //   setSeeking(false);
  //   playerRef.current.seekTo(parseFloat(newVal / 100));
  // };

  // let containerEl = document.getElementById("container");
  // let playerEl = document.getElementById("player-wrapper");

  // useEffect(() => {
  //   handleExpand(expanded);
  // }, [expanded]);

  // const handleExpand = (expanded) => {
  //   if (expanded) {
  //     containerEl?.requestFullscreen();
  //   } else {
  //     document.exitFullscreen();
  //   }
  // };

  // useEffect(() => {
  //   const onFullscreenChange = () => {
  //     setExpanded(Boolean(document.fullscreenElement));
  //   };

  //   document.addEventListener("fullscreenchange", onFullscreenChange);

  //   return () =>
  //     document.removeEventListener("fullscreenchange", onFullscreenChange);
  // }, []);

  // const useWindowSize = () => {
  //   // let containerWidth = document.getElementById(
  //   //   `container-${activeIndex}`
  //   // )?.offsetWidth;
  //   // let playerWidth = document.getElementById(
  //   //   `player-wrapper-${activeIndex}`
  //   // )?.offsetWidth;
  //   // console.log(containerWidth, playerWidth);
  //   const [size, setSize] = useState([0, 0]);
  //   useLayoutEffect(() => {
  // let containerWidth = document.getElementById(
  //   `container-${activeIndex}`
  // )?.offsetWidth;
  // let playerWidth = document.getElementById(
  //   `player-wrapper-${activeIndex}`
  // )?.offsetWidth;
  //     const updateSize = () => {
  //       setSize([containerWidth, playerWidth]);
  //     };
  //     window.addEventListener("resize", updateSize);
  //     updateSize();
  //     return () => window.removeEventListener("resize", updateSize);
  //   }, []);
  //   return size;
  // };

  // const [contWidth, playWidth] = useWindowSize();

  // let containerWidth = document.getElementById(
  //   `container-${activeIndex}`
  // )?.offsetWidth;
  // let playerWidth = document.getElementById(
  //   `player-wrapper-${activeIndex}`
  // )?.offsetWidth;

  const [contWidth, setContWidth] = useState(0);
  const [playWidth, setPlayWidth] = useState(0);

  useEffect(() => {
    const updateSize = () => {
      let containerWidth = document.getElementById(
        `container-${activeIndex}`
      )?.offsetWidth;
      let playerWidth = document.getElementById(
        `player-wrapper-${activeIndex}`
      )?.offsetWidth;
      setContWidth(containerWidth);
      setPlayWidth(playerWidth);
    };
    window.addEventListener("resize", updateSize);
    updateSize();
    return () => window.removeEventListener("resize", updateSize);
  }, []);

  return (
    <div
      className={classes.root}
      style={{
        padding: largeScreen ? "84px 64px 0px 64px" : "84px 32px 0px 32px",
      }}
      id="pageRoot"
    >
      <ProjectItem
        classes={classes}
        isVisible={isVisible}
        animateDirection={animateDirection}
        featuredData={featured?.data?.[activeIndex]}
        thumbnail={thumbnail}
        index={activeIndex}
        endpoint={endpoint}
        singleAsset={singleAsset}
        isMobileTablet={smallScreen || isMobile}
      />
      {!singleAsset && (
        <div
          className={classes.buttonRow}
          style={{
            maxWidth: contWidth < playWidth ? contWidth : playWidth,
          }}
        >
          <Button
            sx={{
              fontSize: ".5rem",
              fontFamily: "Square721",
            }}
            onClick={stepDown}
          >
            PREVIOUS
          </Button>
          <Button
            sx={{
              fontSize: ".5rem",
              fontFamily: "Square721",
            }}
            onClick={stepUp}
          >
            NEXT
          </Button>
        </div>
      )}

      <Grid
        container
        className={classes.infoSection}
        direction="row"
        rowSpacing={0.5}
        columnSpacing={4}
        sx={{
          display: "flex",
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
              maxWidth: largeScreen ? "50%" : "90%",
              margin: "0 auto",
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
          margin: largeScreen ? "auto -64px 0 -64px" : "auto -32px 0 -32px",
        }}
      >
        <Footer />
      </div>
    </div>
  );
};

export default ProjectPageNew;
