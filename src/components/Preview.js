import React, { useState, useEffect, useContext } from "react";
import ReactPlayer from "react-player/file";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles((theme) => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "100vh",
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    padding: useMediaQuery("(min-width: 600px)") ? "120px 64px" : "0px",
  },
  wrapper: {
    height: "100%",
    minWidth: "100%",
    aspectRatio: 16 / 9,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    transition: "width .75s",
    cursor: "pointer",
  },
  window: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all .5s",
    justifyContent: useMediaQuery("(min-width: 600px)") ? "" : "flex-start",
    paddingTop: useMediaQuery("(min-width: 600px)") ? "0" : "80px",
    position: "relative",
    height: "100%",
    width: "100%",
  },
  cont: {
    height: useMediaQuery("(min-width:600px)") ? "100%" : "75%",
    width: "85%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: "40px",
    boxSizing: "border-box",
  },
  subtitle: {
    marginTop: "8px",
    position: "absolute",
    bottom: 0,
    flexGrow: 1,
    width: "85%",
    maxWidth: "85%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: useMediaQuery("(min-width: 600px)")
      ? "space-evenly"
      : "center",
    transition: "display 1s",
  },
  smallSubtitle: {
    position: "absolute",
    bottom: 50,
    width: "100%",
    maxWidth: "100%",
    textAlign: "center",
  },
}));

const endpoint = process.env.REACT_APP_STRAPIURL;

export const Preview = (props) => {
  const { data, index, options, playOptions } = props;
  const classes = useStyles();
  const navigate = useNavigate();
  const { state, api } = useContext(AppContext);
  const { videoMap, loadedVids } = state;
  const { setLoadedVids } = api;

  const [previewUrl, setPreviewUrl] = useState("");

  const { projectName, name, role, client, director, code, featured, preview } =
    data;

  const [showSubtitle, setShowSubtitle] = useState(false);

  const [playing, setPlaying] = useState(false);

  useEffect(() => {
    let observer = new IntersectionObserver(doGrow, options);
    let playObserver = new IntersectionObserver(togglePlay, playOptions);
    let target = document.getElementById(`window-${name}`);
    playObserver.observe(target);
    if (!largeScreen) {
      observer.observe(target);
    }
    return () => {
      observer.unobserve(target);
      playObserver.unobserve(target);
    };
  }, []);

  function togglePlay(entry) {
    if (entry[0].isIntersecting) {
      setPlaying(true);
    } else {
      setPlaying(false);
    }
  }
  useEffect(() => {
    let prevUrl =
      preview && preview.data && preview.data.attributes
        ? preview.data.attributes.url
        : featured.data.attributes.url;
    setPreviewUrl(prevUrl);

  }, []);



  const switchView = () => {
    navigate(`project/${data.name}`);
  };

  const largeScreen = useMediaQuery("(min-width:600px)");

  function growTimer(container, wind) {
    wind.style.paddingTop = "80px";
    // container.style.transition = "width .75s, height .5s";
    container.style.transition = "all .5s ease-in-out";
    container.style.width = "95%";
    container.style.height = "95%";
    container.style.borderRadius = "10px";
  }

  function doGrow(entry) {
    let container = document.getElementById(`container-${name}`);
    let wind = document.getElementById(`window-${name}`);
    if (entry[0].isIntersecting) {
      let container = document.getElementById(`container-${name}`);
      let wind = document.getElementById(`window-${name}`);
      this.grow = setTimeout(() => growTimer(container, wind), 500);
    } else {
      clearTimeout(this.grow);
      wind.style.paddingTop = "80px";
      container.style.width = "85%";
      container.style.height = "75%";
      container.style.borderRadius = "40px";
    }
  }

  useEffect(() => {
    if (largeScreen) {
      let container = document.getElementById(`container-${name}`);
      let element = document.getElementById(`featured-${name}`);
      if (element) {
        if (showSubtitle) {
          container.style.transitionDuration = ".5s, 1s";
          container.style.transitionDelay = "0ms, 150ms";
          container.style.transitionProperty = "height, transform";
          container.style.height = "calc(100% - 32px)";
          // container.style.width = "100%";
          // container.style.transition = 'transform 1s';
          container.style.transform = `scale(${100 / 85}, 1)`;
          element.style.transition = "transform 1s";
          element.style.transform = `scale(1, ${100 / 85})`;
          // setTimeout(() => growTimerLarge(container), 2000);
        } else {
          // container.style.transitionDelay = "0ms, 0ms";
          // container.style.transitionProperty = "height, width";
          // container.style.minWidth = "85%";
          container.style.height = "100%";
          container.style.transform = "scale(1, 1)";
          element.style.transform = "scale(1, 1)";
        }
      }
    }
  }, [showSubtitle, largeScreen]);

  return (
    <div className={classes.root}>
      <div className={classes.window} id={`window-${name}`}>
        <div className={classes.cont} id={`container-${name}`}>
          <div
            id={`featured-${name}`}
            className={classes.wrapper}
            onMouseEnter={() => setShowSubtitle(true)}
            onMouseLeave={() => setShowSubtitle(false)}
            onClick={switchView}
          >
            <ReactPlayer
              id={`videoFrame-${name}`}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                // width: '100%',
                // borderRadius: "40px",
                // overflow: "hidden",
                position: "absolute",
                top: 0,
                left: -1,
                // right: ,
                alignContent: "center",
                // background: "transparent",
              }}
              url={
                videoMap[name]
                  ? videoMap[name]
                  : `http://${endpoint}${previewUrl}`
              }
              width="100%"
              height="auto"
              playing={playing}
              loop
              muted
              onReady={() => {
                let vids = [...loadedVids];
                if (!vids.includes(name)) {
                  vids.push(name);
                  setLoadedVids([...vids]);
                }
              }}
            />
            {!largeScreen && (
              <div
                className={classes.smallSubtitle}
                style={{ textAlign: "center" }}
              >
                <Typography
                  color="primary"
                  style={{
                    fontFamily: "Square721",
                    fontSize: largeScreen ? ".75rem" : ".6rem",
                  }}
                >
                  {projectName.toUpperCase()}
                </Typography>
              </div>
            )}
          </div>
        </div>
        {showSubtitle && largeScreen && (
          <div className={classes.subtitle}>
            <Typography
              color="primary"
              style={{
                fontFamily: "Square721",
                fontSize: largeScreen ? ".75rem" : ".6rem",
              }}
            >
              {projectName.toUpperCase()}
            </Typography>
            {largeScreen && (
              <Typography
                color="primary"
                style={{
                  fontFamily: "Square721",
                  fontSize: largeScreen ? ".75rem" : ".6rem",
                }}
              >
                {role.toUpperCase()}
              </Typography>
            )}
            {largeScreen && (
              <Typography
                color="primary"
                style={{
                  fontFamily: "Square721",
                  fontSize: largeScreen ? ".75rem" : ".6rem",
                }}
              >
                {director.toUpperCase()}
              </Typography>
            )}
            {largeScreen && (
              <Typography
                color="primary"
                style={{
                  fontFamily: "Square721",
                  fontSize: largeScreen ? ".75rem" : ".6rem",
                }}
              >
                {code.toUpperCase()}
              </Typography>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
