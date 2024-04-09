import React, { useState, useEffect, useRef } from "react";
import ReactPlayer from "react-player/file";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";

import PlayCircleOutlinedIcon from "@mui/icons-material/PlayCircleOutlined";
import Slider from "@mui/material/Slider";
import PlayArrowIcon from "@mui/icons-material/PlayArrow";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";
import PauseIcon from "@mui/icons-material/Pause";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import VolumeOffIcon from "@mui/icons-material/VolumeOff";
import ReplayIcon from "@mui/icons-material/Replay";

export const ProjectItem = (props) => {
  const {
    classes,
    featuredData,
    thumbnail,
    index,
    endpoint,
    isVisible,
    animateDirection,
    singleAsset,
    isMobileTablet,
    isIos,
    expanded,
    setExpanded,
  } = props;

  const playerRef = useRef(null);

  const [featuredUrl, setFeaturedUrl] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState("");

  const [playing, setPlaying] = useState(false);
  const [volume, setVolume] = useState(1);
  const [showControls, setShowControls] = useState(false);
  const [showOverlay, setShowOverlay] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [videoDuration, setVideoDuration] = useState(0);
  const [seeking, setSeeking] = useState(false);
  const [played, setPlayed] = useState(false);

  const largeScreen = useMediaQuery("(min-width:600px)");

  const isSafari = /^((?!chrome|android).)*safari/i.test(navigator.userAgent);

  useEffect(() => {
    let featUrl = featuredData.attributes.url;
    let thumbUrl =
      thumbnail && thumbnail.data && thumbnail.data.attributes
        ? thumbnail.data.attributes.url
        : "";
    setFeaturedUrl(featUrl);
    setThumbnailUrl(thumbUrl);

    setExpanded(false);
    setPlaying(false);
    setShowControls(false);
    setShowOverlay(true);
    setIsLoaded(false);
    setVideoDuration(0);
    setSeeking(false);
    setPlayed(false);
  }, [featuredData]);

  useEffect(() => {
    if (playing) {
      setPlayed(true);
    }
  }, [playing]);

  const handleProgress = (changeState) => {
    if (changeState.played === 1) {
      setPlaying(false);
    }
    if (!seeking) {
      setVideoDuration(changeState.played);
    }
  };

  const onSeek = (e, newVal) => {
    setVideoDuration(parseFloat(newVal / 100));
  };

  const onSeekMouseDown = (e) => {
    setSeeking(true);
  };

  const onSeekMouseUp = (e, newVal) => {
    setSeeking(false);
    playerRef.current.seekTo(parseFloat(newVal / 100));
  };

  let containerEl = document.getElementById(`container-${index}`);
  let playerEl = document.getElementById(`player-wrapper-${index}`);

  useEffect(() => {
    handleExpand(expanded);
  }, [expanded]);

  const isFullScreen =
    !!document.fullscreenElement ||
    !!document.webkitFullscreenElement ||
    !!document.mozFullScreenElement ||
    document.fullScreen ||
    document.webkitIsFullScreen;

  const handleExpand = (doExpand) => {
    if (doExpand) {
      if (!isFullScreen) {
        if (containerEl?.requestFullscreen) {
          containerEl.requestFullscreen();
        } else if (containerEl?.mozRequestFullScreen) {
          containerEl.mozRequestFullScreen();
        } else if (containerEl?.webkitRequestFullscreen) {
          containerEl.webkitRequestFullscreen();
        } else if (containerEl?.webkitEnterFullscreen) {
          containerEl.webkitEnterFullscreen();
        }
      }
    } else {
      if (isFullScreen) {
        if (document?.exitFullscreen) {
          document.exitFullscreen();
        } else if (document?.webkitExitFullscreen) {
          document.webkitExitFullscreen();
        } else if (document?.mozCancelFullScreen) {
          document.mozCancelFullScreen();
        }
      }
    }
  };

  useEffect(() => {
    const onFullscreenChange = () => {
      setExpanded(Boolean(isFullScreen));
    };

    document.addEventListener(
      "webkitfullscreenchange mozfullscreenchange fullscreenchange",
      onFullscreenChange
    );
    return () =>
      document.removeEventListener(
        "webkitfullscreenchange mozfullscreenchange fullscreenchange",
        onFullscreenChange
      );
  }, []);

  const showClass =
    animateDirection == "Next" ? classes.showNext : classes.showPrev;
  const hideClass =
    animateDirection == "Next" ? classes.hideNext : classes.hidePrev;

  const isVideo = featuredData.attributes.mime.includes("video");

  const [transVal, setTransVal] = useState(0);

  const handleReady = (player) => {
    // Get the video element from the player instance
    setIsLoaded(true);
    if (isSafari) {
      const videoElement = player.getInternalPlayer();
      const contElement = document.getElementById(`container-${index}`);
      if (videoElement) {
        // Access the height of the video element
        const height = videoElement.clientHeight;
        const translateVal =
          -100 * ((height - contElement.offsetHeight) / 2 / height);
        setTransVal(translateVal);
      }
    }
  };

  return (
    <div
      className={classes.window}
      style={{
        marginBottom: singleAsset ? "24px" : 0,
        background: isFullScreen ? "#000000" : "#dde1e1",
        borderRadius: isFullScreen ? 0 : "20px",
      }}
      key={`container-${index}`}
      id={`container-${index}`}
      onMouseLeave={() => {
        isMobileTablet ? false : setShowControls(false);
      }}
      onClick={() => {
        isMobileTablet ? setShowControls(!showControls) : false;
      }}
      // onMouseEnter={() => !expanded && setShowControls(true)}
      // onMouseLeave={() => !expanded && setShowControls(false)}
      // onMouseEnter={() => playing && setShowOverlay(true)}
      // onMouseLeave={() => playing && setShowOverlay(false)}
    >
      {isVideo ? (
        <>
          <div
            className={`${classes.videoWrapper} ${
              singleAsset ||
              (animateDirection !== "Next" && animateDirection !== "Prev")
                ? ""
                : isVisible
                ? showClass
                : hideClass
            }`}
            onMouseEnter={() => {
              isMobileTablet ? false : setShowControls(true);
            }}
            onClick={() => {
              isMobileTablet ? setShowControls(!showControls) : false;
            }}
            style={{
              background: isFullScreen ? "#000000" : "#dde1e1",
              textAlign: "center",
              borderRadius: isFullScreen ? 0 : "20px",
            }}
            // onMouseEnter={() => !expanded && setShowControls(true)}
            // onMouseLeave={() => !expanded && setShowControls(false)}
            // onMouseEnter={() => playing && setShowOverlay(true)}
            // onMouseLeave={() => playing && setShowOverlay(false)}
            key={`player-wrapper-${index}`}
            id={`player-wrapper-${index}`}
          >
            <ReactPlayer
              ref={playerRef}
              className={"react-player"}
              id="videoFrame"
              style={{
                maxHeight: "100%",
                maxWidth: "100%",
                borderRadius: isFullScreen ? "0px" : "20px",
                overflow: "hidden",
                position: "absolute",
                top: 0,
                left: 0,
                "--tranYval": `${transVal}%`,
                alignContent: "center",
                height: "auto !important",
                width: "100% !important",
              }}
              url={`https://${endpoint}${featuredUrl}`}
              width={expanded ? "100%" : "100%"}
              height={expanded ? "auto" : "auto"}
              playing={playing}
              volume={volume}
              muted={volume === 0}
              playsinline
              // controls={showControls && played}
              config={{
                file: {
                  attributes: {
                    controlsList: "nodownload noplaybackrate",
                    disablePictureInPicture: true,
                  },
                },
              }}
              progressInterval={100}
              onProgress={handleProgress}
              // onReady={() => setIsLoaded(true)}
              onReady={handleReady}
            />

            {showOverlay && isLoaded && (
              <>
                <div className={classes.overlay}>
                  <Button
                    size="large"
                    style={{ color: "#dde1e1" }}
                    onClick={() => {
                      // setShowOverlay(!showOverlay);
                      // setPlaying(!playing);
                      setShowOverlay(false);
                      setPlaying(true);
                    }}
                  >
                    <Typography
                      sx={{
                        fontFamily: "Square721",
                        fontSize: "1rem",
                      }}
                    >
                      {/* {playing ? "PAUSE" : "PLAY"} */}
                      PLAY
                    </Typography>
                  </Button>
                </div>
                {!played && thumbnailUrl !== "" && (
                  <img
                    className={classes.thumbnail}
                    src={`https://${endpoint}${thumbnailUrl}`}
                  />
                )}
              </>
            )}
          </div>
          {showControls && !showOverlay /*&& !expanded*/ && (
            <div
              className={classes.controls}
              style={{
                borderBottomLeftRadius: isFullScreen ? 0 : "20px",
                borderBottomRightRadius: isFullScreen ? 0 : "20px",
                width:
                  containerEl?.offsetWidth < playerEl?.offsetWidth
                    ? containerEl?.offsetWidth
                    : playerEl?.offsetWidth,
              }}
            >
              <div className={classes.buttonContainer}>
                <Button
                  onClick={() => setPlaying(!playing)}
                  className={classes.playPauseButton}
                >
                  {playing ? (
                    <PauseIcon fontSize="medium" style={{ color: "#dde1e1" }} />
                  ) : videoDuration === 1 ? (
                    <ReplayIcon
                      fontSize="medium"
                      style={{ color: "#dde1e1" }}
                    />
                  ) : (
                    <PlayArrowIcon
                      fontSize="medium"
                      style={{ color: "#dde1e1" }}
                    />
                  )}
                </Button>
              </div>
              <div className={classes.scrub}>
                <Slider
                  step={1}
                  value={videoDuration * 100}
                  className={classes.durationSlider}
                  onChange={onSeek}
                  onMouseDown={onSeekMouseDown}
                  onChangeCommitted={onSeekMouseUp}
                />
              </div>
              <div className={classes.buttonContainer}>
                <Button
                  className={classes.volume}
                  onClick={() => setVolume(volume === 1 ? 0 : 1)}
                >
                  {volume === 1 ? (
                    <VolumeUpIcon
                      fontSize="small"
                      style={{ color: "#dde1e1" }}
                    />
                  ) : (
                    <VolumeOffIcon
                      fontSize="small"
                      style={{ color: "#dde1e1" }}
                    />
                  )}
                </Button>
              </div>
              {!isIos && (
                <div className={classes.buttonContainer}>
                  <Button
                    className={classes.fullScreen}
                    onClick={() => setExpanded(!expanded)}
                  >
                    <FullscreenIcon
                      fontSize="small"
                      style={{ color: "#dde1e1" }}
                    />
                  </Button>
                </div>
              )}
            </div>
          )}
        </>
      ) : (
        <img
          style={{
            height: "100%",
            width: "auto",
            marginLeft: "auto",
            marginRight: "auto",
            overflow: "hidden",
            borderRadius: "20px",
            // maxHeight: '100%',
            maxWidth: "100%",
          }}
          className={`${isVisible ? showClass : hideClass}`}
          src={`https://${endpoint}${featuredData.attributes.url}`}
          alt={featuredData.attributes.name}
        />
      )}
    </div>
  );
};

export default ProjectItem;
