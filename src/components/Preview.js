import React, { useState, useEffect, useContext, useRef } from "react";
import ReactPlayer from "react-player/file";
import makeStyles from "@mui/styles/makeStyles";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import AppContext from "../context/AppContext";
import { useNavigate } from "react-router-dom";

const useStyles = makeStyles(() => ({
  root: {
    display: "flex",
    flexDirection: "column",
    height: "85vh",
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    boxSizing: "border-box",
    // padding: useMediaQuery("(min-width: 600px)") ? "120px 64px" : "0px",
  },
  wrapper: {
    height: "100%",
    minHeight: "100%",
    minWidth: "100%",
    aspectRatio: 16 / 9,
    position: "relative",
    alignItems: "center",
    justifyContent: "center",
    transition: "width .75s",
    cursor: "pointer",
    willChange: "transform",
    transform: "translate3d(0, 0, 0)",
  },
  window: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    transition: "all .5s",
    // justifyContent: useMediaQuery("(min-width: 600px)") ? "" : "flex-start",
    // paddingTop: useMediaQuery("(min-width: 600px)") ? "0" : "80px",
    position: "relative",
    height: "100%",
    width: "100%",
    willChange: "transform",
    transform: "translate3d(0, 0, 0)",
  },
  cont: {
    // height: useMediaQuery("(min-width:600px)") ? "100%" : "75%",
    width: "85%",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    overflow: "hidden",
    borderRadius: "20px",
    boxSizing: "border-box",
    willChange: "transform",
    transform: "translate3d(0, 0, 0)",
  },
  subtitle: {
    marginTop: "0px",
    position: "absolute",
    bottom: "14px",
    flexGrow: 1,
    width: "100%",
    maxWidth: "100%",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    // justifyContent: useMediaQuery("(min-width: 600px)")
    //   ? "space-between"
    //   : "center",
    transition: "display 12s",
  },
  smallSubtitle: {
    position: "relative",
    marginTop: 12,
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

  const largeScreen = useMediaQuery("(min-width:600px)");

  const {
    projectName,
    name,
    role,
    client,
    roles,
    director,
    code,
    featured,
    preview,
  } = data;

  const [showSubtitle, setShowSubtitle] = useState(false);
  const [growFinished, setGrowFinished] = useState(false);

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
        : featured.data[0].attributes.url;
    setPreviewUrl(prevUrl);
  }, []);

  const switchView = () => {
    navigate(`project/${data.name}`);
  };

  function growTimer(container, wind) {
    // container.style.transition = "width .75s, height .5s";
    const animate = () => {
      wind.style.paddingTop = index === 0 ? "0px" : "80px";
      container.style.transition = "all .5s ease-in-out";
      container.style.width = "95%";
      container.style.height = "95%";
      container.style.borderRadius = "40px";
    };

    window.requestAnimationFrame(animate);
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
      const animateReset = () => {
        wind.style.paddingTop = index === 0 ? "0px" : "80px";
        container.style.width = "85%";
        container.style.height = "75%";
        container.style.borderRadius = "40px";
      };
      window.requestAnimationFrame(animateReset);
    }
  }

  const subtitleTimer = useRef(null);

  useEffect(() => {
    if (largeScreen) {
      let container = document.getElementById(`container-${name}`);
      let element = document.getElementById(`featured-${name}`);
      if (element) {
        if (showSubtitle) {
          const grow = () => {
            container.style.transitionDuration = ".5s, 1s";
            container.style.transitionDelay = "0ms, 300ms";
            container.style.transitionProperty = "height, transform";
            container.style.height = "calc(100% - 32px)";
            // container.style.width = "100%";
            // container.style.transition = 'transform 1s';
            container.style.transform = `scale(${100 / 85}, 1)`;
            element.style.transition = "transform 1s";
            element.style.transform = `scale(1, ${100 / 85})`;
          };

          window.requestAnimationFrame(grow);
          subtitleTimer.current = setTimeout(() => setGrowFinished(true), 1000);
        } else {
          const shrink = () => {
            // container.style.transitionDelay = "0ms, 0ms";
            // container.style.transitionProperty = "height, width";
            // container.style.minWidth = "85%";
            clearTimeout(subtitleTimer.current);
            setGrowFinished(false);
            container.style.height = "100%";
            container.style.transform = "scale(1, 1)";
            element.style.transform = "scale(1, 1)";
          };
          window.requestAnimationFrame(shrink);
        }
      }
    }
  }, [showSubtitle, largeScreen]);

  const parentRef = useRef(null);

  // const [parentHeight, setParentHeight] = useState(0);
  // const [videoHeight, setVideoHeight] = useState(0);

  // useEffect(() => {
  //   // Get the height of the parent element
  //   if (parentRef.current) {
  //     console.log(parentRef.current.offsetHeight);
  //     console.log("calculated parentHeight: ");
  //     setParentHeight(parentRef.current.clientHeight);
  //   }
  // }, []);

  const [transVal, setTransVal] = useState(0);

  const handleReady = (player) => {
    // Get the video element from the player instance
    if (largeScreen) {
      const videoElement = player.getInternalPlayer();
      if (videoElement) {
        // Access the height of the video element
        const height = videoElement.videoHeight;
        const width = videoElement.videoWidth;
        // console.log(
        //   "parent ref height: ",
        //   parentRef.current.wrapper.offsetHeight
        // );
        // console.log(
        //   "parent ref width: ",
        //   parentRef.current.wrapper.offsetWidth
        // );
        // console.log("video width: ", width);
        // console.log("video height: ", height);
        const actualVidHeight =
          (width * parentRef.current.wrapper.offsetHeight) /
          parentRef.current.wrapper.offsetWidth;
        // console.log("video ", name, "actual height: ", actualVidHeight);
        const translateVal =
          -100 *
          ((actualVidHeight - parentRef.current.wrapper.offsetHeight) /
            4 /
            actualVidHeight);
        // const translateVal = -(actualVidHeight - parentRef.current.wrapper.offsetHeight)/2;
        // console.log("translate Percent: ", translateVal);
        // setVideoHeight(height);
        setTransVal(translateVal);
      }
    }
  };

  return (
    <div
      className={classes.root}
      style={{
        padding: largeScreen ? "120px 64px" : "0px",
        height: !largeScreen && index === 0 ? "calc(85vh - 80px)" : "85vh",
      }}
      id={`root-${name}`}
    >
      <div
        className={classes.window}
        style={{
          justifyContent: largeScreen ? "" : "flex-start",
          paddingTop: largeScreen ? "0" : index === 0 ? 0 : "80px",
        }}
        id={`window-${name}`}
      >
        <div
          className={classes.cont}
          style={{
            height: largeScreen ? "100%" : "75%",
          }}
          id={`container-${name}`}
        >
          <div
            id={`featured-${name}`}
            className={classes.wrapper}
            onMouseEnter={() => setShowSubtitle(true)}
            //onMouseEnter={() => setTimeout(() => {setShowSubtitle(true)} ,2000)}
            onMouseLeave={() => setShowSubtitle(false)}
            onClick={switchView}
          >
            <ReactPlayer
              id={`videoFrame-${name}`}
              className={"react-player"}
              ref={parentRef}
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                borderRadius: "20px",
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
                "--tranYval": `${transVal}%`,
                alignContent: "center",
              }}
              url={
                videoMap[name]
                  ? videoMap[name]
                  : `https://${endpoint}${previewUrl}`
              }
              width="100%"
              height="auto"
              playing={playing}
              loop
              muted
              playsinline
              // onReady={() => {
              //   let vids = [...loadedVids];
              //   if (!vids.includes(name)) {
              //     vids.push(name);
              //     setLoadedVids([...vids]);
              //   }
              // }}
              onReady={handleReady}
            />
          </div>
        </div>
        {!largeScreen && (
          <div
            className={classes.smallSubtitle}
            style={{ textAlign: "center" }}
          >
            <Typography
              color="primary"
              style={{
                fontFamily: "Square721",
                fontSize: largeScreen ? ".7rem" : ".55rem",
              }}
            >
              {projectName?.toUpperCase()}
            </Typography>
          </div>
        )}
        {showSubtitle && largeScreen && growFinished && (
          <div
            className={classes.subtitle}
            style={{
              justifyContent: largeScreen ? "space-between" : "center",
            }}
          >
            <Typography
              color="primary"
              style={{
                fontFamily: "Square721",
                fontSize: largeScreen ? ".7rem" : ".55rem",
              }}
            >
              {projectName?.toUpperCase()}
            </Typography>
            {largeScreen && (
              <Typography
                color="primary"
                style={{
                  fontFamily: "Square721",
                  fontSize: largeScreen ? ".7rem" : ".55rem",
                }}
              >
                {role?.toUpperCase()}
              </Typography>
            )}
            {largeScreen && !!roles && (
              <Typography
                color="primary"
                style={{
                  fontFamily: "Square721",
                  fontSize: largeScreen ? ".7rem" : ".55rem",
                }}
              >
                {roles?.toUpperCase()}
              </Typography>
            )}
            {largeScreen && (
              <Typography
                color="primary"
                style={{
                  fontFamily: "Square721",
                  fontSize: largeScreen ? ".7rem" : ".55rem",
                }}
              >
                {code?.toUpperCase()}
              </Typography>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Preview;
